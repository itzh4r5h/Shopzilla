import { useDispatch, useSelector } from "react-redux";

export const NotFound = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  return (
    <>
      {loading ? (
        ""
      ) : (
        <div className="bg-white p-2 border border-black flex flex-col justify-center items-center gap-2 mt-10">
          <h1 className="text-8xl mt-10 text-center">Oops!</h1>
          <h1 className="text-7xl text-center">404</h1>
          <h1 className="text-6xl text-center">Not Found</h1>
          <p className="text-2xl text-center mb-10">The page you are trying to access doesn't exist</p>
        </div>
      )}
    </>
  );
};
