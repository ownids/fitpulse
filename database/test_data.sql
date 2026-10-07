-- ==========================================================
-- ИС «ФитПульс» — запись на групповые тренировки
-- Структура БД и тестовый набор данных (MySQL 8 / MariaDB)
-- ==========================================================
CREATE DATABASE IF NOT EXISTS fitpulse DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fitpulse;
SET NAMES utf8mb4;

CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  login VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB;

CREATE TABLE trainings (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  coach VARCHAR(100) NOT NULL,
  duration_min SMALLINT UNSIGNED NOT NULL,
  price DECIMAL(8,2) NOT NULL CHECK (price >= 0)
) ENGINE=InnoDB;

CREATE TABLE statuses (
  id TINYINT UNSIGNED PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE requests (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  training_id INT UNSIGNED NOT NULL,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  payment_method ENUM('cash','card','transfer') NOT NULL,
  comment VARCHAR(255),
  status_id TINYINT UNSIGNED NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (training_id) REFERENCES trainings(id),
  FOREIGN KEY (status_id) REFERENCES statuses(id),
  INDEX idx_requests_status (status_id)
) ENGINE=InnoDB;

-- ---------- Тестовые данные ----------
INSERT INTO statuses (id, name) VALUES
 (1, 'Новая'),
 (2, 'Подтверждена'),
 (3, 'Посещено'),
 (4, 'Отменена');

INSERT INTO trainings (id, title, coach, duration_min, price) VALUES
 (1, 'Йога для начинающих', 'Анна Белова', 60, 600),
 (2, 'Функциональный тренинг', 'Игорь Ким', 45, 700),
 (3, 'Пилатес', 'Мария Орлова', 55, 650),
 (4, 'Бокс', 'Тимур Алиев', 60, 800),
 (5, 'Стретчинг', 'Анна Белова', 50, 550);

-- Пароли хранятся в виде хэшей (для теста: admin / FitPulse2026, остальные / pass123)
INSERT INTO users (id, login, password_hash, full_name, phone, email, role) VALUES
 (1, 'admin', 'pbkdf2:sha256:1000000$WIFYbSmbrQ7oZGc8$7de4622fb7dc298ecf246f1eb2904e7006c54c22bedb76f8ccecdeab5ec587fa', 'Администратор ФитПульс', '8(900)000-00-00', 'admin@fitpulse.local', 'admin'),
 (2, 'ivanova', 'pbkdf2:sha256:1000000$kCS768ojbqK4u2EU$3992f35ed0a21e0f677963dea505f795bf5ee0771f3eddcf7606d4e879dd51e1', 'Иванова Мария Сергеевна', '8(912)345-67-01', 'ivanova@mail.ru', 'user'),
 (3, 'petrov', 'pbkdf2:sha256:1000000$YpdU3msWwiUDQWvm$c203060f2286cf25d2cca1c33dd132b016decab1d60639bbd0f382028131341a', 'Петров Алексей Игоревич', '8(903)111-22-33', 'petrov@mail.ru', 'user'),
 (4, 'smirnova', 'pbkdf2:sha256:1000000$V6SRoB03KnbI6vBv$066a22b019ecd3ad4f6eb2a898292d4c249a10ab19940629101f276cb5214a59', 'Смирнова Ольга Викторовна', '8(905)222-33-44', 'smirnova@mail.ru', 'user'),
 (5, 'kuznetsov', 'pbkdf2:sha256:1000000$Jybzn1VheNROQpJK$662a69fbd3bd2e21abc6dc088a433fc4e05f29b8a51885e531589ba2a06b1c94', 'Кузнецов Дмитрий Андреевич', '8(916)333-44-55', 'kuznetsov@mail.ru', 'user'),
 (6, 'sokolova', 'pbkdf2:sha256:1000000$FNefsU8b4EiW4lbl$a0d0b01a51127588afe664f03f9b8156574fd49eeaf4ef384da5328a503e16bf', 'Соколова Анна Павловна', '8(917)444-55-66', 'sokolova@mail.ru', 'user'),
 (7, 'popov', 'pbkdf2:sha256:1000000$4HI1a8p4I2NgONeT$8de56323db5abb3b10ab391eafd375a5af9b3c561168e0e5e9c24b9114cbcd91', 'Попов Никита Олегович', '8(925)555-66-77', 'popov@mail.ru', 'user');

INSERT INTO requests (id, user_id, training_id, visit_date, visit_time, payment_method, comment, status_id) VALUES
 (1, 2, 1, '2026-10-12', '09:00', 'card', NULL, 2),
 (2, 3, 4, '2026-10-12', '19:00', 'cash', 'Нужны перчатки напрокат', 1),
 (3, 4, 3, '2026-10-08', '10:00', 'card', NULL, 3),
 (4, 5, 2, '2026-10-13', '18:00', 'transfer', NULL, 1),
 (5, 6, 5, '2026-10-14', '20:00', 'card', 'Первое занятие', 2),
 (6, 7, 4, '2026-10-09', '19:00', 'cash', NULL, 4),
 (7, 2, 5, '2026-10-15', '20:00', 'card', NULL, 1),
 (8, 4, 1, '2026-10-16', '09:00', 'transfer', NULL, 1),
 (9, 3, 2, '2026-10-10', '18:00', 'card', NULL, 3),
 (10, 6, 3, '2026-10-17', '10:00', 'cash', NULL, 2);
