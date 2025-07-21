import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCardComponent } from '../../../shared/components/dashboard-card/dashboard-card.component';
import { AssetUrlPipe } from '../../../shared/pipes/asset-url.pipe';
import { VendasService } from '../../services/vendas.service';
import { DashboardCardData } from '../../domain/vendas/dashboard-card-data.interface';
import { ChartDataService } from '../../services/chart-data.service';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { DashboardProfitData, ProductData } from '../../domain/vendas/venda-response.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth/auth.service';
import { finalize } from 'rxjs';
import { IProduct, IVendaCadastro } from '../../domain/vendas/cadastro.interface';
import { IProductAndVendas } from '../../domain/products.interface';

export interface IVendasAndProducts {
  amount: number;
  date: string;
  price: number;
  profit: number;
  total_sale: number;
  id_product: string;
  product?: IProduct[];

}
interface IVendas {
  nameHarvest: string;
  amount: number;
  date: string;
  location: string;
  venda: number;
}
@Component({
  selector: 'app-vendas',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgApexchartsModule,
    DashboardCardComponent,
    AssetUrlPipe,
    GenericTableComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './vendas.component.html',
  styleUrl: './vendas.component.scss',
})
export class VendasComponent implements OnInit {
  dashboardCards: DashboardCardData[] = [];
  @ViewChild('chart')
  chart!: ChartComponent;
  public chartOptions!: Partial<ApexOptions>;
  loading: boolean = true;
  products: ProductData[] = [];
  allProducts: IProductAndVendas[] = [];
  allVendas: IVendas[] = [];
  showSemProdutos: boolean = false;
  showSemVendas: boolean = false;
  showErro: boolean = false;
  chartData: DashboardProfitData[] = [];
  private readonly chartDataService = inject(ChartDataService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.getVendas();
    this.getVendasByProduct();
  }


  getVendas() {
    this.loading = true;
    this.authService.getProductAndVendas().pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (products) => {
        if (!products || !products.length) {
          this.showSemProdutos = true;
          return;
        }
        this.allProducts = products.map(p => ({
          amount: p.amount,
          date: p.date,
          harvest: p.harvest,
          location: p.location,
          nameHarvest: p.name + '-' + p.harvest,
          name: p.name,
          value: p.value,
          status: p.status,
          vendas: p.vendas || [],
          profit: this.calculateProfit(p.vendas || []),
        }));

        this.criaCard();
        this.createChart();
      },
      error: (err) => {
        this.showErro = true;
        console.error('Erro ao buscar produtos:', err);
      }
    });

  }
  getVendasByProduct() {
    this.authService.getVendasAndProduct().subscribe({
      next: (data) => {
        if (!data || !data.length) {
          this.showSemVendas = true;
          return;
        }
        this.allVendas = data.map(p => ({
          nameHarvest: p.produto.name + '-' + p.produto.harvest,
          amount: p.amount,
          date: p.date,
          location: p.produto.location,
          venda: p.price,
        }));
      },
      error: (err) => {
        console.error('Erro ao buscar vendas por produto:', err);
      }
    });
  }

  openCadastroVendas() {
    this.router.navigate(['/home/cadastro-vendas']);
  }
  createChart() {
    this.chartData = this.allProducts.map(product => ({
      produto: product.nameHarvest,
      vendasPorMes: product.vendas?.map(venda => ({
        mes: this.getMonthNumber(venda.date),
        nome: this.getMonthName(venda.date),
        valor: venda.price
      })) || []
    }));
    this.chartOptions = this.chartDataService.mapDataToChartOptions(
      this.chartData,
      'Lucro por produto'
    );
  }

  criaCard() {
    this.dashboardCards = [{
      icon: 'icon/cube-icon.svg',
      cardMetric: this.calculateTotalProducts(this.allProducts),
      efficiencyPercentage: 0,
      label: 'Total Produtos',
      isCurrency: false,
    },
    {
      icon: 'icon/finance-icon.svg',
      cardMetric: this.calculateTotalVendas(this.allProducts),
      efficiencyPercentage: 0,
      label: 'Total vendas',
      isCurrency: true,
    },
    {
      icon: 'icon/person-icon.svg',
      cardMetric: this.calculateProfitTotal(this.allProducts),
      efficiencyPercentage: 0,
      label: 'Total Lucro',
      isCurrency: true,
    },]
  }

  calculateProfitTotal(products: IProductAndVendas[]): number {
    const vendas = products.flatMap(p => p.vendas || []);
    const totalProfit = vendas.reduce((acc, venda) => acc + (venda.profit || 0), 0);
    return totalProfit;
  }
  getMonthNumber(date: string): number {
    return new Date(date).getMonth() + 1;
  }
  getMonthName(date: string): string {
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return meses[new Date(date).getMonth()];
  }
  calculateProfit(vendas: any[]): number {
    const totalProfit = vendas.reduce((acc, venda) => acc + (venda.profit || 0), 0);
    return totalProfit;
  }
  calculateTotalVendas(products: IProductAndVendas[]): number {
    const vendas = products.flatMap(p => p.vendas || []);
    return vendas.reduce((acc, venda) => acc + (venda.total_sale || 0), 0);
  }
  calculateTotalProducts(products: IProductAndVendas[]): number {
    return products.reduce((acc, p) => acc + (p.amount || 0), 0);
  }
  calculateTotalStatusCount(products: IProductAndVendas[], status: string): number {
    return products.filter(p => p.status === status).reduce((acc, p) => acc + (p.amount || 0), 0);
  }
}
