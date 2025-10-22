import { Button, Col, ConfigProvider, Form, Image, Input, Typography, notification, Row, theme } from "antd";
import React, { useEffect, useState } from "react";
import "../Assests/Styles/login.css";
import { NavLink, useNavigate } from "react-router-dom";
import { forgetPassword, login } from "../API/auth";
import { encryptText } from "../Utils/encryption";
import { handleLogout } from "../Utils/updateUserStates";
import CommonButton from "../Components/Controls/CommonButton";
import { useMediaQuery } from "react-responsive";
import CustomModal from "../Components/Controls/CustomModal";
const { Text } = Typography

const Signin = ({
  setUserData,
  setUserToken,
  notificationType,
  setNotificationType,
}) => {
  const [error, setError] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resetloading, setRestLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const [forget, setForget] = useState(false);


  const { token } = theme.useToken()

  const isDesktop = useMediaQuery({ minWidth: 768 })

  useEffect(() => {
    if (notificationType === "success") {
      api["success"]({
        message: "Account Created Successfully",
        description: "Kindly Signin to your account!",
      });
      setNotificationType(null);
    }
  }, [notificationType]);

  useEffect(() => {
    handleLogout(setUserData, setUserToken);
  }, []);



  const onFinish = async (values) => {
    setLoading(true);
    const loginData = await login(values?.email, values?.password);
    if (loginData?.status === 200) {
      localStorage.setItem(
        encryptText("token"),
        encryptText(
          JSON.stringify({
            access: loginData?.data?.access,
            refresh: loginData?.data?.refresh,
          })
        )
      );
      localStorage.setItem(
        encryptText("user"),
        encryptText(
          JSON.stringify({
            id: loginData?.data?.id,
            email: loginData?.data?.username,
            role: loginData?.data?.role,
            account: false,
            paid: loginData?.data?.paid,
            payment_status: loginData?.data?.payment_status,
          })
        )
      );
      setUserData({
        id: loginData?.data?.id,
        email: loginData?.data?.username,
        role: loginData?.data?.role,
        account: false,
        paid: loginData?.data?.paid,
        payment_status: loginData?.data?.payment_status,
      });
      setUserToken({
        access: loginData?.data?.access,
        refresh: loginData?.data?.refresh,
      });
      loginData?.data?.role === "admin"
        ? navigate("/home")
        : navigate("/dashboard");
    } else setError("*wrong email/password");
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  const handleCancel = () => {
    setForget(false)
  }


  const contentStyle = {
    color: token.colorTextTertiary,
    backgroundColor: token.colorBgBase,
    borderTopLeftRadius: isDesktop ? token.borderRadiusLG : '0',
    borderBottomLeftRadius: isDesktop ? token.borderRadiusLG : '0',
    height: '100vh',
    width: "50%",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  };


  const LogoStyle = {
    height: isDesktop ? "200px" : "150px",
    width: isDesktop ? "200px" : "150px",
    margin: "0 auto",
    objectFit: 'contain',
  }

  const container = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundImage: "url(/img/backgroundImg/Wallmockup.png)",
    height: '100vh',
    backgroundSize: "cover",
    backgroundPosition: "left",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }

  const formContainer = {
    padding: isDesktop ? "40px 24px 0px 24px" : "",
  }


  const input = {
    marginTop: "6px",
    padding: isDesktop ? "12px" : "10px",
    borderRadius: "50px",
  }
  const inputEmail = {
    marginTop: "6px",
    padding: isDesktop ? "10px" : "8px",
    borderRadius: "50px",
  }

  const ImageContainer = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: isDesktop ? "0" : "12%",

  }

  const InputContainer = {
    padding: isDesktop ? "0 0 0 0 " : "0px",


  }

  const navLinks = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "20px 4px",
    fontWeight: "bold",
  }

  const leftImage = {
    height: '100vh',
    backgroundSize: "contain",
    backgroundPosition: "left",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }

  const brandLogoBox = {
    marginTop: "10px",
    position: 'absolute',
    top: 0,
    left: 15
  }

  const brandLogo = {
    height: "50px"
  }

  const handleSubmit = async (value) => {
    setErrorEmail("")
    setRestLoading(true)
    const forgetEmail = await forgetPassword(value.email);
    if (!forgetEmail) {
      setErrorEmail("Enter valied email")
      setRestLoading(false)
    }
    else {
      notification.success({
        message: "Email sent successfully",
        description: "Kindly check your email ",
      });
      setForget(false)
      setRestLoading(false)
    }
  }

  const ForgetFormFied = () => (
    <Form
      name="basic"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      initialValues={{ remember: false }}
      onFinish={handleSubmit}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Please input your email!" },
        ]}
        style={{ marginBottom: "20px" }}
      >
        <Input
          style={inputEmail}
          placeholder="Enter Your Email Email"
          type="email"
        />
      </Form.Item>
      {errorEmail ? <span style={{ color: "red" }}>{errorEmail}</span> : null}

      <Form.Item>
        <CommonButton
          type="primary"
          htmlType="submit"
          size='large'
          loading={resetloading}
          style={{ width: "100%" }}
        >
          Submit
        </CommonButton>
      </Form.Item>
    </Form>
  )

  return (
    <>
      {contextHolder}
      <Row style={container}>
        <Col xs={0} md={12} lg={12} style={leftImage}  >
          <div style={brandLogoBox} >
            <img style={brandLogo} src="/img/Logo/GrowthValue logo.png" alt="logo" />
          </div>
        </Col>
        <Col xs={24} md={12} lg={12} style={contentStyle}>
          <div style={formContainer} >
            <div style={ImageContainer}>
              <Image
                visible={false}
                preview={false}
                style={LogoStyle} src="/img/Logo/GrowthValue logo.png" alt="logo" />
            </div>
            <div style={InputContainer}>
              <Form
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ width: isDesktop ? "79%" : "86%", margin: '0 auto', }}
                initialValues={{ remember: false }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Please input your email!" },
                  ]}
                  style={{ marginBottom: "20px" }}
                >
                  <Input style={input} size='large' placeholder="Email" />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: "Please input your password!" },
                  ]}
                  style={{ marginBottom: "20px", marginTop: "20px" }}
                >
                  <Input.Password style={input} size='large' placeholder="Password" />
                </Form.Item>

                {error ? <span style={{ color: "red" }}>{error}</span> : null}

                <Form.Item >
                  <CommonButton
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    disabled={loading}
                  >
                    Submit
                  </CommonButton>
                </Form.Item>

                <div style={navLinks}>
                  <NavLink to="/sign-up">Create Account</NavLink>
                  <Text style={{ cursor: 'pointer', color: token.colorPrimary }} onClick={() => setForget(!forget)}>Forgot Password ?</Text>
                </div>
              </Form>
            </div>
          </div>
        </Col>

      </Row>
      <CustomModal
        open={forget}
        title={"Forgot Password "}
        handleCancel={handleCancel}
        footer={null}
        closable={true}
        content={<ForgetFormFied />}
      />
    </>
  );
};

export default Signin;
