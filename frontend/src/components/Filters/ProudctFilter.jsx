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
import Rating from "@mui/material/Rating";
import { useDispatch } from "react-redux";
import { getFilteredProducts } from "../../store/thunks/non_admin/productThunk";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { OutlineButton } from "../buttons/OutlineButton";
import { FillButton } from "../buttons/FillButton";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

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
    width: 65,
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
          color: "var(--purpleDark)!important",
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

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pl: 2 }}>{children}</Box>}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
};

const AttributesTabs = ({
  attributes,
  setSelectedAttributes,
  selectedAttributes,
}) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const attributeNames = attributes.map((attr) => attr._id);
  const attributeValues = attributes.map((attr) => attr.values);

  const handleAttributeChange = (event, index) => {
    const newValue = event.target.value;

    setSelectedAttributes((prev) =>
      prev.map((attr, i) => (i === index ? { ...attr, value: newValue } : attr))
    );
  };

  useEffect(() => {
    if(selectedAttributes.length === 0){
      setSelectedAttributes(
      attributeNames.map((attr) => ({ name: attr, value: "" }))
    );
    }
  }, []);

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: 130,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          "& .MuiTab-root": {
            fontWeight: "bold",
            alignItems: "flex-start",
          },
          "& .MuiTab-root.Mui-selected": {
            color: "var(--purpleDark)",
          },
          "& .MuiTabs-indicator": {
            backgroundColor: "var(--purpleDark)",
          },
        }}
      >
        {attributeNames.map((attrName, index) => (
          <Tab
            label={attrName}
            {...a11yProps(index)}
            key={index}
            sx={{ alignItems: "start" }}
          />
        ))}
      </Tabs>

      {selectedAttributes.length > 0 &&
        attributeValues.map((values, index) => {
          return (
            <TabPanel
              value={value}
              index={index}
              key={index}
              style={{ overflowY: "auto" }}
            >
              <RadioGroup
                name="use-radio-group"
                value={selectedAttributes[index].value}
                onChange={(e) => handleAttributeChange(e, index)}
              >
                {values.map((val) => {
                  return (
                    <CategoryFormControlLabel
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontWeight: "bold",
                          color: "var(--light)",
                        },
                      }}
                      value={val}
                      label={val}
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
                      key={val}
                    />
                  );
                })}
              </RadioGroup>
            </TabPanel>
          );
        })}
    </Box>
  );
};

