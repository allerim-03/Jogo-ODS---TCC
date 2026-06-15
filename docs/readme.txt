1. baixei a extensão live server para possibilitar ver as páginas mais bonitin
ela cria um servidor local, e reload automático




#  Jogo da Memória –  (11/06/2026)

##  Funcionalidades implementadas
- **Botão Voltar** no canto superior esquerdo, que retorna para a página anterior. ( sqn não está funcionandooooooo)
- **HUD fixo no topo direito** com:
  -  Contador de movimentos
  - ⌛Cronômetro (inicia na primeira jogada e para na vitória)
  - ⭐ Pontuação (+10 pontos por par correto) q será tranformando em + 50xp 
- **Painel de Melhor Resultado** fixo no canto superior esquerdo:( que novidade, tbm está bugado)
  - 🏆 Guarda recorde de pontuação e tempo usando `localStorage`
  - Atualiza automaticamente quando o jogador bate um novo recorde
- **Mensagem especial do Tuga** quando o jogador conquista um novo recorde.
- **Título “Jogo da Memória” em verde** para dar destaque.
- **Pontuação com estrela em amarelo** e fundo claro para melhor visibilidade.
- **Layout ajustado** para que o painel de ranking não sobreponha as cartas.

---

##  Tecnologias usadas
- **HTML** para estrutura do jogo
- **CSS** para estilização (cores, posicionamento fixo, animações)
- **JavaScript** para lógica:
  - Controle de movimentos
  - Cronômetro
  - Sistema de pontuação
  - Ranking com `localStorage`
  - Eventos de reinício e botão voltar

---

##  Fluxo do jogo
1. Jogador inicia virando uma carta → cronômetro começa.
2. Cada tentativa (acerto ou erro) incrementa o contador de movimentos.
3. Acertos dão +10 pontos.
4. Ao completar todos os pares:
   - Cronômetro para.
   - Mostra mensagem de vitória.
   - Se for recorde, salva no navegador e mostra mensagem especial do Tuga.
5. Botão **Jogar novamente** reinicia cronômetro, movimentos, pontuação e embaralha cartas.
6. Botão **Voltar** retorna para a página anterior.

---

## 📌 Próximos passos sugeridos
- Criar **sons de vitória/erro** para deixar o jogo mais interativo.
- Expandir ranking para mostrar **top 3 resultados** em vez de apenas o melhor.

---

Data (12/06/2026)

Melhorias implementadas :
Correção dos botões
Corrigido o botão Jogar Novamente.
Corrigido o botão Voltar.

Ajustado o carregamento do JavaScript para evitar erros de elementos inexistentes no DOM.
Sistema de Vitória
Implementada a verificação automática de vitória.
Exibição de mensagem de parabéns ao concluir todas as combinações.
Inclusão de botão para reiniciar a partida após a vitória.

Sistema de Pontuação
Adicionada pontuação por pares encontrados.
Exibição da pontuação atual durante a partida.

Cronômetro
Implementado cronômetro iniciado na primeira jogada.
Parada automática do cronômetro ao vencer.

Ranking
Implementado armazenamento de melhor resultado utilizando Local Storage.
Registro da melhor pontuação e do melhor tempo.
Exibição do ranking na interface do jogo.

Melhorias de Interface
Criação de barra superior responsiva.
Reorganização dos elementos:
Botão Voltar
Ranking
HUD (movimentos, tempo e pontuação)
Ajustes para melhorar a experiência em dispositivos móveis.

Testes
Criados métodos rápidos para testar a tela de vitória sem precisar completar todas as cartas.
Utilização do Console do navegador para acelerar os testes durante o desenvolvimento.

Problemas encontrados
Erro "Cannot read properties of null (reading 'addEventListener')" causado por elementos ainda não carregados no DOM.
Sobreposição do painel de ranking sobre o tabuleiro devido ao uso de position: fixed.
Ajustes pendentes no alinhamento visual das cartas após a reorganização do layout.

Próximos passos
Finalizar ajustes visuais da barra superior.
Corrigir deformação/alinhamento das cartas durante a animação de virada.
Melhorar a responsividade em telas menores.
Exibir mensagem especial quando um novo recorde for alcançado.
Adicionar efeitos sonoros e animações para aumentar o engajamento.


## Atualização II - 12/06/2026

