export interface IVendaCadastro {
  amount: number;
  date: string;
  price: number;
  profit: number;
  total_sale:number;
}
export interface IProductName {
    name: string;
}
export interface IProduct {
    amount: number;
    date: string;
    harvest: string;
    id_product?: string;
    location: string;
    name: string;
    value: number;
    status: IStatus;
}
export type IStatus = 'Aguardando' | 'Em produção' | 'Já colhido';