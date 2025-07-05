import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule,
  ApexOptions,
  ApexYAxis,
  ApexPlotOptions,
  ApexDataLabels,
  ApexLegend,
} from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCardComponent } from '../../../shared/components/dashboard-card/dashboard-card.component';
import { AssetUrlPipe } from '../../../shared/pipes/asset-url.pipe';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
};

interface DashboardCardData {
  icon: string;
  cardMetric: number;
  efficiencyPercentage: number;
  label: string;
  isCurrency: boolean;
  isPositive?: boolean;
}

@Component({
  selector: 'app-vendas',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgApexchartsModule,
    DashboardCardComponent,
    AssetUrlPipe
  ],
  templateUrl: './vendas.component.html',
  styleUrl: './vendas.component.scss',
})
export class VendasComponent implements OnInit {
  dashboardCards: DashboardCardData[] = [
    {
      icon: 'icon/cube-icon.svg',
      cardMetric: 10293,
      efficiencyPercentage: 1.3,
      label: 'Total de produtos',
      isCurrency: false,
      isPositive: true,
    },
    {
      icon: 'icon/finance-icon.svg',
      cardMetric: -89000,
      efficiencyPercentage: 4.2,
      label: 'Total de vendas',
      isCurrency: true,
      isPositive: false,
    },
    {
      icon: 'icon/person-icon.svg',
      cardMetric: 40689,
      efficiencyPercentage: 8.5,
      label: 'Compradores',
      isCurrency: false,
      isPositive: false,
    },
  ];

  chartSeries: ApexAxisChartSeries = [
    {
      name: 'Vendas',
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
    },
  ];

  chartDetails: ApexChart = {
    type: 'line',
    height: 350,
  };

  xAxis: ApexXAxis = {
    categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
  };

  chartTitle: ApexTitleSubtitle = {
    text: 'Lucro por Produto',
    align: 'left',
  };

  ngOnInit(): void {


  }
}
