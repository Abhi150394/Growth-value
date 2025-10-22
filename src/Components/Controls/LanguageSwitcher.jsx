import React, { useState } from 'react';
import { Select, Modal } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useLanguage } from '../../API/LanguageContext'; 
const { Option } = Select;

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleChange = (value) => {
        changeLanguage(value);
        setIsModalVisible(false); 
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            <Select
                value={language}
                onChange={handleChange}
                style={{ cursor: 'pointer' }}
                className="custom-dropdown"
            >
                <Option value="en">English</Option>
                <Option value="es">Español</Option>
                <Option value="fr">Français</Option>
                <Option value="nl">Dutch</Option>
            </Select>

            <GlobalOutlined
                className="language-icon"
                onClick={showModal}
            />

            <Modal
                title="Select Language"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Select
                    value={language}
                    onChange={handleChange}
                    style={{ width: '100%' }}
                >
                    <Option value="en">English</Option>
                    <Option value="es">Español</Option>
                    <Option value="fr">Français</Option>
                    <Option value="nl">Dutch</Option>
                </Select>
            </Modal>
        </>
    );
};

export default LanguageSwitcher;
