document.addEventListener("DOMContentLoaded", async () => {
  try {
    await EcoAPI.ready;
  } catch {
    return;
  }
  const page = document.body.dataset.page;
  const replace = (root) => {
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walk.nextNode()))
      if (!["SCRIPT", "STYLE"].includes(n.parentElement?.tagName))
        n.nodeValue = n.nodeValue
          .replace(/tokens/gi, "códigos de acesso")
          .replace(/\btoken\b/gi, "Código de acesso");
  };
  replace(document.body);
  const observer = new MutationObserver(() => {
    observer.disconnect();
    replace(document.body);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
  if (
    ["home.html", "ods.html", "sobrenos.html"].includes(page) &&
    !matchMedia("(prefers-reduced-motion: reduce)").matches &&
    "IntersectionObserver" in window
  ) {
    const io = new IntersectionObserver(
      (items) =>
        items.forEach((i) => {
          if (i.isIntersecting) {
            i.target.classList.add("revealed");
            io.unobserve(i.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll("main section,main .membro,main .ods-card")
      .forEach((el) => {
        el.classList.add("reveal");
        io.observe(el);
      });
  }
  window.showStudentPanel = (id, mode) => {
    const u = EcoAPI.classes()
      .flatMap((c) => EcoAPI.students(c.id))
      .find((u) => u.id === id);
    if (!u) return;
    document.getElementById("student-dialog")?.remove();
    const d = document.createElement("dialog");
    d.id = "student-dialog";
    d.className = "student-dialog";
    d.setAttribute("aria-labelledby", "student-dialog-title");
    const add = (tag, text) => {
      const el = document.createElement(tag);
      el.textContent = text;
      d.append(el);
      return el;
    };
    const close = add("button", "Fechar");
    close.className = "btn-outline";
    close.onclick = () => d.close();
    add("h2", u.name).id = "student-dialog-title";
    if (mode === "edit") {
      const form = document.createElement("form");
      form.className = "task-form";
      form.innerHTML =
        '<label for="student-name">Nome e sobrenome</label><input id="student-name" required><label for="student-pin">Nova senha / PIN (opcional)</label><input id="student-pin" type="password" minlength="6" maxlength="6" autocomplete="new-password"><p>6 caracteres: maiúscula, minúscula, número e símbolo. Deixe vazio para manter a senha.</p><button class="btn-principal">Salvar dados</button><p role="status"></p>';
      form.querySelector("#student-name").value = u.name;
      form.onsubmit = async (e) => {
        e.preventDefault();
        const button = form.querySelector("button");
        button.disabled = true;
        try {
          await EcoAPI.editStudent(id, {
            name: form.querySelector("#student-name").value,
            password: form.querySelector("#student-pin").value,
          });
          form.querySelector("[role=status]").textContent =
            "Dados atualizados.";
        } catch (e) {
          form.querySelector("[role=status]").textContent = e.message;
        } finally {
          button.disabled = false;
        }
      };
      d.append(form);
    } else {
      const results = EcoAPI.results(id),
        tasks = EcoAPI.assignments().filter((a) => a.classId === u.classId);
      add(
        "p",
        `Nível ${EcoAPI.level(u.xp).level} · ${EcoAPI.journeyTitle(u.xp)} · ${EcoAPI.completedGames(id)} jogos concluídos · ${tasks.filter((a) => EcoAPI.taskDone(a, id)).length}/${tasks.length} tarefas entregues.`,
      );
      add(
        "p",
        "Explorado indica leitura confirmada pelo aluno. Média = acertos / perguntas em quizzes concluídos. Leitura não comprova domínio do conteúdo.",
      );
      const table = document.createElement("table");
      table.innerHTML =
        "<thead><tr><th>Módulo</th><th>Material</th><th>Quizzes</th><th>Jogos</th></tr></thead><tbody></tbody>";
      for (let n = 1; n <= 17; n++) {
        const theme = { 6: "agua", 12: "reciclagem", 15: "terrestres" }[n],
          quiz = results.filter(
            (r) =>
              r.game === "quiz" &&
              r.completed &&
              (r.details.ods === n || (theme && r.details.theme === theme)),
          ),
          total = quiz.reduce((s, r) => s + (r.details.total || 0), 0),
          correct = quiz.reduce((s, r) => s + (r.details.correct || 0), 0),
          game = { 6: "jogo1", 12: "jogo2" }[n],
          done =
            game &&
            results.some((r) => r.game === game && EcoAPI.isComplete(r));
        const row = table.querySelector("tbody").insertRow();
        [
          "ODS " + n,
          (u.odsRead || []).includes(n) ? "Explorado" : "Não explorado",
          total
            ? Math.round((correct / total) * 100) + "%"
            : theme
              ? "Sem tentativas"
              : "Sem quiz vinculado",
          game ? (done ? "Concluído" : "Pendente") : "Sem jogo vinculado",
        ].forEach((t) => (row.insertCell().textContent = t));
      }
      d.append(table);
      if (mode === "report") {
        add("h3", "Tarefas atribuídas");
        tasks.forEach((a) =>
          add(
            "p",
            a.title +
              " — " +
              (EcoAPI.taskDone(a, id) ? "Entregue" : "Pendente"),
          ),
        );
        const quizzes = results.filter((r) => r.game === "quiz" && r.completed),
          total = quizzes.reduce((s, r) => s + (r.details.total || 0), 0),
          correct = quizzes.reduce((s, r) => s + (r.details.correct || 0), 0);
        add(
          "p",
          "Média geral dos quizzes: " +
            (total
              ? Math.round((correct / total) * 100) + "%"
              : "Sem tentativas") +
            ". " +
            quizzes.length +
            " tentativas concluídas.",
        );
      }
    }
    document.body.append(d);
    d.showModal();
  };
});
