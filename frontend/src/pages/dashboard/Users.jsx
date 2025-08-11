import { MdDelete } from "react-icons/md";
import { TitleWithSearchBar } from "../../components/Headers/TitleWithSearchBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../../store/thunks/adminThunks";
import { useEffect } from "react";
import {ImageCard} from '../../components/cards/ImageCard'
import { formatMongodbDate } from "../../utils/helpers";

export const Users = () => {
  const dispatch = useDispatch()
  const {loading,users} = useSelector((state)=>state.admin)

  useEffect(()=>{
    dispatch(getAllUsers())
  },[])
  
  
  return (
    <div>
      <TitleWithSearchBar
        title={"Users"}
        placeholderValue={"search by name or email..."}
      />

      <div className="grid grid-cols-2 gap-2.5 mt-5">
        {loading && [1, 2, 3, 4, 5, 6].map((item, index) => {
          return (
            <article
              className="bg-white border-black border rounded-xl flex flex-col justify-center p-2"
              key={index}
            >
              <div className="relative">
                <picture className="w-25 h-25 block rounded-full overflow-hidden justify-self-center">
                  <div className="w-full h-full">
                    <Skeleton height={'100%'} style={{scale:1.1}}/>
                  </div>
                </picture>
                <span className="absolute top-0 -right-1 text-2xl active:text-[var(--purpleDark)] transition-colors">
                  <Skeleton height={25} width={20}/>
                </span>
              </div>

              <h3 className="text-md mt-2">
                <span className="line-clamp-1"><Skeleton/></span>
              </h3>
              <h3 className="overflow-x-auto text-md w-full cursor-grab">
                <Skeleton/>
              </h3>
              <h3 className="text-md w-full"><Skeleton/></h3>
              <h3 className="text-sm text-[var(--light)]">
                <Skeleton/>
              </h3>
            </article>
          );
        })}

        {!loading && users?.map((user, index) => {
          return (
            <article
              className="bg-white border-black border rounded-xl flex flex-col justify-center p-2"
              key={user._id}
            >
              <div className="relative">
                <picture className="w-25 h-25 block rounded-full overflow-hidden justify-self-center relative">
                  <ImageCard src={user.profilePic}/>
                </picture>
               {user.role === 'user' && <MdDelete className="absolute top-0 -right-1 text-2xl active:text-[var(--purpleDark)] transition-colors" />}
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
      </div>
    </div>
  );
};
