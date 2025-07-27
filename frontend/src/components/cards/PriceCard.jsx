import { BsCurrencyRupee } from "react-icons/bs";

export const PriceCard = ({price,quanity}) => {
    const shippingPrice = 0
    const totalPrice = price+shippingPrice

  return (
    <div className="border border-[var(--black)] bg-[var(--white)] p-2">
             <h1 className="text-xl border-b-1 pb-1 mb-2">Price Details</h1>
     
             {/* items price begins */}
             <div className="grid grid-cols-[2fr_3fr] gap-2">
               <h3>Price {'('} {quanity} {quanity>1?'items':'item'} {')'}</h3>
               <h3 className="flex items-center justify-end">
                 <span>
                   <BsCurrencyRupee />
                 </span>
                 <span>{price}</span>
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
                 <span>0</span>
               </h3>
             </div>
             {/* shipping price ends */}
     
     
             {/* total price begins */}
             <div className="grid grid-cols-[2fr_3fr] gap-2 border-t-1 pt-1 mt-3">
               <h3>Total Price</h3>
               <h3 className="flex items-center justify-end">
                 <span>
                   <BsCurrencyRupee />
                 </span>
                 <span>{totalPrice}</span>
               </h3>
             </div>
             {/* total price ends */}
           </div>
  )
}
