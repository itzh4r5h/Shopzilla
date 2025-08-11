import { FaCheckSquare, FaTimesCircle } from "react-icons/fa";
import { ImageCard } from "../../components/cards/ImageCard";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { updateImage } from "../../store/thunks/userThunks";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { MdEditSquare } from "react-icons/md";

export const ProfileImage = ({ profilePic }) => {
  const dispatch = useDispatch();
  const { updated,uploading } = useSelector((state) => state.user);
  const [image, setImage] = useState(undefined);

  const chooseImages = (e) => {
    const selectedImage = Array.from(e.target.files)[0];

    if (!selectedImage) return;

    if (
      selectedImage.type === "image/png" ||
      selectedImage.type === "image/jpeg"
    ) {
      // Size in MB
      const fileSizeMB = selectedImage.size / (1024 * 1024);
      const maxSize = import.meta.env.VITE_IMAGE_MAX_SIZE_IN_MB;

      if (fileSizeMB > maxSize) {
        toast.error(`File size should not exceed ${maxSize} MB`);
        return;
      }

      setImage(selectedImage);
    } else {
      toast.error("Only jpeg and png are allowed");
      return;
    }
  };

  const removeImage = () => {
    setImage(undefined);
  };

  useEffect(() => {
    if (updated) {
      setImage(undefined);
    }
  }, [updated]);

  return (
    <div className="self-center relative">
      {image ? (
        <picture className="w-55 h-55 block rounded-full overflow-hidden">
          {uploading && (
            <div className="h-full w-full relative">
              <Skeleton height={'100%'} style={{scale:1.1}}/>
              <p className="text-xl absolute z-10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">Uploading...</p>
            </div>
              
          )}

          {!uploading && (
            <img
              src={URL.createObjectURL(image)}
              alt={image.name.split(".")[0]}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </picture>
      ) : (
        <picture className="w-55 h-55 block rounded-full overflow-hidden relative">
          <ImageCard src={profilePic} />
        </picture>
      )}

      {image && !uploading && (
        <div className="absolute top-2 -right-10 z-100 flex justify-center items-center gap-5">
          <FaCheckSquare
            className="text-2xl active:text-[var(--purpleDark)] transition-colors"
            onClick={() => dispatch(updateImage(image))}
          />
          <FaTimesCircle
            className="self-end text-2xl"
            onClick={() => {
              removeImage();
            }}
          />
        </div>
      )}

      {!image && (
        <>
          <label htmlFor="images" className="absolute top-0 right-0 ">
            <MdEditSquare className=" text-2xl active:text-[var(--purpleDark)] transition-colors" />
          </label>
          <input
            type="file"
            name="images"
            id="images"
            accept="image/png, image/jpeg"
            className="hidden"
            onChange={chooseImages}
          />
        </>
      )}
    </div>
  );
};
