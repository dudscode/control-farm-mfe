
# Control Farm MFE

![Angular](https://img.shields.io/badge/Angular-19.2.0-DD0031) ![Angular Material](https://img.shields.io/badge/Material%20UI-19.2.18-1976D2) ![Firebase](https://img.shields.io/badge/Firebase-11.10.0-FFCA28) ![Node](https://img.shields.io/badge/Node-18.x-417E38)

## Descrição

O **Control Farm MFE** é um microfrontend Angular desenvolvido como projeto de hackathon final da pós-graduação em Engenharia de Frontend da FIAP. Ele faz parte do ecossistema da aplicação principal [control-farm-web](https://github.com/dudscode/control-farm-web/tree/main) e utiliza **Module Federation** para expor componentes e funcionalidades de forma dinâmica.

## Como funciona

Este microfrontend expõe seus módulos e componentes através de um arquivo `remoteEntry.js` gerado pela configuração do plugin `@angular-architects/native-federation`. A aplicação host (`control-farm-web`) consome esses remotes em tempo de execução, permitindo atualizações independentes e deploys desacoplados.

## Requisitos

- **Node.js** (versão 18 ou superior)  
- **Angular CLI** (versão 19 ou superior):  

## Configuração do Environment

Crie um arquivo `src/environments/environment.prod.ts` (e, se necessário, `environment.ts`) com o seguinte conteúdo, substituindo as chaves pelos seus secrets do CI/CD:

```typescript
export const environment = {
  production: true,
  assetsBaseUrl: 'http://localhost:4202'
  firebase: {
    apiKey:  'your-api-key',
    authDomain:  'your-auth-domain',
    projectId:  'your-project-id',
    storageBucket:  'your-storage-bucket',
    messagingSenderId:  'your-messaging-sender-id',
    appId:  'your-app-id'
  },
};
```

## 🚀 Instalação & Execução

1. **Instale as dependências**  

```bash
   npm install
   ```

2. **Rode em modo de desenvolvimento**  

   ```bash
   npm start
   ```

   Acesse em `http://localhost:4202`.

## Scripts Disponíveis

| Comando         | Descrição                                         |
| ----------------| --------------------------------------------------|
| `npm start`     | Inicia o servidor de desenvolvimento (ng serve)   |
| `npm run build` | Gera build de produção                            |
| `npm run watch` | Build em modo watch (configuração de development) |
| `npm test`      | Executa testes unitários (Karma + Jasmine)        |

## Tecnologias & Bibliotecas

- [**Angular**](https://angular.dev/installation) (19.2): Framework javascript
- [**Angular Material**](https://v19.material.angular.dev/) (19.2.18): Biblioteca de componentes
- [**Rxjs**](https://rxjs.dev/): Gerenciamento de estados e reatividade
- [**ApexCharts + ng‑apexcharts**](https://apexcharts.com/): Graficos responsivos  
- [**Firebase**](https://firebase.google.com/) (11.4.0): Autenticação e banco de dados em tempo real.
- **Native‑federation**: Module federation e carregamento de microfrontends
- **Github Action**: CI CD
- **Amazon S3 e Cloudfront** para hospedagem do projeto e cache

## Equipe

Desenvolvido como projeto de conclusão da pós em Engenharia de Frontend – FIAP  
-Eduarda Alves
-Fernanda Kuhn
-Lucas Coutinho
-Lucas Rocha
-Monique Azevedo
