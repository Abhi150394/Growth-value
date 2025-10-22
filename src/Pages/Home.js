import React, { useState } from "react";
import TranslatedText from "../../Components/Controls/TranslatedText"; // Import TranslatedText

const newExportableFunction = () => {
  console.log("hi bro");
};

const Home = () => {
  const [data, setData] = useState();

  const handleButton = () => {
    setData({
      tabs: { orders_placed: 0 },
      recent_search: { data: [{ a: 1 }, { a: 2 }, { a: 3 }] },
    });
  };

  const handleUpdate = () => {
    //api hit
    const res = { orders_placed: 5 };
    setData({ ...data, tabs: res });
  };

  //   const handleDelete = () => {};

  //   const handleCreate = () => {};

  return (
    <div>
      <span>
        <TranslatedText>{data?.tabs?.orders_placed}</TranslatedText>
      </span> 
      <br />
      {data?.recent_search?.data?.map((x, index) => {
        return (
          <span key={index}>
            <TranslatedText>{x.a}</TranslatedText>
          </span>
        );
      })}
      <button onClick={handleButton}>
        <TranslatedText>Change</TranslatedText>
      </button>
      <button onClick={handleUpdate}>
        <TranslatedText>Update</TranslatedText>
      </button>
    </div>
  );
};

export default Home;
