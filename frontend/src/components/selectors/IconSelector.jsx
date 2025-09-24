import { category_icons } from "../../utils/category_icons";
import { ImageCard } from "../cards/ImageCard";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import { Controller } from "react-hook-form";

export const IconSelector = ({ name, control,selected=false }) => {
  const optionsData = Object.keys(category_icons);

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
          value={selected?selected:field.value || ""}
          onChange={(_, newValue) => field.onChange(newValue)}
          options={optionsData}
          getOptionLabel={(option) => option}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              key={option}
              sx={{
                display: "grid",
                columns: '3fr 10fr',
                justifyContent: 'center',
                alignItems: "center",
                gap: 1,
              }}
            >
              <picture className="relative h-10 w-fit block overflow-hidden justify-self-center shrink-0">
                <ImageCard
                  src={{
                    url: category_icons[option],
                    name: option,
                  }}
                />
              </picture>

              <span className="line-clamp-1">{option}</span>
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
