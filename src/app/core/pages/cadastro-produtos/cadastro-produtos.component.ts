import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth/auth.service';
import {MatSelectModule} from '@angular/material/select';
import { IProduct, IProductName, IStatus, IVendaCadastro } from '../../domain/vendas/cadastro.interface';
import { NgxMaskDirective } from 'ngx-mask';
import { Router } from '@angular/router';
@Component({
  selector: 'app-cadastro-produtos',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  NgxMaskDirective],
  templateUrl: './cadastro-produtos.component.html',
  styleUrl: './cadastro-produtos.component.scss'
})
export class CadastroProdutosComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private authService = inject(AuthService);
  private router = inject(Router);
  

  formGroupProduto: FormGroup = new FormGroup({
    quantidade: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    safra: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    localizacao: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    preco: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    status: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  produtos: IProductName[] = [];
  statusOptions: IStatus[] = ['Aguardando', 'Em produção', 'Já colhido'];
  constructor() { }

  ngOnInit(): void {
    this.authService.getProductNames().subscribe((products) => {
      this.produtos = products;
      if (!this.produtos.length) {
        this.formGroupProduto.get('produto')?.disable();
        this._snackBar.open('Nenhum produto encontrado', 'Fechar', { duration: 3000 });
      }
    }, error => {
      this._snackBar.open('Erro ao carregar produtos', 'Fechar', { duration: 3000 });
    });
  }

  disableButton(): boolean {
    return this.formGroupProduto.invalid || this.produtos.length === 0;
  }
 
  setProduct() {
    const newProduct = this.formGroupProduto.value;
    const product: IProduct = {
      amount: newProduct.quantidade,
      amount_available: newProduct.quantidade,
      saled: false,
      date: new Date().toISOString(),
      harvest: newProduct.safra,
      location: newProduct.localizacao,
      name: newProduct.nome,
      value: newProduct.preco,
      status: newProduct.status
    };

    this.authService.setProduct(product).subscribe(() => {
      this._snackBar.open('Produto cadastrado com sucesso!', 'Fechar', { duration: 3000 });
      this.formGroupProduto.reset();
      this.router.navigate(['/home/producao']);
    }, error => {
      this._snackBar.open(`Erro ao cadastrar produto: ${error.message}`, 'Fechar', { duration: 3000 });
    });
  }
}
