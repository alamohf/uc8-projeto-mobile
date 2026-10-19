# uc8-projeto-mobile

Aplicativo mobile da UC8, por Álamo Henrique.

## Sistema de origem

Recorte do [Kanban Desktop](https://github.com/alamohf/uc5-projeto-desktop), da UC5: uma
aplicação desktop (Electron + PostgreSQL) de quadro Kanban, com colunas e cards.

## Entidades

- **Coluna**: `id`, `titulo`, `posicao`
- **Card**: `id`, `colunaId`, `titulo`, `descricao`, `posicao`, `criadoEm`

## Telas

O app tem uma tela única, o **Quadro**, pensada para o celular:

- As três colunas fixas (**A fazer**, **Fazendo**, **Feito**) aparecem em seções, cada uma
  com a contagem de cards.
- No topo da lista fica o **formulário de card** (título e descrição, ambos obrigatórios).
  O card novo entra no fim de **A fazer**.
- Mover um card é deslizar o cartão para a esquerda e tocar numa ação, conforme a coluna:
  - **A fazer**: *Mover* (vai para Fazendo) ou *Concluir* (vai para Feito);
  - **Fazendo**: *Voltar* (vai para A fazer) ou *Concluir*;
  - **Feito**: *Reabrir* (volta para A fazer). O cartão aparece riscado.
  O card vai para o fim da coluna de destino.
- A lista tem três estados: carregando, erro (com **Tentar de novo**) e pronto. Se mover
  ou criar um card falhar, o app mostra a mensagem da API na tela.

## O que fica de fora

Telas separadas de coluna, detalhe do card e busca (previstas no recorte inicial, não
implementadas); edição e exclusão de cards; criação, edição e exclusão de colunas (ficam
fixas no recorte mobile); conexão direta com PostgreSQL e os handlers do Electron (o app
mobile não tem backend próprio: lê e grava no Supabase pela API REST); atalhos de teclado,
menu nativo e geração de instalador do desktop.

## Configuração

O app lê os cards de um projeto no [Supabase](https://supabase.com) pela API REST.

1. Crie um projeto no Supabase e, no SQL Editor, execute `supabase/esquema.sql` uma vez
   (cria `colunas` e `cards`, as políticas de acesso anônimo e os dados iniciais).
2. Copie o arquivo de exemplo e preencha com os valores do seu projeto
   (Project Settings → API): a URL e a chave publicável.

   ```
   cp .env.example .env.local
   ```

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://tgeoijbaxdjaytaofmiu.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=sb_publishable_y4DYqlPzrhrH6FPrw6OaAQ_0bWkzPKP
   ```

   O `.env.local` fica fora do repositório (`.env*.local` no `.gitignore`). A chave
   publicável é pública por desenho, mas ainda assim não é versionada.
3. Instale e rode: `npm install` e `npx expo start`. Depois de mudar o `.env.local`, recarregue
   o app por completo.

Conferência rápida do projeto na nuvem:

```
curl -s "https://tgeoijbaxdjaytaofmiu.supabase.co/rest/v1/cards?select=id,titulo&order=id" -H "apikey: sb_publishable_y4DYqlPzrhrH6FPrw6OaAQ_0bWkzPKP"
```
