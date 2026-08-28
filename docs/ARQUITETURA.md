# Arquitetura Croma Drip

## Fase atual
A loja continua funcionando como front-end estático:
- index.html
- produto.html
- assets/
- css/
- js/

Isso evita quebrar os caminhos que já funcionam.

## Próxima fase
Quando entrar banco de dados e autenticação:
- server/ será a API oficial;
- admin/ será o painel administrativo;
- js/products.js deixa de ser a fonte oficial de preço/estoque;
- o front passa a buscar produtos pela API.

## Segurança
- nunca salvar senha em texto puro;
- nunca colocar segredo em JavaScript público;
- usar variáveis de ambiente;
- validar preço e estoque no backend;
- proteger admin com autenticação e autorização;
- preferir 2FA para administradores;
- aplicar rate limiting em login e endpoints sensíveis;
- registrar alterações administrativas.
