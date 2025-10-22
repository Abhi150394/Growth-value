import axios from "axios";

const createOrder = async (token, product, unit, quantity) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/order/`,
      { ...product, unit, quantity },
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
      }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
};

export { createOrder };
