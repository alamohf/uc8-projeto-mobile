# uc8-projeto-mobile

Aplicativo mobile da UC8, por Álamo Henrique.

## Sistema de origem

Recorte do [Kanban Desktop](https://github.com/alamohf/uc5-projeto-desktop), da UC5: uma
aplicação desktop (Electron + PostgreSQL) de quadro Kanban, com colunas e cards.

## Entidades

- **Coluna**: `id`, `titulo`, `posicao`
- **Card**: `id`, `colunaId`, `titulo`, `descricao`, `posicao`, `criadoEm`

## Telas

1. **Quadro** — tela inicial, mostra as colunas e os cards de cada uma.
2. **Coluna** — lista os cards de uma coluna, com botão para novo card.
3. **Detalhe do Card** — mostra título, descrição e coluna; permite mover para a coluna
   anterior ou seguinte.
4. **Formulário de Card** — cria ou edita um card (título, descrição, coluna).
5. **Busca** — filtra cards por título e/ou coluna.

## O que fica de fora

Criação, edição e exclusão de colunas (ficam fixas no recorte mobile); conexão direta com
PostgreSQL e os handlers do Electron (o app mobile não terá backend próprio nesta unidade);
atalhos de teclado, menu nativo e geração de instalador do desktop.
