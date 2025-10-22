import { Alert, Button, Col, Flex, Input, Pagination, Row, theme } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import ProductCard from '../../Components/Cards/ProductCard/ProductCard';
import HoverButton from '../../Components/Controls/HoverButton';
import OrderModal from '../../Components/Common/orderModal/OrderModal';
import { useNavigate } from 'react-router-dom';
import { getDemoData, getSearchDemoData, getSearchSpecialResults } from '../../API/search';
import { createWishlist } from '../../API/wishlist';
import SkeltonCard from '../../Components/Cards/SkeltonCard/SkeltonCard';
import { useMediaQuery } from 'react-responsive';
import { IoMdArrowRoundBack } from "react-icons/io";
import TranslatedText from "../../Components/Controls/TranslatedText"; 

const Demo = ({ userToken, userData }) => {
    const [brandFilters, setBrandFilters] = useState([]);
    const [vendorFilters, setVendorFilters] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const { token } = theme.useToken();

    const paid = userData.paid;
    const isDesktop = useMediaQuery({ minWidth: 768 });
    const inputRef = useRef(null);

    const [vendorOptions, setVendorOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [product, setProduct] = useState({});
    const containerRef = useRef(null);
    const [current, setCurrent] = useState(1);
    const [total, setTotal] = useState(1);

    useEffect(() => {
        setBrandFilters([]);
        setVendorFilters([]);
        const func = async () => {
            setLoading(true);

            const res = await getDemoData(userToken, 1);
            console.log("res: ", res);
            setData(res.data);
            setVendorOptions(res?.data?.results?.vendors);
            setBrandOptions(res?.data?.results?.brands);
            setTotal(res?.data?.count);
            setCurrent(1);
            setLoading(false);
        };
        func();
        inputRef.current.focus();
    }, []);

    const getProducts = async (e) => {
        if (e.key === 'Enter') {
            if (search !== '') {
                setLoading(true);
                const res = await getSearchDemoData(userToken, { search: search });
                if (res?.status === 200) {
                    setCurrent(1);
                    setData(res?.data);
                }
                setLoading(false);
                inputRef.current.focus();
            }
        }
    };

    const onChange = async (page) => {
        console.log(page);
        setLoading(true);
        const res = await getSearchSpecialResults(
            { search: search, brand: brandFilters, vendor: vendorFilters },
            userToken,
            page,
        );
        if (res?.status === 200) {
            setData(res?.data?.results?.results);
            setTotal(res?.data?.count);
            setCurrent(page);
        }
        setLoading(false);
    };

    const handleAddToWishlist = async (index) => {
        console.log(index);
        const res = createWishlist(userToken, { product: index });
        console.log(res?.data);
    };

    const handleMarkOrdered = (e) => {
        setProduct(e);
        setOpen(true);
    };

    const handleViewProduct = (e) => {
        if (paid) {
            window.open(e, "_blank");  
        } else {
            navigate("/plans"); 
        }
    };

    const subscribe = { marginTop: "15px", backgroundColor: token.colorPrimary, color: token.colorBgLayout };

    const button = {
        marginBottom: "0px",
        cursor: "pointer",
        width: "2%",
    };

    const back = () => {
        navigate("/plans");
    };

    return (
        <div className="search-compare" ref={containerRef}>
            <div className="body-content">
                <div className="card-container" id="products">
                    <Flex justify='space-between' vertical gap='small'>
                        <Flex justify='space-between'>
                            <div style={button} onClick={back}>
                                <IoMdArrowRoundBack size={25} />
                            </div>
                            <div>
                                <Input
                                    placeholder="Search"
                                    onChange={(e) => setSearch(e.target.value.trim())}
                                    onKeyPress={getProducts}
                                    ref={inputRef}
                                />
                            </div>
                        </Flex>
                        <div>
                            <Alert
                                message={<TranslatedText>Subscription Required</TranslatedText>}
                                description={<TranslatedText>Please subscribe to have more features!</TranslatedText>}
                                type="warning"
                                showIcon
                                closable
                            />
                        </div>
                    </Flex>
                    <br />
                    {!loading ? (
                        <Row gutter={[16, 16]}>
                            {data.map((item, index) => (
                                <Col xs={24} sm={12} md={paid ? 8 : 6} lg={12} xl={paid ? 8 : 6} xxl={paid ? 8 : 6} key={index}>
                                    <ProductCard
                                        paid={paid}
                                        type='none'
                                        item={item}
                                        index={index}
                                        handleRemoveItem={handleAddToWishlist}
                                        handleViewProduct={handleViewProduct}
                                        handleMarkOrdered={handleMarkOrdered}
                                    />
                                </Col>
                            ))}
                        </Row>
                    ) : (
                        <Row gutter={[16, 16]} className="plan-cards-container">
                            <SkeltonCard avatar={false} image={true} count={6} loading={loading} />
                        </Row>
                    )}

                    {(data?.length > 0 && paid) && (
                        <div style={{ marginLeft: "auto", marginRight: "auto", width: "fit-content", marginTop: "20px", marginBottom: "20px" }}>
                            <Pagination
                                current={current}
                                pageSize={50}
                                pageSizeOptions={[50]}
                                onChange={onChange}
                                total={total}
                            />
                        </div>
                    )}

                    {(!paid && !loading) ? (
                        <HoverButton onClick={() => navigate("/account/subscription")} style={subscribe}>
                            <TranslatedText>Subscribe for more</TranslatedText>
                        </HoverButton>
                    ) : null}
                </div>
            </div>
            {open && (
                <OrderModal
                    open={open}
                    setOpen={setOpen}
                    product={product}
                    userToken={userToken}
                />
            )}
        </div>
    );
};

export default Demo;
