import { OutlineButton } from "../components/buttons/OutlineButton";
import { BsCurrencyRupee } from "react-icons/bs";
import { ProductCard } from "../components/cards/ProductCard";
import { PriceCard } from "../components/cards/PriceCard";

export const Cart = () => {
  return (
    <div className="w-full h-full">
      <h1 className="text-center text-3xl font-bold p-2">
        My Cart
      </h1>

      {/* cart items begins */}
      <div className="grid mt-4 gap-4 items-center justify-items-center">
        {[1, 2, 3, 4, 5, 5].map((item, index) => {
          return <ProductCard key={index} quantity={1} cart={true}/>;
        })}
      </div>
      {/* cart items ends */}

      {/* price details begins */}
     <div className="mt-4">
       <PriceCard quanity={2} price={40000}/>
     </div>
      {/* price details ends */}

        {/* checkout button and price begins */}
        <div className="grid grid-cols-2 mt-4 items-center">
             <h3 className="flex items-center">
            <span className="text-2xl">
              <BsCurrencyRupee />
            </span>
            <span className="text-2xl">40000</span>
          </h3>
         <OutlineButton name={'Checkout'}/>
        </div>
        {/* checkout button and price ends */}
    </div>
  );
};
