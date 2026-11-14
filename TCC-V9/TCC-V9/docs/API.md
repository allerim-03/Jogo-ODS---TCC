# API e comunicação

Todas as rotas usam a origem do Flask. O frontend carrega `/config.js`, depois `assets/js/services/api.js`, consulta `GET /api/state` e aguarda `EcoAPI.ready` antes de renderizar os dados.

As escritas enviam JSON e o cabeçalho `X-CSRF-Token` recebido no estado. A sessão é mantida por cookie HttpOnly. Respostas de erro contêm `{"error":"mensagem"}` e status HTTP apropriado.

| Método | Rota | Uso |
| --- | --- | --- |
| GET | `/api/state` | Sessão e dados autorizados |
| POST | `/api/auth/register` | Cadastrar e autenticar |
| POST | `/api/auth/login` | Autenticar |
| POST | `/api/auth/logout` | Encerrar sessão |
| GET | `/api/classes/validate/<code>` | Nome e ID da turma para o cadastro |
| POST | `/api/classes` | Criar turma |
| POST | `/api/classes/<id>/rotate-code` | Substituir código |
| POST | `/api/classes/join` | Vincular aluno ainda sem turma |
| PATCH | `/api/users/me` | Atualizar avatar e dados permitidos do perfil |
| PATCH | `/api/users/<id>` | Professor edita aluno de sua turma |
| POST | `/api/users/me/ods` | Registrar ODS explorado |
| POST | `/api/quizzes` | Criar quiz autoral |
| POST | `/api/assignments` | Atribuir de uma a três atividades |
| POST | `/api/results` | Registrar resultado com runId idempotente |

Após cada escrita, o cliente consulta novamente o estado autorizado e dispara `eco:update` para atualizar os componentes. Recarregar a página busca o banco novamente. Não há sincronização em tempo real entre navegadores: atualize a página para consultar alterações feitas por outro usuário.
