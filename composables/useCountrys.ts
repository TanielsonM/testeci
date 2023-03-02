import countrys from "~~/data/countrys";

export const useCountrys = () => {
  const alphabetical = countrys
    .sort(function (a, b) {
      if (a.sub < b.sub) return -1;
      if (a.sub > b.sub) return 1;
      return 0;
    })
    .filter((item) => item.show);
  function searcher(search = "") {
    return alphabetical.filter(
      (item) =>
        item.pais.toLowerCase().includes(search.toLowerCase().trim()) ||
        item.sub.toLowerCase().includes(search.toLowerCase().trim()) ||
        item.sigla.toLowerCase().includes(search.toLowerCase().trim())
    );
  }

  return {
    countrys,
    alphabetical,
    searcher,
  };
};
