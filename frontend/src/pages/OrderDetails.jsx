import { FaCircleArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router";
import { ProductCard } from "../components/cards/ProductCard";
import { FillButton } from "../components/buttons/FillButton";

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
  const navigate = useNavigate();
  const steps = [
    "Confirmed",
    "Processed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
  ];

  return (
    <div className="h-full w-full">
     <Heading name={'Order Details'} path={'/orders'}/>

      <div className="flex flex-col justify-center gap-4 mt-5">
        <ProductCard orderDetails={true} />

        {/* order status begins */}
        <div className="border border-black bg-white p-2">
          <h2 className="text-xl font-bold">Order Status</h2>

          <Stack sx={{ width: "100%" }} spacing={4}>
            <Stepper
              activeStep={4}
              connector={<QontoConnector />}
              orientation="vertical"
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel
                    slots={{ stepIcon: QontoStepIcon }}
                    sx={{ fontSize: "20px" }}
                  >
                    <span className="text-lg">{label}</span>{" "}
                    <span className="text-[var(--light)] text-md">
                      Mon, 12th May '25
                    </span>{" "}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
        </div>
        {/* order status ends */}

        {/* price details begins */}
        <PriceCard quanity={1} price={14999} />
        {/* price details ends */}

        {/* address begins */}
         <div className="flex flex-col justify-center gap-1 border bg-white rounded-md p-2">
           <h1 className="text-xl border-b-1 pb-1 mb-2">Shipping Address</h1>
            <h3 className="text-md">address</h3>
            <h3 className="text-md">city</h3>
            <h3 className="text-md">state, 136135</h3>
            <h3 className="text-md">mobile no</h3>
          </div>
        {/* address ends */}
      </div>
    </div>
  );
};
