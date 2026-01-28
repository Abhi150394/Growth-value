import React, { useState } from "react";
import Select, { components } from "react-select";
import { Box } from "@mui/material";
import { BORDER_RADIUS, COLORS, FONT_WEIGHT } from "../../constants";
import TranslatedText from "../Controls/TranslatedText";

const DynamicDropdown = ({
  title,
  icon: TitleIcon,
  options = [],
  onChange,
  width = "25%",
  isClearable = false,
  placeholder = "",
  size = "default", // "default" | "small"
  isMulti = false,  // ✅ new: multi-select support
}) => {
  const hasTitleAndIcon = Boolean(title && TitleIcon);
  const isSmall = size === "small";

  // sizing tokens
  const SZ = {
    controlMinH: isSmall ? 30 : 36,
    controlPX: isSmall ? 6 : 10,
    font: isSmall ? 12 : 14,
    singleValueGap: isSmall ? 4 : 8,
    optionH: isSmall ? 30 : 36,
    optionFont: isSmall ? 12 : 14,
    icon: isSmall ? 14 : 16,
    titleIcon: isSmall ? 14 : 16,
    placeholderFont: isSmall ? 12 : 14,
    indicatorPad: isSmall ? 4 : 8,
    valuePadY: isSmall ? 2 : 4,
    chipFont: isSmall ? 11 : 12,
    chipPadY: isSmall ? 1 : 2,
    chipPadX: isSmall ? 6 : 8,
    chipRadius: isSmall ? 10 : 12,
  };

  // Default selection logic
  // - Single select + title/icon -> "__all"
  // - Single select without title/icon -> null (placeholder)
  // - Multi select -> [] (chips)
  const [selected, setSelected] = useState(
    isMulti
      ? []
      : hasTitleAndIcon
      ? { value: "__all", label: "All" }
      : null
  );

  // Normalize a value to our mapping (handles "auto" -> "day")
  const normalizeOption = (opt) => {
    if (!opt) return opt;
    if (opt.value === "auto") return { value: "day", label: "Day" };
    return opt;
  };

  const handleChange = (option) => {
    if (isMulti) {
      const nextArray = (option || []).map(normalizeOption);
      setSelected(nextArray);
      onChange?.(nextArray);
      return;
    }

    // single-select
    if (!option) {
      const next = hasTitleAndIcon ? { value: "__all", label: "All" } : null;
      setSelected(next);
      onChange?.(next);
      return;
    }

    const normalized = normalizeOption(option);
    setSelected(normalized);
    onChange?.(normalized);
  };

  // Dropdown list item
  const CustomOption = (props) => (
    <components.Option {...props}>
      <Box
        display="flex"
        alignItems="center"
        gap={1}
        sx={{ fontSize: SZ.optionFont, lineHeight: `${SZ.optionH}px` }}
      >
        {props.data.icon && (
          <props.data.icon style={{ fontSize: SZ.icon, color: COLORS?.textBase || "#111" }} />
        )}
        <span><TranslatedText>{props.data.label}</TranslatedText></span>
      </Box>
    </components.Option>
  );

  // Selected value (single mode with title && icon)
  const CustomSingleValue = (props) => (
    <components.SingleValue {...props}>
      <Box
        display="flex"
        alignItems="center"
        gap={SZ.singleValueGap / 8}
        sx={{ fontSize: SZ.font }}
      >
        {TitleIcon && <TitleIcon style={{ color: "#000", fontSize: SZ.titleIcon }} />}
        {title && (
          <span style={{ color: "#000", fontWeight: FONT_WEIGHT?.lg || 600, marginRight: 4 }}>
            <TranslatedText>{title}</TranslatedText>:
          </span>
        )}
        {props.data.icon && (
          <props.data.icon style={{ fontSize: SZ.icon, color: COLORS?.textBase || "#111" }} />
        )}
        <span><TranslatedText>{props.data.label}</TranslatedText></span>
      </Box>
    </components.SingleValue>
  );

  // Chip renderer for multi-select (smaller chips in small mode)
  const CustomMultiValueLabel = (props) => (
    <components.MultiValueLabel {...props}>
      <span style={{ fontSize: SZ.chipFont }}><TranslatedText>{props.data.label}</TranslatedText></span>
    </components.MultiValueLabel>
  );

  const CustomMultiValueContainer = (props) => (
    <components.MultiValue {...props}>
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: `${SZ.chipPadY}px ${SZ.chipPadX}px`,
          borderRadius: SZ.chipRadius,
        }}
      >
        {props.children}
      </span>
    </components.MultiValue>
  );

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: COLORS?.borderColor || "#e5e7eb",
      boxShadow: state.isFocused ? `0 0 0 1px ${COLORS?.bgBase || "#d1d5db"}` : "none",
      "&:hover": { borderColor: COLORS?.borderHoverColor || "#cbd5e1" },
      borderRadius: BORDER_RADIUS?.sm ?? 6,
      minHeight: SZ.controlMinH,
      paddingLeft: SZ.controlPX,
      paddingRight: SZ.controlPX,
      fontSize: SZ.font,
    }),
    valueContainer: (provided) => ({
      ...provided,
      paddingTop: SZ.valuePadY,
      paddingBottom: SZ.valuePadY,
      gap: isMulti ? 4 : 0,
      flexWrap: isMulti ? "wrap" : "nowrap",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: COLORS?.textBase || "#111",
      fontSize: SZ.font,
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: COLORS?.bgBase || "#f3f4f6",
      borderRadius: SZ.chipRadius,
      padding: 0,
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      padding: 0,
      paddingLeft: SZ.chipPadX,
      paddingRight: SZ.chipPadX / 2,
      fontSize: SZ.chipFont,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      paddingLeft: SZ.chipPadX / 2,
      paddingRight: SZ.chipPadX / 2,
      ":hover": { backgroundColor: "transparent", color: "#000" },
    }),
    input: (provided) => ({
      ...provided,
      fontSize: SZ.font,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: SZ.indicatorPad,
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: SZ.indicatorPad,
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      marginTop: isSmall ? 2 : 4,
      marginBottom: isSmall ? 2 : 4,
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: BORDER_RADIUS?.sm ?? 6,
      border: `1px solid ${COLORS?.bgBase || "#e5e7eb"}`,
      overflow: "hidden",
      fontSize: SZ.optionFont,
    }),
    option: (provided, state) => ({
      ...provided,
      minHeight: SZ.optionH,
      paddingTop: isSmall ? 4 : 8,
      paddingBottom: isSmall ? 4 : 8,
      paddingLeft: isSmall ? 8 : 12,
      paddingRight: isSmall ? 8 : 12,
      backgroundColor: state.isSelected
        ? COLORS?.bgSelected || "#e5e7eb"
        : state.isFocused
        ? COLORS?.bgBase || "#f3f4f6"
        : COLORS?.bgLayout || "#fff",
      color: state.isSelected ? "#000" : COLORS?.textBase || "#111",
      "&:hover": { backgroundColor: COLORS?.bgHoverColor || "#f3f4f6" },
      cursor: "pointer",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: COLORS?.textMuted || COLORS?.textSecondary || "#6b7280",
      fontSize: SZ.placeholderFont,
    }),
  };

  // Placeholder rules:
  // - single + title/icon -> "All"
  // - otherwise -> provided placeholder -> first option label -> ""
  const computedPlaceholder =
    !isMulti && hasTitleAndIcon ? "All" : (placeholder || options[0]?.label || "");

  // Clear rules:
  // - single: only allow clear when not on "__all" (if title/icon mode)
  // - multi: allow clear when there is at least one item
  const computedIsClearable = isMulti
    ? isClearable && Array.isArray(selected) && selected.length > 0
    : isClearable && (!hasTitleAndIcon || selected?.value !== "__all");

  return (
    <Box
      width={{ xs: "100%", sm: width }}
      minWidth={isSmall ? 120 : 150}
      sx={{ lineHeight: 1 }}
    >
      <Select
        isMulti={isMulti} // ✅ enable multi
        options={options}
        value={selected}
        onChange={handleChange}
        components={{
          SingleValue: !isMulti && hasTitleAndIcon
            ? CustomSingleValue
            : components.SingleValue,
          Option: CustomOption,
          ...(isMulti && {
            MultiValueLabel: CustomMultiValueLabel,
            MultiValue: CustomMultiValueContainer,
          }),
        }}
        isClearable={computedIsClearable}
        placeholder={computedPlaceholder}
        styles={customStyles}
        backspaceRemovesValue={computedIsClearable}
        menuPlacement="auto"
        closeMenuOnSelect={!isMulti} // keep menu open for multi
        hideSelectedOptions={false}
      />
    </Box>
  );
};

