import { OrderCard } from "../components/cards/OrderCard";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMyOrders } from "../store/thunks/orderThunk";

export const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.order);
  
  useEffect(()=>{
    dispatch(getMyOrders())
  },[])

  return (
    <div className="h-full w-full relative mb-2">
      <h1 className="text-center text-3xl font-bold p-2">My Orders</h1>

      {orders?.length > 0 ? (
        <div className="grid mt-4 gap-4 items-center justify-items-center">
          {orders?.map((order) => {
            return (
              <Link to={`/orders/${order._id}`} key={order._id} className="w-full">
                <OrderCard order={order} />
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
         No Orders Yet
        </p>
      )}
    </div>
  );
};
