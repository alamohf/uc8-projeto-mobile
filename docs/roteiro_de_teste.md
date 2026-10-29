# Roteiro de teste

Roteiro do app **Kanban** (tela única: o Quadro). Cada caso tem passos que outra pessoa repete,
o esperado em termos do que se vê na tela e as colunas de resultado, preenchidas só depois de
executar no aparelho.

## Como executar

1. Rodar `npx expo start` e abrir o app no celular com o Expo Go (iPhone, lendo o QR code com a câmera).
2. Fazer os passos como estão escritos. Se precisar de algo a mais, corrigir os passos.
3. Igual ao esperado: `aprovado`. Diferente: `falha`, com o observado na coluna **Correção**.
4. **Onde e quando**: aparelho e data (DD/MM/AAAA).
5. Falhou: corrigir, commit próprio, repetir o caso e marcar `corrigido`.
6. Sem rede: Wi-Fi e dados móveis desligados (ou modo avião). Instalação nova: desinstalar o Expo Go e instalar de novo.
7. O registro de erro (`[origem] tipo: detalhe`) aparece no terminal onde o Metro roda.

Resultados possíveis: `aprovado`, `falha`, `corrigido`, `não executado`.

Dados iniciais da nuvem (`supabase/esquema.sql`): **A fazer** com 1 card, **Fazendo** com 1 e
**Feito** com 1.

## Requisitos do recorte

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|------|--------|----------|-----------|---------------|----------|
| C01 | Carga com rede | Com rede, abrir o app | Três seções (A fazer, Fazendo, Feito), cada uma com a contagem; cabeçalho com **Guardados no aparelho: 3** | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C02 | Estado de carregamento | Abrir o app com a rede lenta | Spinner e **Carregando cards...** antes da lista aparecer | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 (atraso de 3 s temporário no código, desfeito) | - |
| C03 | Cadastro válido | Preencher título e descrição; tocar em Adicionar | O card entra no fim de **A fazer**; os campos ficam vazios; a contagem da seção e **Guardados** sobem em 1; a linha aparece na tabela `cards` do Supabase | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C04 | Cadastro com campo vazio | Deixar a descrição vazia; tocar em Adicionar | **Preencha título e descrição.** abaixo dos campos; nenhum card novo | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C05 | Título longo | Colar um texto de 100 caracteres no título | O campo aceita só os 80 primeiros caracteres | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C06 | Mover para Fazendo | Num card de A fazer, deslizar para a esquerda; tocar em **Mover** | O card vai para o fim de **Fazendo**; as contagens das duas seções mudam | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C07 | Concluir | Num card de Fazendo, deslizar; tocar em **Concluir** | O card vai para o fim de **Feito** e aparece riscado | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C08 | Voltar | Num card de Fazendo, deslizar; tocar em **Voltar** | O card vai para o fim de **A fazer** | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C09 | Reabrir | Num card de Feito, deslizar; tocar em **Reabrir** | O card vai para o fim de **A fazer** e deixa de aparecer riscado | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C10 | Coluna vazia | Mover todos os cards de uma coluna para outra | A seção vazia mostra **Nenhum card nesta coluna.** e contagem 0 | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C11 | Mudança fica na nuvem | Mover um card; fechar o app por completo; abrir de novo com rede | O card continua na coluna nova; a coluna bate com a tabela `cards` no Supabase | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |

