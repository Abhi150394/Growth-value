import React, { useEffect, useState } from "react";
import "../../Assests/Styles/paymentMethod.css";
import { Table } from "antd";
import { RiVisaFill } from "react-icons/ri";
import { FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";
import { BsPhoneFlip } from "react-icons/bs";
import { getPayment } from "../../API/payment";
import TranslatedText from "../../Components/Controls/TranslatedText";

const PaymentHistory = ({ userToken }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const func = async () => {
      const res = await getPayment(userToken);
      setData(res?.data);
    };
    func();
  }, [userToken]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const columns = [
    {
      title: <TranslatedText>Vendor Name</TranslatedText>,
      dataIndex: "vendorName",
      key: "vendorName",
    },
    {
      title: <TranslatedText>Amount ($)</TranslatedText>,
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: <TranslatedText>Payment Method</TranslatedText>,
      dataIndex: "method",
      key: "method",
    },
    {
      title: <TranslatedText>Bank</TranslatedText>,
      dataIndex: "bank",
      key: "bank",
    },
  ];

  const paginationConfig = {
    position: ["bottomCenter"],
    pageSize: 100,
  };

  return (
    <div className="payment">
      <div className="table">
        <Table
          columns={columns}
          dataSource={data}
          pagination={paginationConfig}
          loading={false}
          rowKey={(record) => record.key}
          bordered
          scroll={{ x: 800 }}
          sticky
        />
      </div>
    </div>
  );
};

export default PaymentHistory;
