import { useParams } from "react-router";
import { Heading } from "../../../components/Headers/Heading";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllAttributes } from "../../../store/thunks/categoryThunk";
import { clearCategoryError, clearCategoryMessage } from "../../../store/slices/categorySlice";
import { useToastNotify } from "../../../hooks/useToastNotify";
import { UpdateAttributesModal } from "../../../components/modal/UpdateAttributesModal";

export const Attributes = () => {
  const { subcategory, category, id, subId } = useParams();
  const dispatch = useDispatch();
  const { error, success, message, attributes, loading, updated } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(getAllAttributes({ id, subId }));
  }, []);

  useEffect(() => {
    if (updated) {
      dispatch(getAllAttributes({ id, subId }));
    }
  }, [updated]);

  useToastNotify(error,success,message,clearCategoryError,clearCategoryMessage,dispatch)

  return (
    <div className="grid gap-y-2 grid-cols-1 grid-rows-[1fr_10fr_1fr] h-full relative">
      <Heading
        name={`${subcategory} attriubtes`}
        path={`/admin/dashboard/categories/${category}/${id}`}
      />
      {!loading && attributes?.length > 0 && (
        <>
          <div className="flex flex-col gap-y-3 overflow-y-auto pb-1">
            {attributes.map((attr) => {
              return (
                <div className="bg-white border p-2 rounded-md" key={attr._id}>
                  <div className="grid grid-cols-2">
                    <h3 className="text-lg font-semibold uppercase tracking-widest">
                      Name
                    </h3>
                    <h3 className="text-lg font-semibold uppercase tracking-widest text-green-600">
                      {attr.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

         <UpdateAttributesModal attributesData={attributes} id={id} subId={subId}/>
        </>
      )}
    </div>
  );
};
