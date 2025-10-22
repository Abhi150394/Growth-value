import React from "react";
import "../../Assests/Styles/personalInfo.css";
import UserInformationInput from "../../Components/Common/userInformaionInput/userInformationInput";
import TranslatedText from "../../Components/Controls/TranslatedText";

const PersonalInfo = ({ user, userToken, setUser }) => {
  return (
    <div className="personal-info">
      <h1><TranslatedText>Personal Info</TranslatedText></h1>
      <div className="outer-body">
        <div className="info-box">
          <div className="left">
            <span><TranslatedText>Basic Info</TranslatedText></span>
          </div>
          <div className="right">
            <div className="details">
              <span><TranslatedText>Name:</TranslatedText> </span>
              <UserInformationInput
                value={user?.name}
                user={user}
                objectKey={"name"}
                setUser={setUser}
              />
            </div>
            <div className="details">
              <span><TranslatedText>DOB:</TranslatedText> </span>
              <UserInformationInput
                value={user?.dob}
                user={user}
                objectKey={"dob"}
                userToken={userToken}
                setUser={setUser}
                type="date"
              />
            </div>
            <div className="details">
              <span><TranslatedText>Gender:</TranslatedText> </span>
              <UserInformationInput
                value={user?.gender}
                user={user}
                objectKey={"gender"}
                userToken={userToken}
                setUser={setUser}
              />
            </div>
          </div>
        </div>

        <div className="info-box">
          <div className="left">
            <span><TranslatedText>Contact Info</TranslatedText></span>
          </div>
          <div className="right">
            <div className="details">
              <span><TranslatedText>Email:</TranslatedText> </span>
              <UserInformationInput
                value={user?.email}
                userToken={userToken}
                user={user}
                objectKey={"email"}
                setUser={setUser}
              />
            </div>
            <div className="details">
              <span><TranslatedText>Phone:</TranslatedText> </span>
              <UserInformationInput
                value={user?.phone}
                user={user}
                objectKey={"phone"}
                userToken={userToken}
                setUser={setUser}
                type="phone"
              />
            </div>
          </div>
        </div>

        <div className="info-box">
          <div className="left">
            <span><TranslatedText>Invoice Address</TranslatedText></span>
          </div>
          <div className="right">
            <div className="details">
              <span><TranslatedText>Address:</TranslatedText> </span>
              <UserInformationInput
                value={user?.i_address}
                user={user}
                objectKey={"i_address"}
                userToken={userToken}
                setUser={setUser}
              />
            </div>
            <div className="details">
              <span><TranslatedText>Country:</TranslatedText> </span>
              <UserInformationInput
                value={user?.i_country}
                user={user}
                objectKey={"i_country"}
                userToken={userToken}
                setUser={setUser}
              />
            </div>
            <div className="details">
              <span><TranslatedText>Zip Code:</TranslatedText> </span>
              <UserInformationInput
                value={user?.i_zip}
                user={user}
                objectKey={"i_zip"}
                userToken={userToken}
                setUser={setUser}
              />
            </div>
          </div>
        </div>

        <div className="info-box">
          <div className="left">
            <span><TranslatedText>Address 2 Optional</TranslatedText></span>
          </div>
          <div className="right">
            <div className="details">
              <span><TranslatedText>Address:</TranslatedText> </span>
              <UserInformationInput
                value={user?.a_address}
                user={user}
                objectKey={"a_address"}
                userToken={userToken}
                setUser={setUser}
              />
            </div>
            <div className="details">
              <span><TranslatedText>Country:</TranslatedText> </span>
              <UserInformationInput
                value={user?.a_country}
                user={user}
                userToken={userToken}
                objectKey={"a_country"}
                setUser={setUser}
              />
            </div>
            <div className="details">
              <span><TranslatedText>Zip Code:</TranslatedText> </span>
              <UserInformationInput
                value={user?.a_zip}
                user={user}
                objectKey={"a_zip"}
                userToken={userToken}
                setUser={setUser}
              />
            </div>
          </div>
        </div>

        <div className="info-box">
          <div className="left">
            <span><TranslatedText>Business Information</TranslatedText></span>
          </div>
          <div className="right">
            <div className="details">
              <span><TranslatedText>Business:</TranslatedText> </span>
              <UserInformationInput
                value={user?.business}
                user={user}
                objectKey={"business"}
                userToken={userToken}
                setUser={setUser}
              />
            </div>
            <div className="details">
              <span><TranslatedText>VAT:</TranslatedText> </span>
              <UserInformationInput
                value={user?.vat}
                user={user}
                objectKey={"vat"}
                userToken={userToken}
                setUser={setUser}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
