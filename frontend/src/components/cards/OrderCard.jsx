import { FaPlus } from "react-icons/fa6";
import { ImageCard } from "./ImageCard";
import { formatMongodbDate } from "../../utils/helpers";

export const OrderCard = ({ order }) => {
  const itemsCount = order.orderItems.length;
  const gridClass =
    itemsCount === 2 ? "grid-rows-2 grid-cols-1" : "grid-rows-2 grid-cols-2";

  return (
    <article className="w-full h-full border border-[var(--black)] bg-[var(--white)] p-2 grid grid-cols-[3fr_4fr] gap-2">
      {itemsCount > 1 && (
        <div className={`grid ${gridClass} gap-2 place-content-center h-30`}>
          {[
            ...(itemsCount > 2
              ? order.orderItems.slice(0, 3)
              : order.orderItems),
          ].map((item) => {
            return (
              <picture
                className="w-full h-full block relative overflow-hidden"
                key={item._id}
              >
                <ImageCard src={{ url: item.image, name: item.name }} />
              </picture>
            );
          })}

          {itemsCount > 3 && (
            <div className="h-full w-full flex justify-center items-center gap-2">
              <FaPlus />
              <span className="text-xl"> {itemsCount - 3}</span>
            </div>
          )}
        </div>
      )}

      {itemsCount === 1 && (
        <picture className="w-full h-30 block relative overflow-hidden">
          <ImageCard
            src={{
              url: order.orderItems[0].image,
              name: order.orderItems[0].name,
            }}
          />
        </picture>
      )}

      <div className="grid grid-rows-[1fr_3fr_1fr]">
        {/* shipping status begins */}
        <h4 className="text-md text-[var(--light)] capitalize">
          Status - {order.orderStatus}
        </h4>
        {/* shipping status ends */}

        {/* product name begins */}
        {itemsCount > 1 ? (
          <div className="w-full">
            {[
              ...(itemsCount > 2
                ? order.orderItems.slice(0, 2)
                : order.orderItems),
            ].map((item, index) => {
              return (
                <p className="line-clamp-1 text-md" key={item._id}>
                  {item.name}
                </p>
              );
            })}

            {itemsCount > 2 && (
              <p className="line-clamp-1 text-md">and {itemsCount - 2} more</p>
            )}
          </div>
        ) : (
          <p className="line-clamp-2 text-md">{order.orderItems[0].name}</p>
        )}
        {/* product name ends */}

        {/* order date begins */}
        <h4 className="text-md text-[var(--light)]">
          Ordered on {formatMongodbDate(order.confirmed)}
        </h4>
      </div>
    </article>
  );
};
