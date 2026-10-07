/* ФитПульс — логика интерфейса.
   Данные хранятся в localStorage браузера и при первом запуске
   заполняются тестовым набором из js/data.js. */
(function () {
  "use strict";
  const KEY = "fitpulse-db";
  const PAYMENTS = { card: "Картой", cash: "Наличными", transfer: "Переводом" };
  const PER_PAGE = 5;

  // ---------- хранилище ----------
  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (saved && saved.users) return saved;
    } catch (e) { /* повреждённые данные — берём тестовые */ }
    return JSON.parse(JSON.stringify(window.TEST_DATA));
  }
  const db = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch (e) {} }
  const session = {
    get: () => { try { return JSON.parse(sessionStorage.getItem("fitpulse-user")); } catch (e) { return null; } },
    set: (u) => sessionStorage.setItem("fitpulse-user", JSON.stringify({ id: u.id, role: u.role, name: u.full_name })),
    clear: () => sessionStorage.removeItem("fitpulse-user"),
  };
  const byId = (list, id) => list.find((x) => x.id === Number(id));
  const nextId = (list) => Math.max(0, ...list.map((x) => x.id)) + 1;
  const ruDate = (iso) => iso.split("-").reverse().join(".");
  const $ = (sel) => document.querySelector(sel);

  // ---------- уведомления ----------
  function toast(text, type) {
    const el = document.createElement("div");
    el.className = "toast" + (type === "error" ? " toast--error" : "");
    el.textContent = text;
    $("#toasts").appendChild(el);
    setTimeout(() => { el.classList.add("hide"); setTimeout(() => el.remove(), 300); }, 3200);
  }
  function flashLater(text) { sessionStorage.setItem("fitpulse-flash", text); }
  const pending = sessionStorage.getItem("fitpulse-flash");
  if (pending) { sessionStorage.removeItem("fitpulse-flash"); setTimeout(() => toast(pending), 100); }

  // ---------- навигация ----------
  const user = session.get();
  const nav = $("#nav");
  if (user) {
    nav.innerHTML = (user.role === "admin" ? '<a href="admin.html">Заявки</a>' : '<a href="cabinet.html">Мои заявки</a>') +
      '<a href="#" class="btn btn--sm btn--ghost" id="logout">Выйти</a>';
    $("#logout").addEventListener("click", (e) => { e.preventDefault(); session.clear(); flashLater("Вы вышли из системы"); location.href = "index.html"; });
  } else {
    nav.innerHTML = '<a href="login.html">Вход</a><a href="register.html" class="btn btn--sm">Регистрация</a>';
  }
  const page = document.body.dataset.page;
  function guard(role) {
    if (!user) { flashLater("Войдите в систему"); location.href = "login.html"; return false; }
    if (role && user.role !== role) { location.href = "index.html"; return false; }
    return true;
  }

  // ---------- валидация ----------
  const RULES = {
    login: [/^[A-Za-z0-9_]{4,30}$/, "Логин: 4–30 символов, латиница, цифры, _"],
    password: [/^.{6,}$/, "Пароль — не менее 6 символов"],
    full_name: [/^[А-Яа-яЁё\- ]{5,150}$/, "ФИО — только кириллица, пробелы и дефис"],
    phone: [/^8\(\d{3}\)\d{3}-\d{2}-\d{2}$/, "Телефон в формате 8(XXX)XXX-XX-XX"],
    email: [/^[^@\s]+@[^@\s]+\.[^@\s]+$/, "Некорректный email"],
  };
  function setError(input, msg) {
    const f = input.closest(".field");
    f.classList.toggle("has-error", !!msg);
    f.classList.toggle("is-valid", !msg && input.value !== "");
    f.querySelector(".field__error").textContent = msg || "";
    return !msg;
  }
  function validate(input, strict) {
    const v = input.value.trim();
    if (!v) return setError(input, "Поле обязательно для заполнения");
    const rule = RULES[input.name];
    if (strict && rule && !rule[0].test(v)) return setError(input, rule[1]);
    if (strict && input.name === "login" && db.users.some((u) => u.login === v)) return setError(input, "Такой логин уже занят");
    if (strict && input.name === "email" && db.users.some((u) => u.email === v)) return setError(input, "Этот email уже зарегистрирован");
    return setError(input, "");
  }

  // ---------- страницы ----------
  if (page === "index") {
    if (user) $("#heroCta").href = user.role === "admin" ? "admin.html" : "cabinet.html";
    $("#trainings").innerHTML = db.trainings.map((t, i) =>
      `<article class="card" style="animation-delay:${i * 60}ms"><h3>${t.title}</h3><p class="muted">Тренер: ${t.coach}</p>
       <div class="card__meta"><span class="badge">${t.duration} мин</span><strong>${t.price} ₽</strong></div></article>`).join("");
  }

  if (page === "register") {
    const form = $("#registerForm");
    const inputs = [...form.querySelectorAll("input")];
    inputs.forEach((i) => i.addEventListener("blur", () => validate(i, true)));
    // маска телефона
    $("#phone").addEventListener("input", (e) => {
      const d = e.target.value.replace(/\D/g, "").replace(/^7/, "8").slice(0, 11);
      let v = d ? "8" : "";
      if (d.length > 1) v += "(" + d.slice(1, 4);
      if (d.length >= 4) v += ")" + d.slice(4, 7);
      if (d.length >= 7) v += "-" + d.slice(7, 9);
      if (d.length >= 9) v += "-" + d.slice(9, 11);
      e.target.value = v;
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!inputs.map((i) => validate(i, true)).every(Boolean)) { toast("Проверьте правильность заполнения формы", "error"); return; }
      const data = Object.fromEntries(new FormData(form));
      db.users.push({ id: nextId(db.users), login: data.login.trim(), password: data.password, full_name: data.full_name.trim(),
                      phone: data.phone, email: data.email.trim(), role: "user" });
      save();
      flashLater("Регистрация прошла успешно. Войдите в систему");
      location.href = "login.html";
    });
  }

  if (page === "login") {
    const form = $("#loginForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const ok = [...form.querySelectorAll("input")].map((i) => validate(i, false)).every(Boolean);
      if (!ok) return;
      const u = db.users.find((x) => x.login === form.login.value.trim() && x.password === form.password.value);
      if (!u) { $("#loginError").hidden = false; return; }
      session.set(u);
      flashLater(`Добро пожаловать, ${u.full_name}!`);
      location.href = u.role === "admin" ? "admin.html" : "cabinet.html";
    });
  }

  if (page === "cabinet" && guard()) {
    const select = $("#training");
    select.insertAdjacentHTML("beforeend", db.trainings.map((t) => `<option value="${t.id}">${t.title} — ${t.price} ₽</option>`).join(""));
    const today = new Date().toISOString().slice(0, 10);
    $("#date").min = today;
    function render() {
      const mine = db.requests.filter((r) => r.user_id === user.id).sort((a, b) => b.id - a.id);
      $("#myRequests").innerHTML = mine.length ? mine.map((r) => {
        const t = byId(db.trainings, r.training_id), s = byId(db.statuses, r.status_id);
        return `<li class="list__item"><div><strong>${t.title}</strong><div class="muted">${ruDate(r.date)}, ${r.time} · ${PAYMENTS[r.payment]}</div></div>
                <span class="status status--${s.id}">${s.name}</span></li>`;
      }).join("") : '<li class="empty">Заявок пока нет — оформите первую.</li>';
    }
    $("#requestForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const okT = setError(f.training, f.training.value ? "" : "Выберите тренировку");
      const okD = setError(f.date, !f.date.value ? "Укажите дату" : f.date.value < today ? "Дата не может быть в прошлом" : "");
      if (!okT || !okD) return;
      db.requests.push({ id: nextId(db.requests), user_id: user.id, training_id: Number(f.training.value), date: f.date.value,
                         time: f.time.value, payment: f.payment.value, status_id: 1, comment: f.comment.value.trim() });
      save(); f.reset(); render();
      toast("Заявка отправлена");
    });
    render();
  }

  if (page === "admin" && guard("admin")) {
    let current = 1;
    $("#statusFilter").insertAdjacentHTML("beforeend", db.statuses.map((s) => `<option value="${s.id}">${s.name}</option>`).join(""));
    function rows() {
      const q = $("#search").value.trim().toLowerCase(), st = $("#statusFilter").value;
      return db.requests.filter((r) => {
        const u = byId(db.users, r.user_id), t = byId(db.trainings, r.training_id);
        return (!st || r.status_id === Number(st)) && (!q || u.full_name.toLowerCase().includes(q) || t.title.toLowerCase().includes(q));
      }).sort((a, b) => b.id - a.id);
    }
    function render() {
      const list = rows(), pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
      current = Math.min(current, pages);
      $("#total").textContent = `(${list.length})`;
      $("#stats").innerHTML = db.statuses.map((s) => `<div class="stat"><span class="muted">${s.name}</span><b>${db.requests.filter((r) => r.status_id === s.id).length}</b></div>`).join("");
      $("#adminRows").innerHTML = list.slice((current - 1) * PER_PAGE, current * PER_PAGE).map((r) => {
        const u = byId(db.users, r.user_id), t = byId(db.trainings, r.training_id);
        const opts = db.statuses.map((s) => `<option value="${s.id}"${s.id === r.status_id ? " selected" : ""}>${s.name}</option>`).join("");
        return `<tr><td data-label="№">${r.id}</td><td data-label="Клиент">${u.full_name}</td><td data-label="Тренировка">${t.title}</td>
                <td data-label="Дата и время">${ruDate(r.date)}, ${r.time}</td><td data-label="Оплата">${PAYMENTS[r.payment]}</td>
                <td data-label="Статус"><select data-id="${r.id}" aria-label="Статус заявки ${r.id}">${opts}</select></td></tr>`;
      }).join("") || '<tr><td colspan="6" class="empty">Заявки не найдены</td></tr>';
      $("#pagination").innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) =>
        `<button type="button" class="${i + 1 === current ? "is-current" : ""}" data-page="${i + 1}">${i + 1}</button>`).join("") : "";
    }
    $("#adminRows").addEventListener("change", (e) => {
      const r = byId(db.requests, e.target.dataset.id);
      r.status_id = Number(e.target.value); save(); render();
      toast(`Статус заявки №${r.id} обновлён`);
    });
    $("#pagination").addEventListener("click", (e) => { if (e.target.dataset.page) { current = Number(e.target.dataset.page); render(); } });
    $("#search").addEventListener("input", () => { current = 1; render(); });
    $("#statusFilter").addEventListener("change", () => { current = 1; render(); });
    $("#filters").addEventListener("submit", (e) => e.preventDefault());
    render();
  }
})();
