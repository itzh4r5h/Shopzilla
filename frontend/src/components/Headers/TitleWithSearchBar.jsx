import { SearchBar } from "../Filters/SearchBar";

export const TitleWithSearchBar = ({title,placeholderValue}) => {
  return (
    <>
      {/* title and searchbar begins */}
      <div className="flex flex-col items-center justify-center w-full gap-2">
        <h1 className="text-2xl text-center font-semibold">{title}</h1>
        <SearchBar placeholderValue={placeholderValue} />
      </div>
      {/* title and searchbar ends */}
    </>
  );
};
