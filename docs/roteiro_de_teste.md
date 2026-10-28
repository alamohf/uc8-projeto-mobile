# Roteiro de teste

Roteiro do app **Kanban** (tela única: o Quadro). Cada caso tem passos que outra pessoa repete,
o esperado em termos do que se vê na tela e as colunas de resultado, preenchidas só depois de
executar no aparelho.

## Como executar

1. Rodar `npx expo start` e abrir o app no celular com o Expo Go (Android).
2. Fazer os passos como estão escritos. Se precisar de algo a mais, corrigir os passos.
3. Igual ao esperado: `aprovado`. Diferente: `falha`, com o observado na coluna **Correção**.
4. **Onde e quando**: aparelho e data (DD/MM/AAAA).
5. Falhou: corrigir, commit próprio, repetir o caso e marcar `corrigido`.
6. Sem rede: Wi-Fi e dados móveis desligados. Instalação nova: desinstalar o Expo Go e instalar de novo.
7. O registro de erro (`[origem] tipo: detalhe`) aparece no terminal onde o Metro roda.

Resultados possíveis: `aprovado`, `falha`, `corrigido`, `não executado`.

Dados iniciais da nuvem (`supabase/esquema.sql`): **A fazer** com 1 card, **Fazendo** com 1 e
**Feito** com 1.

## Requisitos do recorte

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|------|--------|----------|-----------|---------------|----------|
| C01 | Carga com rede | Com rede, abrir o app | Três seções (A fazer, Fazendo, Feito), cada uma com a contagem; cabeçalho com **Guardados no aparelho: 3** | não executado | - | - |
| C02 | Estado de carregamento | Abrir o app com a rede lenta | Spinner e **Carregando cards...** antes da lista aparecer | não executado | - | - |
| C03 | Cadastro válido | Preencher título e descrição; tocar em Adicionar | O card entra no fim de **A fazer**; os campos ficam vazios; a contagem da seção e **Guardados** sobem em 1; a linha aparece na tabela `cards` do Supabase | não executado | - | - |
| C04 | Cadastro com campo vazio | Deixar a descrição vazia; tocar em Adicionar | **Preencha título e descrição.** abaixo dos campos; nenhum card novo | não executado | - | - |
| C05 | Título longo | Colar um texto de 100 caracteres no título | O campo aceita só os 80 primeiros caracteres | não executado | - | - |
| C06 | Mover para Fazendo | Num card de A fazer, deslizar para a esquerda; tocar em **Mover** | O card vai para o fim de **Fazendo**; as contagens das duas seções mudam | não executado | - | - |
| C07 | Concluir | Num card de Fazendo, deslizar; tocar em **Concluir** | O card vai para o fim de **Feito** e aparece riscado | não executado | - | - |
| C08 | Voltar | Num card de Fazendo, deslizar; tocar em **Voltar** | O card vai para o fim de **A fazer** | não executado | - | - |
| C09 | Reabrir | Num card de Feito, deslizar; tocar em **Reabrir** | O card vai para o fim de **A fazer** e deixa de aparecer riscado | não executado | - | - |
| C10 | Coluna vazia | Mover todos os cards de uma coluna para outra | A seção vazia mostra **Nenhum card nesta coluna.** e contagem 0 | não executado | - | - |
| C11 | Mudança fica na nuvem | Mover um card; fechar o app por completo; abrir de novo com rede | O card continua na coluna nova; a coluna bate com a tabela `cards` no Supabase | não executado | - | - |

## Cache e fila de envio

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|------|--------|----------|-----------|---------------|----------|
| C12 | Carga sem rede, com cache | Abrir o app com rede uma vez; fechar; desligar Wi-Fi e dados; abrir | A lista dos cards guardados e o aviso **Sem conexão: mostrando os cards guardados no aparelho** com o motivo | não executado | - | - |
| C13 | Carga sem rede, sem cache | Instalação nova do Expo Go; sem rede; abrir o app | Tela **Não foi possível carregar os cards.** com o motivo e o botão **Tentar de novo** | não executado | - | - |
| C14 | Tentar de novo | Na tela de C13, ligar a rede; tocar em **Tentar de novo** | O spinner e depois a lista com os cards da nuvem | não executado | - | - |
| C15 | Cadastro sem rede | Sem rede, com cache (C12); cadastrar um card | O card não entra na lista; aparece **A enviar (1): título do card**; os campos ficam vazios | não executado | - | - |
| C16 | Sincronização | Com o pendente de C15, ligar a rede; fechar o app por completo; abrir | O aviso **A enviar** some; o card aparece em **A fazer**; a linha existe na tabela `cards` | não executado | - | - |
| C17 | Mover sem rede | Sem rede, com cache; deslizar um card e tocar numa ação | Aviso **Não foi possível mover o card.** com o motivo; o card continua onde estava; tocar no aviso o fecha | não executado | - | - |

## Erros tratados

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|------|--------|----------|-----------|---------------|----------|
| C18 | Cadastro recusado pela nuvem | Abrir o app com rede e cache; trocar `EXPO_PUBLIC_SUPABASE_KEY` em `.env.local` por um valor errado; recarregar o app por completo; cadastrar um card | **O servidor recusou a operação (401).** abaixo do formulário; o card não vai para a fila; o terminal mostra `[cadastro] api: ErroDaApi 401: ...` | não executado | - | - |
| C19 | Mover recusado pela nuvem | Com a chave errada de C18, deslizar um card e tocar numa ação | **Não foi possível mover o card. O servidor recusou a operação (401).**; o card continua onde estava | não executado | - | - |
| C20 | Banco local indisponível | Em `src/banco/banco.ts`, trocar `'kanban.db'` por `'/nao/existe/kanban.db'`; recarregar o app com rede | A lista da nuvem aparece mesmo assim; o cabeçalho mostra **Guardados no aparelho: indisponível**; o terminal mostra `[guardar] banco: ...`. Desfazer a troca depois | não executado | - | - |
| C21 | Título só com espaços | Digitar espaços no título e uma descrição; tocar em Adicionar | **Preencha título e descrição.**; nenhum card novo | não executado | - | - |
| C22 | Exclusão barrada na nuvem | Depois do `revoke` no SQL Editor, rodar o `curl -X DELETE` da seção "Erros e dados no aparelho" do README | Resposta `401` com o código `42501` | não executado | - | - |
| C23 | Mover continua permitido após o `revoke` | Depois do `revoke`, repetir C06 | O card muda de coluna e a mudança fica na nuvem (o `update` em `cards` não foi retirado) | não executado | - | - |

## O que só o aparelho mostra

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|------|--------|----------|-----------|---------------|----------|
| C24 | Girar a tela | Girar o aparelho com o app aberto | O app continua em retrato (`orientation: portrait`) | não executado | - | - |
| C25 | Botão voltar do Android | Na tela do Quadro, tocar no botão físico ou gesto de voltar | O app sai para a tela inicial do celular, sem erro | não executado | - | - |
| C26 | Teclado aberto | Tocar no título para abrir o teclado; sem fechá-lo, tocar em **Adicionar** | O toque vale de primeira, sem precisar fechar o teclado antes | não executado | - | - |
| C27 | Gesto de deslizar | Deslizar um card para a esquerda e depois para a direita | As ações aparecem à direita do cartão e o cartão volta ao lugar ao soltar | não executado | - | - |
