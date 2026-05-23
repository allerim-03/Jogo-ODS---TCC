<template>
  <main>
    <section class="boas-vindas">
      <h2 class="titulo-branco">Bem-vindo!</h2>
      <p class="sub-branco">Venha aprender brincando</p>

      <div v-if="etapa === 'selecao'" class="login-box" style="text-align: center;">
        <div style="font-size: 50px; margin-bottom: 10px;">🌱</div>
        <h1 class="texto-azul negrito" style="margin-bottom: 20px;">Como deseja acessar?</h1>
        
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <button type="button" @click="selecionarUso('pessoal')" class="btn-azul" style="padding: 18px;">
            🏠 Uso Pessoal <span style="display:block; font-size:0.8rem; font-weight:normal; opacity:0.9;">Conta comum para jogar e aprender</span>
          </button>
          
          <button type="button" @click="selecionarUso('institucional')" style="background-color: #2e7d32; padding: 18px;">
            🏫 Uso Institucional <span style="display:block; font-size:0.8rem; font-weight:normal; opacity:0.9;">Para Alunos e Professores (Escolas)</span>
          </button>
        </div>

        <p style="margin-top:25px; color:#555;">
          Não tem uma conta? <a href="#" @click.prevent="$emit('mudarTela', 'cadastro')" class="texto-azul negrito">Cadastre-se aqui</a>
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
          Login {{ perfilSelecionado === 'pessoal' ? 'Comum' : (perfilSelecionado === 'aluno' ? 'Aluno' : 'Professor') }}
        </h1>
        
        <p v-if="perfilSelecionado === 'pessoal'">Entre para acessar seus jogos e conteúdos!</p>
        <p v-else-if="perfilSelecionado === 'aluno'">Faça login para continuar aprendendo na sua turma!</p>
        <p v-else>Área de monitoramento dos Professores.</p>

        <div v-if="usoSelecionado === 'institucional'" class="seletor-perfil" style="display: flex; gap: 10px; margin: 20px 0;">
          <button type="button" @click="perfilSelecionado = 'aluno'" :style="perfilSelecionado === 'aluno' ? 'background: #3a7bd5; color: white;' : 'background: #e0e0e0; color: #555;'" style="flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
            🐢 Aluno
          </button>
          <button type="button" @click="perfilSelecionado = 'professor'" :style="perfilSelecionado === 'professor' ? 'background: #4caf50; color: white;' : 'background: #e0e0e0; color: #555;'" style="flex: 1; padding: 10px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
            🎓 Professor
          </button>
        </div>

        <form @submit.prevent="enviarLogin">
          <label :style="perfilSelecionado === 'professor' ? 'color: #ffffff;' : ''">Email</label>
          <input v-model="email" type="email" placeholder="Digite seu email" required>
          
          <label :style="perfilSelecionado === 'professor' ? 'color: #ffffff;' : ''">Senha</label>
          <input v-model="senha" type="password" placeholder="Digite sua senha" required>
          
          <div style="text-align: right; margin-top: -5px; margin-bottom: 15px;">
            <a href="#" @click.prevent="etapa = 'recuperacao'" :style="perfilSelecionado === 'professor' ? 'color: #4caf50;' : ''" class="texto-azul" style="font-size: 0.85rem; text-decoration: none; font-weight: bold;">Esqueceu a senha?</a>
          </div>

          <p v-if="mensagemErro" style="color: #ff3b3b; font-weight: bold; margin-bottom: 10px; text-align: center; font-size: 0.9rem;">{{ mensagemErro }}</p>
          <p v-if="mensagemSucesso" style="color: #2e7d32; font-weight: bold; margin-bottom: 10px; text-align: center; font-size: 0.9rem;">{{ mensagemSucesso }}</p>

          <button type="submit" :style="perfilSelecionado === 'professor' ? 'background-color: #4caf50; color: white;' : ''" :class="{ 'btn-azul': perfilSelecionado !== 'professor' }">
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <p style="margin-top:20px; text-align: center;">
          <span :style="perfilSelecionado === 'professor' ? 'color: #e0e0e0;' : 'color: #555;'">Não tem uma conta? </span>
          <a href="#" @click.prevent="$emit('mudarTela', 'cadastro')" :style="perfilSelecionado === 'professor' ? 'color: #4caf50;' : ''" class="texto-azul negrito">
            Cadastre-se aqui
          </a>
        </p>
      </div>

      <div v-else-if="etapa === 'recuperacao'" class="login-box" :class="{ 'professor-box': perfilSelecionado === 'professor' }">
        <a href="#" @click.prevent="etapa = 'formulario'; emailRecuperacao = ''; enviouEmail = false;" :style="perfilSelecionado === 'professor' ? 'color: #4caf50;' : ''" class="texto-azul negrito" style="font-size: 0.9rem; text-decoration: none; margin-bottom: 15px; display: inline-block;">
          ← Voltar para o Login
        </a>

        <div style="font-size: 50px; text-align: center; margin-bottom: 10px;">🔑</div>
        <h1 class="negrito" :class="{ 'texto-azul': perfilSelecionado !== 'professor' }" style="margin-bottom: 10px; font-size: 1.6rem; text-align: center;">
          Recuperar Senha
        </h1>

        <div v-if="!enviouEmail">
          <p style="margin-bottom: 20px; font-size: 0.95rem; line-height: 1.4;" :style="perfilSelecionado === 'professor' ? 'color: #cbd5e1;' : 'color: #666;'">
            Digite o e-mail cadastrado na sua conta. Enviaremos um link com as instruções para criar uma nova senha.
          </p>
          
          <form @submit.prevent="dispararSimulacaoEmail">
            <label :style="perfilSelecionado === 'professor' ? 'color: #ffffff;' : ''">Seu Email</label>
            <input v-model="emailRecuperacao" type="email" placeholder="exemplo@email.com" required>
            
            <button type="submit" :style="perfilSelecionado === 'professor' ? 'background-color: #4caf50; color: white;' : ''" :class="{ 'btn-azul': perfilSelecionado !== 'professor' }">
              Enviar Instruções
            </button>
          </form>
        </div>

        <div v-else style="text-align: center; padding: 10px 0;">
          <div style="background-color: rgba(46, 125, 50, 0.1); color: #2e7d32; padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: left; font-size: 0.95rem;">
            ✨ <strong>Prontinho!</strong> Enviamos um e-mail para <span class="negrito">{{ emailMascarado }}</span> com os passos para você recuperar o seu acesso.
          </div>
          <p style="font-size: 0.9rem; opacity: 0.8; margin-bottom: 15px; color: #555;">Verifique sua caixa de entrada ou de spam.</p>
          
          <button type="button" @click="etapa = 'formulario'; emailRecuperacao = ''; enviouEmail = false;" :style="perfilSelecionado === 'professor' ? 'background-color: #4caf50; color: white;' : ''" :class="{ 'btn-azul': perfilSelecionado !== 'professor' }">
            Voltar ao Formulário
          </button>
        </div>
      </div>

      <div v-else-if="etapa === 'codigo_turma'" class="login-box">
        <div style="font-size: 50px; text-align: center; margin-bottom: 10px;">🎒</div>
        <h1 class="texto-azul negrito" style="text-align: center; font-size: 1.6rem; margin-bottom: 10px;">Entrar na Turma</h1>
        
        <div v-if="!turmaConectada">
          <p style="color: #555; font-size: 0.95rem; line-height: 1.5; margin-bottom: 20px; text-align: center;">
            Olá, <strong class="texto-azul">{{ nomeAluno }}</strong>! Peça para o seu professor o <strong>Código de Acesso</strong> de 6 dígitos da sua turma para liberar seus jogos.
          </p>

          <form @submit.prevent="validarCodigoTurma">
            <label>Código da Turma</label>
            <input v-model="codigoTurma" type="text" placeholder="Ex: ECO123" maxlength="6" style="text-align: center; font-size: 1.4rem; letter-spacing: 4px; text-transform: uppercase;" required>
            
            <p v-if="erroTurma" style="color: #ff3b3b; font-weight: bold; margin-bottom: 15px; text-align: center; font-size: 0.9rem;">
              ❌ {{ erroTurma }}
            </p>

            <button type="submit" class="btn-azul">
              Conectar à Turma
            </button>
          </form>
        </div>

        <div v-else style="text-align: center; padding: 10px 0;">
          <div style="font-size: 40px; margin-bottom: 10px;">🎉💥</div>
          <div style="background-color: rgba(46, 125, 50, 0.1); color: #2e7d32; padding: 15px; border-radius: 8px; margin-bottom: 20px; font-weight: bold;">
            Turma Conectada com Sucesso! 
            <span style="display: block; font-size: 0.9rem; font-weight: normal; margin-top: 5px; color: #444;">Preparando o seu painel de jogos...</span>
          </div>
          <div style="font-size: 25px; animation: spin 1s linear infinite;">🔄</div>
        </div>
      </div>

    </section>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'

