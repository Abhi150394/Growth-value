import { decryptText, encryptText } from "./encryption";

const updateUserStates = (setUserData, setUserToken) => {
  const localStorageItems = localStorage;
  if (localStorageItems.length !== 0) {
    for (let key in localStorageItems) {
      if (localStorageItems[key] && decryptText(key) === "user") {
        localStorageItems[key] &&
          setUserData(JSON.parse(decryptText(localStorageItems[key])));
      }

      if (localStorageItems[key] && decryptText(key) === "token") {
        localStorageItems[key] &&
          setUserToken(JSON.parse(decryptText(localStorageItems[key])));
      }
    }
  }
};

const handleLogout = (setUserData, setUserToken) => {
  const localStorageItems = localStorage;
  localStorage.removeItem("handleLogout")
  if (localStorageItems.length !== 0) {
    for (let key in localStorageItems) {
      if (localStorageItems[key] && decryptText(key) === "user") {
        localStorage.removeItem(key);
      }

      if (localStorageItems[key] && decryptText(key) === "token") {
        localStorage.removeItem(key);
      }

      if (localStorageItems[key] && decryptText(key) === "loggedUser") {
        localStorage.removeItem(key);
      }


    }
    setUserData({
      email: "",
      role: "",
      account: false,
      paid: false,
      payment_status: false,
    });
    setUserToken({ access: "", refresh: "" });
  }
};

const handleUpdate = (
  account,
  userData,
  setUserData,
  paid = null,
  payment_status = null
) => {
  const localStorageItems = localStorage;
  if (localStorageItems.length !== 0) {
    for (let key in localStorageItems) {
      if (localStorageItems[key] && decryptText(key) === "user") {
        localStorage.removeItem(key);
      }
    }
    localStorage.setItem(
      encryptText("user"),
      encryptText(
        JSON.stringify({
          email: userData.email,
          role: userData.role,
          account,
          id: userData?.id,
          paid: paid === null ? userData?.paid : paid,
          payment_status:
            payment_status === null ? userData?.payment_status : payment_status,
        })
      )
    );
    setUserData({
      ...userData,
      account,
      paid: paid === null ? userData?.paid : paid,
      payment_status:
        payment_status === null ? userData?.payment_status : payment_status,
    });
  }
};

export { handleLogout, handleUpdate };
export default updateUserStates;
