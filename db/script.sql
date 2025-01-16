-- Database: Zendestate

-- DROP DATABASE IF EXISTS "Zendestate";

CREATE DATABASE "Zendestate"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United Kingdom.1252'
    LC_CTYPE = 'English_United Kingdom.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

COMMENT ON DATABASE "Zendestate"
    IS 'Zendestate';

CREATE TABLE login_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',  -- Default role is 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
