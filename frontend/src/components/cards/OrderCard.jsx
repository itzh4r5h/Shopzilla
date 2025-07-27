import { FaPlus } from "react-icons/fa6";

export const OrderCard = ({ itemsCount }) => {
  const array = new Array(itemsCount);
  const gridClass =
    array.length === 2 ? "grid-rows-2 grid-cols-1" : "grid-rows-2 grid-cols-2";
  let calc = array.length > 3 ? array.splice(3) : 0;
  return (
    <article className="w-full h-full border border-[var(--black)] bg-[var(--white)] p-2 grid grid-cols-[2.5fr_4fr] gap-2">
      {itemsCount && array.length > 1 ? (
        <div className={`grid ${gridClass} gap-2 place-content-center h-35`}>
          {[...new Array(array.length)].map((item, index) => {
            return (
              <picture className="w-full h-full block" key={index}>
                <img
                  src="https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=1156&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="woman purse"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </picture>
            );
          })}

          {itemsCount > 3 && (
            <div className="h-full w-full flex justify-center items-center">
              <FaPlus />
              <span> {itemsCount - 3}</span>
            </div>
          )}
        </div>
      ) : (
        <picture className="w-full h-35 block">
          <img
            src="https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=1156&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="woman purse"
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </picture>
      )}

      <div>
        {/* shipping status begins */}
        <h4 className="text-lg">Delivered on May 15</h4>
        {/* shipping status ends */}

        {/* product name begins */}
        {itemsCount && array.length > 1 ? (
          <>
            {[
              ...new Array(
                array.length === 2 ? array.length - 1 : array.length - 2
              ),
            ].map((item, index) => {
              return (
                <p className="line-clamp-1 text-md my-2" key={index}>
                  Brown purse, premium version asdf asdfsdf asdfasdf
                </p>
              );
            })}
            {itemsCount > 1 && (
              <p className="line-clamp-1 text-md my-2">
                and {itemsCount - 1} more
              </p>
            )}
          </>
        ) : (
          <p className="line-clamp-2 text-md my-2">
            Brown purse, premium version asdf asdfsdf asdfasdf
          </p>
        )}
        {/* product name ends */}

        {/* order date begins */}
        <h4 className="text-lg">Ordered on May 11</h4>
      </div>
    </article>
  );
};
