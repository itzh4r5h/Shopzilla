import { useDispatch, useSelector } from "react-redux";
import {
  createOrderFromBuyNow,
  createOrderFromOfCartProducts,
  createPaymentOrder,
  deletePendingOrderAndPaymentOrder,
} from "../store/thunks/orderThunk";
import { useEffect } from "react";
import { FillButton } from "../components/buttons/FillButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { axiosInstance } from "../utils/AxiosInstance";
import { clearErrors, resetState } from "../store/slices/orderSlice";

export const Checkout = ({ cart = false, id, quantity }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId, razorpayOrder,error } = useSelector((state) => state.order);
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
    if(error){
      toast.error(error)
      dispatch(clearErrors())
    }
  },[error])


  useEffect(()=>{
    dispatch(resetState())
    if(localStorage.getItem('razorpayOrderId')){
      dispatch(deletePendingOrderAndPaymentOrder(localStorage.getItem('razorpayOrderId')))
      localStorage.removeItem('razorpayOrderId')
    }
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
      localStorage.removeItem('razorpayOrderId')
      navigate(`/orders/${data.orderId}`);
    } catch (error) {
      dispatch(deletePendingOrderAndPaymentOrder(localStorage.getItem('razorpayOrderId') || razorpayOrder.id))
      localStorage.removeItem('razorpayOrderId')
      toast.error('Something Went Wrong, Try Again')
    }
  };

  useEffect(() => {
    if (razorpayOrder) {
      localStorage.setItem('razorpayOrderId',razorpayOrder.id)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "ShopZilla",
        description: "Test Transaction",
        image: "https://ik.imagekit.io/hczmohsn7/shopzilla/logo/shopzillaLogo.webp",
        order_id: razorpayOrder.id,
        handler: function(response){
          callbackHandler(response);
        },
        modal:{
          ondismiss: function(){
            if(localStorage.getItem('razorpayOrderId')){
              dispatch(deletePendingOrderAndPaymentOrder(razorpayOrder.id))
            localStorage.removeItem('razorpayOrderId')
            }
          }
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
          color: "#ffff",
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