## Cache e fila de envio

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|------|--------|----------|-----------|---------------|----------|
| C12 | Carga sem rede, com cache | Abrir o app com rede uma vez; fechar; desligar Wi-Fi e dados; abrir | A lista dos cards guardados e o aviso **Sem conexão: mostrando os cards guardados no aparelho** com o motivo | corrigido | iPhone, Expo Go (SDK 58), 28/10/2026; web (Chromium + Playwright, rede simulada), 28/10/2026 | Com a lista vinda do aparelho, o cabeçalho ficava em 'Guardados no aparelho: ...'. Corrigido no commit 0f35250 e confirmado no web (Guardados=6) |
| C13 | Carga sem rede, sem cache | Instalação nova do Expo Go; sem rede; abrir o app | Tela **Não foi possível carregar os cards.** com o motivo e o botão **Tentar de novo** | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 (banco novo e vazio, nuvem com URL falsa); web (Chromium + Playwright, rede simulada), 28/10/2026 | - |
| C14 | Tentar de novo | Na tela de C13, ligar a rede; tocar em **Tentar de novo** | O spinner e depois a lista com os cards da nuvem | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 (spinner ao tocar, com a URL falsa); web (Chromium + Playwright, rede simulada), 28/10/2026 (recuperação completa com a nuvem) | - |
| C15 | Cadastro sem rede | Sem rede, com cache (C12); cadastrar um card | O card não entra na lista; aparece **A enviar (1): título do card**; os campos ficam vazios | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C16 | Sincronização | Com o pendente de C15, ligar a rede; fechar o app por completo; abrir | O aviso **A enviar** some; o card aparece em **A fazer**; a linha existe na tabela `cards` | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C17 | Mover sem rede | Sem rede, com cache; deslizar um card e tocar numa ação | Aviso **Não foi possível mover o card.** com o motivo; o card continua onde estava; tocar no aviso o fecha | corrigido | iPhone, Expo Go (SDK 58), 28/10/2026 | Mostrava 'Algo deu errado': o fetch do Expo no SDK 58 lança FetchError, não TypeError. Corrigido no commit 7277c6c |

## Erros tratados

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|------|--------|----------|-----------|---------------|----------|
| C18 | Cadastro recusado pela nuvem | Abrir o app com rede e cache; trocar `EXPO_PUBLIC_SUPABASE_KEY` em `.env.local` por um valor errado; recarregar o app por completo; cadastrar um card | **O servidor recusou a operação (401).** abaixo do formulário; o card não vai para a fila; o terminal mostra `[cadastro] api: ErroDaApi 401: ...` | aprovado | web (Chromium + Playwright, rede simulada), 28/10/2026; falta repetir no iPhone | - |
| C19 | Mover recusado pela nuvem | Com a chave errada de C18, deslizar um card e tocar numa ação | **Não foi possível mover o card. O servidor recusou a operação (401).**; o card continua onde estava | aprovado | web (Chromium + Playwright, rede simulada), 28/10/2026; falta repetir no iPhone | - |
| C20 | Banco local indisponível | Em `src/banco/banco.ts`, trocar `'kanban.db'` por `'/nao/existe/kanban.db'`; recarregar o app com rede | A lista da nuvem aparece mesmo assim; o cabeçalho mostra **Guardados no aparelho: indisponível**; o terminal mostra `[guardar] banco: ...`. Desfazer a troca depois | aprovado | web (Chromium + Playwright, rede simulada), 28/10/2026 (wasm do SQLite barrado); falta repetir no iPhone | - |
| C21 | Título só com espaços | Digitar espaços no título e uma descrição; tocar em Adicionar | **Preencha título e descrição.**; nenhum card novo | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C22 | Exclusão barrada na nuvem | Depois do `revoke` no SQL Editor, rodar o `curl -X DELETE` da seção "Erros e dados no aparelho" do README | Resposta `401` com o código `42501` | aprovado | PC (curl), 28/10/2026 | DELETE em cards e colunas e PATCH em colunas: 401 com código 42501 |
| C23 | Mover continua permitido após o `revoke` | Depois do `revoke`, repetir C06 | O card muda de coluna e a mudança fica na nuvem (o `update` em `cards` não foi retirado) | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | Servidor confirmado antes (PATCH em cards: 200); card movido no iPhone depois do revoke |

