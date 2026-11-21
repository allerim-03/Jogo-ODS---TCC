/* Cliente HTTP. O cache em memória serve somente à renderização desta página. */
(() => {
  let state = {
    current: null,
    classes: [],
    users: [],
    results: [],
    assignments: [],
    customQuizzes: [],
    ranking: [],
  };
  let csrf = "";
  const base = window.EcoConfig.apiBase;
  async function request(path, method = "GET", body) {
    let response;
    try {
      response = await fetch(base + path, {
        method,
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "X-CSRF-Token": csrf },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch {
      throw Error(
        "Não foi possível conectar ao servidor Python. Verifique se ele está em execução.",
      );
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok)
      throw Error(data.error || "Não foi possível concluir a operação.");
    return data;
  }
  async function refresh(notify = true) {
    state = await request("/state");
    csrf = state.csrf;
    if (notify) window.dispatchEvent(new Event("eco:update"));
  }
  // Escritas sequenciais evitam respostas antigas sobrescrevendo o estado atual.
  let queue = Promise.resolve();
  function mutate(path, method, body) {
    const operation = queue.then(async () => {
      const result = await request(path, method, body);
      await refresh();
      return result;
    });
    queue = operation.catch(() => {});
    return operation;
  }
  window.EcoAPI = {
    current: () => state.current,
    classes: () => state.classes,
    ranking: (classId) =>
      state.ranking.filter((u) => !classId || u.classId === classId),
    students: (classId) =>
      state.users.filter((u) => u.role === "aluno" && u.classId === classId),
    results: (userId) => state.results.filter((r) => r.userId === userId),
    myQuizzes: () => state.customQuizzes,
    assignments: () => state.assignments,
    assignment(id) {
      const a = state.assignments.find((a) => a.id === id);
      if (!a) throw Error("Esta tarefa não está disponível para sua turma.");
      return a;
    },
    taskProgress(id) {
      const a = this.assignment(id);
      return this.students(a.classId).map((u) => ({
        id: u.id,
        name: u.name,
        completed: this.taskDone(a, u.id),
      }));
    },
    taskDone(a, userId) {
      return a.activities.every((item) =>
        this.results(userId).some(
          (r) =>
            r.details.assignmentId === a.id &&
            this.isComplete(r) &&
            (item.kind === "game"
              ? r.game === item.resourceId
              : r.game === "quiz" &&
                (item.kind === "custom-quiz"
                  ? r.details.customQuizId === item.resourceId
                  : r.details.theme === item.resourceId)),
        ),
      );
    },
    isComplete: (r) =>
      !!r.completed &&
      (r.game !== "jogo2" || r.details.journeyComplete === true),
    completedGames(userId) {
      return new Set(
        this.results(userId)
          .filter((r) => r.game !== "quiz" && this.isComplete(r))
          .map((r) => r.game),
      ).size;
    },
    level: (xp) => ({
      level: Math.floor(xp / 1000) + 1,
      progress: xp % 1000,
      goal: 1000,
    }),
    journeyTitle: (xp) =>
      xp >= 4000
        ? "Guardião do Planeta"
        : xp >= 2000
          ? "Defensor da Natureza"
          : xp >= 1000
            ? "Explorador Sustentável"
            : "Semente do Saber",
    register: (data) => mutate("/auth/register", "POST", data),
    login: (identifier, password, role) =>
      mutate("/auth/login", "POST", { identifier, password, role }),
    logout: () => mutate("/auth/logout", "POST", {}),
    updateProfile: (data) => mutate("/users/me", "PATCH", data),
    editStudent: (id, data) =>
      mutate("/users/" + encodeURIComponent(id), "PATCH", data),
    createClass: (data) => mutate("/classes", "POST", data),
    rotateToken: async (id) =>
      (
        await mutate(
          "/classes/" + encodeURIComponent(id) + "/rotate-code",
          "POST",
          {},
        )
      ).token,
    joinClass: (code) => mutate("/classes/join", "POST", { code }),
    validateCode: (code) =>
      request("/classes/validate/" + encodeURIComponent(String(code).trim())),
    createQuiz: (data) => mutate("/quizzes", "POST", data),
    assignTask: (data) => mutate("/assignments", "POST", data),
    recordResult: async (data) => (await mutate("/results", "POST", data)).xp,
    markODS: (number) => mutate("/users/me/ods", "POST", { number }),
    refresh,
    showError(error) {
      let notice = document.getElementById("api-error");
      if (!notice) {
        notice = document.createElement("div");
        notice.id = "api-error";
        notice.setAttribute("role", "alert");
        notice.style.cssText =
          "position:fixed;bottom:16px;left:16px;right:16px;z-index:10000;background:#fff3f3;color:#8c2020;padding:18px;border:2px solid #8c2020;border-radius:12px";
        document.body.append(notice);
      }
      notice.textContent = error.message;
    },
  };
  EcoAPI.ready = refresh(false);
  EcoAPI.ready.catch((error) => {
    if (document.body) EcoAPI.showError(error);
    else
      document.addEventListener("DOMContentLoaded", () =>
        EcoAPI.showError(error),
      );
  });
})();
