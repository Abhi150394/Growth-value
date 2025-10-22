import { Avatar, Button, Card, Divider, List, Popconfirm, Skeleton, Switch, theme } from 'antd';
import React from 'react';
import HoverButton from '../../Controls/HoverButton';
import { useMediaQuery } from 'react-responsive';
import TranslatedText from '../../Controls/TranslatedText'; // Import TranslatedText

const { Meta } = Card;

const SubscriptionCard = (props) => {
    const { title, plan, handleChangePlan, handleCancelPlan } = props;
    const { token } = theme.useToken();
    const isDesktop = useMediaQuery({ minWidth: 768 });

    const CardStyle = {
        borderRadius: token.borderRadiusSM,
        background: token.colorBgLayout,
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
        paddingTop: token.paddingSM,
        border: plan?.selected ? `1px solid ${token.colorPrimary}` : "none",
        width: "100%",
        minWidth: "260px",
        height: "400px",
    };

    const Cardtitle = {
        color: "#221F1F",
        textAlign: "center",
        textTransform: "uppercase",
        margin: " 0 0 12px 0",
    };

    const divider = {
        borderBlockStart: "1px solid #cccccc",
        margin: "16px 0",
    };

    const heading = {
        textAlign: 'center',
        fontFamily: "Inter !important",
        fontSize: 50,
        fontWeight: 700,
        color: token.colorPrimary,
        margin: 0,
    };

    const sup = {
        fontSize: 20,
        color: token.colorPrimary,
        fontWeight: 700,
    };

    const sub = {
        fontSize: 20,
        color: "#5B5B5B",
        fontWeight: 600,
    };

    const list = {
        lineHeight: "30px",
        fontSize: token.fontSizeXXXL,
        letterSpacing: ".1rem",
        wordSpacing: "2px",
    };

    const listBox = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const ActivePlan = {
        background: token.colorPrimary,
        color: "white",
    };

    return (
        <div style={CardStyle}>
            <h2 style={Cardtitle}>
                <TranslatedText>{title}</TranslatedText>
            </h2>
            <Divider style={divider} />
            <div style={{ padding: "0px 30px", display: "flex", height: "80%", flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                    <h3 style={heading}>
                        <sup style={sup}>
                            <TranslatedText>{plan?.currency}</TranslatedText>
                        </sup>
                        <TranslatedText>{plan?.price}</TranslatedText>
                        <span style={sub}>
                            <TranslatedText>/{plan?.interval}</TranslatedText>
                        </span>
                    </h3>
                </div>
                <div style={listBox}>
                    <ul style={list}>
                        <li>
                            <TranslatedText>{plan?.description}</TranslatedText>
                        </li>
                    </ul>
                </div>
                <div style={{ width: "100%" }}>
                    {!plan?.selected ? (
                        <HoverButton onClick={() => handleChangePlan(plan)}>
                            <TranslatedText>Choose Plan</TranslatedText>
                        </HoverButton>
                    ) : (
                        <>
                            <HoverButton style={ActivePlan} onClick={handleCancelPlan}>
                                <TranslatedText>Cancel Subscription</TranslatedText>
                            </HoverButton>
                            <div style={{ fontWeight: "600", textAlign: "center", paddingTop: "10px" }}>
                                <TranslatedText>Current Validity: {plan?.next_date}</TranslatedText>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionCard;
