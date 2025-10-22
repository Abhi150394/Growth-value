import React from 'react';
import "../../../Assests/Styles/dashboard.css";
import TranslatedText from '../../Controls/TranslatedText'; // Import TranslatedText

const DetailsCard = ({ title, icon, data }) => {
    return (
        <div className="tab">
            <div className="right">
                <div className="icon-container orders-placed">
                    {icon}
                </div>
            </div>
            <div className="left">
                <span className="val">
                    <TranslatedText>{data}</TranslatedText>
                </span>
                <span className="title">
                    <TranslatedText>{title}</TranslatedText>
                </span>
            </div>
        </div>
    );
};

export default DetailsCard;
