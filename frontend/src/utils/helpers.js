import { Country, State } from "country-state-city";

export const formatTime = (secs) => {
  const min = String(Math.floor(secs / 60)).padStart(2, "0");
  const sec = String(secs % 60).padStart(2, "0");
  return `${min}min ${sec}s`;
};

export const getIsoCode = (
  countryName = "",
  country = false,
  stateName = "",
  state = false
) => {
  if (country) {
    const country = Country.getAllCountries().find(
      (opt) => opt.name.toLowerCase() === countryName.toLowerCase()
    );
    return country.isoCode;
  }
  if (state) {
    const country = Country.getAllCountries().find(
      (opt) => opt.name.toLowerCase() === countryName.toLowerCase()
    );
    const state = State.getStatesOfCountry(country.isoCode).find(
      (opt) => opt.name.toLowerCase() === stateName.toLowerCase()
    );
    return state.isoCode;
  }
};

export const formatMongodbDate = (date) => {
  if (!date) return "";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
   const month = d.toLocaleString("en-US", { month: "short" }); // Short month name
  const year = d.getFullYear();

  return `${day} ${month}, ${year}`;
};


export const formatINR = (amount=0) =>{
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amount);
}


export const deepLowercase = (obj) =>{
  if (Array.isArray(obj)) {
    return obj.map(deepLowercase); // process each array item
  } else if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepLowercase(value)])
    );
  } else if (typeof obj === "string") {
    return obj.toLowerCase(); // lowercase string
  }
  return obj; // leave other types (number, boolean, null) as is
}
