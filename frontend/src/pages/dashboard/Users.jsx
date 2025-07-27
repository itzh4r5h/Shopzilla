import { MdDelete } from "react-icons/md";
import { TitleWithSearchBar } from "../../components/Headers/TitleWithSearchBar";

export const Users = () => {
  return (
    <div>
      <TitleWithSearchBar
        title={"Users"}
        placeholderValue={"search by name or email..."}
      />

      <div className="grid grid-cols-2 gap-3 mt-5">
        {[1, 2, 4, 5, 5, 5, 5].map((item, index) => {
          return (
            <article
              className="bg-white border-black border rounded-xl flex flex-col justify-center p-2"
              key={index}
            >
              <div className="relative">
                <picture className="w-25 h-25 block rounded-full overflow-hidden justify-self-center">
                  <img
                    src="https://plus.unsplash.com/premium_photo-1664392147011-2a720f214e01?q=80&w=1156&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="woman purse"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </picture>
                <MdDelete className="absolute top-0 -right-1 text-2xl active:text-[var(--purpleDark)] transition-colors" />
              </div>

              <h3 className="text-md mt-2">
                <span className="line-clamp-1">Harsh</span>
              </h3>
              <h3 className="overflow-x-auto text-md w-full cursor-grab">
                harsh@gmail.com
              </h3>
              <h3 className="text-md w-full">Role - user</h3>
              <h3 className="text-sm text-[var(--light)]">
                created on 19Jun,2024
              </h3>
            </article>
          );
        })}
      </div>
    </div>
  );
};