export default DynamicDropdown;



// import React, { useState } from "react";
// import Select, { components } from "react-select";
// import { Box } from "@mui/material";
// import { BORDER_RADIUS, COLORS, FONT_WEIGHT } from "../../constants";

// const DynamicDropdown = ({
//   title,
//   icon: TitleIcon,
//   options = [],
//   onChange,
//   width = "25%",
//   isClearable = false,
//   placeholder = "",
//   size = "default", // "default" | "small"
//   isMulti = false,
// }) => {
//   const hasTitleAndIcon = Boolean(title && TitleIcon);
//   const isSmall = size === "small";

//   // sizing tokens
//   const SZ = {
//     controlMinH: isSmall ? 30 : 36,
//     controlPX: isSmall ? 6 : 10,
//     font: isSmall ? 12 : 14,
//     singleValueGap: isSmall ? 4 : 8,
//     optionH: isSmall ? 30 : 36,
//     optionFont: isSmall ? 12 : 14,
//     icon: isSmall ? 14 : 16,
//     titleIcon: isSmall ? 14 : 16,
//     placeholderFont: isSmall ? 12 : 14,
//     indicatorPad: isSmall ? 4 : 8,
//     valuePadY: isSmall ? 2 : 4,
//   };

//   // default selection logic
//   const [selectedOption, setSelectedOption] = useState(
//     hasTitleAndIcon ? { value: "__all", label: "All" } : null
//   );

