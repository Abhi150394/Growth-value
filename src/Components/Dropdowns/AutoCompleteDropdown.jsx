import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { BORDER_RADIUS, COLORS } from "../../constants";

const AutoCompleteDropdown = ({
  options = [],
  placeholder = "Select...",
  onChange,
  isMulti = true,
  width = "400px",
  showLogoTitle = false,
  logo = null,
  title = "Areas",
}) => {
  const [selectedOptions, setSelectedOptions] = useState(
    showLogoTitle ? { value: "all", label: "Overall" } : []
  );

  const enhancedOptions = showLogoTitle
    ? [
        { value: "all", label: "Overall" },
        { value: "__selectAll", label: "Select All" },
        ...options,
      ]
    : options;

  const handleChange = (selected) => {
    if (isMulti) {
      console.log(
        "selectedselectedselected",
        selected,
        selected ? "true" : "false"
      );
      if (!selected) {
        setSelectedOptions([]);
        onChange?.([{ value: "all", label: "Overall" }]);
        return;
      }
      if (selected.length === 0) {
        setSelectedOptions([{ value: "all", label: "Overall" }]);
        onChange?.([{ value: "all", label: "Overall" }]);
        return;
      }
      if (
        selected.length === 2 &&
        selected.some((opt) => opt.value === "all")
      ) {
        if (selected.some((opt) => opt.value === "__selectAll")) {
          const allExceptSpecial = options.map((o) => o);
          setSelectedOptions(allExceptSpecial);
          onChange?.(allExceptSpecial);
          return;
        }
        setSelectedOptions([selected[1]]);
        onChange?.([{ value: "all", label: "Overall" }]);
        return;
      }

      if (selected.some((opt) => opt.value === "__selectAll")) {
        const allExceptSpecial = options.map((o) => o);
        setSelectedOptions(allExceptSpecial);
        onChange?.(allExceptSpecial);
        return;
      }

      if (selected.some((opt) => opt.value === "all")) {
        setSelectedOptions([{ value: "all", label: "Overall" }]);
        onChange?.([]);
        return;
      }

      setSelectedOptions(selected);
      onChange?.(selected);
    } else {
      setSelectedOptions(selected ? [selected] : []);
      onChange?.(selected ? [selected] : []);
    }
  };
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: `${COLORS.borderColor}`,
      boxShadow: state.isFocused ? `0 0 0 1px ${COLORS.bgBase}` : "none",
      "&:hover": { borderColor: COLORS.borderHoverColor },
      borderRadius: `${BORDER_RADIUS.sm}px`,
      minHeight: "36px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: COLORS.textBase,
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: `${BORDER_RADIUS.sm}px`,
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
    placeholder: (provided) => ({
      ...provided,
      color: COLORS.bgBase,
    }),
  };

  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <components.ValueContainer {...props}>
        {logo && (
          <img
            src={logo}
            alt="logo"
            style={{ width: 20, height: 20, marginRight: 6 }}
          />
        )}
        {showLogoTitle && <strong style={{ marginRight: 6 }}>{title}:</strong>}
        {children}
      </components.ValueContainer>
    );
  };

  return (
    <div style={{ width }}>
      <Select
        isMulti={isMulti}
        options={enhancedOptions}
        value={selectedOptions}
        onChange={handleChange}
        placeholder={showLogoTitle ? null : placeholder}
        isClearable={true}
        closeMenuOnSelect={!isMulti}
        components={
          showLogoTitle ? { ValueContainer: CustomValueContainer } : {}
        }
        styles={customStyles}
        // zIndex={100}
      />
    </div>
  );
};

export default AutoCompleteDropdown;

// import React, { useState } from "react";
// import Select from "react-select";

// const AutoCompleteDropdown = ({
//     options = [],
//     placeholder = "Select...",
//     onChange,
//     isMulti = true,
//     width = "400px"
// }) => {
//     const [selectedOptions, setSelectedOptions] = useState([]);

//     const handleChange = (selected) => {
//         setSelectedOptions(selected || []);
//         if (onChange) onChange(selected || []);
//     };

//     const clearAll = () => {
//         setSelectedOptions([]);
//         if (onChange) onChange([]);
//     };

//     return (
//         <div style={{ width }}>
//             <Select
//                 isMulti={isMulti}
//                 options={options}
//                 value={selectedOptions}
//                 onChange={handleChange}
//                 placeholder={placeholder}
//                 isClearable
//                 closeMenuOnSelect={!isMulti}
//             />

//             {/* {selectedOptions.length > 0 && (
//                 <button
//                     style={{
//                         marginTop: "10px",
//                         padding: "5px 12px",
//                         background: "#e74c3c",
//                         border: "none",
//                         color: "white",
//                         cursor: "pointer",
//                         borderRadius: "6px",
//                     }}
//                     onClick={clearAll}
//                 >
//                     Clear All
//                 </button>
//             )} */}
//         </div>
//     );
// };

// export default AutoCompleteDropdown;
