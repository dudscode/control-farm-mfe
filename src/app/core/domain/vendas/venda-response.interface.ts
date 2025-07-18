import { DashboardCardData } from "./dashboard-card-data.interface";

export interface VendaResponse {
  dashboardCardData: DashboardCardData[];
  dashboardprofitData: DashboardProfitData[];
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
