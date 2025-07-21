import { IStatus, IVendaCadastro } from "./vendas/cadastro.interface";

export interface DashboardProductData {
  status: string;
  quantity: number;
}
export interface DashboardColheitaData {
  date: string;
  quantity: number;
}
export interface IProductAndVendas {
    amount: number;
    date: string;
    harvest: string;
    id_product?: string;
    location: string;
    name: string;
    nameHarvest: string;
    value: number;
    status: IStatus;
    profit?: number;
    vendas?: IVendaCadastro[];
}