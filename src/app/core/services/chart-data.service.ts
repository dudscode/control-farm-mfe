import { Injectable } from '@angular/core';
import { DashboardProfitData } from '../domain/vendas/venda-response.interface';
import { ApexOptions, ApexAxisChartSeries } from 'ng-apexcharts';
import { DashboardColheitaData, DashboardProductData } from '../domain/products.interface';

@Injectable({
  providedIn: 'root',
})
export class ChartDataService {
  constructor() { }

  mapDataToChartOptions(
    data: DashboardProfitData[],
    titulo: string = 'Gráfico de Vendas'
  ): Partial<ApexOptions> {
    const todosMeses: { mes: number; nome: string }[] = [];
    data.forEach((item) => {
      item.vendasPorMes.forEach((venda) => {
        if (!todosMeses.some((m) => m.mes === venda.mes)) {
          todosMeses.push({ mes: venda.mes, nome: venda.nome });
        }
      });
    });
    todosMeses.sort((a, b) => a.mes - b.mes);

    const categorias = todosMeses.map((m) => m.mes.toString());

    const series: ApexAxisChartSeries = data.map((item) => {
      const valores = todosMeses.map(({ mes }) => {
        const v = item.vendasPorMes.find((x) => x.mes === mes);
        return v ? v.valor : 0;
      });
      return {
        name: item.produto,
        data: valores,
      };
    });

    const chartOptions: Partial<ApexOptions> = {
      series,
      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '35%',
          borderRadius: 7,
          borderRadiusApplication: 'end',
          distributed: false,
          rangeBarOverlap: true,
          rangeBarGroupRows: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent'],
        curve: 'smooth',
      },
      title: {
        text: titulo,
        align: 'left',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
        },
      },
      xaxis: {
        categories: categorias,
        labels: {
          formatter: (value: string) => {
            const numero = Number(value);
            const mes = todosMeses.find((m) => m.mes === numero);
            return mes?.nome ?? value;
          },
        },
        title: {
          text: 'Produtos',
        },
      },
      yaxis: {
        title: {
          text: 'R$ (milhares)',
        },
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return 'R$ ' + val + ' mil';
          },
        },
      },
    };

    return chartOptions;
  }
  mapDataToChartOptionsRadius(
    data: DashboardProductData[],
    titulo: string = 'Gráfico de Status'
  ): Partial<ApexOptions> {
    const series = data.map((item) => item.quantity);
    const labels = data.map((item) => item.status);

    return {
      chart: {
        type: 'radialBar',
        height: 350
      },
      series: series,
      labels: labels,
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              show: true
            },
            value: {
              show: true,
              formatter: function (val: number) {
                  return val.toString(); 
                }
            },
            total: {
              show: true,
              label: 'Total',
              formatter: function () {
                return series.reduce((acc, val) => acc + val, 0).toString();
              }
            }
          }
        }
      },
      legend: {
        show: true,
        position: 'bottom',
        formatter: function (seriesName: string, opts: any) {
          const label = opts.w.globals.labels[opts.seriesIndex];
          const value = opts.w.globals.series[opts.seriesIndex];
          return `${label}: ${value}`; 
        }
      },
      title: {
        text: titulo,
        align: 'left'
      }
    };
  }
  mapDataChartOptionsColhido(
    data: DashboardColheitaData[],
    titulo: string = 'Gráfico de Colhidos'
  ): Partial<ApexOptions> {
    const labels = data.map((item) => {
      const date = new Date(item.date);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    });
    const quantities = data.map((item) => item.quantity);

    return {
      chart: {
        type: 'line',
        height: 350,
        zoom: {
          enabled: false
        }
      },
      series: [
        {
          name: 'Quantidade',
          data: quantities
        }
      ],
      xaxis: {
        categories: labels,
        title: {
          text: 'Data'
        }
      },
      yaxis: {
        title: {
          text: 'Quantidade Colhida'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
      },
      title: {
        text: titulo,
        align: 'left'
      },
      legend: {
        show: false
      }
    };
  }


}
