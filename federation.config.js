const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  name: 'control-farm-mfe',

  exposes: {
    './Component': './src/app/app.component.ts',
    './Metas': './src/app/core/pages/metas/metas.component.ts',
    './Producao': './src/app/core/pages/producao/producao.component.ts',
    './Vendas': './src/app/core/pages/vendas/vendas.component.ts',
    './CadastroVendas': './src/app/core/pages/cadastro-vendas/cadastro-vendas.component.ts',
    './CadastroProdutos': './src/app/core/pages/cadastro-produtos/cadastro-produtos.component.ts',
    './CadastroMetas': './src/app/core/pages/cadastro-metas/cadastro-metas.component.ts'
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  '@angular/material': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/material/icon': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/material/table': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/material/paginator': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/material/sort': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/material/form-field': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/material/input': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/material/button': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/material/progress-spinner': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/material/select ': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  '@angular/forms': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
    // Add further packages you don't need at runtime
  ]

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0

});
