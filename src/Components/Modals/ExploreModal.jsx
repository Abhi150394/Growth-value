import React from "react";
import { Modal } from "antd";

const DynamicModal = ({
  visible,
  onClose,
  title,
  children,
  width = "70vw",
  height,
  footer = null,
  centered = true,
  destroyOnClose = true,
}) => {
  return (
    <Modal
    className="custom-modal"
      open={visible}
      onCancel={onClose}
      title={title}
      footer={footer}
      centered={centered}
      destroyOnClose={destroyOnClose}
      width={width}
      bodyStyle={{
        maxHeight: height || "80vh",
        overflowY: "auto",
        padding: "24px",
        backgroundColor:'#fff',
      }}
      maskStyle={{ backgroundColor: "rgba(54, 53, 53, 0.8)" }} 
      
    >
      {children}
    </Modal>
  );
};

export default DynamicModal;
