import React from 'react';
import { Card, Button, Typography } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { CrownIcon } from '../../Controls/Icons';
import TranslatedText from '../../Controls/TranslatedText'; 

const { Title, Text } = Typography;

const NewPlansCard = ({ title, subtitle, price, period, buttonLabel, features, highlight, handleChangePlan, handleCancelPlan, plan }) => {

    const crownIcon = {
        height: "40px",
        width: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fff",
        borderRadius: "50%",
    };

    const cardStyle = {
        borderRadius: '10px',
        border: highlight ? '1px solid #d4a053' : '1px solid #ddd',
        overflow: 'hidden',
        backgroundColor: highlight ? '#fff7e6' : '#fff',
    };

    const planDiv = { backgroundColor: highlight ? '#fff2cc' : '#f0f0f0', minHeight: "360px" };
    const IconDiv = { textAlign: 'left', padding: "20px", display: "flex", justifyContent: "flex-end", alignItems: "center" };

    return (
        <Card
            style={cardStyle}
            bodyStyle={{ padding: '0px', minHeight: "730px" }}
        >
            <div style={planDiv}>
                <div style={IconDiv}>
                    <div style={crownIcon}>
                        <CrownIcon />
                    </div>
                </div>
                <div style={{ textAlign: 'left', padding: "0px 20px" }}>
                    <Title level={3} style={{ textTransform: "uppercase" , margin:"0 0 10px 0" }}>
                        <TranslatedText>{title}</TranslatedText>
                    </Title>
                    <Text>
                        <TranslatedText>{subtitle}</TranslatedText>
                    </Text>
                    <div style={{ margin: '20px 0' }}>
                        <Title level={2} style={{ margin: 0 }}>
                            <TranslatedText>{price}</TranslatedText>
                        </Title>
                        <Text type="secondary">
                            <TranslatedText>{period}</TranslatedText>
                        </Text>
                    </div>
                    {plan?.selected && (
                        <Text type="secondary" style={{ textAlign: "center" }}>
                            <TranslatedText>Current Validity: {plan.next_date}</TranslatedText>
                        </Text>
                    )}

                    <Button
                        type="primary"
                        onClick={!plan?.selected ? () => handleChangePlan(plan) : handleCancelPlan}
                        size='large'
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            backgroundColor: highlight ? '#d4a053' : '#555',
                            borderColor: highlight ? '#d4a053' : '#555',
                            marginBottom: "40px"
                        }}
                    >
                        <TranslatedText>{!plan?.selected ? buttonLabel : "Cancel Subscription"}</TranslatedText>
                    </Button>
                </div>
            </div>

            <div style={{ textAlign: 'left', padding: "20px" }}>
                <Title level={4} style={{ marginTop: 0 }}>
                    <TranslatedText>Features:</TranslatedText>
                </Title>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {features.map((feature, index) => (
                        <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                            <CheckOutlined style={{ color: '#d4a053', marginRight: '8px' }} />
                            <TranslatedText>{feature}</TranslatedText>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};

export default NewPlansCard;
