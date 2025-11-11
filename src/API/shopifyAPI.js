//Order Details
export const getShopifyOrderData = async (token) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/shopify/orders/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Error", error);
  }
};

//Product Details
export const getShopifyProductDetails = async (token) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/shopify/products`,
      {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("ERROR:", error);
  }
};