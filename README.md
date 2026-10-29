# uc8-projeto-mobile

Aplicativo mobile da UC8, por Álamo Henrique.

## Sistema de origem

Recorte do [Kanban Desktop](https://github.com/alamohf/uc5-projeto-desktop), da UC5: uma
aplicação desktop (Electron + PostgreSQL) de quadro Kanban, com colunas e cards.

## Entidades

- **Coluna**: `id`, `titulo`, `posicao`
- **Card**: `id`, `colunaId`, `titulo`, `descricao`, `posicao`, `criadoEm`

## Telas

O app tem cinco telas, numa pilha do React Navigation (`App.tsx`, rotas em `src/navegacao/rotas.ts`).
O visual segue o layout do Stitch (tema escuro azul-marinho com ciano, cores em `src/tema.ts`):

- **Quadro** (inicial): as três colunas fixas (**A fazer**, **Fazendo**, **Feito**) em seções, cada
  uma com a contagem de cards. O cabeçalho mostra **Guardados no aparelho: N** e os botões
  **Buscar** e **Sobre**; o botão flutuante **Novo** abre o cadastro (Buscar e Novo só aparecem com
  a lista pronta).
  - Tocar no cartão abre o **Detalhe**.
  - Mover um card é deslizar o cartão para a esquerda e tocar numa ação, conforme a coluna:
    - **A fazer**: *Mover* (vai para Fazendo) ou *Concluir* (vai para Feito);
    - **Fazendo**: *Voltar* (vai para A fazer) ou *Concluir*;
    - **Feito**: *Reabrir* (volta para A fazer). O cartão aparece riscado.
    O card vai para o fim da coluna de destino.
  - **Contador de dias:** ao concluir, o app grava a data (`concluido_em`); o cartão em **Feito** mostra
    **Levou N dias** (dias corridos desde a criação). *Reabrir* ou *Voltar* apaga a data, e concluir de novo
    recomeça a conta. Cards concluídos antes desse recurso não mostram o tempo.
  - A lista tem três estados: carregando, erro (com **Tentar de novo**) e pronto. Se mover um
    card falhar, o app mostra a mensagem na tela.
- **Novo card**: formulário com título (até 80 caracteres) e descrição, ambos obrigatórios. O card
  novo entra no fim de **A fazer** e a tela volta ao Quadro. Se a nuvem recusar, a mensagem
  aparece no formulário.
- **Detalhe**: título, descrição, coluna e data de criação, com os mesmos botões de mover do
  deslizar (*Mover*, *Concluir*, *Voltar*, *Reabrir*).
  Em um card concluído, mostra também **Concluído em** e **Tempo para concluir**.
- **Buscar**: filtra os cards por título ou descrição, sem diferenciar maiúsculas nem acentos;
  tocar num resultado abre o Detalhe.
- **Sobre**: versão do app, quantos cards estão guardados no aparelho e uma nota sobre os dados.

## Funcionamento offline

O app guarda uma cópia dos cards num banco SQLite no aparelho (`expo-sqlite`,
`src/banco/banco.ts`):

- **Cache:** a cada carga da nuvem, e depois de criar ou mover um card, a lista é regravada
  no banco. Se a nuvem falhar, o app mostra os cards guardados, com um aviso de que vieram
  do aparelho e o motivo. Sem cache e sem rede, aparece a tela de erro.
- **Fila de envio:** um card criado sem rede fica na tabela `pendentes` e aparece no aviso
  **A enviar (N): títulos**. A cada início e a cada **Recarregar**, os pendentes são enviados
  antes de carregar a lista. Se a API recusar um pendente, ele é descartado.
- Mover card sem rede **não** entra na fila: o app mostra o erro e o card continua onde estava.

O teste offline é feito no celular com o Expo Go, onde o `expo-sqlite` já vem incluído. No web
ele funciona com o `metro.config.js` do projeto (módulo wasm), mas o foco é o mobile.

## Erros e dados no aparelho

- **Um só lugar para os erros** (`src/erros/erros.ts`): `classificarErro` transforma o
  `unknown` em tipo (`validacao`, `api`, `banco`, `rede`, `desconhecido`), mensagem para a
  tela e detalhe técnico; `registrarErro` grava o detalhe no console como `[origem] tipo: detalhe`.
  O banco local lança `ErroDoBanco`.
- **O banco falhar não derruba a nuvem:** se o SQLite não abre, a lista da nuvem aparece mesmo
  assim e o cabeçalho mostra **Guardados no aparelho: indisponível**.
- **Entrada validada** no campo e no provedor (`src/validacao.ts`): título e descrição
  obrigatórios, título com até 80 caracteres. Se a nuvem recusar o cadastro, a mensagem
  aparece no formulário.
- **LGPD:** o app não coleta dado pessoal; guarda só títulos e descrições de cards, no
  armazenamento interno do aplicativo. O registro de erro leva o detalhe técnico, nunca o texto digitado.
- **Chave publicável:** identifica o projeto, não a pessoa. O app não tem login e fica no papel
  `anon`; por isso o `supabase/esquema.sql` tira do `anon` o que o app não usa (`revoke`).
  Em um projeto já criado, rode o bloco `revoke` no SQL Editor. Conferência (deve dar `401`
  com o código `42501`):

  ```
  curl -s -X DELETE "https://tgeoijbaxdjaytaofmiu.supabase.co/rest/v1/cards?id=eq.-1" -H "apikey: sb_publishable_y4DYqlPzrhrH6FPrw6OaAQ_0bWkzPKP" -H "Prefer: return=representation"
  ```

## O que fica de fora

Telas separadas por coluna; edição e exclusão de cards; criação, edição e exclusão de colunas (ficam
fixas no recorte mobile); conexão direta com PostgreSQL e os handlers do Electron (o app
mobile não tem backend próprio: lê e grava no Supabase pela API REST); atalhos de teclado,
menu nativo e geração de instalador do desktop.

## Configuração

O app lê os cards de um projeto no [Supabase](https://supabase.com) pela API REST.

1. Crie um projeto no Supabase e, no SQL Editor, execute `supabase/esquema.sql` uma vez
   (cria `colunas` e `cards`, as políticas de acesso anônimo e os dados iniciais).
   Em um projeto criado antes do contador de dias, rode só `alter table public.cards add column
   concluido_em timestamptz;`. Sem a coluna, mover um card dá erro.
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
