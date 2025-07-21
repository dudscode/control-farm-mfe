import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import {MatSelectModule} from '@angular/material/select';
import {  INotification, IProductName, IStatus, IVendaCadastro } from '../../domain/vendas/cadastro.interface';
import { NgxMaskDirective } from 'ngx-mask';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cadastro-vendas',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  NgxMaskDirective],
  templateUrl: './cadastro-vendas.component.html',
  styleUrl: './cadastro-vendas.component.scss'
})
export class CadastroVendasComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private router = inject(Router);

  formGroupVendas: FormGroup = new FormGroup({
    quantidade: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    produto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    preco: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  produtos: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.authService.getProducts().subscribe((products) => {
      this.produtos = products.filter(p => p.saled === false);
      if (!this.produtos.length) {
        this.formGroupVendas.get('produto')?.disable();
        this.formGroupVendas.get('quantidade')?.disable();
        this._snackBar.open('Nenhum produto encontrado', 'Fechar', { duration: 3000 });
      }
    }, _ => {
      this._snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
    });
  }

  disableButton(): boolean {
    return this.formGroupVendas.invalid || this.produtos.length === 0;
  }
  cadastrarVenda(): void {
    const existProducts = this.getProductSelect();
    if (this.formGroupVendas.value.produto && !existProducts) {
      this._snackBar.open('Produto não encontrado, cadastre um novo produto.', 'Fechar', { duration: 3000 })
      return
    }
    const data = this.formGroupVendas.value;
    const vendaCadastro: IVendaCadastro = {
      amount: data.quantidade,
      date: new Date().toISOString(),
      price: this.formateToDecimal(data.preco),
      id_product: existProducts.id,
      profit: this.formateToDecimal(data.quantidade) * this.formateToDecimal(data.preco) - this.formateToDecimal(existProducts.value) * this.formateToDecimal(data.quantidade),
      total_sale: this.formateToDecimal(data.quantidade) * this.formateToDecimal(data.preco)
    };
    this.authService.setSales(vendaCadastro).subscribe(() => {
      this._snackBar.open('Venda cadastrada com sucesso!', 'Fechar', { duration: 3000 });
      this.validaMeta();
      this.updateProduct();
    }, error => {
      this._snackBar.open(`Erro ao cadastrar venda: ${error.message}`, 'Fechar', { duration: 3000 });
    });
  }
  updateProduct(): void {
    const existProducts = this.getProductSelect();
    existProducts.amount_available -= this.formGroupVendas.value.quantidade;
    existProducts.saled = existProducts.amount_available ==existProducts.amount;
    this.authService.updateProduct(existProducts).subscribe(() => {
      this._snackBar.open('Produto atualizado com sucesso!', 'Fechar', { duration: 3000 });
    }, error => {
      this._snackBar.open(`Erro ao atualizar produto: ${error.message}`, 'Fechar', { duration: 3000 });
    });
  }
  validaMeta() {
    const id_product = this.getProductSelect().id;
    this.authService.getMetasByUser(id_product).subscribe((metas: any) => {
      if (!metas || metas.length === 0) {
        this.formGroupVendas.reset();
        return;
      }
      const meta = metas[0];

      this.atualizarMeta(meta);
    }, (error: any) => {
      this._snackBar.open(`Erro ao validar meta: ${error.message}`, 'Fechar', { duration: 3000 });
    });
  }
  atualizarMeta(meta: any): void {
    const id_product = this.getProductSelect().id_product;
    let totalProfit = 0;
    this.authService.getVendasByUser(id_product).subscribe((vendas: any) => {
      if (!vendas || vendas.length === 0) {
        this.formGroupVendas.reset();
        this.router.navigate(['/home/vendas']);
        return;
      }
      vendas.forEach((venda: IVendaCadastro) => {
        totalProfit += venda.profit;
      });
      meta.current_profit = totalProfit;
      meta.completed = totalProfit >= meta.desired_profit;
      this.authService.updateMeta(meta).
      pipe(
        finalize(() => {
          this.formGroupVendas.reset();
        })
      ).subscribe((_) => {
        if (meta.completed) {
          this.cadastrarNotificacao();
          this._snackBar.open('Meta atingida!', 'Fechar', { duration: 3000 });
          this.router.navigate(['/home/metas']);
        }
      }, error => {
        console.error('Erro ao atualizar meta:', error);
      });
    });
  }
  cadastrarNotificacao(){
    const name_product = this.getProductSelect().name;
    const notification: INotification = {
      message: ` Você atingiu a meta para o produto ${name_product}`,
      read: false,
      title: 'Meta atingida'
    };
    this.authService.setNotification(notification).subscribe();
  }

  getProductSelect(){
    return this.produtos.find(p => p.id === this.formGroupVendas.value.produto) || '';
  }
  getQuantityProductSelect() {
    const product = this.getProductSelect();
    return product ? product.amount_available : 0;
  }

  formateToDecimal(value: any): number {
    if (typeof value === 'string') {
      value = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.'));
    }
    return parseFloat(value.toFixed(2));
  }
}