### Tela de vitória (melhorias visuais)
- Reformulada a tela de vitória com novo estilo mais limpo e profissional.
- Substituído fundo verde sólido por:
  - Cartão branco com borda verde (identidade ODS)
  - Sombra mais forte para destacar o popup
- Adicionado fundo escurecido (overlay) para focar na mensagem de vitória.

###  Experiência do usuário
- Melhor contraste entre a tela de vitória e o jogo.
- Destaque visual maior para a mensagem "Missão Cumprida".
- Botão "Jogar novamente" estilizado com feedback visual ao passar o mouse.

###  Correções e ajustes
- Corrigido comportamento do botão de reinício para evitar reabertura indevida da tela de vitória.
- Ajustado fluxo de exibição/ocultação do overlay.
- Melhorado controle de estado do jogo após reinício.

### 🎯 Melhorias gerais de UI
- Aumentado o foco visual no modal de vitória.
- Melhor hierarquia visual entre fundo, modal e conteúdo.


Atualização do Projeto (13/06/2026)

O projeto foi reorganizado para suportar melhor escalabilidade e futura integração com Flask.

📁 Nova estrutura de pastas
Separação do módulo Memory Game como componente independente
Organização de arquivos estáticos e templates
Melhor separação entre lógica, UI e armazenamento
🔧 Alterações realizadas
🧠 1. Refatoração do memoryGame.js
Código reorganizado em blocos funcionais:
Storage
GameState
Tabuleiro
UI
Mecânicas do jogo
Sistema de vitória
Reinício do jogo
Removida lógica duplicada e dispersa
Centralização de funções no objeto MemoryGame
🎮 2. Implementação e ajuste do GameState
Criação/ajuste do objeto GameState para controle global do jogo:
Carta atual selecionada
Bloqueio de jogadas
Movimentos
Pontuação
Tempo de jogo
Redução de variáveis globais soltas (melhor controle de estado)
🧱 3. Reorganização da arquitetura do código
Separação lógica em módulos conceituais:
Storage → localStorage e ranking
GameState → estado central do jogo
UI → atualização da interface
Tabuleiro → embaralhamento e montagem das cartas
Core → mecânicas do jogo
Melhor preparação para integração com backend (Flask)
🔁 4. Sistema de reinício revisado
Reinício do jogo agora:
Reseta GameState corretamente
Remove classes das cartas
Reembaralha tabuleiro via função centralizada
Atualiza HUD e ranking
Evita duplicação de lógica entre botão e objeto principal
📦 5. Limpeza geral
Remoção de código duplicado
Correção de variáveis globais antigas
Padronização de funções (menos dependência de DOM espalhado)
⚠️ Problemas corrigidos
Bugs causados por múltiplos embaralhamentos simultâneos
Inconsistência entre estado do jogo e DOM
Reinício duplicado ou incompleto
Mistura de lógica global com objeto MemoryGame
🚀 Próximos passos
Implementar sistema de XP para gamificação
Melhorar feedback visual (animações e transições)
Preparar integração com Flask (API de ranking)
Criar sistema de níveis/dificuldade
Adicionar sons de interação (acerto/erro/vitória)
📌 Observação

A arquitetura atual aproxima o projeto de um modelo modular, facilitando manutenção e futura expansão para backend com Flask.

II.

O projeto foi reorganizado para suportar melhor escalabilidade e futura integração com Flask, com separação clara entre páginas, lógica do jogo e assets.

