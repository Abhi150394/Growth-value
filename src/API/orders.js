import axios from "axios";

const getOrders = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/order/`,
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

const deleteOrders = async (token, payload) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/order/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
          "Content-Type": "application/json",
        },
        data: payload
      }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
};

const filterOrders = async (token, value) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/order/?vendor=${value}`,
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



export { getOrders, deleteOrders, filterOrders };
