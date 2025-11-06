import { FillButton } from "../buttons/FillButton";
import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { joiResolver } from "@hookform/resolvers/joi";
import { useDispatch, useSelector } from "react-redux";
import { MdEditSquare } from "react-icons/md";
import { useValidationErrorToast } from "../../hooks/useValidationErrorToast";
import { productJoiSchema } from "../../validators/productValidators";
import { addProduct, updateProduct } from "../../store/thunks/admin/adminProductThunk";
import { CategorySelector } from "../selectors/CategorySelector";
import { getAllCaetgories, getAllSubCaetgories } from "../../store/thunks/admin/categoryThunk";
import { clearSubCategories } from "../../store/slices/admin/categorySlice";
import { CustomDialog } from "../common/CustomDialog";

export const ProductModal = ({
  edit = false,
  product = undefined
}) => {
  const schema = useMemo(() => {
    return productJoiSchema(edit);
  }, [edit]);

  const dispatch = useDispatch();
  const { categories, subcategories } = useSelector(
    (state) => state.category
  );
  const [categoryId,setCategoryId] = useState(undefined)


  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({ resolver: joiResolver(schema) });

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const submitForm = (data) => {
    if (edit) {
      dispatch(updateProduct({productData:data,id:product._id}))
      handleClose()
    } else {
      data.category = categoryId
      dispatch(addProduct(data))
      handleClose();
    }
  };

  useValidationErrorToast(errors);

  useEffect(()=>{
   dispatch(getAllCaetgories());
  },[])

  useEffect(()=>{
    if(categoryId){
      dispatch(getAllSubCaetgories(categoryId));
    }else{
      dispatch(clearSubCategories())
    }
  },[categoryId])


  useEffect(()=>{
    if(product){
      dispatch(getAllSubCaetgories(product.category._id))
      reset({
        name: product.name,
        description: product.description,
        brand: product.brand
      })
    }
  },[reset,product])

  return (
    <div>
      <span onClick={() => setOpen(true)}>
        {edit ? (
          <MdEditSquare className="text-2xl active:text-[var(--purpleDark)] transition-colors" />
        ) : (
          <FillButton name={"Add Product"} />
        )}
      </span>
        <CustomDialog open={open} handleClose={handleClose} title={'Product Basic Details'}>
          <form
              onSubmit={handleSubmit(submitForm)}
              className="flex flex-col justify-center gap-5"
            >

              {/* name begins */}
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="name" className="text-xl w-fit">
                  Name
                </label>
                <input
                  autoComplete="off"
                  {...register("name", { required: true })}
                  id="name"
                  className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
                />
              </div>
              {/* name ends */}

              {/* description begins */}
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="description" className="text-xl w-fit">
                  Description
                </label>
                <textarea
                  {...register("description", { required: true })}
                  id="description"
                  className="border box-border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)] h-50"
                  autoComplete="off"
                />
              </div>
              {/* description ends */}


               {/* brand begins */}
              <div className="flex flex-col justify-center gap-2">
                <label htmlFor="brand" className="text-xl w-fit">
                  Brand
                </label>
                <input
                  autoComplete="off"
                  {...register("brand", { required: true })}
                  id="brand"
                  className="lowercase border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
                />
              </div>
              {/* brand ends */}


               {/* category begins */}
             {!edit && <div className="flex flex-col justify-center gap-2">
                <label htmlFor="category" className="text-xl w-fit">
                  Category
                </label>
               <CategorySelector optionsData={categories} name={'category'} setId={setCategoryId} control={control} />
              </div>}
              {/* category ends */}

               {/* subcategory begins */}
              {!edit && <div className="flex flex-col justify-center gap-2">
                <label htmlFor="subcategory" className="text-xl w-fit">
                  Subcategory
                </label>
                <CategorySelector optionsData={subcategories?.length>0?subcategories:[]} name={'subcategory'} control={control} />
              </div>}
              {/* subcategory ends */}

              <FillButton type="submit" name={edit ? "Update" : "Add"} />
            </form>
        </CustomDialog>
    </div>
  );
};
