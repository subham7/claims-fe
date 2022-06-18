import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function SimpleSelectButton(props) {
  const theme = useTheme();
  const { data } = props;
  const [name, setName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setName(value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 443, mt: 1 }}>
        <Select
          displayEmpty
          value={name}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>{data[0]}</em>;
            }
            return selected
          }}
          MenuProps={MenuProps}
          style={{ borderRadius: "10px", background: "#111D38 0% 0% no-repeat padding-box", }}
        >
          {data.map((value) => (
            <MenuItem
              key={value}
              value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