🌐 6. Criação das páginas index.html e menu.html
🏠 index.html (Tela inicial)
Criada como porta de entrada da plataforma
Tela simples de boas-vindas
Apresenta o projeto ao usuário
Contém botão “Começar” que redireciona para o jogo
📋 menu.html (Menu da plataforma)
Criado como hub inicial da aplicação
Estrutura pensada para futura expansão da plataforma educacional
Contém:
Título da plataforma
Mascote (Tuga)
Botão de início do jogo
Responsável por centralizar navegação entre módulos (futuro: outros jogos)
🧠 7. Refatoração do memoryGame.js
Código reorganizado em blocos funcionais:
Storage
GameState
Tabuleiro
UI
Mecânicas do jogo
Sistema de vitória
Reinício do jogo
Removida lógica duplicada e dispersa
Centralização do estado do jogo
🎮 8. Implementação e ajuste do GameState
Criação/ajuste do objeto GameState:
Controle de cartas selecionadas
Bloqueio de jogadas
Movimentos
Pontuação
Tempo
Redução de variáveis globais soltas
Melhor controle do fluxo do jogo
🧱 9. Reorganização da arquitetura do código
Separação lógica em módulos conceituais:
Storage → ranking e localStorage
GameState → estado do jogo
UI → interface
Tabuleiro → embaralhamento e montagem
Core → regras do jogo
Preparação para integração com Flask (backend)
🔁 10. Sistema de reinício revisado
Reset completo do estado do jogo
Reembaralhamento centralizado do tabuleiro
Atualização de HUD e ranking
Remoção de duplicações de lógica
📦 11. Limpeza geral
Remoção de código duplicado
Correção de variáveis globais antigas
Padronização da arquitetura
Melhor organização para manutenção futura
⚠️ Problemas corrigidos
Duplicação de embaralhamento de cartas
Estado inconsistente entre DOM e GameState
Reinício incompleto do jogo
Mistura de lógica global com módulos
🏗️ Diagrama da Arquitetura do Projeto
📌 Visão geral
PlataformaEduca
│
├── index.html
│   └── Tela inicial (entrada da plataforma)
│
├── menu.html
│   └── Menu principal (hub da aplicação)
│
├── memoryGame.html
│   └── Módulo do Jogo da Memória
│
├── static/
│   ├── css/
│   │   ├── reset.css
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── gameMenu.js
│   │   └── memory/
│   │       └── memoryGame.js
│   │
│   └── imagens/
│
└── memoryGame.js (estrutura interna)
    │
    ├── Storage (localStorage)
    ├── GameState (estado do jogo)
    ├── Tabuleiro (cartas + embaralhamento)
    ├── UI (HUD + ranking + timer)
    ├── Core (regras do jogo)
    ├── Vitória
    └── Reinício
🧠 Fluxo do jogo
Usuário inicia
   ↓
index.html
   ↓
menu.html
   ↓
memoryGame.html
   ↓
MemoryGame.iniciar()
   ↓
Tabuleiro é montado
   ↓
Jogador interage com cartas
   ↓
GameState atualiza estado
   ↓
UI reflete mudanças
   ↓
Vitória → ranking → restart
🚀 Próximos passos
Sistema de XP e níveis
Integração com Flask (API de ranking)
Persistência de progresso por usuário
Sons e feedback visual
Novos minijogos dentro da plataforma
📌 Observação final

A estrutura atual já segue um modelo modular de plataforma educacional, permitindo expansão para múltiplos jogos e integração com backend sem grandes refatorações.

### Resumo das atividades de hoje (13/06/2026)

#### 📁 Reorganização da estrutura do projeto

O módulo do Jogo da Memória foi reorganizado para seguir uma arquitetura mais próxima da utilizada em aplicações Flask.

Estrutura atual:

```text
MEMORYGAME/
│
├── templates/
│   ├── index.html
│   ├── menu.html
│   └── memoryGame.html
│
├── static/
│   ├── css/
│   │   ├── reset.css
│   │   ├── base.css
│   │   ├── ui.css
│   │   └── memory-game.css
│   │
│   ├── js/
│   │   ├── gameMenu.js
│   │   └── memory/
│   │       └── memoryGame.js
│   │
│   └── imagens/
│
└── README.md
```

---

#### 🧠 Refatoração do JavaScript (`memoryGame.js`)

Foi iniciada a organização do código em blocos lógicos:

##### Storage

Responsável por:

* Salvar recordes no `localStorage`
* Recuperar melhor pontuação
* Recuperar melhor tempo

Funções:

```js
getBestScore()
getBestTime()
saveRecord()
loadRanking()
```

---

##### Estado do Jogo (GameState)

Centralização das variáveis globais:

```js
const GameState = {
  primeiraCarta,
  segundaCarta,
  bloqueado,
  moves,
  score,
  seconds,
  timerInterval
}
```

Objetivo:

* reduzir variáveis espalhadas pelo arquivo
* facilitar manutenção futura

---

##### Tabuleiro (Board)

Criação da função:

```js
configurarTabuleiro()
```

Responsável por:

* duplicar cartas
* embaralhar cartas
* montar o tabuleiro

Também foi criado o objeto:

