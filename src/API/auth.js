import axios from "axios";

const login = async (email, password) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/token/`,
      {
        email,
        password,
      }
    );

    return res;
  } catch (e) {
    console.log(e);
  }
};

const signup = async (
  categories,
  name,
  email,
  password,
  phone,
  bussiness,
  i_address,
  website,
  i_country,
  i_zip,
  vat,
) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/register/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: [{ name: categories }],
          name,
          email,
          password,
          phone,
          business: bussiness,
          i_address,
          website_url: website,
          i_country,
          i_zip,
          vat,
        }),
      }
    );

    const res = await response.json();
    if (res) {
      return res;
    }
    if (res.error) {
      return res
    }
  } catch (e) {
    return e;
  }

};

const refresh = async (token) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/token/refresh/`,
      { refresh: token?.refresh },
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

const checkOTP = async (token, otp) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/check_otp/${otp}`,
      {
        Authorization: `Bearer ${token?.access}`,
      }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
};

const resetPassword = async (password) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/reset_password/`,
      password,
    );
    return res;
  } catch (e) {
    console.log(e);
  }

}

const forgetPassword = async (email) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/api/forget_password/`,
      {
        email,
      }
    );
    return res;
  } catch (e) {
    console.log(e);
  }
}

const convertObjectToBase64 = (obj) => {
  // Step 1: Convert the object to a JSON string
  const jsonString = JSON.stringify(obj);

  // Step 2: Encode the JSON string to Base64
  const base64String = btoa(jsonString);

  return base64String;
};


export { login, signup, refresh, checkOTP, forgetPassword, resetPassword, convertObjectToBase64 };
