import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Controller } from "react-hook-form";

const ITEM_HEIGHT = 48;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 3,
    },
  },
};

export const NormalSelect = ({
  control,
  name,
  optionsData,
  center = false,
  uppercase = false,
  updateFunction = () => {},
}) => {
  const handleUpdateFunction = (value) => {
    const index = optionsData.indexOf(value);
    updateFunction(index + 1);
  };

  return (
    <FormControl sx={{ minWidth: 120 }} size="small">
      <Controller
        defaultValue=""
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            MenuProps={MenuProps}
            {...field}
            onChange={(e) => {
              field.onChange(e);
              handleUpdateFunction(e.target.value);
            }}
            id={name + "_select"}
            className="border bg-[var(--grey)]"
            sx={{
              "& .MuiSelect-select": {
                textAlign: center ? "center" : "start",
                padding: "0.2rem", // Tailwind p-1·
                fontSize: center ? "1.3rem" : "1.2rem",
                alignContent: "center",
                fontWeight: center ? "bold" : "normal",
                textTransform: uppercase ? "uppercase" : "initial",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderWidth: "2px",
                borderColor: "var(--purpleDark)", // focus ring color
                boxShadow: "0 0 0 1px var(--purpleDark)", // mimic Tailwind ring-2
              },
            }}
          >
            {optionsData.map((data, index) => {
              return (
                <MenuItem
                  value={data}
                  key={index}
                  sx={{
                    justifyContent: center ? "center" : "start",
                    fontSize: center ? "1.2rem" : "1.1rem",
                    overflowX: "auto",
                    textTransform: uppercase ? "uppercase" : "initial",
                  }}
                >
                  {data}
                </MenuItem>
              );
            })}
          </Select>
        )}
      />
    </FormControl>
  );
};
