import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import { MatSelectModule } from '@angular/material/select';
import { IMetas, IVendaCadastro } from '../../domain/vendas/cadastro.interface';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-cadastro-metas',
  imports: [
    FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    NgxMaskDirective
  ],
  templateUrl: './cadastro-metas.component.html',
  styleUrl: './cadastro-metas.component.scss'
})
export class CadastroMetasComponent {
  private _snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);

  formGroupMetas: FormGroup = new FormGroup({
    produto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lucroDesejado: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  produtos: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.authService.getProducts().subscribe((products) => {
      this.produtos = products;
      if (!this.produtos.length) {
        this.formGroupMetas.get('produto')?.disable();
        this._snackBar.open('Nenhum produto encontrado', 'Fechar', { duration: 3000 });
      }
    }, error => {
      this._snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
    });
  }

  cadastrarMeta(): void {
    const id_product = this.getProductSelect().id;
    let totalProfit = 0;
    this.authService.getVendasByUser(id_product).subscribe((vendas: any) => {
      if (!vendas || vendas.length === 0) {
        const metas: IMetas = {
          completed: false,
          current_profit: 0,
          date: new Date().toISOString(),
          desired_profit: this.formGroupMetas.value.lucroDesejado,
          id_product: this.formGroupMetas.value.produto
        };
        this.setMetas(metas);
        return;
      }
      vendas.forEach((venda: IVendaCadastro) => {
        totalProfit += venda.profit;
      });
      const metas: IMetas = {
        completed: totalProfit >= this.formGroupMetas.value.lucroDesejado,
        current_profit: totalProfit,
        date: new Date().toISOString(),
        desired_profit: this.formGroupMetas.value.lucroDesejado,
        id_product: this.formGroupMetas.value.produto
      };
      this.setMetas(metas);
    });

    
  }
  setMetas(metas: IMetas): void {
    this.authService.setMetas(metas).subscribe(() => {
      this._snackBar.open('Meta cadastrada com sucesso!', 'Fechar', { duration: 3000 });
      this.formGroupMetas.reset();
    }, error => {
      this._snackBar.open(`Erro ao cadastrar meta: ${error.message}`, 'Fechar', { duration: 3000 });
    });

  }
  disableButton(): boolean {
    return this.formGroupMetas.invalid || this.produtos.length === 0;
  }
  getProductSelect() {
    return this.produtos.find(p => p.id === this.formGroupMetas.value.produto) || '';
  }
  
}