const etapa = ref('selecao') 
const usoSelecionado = ref('') 
const perfilSelecionado = ref('pessoal') 

const email = ref('')
const senha = ref('')

const emailRecuperacao = ref('')
const enviouEmail = ref(false)

// Estados de Controle de Turmas
const codigoTurma = ref('')
const nomeAluno = ref('')
const turmaConectada = ref(false)
const erroTurma = ref('')

const carregando = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')

defineEmits(['mudarTela'])

function selecionarUso(tipo) {
  usoSelecionado.value = tipo
  etapa.value = 'formulario'
  perfilSelecionado.value = tipo === 'pessoal' ? 'pessoal' : 'aluno'
  mensagemErro.value = ''
  mensagemSucesso.value = ''
}

function dispararSimulacaoEmail() {
  if (emailRecuperacao.value) {
    enviouEmail.value = true
  }
}

const emailMascarado = computed(() => {
  const emailCompleto = emailRecuperacao.value
  if (!emailCompleto.includes('@')) return emailCompleto
  const [usuario, dominio] = emailCompleto.split('@')
  if (usuario.length <= 2) return `**@${dominio}`
  return `${usuario.substring(0, 2)}***@${dominio}`
})

// PROCESSAMENTO DE AUTENTICAÇÃO E CAPTURA DE SESSÃO
async function enviarLogin() {
  carregando.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''

  try {
    const resposta = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        senha: senha.value,
        perfil: perfilSelecionado.value
      })
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
      throw new Error(dados.message || 'Erro ao efetuar login.')
    }

    // PROTOCOLO DE SESSÃO JWT SEGURO:
    // O Token e os dados do usuário retornados abaixo vêm da validação do banco (SQLite/MySQL).
    // Para manter o estado conectado no TCC, salve-os no LocalStorage aqui, por exemplo:
    // localStorage.setItem('user_token', dados.token)
    mensagemSucesso.value = dados.message
    
    // CONTROLE DE FLUXO INTERMEDIÁRIO (TRAVA DE SEGURANÇA DO ALUNO)
    if (dados.user.role === 'aluno') {
      nomeAluno.value = dados.user.nome
      setTimeout(() => {
        etapa.value = 'codigo_turma' 
      }, 1000)
    } else {
      // TODO PARA O GRUPO: Substituir os console.logs abaixo pelos redirecionamentos reais de rota do VueRouter:
      // ex: router.push('/dashboard-professor')
      console.log('Login efetuado! Redirecionando perfil:', dados.user.role)
    }

  } catch (erro) {
    mensagemErro.value = erro.message
  } finally {
    carregando.value = false
  }
}

// TODO / UPGRADE FUTURO COM BANCO REAL (MYSQL):
// Atualmente esta função simula a entrada na turma apenas no cliente (Frontend).
// Quando a tabela de 'Turmas' e 'Matriculas' estiver pronta no MySQL, esta função 
// deve ser convertida em uma chamada assíncrona (fetch POST) enviando o 'codigoTurma'
// e os cabeçalhos de autorização com o Bearer Token do aluno para o Flask salvar a relação.
function validarCodigoTurma() {
  erroTurma.value = ''
  
  if (codigoTurma.value.length < 6) {
    erroTurma.value = 'O código deve conter exatamente 6 caracteres.'
    return
  }

  turmaConectada.value = true

  setTimeout(() => {
    console.log('Aluno vinculado à turma com sucesso! Redirecionando para a Home Logada...')
    // No futuro: emit('mudarTela', 'home_logada') ou router.push('/painel-jogos')
  }, 2500)
}
</script>

<style scoped>
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>