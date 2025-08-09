import { Country, State, City } from "country-state-city";

export const formatTime = (secs) => {
    const min = String(Math.floor(secs / 60)).padStart(2, "0");
    const sec = String(secs % 60).padStart(2, "0");
    return `${min}min ${sec}s`;
};



export const getIsoCode = (countryName='',country=false,stateName='',state=false)=>{
    if(country){
        const country = Country.getAllCountries().find((opt)=>opt.name.toLowerCase()===countryName.toLowerCase())
        return country.isoCode
    }
    if(state){
         const country = Country.getAllCountries().find((opt)=>opt.name.toLowerCase()===countryName.toLowerCase())
         const state = State.getStatesOfCountry(country.isoCode).find((opt)=>opt.name.toLowerCase()===stateName.toLowerCase())
        return state.isoCode
    }
}