function valideCPF(document: string): boolean {
  const cpf = document.replace(/[^\d]+/g, "");
  if (cpf.length !== 11) return false;
  const invalids = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];
  if (invalids.includes(cpf)) return false;

  let rev,
    add = 0;
  // Validates first digit
  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }
  rev = 11 - (add % 11);
  if ([10, 11].includes(rev)) rev = 0;
  if (rev !== parseInt(cpf.charAt(9))) return false;

  // Validated second digit
  add = 0;
  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }
  rev = 11 - (add % 11);
  if ([10, 11].includes(rev)) rev = 0;
  if (rev !== parseInt(cpf.charAt(10))) return false;

  return true;
}

function valideCNPJ(document: string): boolean {
  let cnpj = document.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let t = cnpj.length - 2;
  let d = cnpj.substring(t); // get 2 last numbers
  let d1 = parseInt(d.charAt(0)); //
  let d2 = parseInt(d.charAt(1));
  const calc = (x: number): number | boolean => {
    let n = cnpj.substring(0, x);
    let y = x - 7;
    let s = 0;
    let r = 0;

    for (let i = x; i >= 1; i--) {
      s += parseInt(n.charAt(x - 1)) * y--;
      if (y < 2) y = 9;
    }

    r = 11 - (s % 11);
    return r > 9 ? 0 : r;
  };

  return calc(t) === d1 && calc(t + 1) === d2;
}

export function document(value: string): boolean | string {
  return valideCPF(value) || valideCNPJ(value);
}
