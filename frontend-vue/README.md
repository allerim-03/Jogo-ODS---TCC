# Sistema de Autenticação Segura & Mapeamento de Dados

Este repositório contém os módulos de **Login e Cadastro** do projeto, integrando uma interface reativa no Frontend (**Vue 3**) com um servidor de serviços robusto no Backend (**Flask**). 

O sistema foi reprojetado com foco em **segurança da informação**, controle de sessões persistentes e preparado estruturalmente para a migração para o banco de dados **MySQL**.

---

## Funcionalidades Implementadas

* **Fluxo Adaptativo (UX/UI):** Telas dinâmicas que alteram cores, placeholders e permissões dependendo do tipo de uso selecionado (*Pessoal* ou *Institucional*) e perfil (*Aluno* ou *Professor*).
* **Criptografia de Senhas (Hashing):** Assegura que nenhuma senha seja salva em texto plano no banco de dados, utilizando o algoritmo de hashing da biblioteca `Werkzeug`.
* **Sessões Protegidas com JWT:** Geração de Tokens de Acesso assinados digitalmente (`Flask-JWT-Extended`) para autenticação sem estado (*stateless*) entre o Vue e o Flask.
* **Trava Intermediária do Aluno:** Tela exclusiva no Frontend para inserção e validação do *Código da Turma* antes de liberar o acesso à Home do estudante.
* **Pronto para o GitHub:** Todos os arquivos críticos possuem marcações técnicas (`TODO`) documentando os pontos exatos para substituição do SQLite pelo MySQL.

---

## Estrutura dos Arquivos Atualizados

### Backend (Flask)
* **`config.py`**: Centraliza as chaves secretas do Flask/JWT e a string de conexão. Contém o alerta para alteração da `SQLALCHEMY_DATABASE_URI` para o conector MySQL (`mysql+pymysql`).
* **`app.py`**: Fábrica do aplicativo (*Application Factory*). Inicializa o ecossistema e executa o `db.create_all()`. (Nota: No MySQL, o Schema do banco precisa ser criado manualmente antes de rodar o app).
* **`models/user.py`**: Mapeamento ORM da tabela `users`. Configurado com tamanhos estritos de campos (`db.String(255)`) necessários para evitar erros de truncamento de Hash e strings no MySQL.
* **`routes/auth_routes.py`**: Concentra os endpoints da API (`/api/cadastro` e `/api/login`). Controla as transações de banco com blocos `try/except` e aciona o recuo seguro (`db.session.rollback()`) obrigatório para pools de conexão em produção.

### Frontend (Vue 3 - Composition API)
* **`CadastroView.vue`**: Captura dados em tempo real via `v-model` e realiza envio assíncrono (`fetch POST`) estruturado em formato JSON para a API.
* **`LoginView.vue`**: Valida credenciais com a API, intercepta o perfil `aluno` para carregar o componente do código da turma e simula o fluxo final de acesso.

---

## Guia de Transição para o MySQL (Notas de Implementação)

Para as desenvolvedoras responsáveis pela infraestrutura e banco de dados, o processo de migração exige apenas 3 passos baseando-se nos comentários deixados nos códigos:

1.  **Instalar o Conector no Ambiente Virtual (`venv`):**
    ```bash
    pip install pymysql
    ```
2.  **Criar o Banco de Dados (Schema) com Codificação Correta:**
    No terminal do MySQL ou Workbench, execute:
    ```sql
    CREATE DATABASE nome_do_banco CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```
3.  **Atualizar a String de Conexão no `config.py`:**
    Altere a linha do banco seguindo o padrão:
    ```python
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://usuario:senha@localhost/nome_do_banco"
    ```

    ---
    
---

## Padrão do Commit Realizado
> **`feat(auth): implementar autenticação segura e preparar migração do banco`**

* **Escopo Principal:** Unificação dos formulários de login e cadastro.
* **Segurança:** Inclusão dos pacotes de criptografia hash e gerenciamento por tokens JWT.
* **Escalabilidade:** Documentação in-code para acoplamento do banco MySQL sem quebras de regras de negócio.