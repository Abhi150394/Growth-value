
import React, { createContext, useState, useEffect } from "react";

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {

    const [filters, setFilters] = useState(() => {
        const saved = localStorage.getItem("filters");
        return saved
            ? JSON.parse(saved)
            : {
                dateRange: {
                    startDate: new Date(),
                    endDate: new Date(),
                },
                area: null,
                location: null,
                topBarSelectedSection:null,
                switchToChart:null,
                chart2ndAxis:true,
                searchedValue:null,
            };
    });


    const updateFilter = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            dateRange: {
                startDate: new Date(),
                endDate: new Date(),
            },
            area: null,
            location: null,
        });
        localStorage.removeItem("filters");
    };

    useEffect(() => {
        localStorage.setItem("filters", JSON.stringify(filters));
    }, [filters]);

    return (
        <FilterContext.Provider
            value={{
                filters,
                updateFilter,
                resetFilters,
            }}>
            {children}
        </FilterContext.Provider>
    );
};
