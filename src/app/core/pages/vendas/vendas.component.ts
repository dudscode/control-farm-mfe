import { Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexXAxis,
  NgApexchartsModule,
  ApexOptions,
} from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

export type LucroProdutosChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-vendas',
  imports: [CommonModule, NgApexchartsModule, MatCardModule],
  templateUrl: './vendas.component.html',
  styleUrl: './vendas.component.scss',
})
export class VendasComponent {
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
    text: 'Vendas Mensais',
    align: 'left',
  };

}
