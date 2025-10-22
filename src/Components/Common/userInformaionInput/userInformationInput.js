import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { PiCheckFat, PiPencilSimpleDuotone } from "react-icons/pi";
import { RxCross1 } from "react-icons/rx";
import { updateUser } from "../../../API/user";
import "./index.css";
import TranslatedText from '../../Controls/TranslatedText'; // Import TranslatedText

const UserInformationInput = ({
  objectKey,
  user,
  userToken,
  setUser,
  type = "default",
}) => {
  const [disabled, setDisabled] = useState(true);
  const [initialValue, setInitialValue] = useState();

  const handleCancel = () => {
    setInitialValue(user?.[objectKey]);
    setDisabled(!disabled);
  };

  const handleSave = async () => {
    const updatedUser = { ...user, [objectKey]: initialValue };
    const res = await updateUser(userToken, updatedUser);
    if (res?.status === 200) {
      setUser(updatedUser);
    }
    setDisabled(!disabled);
  };

  useEffect(() => {
    setInitialValue(user?.[objectKey]);
  }, [user?.[objectKey]]);

  return (
    <div className="user-information-input">
      <Input
        value={initialValue || " -"}
        disabled={disabled}
        onChange={(e) => setInitialValue(e?.target?.value)}
      />
      
      <div className="icons-container">
        {disabled ? (
          <PiPencilSimpleDuotone
            className="icon"
            onClick={() => setDisabled(!disabled)}
            title={<TranslatedText>Edit</TranslatedText>} // Add tooltip for translation
          />
        ) : (
          <div className="actions-container">
            <RxCross1
              className="icon"
              onClick={handleCancel}
              color={"maroon"}
              title={<TranslatedText>Cancel</TranslatedText>} // Add tooltip for translation
            />
            <PiCheckFat
              onClick={handleSave}
              color={"darkGreen"}
              className="icon"
              title={<TranslatedText>Save</TranslatedText>} // Add tooltip for translation
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInformationInput;
