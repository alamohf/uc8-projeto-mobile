# Roteiro da apresentação (5 minutos, Expo Go no iPhone)

Kanban mobile, UC8, por Álamo Henrique. Recorte do Kanban Desktop da UC5 (Electron + PostgreSQL).

## Antes de começar (10 minutos antes)

- [ ] PC e iPhone no **mesmo Wi-Fi**; o PC não pode dormir.
- [ ] Servidor no ar: `REACT_NATIVE_PACKAGER_HOSTNAME=<ip do PC> npx expo start --lan --port 8083`
      (ver o IP com `ipconfig`; hoje é `192.168.0.27`).
- [ ] Expo Go aberto em `exp://<ip do PC>:8083`, Quadro carregado com os cards.
- [ ] Se for mostrar o offline: segundo servidor pronto com a nuvem inválida
      (`EXPO_PUBLIC_SUPABASE_URL=https://nuvem-invalida.example.com`, porta 8086) e o Quadro já aberto uma vez
      no servidor normal, para o cache existir. Mostre o offline por último.
- [ ] Abas abertas no PC: o repositório no GitHub, o Supabase (tabela `cards`) e a página do build no expo.dev.
- [ ] Um card em **Fazendo** pronto para concluir na demonstração (não dá para apagar card depois).
- [ ] Notificações do iPhone desligadas e brilho alto.

## Roteiro

| Tempo | O que mostrar | O que dizer |
|---|---|---|
| 0:00 | Quadro | "É um Kanban com três colunas fixas: A fazer, Fazendo e Feito. É um recorte do sistema desktop da UC5." Apontar a contagem por coluna e **Guardados no aparelho**. |
| 0:30 | Tocar num cartão (Detalhe) | "Tocar no cartão abre o detalhe: título, descrição, coluna e data de criação." |
| 1:00 | **Novo** (botão flutuante) | "Cadastro em tela própria, com validação: título e descrição obrigatórios, título até 80 caracteres." Enviar vazio para mostrar o aviso; depois cadastrar. O card entra no fim de A fazer. |
| 1:45 | **Buscar** | "Busca por título ou descrição, sem diferenciar acento." Digitar `inclusao` e achar "inclusão". Tocar num resultado. |
| 2:15 | Mover e concluir | "Deslizar o cartão para a esquerda mostra as ações; também dá para mover pelo detalhe." Concluir um card de Fazendo: aparece **Levou N dias** (contador automático, extra em relação ao projeto original). |
| 3:00 | **Sobre** | "Versão, contagem do aparelho e a nota sobre dados: o app não coleta dado pessoal." |
| 3:20 | Supabase no PC | "Os dados ficam na nuvem (Supabase, API REST). Aqui está a linha que acabei de criar." Mostrar também que o `anon` não apaga (DELETE responde 401, README). |
| 3:50 | Offline (servidor da 8086) | "Sem acesso à nuvem, o app mostra os cards guardados no SQLite do aparelho, com aviso do motivo. Um card cadastrado sem rede entra numa fila e é enviado quando a conexão volta." |
| 4:30 | Repositório e APK | "Código no GitHub, com roteiro de teste de 41 casos. O APK de Android sai pelo EAS Build (perfil `preview`); aqui está o build." Mostrar a página do build. |
| 5:00 | Fim | Agradecer e abrir para perguntas. |

## Se alguma coisa falhar

- **Expo Go não abre o projeto:** confira o Wi-Fi e se o servidor está de pé; escaneie o QR code do terminal do PC.
- **Tela de erro "Não foi possível carregar os cards":** é o tratamento de erro funcionando; toque em **Tentar de novo**
  ou use isso como demonstração.
- **Sem internet no local:** o app abre pelo servidor do PC (rede local), mas sem a nuvem ele cai no cache do
  aparelho; mostre isso como a demonstração de offline.
- **Servidor caiu (pouca memória):** reinicie com o comando acima; feche outros programas antes.

## Perguntas prováveis

- **Por que Supabase e não conectar direto no PostgreSQL?** O celular não deve ter a senha do banco; a API REST com
  chave publicável e as políticas do banco (RLS) controlam o acesso.
- **Como o app protege os dados?** RLS e `revoke`: o papel `anon` só lê, inclui e atualiza cards, e só lê colunas.
- **O que acontece sem rede?** Cache em SQLite e fila de envio para cards novos; mover card sem rede mostra o erro.
- **O que ficou de fora?** Edição e exclusão de cards, gestão de colunas, e tudo que era específico do desktop
  (README, "O que fica de fora").
- **Como foi testado?** Roteiro de 41 casos (`docs/roteiro_de_teste.md`), no iPhone e no navegador.
