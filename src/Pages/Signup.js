import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  notification,
  Row,
  Select,
  theme,
} from "antd";
import React, { useMemo, useState } from "react";
import "../Assests/Styles/login.css";
import { NavLink, useNavigate } from "react-router-dom";
import { signup } from "../API/auth";
import { GrFormNext } from "react-icons/gr";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import CountryList from "react-select-country-list";
import { useMediaQuery } from "react-responsive";
import CommonButton from "../Components/Controls/CommonButton";
import { useForm } from 'antd/lib/form/Form';

const Signup = (props) => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const countries = useMemo(() => CountryList().getData(), []);
  const [api, contextHolder] = notification.useNotification();
  const [loader, setLoader] = useState(false)
  const [categories, setCategories] = useState('')
  const { token } = theme.useToken()
  const isDesktop = useMediaQuery({ minWidth: 768 })
  const [form] = useForm();
  const onFinish = async (values) => {
    setLoader(true)
    signup(
      categories,
      values.name,
      values.email,
      values.password,
      values?.phone,
      values.bussiness,
      values.bussinessaddress,
      values?.website,
      values.country,
      values.zip,
      values.vat,
    ).then(res => {
      if (res?.error) {
        api.error({
          message: res.error[0].phone || res.error[0].email,
          description: "Please try again!",
        });
        setLoader(false)
      }
      else {
        props.setNotificationType("success");
        setTimeout(() => {
          setLoader(false)
          navigate("/signin");
        }, 2000)
      }

    }).catch((err) => {
      api.error({
        message: "Account Was Not Created",
        description: "Please try again!",
      });
      setLoader(false)

    })



  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
  };

  const handlePageAdd = () => {
    if (page === 2) {
      form
        .validateFields(['name', 'bussiness', 'email', 'phone', 'country'])
        .then(() => {
          setPage(page + 1);
        })
        .catch((err) => {
          console.log('Validation Error:', err);
        });
    } else {
      setPage(page + 1);
    }
  };

  const handlePageSubtract = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const sectors = [
    {
      id: 1,
      name: "French fries store",
    },
    {
      id: 2,
      name: "Pizzeria",
    },
    {
      id: 3,
      name: "Restaurant",
    },
    {
      id: 4,
      name: "Sandwiche store",
    },
    {
      id: 5,
      name: "Pita & Kebab store",
    },
    {
      id: 6,
      name: "Other",
    }
  ]



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

  const contentStyle = {
    color: token.colorTextTertiary,
    backgroundColor: token.colorBgBase,
    borderTopLeftRadius: isDesktop ? token.borderRadiusLG : '0',
    borderBottomLeftRadius: isDesktop ? token.borderRadiusLG : '0',
    height: '100vh',
    width: "50%",
    boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
    overflow: 'hidden',
    overflowY: 'scroll'
  };

  const formContainer = {
    padding: isDesktop ? "10px 8px 0px 8px" : "",
  }

  const ImageContainer = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }

  const input = {
    marginTop: "4px",
    padding: isDesktop ? "8px 12px" : "6px 12px",
    borderRadius: "50px",
    fontSize: isDesktop ? token.fontSizeLG : token.fontSizeSM,
  }


  const InputContainer = {
    padding: "0 0 0 0 "
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

  const heading = {
    color: token.colorPrimary,
    fontSize: isDesktop ? token.fontSizeHeading3 : token.fontSizeHeading4,
    marginBottom: "0px",
    marginTop: "0px",
  }

  const paragraph = {
    color: "#000",
    fontSize: isDesktop ? token.fontSizeLG : token.fontSizeSM,
    marginBottom: "0px",
    marginTop: "4px",
    textAlign: "center",
    width: "65%",
    fontWeight: 600,
  }

  const button = {
    fontSize: isDesktop ? token.fontSizeLG : token.fontSizeLG,
    fontWeight: 600,
    height: isDesktop ? "40px" : "auto",
    padding: isDesktop ? "5px 10px 5px" : "4px 12px",
    borderRadius: "50px",

  }

  const phoneInputStyle = {
    padding: "4px",
    borderRadius: "50px",
    border: "1px solid #d9d9d9",
  }
  const navLinks = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: isDesktop ? "20px 4px" : "10px 4px",
    fontWeight: "bold",
  }

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
          <div className="">
            <div className="arrow-container">
              <GrFormNext
                className={`arrow-inverted arrow-button ${page === 1 && "arrow-disabled"
                  }`}
                onClick={handlePageSubtract}
              />
            </div>
          </div>
          <div style={formContainer}>
            <div style={ImageContainer}>
              <h1 style={heading} >Create an account</h1>
              <p style={paragraph}>you will shortly create your own professional account on
                <br />GrowthValue</p>

              <h1 style={heading} >{`${page == 1 ? "Step" : "Stage"} ${page} of 3`}</h1>
            </div>


            <div style={InputContainer}>
              <Form
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{ width: isDesktop ? "79%" : "86%", margin: '0 auto', }}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="form"
                form={form}
              >
                <div style={{ display: page === 1 ? "block" : "none" }}>
                  <Form.Item style={{ marginTop: "20px", }} >
                    <Flex gap={15} wrap justify="center" align="center" >
                      {sectors.map((option, index) => (
                        <Button style={button} name="categories" key={index} type="primary" onClick={() => {
                          handlePageAdd()
                          console.log(option.name)
                          setCategories(option.name)

                        }}>
                          {option.name}
                        </Button>
                      ))}
                    </Flex>
                  </Form.Item>
                </div>

                <div style={{ display: page === 2 ? "block" : "none" }}>
                  <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                      { required: true, message: "Please input your name!" },
                    ]}
                  >
                    <Input style={input} placeholder="Name" />
                  </Form.Item>
                  <Form.Item
                    label="Business Name"
                    name="bussiness"
                    rules={[
                      { required: true, message: "Please input your name!" },
                    ]}
                  >
                    <Input style={input} placeholder="Business Name" />
                  </Form.Item>


                  <Form.Item
                    label="Business Email"
                    name="email"
                    type="email"
                    rules={[
                      { required: true, message: "Please input your email!" },
                    ]}
                  >
                    <Input style={input} placeholder="Business Email" />
                  </Form.Item>

                  <Form.Item
                    label="Phone"
                    name="phone"
                    rules={[
                      { required: true, message: "Please input your phone!" },
                    ]}
                  >
                    <PhoneInput style={phoneInputStyle} placeholder="Phone" defaultCountry="BE" />
                  </Form.Item>

                  <Form.Item
                    label="Country"
                    name="country"
                    rules={[
                      { required: true, message: "Please input your country!" },
                    ]}
                  >
                    <Select
                      size="large"
                      showSearch={true}
                      placeholder="Country"
                      optionFilterProp="label"
                      options={countries}

                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    size="large"
                    style={{ width: "100%", marginTop: "10px" }}
                    onClick={() => handlePageAdd()}
                  >
                    Save and Next
                  </Button>
                </div>

                <div style={{ display: page === 3 ? "block" : "none" }}>

                  <Form.Item
                    label="Zip"
                    name="zip"
                    rules={[
                      { required: true, message: "Please input your zip code!" },
                    ]}
                  >
                    <Input style={input} placeholder="Zip" type={"number"} />
                  </Form.Item>

                  <Form.Item
                    label="VAT"
                    name="vat"
                    rules={[
                      {
                        required: true,
                        message: "Please input your VAT number!",
                      },
                    ]}
                  >
                    <Input style={input} placeholder="VAT" type={"text"} />
                  </Form.Item>

                  <Form.Item
                    label="Business Address"
                    name="bussinessaddress"
                    rules={[
                      {
                        required: false,
                        message: "Please input your business address!",
                      },
                    ]}
                  >
                    <Input style={input} placeholder="Business Address" />
                  </Form.Item>
                  <Form.Item
                    label="Website Link"
                    name="website"
                    rules={[
                      { required: false, message: "Please input your website Link!" },
                    ]}
                  >
                    <Input style={input} placeholder="https://example.com" />
                  </Form.Item>

                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      { required: true, message: "Please input your password!" },
                    ]}
                  >
                    <Input.Password style={input} placeholder="Password" />
                  </Form.Item>

                  <Form.Item >
                    <Button loading={loader} style={{ width: "100%", marginTop: "10px" }} type="primary" size="large" htmlType="submit">
                      Sign Up
                    </Button>
                  </Form.Item>
                </div>



                <div
                  style={navLinks}
                >
                  <NavLink to="/sign-in">Already have an Account?</NavLink>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row >
    </>
  );
};

export default Signup;
