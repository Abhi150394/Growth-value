import { Button, Modal } from "antd";
import React from "react";
import "./index.css";
import warning from "../../../Assests/Images/warning.png";
import { handleLogout } from "../../../Utils/updateUserStates";
import TranslatedText from '../../Controls/TranslatedText'; // Import TranslatedText

const PaymentWarningModal = ({ open, setUserData, setUserToken }) => {
  return (
    <div>
      <Modal
        open={open}
        title={<TranslatedText>Access Denied</TranslatedText>}
        footer={null}
        className="payment-warning-modal"
        closeIcon={false}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            margin: "25px",
            textAlign: "center",
            alignItems: "center",
          }}
        >
          <img src={warning} alt="warning" width={"100px"} />
          <h1 style={{ margin: "10px" }}>
            <TranslatedText>Payment Failed</TranslatedText>
          </h1>
          <p style={{ margin: "0px" }}>
            <TranslatedText>Please Pay Your Subscription to Continue!</TranslatedText>
          </p>
          <Button onClick={() => handleLogout(setUserData, setUserToken)}>
            <TranslatedText>Logout</TranslatedText>
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default PaymentWarningModal;