//   const handleChange = (option) => {
//     if (!option) {
//       const next = hasTitleAndIcon ? { value: "__all", label: "All" } : null;
//       setSelectedOption(next);
//       onChange?.(next);
//       return;
//     }
//     if (option.value === "auto") {
//       const mapped = { value: "day", label: "Day" };
//       setSelectedOption(mapped);
//       onChange?.(mapped);
//       return;
//     }
//     setSelectedOption(option);
//     onChange?.(option);
//   };

//   // Dropdown list item
//   const CustomOption = (props) => (
//     <components.Option {...props}>
//       <Box
//         display="flex"
//         alignItems="center"
//         gap={1}
//         sx={{ fontSize: SZ.optionFont, lineHeight: `${SZ.optionH}px` }}
//       >
//         {props.data.icon && (
//           <props.data.icon style={{ fontSize: SZ.icon, color: COLORS?.textBase || "#111" }} />
//         )}
//         <span>{props.data.label}</span>
//       </Box>
//     </components.Option>
//   );

//   // Selected value (when title && icon)
//   const CustomSingleValue = (props) => (
//     <components.SingleValue {...props}>
//       <Box
//         display="flex"
//         alignItems="center"
//         gap={SZ.singleValueGap / 8}
//         sx={{ fontSize: SZ.font }}
//       >
//         {TitleIcon && <TitleIcon style={{ color: "#000", fontSize: SZ.titleIcon }} />}
//         {title && (
//           <span style={{ color: "#000", fontWeight: FONT_WEIGHT?.lg || 600, marginRight: 4 }}>
//             {title}:
//           </span>
//         )}
//         {props.data.icon && (
//           <props.data.icon style={{ fontSize: SZ.icon, color: COLORS?.textBase || "#111" }} />
//         )}
//         <span>{props.data.label}</span>
//       </Box>
//     </components.SingleValue>
//   );

