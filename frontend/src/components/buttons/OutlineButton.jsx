export const OutlineButton = ({ name, icon = false, type='' }) => {
  return (
    <button type={type} className="flex justify-center items-center gap-2 w-full text-xl font-bold border-2 border-black rounded-md p-2 py-1 active:bg-black active:text-white transition-colors duration-200 capitalize">
      {icon ? (
        <>
          {icon}
          <span>{name}</span>
        </>
      ) : (
        name
      )}
    </button>
  );
};
