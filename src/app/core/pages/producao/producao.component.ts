import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producao',
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './producao.component.html',
  styleUrl: './producao.component.scss'
})
export class ProducaoComponent {
 private readonly router = inject(Router);

 openCadastroProdutos() {
    this.router.navigate(['/home/cadastro-produtos']);

  }
}
