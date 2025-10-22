import React, { useState } from "react";
import "../../Assests/Styles/faq.css";
import { CaretDownOutlined } from "@ant-design/icons";
import TranslatedText from "../../Components/Controls/TranslatedText"; 

const FAQs = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [data, setData] = useState([
    {
      question: "What is the vision of Growth Value?",
      answer:
        "The vision of Growth Value is to create a cutting-edge platform that revolutionizes how people interact with technology. By leveraging innovative solutions and advanced AI capabilities, Growth Value aims to enhance productivity, simplify complex tasks, and provide seamless user experiences across various domains, making technology more accessible and beneficial to all.",
    },
    {
      question: "How does Growth Value ensure data security?",
      answer:
        "Growth Value implements robust data encryption, multi-factor authentication, and regular security audits to protect user data. Additionally, stringent privacy policies and compliance with industry standards ensure data security and confidentiality.",
    },
    {
      question: "What are the key features of Growth Value?",
      answer:
        "Growth Value offers a user-friendly interface, real-time data analytics, customizable workflows, and integration with popular third-party tools. It also provides AI-powered recommendations, seamless collaboration, and automated task management, enhancing overall efficiency.",
    },
    {
      question: "How can I get started with Growth Value?",
      answer:
        "To get started with Growth Value, visit our official website and sign up for an account. Once registered, you can explore the platform's features, set up your preferences, and begin using Growth Value to streamline your tasks and projects.",
    },
    {
      question: "Does Growth Value support mobile devices?",
      answer:
        "Yes, Growth Value is designed to be mobile-responsive and can be accessed from various devices, including smartphones and tablets. Whether you are on the go or working remotely, you can conveniently manage your tasks and projects using Growth Value's mobile-friendly interface.",
    },
    {
      question: "Can I integrate Growth Value with other tools?",
      answer:
        "Absolutely! Growth Value offers seamless integration with popular productivity and collaboration tools such as Google Workspace, Microsoft 365, and Trello. This allows you to sync data, tasks, and calendars effortlessly for a unified work experience.",
    },
    {
      question: "Is Growth Value suitable for small businesses?",
      answer:
        "Yes, Growth Value caters to businesses of all sizes, including small and medium enterprises. Its scalable features, cost-effective plans, and intuitive user interface make it an ideal solution for small businesses seeking to enhance their project management and team collaboration.",
    },
    {
      question: "Does Growth Value provide customer support?",
      answer:
        "Absolutely! Growth Value offers dedicated customer support via email, live chat, and phone. Our team of experts is available to assist you with any queries, technical issues, or guidance to ensure a smooth experience with Growth Value.",
    },
    {
      question: "Can I customize the dashboard in Growth Value?",
      answer:
        "Yes, Growth Value provides customizable dashboards, allowing you to personalize the layout, widgets, and data visualization based on your preferences. This feature enables you to tailor the dashboard to display the most relevant information for your projects and workflows.",
    },
    {
      question: "Does Growth Value offer a free trial?",
      answer:
        "Yes, Growth Value provides a free trial period for new users. During the trial, you can explore the platform's features, test its functionalities, and assess its suitability for your needs. After the trial, you can choose from various subscription plans based on your requirements.",
    },
  ]);

  const handleQuestionClick = (index) => {
    if (index === expandedIndex) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <div className="faq">
      <div className="page-header">
        <div className="title-header">
          <span>
            <TranslatedText>Frequently Asked Questions</TranslatedText>
          </span>
        </div>

        <div className="subtitle-header">
          <span>
            <TranslatedText>Get in touch and let us know how we can help</TranslatedText>
          </span>
        </div>
      </div>

      <div className="faq-container">
        {data?.map((item, index) => (
          <div
            key={index}
            className={`faq-item ${expandedIndex === index ? "expanded" : ""}`}
            onClick={() => handleQuestionClick(index)}
          >
            <div className="faq-question">
              <span>
                <TranslatedText>{item.question}</TranslatedText>
              </span>
              <CaretDownOutlined />
            </div>
            {expandedIndex === index && (
              <div className="faq-answer">
                <span>
                  <TranslatedText>{item.answer}</TranslatedText>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
