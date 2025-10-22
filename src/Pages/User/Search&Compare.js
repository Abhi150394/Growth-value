import React, { useEffect, useMemo, useRef, useState } from "react";
import "../../Assests/Styles/searchCompare.css";
import {
  Menu,
  Row,
  Col,
  Checkbox,
  Pagination,
  Empty,
  theme,
  Select,
  Flex,
  Popover,
  notification,
} from "antd";
import { FiFilter } from "react-icons/fi";
import { getSearchResultData, getSearchResults, getSearchSpecialResults } from "../../API/search";
import { createWishlist, deleteWishlist } from "../../API/wishlist";
import OrderModal from "../../Components/Common/orderModal/OrderModal";
import ProductCard from "../../Components/Cards/ProductCard/ProductCard";
import CustomModal from "../../Components/Controls/CustomModal";
import SkeltonCard from "../../Components/Cards/SkeltonCard/SkeltonCard";
import HoverButton from "../../Components/Controls/HoverButton";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import TranslatedText from "../../Components/Controls/TranslatedText";

const SearchandCompare = ({ userToken, search, setSearch, userData }) => {

  const [sortBy, setSortBy] = useState("Newest");
  const [brandFilters, setBrandFilters] = useState([]);
  const [vendorFilters, setVendorFilters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  const navigate = useNavigate()

  const { token } = theme.useToken()

  const isDesktop = useMediaQuery({ minWidth: 768 })

  const paid = userData.paid;

  const items = [
    {
      label: <TranslatedText>Newest</TranslatedText>,
      key: 1,
    },
    {
      label: <TranslatedText>Name (A - Z)</TranslatedText>,
      key: 2,
    },
    {
      label: <TranslatedText>Price (low - high)</TranslatedText>,
      key: 3,
    },
    {
      label: <TranslatedText>Price (high - low)</TranslatedText>,
      key: 4,
    },
  ];
  const [vendorOptions, setVendorOptions] = useState([]);
  const [brandOptions, setBrandOptions] = useState([]);
  const [savedProduct, setSavedProduct] = useState([]);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({});
  const containerRef = useRef(null);
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistLoader, setWishlistLoader] = useState({})

  useEffect(() => {
    setBrandFilters([]);
    setVendorFilters([]);
    const func = async () => {
      setLoading(true);
      if (search.trim() !== '') {
        const res = await getSearchResults({ search: search }, userToken);
        setData(res?.data?.results?.results);
        setVendorOptions(res?.data?.results?.vendors);
        setBrandOptions(res?.data?.results?.brands);
        setSavedProduct(res?.data?.results?.saved_products)
        setTotal(res?.data?.count);
        setCurrent(1)
      }
      else {
        const res = await getSearchResultData(userToken, 1)
        setData(res?.data?.results?.results);
        setVendorOptions(res?.data?.results?.vendors);
        setBrandOptions(res?.data?.results?.brands);
        setSavedProduct(res?.data?.results?.saved_products)
        setTotal(res?.data?.count);
        setCurrent(1)
      }

      setLoading(false);
    };
    func();
  }, [search]);

  const sortedProducts = useMemo(() => {
    return data.sort((a, b) => {
      if (a.vendor < b.vendor) return -1;
      if (a.vendor > b.vendor) return 1;
      if (a.product_name < b.product_name) return -1;
      if (a.product_name > b.product_name) return 1;
      return 0;
    });
  }, [data])

  const getProducts = async (brand, vendor) => {
    setLoading(true)
    const res = await getSearchSpecialResults(
      { search: search, brand: brand, vendor: vendor },
      userToken,
      1,
    );
    if (res?.status === 200) {
      setCurrent(1)
      setData(res?.data?.results?.results);
      setTotal(res?.data?.count);
    }
    setLoading(false)
  }

  const onChange = async (page) => {
    setLoading(true)
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
    setLoading(false)
  };

  const handleAddToWishlist = async (index) => {
    setWishlistLoader((prev) => ({ ...prev, [index]: true }))
    const res = await createWishlist(userToken, { product: index });

    if (res.status === 200) {
      setSavedProduct([...savedProduct, index])
      api.success({
        message: <TranslatedText>Product added to wishlist</TranslatedText>,
      })
      setWishlistLoader((prev) => ({ ...prev, [index]: false }))
    }
  };

  const handleRemoveItem = async (index) => {
    const newData = [...data];
    const item = { ...data?.[index], is_deleted: true };
    let updateSaveData = savedProduct.filter((i) => i !== item.id)
    setWishlistLoader((prev) => ({ ...prev, [item.id]: true }))
    const res = await deleteWishlist(userToken, item);
    if (res?.status === 200) {
      newData.splice(index, 1);
      setProduct(newData);
      setSavedProduct(updateSaveData)
      api.success({
        message: <TranslatedText>Product removed from wishlist</TranslatedText>,
      })
      setWishlistLoader((prev) => ({ ...prev, [item.id]: false }))
    }
    else {
      api.error({
        message: <TranslatedText>Something went wrong</TranslatedText>,
        description: <TranslatedText>Please try again!</TranslatedText>,
      })
    }
    setWishlistLoader((prev) => ({ ...prev, [item.id]: false }))
  };

  const handleMarkOrdered = (e) => {
    setProduct(e);
    setOpen(true);
  };

  const handleViewProduct = (e) => {
    window.open(e, "_blank");
  };

  const handleMenuClick = (e) => {
    setSortBy(e.item.props.children);
  };

  const handleBrandFilterChange = async (checkedValues) => {
    setBrandFilters(checkedValues);
    await getProducts(checkedValues, vendorFilters)
  };

  const handleVendorFilterChange = async (checkedValues) => {
    setVendorFilters(checkedValues);
    await getProducts(brandFilters, checkedValues)
  };

  const handleFilterIconClick = () => {
    showModal()
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    await getProducts(brandFilters, vendorFilters)
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {items?.map((item) => (
        <Menu.Item key={item.key}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const checkBoxStyles = {
    display: "grid",
    gridTemplateColumns: isDesktop ? "repeat(2,1fr)" : "repeat(1,1fr)",
    gap: "10px",
    justifyContent: "flex-start",
    alignItems: "center",
  }

  const contentStyle = {
    height: "400px",
    overflow: "hidden",
    overflowY: "scroll",
  }

  const Content = () => {
    return <Row gutter={[16, 16]} style={contentStyle}>
      <Col span={12} className="filter-group">
        <h4><TranslatedText>Brands</TranslatedText></h4>
        <Checkbox.Group
          options={brandOptions.filter(item => !item == "")}
          onChange={handleBrandFilterChange}
          value={brandFilters}
          style={checkBoxStyles}
        />
      </Col>
      <Col span={12} className="filter-group">
        <h4><TranslatedText>Vendors</TranslatedText></h4>
        <Checkbox.Group
          options={vendorOptions}
          onChange={handleVendorFilterChange}
          value={vendorFilters}
          style={checkBoxStyles}
        />
      </Col>
    </Row>
  }

  const emptyBox = {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  }

  const popStyle = {
    maxWidth: isDesktop ? "500px" : "500px",
  }

  return <>
    {contextHolder}
    <div className="search-compare" ref={containerRef}>
      <div className="page-head">
        <Popover placement="bottomLeft" content={Content} trigger='hover' overlayStyle={{ maxWidth: isDesktop ? '80%' : "100%", minWidth: isDesktop ? '45%' : "60%" }} >
          <span >
            <FiFilter style={{ marginTop: '6px' }} />
          </span>
          <span><TranslatedText>Filters</TranslatedText></span>
        </Popover>
      </div>

      <div className="body-content">

        <div className="card-container" id="products">
          {!loading ? (<Row gutter={[16, 16]}>
            {data?.length > 0 ? <>
              {sortedProducts?.map((item, index) => (
                <Col key={index} xs={24} sm={12} md={paid ? 8 : 6} lg={12} xl={paid ? 8 : 6} xxl={paid ? 8 : 6}>
                  <ProductCard paid={paid} type='add' wishlistLoader={wishlistLoader} savedProduct={savedProduct} item={item} index={index} handleAddToWishlist={handleAddToWishlist} handleRemoveItem={handleRemoveItem} handleViewProduct={handleViewProduct} handleMarkOrdered={handleMarkOrdered} />
                </Col>
              ))}
            </> : <div style={emptyBox}> <Empty
              description={
                <span>
                  <TranslatedText>No data Found</TranslatedText>
                </span>
              }
            /> </div>}
          </Row>) : (<Row gutter={[16, 16]} className="plan-cards-container">
            <SkeltonCard avatar={false} image={true} count={data?.length} loading={loading} />
          </Row>)}

          {(data?.length > 0 && paid) && <div style={{ marginLeft: "auto", marginRight: "auto", width: "fit-content", marginTop: "20px", marginBottom: "20px" }}>
            <Pagination
              current={current}
              pageSize={50}
              pageSizeOptions={[50]}
              onChange={onChange}
              total={total}
            />
          </div>}
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

      {/* {isModalOpen && <CustomModal
        open={isModalOpen}
        title={<TranslatedText>Filter by:</TranslatedText>}
        handleCancel={handleCancel}
        handleOk={handleOk}
        content={<Content />}
      />} */}

    </div >  </>
};

export default SearchandCompare;
