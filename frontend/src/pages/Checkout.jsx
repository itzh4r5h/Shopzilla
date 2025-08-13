import { useDispatch, useSelector } from "react-redux";
import {
  createOrderFromBuyNow,
  createOrderFromOfCartProducts,
  createPaymentOrder,
} from "../store/thunks/orderThunk";
import { useEffect } from "react";
import { FillButton } from "../components/buttons/FillButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { axiosInstance } from "../utils/AxiosInstance";
import { resetState } from "../store/slices/orderSlice";

export const Checkout = ({ cart = false, id, quantity }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, razorpayOrder } = useSelector((state) => state.order);
  const { isLoggedIn, user } = useSelector((state) => state.user);

  const checkout = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in");
      navigate("/signin");
    } else {
      if (cart) {
        dispatch(createOrderFromOfCartProducts());
      } else {
        dispatch(createOrderFromBuyNow({ id, quantity }));
      }
    }
  };

  useEffect(()=>{
    dispatch(resetState())
  },[])

  useEffect(() => {
    if (orderId) {
      dispatch(createPaymentOrder(orderId));
    }
  }, [orderId]);

  const callbackHandler = async (paymentData) => {
    try {
      const { data } = await axiosInstance.post(
        "/payments/verify",
        {...paymentData,cart}
      );
      dispatch(resetState())
      navigate(`/orders/${data.orderId}`);
    } catch (error) {
      console.log(error.response?.data?.message || "Failed");
    }
  };

  useEffect(() => {
    if (razorpayOrder) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Shopzilla",
        description: "Test Transaction",
        // image: "/images/logo.webp",
        order_id: razorpayOrder.id,
        handler: function(response){
          callbackHandler(response);
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact:
            user?.shippingAddress[user.shippingAddressIndex - 1].mobileNumber,
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp1 = new window.Razorpay(options);

      rzp1.open();
    }
  }, [razorpayOrder]);
  return (
    <span className="w-full" onClick={checkout}>
      <FillButton type="button" name={cart ? "Checkout" : "Buy Now"} />
    </span>
  );
};
