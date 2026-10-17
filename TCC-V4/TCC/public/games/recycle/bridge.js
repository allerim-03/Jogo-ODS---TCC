// Comunicação direta com o site, que hospeda este jogo na mesma origem.
(() => {
  const db = window.parent !== window ? window.parent.EcoDB : null;
  let runId = null;
  window.EcoGame = {
    maxPhase: db?.current()?.gameProgress?.recyclePhase || 1,
    start() { runId = crypto.randomUUID(); },
    finish(points, phase, completed) {
      if (!runId || !db || db.current()?.role !== 'aluno') return;
      const status = window.parent.document.getElementById('game-score-status');
      try {
        const xp = db.recordResult({runId, game:'jogo2', points, completed, details:{phase, assignmentId:new URLSearchParams(window.parent.location?.search || '').get('assignment')}});
        if (status) status.textContent = `${xp} XP registrados no seu perfil. Total: ${db.current().xp} XP.`;
      } catch(e) {
        if (status) status.textContent = 'Não foi possível salvar: ' + e.message;
        return;
      }
      runId = null;
    }
  };
})();
