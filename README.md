# Jogo-ODS---TCC
Site e minijogos do nosso TCC sobre ODS, sustentabilidade e ciclo da água
#backend day 01
#  API Flask + MySQL

Este projeto é uma API desenvolvida em **Flask** que se conecta ao banco de dados **MySQL** para realizar operações de cadastro e login de usuários.
---
# Dependências

Antes de rodar o projeto, instale as bibliotecas necessárias:

```bash
pip install flask mysql-connector-python flask-bcrypt flask-cors
 # Configuração do Banco de Dados
- Instale o MySQL Server 8.0 e o MySQL Workbench.
- Crie o banco de dados tcc:
CREATE DATABASE tcc;
-crie a tabela usuarios
USE tcc;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    senha VARCHAR(255) NOT NULL
);

#conexão com o banco
- no arquivo app.py
import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="senha123",
    database="tcc"
)

# rotas implementadas
1.Teste de conexão
- GET /
Retorna mensagem confirmando que a API está rodando.
2. Inserir usuário
- POST /add_usuario
Recebe JSON no formato:
{
  "nome": "Mirella",
  "senha": "1234"
}
resposta:
{
  "mensagem": "Usuário inserido com sucesso!"
}

3. Listar usuários
- GET /usuarios
Retorna todos os usuários cadastrados no banco.
# testes com o Postman
- Abra o Postman.
- Crie uma requisição POST para:
http://127.0.0.1:5000/add_usuario
- No Body → raw → JSON, insira:
{
  "nome": "Mirella",
  "senha": "1234"
}
- 
4. Clique em Send e verifique a resposta
### Próximos Passos
- Implementar criptografia de senha com Flask-Bcrypt.
- Criar rota de login para validar usuários.
- Documentar todas as rotas da API.
