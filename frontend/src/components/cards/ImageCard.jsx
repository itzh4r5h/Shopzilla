import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ImageCard = ({ src, product = true }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <span className="absolute h-full w-full">
          <Skeleton height={"100%"} style={{ scale: 1.1 }} />
        </span>
      )}

      <img
        src={src.url}
        alt={src.name}
        loading="lazy"
        className={`${loaded ? "opacity-100" : "opacity-0"} h-full w-full ${
          product ? "object-contain" : "object-cover"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
      />
    </>
  );
};
