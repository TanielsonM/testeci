export type GlobalSettings = {
  id?: number;
  key?: string;
  value?: string | number;
  country?: string;
};

export type Installment = {
  value: number;
  index: number;
};

export type Product = {
  id: number;
  name: string;
  description: string;
  checked?: boolean;
};

/* Store states */
export type InstallmentsState = {
  installments: Installment[];
  maxInstallments: number;
  minValue: number;
};

export type BumpsState = {
  bumps: Product[];
};
