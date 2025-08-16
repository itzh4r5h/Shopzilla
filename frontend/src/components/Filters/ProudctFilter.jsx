import { IoFilterCircle } from "react-icons/io5";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { useEffect, useState } from "react";
import { formatINR } from "../../utils/helpers";
import { Controller, useForm } from "react-hook-form";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../../store/thunks/productThunks";

const CustomSlider = styled(Slider)({
  color: "var(--purpleDark)",
  height: 8,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-thumb": {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&::before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    lineHeight: 1.2,
    fontSize: 14,
    background: "unset",
    padding: "4px 8px",
    width: 60,
    height: 32,
    borderRadius: "4px",
    backgroundColor: "var(--purpleDark)",
    transform: "translateY(-100%) scale(0)", // no rotation, just above the thumb
    transformOrigin: "bottom center",
    "&::before": { display: "none" },
    "&.MuiSlider-valueLabelOpen": {
      transform: "translateY(-100%) scale(1)",
    },
    "& > *": {
      transform: "none",
    },
  },
});

const StyledFormControlLabel = styled((props) => (
  <FormControlLabel {...props} />
))(({ theme }) => ({
  variants: [
    {
      props: { checked: true },
      style: {
        ".MuiFormControlLabel-label": {
          color: "var(--purpleDark)",
          fontWeight: 'bold'
        },
      },
    },
  ],
}));

function CategoryFormControlLabel(props) {
  const radioGroup = useRadioGroup();
  let checked = false;

  if (radioGroup) {
    checked = radioGroup.value === props.value;
  }

  return <StyledFormControlLabel checked={checked} {...props} />;
}

export const ProudctFilter = () => {
    const [open, setOpen] = useState(false);
    const [priceRange, setPriceRange] = useState([0, 200000]);
    const [category, setCategory] = useState('');

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const minDistance = 500;

  const changePrice = (event, newValue, activeThumb) => {
    if (activeThumb === 0) {
      setPriceRange([
        Math.min(newValue[0], priceRange[1] - minDistance),
        priceRange[1],
      ]);
    } else {
      setPriceRange([
        priceRange[0],
        Math.max(newValue[1], priceRange[0] + minDistance),
      ]);
    }
  };

  const { getValues, control } = useForm({
    defaultValues: {
      rating: 0, // default value
    },
  });


    const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.products);

  const handleChange = (event) => {
    setCategory(event.target.value);
  };

//   useEffect(()=>{
//     dispatch(getAllProducts())
//   },[])

  return (
    <div>
      <Button onClick={toggleDrawer(true)}>
        <IoFilterCircle className="active:text-[var(--purpleDark)] transition-colors text-3xl text-black" />
      </Button>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            sx: {
              overflowY: "hidden", // 🚀 disables vertical scrolling
            },
          },
        }}
      >
        <aside className="w-75 h-full py-3 px-5 grid grid-rows-[1fr_1fr_1fr_0.5fr_8.5fr] gap-y-2">
          <h1 className="text-center text-2xl font-semibold mb-5">
            Product Filter
          </h1>
          <div>
            <h3 className="text-2xl">Price</h3>
            <CustomSlider
              getAriaLabel={() => "Minimum distance"}
              value={priceRange}
              step={500}
              min={0}
              max={200000}
              onChange={changePrice}
              valueLabelDisplay="auto"
              disableSwap
              sx={{ color: "var(--purpleDark)" }}
              valueLabelFormat={formatINR}
            />
          </div>
          <div>
            <h3 className="text-2xl">Rating</h3>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <Rating
                  {...field}
                  value={Number(field.value)} // ensure numeric value
                  onChange={(_, value) => field.onChange(value)}
                  sx={{
                    color: "var(--purpleDark)",
                    fontSize: "3rem",
                  }}
                />
              )}
            />
          </div>
          <h3 className="text-2xl">Category</h3>
          <div className="overflow-y-auto capitalize">
            <RadioGroup
              name="use-radio-group"
              value={category}
              onChange={handleChange}
            >
                <CategoryFormControlLabel
                sx={{display:'none'}}
                    value={''}
                    label={'empty'}
                    control={
                      <Radio
                        sx={{
                          color: "var(--purpleDark)",
                          "&.Mui-checked": {
                            color: "var(--purpleDark)",
                          },
                        }}
                      />
                    }
                  />
              {categories.map((categoryName) => {
                return (
                  <CategoryFormControlLabel
                    value={categoryName}
                    label={categoryName}
                    control={
                      <Radio
                        sx={{
                          color: "var(--purpleDark)",
                          "&.Mui-checked": {
                            color: "var(--purpleDark)",
                          },
                        }}
                      />
                    }
                    key={categoryName}
                  />
                );
              })}
            </RadioGroup>
          </div>
        </aside>
      </Drawer>
    </div>
  );
};
