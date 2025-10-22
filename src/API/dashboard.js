import axios from "axios";

const getDashboardData = async (token, page) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/?page=${page}`,
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

const getAdminDashboardData = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/admin/dashboard/`,
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

export { getDashboardData, getAdminDashboardData };
