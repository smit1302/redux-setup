import ReactSelect from "react-select";
import React from "react";

interface SelectProps {
    options: { value: any; label: string }[];
    handleChange: (event: any) => void;
    placeholder?: string;
    value?: any;
    defaultLabel?: boolean;
    disabled?: boolean;
    optionTextColor?: string;
    isMulti?: boolean;
}

const Select: React.FC<SelectProps> = ({
    placeholder,
    options,
    defaultLabel,
    isMulti = false,
    value,
    handleChange,
    disabled,
    optionTextColor = "black",
}) => {
    const customStyles = {
    option: (provided: any) => ({
        ...provided,
        fontSize: "medium",
        color: optionTextColor,
        opacity: 1,
    }),
    menu: (provided: any) => ({
        ...provided,
        zIndex: 9999, // Adjust the z-index as needed
        
    }),
    placeholder: (provided: any) => ({
        ...provided,
        fontSize: "0.875rem", // Set the desired font size for the placeholder
    }),
};
    const defaultValue = value
        ? Array.isArray(value)
            ? value?.map((val: any) =>
                  options.find(
                      (option) => option.value?.toString() === val?.toString()
                  )
              )
            : options.find(
                  (option) => option.value?.toString() === value?.toString()
              )
        : undefined;
    options = defaultLabel
        ? [{ label: "All", value: "all" }, ...options]
        : options;
    return (
        <>
            <ReactSelect
                isMulti={isMulti}
                value={defaultValue}
                placeholder={placeholder}
                options={options}
                isDisabled={disabled}
                onChange={(e) => handleChange(e)}
                styles={customStyles}
            />
        </>
    );
};

export default Select;
