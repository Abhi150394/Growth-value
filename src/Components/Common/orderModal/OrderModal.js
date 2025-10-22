import { Form, Input, Modal, theme } from "antd";
import React from "react";
import { createOrder } from "../../../API/order";
import { deleteWishlist } from "../../../API/wishlist";
import "./index.css";
import HoverButton from "../../Controls/HoverButton";
import TranslatedText from '../../Controls/TranslatedText'; // Import TranslatedText

const OrderModal = ({
  open,
  setOpen,
  product,
  userToken,
  handleRemoveItem,
  data,
  setData,
}) => {
  const handleCancel = () => {
    setOpen(false);
  };
  const { token } = theme.useToken();

  const onFinish = async (values) => {
    const res = await createOrder(
      userToken,
      product,
      values?.unit,
      values?.quantity
    );
    if (res?.status === 200 && data) {
      let newData = [...data];
      const item = {
        ...data.find((item) => item.id === product?.id),
        is_deleted: true,
      };
      const res = await deleteWishlist(userToken, item);
      if (res?.status === 200) {
        newData.splice(
          data.findIndex((item) => item.id === product?.id),
          1
        );
        setData(newData);
      }
    }
    setOpen(false);
  };

  const onFinishFailed = (e) => {
    console.log(e);
  };

  const buttonStyle = {
    background: token.colorPrimary,
    color: token.colorBgLayout,
    width: "100%",
    height: "34px",
    border: "none",
    borderRadius: token.borderRadiusSM,
  };

  return (
    <div>
      <Modal
        open={open}
        onCancel={handleCancel}
        onOk={handleCancel}
        title={<TranslatedText>Order Confirmation</TranslatedText>}
        footer={null}
        className="modal"
      >
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          style={{ width: "100%" }}
          initialValues={{ remember: false }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="form"
        >
          <Form.Item
            label={<TranslatedText>Quantity</TranslatedText>}
            name="quantity"
            rules={[{ required: true, message: <TranslatedText>Please input quantity!</TranslatedText> }]}
          >
            <Input placeholder={<TranslatedText>Quantity</TranslatedText>} type={"number"} />
          </Form.Item>
          {/* 
          <Form.Item
            label={<TranslatedText>Units</TranslatedText>}
            name="unit"
            rules={[{ required: true, message: <TranslatedText>Please input units!</TranslatedText> }]}
          >
            <Select
              options={[
                { value: "Grams", label: <TranslatedText>Grams</TranslatedText> },
                { value: "Kilograms", label: <TranslatedText>Kilograms</TranslatedText> },
                { value: "Ounces", label: <TranslatedText>Ounces</TranslatedText> },
                { value: "Pounds", label: <TranslatedText>Pounds</TranslatedText> },
                { value: "Milligrams", label: <TranslatedText>Milligrams</TranslatedText> },
                { value: "Milliliters", label: <TranslatedText>Milliliters</TranslatedText> },
                { value: "Liters", label: <TranslatedText>Liters</TranslatedText> },
                { value: "Fluid Ounces", label: <TranslatedText>Fluid Ounces</TranslatedText> },
                { value: "Cups", label: <TranslatedText>Cups</TranslatedText> },
                { value: "Teaspoons", label: <TranslatedText>Teaspoons</TranslatedText> },
                { value: "Tablespoons", label: <TranslatedText>Tablespoons</TranslatedText> },
                { value: "Each", label: <TranslatedText>Each</TranslatedText> },
                { value: "Dozen", label: <TranslatedText>Dozen</TranslatedText> },
                { value: "Piece", label: <TranslatedText>Piece</TranslatedText> },
                { value: "Slice", label: <TranslatedText>Slice</TranslatedText> },
                { value: "Whole", label: <TranslatedText>Whole</TranslatedText> },
                { value: "Can", label: <TranslatedText>Can</TranslatedText> },
                { value: "Bottle", label: <TranslatedText>Bottle</TranslatedText> },
                { value: "Jar", label: <TranslatedText>Jar</TranslatedText> },
                { value: "Carton", label: <TranslatedText>Carton</TranslatedText> },
                { value: "Package", label: <TranslatedText>Package</TranslatedText> },
                { value: "Box", label: <TranslatedText>Box</TranslatedText> },
                { value: "Bushel", label: <TranslatedText>Bushel</TranslatedText> },
                { value: "Pound", label: <TranslatedText>Pound</TranslatedText> },
                { value: "Quart", label: <TranslatedText>Quart</TranslatedText> },
                { value: "Peck", label: <TranslatedText>Peck</TranslatedText> },
                { value: "Inches", label: <TranslatedText>Inches</TranslatedText> },
                { value: "Centimeters", label: <TranslatedText>Centimeters</TranslatedText> },
                { value: "Small", label: <TranslatedText>Small</TranslatedText> },
                { value: "Medium", label: <TranslatedText>Medium</TranslatedText> },
                { value: "Large", label: <TranslatedText>Large</TranslatedText> },
                { value: "Slices", label: <TranslatedText>Slices</TranslatedText> },
                { value: "Sticks", label: <TranslatedText>Sticks</TranslatedText> },
                { value: "Sheets", label: <TranslatedText>Sheets</TranslatedText> },
              ]}
            />
          </Form.Item> */}

          <Form.Item style={{ textAlign: "center", marginTop: "15px" }}>
            <HoverButton htmlType="submit" style={buttonStyle}>
              <TranslatedText>Confirm</TranslatedText>
            </HoverButton>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderModal;
