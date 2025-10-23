import React, { useState } from "react";
import Select, { components } from "react-select";
import { Box } from "@mui/material";
import { BORDER_RADIUS, COLORS, FONT_WEIGHT } from "../../constants";

const DynamicDropdown = ({
  title,
  icon: TitleIcon,
  options = [],
  onChange,
  width = "25%",
  isClearable=false,
}) => {
  const defaultValue =
    title && TitleIcon ? { value: "__all", label: "All" } : options[0] || null;

  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleChange = (option) => {
    if(!option){
      setSelectedOption({ value: "__all", label: "All" });
      onChange?.({ value: "__all", label: "All" });
    }
    else if (option.value == "auto") {
      setSelectedOption({ value: "day", label: "Day" });
      onChange?.({ value: "day", label: "Day" });
    } else {
      setSelectedOption(option);
      onChange?.(option);
    }
  };

  // Custom option (dropdown list)
  const CustomOption = (props) => (
    <components.Option {...props}>
      <Box display="flex" alignItems="center" gap={1}>
        {props.data.icon && (
          <props.data.icon style={{ fontSize: 16, color: COLORS.textBase }} />
        )}
        <span>{props.data.label}</span>
      </Box>
    </components.Option>
  );

  // Custom single value display
  const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
      <Box display="flex" alignItems="center" gap={0.5}>
        {TitleIcon && <TitleIcon style={{ color: "#000" }} />}
        {title && (
          <span style={{ color: "#000", fontWeight: FONT_WEIGHT.lg }}>
            {title}:
          </span>
        )}
        {props.data.icon && (
          <props.data.icon style={{ fontSize: 16, color: COLORS.textBase }} />
        )}
        <span>{props.data.label}</span>
      </Box>
    </components.SingleValue>
  );

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: COLORS.borderColor,
      boxShadow: state.isFocused ? `0 0 0 1px ${COLORS.bgBase}` : "none",
      "&:hover": { borderColor: COLORS.borderHoverColor },
      borderRadius: BORDER_RADIUS.sm,
      minHeight: 36,
    }),
    singleValue: (provided) => ({ ...provided, color: COLORS.textBase }),
    menu: (provided) => ({
      ...provided,
      borderRadius: BORDER_RADIUS.sm,
      border: `1px solid ${COLORS.bgBase}`,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? COLORS.bgSelected
        : state.isFocused
        ? COLORS.bgBase
        : COLORS.bgLayout,
      color: state.isSelected ? "#000" : COLORS.textBase,
      "&:hover": { backgroundColor: COLORS.bgHoverColor },
    }),
    placeholder: (provided) => ({ ...provided, color: COLORS.bgBase }),
  };

  return (
    <Box
      width={{ xs: "100%", sm: width }}
      minWidth={150}
    >
      <Select
        options={options}
        value={selectedOption}
        onChange={handleChange}
        components={{ SingleValue: CustomSingleValue, Option: CustomOption }}
        isClearable={isClearable && selectedOption.value!=='__all'}
        placeholder={title || TitleIcon ? "All" : options[0]?.label || ""}
        styles={customStyles}
      />
    </Box>
  );
};

export default DynamicDropdown;

// import React, { useState } from "react";
// import Select, { components } from "react-select";
// import { BORDER_RADIUS, COLORS, FONT_WEIGHT } from "../../constants";

// const DynamicDropdown = ({
//     title,
//     icon: Icon,
//     options = [],
//     onChange,
//     width = "200px",
// }) => {

//     const defaultValue =
//         title || Icon ? { value: "__all", label: "All" } : options[0] || null;

//     const [selectedOption, setSelectedOption] = useState(defaultValue);

//     const handleChange = (option) => {
//         setSelectedOption(option);
//         onChange?.(option);
//     };

//     const CustomSingleValue = (props) => (
//         <components.SingleValue {...props}>
//             <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//                 {Icon && <Icon style={{ color: `#000000`}} />}
//                 {title && <span style={{ color: `#000000}`, fontWeight: `${FONT_WEIGHT.lg}` }}>{title}:</span>}
//                 <span>{props.data.label}</span>
//             </div>
//         </components.SingleValue>
//     );

//     const enhancedOptions = options;
//     // title || Icon ? [{ value: "__all", label: "All" }, ...options] : options;

//     const customStyles = {
//         control: (provided, state) => ({
//             ...provided,
//             borderColor:`${COLORS.borderColor}`,
//             boxShadow: state.isFocused ? `0 0 0 1px ${COLORS.bgBase}` : "none",
//             "&:hover": { borderColor: COLORS.borderHoverColor },
//             borderRadius: `${BORDER_RADIUS.sm}px`,
//             minHeight: "36px",
//         }),
//         singleValue: (provided) => ({
//             ...provided,
//             color: COLORS.textBase,
//         }),
//         menu: (provided) => ({
//             ...provided,
//             borderRadius: `${BORDER_RADIUS.sm}px`,
//             border: `1px solid ${COLORS.bgBase}`,
//         }),
//         option: (provided, state) => ({
//             ...provided,
//             backgroundColor: state.isSelected
//                 ? COLORS.bgSelected
//                 : state.isFocused
//                     ? COLORS.bgBase
//                     : COLORS.bgLayout,
//             color: state.isSelected ? "#000" : COLORS.textBase,
//             "&:hover": { backgroundColor: COLORS.bgHoverColor },
//         }),
//         placeholder: (provided) => ({
//             ...provided,
//             color: COLORS.bgBase,
//         }),
//     };

//     return (
//         <div style={{ width }}>
//             <Select
//                 options={enhancedOptions}
//                 value={selectedOption}
//                 onChange={handleChange}
//                 components={title || Icon ? { SingleValue: CustomSingleValue } : {}}
//                 isClearable={false}
//                 placeholder={title || Icon ? "All" : options[0]?.label || ""}
//                 styles={customStyles}
//             />
//         </div>
//     );
// };

// export default DynamicDropdown;
