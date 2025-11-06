export const FillButton = ({ name,icon=false,type='',size='text-xl',padding='px-2 py-1',clr='bg-black' }) => {
  return (
    <button type={type} className={`flex justify-center items-center gap-2 w-full ${size} ${padding} font-bold border-2 border-black rounded-md ${clr} text-white active:bg-white active:text-black transition-colors duration-200 capitalize outline-none`}>
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
