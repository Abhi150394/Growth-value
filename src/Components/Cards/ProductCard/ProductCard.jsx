import "../../../Assests/Styles/productcard.css";
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { Button, Card, Divider, Popconfirm, Spin, Tooltip, theme } from 'antd';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import HoverButton from "../../Controls/HoverButton";
import { BrandIcon, VendorIcon } from "../../Controls/Icons";
import { FaEuroSign } from "react-icons/fa";
import TranslatedText from "../../Controls/TranslatedText"; // Adjust the import path accordingly

const ProductCard = (props) => {
    const { item, type, index, handleMarkOrdered, handleViewProduct, handleRemoveItem, handleAddToWishlist, paid, savedProduct, wishlistLoader } = props;
    const isDesktop = useMediaQuery({ minWidth: 992 });
    const { token } = theme.useToken();
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const imageStyle = {
        mixBlendMode: "multiply",
        height: "200px",
        width: "auto",
        objectFit: "contain",
        maxWidth: "200px"
    };

    const imageBox = {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const ProductTitle = {
        color: "#403A3A",
        display: "-webkit-box",
        overflow: "hidden",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 1,
        lineClamp: 1,
        fontSize: isDesktop ? 16 : 14,
        fontWeight: 700,
        width: "100%",
    };

    const PriceTag = {
        color: token.colorPrimary,
        overFlow: "hidden",
        textOverflow: 'ellipsis',
        fontSize: isDesktop ? 18 : 16,
        fontWeight: 700,
        filter: !paid ? "blur(4px)" : "none"
    };

    const relativPrice = {
        filter: !paid ? "blur(4px)" : "none"
    };

    const priceBox = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    };

    const label = {
        fontWeight: 500,
        marginRight: "5px",
        fontSize: isDesktop ? 14 : 12,
        color: "#000",
        marginLeft: "5px",
    };

    const IconBox = {
        height: "25px",
        width: "25px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: token.colorPrimary,
        borderRadius: "8px",
        cursor: "pointer",
        transition: "background 0.3s ease-in-out",
    };

    const DetailBox = {
        display: "flex",
        flexDirection: 'column',
        justifyContent: "flex-start",
        alignItems: "flex-start",
        rowGap: "8px",
        paddingTop: "10px"
    };

    const dummyImage = '/img/backgroundImg/dummy.png'; // Dummy image URL

    const handleImageError = (e) => {
        e.target.src = dummyImage;
    };

    return (
        <Card>
            <div className="btns-container" style={{ marginTop: "10px", position: 'absolute', top: 0, right: 15 }}>
                {type === 'add' && (
                    <>
                        {savedProduct?.includes(item?.id) ? (
                            wishlistLoader && wishlistLoader[item?.id] ? (
                                <Spin size="small" />
                            ) : (
                                <HeartFilled
                                    onClick={() => handleRemoveItem(index)}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        color: '#ff4d4f',
                                        fontSize: hovered ? '25px' : '22px',
                                        transition: 'font-size 0.3s ease-in-out',
                                    }}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                />
                            )
                        ) : wishlistLoader && wishlistLoader[item?.id] ? (
                            <Spin size="small" />
                        ) : (
                            <HeartOutlined
                                onClick={() => handleAddToWishlist(item?.id)}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    color: '#ff4d4f',
                                    fontSize: hovered ? '25px' : '22px',
                                    transition: 'font-size 0.3s ease-in-out',
                                }}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            />
                        )}
                    </>
                )}

                {type === 'remove' && (
                    wishlistLoader && wishlistLoader[item?.id] ? (
                        <Spin size="small" />
                    ) : (
                        <HeartFilled
                            onClick={() => handleRemoveItem(index)}
                            style={{
                                display: "flex ",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "#ff4d4f",
                                fontSize: hovered ? "25px" : "22px",
                                transition: "font-size 0.3s ease-in-out",
                            }}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        />
                    )
                )}
            </div>

            <div className="info-container" onClick={() => handleViewProduct(item?.link)}>
                <div style={imageBox}>
                    <img
                        style={imageStyle}
                        src={item?.image_link}
                        alt={item?.product_name}
                        onError={handleImageError}
                    />
                </div>
                <Divider style={{ margin: "10px 0 " }} />
                <div className="info-row" style={{ paddingBottom: "10PX" }}>
                    <Tooltip placement="bottom" title={item?.product_name}>
                            <p style={ProductTitle}>{item?.product_name}</p>
                    </Tooltip>
                </div>

                <div style={priceBox}>
                    <Tooltip placement="bottom" title={paid ? item.price : "Subscribe to see Price"}>
                        <TranslatedText>
                            <p style={PriceTag}>
                                <FaEuroSign size={15} />
                                {item.price === -1 ? <TranslatedText>Price Not available</TranslatedText> : item.price}
                            </p>
                        </TranslatedText>
                    </Tooltip>
                    <Divider type="vertical" />
                    <div className="info-row">
                        <span style={label}>
                            <TranslatedText>Relative Price:</TranslatedText>
                        </span>
                        <Tooltip placement="bottom" title={paid ? item.relative_price : "Subscribe to see Price"}>
                            <TranslatedText>
                                <p className="text-ellipsis" style={relativPrice}>
                                    <FaEuroSign size={11} />
                                    {item.relative_price}
                                </p>
                            </TranslatedText>
                        </Tooltip>
                    </div>
                </div>

                <div style={DetailBox}>
                    <div className="info-row">
                        <div style={IconBox}>
                            <VendorIcon height={15} width={15} />
                        </div>
                        <span style={label}>
                            <TranslatedText>Vendor:</TranslatedText>
                        </span>
                        <Tooltip placement="bottom" title={item.vendor}>
                                <p className="text-ellipsis">{item.vendor}</p>
                        </Tooltip>
                    </div>
                    <div className="info-row">
                        <div style={IconBox}>
                            <BrandIcon height={15} width={15} />
                        </div>
                        <span style={label}>
                            <TranslatedText>Brand:</TranslatedText>
                        </span>
                        <Tooltip placement="bottom" title={item.brand}>
                                <p className="text-ellipsis">{item.brand === "None" ? "NA" : item.brand}</p>
                        </Tooltip>
                    </div>
                </div>
            </div>

            <div className="btns-container">
                {paid && (
                    <HoverButton onClick={() => handleMarkOrdered(item)}>
                        <TranslatedText>Mark as Ordered</TranslatedText>
                    </HoverButton>
                )}
            </div>
        </Card>
    );
};

export default ProductCard;
