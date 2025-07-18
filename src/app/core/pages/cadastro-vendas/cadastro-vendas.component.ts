import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import {MatSelectModule} from '@angular/material/select';
import {  IProductName, IStatus, IVendaCadastro } from '../../domain/vendas/cadastro.interface';
import { NgxMaskDirective } from 'ngx-mask';
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

  formGroupVendas: FormGroup = new FormGroup({
    quantidade: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    produto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    preco: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  produtos: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.authService.getProducts().subscribe((products) => {
      this.produtos = products;
      if (!this.produtos.length) {
        this.formGroupVendas.get('produto')?.disable();
        this._snackBar.open('Nenhum produto encontrado', 'Fechar', { duration: 3000 });
      }
    }, error => {
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
      profit: this.formateToDecimal(data.quantidade) * this.formateToDecimal(data.preco) - this.formateToDecimal(existProducts.value) * this.formateToDecimal(data.quantidade),
      total_sale: this.formateToDecimal(data.quantidade) * this.formateToDecimal(data.preco)
    };
    console.log('Venda a ser cadastrada:', vendaCadastro);
    this.authService.setSales(vendaCadastro).subscribe(() => {
      this._snackBar.open('Venda cadastrada com sucesso!', 'Fechar', { duration: 3000 });
      this.formGroupVendas.reset();
    }, error => {
      this._snackBar.open(`Erro ao cadastrar venda: ${error.message}`, 'Fechar', { duration: 3000 });
    });
  }
  getProductSelect(){
    return this.produtos.find(p => p.id === this.formGroupVendas.value.produto) || '';
  }
  formateToDecimal(value: any): number {
    if (typeof value === 'string') {
      value = parseFloat(value.replace('R$', '').replace('.', '').replace(',', '.'));
    }
    return parseFloat(value.toFixed(2));
  }
}
