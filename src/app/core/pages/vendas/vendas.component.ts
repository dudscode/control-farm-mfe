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
import { ProductData } from '../../domain/vendas/venda-response.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

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
  private readonly vendasService = inject(VendasService);
  private readonly chartDataService = inject(ChartDataService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.getVendas();
  }

  getVendas() {
    this.vendasService.getVendas().subscribe({
      next: (response) => {
        this.dashboardCards = response.dashboardCardData;
        console.log(response);
        this.products = response.productsData;
        this.chartOptions = this.chartDataService.mapDataToChartOptions(
          response.dashboardprofitData,
          'Lucro por produto'
        );
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  openCadastroVendas() {
    this.router.navigate(['/home/cadastro-vendas']);
  }
}
