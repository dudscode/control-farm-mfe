import { DashboardCardData } from "./dashboard-card-data.interface";

export interface VendaResponse {
  dashboardCardData: DashboardCardData[];
  dashboardprofitData: DashboardProfitData[];
  productsData: ProductData[];
}

export interface DashboardProfitData {
  produto: string;
  vendasPorMes: VendaPorMes[];
}

export interface VendaPorMes {
  mes: number;
  nome: string;
  valor: number;
}

export interface ProductData {
 id: number;
 productName: string;
 locationLotes: string,
 dateTime: Date,
 piece: number,
 lucros: number,
}
