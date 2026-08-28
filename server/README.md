# Backend — fase futura

Esta pasta está reservada para a API/backend.

Estrutura sugerida:
- config: configuração de banco, ambiente e serviços;
- controllers: entrada das requisições;
- middleware: autenticação, autorização, rate limit e validações;
- models: entidades e acesso a dados;
- routes: rotas da API;
- services: regras de negócio;
- utils: utilitários compartilhados.

Regra importante:
preço, estoque, permissões e criação de pedidos devem ser validados no servidor.
Nunca confiar em valores sensíveis enviados pelo navegador.
