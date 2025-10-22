import React, { useEffect, useState } from "react";
import { PiTrendDownBold, PiTrendUpBold, PiHourglassBold } from "react-icons/pi";
import "../../Assests/Styles/dashboard.css";
import { Col, Row, Table } from "antd";
import { getAdminDashboardData } from "../../API/dashboard";
import DetailsCard from "../../Components/Cards/DetailsCard/DetailsCard";
import TranslatedText from "../../Components/Controls/TranslatedText"; // Import TranslatedText

const Dashboard = ({ userToken }) => {
  const [data, setData] = useState([]);
  const [tabData, setTabData] = useState({
    users: 0,
    subscriptionAmount: 0,
    totalSubscriptions: 0,
  });

  const paginationConfig = {
    position: ["bottomCenter"],
    pageSize: 100,
  };

  const columns = [
    {
      title: <TranslatedText>User</TranslatedText>,
      dataIndex: "user",
      key: "user",
      render: (text) => <TranslatedText>{text}</TranslatedText>, // Wrap user data
    },
    {
      title: <TranslatedText>Subscription Type</TranslatedText>,
      dataIndex: "type",
      key: "type",
      render: (text) => <TranslatedText>{text}</TranslatedText>, // Wrap subscription type data
    },
    {
      title: <TranslatedText>Duration</TranslatedText>,
      dataIndex: "duration",
      key: "duration",
      render: (text) => <TranslatedText>{text}</TranslatedText>, // Wrap duration data
    },
    {
      title: <TranslatedText>Vendors</TranslatedText>,
      dataIndex: "vendors",
      key: "vendors",
      render: (text) => <TranslatedText>{text}</TranslatedText>, // Wrap vendors data
    },
    {
      title: <TranslatedText>Categories</TranslatedText>,
      dataIndex: "tags",
      key: "tags",
      render: (text) => <TranslatedText>{text}</TranslatedText>, // Wrap categories data
    },
    {
      title: <TranslatedText>Status</TranslatedText>,
      dataIndex: "status",
      key: "status",
      render: (text) => <TranslatedText>{text}</TranslatedText>, // Wrap status data
    },
  ];

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const func = async () => {
      setLoading(true);
      const res = await getAdminDashboardData(userToken);
      if (res?.status === 200) {
        // Wrap dynamic table data with TranslatedText
        setData(res?.data.table.map(item => ({
          ...item,
          user: <TranslatedText>{item.user}</TranslatedText>, // Wrap user
          type: <TranslatedText>{item.type}</TranslatedText>, // Wrap type
          duration: <TranslatedText>{item.duration}</TranslatedText>, // Wrap duration
          vendors: <TranslatedText>{item.vendors}</TranslatedText>, // Wrap vendors
          tags: <TranslatedText>{item.tags}</TranslatedText>, // Wrap tags
          status: <TranslatedText>{item.status}</TranslatedText>, // Wrap status
        })));
        setTabData(res?.data?.tabs);
      }
      setLoading(false);
    };
    func();
  }, [userToken]);

  const cardData = [
    {
      title: <TranslatedText>Users</TranslatedText>,
      value: <TranslatedText>{tabData?.users}</TranslatedText>, // Wrap users count
      icon: <PiTrendDownBold />,
    },
    {
      title: <TranslatedText>Subscription Amount</TranslatedText>,
      value: <TranslatedText>{tabData?.subscriptionAmount}</TranslatedText>, // Wrap subscription amount
      icon: <PiHourglassBold />,
    },
    {
      title: <TranslatedText>Total Subscriptions</TranslatedText>,
      value: <TranslatedText>{tabData?.totalSubscriptions}</TranslatedText>, // Wrap total subscriptions
      icon: <PiTrendUpBold />,
    },
  ];

  return (
    <div className="dashboard">
      <div className="body-content">
        <Row gutter={[8, 8]}>
          {cardData.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={12} xl={8} xxl={8} key={index}>
              <DetailsCard
                key={item.value}
                data={item.value}
                title={item.title}
                icon={item.icon}
              />
            </Col>
          ))}
        </Row>
        <hr />
        <div className="page-header">
          <div className="heading">
            <span><TranslatedText>Subscriptions</TranslatedText></span>
          </div>
        </div>

        <div className="table">
          <Table
            columns={columns}
            dataSource={data}
            pagination={paginationConfig}
            loading={loading}
            rowKey={(record) => record.key}
            bordered
            scroll={{ x: 800 }}
            sticky
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
