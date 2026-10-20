-- All tables of the app in one place.
-- "IF NOT EXISTS" means this is safe to run on every startup:
-- on supabase the tables already exist so nothing happens,
-- on a fresh database it creates them.

CREATE TABLE IF NOT EXISTS users (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMPTZ,
    updated_at    TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS categories (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT       NOT NULL,
    name       VARCHAR(255) NOT NULL,
    type       VARCHAR(255) NOT NULL,   -- 'INCOME' or 'EXPENSE'
    icon       VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS transactions (
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT         NOT NULL,
    category_id      BIGINT,
    type             VARCHAR(255)   NOT NULL,   -- 'INCOME' or 'EXPENSE'
    amount           NUMERIC(38, 2) NOT NULL,
    description      VARCHAR(255),
    source           VARCHAR(255),
    payment_method   VARCHAR(255),              -- UPI, CASH, CARD, BANK_TRANSFER
    transaction_date DATE,
    created_at       TIMESTAMPTZ,
    updated_at       TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS savings_goals (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT         NOT NULL,
    goal_name      VARCHAR(255)   NOT NULL,
    target_amount  NUMERIC(38, 2) NOT NULL,
    current_amount NUMERIC(38, 2) DEFAULT 0,
    deadline       DATE,
    status         VARCHAR(255),              -- 'ACTIVE' or 'COMPLETED'
    created_at     TIMESTAMPTZ,
    updated_at     TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS savings_contributions (
    id                BIGSERIAL PRIMARY KEY,
    goal_id           BIGINT         NOT NULL,
    amount            NUMERIC(38, 2) NOT NULL,
    contribution_date DATE,
    created_at        TIMESTAMPTZ
);
