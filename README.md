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
