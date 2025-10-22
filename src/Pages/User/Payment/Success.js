import { Spin } from "antd";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkPaymentStatus } from "../../../API/payment";
import { handleUpdate } from "../../../Utils/updateUserStates";
import TranslatedText from "../../../Components/Controls/TranslatedText"; // Import TranslatedText

const Success = ({ userToken, userData, setUserData }) => {
  const { checkout_id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await checkPaymentStatus(userToken, checkout_id);
      if (res?.status && res?.status === 200) {
        handleUpdate(false, userData, setUserData, true, true);
        navigate("/dashboard");
      } else {
        navigate("/plans");
      }
    };
    fetchData();
  }, [userToken, checkout_id, navigate, setUserData, userData]);

  return (
    <div style={{ height: "100vh" }}>
      <div
        style={{
          margin: "auto auto",
          width: "fit-content",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin size="large" />
        <h1>
          <TranslatedText>Payment Check In Progress</TranslatedText>
        </h1>
        <p>
          <TranslatedText>Please wait, you will be redirected to your homepage shortly</TranslatedText>
        </p>
      </div>
    </div>
  );
};

export default Success;
