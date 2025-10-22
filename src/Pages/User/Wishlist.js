import "../../Assests/Styles/wishlist.css";
import { Col, Empty, Row, notification } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { deleteWishlist, getWishlist } from "../../API/wishlist";
import OrderModal from "../../Components/Common/orderModal/OrderModal";
import ProductCard from "../../Components/Cards/ProductCard/ProductCard";
import SkeltonCard from "../../Components/Cards/SkeltonCard/SkeltonCard"
import TranslatedText from "../../Components/Controls/TranslatedText"; // Import TranslatedText

const Wishlist = ({ userToken, userData }) => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [wishlistLoader, setWishlistLoader] = useState({});

  useEffect(() => {
    setLoading(true);
    const func = async () => {
      const res = await getWishlist(userToken);
      setData(res?.data);
      setLoading(false);
    };
    func();
  }, [userToken]);

  const groupedData = data?.reduce((acc, product) => {
    if (!acc[product?.product_name]) {
      acc[product?.product_name] = [];
    }
    acc[product?.product_name]?.push(product);
    return acc;
  }, {});

  const handleMarkOrdered = (e) => {
    setProduct(e);
    setOpen(true);
  };

  const handleViewProduct = (e) => {
    window.open(e, "_blank");
  };

  const sortedProducts = useMemo(() => {
    return data.sort((a, b) => {
      if (a.vendor < b.vendor) return -1;
      if (a.vendor > b.vendor) return 1;
      if (a.product_name < b.product_name) return -1;
      if (a.product_name > b.product_name) return 1;
      return 0;
    });
  }, [data]);

  const handleRemoveItem = async (index) => {
    const newData = [...data];
    const item = { ...data?.[index], is_deleted: true };
    setWishlistLoader((prev) => ({ ...prev, [item.id]: true }));
    const res = await deleteWishlist(userToken, item);
    if (res?.status === 200) {
      newData.splice(index, 1);
      setData(newData);
      api.success({
        message: <TranslatedText>Product removed from wishlist</TranslatedText>,
      });
      setWishlistLoader((prev) => ({ ...prev, [item.id]: false }));
    } else {
      api.error({
        message: <TranslatedText>Something went wrong</TranslatedText>,
        description: <TranslatedText>Please try again!</TranslatedText>,
      });
    }
    setWishlistLoader((prev) => ({ ...prev, [item.id]: false }));
  };

  const emptyBox = {
    height: "100%",
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  };

  return (
    <div className="wishlist">
      {contextHolder}
      <div className="body-content">
        <div className="card-container">
          {!loading ? (
            <Row gutter={[16, 16]}>
              {data?.length > 0 ? (
                sortedProducts?.map((item, index) => (
                  <Col xs={24} sm={12} md={8} lg={12} xl={8} xxl={8} key={index}>
                    <ProductCard
                      wishlistLoader={wishlistLoader}
                      type='remove'
                      paid={userData?.paid}
                      item={item}
                      index={index}
                      handleRemoveItem={handleRemoveItem}
                      handleViewProduct={handleViewProduct}
                      handleMarkOrdered={handleMarkOrdered}
                    />
                  </Col>
                ))
              ) : (
                <div style={emptyBox}>
                  <Empty
                    description={<TranslatedText>No data Found</TranslatedText>}
                  />
                </div>
              )}
            </Row>
          ) : (
            <Row gutter={[16, 16]} className="plan-cards-container">
              <SkeltonCard avatar={false} image={true} count={6} loading={loading} />
            </Row>
          )}
        </div>
      </div>
      {open && (
        <OrderModal
          open={open}
          setOpen={setOpen}
          product={product}
          userToken={userToken}
          handleRemoveItem={handleRemoveItem}
          setData={setData}
          data={data}
        />
      )}
    </div>
  );
};

export default Wishlist;
