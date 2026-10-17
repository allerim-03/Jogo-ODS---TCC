# Estrutura do projeto

A plataforma usa HTML, CSS e JavaScript. O Node.js serve os arquivos e resolve as rotas; os dados da demonstração continuam no navegador.

- `server.cjs`: servidor estático e redirecionamento de endereços antigos.
- `routes.json`: relação entre nomes antigos, endereços públicos e páginas HTML.
- `public/pages/public/`: início público, ODS, projeto e página de indisponibilidade.
- `public/pages/auth/`: escolha de perfil, login e cadastro.
- `public/pages/student/`: jornada, matrícula, perfil, jogos e quizzes.
- `public/pages/teacher/`: turmas e perfil do gestor.
- `public/pages/shared/`: ranking e edição de perfil.
- `public/assets/css/`: identidade visual e estilos organizados por responsabilidade.
- `public/assets/js/services/`: banco demonstrativo.
- `public/assets/js/core/`: rotas e integração dos formulários com os dados.
- `public/assets/js/components/`: cabeçalho e navegação compartilhados.
- `public/assets/js/pages/`: quizzes, ODS e apresentação da equipe.
- `public/assets/js/games/water/`: motor e controles do jogo da água.
- `public/assets/images/`: imagens da plataforma.
- `public/games/recycle/`: jogo ReciclaCoop, mantendo seus módulos e recursos próprios.
- `tests/`: testes de dados, motor do jogo e rotas.
- `docs/`: instruções e decisões de organização.

## Navegação

A marca no cabeçalho sempre leva à página pública `/`. A página pública, os ODS e a apresentação do projeto podem ser acessados sem conta. O login de aluno leva a `/app` quando há uma matrícula; caso contrário, leva a `/turma/entrar`. O login de gestor leva a `/turmas`. Sair encerra a sessão da aba e volta a `/`.

As páginas privadas verificam a sessão no JavaScript. Esta é uma simulação local, não um mecanismo de autenticação de produção.

A navegação lateral é compartilhada entre as páginas e se transforma em um cabeçalho compacto no celular. A seleção do item ativo, o menu de celular, o acesso à área pessoal e o logout são controlados por um componente comum.

## Identidade visual

Verde original: `#4CAF50`. Azul: `#43B4FB`. Amarelo: `#FFDE5A`. Vermelho: `#FF524D`. Tons de verde escuro são usados em texto e botões para melhorar a leitura. As superfícies claras ajudam a separar os grupos sem competir com as atividades.

A composição da referência está implementada em `navigation.css` e `playful.css`. O painel usa duas colunas no computador e se reorganiza em telas menores.

Os estilos locais e as antigas regras conflitantes com `!important` foram substituídos por componentes comuns. Os formulários conservam os identificadores usados pela lógica existente. Os únicos estilos HTML locais restantes controlam estados de exibição do quiz e mensagens.

## Persistência

As chaves `cultivando.db.v1` e `cultivando.session.v1` foram preservadas. Se executar no mesmo navegador e endereço/porta, os cadastros, turmas e resultados da versão anterior continuam disponíveis. Ao mudar a porta ou o navegador, os dados pertencem a outro armazenamento.

## Tarefas e quizzes autorais

`services/mock-db.js` migra o banco existente com coleções `assignments` e `customQuizzes`. Somente o professor pode criar quizzes e atribuir atividades às suas turmas. `pages/tasks.js` controla criação, atribuição e listagem por perfil. `pages/task-player.js` resolve o contexto da tarefa pelo parâmetro `assignment` da URL. Os resultados dos jogos e quizzes registram esse identificador; as conclusões são derivadas desses resultados. O aluno vê somente as tarefas da turma em que está matriculado.
