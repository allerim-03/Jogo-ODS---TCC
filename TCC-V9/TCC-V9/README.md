# Cultivando o Saber — frontend + backend Python

O projeto agora utiliza Flask e SQLite. O servidor Python entrega as páginas e a API no mesmo endereço. Não é necessário instalar Node.js ou MySQL.

## Executar no Windows

Instale Python 3.10 ou superior. Abra o terminal na pasta `TCC` extraída do ZIP e execute:

```powershell
py -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\.venv\Scripts\python.exe backend\run.py
```

Abra **http://127.0.0.1:5000** no navegador. Mantenha o terminal aberto. Para encerrar, pressione `Ctrl+C`.

Nas próximas execuções, basta executar o último comando. Não abra os HTMLs diretamente e não use Live Server: as páginas precisam da API e das rotas do Flask.

## Linux / macOS

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r backend/requirements.txt
.venv/bin/python backend/run.py
```

## Primeiro acesso

1. Cadastre um professor em “Criar conta” com nome completo, e-mail e senha. Não é necessário informar escola nem usar e-mail institucional.
2. Crie uma turma e copie seu código de acesso.
3. Em outro navegador ou janela anônima, cadastre um aluno com esse código.
4. O aluno escolhe seu avatar e pode acessar jogos, quizzes, ODS e tarefas.
5. Nos próximos acessos, o aluno entra apenas com nome completo e senha. O vínculo com a turma permanece no banco.

A senha do aluno tem exatamente 6 caracteres, incluindo maiúscula, minúscula, número e símbolo (exemplo apenas ilustrativo: `Ab1!cd`). O professor entra com e-mail e senha.

## Organização

| Pasta | Responsabilidade |
| --- | --- |
| `frontend/pages/auth/` | Telas de login e cadastro |
| `frontend/pages/public/` | Início, ODS e apresentação do projeto |
| `frontend/pages/student/` | Área do aluno |
| `frontend/pages/teacher/` | Área do professor |
| `frontend/pages/shared/` | Perfil e ranking compartilhados |
| `frontend/assets/img/` | Imagens da plataforma e do jogo da água |
| `frontend/assets/css/` | Estilos separados por componente e página |
| `frontend/assets/js/auth/` | Controladores dos formulários de autenticação |
| `frontend/assets/js/services/` | Cliente HTTP da API Python |
| `frontend/assets/js/components/` | Navegação e componentes compartilhados |
| `frontend/assets/js/pages/` | Comportamentos específicos das páginas |
| `frontend/assets/js/core/` | Inicialização e navegação do frontend |
| `frontend/assets/js/games/water/` | Módulos do jogo da água |
| `frontend/games/recycle/` | Jogo de reciclagem, com seus próprios assets e módulos |
| `frontend/routes/pages.json` | Mapa das URLs e arquivos HTML servido pelo Flask |
| `backend/config.py` | Configuração de banco, host, porta e cookies |
| `backend/app/routes/` | Rotas de autenticação, usuários, turmas, tarefas, jogos e páginas |
| `backend/app/models/` | Acesso e persistência no SQLite |
| `backend/app/services/` | Validações, permissões e cálculo de conclusão das tarefas |
| `backend/tests/` | Testes automatizados da integração |
| `backend/instance/` | Banco e chave de sessão, gerados na primeira execução |
| `docs/` | Relatório da alteração e documentação |

## Configuração e dados

`backend/config.py` é a fonte de configuração. O endpoint `/config.js` fornece ao frontend a URL relativa da API; a porta não fica duplicada no JavaScript. Exemplo para trocar a porta no PowerShell:

```powershell
$env:PORT="5001"
.\.venv\Scripts\python.exe backend\run.py
```

O banco é criado em `backend/instance/cultivando.sqlite3`. Para fazer backup, encerre o servidor e copie a pasta `backend/instance`. Ela não deve ser enviada a repositórios públicos. O SQLite mantém os dados após fechar o navegador ou reiniciar o servidor.

O ZIP recebido continha um `database.db` vazio e um banco demonstrativo armazenado no navegador, não no projeto. Por isso esta entrega começa sem contas, turmas ou pontuações pré-carregadas. Os dados antigos do localStorage não são importados nem apagados automaticamente.

## Testes

```powershell
.\.venv\Scripts\python.exe -m pip install -r backend\requirements-dev.txt
.\.venv\Scripts\python.exe -m pytest backend\tests -q
```

Os testes usam bancos temporários, sem alterar o banco da aplicação. Veja `docs/RELATORIO.md` para cobertura e limitações.

## Notas de uso

- Sessão por cookie HttpOnly, proteção CSRF e senhas com hash do Werkzeug.
- Professor acessa apenas suas turmas; aluno acessa apenas tarefas de sua turma. O ranking global expõe somente campos de apresentação, sem e-mails ou senhas.
- Contas com nomes iguais em turmas distintas e a mesma senha são recusadas no login por ambiguidade; o professor pode redefinir uma delas.
- Resultados repetidos com o mesmo identificador de execução não somam XP novamente.
- O servidor valida permissões, valores, tarefas e ordem das fases. Os jogos e quizzes ainda executam no navegador e enviam seus resultados: esta implementação não é um mecanismo antifraude para avaliações formais.
- Para hospedagem pública, configure HTTPS, `SECRET_KEY`, `COOKIE_SECURE=1` e um servidor WSGI. O comando `run.py` é destinado ao desenvolvimento local.
