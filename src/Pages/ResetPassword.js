import { Button, Card, Form, Input, Typography, notification, theme } from 'antd';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CommonButton from '../Components/Controls/CommonButton';
import { convertObjectToBase64, resetPassword } from '../API/auth';
import { useMediaQuery } from 'react-responsive';
import { encryptText } from '../Utils/encryption';
import Meta from 'antd/es/card/Meta';
import TranslatedText from '../Components/Controls/TranslatedText'; // Import TranslatedText

const ResetPassword = (props) => {
    const { Title, Text } = Typography;
    const [error, setError] = useState("");
    const [api, contextHolder] = notification.useNotification();
    const [loading, setLoading] = useState(false);
    const { token } = theme.useToken();

    const navigate = useNavigate();
    const isDesktop = useMediaQuery({ minWidth: 768 });

    const { userId } = useParams();
    console.log(userId);

    const onFinish = async (values) => {
        setLoading(true);
        if (values.password !== values.confirmPassword) {
            api.error({
                message: <TranslatedText>Password mismatch</TranslatedText>,
                description: <TranslatedText>Please try again!</TranslatedText>,
            });
            setLoading(false);
        }

        if (values.password.length < 8 || values.confirmPassword.length < 8) {
            api.error({
                message: <TranslatedText>Password length must have at least 8 characters</TranslatedText>,
                description: <TranslatedText>Please try again!</TranslatedText>,
            });
            setLoading(false);
        } else {
            const base64String = convertObjectToBase64({
                reset_token: userId,
                new_password: values.password,
                confirm_password: values.confirmPassword,
            });
            resetPassword({ token: base64String })
                .then((res) => {
                    if (res && res.data) {
                        setTimeout(() => {
                            notification.success({
                                message: <TranslatedText>Password reset successfully</TranslatedText>,
                                description: <TranslatedText>Kindly Sign in to your account!</TranslatedText>,
                            });
                            navigate("/signin");
                            setLoading(false);
                        }, 1000);
                    } else if (res && res.error) {
                        notification.error({
                            message: <TranslatedText>Invalid password</TranslatedText>,
                            description: <TranslatedText>Please try again!</TranslatedText>,
                        });
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    notification.error({
                        message: <TranslatedText>Password reset failed</TranslatedText>,
                        description: <TranslatedText>Please try again!</TranslatedText>,
                    });
                    setLoading(false);
                });
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    };

    const input = {
        marginTop: "6px",
        padding: isDesktop ? "8px" : "6px",
        borderRadius: "50px",
        fontSize: isDesktop ? token.fontSizeLG : token.fontSizeSM,
    };
    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f0f2f5',
        },
        card: {
            minWidth: "300px",
            maxWidth: '420px',
            padding: '0px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
            borderRadius: '10px',
        },
        brandLogoBox: {
            marginTop: "10px",
            position: 'absolute',
            top: 0,
            left: 15,
        },
        brandLogo: {
            height: "50px",
        },
        brandLogo_2: {
            height: "85px",
            paddingBottom: "25px",
        },
        label: {
            fontSize: '15px',
        },
    };

    return (
        <>
            {contextHolder}
            <div>
                <div style={styles.brandLogoBox}>
                    <img style={styles.brandLogo} src="/img/Logo/GrowthValue logo.png" alt="logo" />
                </div>
            </div>

            <div style={styles.container}>
                <Card style={styles.card}>
                    <Meta
                        style={{ justifyContent: "center", alignItems: "center" }}
                        avatar={<img style={styles.brandLogo_2} src="/img/Logo/GrowthValue logo.png" alt="logo" />}
                    />
                    <Form
                        name="basic"
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        initialValues={{ remember: false }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                    >
                        <Form.Item
                            name="password"
                            label={<span style={styles.label}><TranslatedText>New Password</TranslatedText></span>}
                            rules={[{ required: true, message: <TranslatedText>Please input your password!</TranslatedText> }]}
                            style={{ marginBottom: '15px' }}
                        >
                            <Input.Password size='large' style={input} placeholder="New Password" />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label={<span style={styles.label}><TranslatedText>Confirm Password</TranslatedText></span>}
                            rules={[{ required: true, message: <TranslatedText>Please input your confirm password!</TranslatedText> }]}
                            style={{ marginBottom: '20px' }}
                        >
                            <Input.Password style={input} placeholder="Confirm Password" />
                        </Form.Item>

                        <Form.Item>
                            <Button loading={loading} type="primary" htmlType="submit" size="large" block>
                                <TranslatedText>Submit</TranslatedText>
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </>
    );
}

export default ResetPassword;
