import { useParams } from "react-router";
import { Heading } from "../../../components/Headers/Heading";
import { FillButton } from "../../../components/buttons/FillButton";
import { OutlineButton } from "../../../components/buttons/OutlineButton";

export const Attributes = () => {
  const { subcategory, category } = useParams();

  const attriubtes = [
    { name: "ram", type: "string" },
    { name: "storage", type: "string" },
    { name: "processor", type: "string" },
    { name: "processor", type: "string" },
    { name: "processor", type: "string" },
    { name: "processor", type: "string" },
    { name: "color", type: "enum" },
  ];
  return (
    <div className="grid gap-y-2 grid-cols-1 grid-rows-[1fr_10fr_1fr] h-full relative">
      <Heading
        name={`${subcategory} attriubtes`}
        path={`/admin/dashboard/categories/${category}`}
      />
      <div className="flex flex-col gap-y-3 overflow-y-auto p-1">
        {attriubtes.map((attr) => {
          return (
            <div className="bg-white border p-2 rounded-md">
              <div className="grid grid-cols-2">
                <h3 className="text-lg font-semibold uppercase tracking-widest">
                  Name
                </h3>
                <h3 className="text-lg font-semibold uppercase tracking-widest text-amber-600">
                  {attr.name}
                </h3>
              </div>
              <div className="grid grid-cols-2">
                <h3 className="text-lg font-semibold uppercase tracking-widest">
                  Type
                </h3>
                <h3 className="text-lg font-semibold uppercase tracking-widest text-green-600">
                  {attr.type}
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-x-2">
        <span>
          <OutlineButton name={"Edit"} />
        </span>
        <span>
          <FillButton name={"Add"} />
        </span>
      </div>
    </div>
  );
};
