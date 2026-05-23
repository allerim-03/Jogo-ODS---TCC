<template>
  <main>
    <section class="boas-vindas">
      <h2 class="titulo-branco">Bem-vindo!</h2>
      <p class="sub-branco">Venha aprender brincando</p>

      <div v-if="etapa === 'selecao'" class="login-box" style="text-align: center;">
        <div style="font-size: 50px; margin-bottom: 10px;">🌱</div>
        <h1 class="texto-azul negrito" style="margin-bottom: 20px;">Como deseja se cadastrar?</h1>
        
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <button type="button" @click="selecionarUso('pessoal')" class="btn-azul" style="padding: 18px;">
            🏠 Uso Pessoal <span style="display:block; font-size:0.8rem; font-weight:normal; opacity:0.9;">Conta comum para jogar e aprender</span>
          </button>
          
          <button type="button" @click="selecionarUso('institucional')" style="background-color: #2e7d32; padding: 18px;">
            🏫 Uso Institucional <span style="display:block; font-size:0.8rem; font-weight:normal; opacity:0.9;">Para Alunos e Professores (Escolas)</span>
          </button>
        </div>

        <p style="margin-top:25px; color:#555;">
          Já tem uma conta? <a href="#" @click.prevent="$emit('mudarTela', 'login')" class="texto-azul negrito">Faça login aqui</a>
        </p>
      </div>

      <div v-else-if="etapa === 'formulario'" class="login-box" :class="{ 'professor-box': perfilSelecionado === 'professor' }">
        
        <a href="#" @click.prevent="etapa = 'selecao'" :style="perfilSelecionado === 'professor' ? 'color: #4caf50;' : ''" class="texto-azul negrito" style="font-size: 0.9rem; text-decoration: none; margin-bottom: 15px; display: inline-block;">
          ← Voltar
        </a>

        <div style="font-size: 50px; text-align: center; margin-bottom: 10px;">
          {{ perfilSelecionado === 'pessoal' ? '👤' : (perfilSelecionado === 'aluno' ? '🐢' : '🎓') }}
        </div>

        <h1 class="negrito" :class="{ 'texto-azul': perfilSelecionado !== 'professor' }">
          Cadastro {{ perfilSelecionado === 'pessoal' ? 'Comum' : (perfilSelecionado === 'aluno' ? 'Aluno' : 'Professor') }}
        </h1>
        
        <div v-if="usoSelecionado === 'institucional'" class="seletor-perfil" style="display: flex; gap: 10px; margin: 20px 0;">
          <button type="button" @click="perfilSelecionado = 'aluno'" :style="perfilSelecionado === 'aluno' ? 'background: #3a7bd5; color: white;' : 'background: #e0e0e0; color: #555;'" style="flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
            🐢 Aluno
          </button>
          <button type="button" @click="perfilSelecionado = 'professor'" :style="perfilSelecionado === 'professor' ? 'background: #4caf50; color: white;' : 'background: #e0e0e0; color: #555;'" style="flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
            🎓 Professor
          </button>
        </div>

        <form @submit.prevent="enviarCadastro">
          <label :style="perfilSelecionado === 'professor' ? 'color: #ffffff;' : ''">
            {{ perfilSelecionado === 'aluno' ? 'Nome do Aluno (Nick)' : 'Nome Completo' }}
          </label>
          <input v-model="nome" type="text" :placeholder="perfilSelecionado === 'aluno' ? 'Escolha um apelido' : 'Digite seu nome'" required>

          <label :style="perfilSelecionado === 'professor' ? 'color: #ffffff;' : ''">Email</label>
          <input v-model="email" type="email" placeholder="Digite seu melhor email" required>

          <label :style="perfilSelecionado === 'professor' ? 'color: #ffffff;' : ''">Senha</label>
          <input v-model="senha" type="password" placeholder="Escolha sua senha" required>

          <label :style="perfilSelecionado === 'professor' ? 'color: #ffffff;' : ''">Repita a senha</label>
          <input v-model="confirmaSenha" type="password" placeholder="Confirme sua senha" required>
          
          <p v-if="mensagemErro" style="color: #ff3b3b; font-weight: bold; margin-top: 5px; margin-bottom: 15px; text-align: center; font-size: 0.9rem; background-color: rgba(255,59,59,0.1); padding: 8px; border-radius: 6px;">
            ⚠️ {{ mensagemErro }}
          </p>
          <p v-if="mensagemSucesso" style="color: #2e7d32; font-weight: bold; margin-top: 5px; margin-bottom: 15px; text-align: center; font-size: 0.9rem; background-color: rgba(46,125,50,0.1); padding: 8px; border-radius: 6px;">
            ✅ {{ mensagemSucesso }}
          </p>

          <button type="submit" :style="perfilSelecionado === 'professor' ? 'background-color: #4caf50; color: white;' : ''" :class="{ 'btn-azul': perfilSelecionado !== 'professor' }">
            {{ carregando ? 'Criando conta...' : 'Criar Conta' }}
          </button>
        </form>

        <p style="margin-top:20px; text-align: center;">
          <span :style="perfilSelecionado === 'professor' ? 'color: #e0e0e0;' : 'color: #555;'">Já tem uma conta? </span>
          <a href="#" @click.prevent="$emit('mudarTela', 'login')" :style="perfilSelecionado === 'professor' ? 'color: #4caf50;' : ''" class="texto-azul negrito">
            Faça login
          </a>
        </p>
      </div>

    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'

