import { Button, Form, Input, Modal } from "antd";
import React from "react";
import "./index.css";
import { updateUser } from "../../../API/user";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import TranslatedText from '../../Controls/TranslatedText'; 

const EditUserModal = ({ open, setOpen, user, userToken, data, setData }) => {
  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish = async (values) => {
    let password;
    if (values?.password) password = values?.password;

    const res = await updateUser(userToken, {
      email: values.email,
      id: user?.id,
      name: values.name,
      phone: values.phone,
      address: values.address,
      country: values.country,
      zip: values.zip,
      vat: values.vat,
      business: values.business,
    });

    if (res?.status === 200) {
      setData(
        data?.map((item) => (item?.id === res?.data?.id ? res?.data : item))
      );
      setOpen(false);
    }
  };

  const onFinishFailed = (e) => {
    console.log(e);
  };

  const phoneInputStyle = {
    borderRadius: "8px",
    border: "1px solid #ffdfa0",
    backgroundColor: "#F1E4CB"
  };

  return (
    <div>
      <Modal
        open={open}
        onCancel={handleCancel}
        onOk={handleCancel}
        title={<TranslatedText>Update User Details</TranslatedText>}
        footer={null}
        className="modal"
      >
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="form"
          initialValues={{ ...user, address: user.i_address, zip: user?.i_zip }}
        >
          <Form.Item
            label={<TranslatedText>Name</TranslatedText>}
            name="name"
            rules={[{ required: false, message: <TranslatedText>Please input your name!</TranslatedText> }]}
          >
            <Input placeholder={<TranslatedText>Name</TranslatedText>} />
          </Form.Item>
          <Form.Item
            label={<TranslatedText>Email</TranslatedText>}
            name="email"
            type="email"
            rules={[{ required: false, message: <TranslatedText>Please input your email!</TranslatedText> }]}
          >
            <Input placeholder={<TranslatedText>Email</TranslatedText>} />
          </Form.Item>

          <Form.Item
            label={<TranslatedText>Phone</TranslatedText>}
            name="phone"
            rules={[{ required: false, message: <TranslatedText>Please input your phone!</TranslatedText> }]}
          >
            <PhoneInput style={phoneInputStyle} type="primary" />
          </Form.Item>
          <Form.Item
            label={<TranslatedText>Address</TranslatedText>}
            name="address"
            rules={[{ required: false, message: <TranslatedText>Please input your address!</TranslatedText> }]}
          >
            <Input placeholder={<TranslatedText>Address</TranslatedText>} />
          </Form.Item>
          <Form.Item
            label={<TranslatedText>Country</TranslatedText>}
            name="country"
            rules={[{ required: false, message: <TranslatedText>Please input your country!</TranslatedText> }]}
          >
            <Input placeholder={<TranslatedText>Country</TranslatedText>} />
          </Form.Item>
          <Form.Item
            label={<TranslatedText>Zip</TranslatedText>}
            name="zip"
            rules={[
              { required: false, message: <TranslatedText>Please input your zip code!</TranslatedText> },
            ]}
          >
            <Input placeholder={<TranslatedText>Zip</TranslatedText>} type={"number"} />
          </Form.Item>
          <Form.Item
            label={<TranslatedText>VAT</TranslatedText>}
            name="vat"
            rules={[
              { required: false, message: <TranslatedText>Please input your VAT code!</TranslatedText> },
            ]}
          >
            <Input placeholder={<TranslatedText>VAT</TranslatedText>} />
          </Form.Item>
          <Form.Item
            label={<TranslatedText>Business</TranslatedText>}
            name="business"
            rules={[
              { required: false, message: <TranslatedText>Please input your business!</TranslatedText> },
            ]}
          >
            <Input placeholder={<TranslatedText>Business</TranslatedText>} />
          </Form.Item>
          <Form.Item className="last-item">
            <Button style={{ width: "100%" }} type="primary" htmlType="submit">
              <TranslatedText>Update</TranslatedText>
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditUserModal;
