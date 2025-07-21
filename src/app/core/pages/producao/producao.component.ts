import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { NgApexchartsModule, ChartComponent, ApexOptions } from 'ng-apexcharts';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCardComponent } from '../../../shared/components/dashboard-card/dashboard-card.component';
import { AssetUrlPipe } from '../../../shared/pipes/asset-url.pipe';
import { DashboardCardData } from '../../domain/vendas/dashboard-card-data.interface';
import { ChartDataService } from '../../services/chart-data.service';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { finalize } from 'rxjs';
import { DashboardColheitaData, DashboardProductData, IProductAndVendas } from '../../domain/products.interface';



@Component({
    selector: 'app-producao',
    imports: [CommonModule,
        MatCardModule,
        MatIconModule,
        NgApexchartsModule,
        DashboardCardComponent,
        AssetUrlPipe,
        GenericTableComponent,
        MatProgressSpinnerModule,
        MatButtonModule
    ],
    templateUrl: './producao.component.html',
    styleUrl: './producao.component.scss'
})

export class ProducaoComponent implements OnInit {
    dashboardCards: DashboardCardData[] = [];
    @ViewChild('chart')
    chart!: ChartComponent;
    public chartOptions!: Partial<ApexOptions>;
    public chartOptionsColhido!: Partial<ApexOptions>;
    loading: boolean = true;
    allProducts: IProductAndVendas[] = [];
    chartData: DashboardProductData[] = [];
    chartDataColheita: DashboardColheitaData[] = [];

    showSemProdutos: boolean = false;
    showErro: boolean = false;
    private readonly router = inject(Router);
    private readonly authService = inject(AuthService);
    private readonly chartDataService = inject(ChartDataService);


    ngOnInit(): void {
        this.getProducts();
    }

    getProducts() {
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
    criaCard() {
        this.dashboardCards = [{
            icon: 'icon/cube-icon.svg',
            cardMetric: this.calculateTotalStatusCount(this.allProducts, `Em produção`),
            efficiencyPercentage: 0,
            label: 'Em produção',
            isCurrency: false,
        },
        {
            icon: 'icon/finance-icon.svg',
            cardMetric: this.calculateTotalStatusCount(this.allProducts, `Aguardando`),
            efficiencyPercentage: 0,
            label: 'Aguardando',
            isCurrency: false,
        },
        {
            icon: 'icon/person-icon.svg',
            cardMetric: this.calculateTotalStatusCount(this.allProducts, `Já colhido`),
            efficiencyPercentage: 0,
            label: 'Já colhido',
            isCurrency: false,
        },]
    }
    createChart() {
        this.chartData = [{
            status: 'Em produção',
            quantity: this.calculateTotalStatusCount(this.allProducts, `Em produção`),
        },
        {
            status: 'Aguardando',
            quantity: this.calculateTotalStatusCount(this.allProducts, `Aguardando`),
        },
        {
            status: 'Já colhido',
            quantity: this.calculateTotalStatusCount(this.allProducts, `Já colhido`),
        }];
        this.chartDataColheita = this.allProducts.filter(p => p.status === 'Já colhido').map(p => ({
            date: p.date,
            quantity: p.amount,
        }));
        this.chartOptions = this.chartDataService.mapDataToChartOptionsRadius(
                    this.chartData,
                    'Status Produção'
                );
        this.chartOptionsColhido = this.chartDataService.mapDataChartOptionsColhido(
            this.chartDataColheita,
            'Colheita por data'
        );
    }
    getMonthNumber(date: string): number {
        return new Date(date).getMonth() + 1; 
    }
    getMonthName(date: string): string {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return meses[new Date(date).getMonth()];
    }

    openCadastroProdutos() {
        this.router.navigate(['/home/cadastro-produtos']);
    }
    calculateProfit(vendas: any[]): number {
        const totalProfit = vendas.reduce((acc, venda) => acc + (venda.profit || 0), 0);
        return totalProfit;
    }
    calculateTotalStatusCount(products: IProductAndVendas[], status: string): number {
        return products.filter(p => p.status === status).reduce((acc, p) => acc + (p.amount || 0), 0);
    }

}
