/* Banco demonstrativo: dados neste navegador; não substitui um servidor real. */
(() => {
  const KEY = 'cultivando.db.v1', SESSION = 'cultivando.session.v1';
  const read = () => { const db = JSON.parse(localStorage.getItem(KEY) || '{}'); return {users:[], classes:[], results:[], customQuizzes:[], assignments:[], ...db}; };
  const write = db => { localStorage.setItem(KEY, JSON.stringify(db)); window.dispatchEvent(new Event('eco:update')); };
  const id = () => crypto.randomUUID();
  const requireUser = role => {
    const user = read().users.find(u => u.id === sessionStorage.getItem(SESSION));
    if (!user || (role && user.role !== role)) throw Error('Entre com o perfil correto para continuar.');
    return user;
  };
  const passwordHash = async (password, salt) => {
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(salt + ':' + password));
    return Array.from(new Uint8Array(bytes), n => n.toString(16).padStart(2, '0')).join('');
  };
  const clean = user => { const {hash, salt, ...publicUser} = user; return publicUser; };
  const newToken = (db, old) => {
    const used = new Set(db.classes.map(c => c.token));
    const available = Array.from({length:9000}, (_, i) => String(i + 1000)).filter(t => !used.has(t) && t !== old);
    if (!available.length) throw Error('Não há códigos disponíveis.');
    return available[Math.floor(Math.random() * available.length)];
  };
  window.EcoDB = {
    current() { try { return clean(requireUser()); } catch { return null; } },
    async register(data) {
      const name = (data.name || '').trim(), email = (data.email || '').trim().toLowerCase();
      if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('Preencha nome e e-mail válidos.');
      if (!['aluno','professor'].includes(data.role)) throw Error('Escolha um perfil válido.');
      if ((data.password || '').length < 6) throw Error('Use uma senha com pelo menos 6 caracteres.');
      if (data.password !== data.confirm) throw Error('As senhas não coincidem.');
      const salt = id(), hash = await passwordHash(data.password, salt), db = read();
      if (db.users.some(u => u.email === email)) throw Error('Este e-mail já está cadastrado.');
      const user = {id:id(), name, email, role:data.role, salt, hash, gender:data.gender || '', birth:data.birth || '', secondaryEmail:data.secondaryEmail || '', discipline:data.discipline || '', title:'Protetor da Natureza', avatar:'tuga', classId:null, xp:0, createdAt:new Date().toISOString(), gameProgress:{}};
      db.users.push(user); write(db); sessionStorage.setItem(SESSION, user.id); return clean(user);
    },
    async login(email, password, role) {
      const user = read().users.find(u => u.email === email.trim().toLowerCase() && u.role === role);
      if (!user || user.hash !== await passwordHash(password, user.salt)) throw Error('E-mail ou senha incorretos para este perfil.');
      sessionStorage.setItem(SESSION, user.id); return clean(user);
    },
    logout() { sessionStorage.removeItem(SESSION); },
    updateProfile(data) {
      const current = requireUser(), db = read(), user = db.users.find(u => u.id === current.id);
      const name = data.name.trim();
      if (!name) throw Error('Informe seu nome.');
      if (db.users.some(u => u.id !== user.id && u.name.toLowerCase() === name.toLowerCase())) throw Error('Este nome já está em uso.');
      const avatars = ['tuga','peixe','leao','macaco','arara','capivara'];
      Object.assign(user, {name, title:data.title || user.title, avatar:avatars.includes(data.avatar) ? data.avatar : user.avatar});
      if (user.role === 'professor') user.discipline = data.discipline || '';
      write(db); return clean(user);
    },
    createClass(data) {
      const user = requireUser('professor'), db = read();
      if (!data.name.trim() || !data.year || !data.period) throw Error('Preencha nome, ano e período da turma.');
      const classroom = {id:id(), teacherId:user.id, name:data.name.trim(), year:data.year, period:data.period, discipline:data.discipline.trim(), description:data.description.trim(), token:newToken(db), createdAt:new Date().toISOString()};
      db.classes.push(classroom); write(db); return classroom;
    },
    classes() { const user = requireUser(); return read().classes.filter(c => user.role === 'professor' ? c.teacherId === user.id : c.id === user.classId); },
    rotateToken(classId) {
      const user = requireUser('professor'), db = read(), c = db.classes.find(c => c.id === classId && c.teacherId === user.id);
      if (!c) throw Error('Selecione uma turma sua.');
      c.token = newToken(db, c.token); write(db); return c.token;
    },
    joinClass(token) {
      const current = requireUser('aluno'), db = read(), c = db.classes.find(c => c.token === token.trim());
      if (!/^\d{4}$/.test(token.trim()) || !c) throw Error('Código inválido. Peça o token atual ao gestor da turma.');
      const user = db.users.find(u => u.id === current.id); user.classId = c.id; write(db); return c;
    },
    ranking(classId) { return read().users.filter(u => u.role === 'aluno' && u.classId && (!classId || u.classId === classId)).map(clean).sort((a,b) => b.xp - a.xp || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)); },
    students(classId) {
      if (!this.classes().some(c => c.id === classId)) throw Error('Turma não encontrada.');
      requireUser('professor'); return this.ranking(classId);
    },
    results(userId) {
      const user = requireUser();
      if (userId !== user.id && !this.classes().some(c => this.ranking(c.id).some(u => u.id === userId))) throw Error('Perfil não disponível.');
      return read().results.filter(r => r.userId === userId);
    },
    createQuiz({title, questions}) {
      const user = requireUser('professor'), db = read();
      title = String(title || '').trim();
      if (!title || title.length > 120) throw Error('Informe um título de até 120 caracteres.');
      if (!Array.isArray(questions) || questions.length < 1 || questions.length > 20) throw Error('Inclua de 1 a 20 perguntas.');
      const cleaned = questions.map(q => {
        const prompt = String(q.q || '').trim();
        if (!prompt || prompt.length > 1000 || !Array.isArray(q.options) || q.options.length !== 4) throw Error('Cada pergunta precisa de um enunciado e quatro alternativas.');
        const options = q.options.map(o => String(o).trim());
        if (options.some(o => !o || o.length > 300) || new Set(options.map(o=>o.toLowerCase())).size !== 4) throw Error('Preencha quatro alternativas diferentes, com até 300 caracteres cada.');
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) throw Error('Marque a alternativa correta em cada pergunta.');
        return {q:prompt, options, answer:q.answer};
      });
      const quiz = {id:id(), teacherId:user.id, title, questions:cleaned, createdAt:new Date().toISOString()};
      db.customQuizzes.push(quiz); write(db); return quiz;
    },
    myQuizzes() { const user = requireUser('professor'); return read().customQuizzes.filter(q => q.teacherId === user.id); },
    assignTask({classId, title, instructions = '', kind, resourceId}) {
      const user = requireUser('professor'), db = read();
      if (!db.classes.some(c => c.id === classId && c.teacherId === user.id)) throw Error('Selecione uma turma sua.');
      title = String(title || '').trim(); instructions = String(instructions).trim();
      if (!title || title.length > 120 || instructions.length > 2000) throw Error('Preencha um título de até 120 caracteres e orientações de até 2.000.');
      let quiz = null;
      if (kind === 'custom-quiz') {
        quiz = db.customQuizzes.find(q => q.id === resourceId && q.teacherId === user.id);
        if (!quiz) throw Error('Selecione um dos seus quizzes autorais.');
        quiz = JSON.parse(JSON.stringify(quiz));
      } else if (kind === 'quiz') {
        if (!['agua','terrestres','reciclagem'].includes(resourceId)) throw Error('Quiz inválido.');
      } else if (kind === 'game') {
        if (!['jogo1','jogo2'].includes(resourceId)) throw Error('Jogo inválido.');
      } else throw Error('Escolha uma atividade válida.');
      const assignment = {id:id(), teacherId:user.id, classId, title, instructions, kind, resourceId, quiz, createdAt:new Date().toISOString()};
      db.assignments.push(assignment); write(db); return assignment;
    },
    assignments() {
      const user = requireUser(), db = read();
      return db.assignments.filter(a => user.role === 'professor' ? a.teacherId === user.id : a.classId === user.classId).map(a => ({...a, completed:user.role === 'aluno' && db.results.some(r => r.userId === user.id && r.completed && r.details.assignmentId === a.id)}));
    },
    assignment(assignmentId) {
      const assignment = this.assignments().find(a => a.id === assignmentId);
      if (!assignment) throw Error('Esta tarefa não está disponível para sua turma.');
      return assignment;
    },
    taskProgress(assignmentId) {
      const user = requireUser('professor'), assignment = this.assignment(assignmentId), db = read();
      return db.users.filter(u => u.role === 'aluno' && u.classId === assignment.classId).map(u => ({id:u.id, name:u.name, completed:db.results.some(r => r.userId === u.id && r.completed && r.details.assignmentId === assignmentId)}));
    },
    recordResult({runId, game, points, completed = true, details = {}}) {
      const current = requireUser('aluno');
      if (!current.classId) throw Error('Entre em uma turma para registrar pontuação.');
      if (!runId || !['quiz','jogo1','jogo2'].includes(game) || !Number.isFinite(points) || points < 0) throw Error('Resultado inválido.');
      const db = read();
      if (details.assignmentId) {
        const a = this.assignment(details.assignmentId);
        const expected = a.kind === 'game' ? a.resourceId : 'quiz';
        if (game !== expected || (a.kind === 'quiz' && details.theme !== a.resourceId) || (a.kind === 'custom-quiz' && details.customQuizId !== a.resourceId)) throw Error('O resultado não corresponde à atividade atribuída.');
      }
      if (db.results.some(r => r.runId === runId && r.userId === current.id)) return 0;
      const user = db.users.find(u => u.id === current.id), xp = Math.floor(points);
      db.results.push({id:id(), runId, userId:user.id, classId:user.classId, game, points:xp, completed, details, createdAt:new Date().toISOString()});
      user.xp += xp;
      if (game === 'jogo2' && completed && details.phase < 5) user.gameProgress.recyclePhase = Math.max(user.gameProgress.recyclePhase || 1, details.phase + 1);
      write(db); return xp;
    },
    level(xp) { return {level:Math.floor(xp / 1000) + 1, progress:xp % 1000, goal:1000}; }
  };
})();
