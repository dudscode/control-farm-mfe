import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { GenericTableComponent } from '../../../shared/components/generic-table/generic-table.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth/auth.service';
import { finalize } from 'rxjs';

interface MetaTable {
  productName: string;
  localLote: string;
  lucroAtual: number;
  metaLucro: number;
  metaPercentual: string;
  status: string;
}
@Component({
  selector: 'app-metas',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    GenericTableComponent,
    MatProgressSpinnerModule
  ],
  templateUrl: './metas.component.html',
  styleUrl: './metas.component.scss'
})
export class MetasComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService);

  showSpinner = false;
  showError = false;

  metas: MetaTable[] = [];

  ngOnInit() {
    this.getMetas();
  }

  getMetas() {
    this.showSpinner = true;
    this.showError = false;
    this.authService.getMetas().pipe(
      finalize(() => this.showSpinner = false)
    ).subscribe({
      next: (metas) => {
        this.metas = metas.map(meta => ({
          productName: meta.produto.name + ' - ' + meta.produto.harvest,
          localLote: meta.produto.location,
          lucroAtual: meta.current_profit,
          metaLucro: meta.desired_profit,
          metaPercentual: this.calculateMetaPercentual(meta.current_profit, meta.desired_profit)+ '%',
          status: meta.completed ? 'Concluído' : 'Em Progresso'
        }));
      },
      error: (error) => {
        this.showError = true;
        console.error('Erro ao buscar metas:', error);
      }
    });
  }
  
  calculateMetaPercentual(lucro: number, metaLucro: number): number {
    if (metaLucro === 0) {
      return 0;
    }
    return (lucro / metaLucro) * 100;
  }

  openCadastroMetas() {
    this.router.navigate(['/home/cadastro-metas']);
  }
}
