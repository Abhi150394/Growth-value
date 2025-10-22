import { Col, Row, Spin, theme, Divider, Card, Button, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlans } from "../../../API/plans";
import { CheckOutlined } from '@ant-design/icons';

import "../../../Assests/Styles/plans.css";
import SubscriptionCard from "../../../Components/Cards/SubscriptionCard/SubscriptionCard";
import SkeltonCard from "../../../Components/Cards/SkeltonCard/SkeltonCard";
import HoverButton from "../../../Components/Controls/HoverButton";
import { useMediaQuery } from "react-responsive";
import NewPlansCard from "../../../Components/Cards/SubsPlans/NewPlansCard";
import TranslatedText from "../../../Components/Controls/TranslatedText"; // Import TranslatedText

const { Title, Text } = Typography;

const Plans = ({ userData, userToken }) => {
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDesktop = useMediaQuery({ minWidth: 768 });
  const { token } = theme.useToken();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getPlans(userToken);
      setPlans(res?.data);
      setLoading(false);
    };
    fetchData();
  }, [userToken]);

  const navigate = useNavigate();
  const handleChoosePlan = (e) => {
    navigate("/checkoutForm", {
      state: e,
    });
  };

  const demo = () => {
    navigate("/demo")
  };

  // console.log("Plans:", plans)

  const myplans = [
    {
      title: "Quarterly Subscription", 
      subtitle: "Flexible short-term access with all basic functionalities and features", 
      price: `€ ${plans && plans[2].price}`,
      price_id: plans && plans[2].price_id,
      period: `per ${plans && plans[2].interval_count} ${plans && plans[2].interval}`,
      buttonLabel: "Choose Plan", 
      features: [
        "Price comparison for up to 2 suppliers",
        "Basic search function and product filters",
        "Standard reports and analyses",
        "Email support",
        "Access to the standard demo"
      ],
      highlight: false
    },
    {
      title: "Yearly Subscription", 
      subtitle: "More cost-effective than the quarterly subscription and includes more advanced features.",
      price: `€ ${plans && plans[1].price}`,
      price_id: plans && plans[1].price_id,
      period: `per ${plans && plans[1].interval_count} ${plans && plans[1].interval}`,
      buttonLabel: "Choose Plan",
      features: [
        "Everything in the Quarterly Subscription, plus:",
        "Price comparison for up to 5 suppliers",
        "Advanced search function and product filters",
        "Personalized reports and analyses",
        "Coming soon: AI-driven inventory recommendations",
        "24/7 chat and email support",
        "Priority access to new features and updates"
      ],
      highlight: true
    },
    {
      title: "Lifetime Subscription", 
      subtitle: "One-time payment for lifetime access to all premium features and savings.",
      price: `€ ${plans && plans[0].price}`,
      price_id: plans && plans[0].price_id,
      period: `per ${plans && plans[0].interval_count} ${plans && plans[0].interval}`,
      buttonLabel: "Choose Plan",
      features: [
        "Everything in the Year Subscription, plus:",
        "Unlimited price comparison of suppliers",
        "Wishlist function",
        "Access to up-to-date market insights and trend analyses",
        "Personal account manager for customized support",
        "Coming soon: AI-driven dynamic pricing adjustment",
        "Exclusive access to beta features and early access programs"
      ],
      highlight: true
    }
  ];
  

  const buttonBox = {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "20px",
    fontWeight: "bold",
    padding: "0px 26px",
  };

  const button = {
    width: isDesktop ? "10%" : "30%",
    background: token.colorPrimary,
    color: "#fff"
  };

  return (
    <>
      <div style={buttonBox}>
        <HoverButton style={button} onClick={demo}>
          <TranslatedText>Demo</TranslatedText>
        </HoverButton>
      </div>
      <div className="plans">
        {!loading ? (
          <Row justify="center" gutter={[16, 16]} style={{ padding: '20px', margin: "0px" }}>
            {myplans.map((plan, index) => (
              <Col xs={24} sm={12} md={8} lg={12} xl={6} xxl={6} key={index}>
                <NewPlansCard {...plan} plan={plan} handleChangePlan={handleChoosePlan} />
              </Col>
            ))}
          </Row>
        ) : (
          <Row gutter={[16, 16]} className="plan-cards-container">
            <SkeltonCard avatar={false} image={false} count={3} loading={loading} />
          </Row>
        )}
      </div>
    </>
  );
};

export default Plans;
