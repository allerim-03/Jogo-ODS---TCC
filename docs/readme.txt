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




 — Atualização de Desenvolvimento

Data (15/06/2026)

# Objetivo 

Estruturar a base da gamificação utilizando:

* Flask
* MySQL Connector
* Services
* Repositories
* Sistema de XP
* Sistema de Níveis
* Sistema de Ranking
* Sistema de Badges

---

# Refatoração da Arquitetura

Padronização da arquitetura para:


Flask
│
├── Routes
│
├── Services
│
├── Repositories
│
└── MySQL Connector

---

# Banco de Dados

## Padronização de nomenclatura

Foi decidido utilizar:

```plaintext
Banco (MySQL) → inglês
```

Exemplo:

```plaintext
users
badges
inventory_badges
scores
games
quizzes
```

Enquanto isso:

```plaintext
Models Python → podem permanecer em português
```

Exemplo:

```python
class Usuario:
```

---

# Sistema de XP

## Arquivo

```plaintext
app/services/xp_service.py
```

Implementado:

### Tabela de níveis

```python
LEVELS = [
    (1, 0),
    (2, 100),
    (3, 250),
    (4, 500),
    (5, 1000)
]
```

### Cálculo de nível

```python
calculate_level(xp)
```

### Adição de XP

```python
add_xp(user, amount)
```

Função responsável por:

* adicionar XP
* recalcular nível
* atualizar objeto do usuário

---

# Sistema de Badges

## Arquivo

```plaintext
app/services/badge_service.py
```

Refatorado e limpo.

Responsabilidades:

### Verificar badges desbloqueadas

```python
check_and_award_badges()
```

### Verificar se o usuário já possui badge

```python
check_user_badge()
```

### Conceder badge

```python
award_badge()
```

---

# Sistema de Jogos

## Arquivo

```plaintext
app/services/game_service.py
```

Implementado:

```python
process_game_result()
```

Fluxo:

```plaintext
Score recebido
↓
Converte para XP
↓
Atualiza usuário
↓
Verifica badges
↓
Retorna XP obtido
```

---

# Repositories

## Arquivo

```plaintext
app/repositories/user_repository.py
```

Refatorado.

Implementado:

### Buscar usuário

```python
get_user_by_id()
```

### Atualizar usuário

```python
update_user()
```

---

# Limpeza de Código

Realizada remoção de:

* código duplicado
* funções repetidas
* classes antigas de teste
* imports incorretos

---

# Correções Identificadas

## Badge Service

Problema:

```python
from app.database.connection
```

Estrutura real:

```plaintext
database/
└── connection.py
```

Correção:

```python
from database.connection import get_connection
```

---

## Configuração do Banco

Definido banco oficial:

```plaintext
tcc
```

Ajuste necessário:

```python
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "senha123",
    "database": "tcc"
}
```

---

# Sistema de Ranking

Estrutura inicial criada.

Necessita refatoração futura para:

```plaintext
routes/ranking.py
+
services/ranking_service.py
+
repositories/user_repository.py
```

Removendo consultas SQL diretas das rotas.

---

# Situação Atual da Gamificação

## Concluído

* Sistema XP
* Sistema de Níveis
* Sistema de Badges
* Estrutura de Services
* Estrutura de Repositories
* Planejamento completo da gamificação
* Integração inicial Jogos → XP → Badge

---

## Próximos Passos

### Fase 9

Banco de dados

* Criar tabela `badges`
* Criar tabela `inventory_badges`
* Criar tabela `scores`

---

### Fase 10

Ranking completo

* ranking_service
* top jogadores
* ordenação por XP

---

### Fase 11

Integração Jogo da Memória

```plaintext
Memory Game
↓
Score
↓
/game/score
↓
XP
↓
Level
↓
Badge
↓
Ranking
```

---

### Fase 12

Dashboard Gamificado

Exibir:

* XP atual
* Nível atual
* Barra de progresso
* Ranking
* Badges desbloqueadas

---

# Commit sugerido

```bash
git commit -m "refactor: organize gamification architecture with services and repositories"
```

ou mais simples:

```bash
git commit -m "feat: implement XP, level and badge service structure"
```

---(15/06/2026)
# Atualização do Projeto – Sistema de Ranking

## Objetivo

Implementação da estrutura inicial do sistema de gamificação utilizando Flask + MySQL Connector.

---

# Estrutura adotada

O projeto está utilizando:

