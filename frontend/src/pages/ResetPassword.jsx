import { useForm } from "react-hook-form";
import { FillButton } from "../components/buttons/FillButton";
import { FaGoogle } from "react-icons/fa";
import { OutlineButton } from "../components/buttons/OutlineButton";
import {useParams} from 'react-router'

export const ResetPassword = () => {
  const {token} = useParams()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  return (
    <div>
      <form
        onSubmit={handleSubmit((data) => console.log(data))}
        className="bg-white border border-black w-full p-3 flex flex-col justify-center gap-5"
      >
        <h1 className="text-center text-2xl">Reset Password</h1>

        {/* email begins */}
        {!token && <div className="flex flex-col justify-center gap-2">
          <label htmlFor="email" className="text-xl w-fit">
            Email
          </label>
          <input
            type="email"
            {...register("email", { required: true })}
            id="email"
            className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
          />
        </div>}
        {/* email ends */}

        {/* password begins */}
       {token && <div className="flex flex-col justify-center gap-2 mb-4">
          <label htmlFor="password" className="text-xl w-fit">
            New Password
          </label>
          <input
            type="password"
            {...register("password", { required: true })}
            id="password"
            className="border rounded-md p-1 text-lg bg-[var(--grey)] outline-none focus:ring-2 focus:ring-[var(--purpleDark)]"
          />
        </div>}
        {/* password ends */}

        <span>
          <FillButton name={!token?"Send Reset Password URL":"Submit"} />
        </span>
      </form>
    </div>
  );
};

