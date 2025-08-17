import { BsCurrencyRupee } from "react-icons/bs";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getAllYears,
  getMonthlyRevenue,
  getStockStatus,
  getTotalOrders,
  getTotalProducts,
  getTotalRevenue,
  getTotalUsers,
} from "../../store/thunks/adminThunks";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { NormalSelect } from "../../components/selectors/NormalSelect";
import { useForm } from "react-hook-form";

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

// ============================= Bar Chart ==============================
const barOptions = {
  responsive: true,
  maintainAspectRatio: false, // allows custom height
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          size: 12,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) => `₹${ctx.raw.toLocaleString()}`,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: 10,
        },
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `₹${value}`,
        font: {
          size: 10,
        },
      },
    },
  },
};

// ===================== Doughnut chart ==================================
const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          size: 14,
        },
      },
    },
    tooltip: {
      callbacks: {
        label: (ctx) =>
          `${ctx.label}: ${ctx.raw} (${(
            (ctx.raw / ctx.dataset.data.reduce((a, b) => a + b)) *
            100
          ).toFixed(1)}%)`,
      },
    },
  },
};



export const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    loading,
    years,
    totalRevenue,
    monthlyRevenue,
    totalProducts,
    totalUsers,
    totalOrders,
    stockStatus
  } = useSelector((state) => state.admin);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const barData = {
    labels: months,
    datasets: [
      {
        label: "Revenue (₹)",
        data: [
          ...months.map((month) =>
            monthlyRevenue ? monthlyRevenue[month.toLowerCase()] : 0
          ),
        ],
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderRadius: 6,
        barThickness: 10, // thinner bars for mobile
      },
    ],
  };


  const doughnutData = {
  labels: ["In Stock", "Out of Stock"],
  datasets: [
    {
      label: "Product Status",
      data: [stockStatus?.in_stock, stockStatus?.out_of_stock], // Replace with dynamic values later
      backgroundColor: ["#4ade80", "#f87171"], // green & red
      borderWidth: 1,
    },
  ],
};

  const { register, setValue, getValues, handleSubmit, reset } = useForm();

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    dispatch(getAllYears());
    dispatch(getTotalRevenue(currentYear));
    dispatch(getTotalProducts());
    dispatch(getTotalUsers());
    dispatch(getTotalOrders());
    dispatch(getMonthlyRevenue(currentYear));
    dispatch(getStockStatus())
  }, []);

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      {/* revenue begins */}
      <div className="grid grid-rows-2 w-full">
        <h1 className="text-xl font-bold self-start tracking-widest grid grid-cols-2 items-center mb-2">
          <span>Total Revenue</span>
          <span>
            <NormalSelect
              center={true}
              register={register}
              name="total_revenue_year"
              setValue={setValue}
              optionsData={years}
              selected={currentYear}
              defaultValue={currentYear}
              updateFunction={()=>dispatch(getTotalRevenue(getValues('total_revenue_year')))}
            />
          </span>
        </h1>
        <h1 className="flex justify-end items-center text-xl font-bold border-b-2 w-full pb-1">
          <BsCurrencyRupee />
          <span>{totalRevenue}</span>
        </h1>
      </div>
      {/* revenue ends */}

      {/* total products, users, orders begins */}
      <div className="grid grid-rows-3 gap-2 w-full mt-5">
        {["Products", "Users", "Orders"].map((name, index) => {
          return (
            <div
              className="bg-white border border-black p-2 rounded-xl"
              key={index}
            >
              <h1 className="text-xl font-bold text-center">Total {name}</h1>
              {name === "Products" && (
                <h1 className="text-xl font-bold text-center mt-2">
                  {loading ? <Skeleton height={25} /> : totalProducts}
                </h1>
              )}
              {name === "Users" && (
                <h1 className="text-xl font-bold text-center mt-2">
                  {loading ? <Skeleton height={25} /> : totalUsers}
                </h1>
              )}
              {name === "Orders" && (
                <h1 className="text-xl font-bold text-center mt-2">
                  {loading ? <Skeleton height={25} /> : totalOrders}
                </h1>
              )}
            </div>
          );
        })}
      </div>
      {/* total products, users, orders ends */}

      {/* Bar chart begins */}
      <div className="p-4 bg-white rounded-xl border border-black">
        <h2 className="text-lg font-semibold mb-4 grid grid-cols-2 items-center">
          <span>Monthly Revenue</span>
          <span>
            <NormalSelect
              center={true}
              register={register}
              name="monthly_revenue_year"
              setValue={setValue}
              optionsData={years}
              selected={currentYear}
              defaultValue={currentYear}
              updateFunction={()=>dispatch(getMonthlyRevenue(getValues('monthly_revenue_year')))}
            />
          </span>
        </h2>
        <div className="h-100">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
      {/* Bar chart ends */}

      {/* Doughnut chart begins */}
      <div className="bg-white rounded-xl border border-black p-4">
        <h2 className="text-lg font-semibold mb-3 text-center">Stock Status</h2>
        <div className="h-[300px] sm:h-[360px]">
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
      {/* Doughnut chart ends*/}
    </div>
  );
};
