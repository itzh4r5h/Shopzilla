import { Controller } from "react-hook-form";
import { category_icons } from "../../utils/category_icons";
import { ImageCard } from "../cards/ImageCard";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";

export const CategorySelector = ({
  name,
  setId = () => {},
  optionsData,
  control,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: true }}
      render={({ field }) => (
        <Autocomplete
          id={name}
          sx={{
            "&.MuiAutocomplete-root .MuiOutlinedInput-root": {
              padding: "0.2rem",
              backgroundColor: "var(--grey)",
            },
            "&.MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input":
              {
                padding: "0.09rem",
              },
            "& .MuiInputBase-input": {
              fontSize: "1.2rem",
            },
            "&.MuiAutocomplete-root .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
              {
                borderColor: "black",
              },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: "2px",
              borderColor: "var(--purpleDark) !important",
              boxShadow: "0 0 0 1px var(--purpleDark)", // mimic Tailwind ring
            },
          }}
          {...field}
          value={optionsData.find((opt) => opt.name === field.value) || null}
          onChange={(_, newValue) => {
            field.onChange(newValue ? newValue.name : "");
            setId(newValue ? newValue._id : "");
          }}
          options={optionsData}
          getOptionLabel={(option) => option?.name || ""}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={option._id}
              sx={{
                display: "grid",
                gridColumn: "3fr 10fr",
                alignItems: "center",
                justifyItems: "center",
                gap: 1,
              }}
            >
              <picture className="relative h-10 w-fit block overflow-hidden justify-self-center">
                <ImageCard
                  src={{
                    url: category_icons[option.icon],
                    name: option.icon,
                  }}
                />
              </picture>
              <span className="capitalize">
                {option.name}
              </span>
            </Box>
          )}
          renderInput={(params) => (
            <TextField {...params} variant="outlined" />
          )}
        />
      )}
    />
  );
};
