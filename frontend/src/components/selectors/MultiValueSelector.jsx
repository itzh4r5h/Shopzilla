import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import debounce from "lodash/debounce";
import { useFieldArray } from "react-hook-form";
import { useCallback, useState } from "react";
import { FaPlusCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const ITEM_HEIGHT = 40;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 170,
    },
  },
};

export const MultiValueSelector = ({ control, fieldName }) => {
  const {
    fields: multiValueField,
    append: addValue,
    remove: removeValue,
  } = useFieldArray({
    control,
    name: fieldName,
  });

  const [value, setValue] = useState("");

  const handleAdd = useCallback(
    debounce((val) => {
      if (val === "") {
        toast.error("can't add empty value");
        return;
      } else if (val.length > 5) {
        toast.error("option length cann't exceed 5 chars");
        return;
      }
      addValue({ value: val.trim() });
      setValue("");
    }, 300),
    [] // dependencies (recreate only if needed)
  );

  return (
    <div className="grid w-full grid-cols-4 relative gap-x-2">
      <input
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase().trim())}
        id={fieldName}
        className="uppercase border rounded-md p-1 pr-7 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)] col-span-3"
      />
      <FaPlusCircle
        className="text-xl active:text-[var(--purpleDark)] transition-colors absolute top-1/2 -translate-y-1/2 right-12 z-150"
        onClick={() => handleAdd(value)}
      />

      <FormControl className="relative justify-self-end">
        <Select
          id={fieldName + "_select"}
          MenuProps={MenuProps}
          value=""
          className="border bg-[var(--grey)]"
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
          {multiValueField.map((fieldValue,index) => (
            <MenuItem
              key={fieldValue.id}
              value={fieldValue.value}
              disableRipple
            >
              <ListItemText
                primary={fieldValue.value}
                sx={{ pointerEvents: "auto" }}
              />
              <FaTimesCircle
                className="text-lg active:text-[var(--purpleDark)] transition-colors"
                onClick={(e) => {
                  e.stopPropagation(); // 👈 don't let click bubble to MenuItem
                  removeValue(index); // remove from array
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};
