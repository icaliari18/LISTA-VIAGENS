CREATE DATABASE  pontos_turisticos;
USE pontos_turisticos;

CREATE TABLE locais(
id INT AUTO_INCREMENT PRIMARY KEY,
nome VARCHAR(100) NOT NULL,
pais VARCHAR(200) NOT NULL, 
valor DECIMAL NOT NULL,
ano INT NOT NULL
);

INSERT INTO locais(nome, pais, valor, ano)VALUES
('Cristo Redentor', 'Brasil', 1000.00, 2013),
('Torre Eiffel', 'França', 12000.00, 2023),
('Coliseu', 'Itália', 14000.00, 2023),
('Machu Picchu', 'Peru',  2500.00, 2030),
('Cataratas do Iguaçu', 'Brasil', 500.00, 2026);
SELECT * FROM locais; 