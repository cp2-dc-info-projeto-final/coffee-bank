DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
    id bigint GENERATED ALWAYS AS IDENTITY,
    login text NOT NULL,
    email text NOT NULL
);

INSERT INTO usuario (login, email) VALUES
('hermenegildo', 'hermenegildo@email.com'),
('zoroastra', 'zoroastra@email.com');
