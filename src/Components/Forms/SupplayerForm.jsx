import { Button, Divider, FloatButton, Form, Input, notification, theme } from 'antd';
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import CommonButton from '../Controls/CommonButton';
import { updateUser, userDetails } from '../../API/user';
import { FaPlus } from "react-icons/fa";
import TranslatedText from '../Controls/TranslatedText'; // Import TranslatedText
import { useLanguage } from '../../API/LanguageContext';

const SupplayerForm = (props) => {
    const { user, userToken, handleCancel } = props;
    const {language} = useLanguage()

    const [forms, setForms] = useState([{ name: '', website: '' }]);
    const [api, contextHolder] = notification.useNotification();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = theme.useToken();

    const isDesktop = useMediaQuery({ minWidth: 768 });

    const handleInputChange = (index, field, value) => {
        const newForms = [...forms];
        newForms[index][field] = value;
        setForms(newForms);
    };

    const addMoreForm = () => {
        setForms([...forms, { name: '', website: '' }]);
    };

    const onFinish = async (values) => {
        setLoading(true);
        const updatedUser = { id: user.id, vendors: forms };
        const res = await updateUser(userToken, updatedUser);
        if (res?.status === 200) {
            api.success({
                message: <TranslatedText>Vendor added successfully!</TranslatedText>,
                description: <TranslatedText>Vendor details have been added successfully.</TranslatedText>,
                placement: "topRight",
                duration: 4000
            });
            await userDetails(userToken, user.id);
            handleCancel();
        } else {
            api.error({
                message: <TranslatedText>Enter a valid URL</TranslatedText>,
                description: <TranslatedText>Please try again!</TranslatedText>,
                placement: "topRight",
            });
        }
        setLoading(false);
    };

    const onFinishFailed = (errorInfo) => {
        console.log(errorInfo);
    };

    const getLeftPosition = (language) => {
        if (language === 'en') {
            return '142px';
        } else if (language === 'fr' || language === 'nl') {
            return '215px';
        } else if (language === "es"){
            return '185px'
        }
        return '142px'; 
    };

    const input = {
        marginTop: "6px",
        padding: isDesktop ? "8px" : "6px",
        borderRadius: "50px",
    };

    const button = {
        fontSize: "18px",
        fontWeight: 600,
        height: isDesktop ? "40px" : "36px",
        padding: isDesktop ? "6px 14px" : "6px",
        borderRadius: "50px",
        width: "100%",
    };

    return (
        <div>
            {contextHolder}
            <FloatButton
                icon={<FaPlus style={{ marginTop: "2px" }} fontSize={16} />}
                onClick={addMoreForm}
                type='primary'
                style={{
                    position: "absolute",
                    top: "20px",
                    left: getLeftPosition(language),
                    height: "28px",
                    width: "28px",
                    textAlign: "center",
                }}
            />
            {forms.map((form, index) => (
                <Form
                    key={index}
                    name={`form_${index}`}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ width: "100%", margin: '0 auto', marginBottom: "20px" }}
                    initialValues={{ name: form.name, website: form.website }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        name={`vendor_${index}`}
                        label={
                            <TranslatedText>
                                {`Supplier ${index + 1}`}
                            </TranslatedText>
                        }
                        rules={[{ required: true, message: <TranslatedText>Please input supplier name!</TranslatedText> }]}
                        style={{ marginBottom: "20px" }}
                    >
                        <Input
                            style={input}
                            size='small'
                            placeholder="Name"
                            value={form.name}
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        name={`website_${index}`}
                        label={<TranslatedText>Website URL</TranslatedText>}
                        rules={[{ required: true, message: <TranslatedText>Please add website URL</TranslatedText> }]}
                        style={{ marginBottom: "20px", marginTop: "20px" }}
                    >
                        <Input
                            style={input}
                            size='small'
                            placeholder="https://example.com"
                            value={form.website}
                            onChange={(e) => handleInputChange(index, 'website', e.target.value)}
                        />
                    </Form.Item>

                    {error && <span style={{ color: "red" }}>{error}</span>}
                </Form>
            ))}

            <Form.Item style={{ textAlign: 'center' }}>
                <CommonButton
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loading}
                    disabled={loading}
                    onClick={onFinish}
                    style={button}
                >
                    <TranslatedText>Submit</TranslatedText>
                </CommonButton>
            </Form.Item>
        </div>
    );
};

export default SupplayerForm;
