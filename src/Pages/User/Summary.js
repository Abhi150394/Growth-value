import React, { useEffect, useState } from "react";
import { Button, Card, Col, Flex, Popconfirm, Row, Select, Space, Spin, Table, theme } from "antd";
import "../../Assests/Styles/summary.css";
import { AiOutlineLink } from "react-icons/ai";
import { getOrders, deleteOrders, filterOrders } from "../../API/orders";
import Column from "antd/es/table/Column";
import { useNavigate } from "react-router-dom";
import DataTable from "../../Components/DataTable/DataTable";
import HoverButton from "../../Components/Controls/HoverButton";
import CommonButton from "../../Components/Controls/CommonButton";
import { BsTrash } from "react-icons/bs";
import TranslatedText from "../../Components/Controls/TranslatedText"; // Import TranslatedText

const { Option } = Select;

const Summary = ({ userToken, setSearch }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState([]);
  const [VendorList, setVendorList] = useState([]);
  const navigate = useNavigate();

  const { token } = theme.useToken();

  const func = async () => {
    const res = await getOrders(userToken);
    setOrders(res?.data);
    setVendorList(res?.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    func();
  }, []);

  const handleSearch = (e) => {
    setSearch(e);
    navigate("/search&compare");
  };

  const handleDeleteOrder = async (id) => {
    setLoading(true);
    let payload = {
      id: id,
    };
    await deleteOrders(userToken, payload);
    func();
  };

  const paginationConfig = {
    position: ["bottomCenter"],
    pageSize: 100,
  };

  const ActionBox = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
  };

  const clear = {};

  const options = {
    search: false,
    viewColumns: false,
    selectableRows: "none",
    selectableRowsOnClick: false,
    disableToolbarSelect: false,
    download: false,
    print: false,
    filter: false,
    rowsPerPageOptions: [10, 20, 50],
    loading: loading,
    responsive: 'simple',
    textLabels: {
      body: {
        noMatch: loading ?
          <Spin /> :
          <TranslatedText>Sorry, there is no matching data to display</TranslatedText>,
      },
    },
  };

  const columns = [
    {
      name: "product_name",
      label: <TranslatedText>Product Name</TranslatedText>,
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "brand",
      label: <TranslatedText>Brand Name</TranslatedText>,
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => (value === "None" ? "" : value),
      },
    },
    {
      name: "vendor",
      label: <TranslatedText>Vendor</TranslatedText>,
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "quantity",
      label: <TranslatedText>Quantity</TranslatedText>,
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => (Math.round(value)),
      },
    },
    {
      name: "price",
      label: <TranslatedText>Price</TranslatedText>,
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "relative_price",
      label: <TranslatedText>Relative Price ($)</TranslatedText>,
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: "id",
      label: <TranslatedText>Link</TranslatedText>,
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          const { rowIndex } = tableMeta;
          return (
            <Flex wrap gap="small">
              <AiOutlineLink style={{ cursor: 'pointer', fontSize: "20px" }} onClick={() => handleSearch(orders[rowIndex].product_name)} color="blue" />
              <Popconfirm
                title={<TranslatedText>Are you sure you want to delete?</TranslatedText>}
                onConfirm={() => handleDeleteOrder(value)}
                okText={<TranslatedText>Yes</TranslatedText>}
                cancelText={<TranslatedText>No</TranslatedText>}
                bottom
                placement="topRight"
              >
                <BsTrash style={{ cursor: "pointer", color: "red" }} size={20} />
              </Popconfirm>
            </Flex>
          );
        },
      },
    },
  ];

  const handleChange = (value) => {
    setSelectedVendor(value);
  };

  const uniqueVendors = [...new Set(VendorList?.map(item => item.vendor))];

  useEffect(() => {
    const fetchOrders = async () => {
      if (selectedVendor.length === 0) {
        func();
      } else {
        try {
          setLoading(true);
          const filteredVendor = await filterOrders(userToken, selectedVendor);
          setOrders(filteredVendor.data);
          setLoading(false);
        } catch (error) {
          console.error('Error filtering orders:', error);
        }
      }
    };

    fetchOrders();
  }, [selectedVendor]);

  return (
    <div className="summary">
      <div className="table">
        <Card size="small">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Select
                mode="multiple"
                placeholder={<TranslatedText>Select vendors</TranslatedText>}
                style={{ width: '50%' }}
                onChange={handleChange}
              >
                {uniqueVendors.map(vendor => (
                  <Option key={vendor} value={vendor}>
                    {vendor}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <div style={{ float: "right" }}>
                <Popconfirm
                  title={<TranslatedText>Are you sure you want to clear this Summary?</TranslatedText>}
                  onConfirm={() => handleDeleteOrder(null)}
                  okText={<TranslatedText>Yes</TranslatedText>}
                  cancelText={<TranslatedText>No</TranslatedText>}
                  bottom
                  placement="topRight"
                >
                  <CommonButton style={clear}>
                    <TranslatedText>Clear All</TranslatedText>
                  </CommonButton>
                </Popconfirm>
              </div>
            </Col>
          </Row>
        </Card>
        <div>
          <DataTable
            title={
              <div style={{ fontSize: '24px', color: '#03254c', fontWeight: 500 }}>
                <TranslatedText>Summary</TranslatedText>
              </div>
            }
            data={orders}
            columns={columns}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default Summary;