* Flask
* Factory Pattern
* Blueprints
* MySQL Connector
* Repository Pattern
* Services Layer

Organização atual:

app/
├── routes/
├── services/
├── repositories/
├── config/
├── templates/
└── static/

database/
└── connection.py

---

# Banco de Dados

Tabela principal renomeada para seguir o padrão em inglês:

## users

```sql
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    xp INT DEFAULT 0,
    level INT DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## scores

```sql
CREATE TABLE score (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    game_name VARCHAR(50) NOT NULL,
    points INT NOT NULL,
    xp_earned INT NOT NULL,
    played_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## badges

```sql
CREATE TABLE badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(255),
    requirement_type VARCHAR(50),
    requirement_value INT NOT NULL
);
```

## inventory_badge

```sql
CREATE TABLE inventory_badge (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    badge_id INT NOT NULL,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (badge_id) REFERENCES badges(id)
);
```

---

# Sistema de XP

Tabela de progressão definida:

| Level | XP Necessário |
| ----- | ------------- |
| 1     | 0             |
| 2     | 100           |
| 3     | 250           |
| 4     | 500           |
| 5     | 1000          |

Implementado em:

app/services/xp_service.py

Funções:

* calculate_level()
* add_xp()

Responsabilidades:

* calcular nível baseado no XP
* atualizar XP do usuário
* controlar progressão de níveis

---

# Sistema de Badges

Implementado em:

app/services/badge_service.py

Funções:

* check_and_award_badges()
* user_has_badge()
* award_badge()

Responsabilidades:

* verificar requisitos de badges
* evitar badges duplicadas
* registrar conquistas do usuário

---

# Sistema de Jogos

Implementado em:

app/services/game_service.py

Função:

* process_game_score()

Responsabilidades:

* converter score em XP
* atualizar nível
* verificar desbloqueio de badges

---

# Repository Layer

Implementado em:

app/repositories/user_repository.py

Funções:

* get_user_by_id()
* update_user()
* get_ranking()

Responsabilidades:

* comunicação direta com o banco
* consulta de usuários
* atualização de XP e Level
* geração do ranking

---

# Configuração do Banco

Arquivo:

app/config/settings.py

```python
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "senha123",
    "database": "tcc"
}
```

Conexão:

database/connection.py

```python
def get_connection():
    return mysql.connector.connect(
        host=DB_CONFIG["host"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        database=DB_CONFIG["database"]
    )
```

---

# Rotas Implementadas

## Home

GET /

Retorna:

```json
{
  "message": "API funcionando"
}
```

## Ranking

GET /ranking

Retorna:

```json
[
  {
    "id": 1,
    "name": "João",
    "xp": 120,
    "level": 2
  }
]
```

Testado com Postman.

---

# Problemas Resolvidos

* ModuleNotFoundError
* Blueprint não registrado
* Imports incorretos
* IndentationError
* KeyError em DB_CONFIG
* Coluna nome → name
* Erro de consulta do ranking
* Estrutura Repository + Services

---

# Próximas Etapas

## Fase 9

Sistema completo de badges

* criar badges iniciais
* inserir badges no banco
* tela de conquistas

## Fase 10

Integração Quiz + Gamificação

* XP ao finalizar quiz
* atualização automática de nível

## Fase 11

Integração Jogos + Gamificação

* salvar score
* registrar XP ganho
* atualizar ranking

## Fase 12

Dashboard do usuário

* exibir XP
* exibir nível
* exibir badges
* exibir posição no ranking
---parte III

# Fase 11 – Integração Completa da Gamificação

## Objetivo

Integrar o fluxo completo da gamificação:

Quiz/Jogos → XP → Level → Badges → Ranking

Quando o jogador finaliza um quiz ou jogo, sua pontuação é convertida em XP, atualizando automaticamente seu nível, verificando conquistas (badges) e refletindo no ranking geral.

---

## Fluxo Implementado

### 1. Receber resultado do jogo

Rota:

POST /game/score

Exemplo de JSON:

```json
{
    "user_id": 1,
    "score": 2
}
```

---

### 2. Converter Score em XP

Regra atual:

```python
xp_gained = score * 10
```

Exemplo:

* Score = 2
* XP ganho = 20

---

### 3. Atualizar XP e Level

Arquivo:

app/services/xp_service.py

Funções:

* calculate_level()
* add_xp()

Tabela de níveis:

| Level | XP Necessário |
| ----- | ------------- |
| 1     | 0             |
| 2     | 100           |
| 3     | 250           |
| 4     | 500           |
| 5     | 1000          |

---

### 4. Atualizar usuário

Arquivo:

app/repositories/user_repository.py

Função:

```python
update_user(user)
```

Atualiza:

* xp
* level

na tabela users.

---

### 5. Verificar Badges

Arquivo:

app/services/badge_service.py

Função:

```python
check_and_award_badges()
```

Verifica:

* badges por XP
* badges por Level

e registra na tabela:

inventory_badges

---

### 6. Salvar histórico de partidas

Arquivo:

app/repositories/score_repository.py

Função:

```python
save_score()
```

Tabela:

scores

Campos registrados:

* user_id
* game_name
* points
* xp_earned
* played_at

---

### 7. Atualizar Ranking

Arquivo:

app/repositories/user_repository.py

Função:

```python
get_ranking()
```

Ordenação:

```sql
ORDER BY xp DESC
```

---

## Teste realizado via Postman

Endpoint:

POST http://127.0.0.1:5000/game/score

Body:

```json
{
    "user_id": 1,
    "score": 2
}
```

Resposta:

```json
{
    "message": "XP atualizado",
    "xp_before": 90,
    "xp_gained": 20,
    "xp_after": 110,
    "level": 2
}
```

---

## Resultado da Fase 11

✔ Conversão de score em XP

✔ Atualização de XP

✔ Atualização de Level

✔ Verificação automática de Badges

✔ Registro do histórico de partidas

✔ Atualização do Ranking

✔ Testado via Postman

Fase 12 – Dashboard

✔ Criada rota GET /user/<id>/progress

Retorna:
- id
- name
- xp
- level

Objetivo:
Permitir que o Dashboard exiba o progresso do jogador em tempo real.

# Atualização do Projeto – Fase 12 (Polimento e Integração Front-End)

## Data (17/06/2026)

## Objetivo da Fase

Iniciar a integração entre o Front-End e o Back-End, conectando as páginas HTML aos endpoints Flask e ao sistema de gamificação já implementado.

---

## Funcionalidades Implementadas

### Dashboard do Jogador

Foi definido que o painel do aluno (student-profile) será utilizado como Dashboard principal do jogador, evitando duplicação de páginas e aproveitando o layout já desenvolvido.

O Dashboard deverá apresentar:

* Avatar do jogador
* Nome do jogador
* XP atual
* Nível atual
* Jogos disponíveis
* Quizzes disponíveis
* Ranking
* Badges conquistadas

---

### Endpoint de Progresso do Usuário

Foi criada e testada a rota:

GET /user/<id>/progress

Exemplo de retorno:

```json
{
    "id": 1,
    "name": "Mirella",
    "xp": 110,
    "level": 2
}
```

Essa rota será utilizada pelo Dashboard para exibir os dados do jogador em tempo real.

---

### Integração do Ranking

A página Ranking foi ajustada para consumir dados do backend através da rota:

GET /ranking

O JavaScript da página passa a preencher automaticamente:

* 1º lugar
* 2º lugar
* 3º lugar
* Lista dos demais jogadores

com base nos dados armazenados na tabela users.

---

### Planejamento da Integração de Badges

Foi definido o fluxo para exibição das badges conquistadas:

Tabela utilizada:

* badges
* inventory_badges

Nova rota planejada:

GET /user/<id>/badges

Retorno esperado:

```json
[
    {
        "id": 1,
        "name": "Primeiros Passos",
        "description": "Alcançou 50 XP",
        "icon": "🌱"
    }
]
```

As badges serão carregadas dinamicamente no Dashboard.

---

### Integração do Jogo da Memória

O JavaScript do jogo foi preparado para enviar resultados ao backend:

POST /game/score

Payload enviado:

```json
{
    "user_id": 1,
    "score": 2,
    "moves": 10,
    "time": 35
}
```

O backend já processa:

* Conversão Score → XP
* Atualização de XP
* Atualização de Level
* Verificação de Badges
* Salvamento de Score
* Atualização do Ranking

---

## Estrutura Consolidada

### Repositories

* user_repository.py
* score_repository.py
* badge_repository.py (planejado)

### Services

* xp_service.py
* badge_service.py
* game_service.py

### Banco de Dados

Tabelas ativas:

* users
* scores
* badges
* inventory_badges

---

## Status Geral

### Concluído

* Sistema de XP
* Sistema de Levels
* Sistema de Badges
* Sistema de Ranking
* Persistência de Scores
* Integração Jogo → XP → Level → Badge → Ranking
* Endpoint de Progresso do Usuário
* Integração inicial Ranking Front-End

### Em andamento

* Dashboard conectado ao backend
* Carregamento dinâmico de Badges

### Próximas etapas

* Finalizar Dashboard
* Implementar endpoint GET /user/<id>/badges
* Exibir badges reais no Dashboard
* Integrar Top 3 do Ranking no Dashboard
* Implementar autenticação/login para remover user_id fixo
* Refinamento visual das telas

---

## Progresso do Projeto

Fase 10 – Sistema de Badges → Concluída

Fase 11 – Quiz/Jogos → XP → Level → Badges → Ranking → Concluída

Fase 12 – Polimento e Integração Front-End → Em andamento

data 27/06/2026

finalmente a parte de integração está pronta , eu sei que ficou feio mas vcs que lutem :).
agora vou iniciar o sistema de quizzes com uma approch de fases tbm:
1- modelagem do banco de dados
2-backenda flask
3-frontend (eca)
4-fluxo do usuário
5-testes e melhorias

