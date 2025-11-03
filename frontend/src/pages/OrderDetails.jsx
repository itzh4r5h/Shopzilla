import { Link, useParams } from "react-router";
import { ProductCard } from "../components/cards/ProductCard";

import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { FaCheck } from "react-icons/fa";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { PriceCard } from "../components/cards/PriceCard";
import { Heading } from "../components/Headers/Heading";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMyOrderDetails } from "../store/thunks/non_admin/orderThunk";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { formatMongodbDate } from "../utils/helpers";
import { ReviewModal } from "../components/modal/ReviewModal";
import { ReviewCard } from "../components/cards/ReviewCard";
import { getOrderedProductReviews } from "../store/thunks/non_admin/reviewThunk";
import { loadUser } from "../store/thunks/non_admin/userThunk";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor: "#eaeaf0",
    borderLeftWidth: 3,
    borderRadius: 1,
    ...theme.applyStyles("dark", {
      borderColor: theme.palette.grey[800],
    }),
  },
}));

const QontoStepIconRoot = styled("div")(({ theme }) => ({
  color: "#eaeaf0",
  "& .QontoStepIcon-completedIcon": {
    color: "#784af4",
    zIndex: 1,
    fontSize: 18,
    marginLeft: "5px",
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    marginLeft: "10px",
  },
  ...theme.applyStyles("dark", {
    color: theme.palette.grey[700],
  }),
  variants: [
    {
      props: ({ ownerState }) => ownerState.active,
      style: {
        color: "#784af4",
      },
    },
  ],
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <FaCheck className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

export const OrderDetails = () => {
  const steps = [
    "confirmed",
    "processing",
    "shipped",
    "dispatched",
    "out for delivery",
    "delivered",
  ];
  const { id } = useParams();
  const dispatch = useDispatch();
  const { order, loading, orderQuantity } = useSelector(
    (state) => state.order
  );
  const { user } = useSelector((state) => state.user);
  const { reviewed,orderedProductReviews } = useSelector((state) => state.review);

  useEffect(() => {
    dispatch(getOrderedProductReviews(id))
    dispatch(getMyOrderDetails(id));
    dispatch(loadUser())
  }, []);

  useEffect(() => {
    if (reviewed) {
      dispatch(getOrderedProductReviews(id))
    }
  }, [reviewed,order]);


  return !loading && order && orderedProductReviews?.length > 0  ? (
    <div className="h-full w-full">
      <Heading name={"Order Details"} path={"/orders"} />

      <div className="flex flex-col justify-center gap-4 mt-5">
        {order.orderItems.map((orderedProduct,index) => {
          return (
            <div key={orderedProduct._id}>
              <Link to={`/products/${orderedProduct.productId}/variants/${orderedProduct.variantId}/${orderedProduct.colorIndex}`}>
                <ProductCard variant={orderedProduct} orderDetails={true} productId={orderedProduct.productId} />
              </Link>

              {orderedProductReviews[index]?.isReviewed && (
                <div className="bg-white border mt-1 p-2">
                  <ReviewCard review={orderedProductReviews[index].review} id={orderedProduct.productId} />
                </div>
              )}

              {user.orderedProducts.includes(orderedProduct.productId) &&
                !orderedProductReviews[index]?.isReviewed && (
                  <div className="mt-1">
                    <ReviewModal id={orderedProduct.productId} />
                  </div>
                )}
            </div>
          );
        })}

        {/* order status begins */}
        <div className="border border-black bg-white p-2">
          <h2 className="text-xl font-bold">Order Status</h2>

          <Stack sx={{ width: "100%" }} spacing={4}>
            <Stepper
              activeStep={steps.indexOf(order.orderStatus) + 1}
              connector={<QontoConnector />}
              orientation="vertical"
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    slots={{ stepIcon: QontoStepIcon }}
                    sx={{ fontSize: "20px" }}
                  >
                    <div className="flex justify-between items-center capitalize">
                      <span className="text-lg">{label}</span>
                      <span className="text-[var(--light)] text-md">
                        {order[label] ? formatMongodbDate(order[label]) : ""}
                      </span>
                    </div>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
        </div>
        {/* order status ends */}

        {/* price details begins */}
        <PriceCard
          quanity={orderQuantity}
          price={order.totalPrice}
          orderDetails={true}
        />
        {/* price details ends */}

        {/* address begins */}
        <div className="flex flex-col justify-center gap-1 border bg-white rounded-md p-2">
          <h1 className="text-xl border-b-1 pb-1 mb-2">Shipping Address</h1>
          <h3 className="text-md capitalize">
            {order.shippingAddress.address}
          </h3>
          <h3 className="text-md capitalize">{order.shippingAddress.city}</h3>
          <h3 className="text-md capitalize">
            {order.shippingAddress.state}, {order.shippingAddress.pinCode}
          </h3>
          <h3 className="text-md capitalize">
            {order.shippingAddress.country}
          </h3>
          <h3 className="text-md capitalize">
            {order.shippingAddress.mobileNumber}
          </h3>
        </div>
        {/* address ends */}
      </div>
    </div>
  ) : (
    <div className="h-full w-full">
      <Heading name={"Order Details"} path={"/orders"} />

      <div className="flex flex-col justify-center gap-4 mt-5">
        <ProductCard orderDetails={true} />

        {/* order status begins */}
        <div className="border border-black bg-white p-2">
          <h2 className="text-xl font-bold">Order Status</h2>

          <Stack sx={{ width: "100%" }} spacing={4}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Stack>
        </div>
        {/* order status ends */}

        {/* price details begins */}
        <PriceCard orderDetails={true} />
        {/* price details ends */}

        {/* address begins */}
        <div className="flex flex-col justify-center gap-1 border bg-white rounded-md p-2">
          <h1 className="text-xl border-b-1 pb-1 mb-2 capitalize">
            Shipping Address
          </h1>
          <h3 className="text-md capitalize">
            <Skeleton />
          </h3>
          <h3 className="text-md capitalize">
            <Skeleton />
          </h3>
          <h3 className="text-md capitalize">
            <Skeleton />
          </h3>
          <h3 className="text-md capitalize">
            <Skeleton />
          </h3>
        </div>
        {/* address ends */}
      </div>
    </div>
  );
};
