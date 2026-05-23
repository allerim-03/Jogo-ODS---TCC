import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import CadastroView from '../views/CadastroView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/cadastro', name: 'Cadastro', component: CadastroView },
  { path: '/dashboard', name: 'Dashboard', component: DashboardView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


import DashboardView from '../views/DashboardView.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/cadastro', component: CadastroView },
  { path: '/dashboard', component: DashboardView }
]

export default router
