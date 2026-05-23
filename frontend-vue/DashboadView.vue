<template>
  <div class="dashboard">
    <h1>Bem-vindo ao painel!</h1>
    <p>Você está logado com sucesso.</p>
    <button @click="logout">Sair</button>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.dashboard {
  text-align: center;
  margin-top: 50px;
}
</style>
