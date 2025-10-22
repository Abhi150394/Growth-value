import { HeartFilled } from "@ant-design/icons";
import { useState } from "react";

export const HeartFilledIcon = () => {

    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    return (
        <HeartFilled style={{
            color: "#ff4d4f",
            fontSize: hovered ? "36px" : "30px",
            transition: "font-size 0.3s ease-in-out",
            cursor: 'pointer',
        }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        />

    )

}