// Gerenciamento de Estados Locais (UI Control)
const etapa = ref('selecao') 
const usoSelecionado = ref('') 
const perfilSelecionado = ref('pessoal') 

// Captura de Dados do Formulário (Vínculo Bidirecional v-model)
const nome = ref('')
const email = ref('')
const senha = ref('')
const confirmaSenha = ref('')

// Estados de Feedback de Processamento
const carregando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')

const emit = defineEmits(['mudarTela'])

function selecionarUso(tipo) {
  usoSelecionado.value = tipo
  etapa.value = 'formulario'
  perfilSelecionado.value = tipo === 'pessoal' ? 'pessoal' : 'aluno'
  mensagemErro.value = ''
  mensagemSucesso.value = ''
}

// CONEXÃO ASSÍNCRONA COM A API DO BACKEND
async function enviarCadastro() {
  // Validação em nível de cliente para otimização de banda de rede
  if (senha.value !== confirmaSenha.value) {
    mensagemErro.value = 'As senhas não coincidem!'
    return
  }

  carregando.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  try {
    // TODO / ATENÇÃO PARA O GRUPO DE BANCO DE DADOS:
    // Se o mapeamento de tabelas no MySQL passar a exigir colunas obrigatórias adicionais 
    // (como 'idade' para o aluno ou 'instituicao' para o professor), lembre-se de adicionar 
    // os novos inputs na tela e injetar as propriedades correspondentes aqui dentro do JSON stringificado.
    const resposta = await fetch('http://localhost:5000/api/cadastro', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: nome.value,
        email: email.value,
        senha: senha.value,
        uso: usoSelecionado.value,
        perfil: perfilSelecionado.value
      })
    })

    const dados = await resposta.json()

    // Trata falhas de validação originadas pelas constraints do MySQL (ex: e-mail duplicado)
    if (!resposta.ok) {
      throw new Error(dados.message || 'Erro ao realizar cadastro.')
    }

    // Fluxo executado em caso de Sucesso (HTTP Status 201)
    mensagemSucesso.value = dados.message
    
    // Limpeza profilática do estado das variáveis por privacidade
    nome.value = ''
    email.value = ''
    senha.value = ''
    confirmaSenha.value = ''

    // Delay intencional para visualização do feedback de sucesso antes da transição
    setTimeout(() => {
      emit('mudarTela', 'login')
    }, 2000)

  } catch (erro) {
    mensagemErro.value = erro.message
  } finally {
    carregando.value = false
  }
}
</script>