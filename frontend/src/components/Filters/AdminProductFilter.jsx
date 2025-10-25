import { IoFilterCircle } from "react-icons/io5";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import RadioGroup, { useRadioGroup } from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import { useEffect, useState } from "react";
import { formatINR } from "../../utils/helpers";
import Rating from "@mui/material/Rating";
import { useDispatch, useSelector } from "react-redux";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { OutlineButton } from "../buttons/OutlineButton";
import { FillButton } from "../buttons/FillButton";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { getCategoriesAndSubCategories } from "../../store/thunks/admin/categoryThunk";
import { getAllProduct, getBrands } from "../../store/thunks/admin/adminProductThunk";
import { getOutOfStockVariants } from "../../store/thunks/admin/variantThunk";

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

const CategoriesTabs = ({ categories,category,setCategory }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const categoryNames = categories.map((category) => category.name);
  const subCategories = categories.map((category) => category.subcategories);


  const handleCategoryChange = (event, selectedCategory) => {

   const subcategory = event.target.value;

    setCategory({_id:selectedCategory._id,subcategory});
  };


  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
        height: 245,
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
        {categoryNames.map((name, index) => (
          <Tab
            label={name}
            {...a11yProps(index)}
            key={index}
            sx={{ alignItems: "start" }}
          />
        ))}
      </Tabs>

      {
        subCategories.map((subCats, index) => {
          return (
            <TabPanel
              value={value}
              index={index}
              key={index}
              style={{ overflowY: "auto" }}
            >
              <RadioGroup
                name="use-radio-group"
                value={category.subcategory}
                onChange={(e) => handleCategoryChange(e, categories[index])}
              >
                {subCats.map((val) => {
                  return (
                    <CategoryFormControlLabel
                      sx={{
                        ".MuiFormControlLabel-label": {
                          fontWeight: "bold",
                          color: "var(--light)",
                        },
                      }}
                      value={val.name}
                      label={val.name}
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
                      key={val.name}
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

export const AdminProductFilter = ({tab}) => {
  const [open, setOpen] = useState(false);
  const [brand, setBrand] = useState("");
  const [ratings, setRatings] = useState(0);
  const [category, setCategory] = useState({_id:'',subcategory:''});
  const dispatch = useDispatch()
  const {categoriesAndSubcategories} = useSelector((state)=>state.category)
  const {brands,page,keyword} = useSelector((state)=>state.adminProduct)
  const {page:variantPage,keyword:variantKeyword} = useSelector((state)=>state.variant)

  useEffect(()=>{
    dispatch(getCategoriesAndSubCategories())
    dispatch(getBrands())
  },[])


  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };

  const handleClear = () => {
    setBrand("");
    setRatings(0);
    setCategory({_id:'',subcategory:''});
  };

  // this functions builts filteroptions object whose values are not default values
  const buildFilterPayload = () => {
    const payload = {};

    if (brand.trim() !== "") {
      payload.brand = brand.trim();
    }

    if (category._id !== "") {
      payload.category = JSON.stringify(category)
    }

    if (ratings > 0) {
      payload.ratings = ratings;
    }

    return payload;
  };

  const handleApplyFilters = () => {
    const payload = buildFilterPayload();
    if(tab==='all'){
      dispatch(getAllProduct({page,keyword,...payload}))
    }else if (tab === 'out_of_stock'){
      dispatch(getOutOfStockVariants({page:variantPage,keyword:variantKeyword,...payload}))
    }
    toggleDrawer(false);
  };

  return (
    <div>
      <Button onClick={toggleDrawer(true)} sx={{padding:0}}>
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
          {categoriesAndSubcategories.length > 0 ? (
            <div className="grid grid-rows-[.5fr_4fr_1fr_.5fr_5fr_1fr] gap-y-1 py-2 px-4 h-full">
              {/* brand begins */}
              <h3 className="text-2xl">Brand</h3>
              <div className="overflow-y-auto capitalize pl-2">
                <RadioGroup
                  name="use-radio-group"
                  value={brand}
                  onChange={handleBrandChange}
                >
                  {brands.map((brandName) => {
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

              {/* category begins */}
              <h3 className="text-2xl">Categories</h3>
              <div className="capitalize">
                <CategoriesTabs categories={categoriesAndSubcategories} setCategory={setCategory} category={category}/>
              </div>
              {/* category ends */}

              {/* buttons begins */}
              <div className="grid grid-cols-2 gap-x-5 items-end">
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
