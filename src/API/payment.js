import axios from "axios";

const getPayment = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/payment`,
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

const createPayment = async (
  token,
  user_id,
  package_selected,
  transaction_amount
) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/payment`,
      {
        user_id,
        package_selected,
        transaction_amount,
      },
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

const updatePayment = async (
  token,
  user_id,
  package_selected,
  transaction_amount,
  is_deleted,
  paymentId
) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/payment/${paymentId}/`,
      {
        user_id,
        package_selected,
        transaction_amount,
        is_deleted,
      },
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

const getClientKey = async (token, price_id) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/checkout/`,
      {
        price_id,
      },
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

const checkPaymentStatus = async (token, checkout_id) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/success/`,
      {
        checkout_id,
      },
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

export {
  getPayment,
  createPayment,
  updatePayment,
  getClientKey,
  checkPaymentStatus,
};
