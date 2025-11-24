import axios from "axios";

//Order Details
export const getOrderData = async (token) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/lightspeed/orders/`,
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
export const getProductDetails = async (token) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/lightspeed/products`,
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

    
export const getProductSales = async (token, fromDate, toDate) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/lightspeed/productsales`,
      {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
        params: {
          from_date: fromDate,
          to_date: toDate,
        },
      }
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching product sales:", err);
    throw err;
  }
};


//Financial Details
export const getFinancialDetailsData = async (token,fromDate, toDate) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/lightspeed/financeDetails`,
      {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
        params: {
          from_date: fromDate,
          to_date: toDate,
        },
      }
    );
    return response;
  } catch (err) {
    console.log("ERRor:", err);
  }
};
  


// Employees details

export const getLabourDetailsData=async(token)=>{
    try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/shyfter/employees/`,
      {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      }
    );
    return response;
  } catch (err) {
    console.log("ERRor:", err);
  }

}