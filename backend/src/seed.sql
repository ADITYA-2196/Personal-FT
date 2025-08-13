
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin','admin@pft.dev','$2a$10$7h6dD5yFv4q7iX2RjY6wIeKrd8XJ9x0wzM1sKQ7yR0hWgE7qQd8P6','admin'),
('User','user@pft.dev','$2a$10$7h6dD5yFv4q7iX2RjY6wIeKrd8XJ9x0wzM1sKQ7yR0hWgE7qQd8P6','user'),
('Viewer','viewer@pft.dev','$2a$10$7h6dD5yFv4q7iX2RjY6wIeKrd8XJ9x0wzM1sKQ7yR0hWgE7qQd8P6','read-only')
ON CONFLICT DO NOTHING;

DO $$
DECLARE uid INT;
BEGIN
  SELECT id INTO uid FROM users WHERE email = 'user@pft.dev';
  IF uid IS NOT NULL THEN
    INSERT INTO transactions (user_id, type, category, amount, date, note) VALUES
    (uid,'income','Salary',50000,'2025-01-01','January salary'),
    (uid,'expense','Food',5000,'2025-01-05','Groceries'),
    (uid,'expense','Transport',1200,'2025-01-06','Metro card'),
    (uid,'expense','Entertainment',2000,'2025-01-10','Movie night'),
    (uid,'income','Freelance',8000,'2025-02-12','Side gig'),
    (uid,'expense','Rent',15000,'2025-02-01','Monthly rent'),
    (uid,'expense','Utilities',3000,'2025-02-03','Electricity & water');
  END IF;
END $$;
