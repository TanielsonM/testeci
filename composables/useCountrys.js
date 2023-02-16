import countrys from "~~/data/countrys";

export const useCountrys = () => {
  const alphabetical = countrys.sort(function(a, b) {
    if(a.sub < b.sub) return -1
    if(a.sub > b.sub) return 1
    return 0
  })

  return {
    countrys,
    alphabetical
  };
};
