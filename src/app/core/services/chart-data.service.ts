import { Injectable } from '@angular/core';
import { DashboardProfitData } from '../domain/vendas/venda-response.interface';
import { ApexOptions, ApexAxisChartSeries } from 'ng-apexcharts';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  constructor() {}

  mapDataToChartOptions(
    data: DashboardProfitData[],
    titulo: string = 'Gráfico de Vendas'
  ): Partial<ApexOptions> {
    const todosMeses: { mes: number; nome: string }[] = [];
    data.forEach(item => {
      item.vendasPorMes.forEach(venda => {
        if (!todosMeses.some(m => m.mes === venda.mes)) {
          todosMeses.push({ mes: venda.mes, nome: venda.nome });
        }
      });
    });
    todosMeses.sort((a, b) => a.mes - b.mes);

    const categorias = todosMeses.map(m => m.mes.toString());

    const series: ApexAxisChartSeries = data.map(item => {
      const valores = todosMeses.map(({ mes }) => {
        const v = item.vendasPorMes.find(x => x.mes === mes);
        return v ? v.valor : 0;
      });
      return {
        name: item.produto,
        data: valores
      };
    });

    const chartOptions: Partial<ApexOptions> = {
      series,
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          borderRadius: 5,
          borderRadiusApplication: 'end'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
        curve: 'smooth'
      },
      title: {
        text: titulo,
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: 'bold'
        }
      },
      xaxis: {
        categories: categorias,
        labels: {
          formatter: (value: string) => {
            const numero = Number(value);
            const mes = todosMeses.find(m => m.mes === numero);
            return mes?.nome ?? value;
          }
        },
        title: {
          text: 'Produtos'
        }
      },
      yaxis: {
        title: {
          text: 'R$ (milhares)'
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {

          formatter: function(val) {
            return "R$ " + val + " mil";
          }
        }
      }
    };

    return chartOptions;
  }
}
