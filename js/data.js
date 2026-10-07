/* Тестовый набор данных ИС «ФитПульс» (совпадает с database/test_data.sql) */
window.TEST_DATA = {
  statuses: [
    { id: 1, name: "Новая" },
    { id: 2, name: "Подтверждена" },
    { id: 3, name: "Посещено" },
    { id: 4, name: "Отменена" }
  ],
  trainings: [
    { id: 1, title: "Йога для начинающих", coach: "Анна Белова", duration: 60, price: 600 },
    { id: 2, title: "Функциональный тренинг", coach: "Игорь Ким", duration: 45, price: 700 },
    { id: 3, title: "Пилатес", coach: "Мария Орлова", duration: 55, price: 650 },
    { id: 4, title: "Бокс", coach: "Тимур Алиев", duration: 60, price: 800 },
    { id: 5, title: "Стретчинг", coach: "Анна Белова", duration: 50, price: 550 }
  ],
  users: [
    { id: 1, login: "admin", password: "FitPulse2026", full_name: "Администратор ФитПульс", phone: "8(900)000-00-00", email: "admin@fitpulse.local", role: "admin" },
    { id: 2, login: "ivanova", password: "pass123", full_name: "Иванова Мария Сергеевна", phone: "8(912)345-67-01", email: "ivanova@mail.ru", role: "user" },
    { id: 3, login: "petrov", password: "pass123", full_name: "Петров Алексей Игоревич", phone: "8(903)111-22-33", email: "petrov@mail.ru", role: "user" },
    { id: 4, login: "smirnova", password: "pass123", full_name: "Смирнова Ольга Викторовна", phone: "8(905)222-33-44", email: "smirnova@mail.ru", role: "user" },
    { id: 5, login: "kuznetsov", password: "pass123", full_name: "Кузнецов Дмитрий Андреевич", phone: "8(916)333-44-55", email: "kuznetsov@mail.ru", role: "user" },
    { id: 6, login: "sokolova", password: "pass123", full_name: "Соколова Анна Павловна", phone: "8(917)444-55-66", email: "sokolova@mail.ru", role: "user" },
    { id: 7, login: "popov", password: "pass123", full_name: "Попов Никита Олегович", phone: "8(925)555-66-77", email: "popov@mail.ru", role: "user" }
  ],
  requests: [
    { id: 1, user_id: 2, training_id: 1, date: "2026-10-12", time: "09:00", payment: "card", status_id: 2, comment: "" },
    { id: 2, user_id: 3, training_id: 4, date: "2026-10-12", time: "19:00", payment: "cash", status_id: 1, comment: "Нужны перчатки напрокат" },
    { id: 3, user_id: 4, training_id: 3, date: "2026-10-08", time: "10:00", payment: "card", status_id: 3, comment: "" },
    { id: 4, user_id: 5, training_id: 2, date: "2026-10-13", time: "18:00", payment: "transfer", status_id: 1, comment: "" },
    { id: 5, user_id: 6, training_id: 5, date: "2026-10-14", time: "20:00", payment: "card", status_id: 2, comment: "Первое занятие" },
    { id: 6, user_id: 7, training_id: 4, date: "2026-10-09", time: "19:00", payment: "cash", status_id: 4, comment: "" },
    { id: 7, user_id: 2, training_id: 5, date: "2026-10-15", time: "20:00", payment: "card", status_id: 1, comment: "" },
    { id: 8, user_id: 4, training_id: 1, date: "2026-10-16", time: "09:00", payment: "transfer", status_id: 1, comment: "" },
    { id: 9, user_id: 3, training_id: 2, date: "2026-10-10", time: "18:00", payment: "card", status_id: 3, comment: "" },
    { id: 10, user_id: 6, training_id: 3, date: "2026-10-17", time: "10:00", payment: "cash", status_id: 2, comment: "" }
  ]
};
