# Relatório de reorganização e integração

O projeto foi reorganizado em duas pastas principais: `frontend` e `backend`. A identidade visual e os jogos existentes foram mantidos. Os caminhos das imagens passaram de `assets/images` para `assets/img`, incluindo os caminhos dinâmicos do jogo da água.

O arquivo `server.cjs`, o `package.json` destinado ao servidor Node e o serviço `mock-db.js` deixaram de fazer parte da execução. A aplicação não utiliza mais localStorage ou sessionStorage como banco de contas, turmas ou pontuações.

O backend recebido apresentava imports inconsistentes, configuração em uma pasta chamada `config.py`, dependências de modelos ausentes e módulos vazios. Sua inicialização foi reconstruída com uma fábrica Flask, configuração centralizada e módulos separados. A configuração MySQL incompleta foi substituída por SQLite, que cria o banco automaticamente e permite executar o projeto sem um serviço adicional.

## Principais arquivos

- `backend/run.py`: entrada para execução.
- `backend/config.py`: banco, host, porta e sessão.
- `backend/app/__init__.py`: inicialização, blueprints, CSRF, transações e tratamento de erros.
- `backend/app/models/database.py`: tabelas SQLite de usuários, turmas, quizzes, tarefas e resultados, com documentos JSON por entidade e índices únicos para códigos e resultados.
- `backend/app/routes/auth.py`: cadastro, login e logout.
- `backend/app/routes/classes.py`: criação de turma, validação e renovação de código de acesso.
- `backend/app/routes/users.py`: perfil, edição de aluno e leitura dos ODS.
- `backend/app/routes/tasks.py`: quizzes autorais e atribuição de tarefas.
- `backend/app/routes/games.py`: pontuação e progressão dos jogos.
- `backend/app/routes/api.py`: estado autorizado para renderização do frontend e ranking.
- `backend/app/routes/web.py`: entrega das páginas, assets e configuração JavaScript.
- `frontend/assets/js/services/api.js`: requisições HTTP, cache temporário em memória e fila de gravações.
- `frontend/assets/js/auth/forms.js`: formulários de login e cadastro separados do controlador geral.
- `frontend/assets/js/core/app.js`, componentes e controladores de páginas: espera da sessão remota e gravações assíncronas.
- `frontend/games/recycle/bridge.js`: registro de pontuação pela API, com confirmação após resposta do servidor.
- Arquivos HTML, CSS e JS: caminhos atualizados para as novas pastas e carregamento da configuração Python.

## Validação

Foram executados testes automatizados com Flask e SQLite temporário, cobrindo cadastro de professor e aluno, criação de turma, login sem repetir código, edição de perfil, redefinição de senha, quizzes autorais, tarefas, ranking, leitura de ODS, pontuação, prevenção de duplicação, progressão pelas quatro fases, logout e persistência após recriar a aplicação. Também foram verificadas rejeições por CSRF, perfil sem permissão, turma de outro professor e fase ainda bloqueada.

Também foi executada uma integração dos controladores em DOM simulado (jsdom) conectado ao Flask real: cadastro de professor, criação de turma, validação do código, cadastro de aluno, edição de avatar e inicialização das telas de professor e aluno. Não foram identificados erros JavaScript nesses fluxos. Essa checagem não substitui inspeção visual ou reprodução manual das partidas.

As URLs do mapa de rotas e referências locais dos HTMLs foram verificadas. A sintaxe dos scripts JavaScript foi verificada separadamente. Não foi possível executar a inspeção visual em Chromium neste ambiente: o download do navegador falhou. Essa limitação não afeta os testes da API.

## Dados anteriores e limites

Não houve migração automática das contas demonstrativas: elas estavam no navegador original, e o banco Python enviado estava vazio. A versão entregue inicia com banco novo, sem contas de teste. A pasta `docs/backend-original` preserva os documentos recebidos apenas como referência histórica; as instruções atuais são as do README da raiz.

Os resultados dos jogos e quizzes ainda são produzidos no cliente. A API aplica validações e controle de acesso, mas não simula as partidas no servidor nem impede toda adulteração por um cliente modificado. O ranking global mantém a funcionalidade existente e disponibiliza apenas dados de apresentação dos alunos.

## Revisão do cadastro do professor e verificação de segurança

O campo de escola foi removido de `frontend/pages/auth/signup-teacher.html` e do envio em `frontend/assets/js/auth/forms.js`. O rótulo passou a ser “E-mail”. Em `backend/app/routes/auth.py`, a escola deixou de ser obrigatória, preservando o campo opcional para compatibilidade com contas anteriores. Nome, e-mail e senha continuam obrigatórios. A API já aceitava domínios não institucionais; essa possibilidade agora também fica clara na interface.

Foi acrescentado teste de cadastro sem escola, uso de e-mail comum, login, rejeição de e-mail inválido/duplicado, ausência do hash nas respostas, salts diferentes para a mesma senha e atributos de cookie. O arquivo `docs/SEGURANCA.md` descreve as proteções e os limites da implementação, incluindo a ausência de HTTPS na execução local e de limitação de tentativas de login.
