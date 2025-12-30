import axios from "axios";

export const getSalesAreaData = async (token, fromDate, toDate) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/reports/lightspeed/sales-area/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
        params: {
          start_date: fromDate,
          end_date: toDate,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getSalesLocationData = async (token, fromDate, toDate) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/reports/lightspeed/sales-location/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
        params: {
          start_date: fromDate,
          end_date: toDate,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getSalesProductItemData = async (token, fromDate, toDate) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/reports/lightspeed/sales-productItem/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
        params: {
          start_date: fromDate,
          end_date: toDate,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getSalesProductCategoryData = async (token, fromDate, toDate) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/reports/lightspeed/sales-productCategory/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
        params: {
          start_date: fromDate,
          end_date: toDate,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getSalesOrderTypeData = async (token, fromDate, toDate) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/reports/lightspeed/sales-orderType/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
        params: {
          start_date: fromDate,
          end_date: toDate,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
// ======================Lookup table data=================================================
export const getSalesProductItemList = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/lightspeed/productItems/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getSalesProductCategoriesList = async (token) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/lightspeed/productCategories/`,
      {
        headers: {
          Authorization: `Bearer ${token?.access}`,
        },
      }
    );
    return res;
  } catch (err) {
    console.log(err);
  }
};