export const ProudctFilter = ({ filters, attributes, keyword }) => {
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [priceRange, setPriceRange] = useState([]);
  const [ratings, setRatings] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [category, setCategory] = useState("");

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const minDistance = 100;

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

  const dispatch = useDispatch();

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };

  const handleClear = () => {
    setBrand("");
    setPriceRange([filters.prices[0], filters.prices[1]]);
    setRatings(0);
    setSelectedAttributes((prev) =>
      prev.map((attr, i) => ({ ...attr, value: "" }))
    );
    setCategory("");
  };

  useEffect(() => {
    if (filters.length > 0 || Object.keys(filters).length > 0) {
      setPriceRange([filters.prices[0], filters.prices[1]]);
    }
  }, [filters]);


  // this functions builts filteroptions object whose values are not default values
  const buildFilterPayload = () => {
    const payload = {};

    if (brand.trim() !== "") {
      payload.brand = brand.trim();
    }

    if (category.trim() !== "") {
      payload.subcategory = category.trim();
    }

    if (ratings > 0) {
      payload.ratings = ratings;
    }

    if (priceRange.length > 0) {
      payload.minPrice = priceRange[0];
      payload.maxPrice = priceRange[1];
    }

    const selectedAttrs = selectedAttributes
      .filter((attr) => attr.value && attr.value.trim() !== "")
      .map((attr) => ({ name: attr.name, value: attr.value.trim() }));

    if (selectedAttrs.length > 0) {
      payload.attributes = JSON.stringify(selectedAttrs);
    }

    return payload;
  };

  const handleApplyFilters = () => {
    const payload = buildFilterPayload()
    dispatch(getFilteredProducts({keyword,...payload}));
    toggleDrawer(false)
  };

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
        <aside className="w-75 h-full">
          {filters.length > 0 || Object.keys(filters).length > 0 ? (
            <div className="grid grid-rows-[0.5fr_4fr_1fr_1.5fr_0.5fr_3fr_0.5fr_5fr_0.5fr] gap-y-1 py-2 px-4 h-full">
              {/* brand begins */}
              <h3 className="text-2xl">Brand</h3>
              <div className="overflow-y-auto capitalize pl-2">
                <RadioGroup
                  name="use-radio-group"
                  value={brand}
                  onChange={handleBrandChange}
                >
                  {filters.brands.map((brandName) => {
                    return (
                      <CategoryFormControlLabel
                        value={brandName}
                        label={brandName}
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
                        key={brandName}
                      />
                    );
                  })}
                </RadioGroup>
              </div>
              {/* brand ends */}

              {/* price begins */}
              <div>
                <h3 className="text-2xl">Price</h3>
                <div className="px-5">
                  <CustomSlider
                    getAriaLabel={() => "Minimum distance"}
                    value={priceRange}
                    step={minDistance}
                    min={filters.prices[0]}
                    max={filters.prices[1]}
                    onChange={changePrice}
                    valueLabelDisplay="auto"
                    disableSwap
                    sx={{ color: "var(--purpleDark)" }}
                    valueLabelFormat={formatINR}
                  />
                </div>
              </div>
              {/* price ends */}

              {/* ratings begins */}
              <div>
                <h3 className="text-2xl">Rating</h3>
                <Rating
                  value={ratings}
                  onChange={(_, value) => setRatings(value)}
                  sx={{
                    color: "var(--purpleDark)",
                    fontSize: "2.7rem",
                  }}
                />
              </div>
              {/* rating ends */}

              {/* attributes begins */}
              <h3 className="text-2xl">Attributes</h3>
              <div className="capitalize">
                <AttributesTabs
                  attributes={attributes}
                  setSelectedAttributes={setSelectedAttributes}
                  selectedAttributes={selectedAttributes}
                />
              </div>

              {/* attributes ends */}

              {/* categories begins */}
              <h3 className="text-2xl">Category</h3>
              <div className="overflow-y-auto capitalize pl-2">
                <RadioGroup
                  name="use-radio-group"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  {filters.subcategories.map((categoryName) => {
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

              {/* category ends */}

              {/* buttons begins */}
              <div className="grid grid-cols-2 gap-x-5">
                <span onClick={handleClear}>
                  <OutlineButton name={"clear"} />
                </span>
                <span onClick={handleApplyFilters}>
                <FillButton name={"apply"} />
                </span>
              </div>
              {/* buttons ends */}
            </div>
          ) : (
            <div className="grid grid-rows-[.5fr_1fr_1.5fr_.5fr_8fr_.5fr] gap-y-2 py-2 px-5 h-full">
              <div>
                <h3 className="text-2xl">
                  <Skeleton width={"50%"} />
                </h3>
                <Skeleton />
              </div>
              <div>
                <h3 className="text-2xl">
                  <Skeleton width={"50%"} />
                </h3>
                <Skeleton height={30} />
              </div>
              <h3 className="text-2xl mt-4">
                <Skeleton width={"70%"} />
              </h3>
              <div className="overflow-y-auto capitalize">
                {[...Array(10)].map((item, index) => {
                  return (
                    <div
                      className="grid grid-cols-[1fr_5fr] items-center my-1"
                      key={index}
                    >
                      <Skeleton height={25} width={25} />
                      <Skeleton height={20} width={"85%"} />
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-x-5">
                <Skeleton height={30} />
                <Skeleton height={30} />
              </div>
            </div>
          )}
        </aside>
      </Drawer>
    </div>
  );
};