```js
const MemoryGame = {}
```

como controlador principal do módulo.

---

##### Interface (UI)

Separação das funções relacionadas à tela:

```js
atualizarHUD()
atualizarTimer()
mostrarVitoria()
esconderVitoria()
```

Responsabilidades:

* atualizar HUD
* atualizar cronômetro
* exibir popup de vitória
* esconder popup

---

##### Mecânica das Cartas

Organização da lógica de jogo:

```js
virarCarta()
verificarPar()
desabilitarCartas()
desvirarCartas()
reiniciarJogada()
```

Responsável por:

* clique nas cartas
* comparação dos pares
* bloqueio temporário
* atualização da pontuação

---

##### Sistema de Vitória

Centralização da verificação:

```js
verificarVitoria()
```

Responsável por:

* parar cronômetro
* atualizar ranking
* verificar recorde
* exibir tela de vitória

---

##### Navegação e Ferramentas de Desenvolvimento

Implementados:

```js
back-btn
```

para retorno ao menu.

E:

```js
tecla V
```

para forçar uma vitória durante os testes.

---

#### 🎨 Reorganização dos CSS

O CSS foi dividido por responsabilidade.

##### base.css

Contém:

* variáveis de cores
* tipografia
* botões
* cards
* componentes genéricos

---

##### ui.css

Contém:

* HUD
* ranking
* botão voltar
* barra superior

---

##### memory-game.css

Contém:

* tabuleiro
* cartas
* animações de flip
* modal de vitória
* overlay
* responsividade

---

#### 📄 Ajustes nos HTML

##### index.html

Foi adaptado para:

* seguir a estrutura Flask
* utilizar caminhos em `/static`
* utilizar JavaScript separado
* redirecionar para o menu

---

##### menu.html

Foi reorganizado para:

* utilizar CSS modular
* utilizar imagem do mascote via `/static/imagens`
* carregar `gameMenu.js`

---

##### memoryGame.html

Foi preparado para:

* utilizar CSS modular
* utilizar `memoryGame.js`
* remover dependências do antigo `script.js`
* seguir padrão Flask-ready

---

#### 🐛 Correções realizadas

Identificados problemas de caminho de arquivos:

Erro:

```text
Refused to apply style...
MIME type text/html
```

Causa:

* caminhos incorretos para CSS

Também foram corrigidos:

* caminhos das imagens
* caminhos dos scripts
* referências relativas entre templates e static

---

#### 📚 Documentação

O README foi atualizado para incluir:

* reorganização das pastas
* criação da tela inicial (`index.html`)
* criação da tela de menu (`menu.html`)
* início da modularização do JavaScript
* diagrama da arquitetura do módulo

---
### Próximo passo

Preparar a migração para Flask:

1. Criar `app.py`
2. Configurar rotas
3. Servir `templates`
4. Servir arquivos `static`
5. Testar o módulo do jogo funcionando dentro da aplicação Flask


# Registro de Desenvolvimento — 14/06/2026

## Objetivo do dia

Finalizar a reorganização estrutural do módulo do Jogo da Memória e corrigir erros surgidos durante a refatoração para uma arquitetura compatível com Flask.

---

## Correções realizadas

### 1. Estrutura de Arquivos

Foi mantida a separação entre:

* templates/
* static/css/
* static/js/
* static/imagens/

seguindo o padrão adotado para futura integração com Flask.

---

### 2. Correção de Carregamento de CSS

Foi identificado o erro:

Refused to apply style because its MIME type ('text/html') is not a supported stylesheet MIME type

### Causa

O HTML referenciava:

memory-game.css

enquanto o arquivo existente possuía outro nome.

### Solução

Padronização do nome do arquivo:

memory-game.css

e atualização das referências no HTML.

Resultado:

* CSS voltou a carregar corretamente.
* Layout foi restaurado.
* Responsividade voltou a funcionar.

---

### 3. Correção do Sistema de Duplicação de Cartas

Foi identificado que a função:

configurarTabuleiro()

duplicava todas as cartas a cada reinício do jogo.

### Problema

Quantidade de cartas após reinícios:

18 → 36 → 72 → 144 → 288...

Isso gerava:

* aumento excessivo do DOM;
* perda de desempenho;
* travamentos.

### Solução

Implementação da variável:

tabuleiroCriado

