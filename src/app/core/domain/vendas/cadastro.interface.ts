export interface IVendaCadastro {
  amount: number;
  date: string;
  price: number;
  profit: number;
  total_sale: number;
  id_product: string;
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

export interface IMetas {
  completed: boolean;
  current_profit: number;
  date: string ;
  desired_profit: number;
  id_product: string;
}

export interface INotification {
  id?: string;
  message: string;
  read: boolean;
  title: string;
}