//   const customStyles = {
//     control: (provided, state) => ({
//       ...provided,
//       borderColor: COLORS?.borderColor || "#e5e7eb",
//       boxShadow: state.isFocused ? `0 0 0 1px ${COLORS?.bgBase || "#d1d5db"}` : "none",
//       "&:hover": { borderColor: COLORS?.borderHoverColor || "#cbd5e1" },
//       borderRadius: BORDER_RADIUS?.sm ?? 6,
//       minHeight: SZ.controlMinH,
//       paddingLeft: SZ.controlPX,
//       paddingRight: SZ.controlPX,
//       fontSize: SZ.font,
//     }),
//     valueContainer: (provided) => ({
//       ...provided,
//       paddingTop: SZ.valuePadY,
//       paddingBottom: SZ.valuePadY,
//     }),
//     singleValue: (provided) => ({
//       ...provided,
//       color: COLORS?.textBase || "#111",
//       fontSize: SZ.font,
//     }),
//     input: (provided) => ({
//       ...provided,
//       fontSize: SZ.font,
//       margin: 0,
//       padding: 0,
//     }),
//     indicatorsContainer: (provided) => ({
//       ...provided,
//       paddingTop: 0,
//       paddingBottom: 0,
//     }),
//     dropdownIndicator: (provided) => ({
//       ...provided,
//       padding: SZ.indicatorPad,
//     }),
//     clearIndicator: (provided) => ({
//       ...provided,
//       padding: SZ.indicatorPad,
//     }),
//     indicatorSeparator: (provided) => ({
//       ...provided,
//       marginTop: isSmall ? 2 : 4,
//       marginBottom: isSmall ? 2 : 4,
//     }),
//     menu: (provided) => ({
//       ...provided,
//       borderRadius: BORDER_RADIUS?.sm ?? 6,
//       border: `1px solid ${COLORS?.bgBase || "#e5e7eb"}`,
//       overflow: "hidden",
//       fontSize: SZ.optionFont,
//     }),
//     option: (provided, state) => ({
//       ...provided,
//       minHeight: SZ.optionH,
//       paddingTop: isSmall ? 4 : 8,
//       paddingBottom: isSmall ? 4 : 8,
//       paddingLeft: isSmall ? 8 : 12,
//       paddingRight: isSmall ? 8 : 12,
//       backgroundColor: state.isSelected
//         ? COLORS?.bgSelected || "#e5e7eb"
//         : state.isFocused
//         ? COLORS?.bgBase || "#f3f4f6"
//         : COLORS?.bgLayout || "#fff",
//       color: state.isSelected ? "#000" : COLORS?.textBase || "#111",
//       "&:hover": { backgroundColor: COLORS?.bgHoverColor || "#f3f4f6" },
//       cursor: "pointer",
//     }),
//     placeholder: (provided) => ({
//       ...provided,
//       color: COLORS?.textMuted || COLORS?.textSecondary || "#6b7280",
//       fontSize: SZ.placeholderFont,
//     }),
//   };

//   const computedPlaceholder = hasTitleAndIcon
//     ? "All"
//     : placeholder || options[0]?.label || "";

//   const computedIsClearable =
//     isClearable && (!hasTitleAndIcon || selectedOption?.value !== "__all");

//   return (
//     <Box
//       width={{ xs: "100%", sm: width }}
//       minWidth={isSmall ? 120 : 150}
//       sx={{ lineHeight: 1 }}
//     >
//       <Select
//         options={options}
//         value={selectedOption}
//         onChange={handleChange}
//         components={{
//           SingleValue: hasTitleAndIcon ? CustomSingleValue : components.SingleValue,
//           Option: CustomOption,
//         }}
//         isClearable={computedIsClearable}
//         placeholder={computedPlaceholder}
//         styles={customStyles}
//         backspaceRemovesValue={computedIsClearable}
//         menuPlacement="auto"
//       />
//     </Box>
//   );
// };

// export default DynamicDropdown;