permitindo que a duplicação ocorra apenas uma vez durante a inicialização do jogo.

Resultado:

* tabuleiro permanece com 36 cartas;
* reinícios apenas embaralham as cartas;
* eliminação do crescimento infinito do DOM.

---

### 4. Correção dos Eventos de Clique

Após corrigir a duplicação, foi observado que apenas as cartas originais podiam ser viradas.

### Causa

As cartas clonadas por:

cloneNode(true)

não herdavam os eventos registrados via:

addEventListener()

### Solução

Os eventos de clique passaram a ser registrados após a criação e embaralhamento do tabuleiro.

Resultado:

* todas as 36 cartas respondem ao clique;
* mecânica de pares voltou a funcionar corretamente.

---

### 5. Validação da Inicialização do Jogo

Foram realizados testes para verificar:

* carregamento do DOM;
* presença das cartas;
* criação do tabuleiro;
* execução do método:

MemoryGame.iniciar()

Todos os componentes passaram a inicializar corretamente.

---

## Situação Atual

Funcionalidades operacionais:

* embaralhamento das cartas;
* sistema de pares;
* cronômetro;
* HUD;
* ranking local (localStorage);
* tela de vitória;
* botão reiniciar;
* botão voltar;
* responsividade do tabuleiro.

---

## Pendência Identificada

### Sistema de Pontuação

Atualmente:

* cada par correto = 10 pontos;
* total de pares = 18;
* pontuação máxima = 180.

Como todos os jogadores que completam o jogo atingem 180 pontos, a pontuação não diferencia desempenho.

Próxima tarefa:

reformular o cálculo de pontuação utilizando critérios como:

* quantidade de movimentos;
* tempo gasto;
* bônus por eficiência.

---

## Próximos Passos

* revisar fórmula de pontuação;
* melhorar sistema de ranking;
* preparar integração definitiva com Flask;
* iniciar testes para apresentação da pré-banca.

(14/06/2026 - Atualização II)

## Melhorias na Gamificação

Durante os testes do sistema de ranking foi identificado um problema na lógica de pontuação.

### Problema

A pontuação era calculada da seguinte forma:

* +10 pontos para cada par encontrado.

Como o jogo possui 18 pares, todos os jogadores que completassem a partida obteriam:

180 pontos

Isso impedia que a pontuação representasse o desempenho real do jogador.

---

## Nova Fórmula de Pontuação

Foi implementado um sistema baseado em eficiência:

score =
300

* (moves * 2)
* Math.floor(seconds / 5)

Critérios considerados:

* quantidade de movimentos realizados;
* tempo gasto para concluir a partida.

Benefícios:

* diferencia jogadores mais eficientes;
* torna o ranking mais significativo;
* fortalece o aspecto de gamificação do projeto.

Foi adicionada a função:

calcularPontuacao()

na camada responsável pelas regras do jogo (Game Core).

---

## Atualização da HUD

A interface passou a atualizar a pontuação dinamicamente a partir da função:

calcularPontuacao()

A responsabilidade do cálculo foi mantida na camada de lógica do jogo, enquanto a HUD permanece apenas exibindo informações ao usuário.

---

## Expansão do Sistema de Ranking

Foi iniciado o suporte ao armazenamento da melhor quantidade de movimentos.

Novos recursos:

* getBestMoves()
* armazenamento de bestMoves no localStorage
* exibição da melhor quantidade de movimentos no ranking

Estrutura do ranking:

🏆 Melhor Desempenho

⭐ Melhor Pontuação
🎯 Menor Quantidade de Movimentos
⌛ Melhor Tempo

---

## Refatoração e Limpeza de Código

Foi identificada uma duplicidade entre:

* reiniciarJogo()
* reiniciarJogos()

 remoção da implementação obsoleta para reduzir redundâncias e facilitar manutenção futura.

---

## Situação Atual do Módulo

Funcionalidades operacionais:

* geração do tabuleiro;
* duplicação controlada das cartas;
* embaralhamento;
* sistema de pares;
* cronômetro;
* HUD dinâmica;
* ranking local;
* sistema de pontuação baseado em eficiência;
* tela de vitória;
* reinicialização da partida;
* responsividade.

---

## Próximos Passos

* preparar documentação técnica para pré-banca;
* iniciar adaptação definitiva para Flask.