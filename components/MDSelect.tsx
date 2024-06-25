import * as React from 'react';
import { Theme, useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ArrowDropDown } from '@mui/icons-material';
import { useLocation, useParams } from 'react-router-dom';

const MenuProps = {
    PaperProps: {
        style: {
            width: 180,
        },
    },
};

function getStyles(name: string, personName: string[] | undefined, theme: Theme) {

    if (!personName || !Array.isArray(personName)) {
        return {
            fontWeight: theme.typography.fontWeightBold,
        };
    }
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightBold
                : theme.typography.fontWeightBold,
    };
}

interface MultipleSelectProps {
    options: { value: any; label: string }[];
    handleChange: (event: any) => void;
    placeholder?: string;
    value?: any;
    defaultLabel?: boolean;
    disabled?: boolean;
    optionTextColor?: string;
    isMulti?: boolean;
    optionFontSize?: string;
}

const MultipleSelect: React.FC<MultipleSelectProps> = ({
    options,
    handleChange,
    placeholder,
    value,
    disabled,
    defaultLabel,
    optionTextColor = 'black',
    isMulti = false,
    optionFontSize = 'inherit',
}) => {
    const theme = useTheme();

    const { id } = useParams();
    const url = useLocation();

    options = defaultLabel ? [{ value: 'all', label: 'All' }, ...options] : options;

    return (
        <div>
            <FormControl sx={{ width: '100%' }}>
                <InputLabel shrink={(id || url.pathname === '/edit-profile') && !!value  ? true : undefined} id="demo-multiple-name-label" style={!!value ? { backgroundColor: "white", padding: "0 0.2em" } : {}}> {placeholder}</InputLabel>
                <Select
                    label={placeholder}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple={isMulti}
                    value={value}
                    onChange={handleChange}
                    MenuProps={MenuProps}
                    disabled={disabled}
                    fullWidth
                    style={{ color: 'blacks', height: '45px' }}
                    IconComponent={() => <ArrowDropDown style={{ color: "gray", marginRight: "0.3em" }} />}
                >
                    {options.map((option) => (
                        <MenuItem
                            key={option.value}
                            value={option.value}
                            style={{ ...getStyles(option.label, value, theme), fontSize: optionFontSize }}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
};

export default MultipleSelect;
