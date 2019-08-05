DROP DATABASE IF EXISTS cbay_db;
CREATE DATABASE cbay_db;

USE cbay_db;
CREATE TABLE products(
	item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    department_name VARCHAR(255),
    price DECIMAL(9,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);

USE cbay_db;
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("sunglasses", "accessories", 5.99, 100), 
("tartan bowtie", "clothing", 10.99, 10),
("fob watch", "accessories", 49.99, 5),
("skinny jeans", "clothing", 14.59, 24),
("book of prophecies", "books", 999.99, 1),
("pleated khakis", "clothing", 69.99, 5),
("top hat", "accessories", 40.00, 6),
("suitcase full of books", "books", 159.99, 1),
("fresh oysters", "food", 6.99, 50),
("sushi", "food", 14.00, 50);

USE cbay_db;
SELECT * FROM products;