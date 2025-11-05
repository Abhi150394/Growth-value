import { Box } from "@mui/material";
import DynamicModal from "../../../Components/Modals/ExploreModal";
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../../../Contexts/FilterContext";
import Test1 from "./Test1";

const LaborDash = ({ userToken }) => {
  const [visible, setVisible] = useState(false);
  const { filters } = useContext(FilterContext);
  console.log("filtersfilters", filters);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("Explore");

  //   useEffect(() => {
  //     const fetchForecastData = async () => {
  //       try {
  //         const data = await getForecastDetailsData(userToken);
  //         console.log(
  //           "getForecastDetailsDatagetForecastDetailsData------",
  //           data
  //         );
  //       } catch (err) {
  //         console.error("Error fetching Shipday data:", err);
  //       }
  //     };

  //     fetchForecastData();
  //   }, [userToken]);

  const openTest1Modal = () => {
    // setModalTitle("Forecast Details");
    setModalContent(<Test1 showExploreButton={false} />);
    setVisible(true);
  };

  return (
    <>
      <Box p={1} mt={1}>
        <Box
          sx={{
            border: "1px solid #c2c0c0ff",
            borderRadius: "5px",
            padding: "10px",
            height: "auto",
            marginRight: "5px",
            width: "50%",
          }}
        >
          <Test1 handleExplore={openTest1Modal} />
        </Box>
      </Box>

      <DynamicModal
        visible={visible}
        onClose={() => setVisible(false)}
        title={modalTitle}
        width="90vw"
        height="80vh"
      >
        {modalContent}
      </DynamicModal>
    </>
  );
};

export default LaborDash;
