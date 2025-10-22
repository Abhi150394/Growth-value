import axios from "axios";

const userDetails = async (token, userId) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/list/${userId}/`,
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

const usersList = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/list`,
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

const deleteUser = async (token, id) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/delete/${id}`,
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

const updateUser = async (token, user) => {
  try {
    const res = await axios.patch(
      `${process.env.REACT_APP_BACKEND_URL}/api/users/${user?.id}/`,
      user,
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

export { userDetails, usersList, updateUser, deleteUser };
