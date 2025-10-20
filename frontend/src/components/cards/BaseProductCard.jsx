import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const BaseProductCard = ({ product }) => {
  return product ? (
    <article className="w-full rounded-md border border-[var(--black)] bg-[var(--white)] p-2 h-full flex flex-col justify-center gap-1 outline-none active:ring-2 active:ring-[var(--purpleDark)]">
      {/* name begins */}
      <div className="flex flex-col justify-center">
        <label htmlFor="name" className="text-lg w-fit">
          Name
        </label>
        <textarea
          defaultValue={product.name}
          id="name"
          className="capitalize border box-border rounded-sm px-1 text-md bg-[var(--grey)] h-13 outline-none ring-2 ring-[var(--purpleDark)] font-semibold text-[var(--purpleDark)]"
          autoComplete="off"
          readOnly
        />
      </div>
      {/* name ends */}

      {/* category begins */}
      <div className="flex flex-col justify-center">
        <label htmlFor="category" className="text-md w-fit">
          Category
        </label>
        <input
          defaultValue={product.category.name}
          autoComplete="off"
          readOnly
          id="category"
          className="capitalize border rounded-sm px-1 text-md bg-[var(--grey)] outline-none"
        />
      </div>
      {/* category ends */}
      {/* subcategory begins */}
      <div className="flex flex-col justify-center">
        <label htmlFor="category" className="text-md w-fit">
          Subcategory
        </label>
        <input
          defaultValue={product.subcategory}
          autoComplete="off"
          readOnly
          id="subcategory"
          className="capitalize border rounded-sm px-1 text-md bg-[var(--grey)] outline-none"
        />
      </div>
      {/* subcategory ends */}
    </article>
  ) : (
    <article className="w-full rounded-md border border-[var(--black)] bg-[var(--white)] p-2 h-full flex flex-col justify-center gap-1 outline-none active:ring-2 active:ring-[var(--purpleDark)]">
      {/* name begins */}
      <div className="flex flex-col justify-center">
        <Skeleton />
        <Skeleton height={30} />
      </div>
      {/* name ends */}

      {/* category begins */}
      <div className="flex flex-col justify-center">
        <Skeleton />
        <Skeleton height={20} />
      </div>
      {/* category ends */}
      {/* subcategory begins */}
      <div className="flex flex-col justify-center">
        <Skeleton/>
        <Skeleton height={20}/>
      </div>
      {/* subcategory ends */}
    </article>
  );
};
