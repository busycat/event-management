import { City, cities } from "./cities";

export function pickRandom<T = any>(arr: { [p: string]: T }): {key: string; value: T} {
    const keys = Object.keys(arr);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    return {key: randomKey, value: arr[randomKey]};
}



export const getEventType = () => {
    const city = ["Workshop", "Festival", "Party"];
    const c = Math.floor(Math.random() * city.length);
    return city[c];
  };
  
  export const getCityName = () => {
  const state = pickRandom<City[]>(cities);
  const c = Math.floor(Math.random() * state.value.length);
  return   { state, city: state.value[c]};
};

