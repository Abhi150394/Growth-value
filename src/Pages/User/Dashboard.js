import React, { useEffect, useState } from "react";
import { PiTrendDownBold, PiTrendUpBold, PiHourglassBold } from "react-icons/pi";
import "../../Assests/Styles/dashboard.css";
import { AiOutlineLink } from "react-icons/ai";
import { Col, Flex, Row, Spin } from "antd";
import { getDashboardData } from "../../API/dashboard";
import Column from "antd/es/table/Column";
import { useNavigate } from "react-router-dom";
import DetailsCard from "../../Components/Cards/DetailsCard/DetailsCard";
import DataTable from "../../Components/DataTable/DataTable";
import CustomModal from "../../Components/Controls/CustomModal";
import SupplayerForm from "../../Components/Forms/SupplayerForm";
import { decryptText } from "../../Utils/encryption";
import TranslatedText from "../../Components/Controls/TranslatedText";

const Dashboard = ({ userToken, userData, search, setSearch, user }) => {
  const [dashboardData, setDashboardData] = useState({});
  const navigate = useNavigate();
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSupplayer, setIsSupplayer] = useState(false);

  useEffect(() => {
    const func = async () => {
      setLoading(true);
      const res = await getDashboardData(userToken, current);
      setDashboardData(res?.data?.results);
      setTotal(res?.data?.count);
      setLoading(false);
    };
    func();
  }, [current]);

  useEffect(() => {
    setIsSupplayer(user?.vendors && user?.vendors.length === 0);
  }, [user]);

  useEffect(() => {
    const localStorageItems = localStorage;
    if (localStorageItems.length !== 0) {
      for (let key in localStorageItems) {
        if (localStorageItems[key] && decryptText(key) === "loggedUser") {
          const loggedUserData = JSON.parse(decryptText(localStorage.getItem(key)));
          if (user?.vendors?.length === 0) {
            setIsSupplayer(loggedUserData?.vendors == [] ? true : false)
          }
        }
      }
    }
  }, []);

  const handleSearch = (e) => {
    setSearch(e);
    navigate("/search&compare");
  };

  function onChange(page) {
    setCurrent(page);
  }

  const paginationConfig = {
    position: ["bottomCenter"],
    pageSize: 10,
    pageSizeOptions: [10, 20, 50],
    current: current,
    total: total,
    onChange: onChange,
  };

  const cardData = [
    {
      title: <TranslatedText>Orders Placed</TranslatedText>,
      value: dashboardData?.orders,
      icon: <PiTrendDownBold />,
    },
    {
      title: <TranslatedText>Hours Saved</TranslatedText>,
      value: dashboardData?.hours,
      icon: <PiHourglassBold />,
    },
    {
      title: <TranslatedText>Money Saved</TranslatedText>,
      value: dashboardData?.saved,
      icon: <PiTrendUpBold />,
    },
  ];

  const options = {
    search: false,
    viewColumns: false,
    selectableRows: "none",
    selectableRowsOnClick: false,
    disableToolbarSelect: false,
    download: false,
    print: false,
    filter: false,
    count: total,
    pagination: true,
    rowsPerPageOptions: [10],
    loading: loading,
    jumpToPage: true,
    responsive: 'simple',
    serverSide: true,
    textLabels: {
      body: {
        noMatch: loading ?
          <Spin /> :
          <TranslatedText>Sorry, there is no matching data to display</TranslatedText>,
      },
    },
    onChangePage: (currentPage) => onChange(currentPage + 1),
    onChangeRowsPerPage: (rowsPerPage) => { console.log("rowsPerPage", rowsPerPage) }
  };

  const columns = [
    {
      name: "search",
      label: <TranslatedText>Search Name</TranslatedText>,
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "results",
      label: <TranslatedText>Number of Results</TranslatedText>,
      options: {
        filter: false,
        sort: false,
      }
    },
    {
      name: "search",
      label: <TranslatedText>Revisit</TranslatedText>,
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Flex wrap gap="small">
              <AiOutlineLink
                style={{ cursor: 'pointer', fontSize: "20px" }}
                onClick={() => handleSearch(value)}
                color="blue"
              />
            </Flex>
          );
        }
      },
    }
  ];

  const handleCancel = () => {
    setIsSupplayer(false);
  };

  return (
    <div className="dashboard">
      <div className="body-content">
        <Row gutter={[8, 8]}>
          {cardData.map((item, index) => (
            <Col xs={24} sm={12} md={8} lg={12} xl={8} xxl={8} key={index}>
              <DetailsCard key={item.value} data={item.value} title={item.title} icon={item.icon} />
            </Col>
          ))}
        </Row>

        <hr />

        <div className="table">
          <DataTable
            title={
              <div style={{ fontSize: '24px', color: '#03254c', fontWeight: 500 }}>
                <TranslatedText>Recent Searches</TranslatedText>
              </div>
            }
            options={options}
            data={dashboardData?.searches}
            columns={columns}
          />

          {isSupplayer && <CustomModal
            open={isSupplayer}
            title={<TranslatedText>Add Supplier</TranslatedText>}
            handleCancel={handleCancel}
            footer={null}
            closable={true}
            content={<SupplayerForm user={user} handleCancel={handleCancel} userToken={userToken} setIsSupplayer={setIsSupplayer} />}
          />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
