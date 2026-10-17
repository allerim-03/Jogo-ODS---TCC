# Cultivando o Saber · versão 4

Interface mais lúdica, inspirada na organização da referência enviada: menu lateral verde, conteúdo branco arredondado, cartões vivos e conquistas à direita. Rotas organizadas e banco demonstrativo em JavaScript.

## Executar

1. Extraia o ZIP completo e entre na pasta `Cultivando-o-Saber`.
2. Abra o terminal nessa pasta.
3. Com Node.js 18 ou superior instalado, execute `npm start`.
4. Abra **http://localhost:3000**.

Não precisa executar `npm install`. Deixe o terminal aberto enquanto estiver usando o site. Para encerrar, pressione Ctrl+C.

Esta versão usa rotas como `/jogos` e `/turmas`. Inicie pelo servidor fornecido; abrir arquivos HTML por duplo clique ou por um servidor que não conheça essas rotas não executa a plataforma corretamente.

## Ajustes desta versão

- O bloco de crescimento aparece apenas para o aluno; no perfil, o XP fica junto à foto.
- A tela inicial do aluno mostra uma única saudação, sem a barra de XP no topo.
- O perfil mostra conquistas, sem histórico de pontuação ou total de XP acumulado.
- No ranking do aluno, os botões Global e Minha turma alternam a visualização. O professor mantém o seletor de turmas.
- O professor tem a página **Atribuir tarefas** e pode criar quizzes autorais.
- O aluno recebe as atividades em **Minhas tarefas**.

## Atribuir atividades e criar quizzes

1. Entre como professor e abra **Atribuir tarefas** no menu lateral.
2. Escolha a turma, selecione um quiz ou jogo e preencha o título e as orientações.
3. Clique em **Atribuir à turma**. Todos os alunos matriculados naquela turma verão a atividade.
4. Para perguntas próprias, abra **Criar um quiz com minhas perguntas**. Escreva um título, de 1 a 20 perguntas e quatro alternativas por pergunta. Marque uma resposta correta em cada uma.
5. Salve o quiz. Ele fica disponível em **Meus quizzes autorais** e no seletor de atividades. Escolha a turma e atribua.
6. O aluno abre **Minhas tarefas** e clica em **Começar tarefa**. Quizzes autorais usam o mesmo player e valem 100 XP por acerto.
7. Ao responder todas as perguntas, concluir dez torneiras no JOGO 1 ou vencer uma fase do JOGO 2, a tarefa aparece como concluída. Uma derrota no JOGO 2 registra a pontuação da tentativa, mas mantém a tarefa pendente.
8. O professor acompanha a quantidade de conclusões e o status de cada aluno em **Tarefas atribuídas → Ver alunos**.

A conclusão vale para uma atividade aberta pela página de tarefas. Atividades livres não concluem automaticamente uma tarefa atribuída. Repetir uma tarefa mantém a conclusão e registra uma nova rodada de XP. As perguntas autorais são copiadas para a tarefa no momento da atribuição.

Os dados antigos são preservados; a estrutura de tarefas é acrescentada automaticamente. O banco continua local: professores e alunos precisam usar o mesmo navegador e endereço para compartilhar os dados da demonstração.

## Visual da plataforma

- Menu lateral verde no computador e menu recolhível no celular.
- Painel do aluno com atividades à esquerda e conquistas à direita.
- Cartões azuis, amarelos, lavanda e coral, com mascotes e botões arredondados.
- XP e conquistas conectados aos resultados do aluno, sem números fictícios.
- Página pública, formulários, perfis e ranking com cores mais vivas.
- O conteúdo e as funcionalidades continuam os da plataforma; a imagem fornecida serviu como referência de composição.

## Navegação e organização

- A página inicial `/` é pública e pode ser vista sem login. `/index.html` e `/home.html` também levam a ela.
- O aluno entra em `/app`; o gestor entra em `/turmas`.
- O aluno sem matrícula é encaminhado a `/turma/entrar` depois do cadastro e do login.
- ODS e Sobre o projeto são públicos. A marca no cabeçalho sempre volta à página pública.
- Cabeçalho comum, navegação adaptada ao perfil, menu para celular e logout acessível.
- Página pública, jornada do aluno e seleção de jogos redesenhadas.
- Formulários, cartões, ranking, perfis, tabelas e botões com estilos consistentes.
- Paleta verde, azul, amarelo e vermelho mantida; tons de apoio melhoram o contraste e a hierarquia.
- HTML, estilos, imagens, lógica, jogos, testes e documentação separados por função.

## Testar as funções

Cadastre um gestor, crie uma turma e copie o token. Saia da conta, cadastre um aluno e insira o token. Jogue ou responda um quiz; depois consulte o perfil e o ranking. O gestor poderá ver a pontuação na tabela de sua turma.

Os dados ficam no mesmo navegador e endereço/porta. Usar `http://localhost:3000` permite reutilizar os dados da versão anterior, se ela também foi executada nesse endereço. `localhost` e `127.0.0.1` possuem armazenamentos distintos.

A pontuação segue as regras anteriores: 100 XP por acerto no quiz, 100 XP por torneira fechada no JOGO 1 e 1 XP por moeda ao finalizar uma fase ou tentativa no JOGO 2. Cada 1.000 XP aumenta um nível.

## Verificações

Execute `npm test` para verificar cadastro, login, permissões simuladas, tokens, turmas, perfil, ranking, pontuação, regras do ReciclaCoop, rotas e arquivos estáticos.

Os testes automatizados de dados, motor do jogo e servidor foram executados. A revisão visual em navegador não pôde ser executada no ambiente de desenvolvimento desta entrega; confira a apresentação no seu navegador, principalmente em dispositivos móveis.

## Sobre o banco demonstrativo

O banco está em `public/assets/js/services/mock-db.js`. As informações são mantidas no `localStorage`; a sessão fica no `sessionStorage`. Não há sincronização entre computadores e o login é apenas demonstrativo. Use dados fictícios.

Veja `docs/ARQUITETURA.md` para entender a organização e `docs/ROTAS.md` para consultar os endereços.
