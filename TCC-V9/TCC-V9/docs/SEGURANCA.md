# Segurança implementada e limites

Esta revisão descreve o código entregue; não equivale a uma auditoria de segurança completa.

## Implementado

- Hash das senhas com `generate_password_hash` do Werkzeug (scrypt na versão validada), com salt aleatório. O login usa `check_password_hash`. O banco armazena o hash, não a senha original. A redefinição de senha do aluno também gera hash.
- Respostas da API removem o hash antes de enviar dados ao frontend.
- Sessão do Flask em cookie assinado, com HttpOnly e SameSite=Lax. A assinatura detecta alterações; o conteúdo do cookie não é criptografado. A sessão contém identificador de usuário e token CSRF, não a senha.
- Token CSRF obrigatório nas escritas da API, inclusive cadastro, login e logout.
- Verificações de usuário, papel e vínculo com turma no backend. Professores não podem editar alunos ou turmas de outro professor.
- Parâmetros SQL separados dos valores recebidos, e nomes de tabelas limitados a uma lista interna.
- Validação de dados, códigos de turma únicos e prevenção de duplicação de pontuação pelo mesmo runId.
- Cabeçalhos `nosniff` e `no-store` nas respostas da API.

## HTTPS, URLs e proteção dos dados

As URLs não precisam ser escondidas ou “criptografadas” para proteger o acesso. A API valida sessão e permissões. Os arquivos HTML, CSS e JavaScript são públicos; as informações de conta são obtidas pela API autenticada. A validação visual no JavaScript não substitui essas verificações no servidor.

A execução local usa HTTP. Portanto, as senhas enviadas no login e cadastro não têm criptografia de transporte nessa configuração. O hash protege a senha armazenada, não o tráfego. Para publicar o sistema, é necessário configurar HTTPS no servidor/proxy e habilitar `COOKIE_SECURE=1`. Essa opção apenas restringe o envio do cookie a HTTPS; não instala certificado nem ativa HTTPS sozinha.

O arquivo SQLite também não é criptografado. Nomes, e-mails, turmas e resultados ficam legíveis a quem tiver acesso ao arquivo; as senhas permanecem como hashes. A chave de assinatura deve ficar privada e persistente.

## Recursos ainda ausentes

- Limitação de tentativas de login e de consulta aos códigos de turma, bloqueio temporário e medidas contra força bruta.
- Verificação de posse do e-mail, recuperação de senha por e-mail e autenticação em dois fatores.
- Revogação central de todas as sessões ao redefinir a senha. O logout limpa o cookie do navegador atual; uma cópia anterior de um cookie assinado não é invalidada centralmente.
- Política reforçada de senhas: o professor pode usar uma senha de seis caracteres, e o aluno utiliza exatamente seis com as categorias exigidas pelo projeto.
- Proteção antifraude completa para jogos/quizzes: os resultados ainda são produzidos pelo navegador.

O ranking global expõe dados de apresentação dos alunos para usuários autenticados. Essa regra foi preservada e deve ser considerada na política de privacidade da plataforma.

## Ajuste do cadastro do professor

O formulário passa a exigir nome completo, e-mail e senha. O campo de escola foi removido da interface e deixou de ser obrigatório na API. O campo `school` foi mantido opcional no modelo para compatibilidade com registros antigos. A validação de e-mail verifica formato e duplicação, sem restringir domínio institucional e sem confirmar a existência ou posse da caixa postal.
