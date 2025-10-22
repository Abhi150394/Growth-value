import React from "react";
import { AiOutlineLink } from "react-icons/ai";
import { Table } from "antd";
import "../../Assests/Styles/earning.css";
import TranslatedText from "../../Components/Controls/TranslatedText"; // Import TranslatedText

const Earning = () => {
  const columns = [
    {
      title: <TranslatedText>Name</TranslatedText>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <TranslatedText>Amount</TranslatedText>,
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: <TranslatedText>Date</TranslatedText>,
      dataIndex: "date",
      key: "date",
    },
  ];

  const data = [];

  const paginationConfig = {
    position: ["bottomCenter"],
    pageSize: 100,
  };

  return (
    <div className="earning">
      <div className="page-header">
        <div className="heading">
          <span><TranslatedText>Payments Received</TranslatedText></span>
        </div>
      </div>

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

export default Earning;
