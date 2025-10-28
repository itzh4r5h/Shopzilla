import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getAllUsers } from "../../store/thunks/admin/adminUserThunk";
import { useEffect } from "react";
import { ImageCard } from "../../components/cards/ImageCard";
import { formatMongodbDate } from "../../utils/helpers";
import {
  saveSearch,
  setPage,
} from "../../store/slices/admin/adminUserSlice";
import { DeleteModal } from "../../components/modal/DeleteModal";
import { PurplePagination } from "../../components/common/PurplePagination";
import { SearchBar } from "../../components/Filters/SearchBar";

export const Users = () => {
  const dispatch = useDispatch();
  const { loading, users, search, updated, page, totalPages } =
    useSelector((state) => state.adminUser);

  useEffect(() => {
    if (!users) {
      dispatch(saveSearch(''));
      dispatch(getAllUsers({page:1,search:''}));
    }
  }, [users]);

  useEffect(() => {
    if (updated) {
      dispatch(getAllUsers({page:1,search:''}));
    }
  }, [updated]);

  useEffect(() => {
    dispatch(getAllUsers({page,search}));
  }, [page,search]);

  return (
    <div className="h-full relative grid grid-cols-1 grid-rows-[1fr_11fr] gap-y-3">
      <div>
         <h1 className="text-2xl text-center font-semibold -mt-1 mb-1">Users</h1>
        <SearchBar placeholderValue={"search by name or email..."} path={"/admin/dashboard/users"}/>
      </div>

      <div className="grid grid-cols-2 gap-2.5 overflow-y-auto">
        {loading &&
          [1, 2, 3, 4, 5, 6].map((item, index) => {
            return (
              <article
                className="bg-white border-black border rounded-xl flex flex-col justify-center p-2"
                key={index}
              >
                <div className="relative">
                  <picture className="w-25 h-25 block rounded-full overflow-hidden justify-self-center">
                    <div className="w-full h-full">
                      <Skeleton height={"100%"} style={{ scale: 1.1 }} />
                    </div>
                  </picture>
                  <span className="absolute top-0 -right-1 text-2xl active:text-[var(--purpleDark)] transition-colors">
                    <Skeleton height={25} width={20} />
                  </span>
                </div>

                <h3 className="text-md mt-2">
                  <span className="line-clamp-1">
                    <Skeleton />
                  </span>
                </h3>
                <h3 className="overflow-x-auto text-md w-full cursor-grab">
                  <Skeleton />
                </h3>
                <h3 className="text-md w-full">
                  <Skeleton />
                </h3>
                <h3 className="text-sm text-[var(--light)]">
                  <Skeleton />
                </h3>
              </article>
            );
          })}

        {!loading &&
          users?.map((user, index) => {
            return (
              <article
                className="bg-white border-black border rounded-xl flex flex-col justify-center p-2 h-fit"
                key={user._id}
              >
                <div className="relative">
                  <picture className="w-25 h-25 block rounded-full overflow-hidden justify-self-center relative">
                    <ImageCard src={user.profilePic} product={false} />
                  </picture>
                  {user.role === "user" && (
                    <span className="absolute top-0 -right-1">
                      <DeleteModal
                        deleteFunction={() => {
                          dispatch(deleteUser(user._id));
                        }}
                      />
                    </span>
                  )}
                </div>

                <h3 className="text-md mt-2">
                  <span className="line-clamp-1">{user.name}</span>
                </h3>
                <h3 className="overflow-x-auto text-md w-full cursor-grab">
                  {user.email}
                </h3>
                <h3 className="text-md w-full">Role - {user.role}</h3>
                <h3 className="text-sm text-[var(--light)]">
                  created : {formatMongodbDate(user.createdAt)}
                </h3>
              </article>
            );
          })}

                {users?.length > 0 && (
          <div className="flex justify-center items-end col-span-2">
            <PurplePagination count={totalPages} setPage={setPage} page={page}/>
          </div>
        )}
      </div>

      {!loading && users?.length === 0 && (
        <p className="text-center text-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          No users exists
        </p>
      )}
    </div>
  );
};
