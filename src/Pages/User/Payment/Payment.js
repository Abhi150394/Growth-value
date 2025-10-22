import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getClientKey } from "../../../API/payment";
import TranslatedText from "../../../Components/Controls/TranslatedText"; // Import TranslatedText

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const Payment = ({ userToken, userData }) => {
  const location = useLocation();
  const planDetails = location.state;
  const [clientSecret, setClientSecret] = useState(null);

  useEffect(() => {
    const fetchDta = async () => {
      const res = await getClientKey(userToken, planDetails?.price_id);
      if (res?.data?.client_secret) {
        setClientSecret(res?.data?.client_secret);
      } else {
        console.log(<TranslatedText>Data fetching failed</TranslatedText>); // Example of wrapping text
      }
    };
    fetchDta();
  }, [userToken, planDetails?.price_id]);

  return (
    <div id="checkout">
      {clientSecret && (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      )}
    </div>
  );
};

export default Payment;