etapa 1 banco de dados
mantendo o padrão de escrito em inglês, lower case e singular.

## Quiz

| Campo       | Tipo                            |
| ----------- | ------------------------------- |
| id_quiz     | INT PK                          |
| titulo      | VARCHAR(100)                    |
| tema        | VARCHAR(100)                    |
| dificuldade | ENUM('facil','medio','dificil') |
| xp          | INT                             |
| ativo       | BOOLEAN                         |

---

## Pergunta

| Campo            | Tipo         |
| ---------------- | ------------ |
| id_pergunta      | INT PK       |
| quiz_id          | FK           |
| pergunta         | TEXT         |
| alternativa_a    | VARCHAR(255) |
| alternativa_b    | VARCHAR(255) |
| alternativa_c    | VARCHAR(255) |
| alternativa_d    | VARCHAR(255) |
| resposta_correta | CHAR(1)      |

---

## Resultado Quiz

Essa tabela é importante para o ranking.

| Campo           | Tipo     |
| --------------- | -------- |
| id_resultado    | INT PK   |
| usuario_id      | FK       |
| quiz_id         | FK       |
| acertos         | INT      |
| xp_ganho        | INT      |
| data_realizacao | DATETIME |

Assim consegue gerar:

* ranking
* histórico
* relatórios
* métricas do professor
CREATE TABLE quiz (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    theme VARCHAR(100) NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    xp_reward INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE question (
    id INT AUTO_INCREMENT PRIMARY KEY,

    quiz_id INT NOT NULL,

    question_text TEXT NOT NULL,

    option_a VARCHAR(255) NOT NULL,
    option_b VARCHAR(255) NOT NULL,
    option_c VARCHAR(255) NOT NULL,
    option_d VARCHAR(255) NOT NULL,

    correct_option ENUM('A','B','C','D') NOT NULL,

    question_order INT NOT NULL,

    FOREIGN KEY (quiz_id)
        REFERENCES quiz(id)
        ON DELETE CASCADE
);

CREATE TABLE quiz_attempt (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    quiz_id INT NOT NULL,

    score INT NOT NULL,

    total_questions INT NOT NULL,

    xp_earned INT NOT NULL,

    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE,

    FOREIGN KEY (quiz_id)
        REFERENCES quiz(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_question_quiz
ON question (quiz_id);

CREATE INDEX idx_attempt_user
ON quiz_attempt (user_id);

CREATE INDEX idx_attempt_quiz
ON quiz_attempt (quiz_id);


--- 29/08 sistema de gamificação
# Sistema de Gamificação

A plataforma utiliza um sistema de gamificação para incentivar a participação dos alunos nas atividades relacionadas à sustentabilidade e aos ODS.

O sistema é baseado principalmente em:

* **Score:** pontuação obtida pelo jogador em cada atividade;
* **XP:** experiência recebida a partir da pontuação;
* **Nível:** determinado pela quantidade de XP acumulada;
* **Badges:** conquistas atribuídas de acordo com o progresso do usuário;
* **Ranking:** classificação dos usuários de acordo com seu desempenho;
* **Histórico:** registro das partidas realizadas.

## Fluxo da gamificação

O JavaScript de cada jogo é responsável apenas por calcular a pontuação da partida.

```text
Jogador finaliza o jogo
        │
        ▼
JavaScript calcula o Score
        │
        ▼
POST /api/games/score
        │
        ▼
GameService
        │
        ├── Converte Score → XP
        ├── Atualiza XP
        ├── Recalcula o nível
        ├── Verifica Badges
        ├── Salva o histórico
        └── Atualiza o Ranking
        │
        ▼
Banco de Dados
```

A separação permite que diferentes minijogos utilizem o mesmo sistema de gamificação.

Por exemplo, o **Jogo da Memória**, a **Esteira da Reciclagem** e o **Quiz** podem possuir regras diferentes para calcular o Score, mas todos utilizam o mesmo processamento de XP, nível, badges e ranking no backend.

## XP e níveis

Atualmente, a conversão de Score para XP utiliza a regra:

```text
XP = Score × 10
```

Os níveis são definidos de acordo com o XP acumulado:

| Nível | XP necessário |
| ----: | ------------: |
|     1 |             0 |
|     2 |           100 |
|     3 |           250 |
|     4 |           500 |
|     5 |          1000 |

O `xp_service.py` possui a responsabilidade de adicionar XP e calcular automaticamente o nível correspondente.

## Histórico de partidas

Os resultados dos jogos são armazenados na tabela `score`, contendo informações como:

* usuário;
* jogo;
* pontuação;
* XP obtido;
* data da partida.

A estrutura permite futuramente utilizar esses dados para:

* histórico do jogador;
* estatísticas;
* ranking;
* acompanhamento de evolução;
* comparação de desempenho.

---

# Melhorias planejadas

O sistema atual possui a estrutura principal da gamificação, porém alguns pontos ainda estão em processo de reorganização e melhoria.

### 1. Padronização das tabelas de jogos

A estrutura está sendo reorganizada para utilizar:

**`games`**

Responsável pelo catálogo de jogos disponíveis.

**`score`**

Responsável pelo histórico das pontuações obtidas pelos usuários.

A intenção é relacionar cada pontuação ao `game_id`, evitando armazenar repetidamente o nome do jogo em cada partida.

### 2. Revisão do `GameService`

O `GameService` será ajustado para utilizar a nova estrutura de banco e concentrar corretamente o fluxo:

```text
Score
  ↓
XP
  ↓
Level
  ↓
Badges
  ↓
Score/Histórico
  ↓
Ranking
```

Também será necessário alinhar os nomes dos métodos entre as rotas, serviços e repositórios.

### 3. Padronização das rotas

As rotas de jogos serão reorganizadas para utilizar uma estrutura consistente, por exemplo:

```text
POST /api/games/score
```

ou futuramente:

```text
POST /api/games/<game_slug>/score
```

A identificação do usuário deverá utilizar o usuário autenticado pelo JWT, evitando depender de um `user_id` enviado pelo frontend.

### 4. Integração dos novos minijogos

Novos jogos poderão utilizar o mesmo sistema sem precisar implementar novamente a lógica de XP.

Cada jogo será responsável somente por calcular seu próprio Score.

Exemplo:

```text
Jogo da Memória
→ Score baseado em movimentos e tempo

Esteira da Reciclagem
→ Score baseado em acertos, erros e tempo

Quiz
→ Score baseado em respostas corretas
```

Depois disso, todos enviam o resultado ao mesmo sistema de gamificação.

### 5. Evolução do sistema de badges

O sistema de badges será ampliado para contemplar diferentes tipos de conquistas, como:

* completar determinada quantidade de jogos;
* atingir determinados níveis;
* acumular determinada quantidade de XP;
* obter pontuações específicas;
* conquistas relacionadas aos ODS.

### 6. Melhorias futuras no ranking

O ranking poderá ser aprimorado para apresentar:

* posição do usuário;
* XP acumulado;
* pontuação;
* ranking geral;
* ranking por jogo;
* ranking por período.

### 7. Estatísticas e dashboard

Os dados armazenados poderão alimentar um dashboard com informações como:

* partidas realizadas;
* pontuação total;
* melhor pontuação;
* média de pontuação;
* XP acumulado;
* nível atual;
* badges conquistadas;
* evolução do jogador.

---

## Estado atual

A estrutura principal da gamificação já está definida, incluindo **Score, XP, níveis, badges, ranking e histórico**.

O próximo passo é **padronizar e integrar as tabelas `games` e `score` ao `GameService`, `ScoreRepository` e às rotas da API**, antes de conectar os novos minijogos ao sistema.
