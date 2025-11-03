import { BsCurrencyRupee } from "react-icons/bs";
import { Checkout } from "../../pages/Checkout";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { formatINR } from "../../utils/helpers";

export const PriceCard = ({ price, quanity, orderDetails = false }) => {
  const shippingPrice = price ? (price > 500 ? 0 : 79) : "";
  const totalPrice = price ? price + shippingPrice : "";

  return price && quanity ? (
    <div className="border border-[var(--black)] bg-[var(--white)] p-2">
      <h1 className="text-xl border-b-1 pb-1 mb-2">Price Details</h1>

      {/* items price begins */}
      <div className="grid grid-cols-[2fr_3fr] gap-2">
        <h3>
          Price {"("} {quanity} {quanity > 1 ? "items" : "item"} {")"}
        </h3>
        <h3 className="flex items-center justify-end">
          <span>
            <BsCurrencyRupee />
          </span>
          <span>{formatINR(price)}</span>
        </h3>
      </div>
      {/* items price ends */}

      {/* shipping price begins */}
      <div className="grid grid-cols-[2fr_3fr] gap-2">
        <h3>Shipping Price</h3>
        <h3 className="flex items-center justify-end">
          <span>
            <BsCurrencyRupee />
          </span>
          <span>{shippingPrice}</span>
        </h3>
      </div>
      {/* shipping price ends */}

      {/* total price begins */}
      <div className="grid grid-cols-[2fr_3fr] gap-2 border-t pt-1 mt-3">
        <h3>Total Price</h3>
        <h3 className="flex items-center justify-end">
          <span>
            <BsCurrencyRupee />
          </span>
          <span>{formatINR(totalPrice)}</span>
        </h3>
      </div>
      {/* total price ends */}

      {/* checkout button and price begins */}
     {!orderDetails && <div className="grid grid-cols-2 mt-10 items-center">
        <h3 className="flex items-center">
          <span className="text-2xl">
            <BsCurrencyRupee />
          </span>
          <span className="text-2xl">{formatINR(totalPrice)}</span>
        </h3>

       <Checkout cart={true} />
      </div>}
      {/* checkout button and price ends */}
    </div>
  ) : (
    <div className="border border-[var(--black)] bg-[var(--white)] p-2">
      <h1 className="text-xl border-b-1 pb-1 mb-2">Price Details</h1>

      {[1, 2].map((_, index) => {
        return (
          <div className="grid grid-cols-[2fr_3fr] gap-2" key={index}>
            <h3>
              <Skeleton />
            </h3>
            <h3 className="flex items-center justify-end">
              <Skeleton height={16} width={100} />
            </h3>
          </div>
        );
      })}

      {/* total price begins */}
      <div className="grid grid-cols-[2fr_3fr] gap-2 border-t pt-1 mt-3">
        <h3>
          <Skeleton />
        </h3>
        <h3 className="flex items-center justify-end">
          <Skeleton height={16} width={100} />
        </h3>
      </div>
      {/* total price ends */}

      {/* checkout button and price begins */}
     {!orderDetails && <div className="grid grid-cols-2 mt-10 items-center gap-10">
        <h3 >
          <Skeleton height={25}/>
        </h3>

       <Skeleton height={30}/>
      </div>}
      {/* checkout button and price ends */}
    </div>
  );
};
