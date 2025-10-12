-- 1. Clients Table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone_number VARCHAR(20),
    address TEXT,
    birthday DATE,
    age INT,
    height NUMERIC(5,2),
    gender VARCHAR(10),
    fitnessgoal VARCHAR(255),
    imageurl TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Body Measurement Table
CREATE TABLE bodymeasurement (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES clients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    startingweight NUMERIC(5,2),
    weightchange NUMERIC(5,2),
    calorieintake INT,
    height NUMERIC(5,2),
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Weight History Table
CREATE TABLE weight_history (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    weight NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Meals Table
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    calories INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Indexes for faster queries
CREATE INDEX idx_meals_user_date ON meals(user_id, date);
CREATE INDEX idx_weight_history_user_date ON weight_history(user_id, date);
CREATE INDEX idx_bodymeasurement_user ON bodymeasurement(user_id);

-- 6. Optional: Ensure one bodymeasurement per user (already unique constraint)
ALTER TABLE bodymeasurement ADD CONSTRAINT uq_bodymeasurement_user UNIQUE (user_id);
