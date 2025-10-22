import React, { useEffect, useState } from "react";
import "../../Assests/Styles/subscription.css";
import "../../Assests/Styles/plans.css";
import { Row, Col } from "antd";
import { cancelPlan, changePlan, getPlans } from "../../API/plans";
import { handleUpdate } from "../../Utils/updateUserStates";
import NewPlansCard from "../../Components/Cards/SubsPlans/NewPlansCard";
import SkeltonCard from "../../Components/Cards/SkeltonCard/SkeltonCard";

const Subscription = ({ userToken, userData, setUserData }) => {
  const [plans, setPlans] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getPlans(userToken);
      setPlans(res?.data);
      setLoading(false);
    };
    fetchData();
  }, [userToken]);

  const handleChangePlan = async (e) => {
    setLoading(true);
    await changePlan(userToken, e.price_id);
    const res = await getPlans(userToken);
    setPlans(res?.data);
    setLoading(false);
  };

  const handleCancelPlan = async () => {
    setLoading(true);
    await cancelPlan(userToken);
    const res = await getPlans(userToken);
    setPlans(res?.data);
    handleUpdate(false, userData, setUserData, false, false);
    setLoading(false);
  };

  const myplans = plans ? [
    {
      title: "Quarterly Subscription",
      subtitle: "Flexible short-term access with all basic functionalities and features",
      price: `€ ${plans[2]?.price}`,
      price_id: plans[2]?.price_id,
      period: `per ${plans[2]?.interval_count} ${plans[2]?.interval}`,
      buttonLabel: "Choose Plan",
      features: [
        "Price comparison for up to 2 suppliers",
        "Basic search function and product filters",
        "Standard reports and analyses",
        "Email support",
        "Access to the standard demo",
      ],
      highlight: false,
      selected: plans[2]?.selected,
      next_date: plans[2]?.next_date,
    },
    {
      title: "Yearly Subscription",
      subtitle: "More cost-effective than the quarterly subscription and includes more advanced features.",
      price: `€ ${plans[1]?.price}`,
      price_id: plans[1]?.price_id,
      period: `per ${plans[1]?.interval_count} ${plans[1]?.interval}`,
      buttonLabel: "Choose Plan",
      features: [
        "Everything in the Quarterly Subscription, plus:",
        "Price comparison for up to 5 suppliers",
        "Advanced search function and product filters",
        "Personalized reports and analyses",
        "Coming soon: AI-driven inventory recommendations",
        "24/7 chat and email support",
        "Priority access to new features and updates",
      ],
      highlight: true,
      selected: plans[1]?.selected,
      next_date: plans[1]?.next_date,
    },
    {
      title: "Lifetime Subscription",
      subtitle: "One-time payment for lifetime access with all premium features and savings.",
      price: `€ ${plans[0]?.price}`,
      price_id: plans[0]?.price_id,
      period: `per ${plans[0]?.interval_count} ${plans[0]?.interval}`,
      buttonLabel: "Choose Plan",
      features: [
        "Everything in the Year Subscription, plus:",
        "Unlimited price comparison of suppliers",
        "Wishlist function",
        "Access to up-to-date market insights and trend analyses",
        "Personal account manager for customized support",
        "Coming soon: AI-driven dynamic pricing and adjustment",
        "Exclusive access to beta features and early access programs",
      ],
      highlight: true,
      selected: plans[0]?.selected,
      next_date: plans[0]?.next_date,
    }
  ] : [];

  return (
    <div className="plans">
      {!loading ? (
        <Row gutter={[16, 16]} className="plan-cards-container">
        {myplans.map((plan, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <NewPlansCard
              {...plan}  
              plan={plan} 
              handleCancelPlan={handleCancelPlan}
              handleChangePlan={handleChangePlan}
            />
          </Col>
        ))}
      </Row>
      ) : (
        <Row gutter={[16, 16]} className="plan-cards-container">
          <SkeltonCard avatar={false} count={3} loading={loading} />
        </Row>
      )}
    </div>
  );
};

export default Subscription;
