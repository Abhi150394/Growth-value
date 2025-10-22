import axios from "axios";

const getWishlist = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/list/wishlist`,
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

const createWishlist = async (token, body) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/wishlist/`,
      body,
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

const deleteWishlist = async (token, body) => {
  try {
    const res = await axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}/api/wishlist/${body?.product_id ? body?.product_id : body?.id}/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
        data: body,
      }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
};

export { getWishlist, createWishlist, deleteWishlist };
