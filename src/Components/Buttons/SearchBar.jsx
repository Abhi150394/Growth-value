import React, { useContext, useRef, useEffect } from "react";
import { Input } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { debounce } from "lodash";
import { FilterContext } from "../../Contexts/FilterContext";

const { Search } = Input;

const SearchBar = ({
  placeholder = "Search...",
  debounceTime = 500,
  onSearch,
  width = 250,
  size = "middle",
}) => {
  const { filters, updateFilter } = useContext(FilterContext);

  // Use ref to store the debounced function
  const debouncedSearchRef = useRef(
    debounce((value) => {
      if (onSearch) onSearch(value);
    }, debounceTime)
  );

  // Update debounce if debounceTime or onSearch changes
  useEffect(() => {
    debouncedSearchRef.current = debounce((value) => {
      if (onSearch) onSearch(value);
    }, debounceTime);

    // Cleanup on unmount
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, [debounceTime, onSearch]);

  const handleChange = (e) => {
    const value = e.target.value;
    updateFilter("searchedValue", value);
    debouncedSearchRef.current(value);
  };

  const clearSearch = () => {
    updateFilter("searchedValue", null);
    if (onSearch) onSearch("");
    debouncedSearchRef.current.cancel();
  };

  return (
    <Search
      placeholder={placeholder}
      value={filters?.searchedValue || ""}
      onChange={handleChange}
      // allowClear={{ clearIcon: <CloseCircleOutlined onClick={clearSearch} /> }}
      size={size}
      style={{ width, display: "block", margin: "2px" }}
    />
  );
};

export default SearchBar;
