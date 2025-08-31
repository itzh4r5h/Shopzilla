import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { Controller } from "react-hook-form";

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

// Size lists by category
const sizeOptions = {
  shirt: ["XS", "S", "M", "L", "XL", "XXL"],
  jeans: ["28", "30", "32", "34", "36", "38", "40"],
  shoes: ["6", "7", "8", "9", "10", "11", "12"],
  kids: ["0-3M", "3-6M", "6-12M", "1Y", "2Y", "3Y", "4Y"],
};

export const SizeSelector = ({ category, control, name }) => {
  const sizes = sizeOptions[category] || [];

  return (
    <div className="grid w-full">
      <FormControl >
        <Controller
          name={name}
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <Select
              id={name}
              multiple
              {...field}
              input={<OutlinedInput className="border bg-[var(--grey)]" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              sx={{
                "& .MuiSelect-select": {
                  padding: "0.4rem", // Tailwind p-1·
                  fontSize: "1.1rem",
                  alignContent: "center",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: "2px",
                  borderColor: "var(--purpleDark)", // focus ring color
                  boxShadow: "0 0 0 1px var(--purpleDark)", // mimic Tailwind ring-2
                },
              }}
            >
              {sizes.map((size) => (
                <MenuItem key={size} value={size}>
                  <Checkbox
                    checked={field.value.includes(size)}
                    sx={{
                      color: "var(--purpleDark)", // unchecked color
                      "&.Mui-checked": {
                        color: "var(--purpleDark)", // checked color
                      },
                    }}
                  />
                  <ListItemText primary={size} />
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>
    </div>
  );
};
