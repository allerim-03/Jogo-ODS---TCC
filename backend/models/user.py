from app import db # Importa a instância do banco de dados inicializada no app.py 

class User(db.Model):
    # Define explicitamente o nome da tabela que será gerada no banco de dados
    __tablename__ = "users" 

    # ==========================================================================
    # DECLARAÇÃO DE COLUNAS (PONTOS DE ATENÇÃO PARA MYSQL)
    # ==========================================================================
    
    # Chave Primária: No MySQL, o SQLAlchemy mapeia db.Integer + primary_key=True 
    # automaticamente como um campo do tipo 'INT AUTO_INCREMENT'.
    id = db.Column(db.Integer, primary_key=True) 
    
    # No MySQL, definir o tamanho (ex: 120) gera colunas do tipo VARCHAR(120).
    # NOTA DE COMPATIBILIDADE: Garanta que o banco de dados MySQL utilize a colation 
    # 'utf8mb4' para aceitar acentos e emojis nos nomes sem quebrar a aplicação.
    nome = db.Column(db.String(120), nullable=False) 
    
    # Campo Único: O MySQL cria um índice de unicidade (UNIQUE INDEX) para este campo.
    # Se o grupo tentar cadastrar um email duplicado, o MySQL lançará um erro do tipo 'IntegrityError'.
    email = db.Column(db.String(120), unique=True, nullable=False) 
    
    # Campo de Senha Criptografada: Mantido obrigatoriamente com o tamanho de 255.
    # CRÍTICO PARA MYSQL: Os algoritmos de hash do Werkzeug (como PBKDF2 ou bcrypt) geram strings longas.
    # Se este campo fosse menor (como VARCHAR(50)), o MySQL cortaria a string (Trunaction Error)
    # e tornaria impossível descriptografar a senha na hora do login.
    senha = db.Column(db.String(255), nullable=False) 
    
    # Armazena os perfis fixos do sistema: 'pessoal', 'aluno' ou 'professor'
    role = db.Column(db.String(20), nullable=False) 
    
    # ==========================================================================
    # CAMPOS OPCIONAIS (ADAPTATIVOS)
    # ==========================================================================
    # nullable=True é suportado nativamente pelo MySQL criando colunas com permissão 'NULL'
    idade = db.Column(db.Integer, nullable=True)             # Atributo exclusivo para Alunos 
    instituicao = db.Column(db.String(120), nullable=True)   # Atributo exclusivo para Professores 

    # ==========================================================================
    # MÉTODO AUXILIAR DE SERIALIZAÇÃO
    # ==========================================================================
    def to_dict(self):
        """
        Função utilitária para transformar os dados do objeto em um dicionário Python.
        Isso é crucial para que a rota de Login possa converter os dados em formato JSON 
        e enviá-los de forma limpa e compreensível para o Frontend (Vue).
        """
        return {
            "id": self.id,
            "nome": self.nome,
            "email": self.email,
            "role": self.role,
            "instituicao": self.instituicao
            # Nota: Por motivos rígidos de segurança, a hash da senha NUNCA deve ser incluída aqui.
        }