import React from "react";
import "../../Assests/Styles/helpSupport.css";
import { GrLocation } from "react-icons/gr";
import { BiPhone } from "react-icons/bi";
import { MdOutlineMail } from "react-icons/md";
import { Input, Form, Row, Col } from "antd";
import HoverButton from "../../Components/Controls/HoverButton";
import TranslatedText from "../../Components/Controls/TranslatedText";

const HelpandSupport = () => {
  const { TextArea } = Input;

  const onFinish = (values) => {
    console.log("Form values:", values);
  };

  return (
    <div className="help-support">
      <div className="page-header">
        <div className="title-header">
          <span>
            <TranslatedText>Contact Us</TranslatedText>
          </span>
        </div>

        <div className="subtitle-header">
          <span>
            <TranslatedText>Get in touch and let us know how we can help</TranslatedText>
          </span>
        </div>
      </div>

      <div className="body-content">
        <Row gutter={40}>
          <Col xs={24} md={10} lg={8} className="left-div">
            <div className="contact-box">
              <div className="box">
                <div className="icon-container">
                  <GrLocation />
                </div>
                <div className="info">
                  <span className="box-title">
                    <TranslatedText>Address</TranslatedText>
                  </span>
                  <br />
                  <span className="box-val">
                    <TranslatedText>
                      4517 Washington Ave. Manchester, Kentucky 39495
                    </TranslatedText>
                  </span>
                </div>
              </div>
              <div className="box">
                <div className="icon-container">
                  <BiPhone />
                </div>
                <div className="info">
                  <span className="box-title">
                    <TranslatedText>Contact No.</TranslatedText>
                  </span>
                  <br />
                  <span className="box-val">
                    <TranslatedText>(307) 555-0133</TranslatedText>
                  </span>
                </div>
              </div>
              <div className="box">
                <div className="icon-container">
                  <MdOutlineMail />
                </div>
                <div className="info">
                  <span className="box-title">
                    <TranslatedText>Email</TranslatedText>
                  </span>
                  <br />
                  <span className="box-val">
                    <TranslatedText>debbie.baker@example.com</TranslatedText>
                  </span>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} md={14} lg={16} className="right-div">
            <div className="message-box">
              <h2>
                <TranslatedText>Send Message</TranslatedText>
              </h2>
              <Form
                onFinish={onFinish}
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
              >
                <Form.Item
                  label={<TranslatedText>Name</TranslatedText>}
                  name="name"
                  rules={[
                    { required: true, message: <TranslatedText>Please enter your name.</TranslatedText> },
                  ]}
                >
                  <Input placeholder="Enter your name" />
                </Form.Item>
                <Form.Item
                  label={<TranslatedText>Email</TranslatedText>}
                  name="email"
                  rules={[
                    { required: true, message: <TranslatedText>Please enter your email.</TranslatedText> },
                    { type: "email", message: <TranslatedText>Please enter a valid email.</TranslatedText> },
                  ]}
                >
                  <Input placeholder="Enter your email" />
                </Form.Item>
                <Form.Item
                  label={<TranslatedText>Message</TranslatedText>}
                  name="message"
                  rules={[
                    { required: true, message: <TranslatedText>Please enter your message.</TranslatedText> },
                  ]}
                >
                  <TextArea placeholder="Message" rows={4} />
                </Form.Item>
                <Form.Item>
                  <div className="center">
                    <HoverButton type="primary" htmlType="submit">
                      <TranslatedText>Send</TranslatedText>
                    </HoverButton>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HelpandSupport;
