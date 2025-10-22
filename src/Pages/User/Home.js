import React from "react";
import "../../Assests/Styles/home.css";
import female from "../../Assests/Images/female-generic-avatar.jpeg";
import male from "../../Assests/Images/male-generic-avatar.jpeg";
import TranslatedText from "../../Components/Controls/TranslatedText";

const Home = ({ user }) => {
  const welcomeMessage =`Welcome, ${user?.name}`
  return (
    <div className="account-home">
      <h1><TranslatedText>Home</TranslatedText></h1>
      <div className="outer-body">
        <div className="page-body">
          <div className="img-profile">
            <img
              src={user?.gender?.toLowerCase() === "female" ? female : male}
              alt="avatar"
            />
          </div>
          <div className="heading">
            <TranslatedText>{welcomeMessage}</TranslatedText>
          </div>
          <div className="sub-heading">
            <TranslatedText>
              Manage your info, privacy, and security to make Growth Value work better for you.
            </TranslatedText>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
