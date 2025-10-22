import { Button, Flex, Spin, message } from "antd";
import React, { useState, useEffect } from "react";
import "../../Assests/Styles/scraping.css";
import { getScrapers, startScraper } from "../../API/scrape";
import DataTable from "../../Components/DataTable/DataTable";
import TranslatedText from "../../Components/Controls/TranslatedText"; // Import TranslatedText

const Scraping = ({ userToken }) => {
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const handleScrapeNowClick = (key) => {
    console.log(`Scrape Now clicked for key: ${key}`);
    const func = async () => {
      const res = await startScraper(userToken, key);
      messageApi.open({
        type: 'success',
        content: <TranslatedText>{res?.data?.message}</TranslatedText>,
      });
    };
    func();
  };

  useEffect(() => {
    setLoading(true);
    const func = async () => {
      const res = await getScrapers(userToken);
      setData(res?.data);
      setLoading(false);
    };
    func();
  }, [userToken]);

  const columns = [
    {
      label: <TranslatedText>Website</TranslatedText>,
      name: "website",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <TranslatedText>{value}</TranslatedText>
        )
      }
    },
    {
      label: <TranslatedText>Product Scraped</TranslatedText>,
      name: "scraped",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <TranslatedText>{value}</TranslatedText>
        )
      }
    },
    {
      label: <TranslatedText>Last Scraped On</TranslatedText>,
      name: "last_scraped",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <TranslatedText>{value}</TranslatedText>
        )
      }
    },
    {
      label: <TranslatedText>Action</TranslatedText>,
      name: "id",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <Flex wrap gap="small">
            <Button onClick={() => handleScrapeNowClick(value)}>
              <TranslatedText>Scrape Now</TranslatedText>
            </Button>
          </Flex>
        )
      },
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
    pagination: true,
    rowsPerPageOptions: [10],
    loading: loading,
    jumpToPage: false,
    responsive: 'simple',
    serverSide: true,
    textLabels: {
      body: {
        noMatch: loading ?
          <Spin /> :
          <TranslatedText>Sorry, there is no matching data to display</TranslatedText>,
      },
    },
  };

  return (
    <>
      {contextHolder}
      <div className="scraping">
        <div className="table">
          <DataTable
             title={
              <div style={{ fontSize: '20px', color: '#03254c', fontWeight: 500 }}>
                <TranslatedText>Scrapping</TranslatedText>
              </div>
            }
            options={options}
            data={data}
            columns={columns}
          />
        </div>
      </div>
    </>
  );
};

export default Scraping;