## Telas e navegação

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|------|--------|----------|-----------|---------------|----------|
| C28 | Botões do cabeçalho | Abrir o app com a lista pronta | Quadro sem formulário na lista; cabeçalho com os botões **Buscar** e **Sobre** e o botão flutuante **Novo** no canto inferior direito | aprovado | web (Chromium + Playwright, nuvem simulada), 28/10/2026 e, com o layout novo, 29/10/2026; falta repetir no iPhone | O botão **Novo** saiu do cabeçalho e virou botão flutuante com o layout novo |
| C29 | Tela Sobre | Tocar em **Sobre** | Título Kanban, **Versão** 1.0.0, **Guardados no aparelho** com o número e a nota **Seus dados** | aprovado | web (Chromium + Playwright, nuvem simulada), 28/10/2026; falta repetir no iPhone | - |
| C30 | Voltar de uma tela | Em Sobre, Buscar, Novo ou Detalhe, tocar na seta do cabeçalho (no iPhone, também deslizar da borda esquerda) | Volta à tela anterior, com a lista como estava | aprovado | web (Chromium + Playwright, nuvem simulada), 28/10/2026; falta repetir no iPhone | - |
| C31 | Busca | Tocar em **Buscar**; ver a dica; digitar `readme`; digitar `inclusao`; digitar `zzzxyz` | Dica **Digite para buscar...**; 1 resultado (Escrever README); acha **Teste inclusão** sem o acento; **Nenhum card encontrado.** | aprovado | web (Chromium + Playwright, nuvem simulada), 28/10/2026; falta repetir no iPhone | - |
| C32 | Resultado da busca abre o detalhe | Buscar `readme`; tocar no resultado | Detalhe com título, descrição, coluna e data | aprovado | web (Chromium + Playwright, nuvem simulada), 28/10/2026; falta repetir no iPhone | - |
| C33 | Cartão abre o detalhe | No Quadro, tocar num cartão (sem deslizar) | Detalhe do card aberto | aprovado | web (Chromium + Playwright, nuvem simulada), 28/10/2026; falta repetir no iPhone | - |
| C34 | Mover pelo detalhe | No detalhe de um card de Fazendo, tocar em **Concluir**; voltar | A coluna do detalhe muda para FEITO e o Quadro mostra o card em Feito, riscado | aprovado | iPhone, Expo Go (SDK 58), 29/10/2026 (resultado informado pelo usuário, antes do layout novo) | - |
| C35 | Novo card em tela própria | Tocar em **Novo**; preencher título e descrição; tocar em **Adicionar** | Volta ao Quadro; o card está no fim de **A fazer**; a linha existe na tabela `cards` | aprovado | iPhone, Expo Go (SDK 58), 29/10/2026 (resultado informado pelo usuário, antes do layout novo) | - |
| C36 | Novo card com recusa da nuvem | Em **Novo**: tocar em **Adicionar** vazio; depois preencher e enviar com a nuvem recusando | **Preencha título e descrição.**; com a recusa, a mensagem aparece e a tela continua no formulário | aprovado | web (Chromium + Playwright, nuvem simulada), 28/10/2026; falta repetir no iPhone (recusa simulada) | - |
| C37 | Deslizar continua funcionando | No Quadro, deslizar um cartão para a esquerda e tocar numa ação; depois tocar no cartão | A ação move o card; tocar no cartão abre o detalhe (os dois gestos convivem) | aprovado | iPhone, Expo Go (SDK 58), 29/10/2026 (resultado informado pelo usuário, antes do layout novo) | - |
| C38 | Visual do layout novo | Abrir o app no iPhone e percorrer Quadro, Detalhe, Novo card, Buscar e Sobre | Tema escuro azul-marinho com ciano; selo colorido por coluna (A FAZER roxo, FAZENDO âmbar, FEITO verde); botão flutuante **Novo**; campo com borda ciano no foco; deslizar e tocar no cartão continuam funcionando | não executado | - | - |

## O que só o aparelho mostra

| # | Caso | Passos | Esperado | Resultado | Onde e quando | Correção |
|---|------|--------|----------|-----------|---------------|----------|
| C24 | Girar a tela | Girar o aparelho com o app aberto | O app continua em retrato (`orientation: portrait`) | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C25 | Sair e voltar ao app | Com o Quadro aberto, ir para a tela inicial do iPhone; esperar 10 segundos; voltar ao Expo Go | O Quadro reaparece com os mesmos cards, sem tela de erro | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C26 | Teclado aberto | Tocar no título para abrir o teclado; sem fechá-lo, tocar em **Adicionar** | O toque vale de primeira, sem precisar fechar o teclado antes | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
| C27 | Gesto de deslizar | Deslizar um card para a esquerda e depois para a direita | As ações aparecem à direita do cartão e o cartão volta ao lugar ao soltar | aprovado | iPhone, Expo Go (SDK 58), 28/10/2026 | - |
