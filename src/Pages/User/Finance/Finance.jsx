import { Box } from "@mui/material";
import ButtonGroup from "../../../Components/Buttons/TopBarControls";
import Phase1Report from "./Phase1Report";
import DynamicModal from "../../../Components/Modals/ExploreModal";
import { useState } from "react";

const Finance = () => {
      const [visible, setVisible] = useState(true);
//   const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("Explore");
  const buttonData = [
    { id: 0, title: "Phase 1 Report", type: "phase_1_report", phase: 1 },
    { id: 1, title: "Phase 2 Report", type: "phase_2_report", phase: 2 },
    { id: 2, title: "Other Report", type: "other_report", phase: 3 },
  ];
//     const openProductModal = () => {
//     setModalTitle("Product Details");
//     setModalContent(<ProductInfo name="MacBook Air" price={1299} />);
//     setVisible(true);
//   };
  return (
    <>
      <Box p={1} mt={1}>
        <Box mb={1}>
          <ButtonGroup buttons={buttonData} />
        </Box>
        <Box
          sx={{
            border: "1px solid #c2c0c0ff",
            borderRadius: "5px",
            padding: "10px",
            height: "auto",
            marginRight: "5px",
          }}
        >
          <Phase1Report />
        </Box>
      </Box>

      <DynamicModal
        visible={visible}
        onClose={() => setVisible(false)}
        title={modalTitle}
        width="90vw"
        height="80vh"
      >
        {<Phase1Report />}
      </DynamicModal>
    </>
  );
};

export default Finance;
