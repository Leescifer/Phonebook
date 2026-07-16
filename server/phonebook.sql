-- Roles table 
CREATE TABLE
    roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        role_name VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Default data for roles table
INSERT INTO
    roles (role_name, description)
VALUES
    ('SUPER_ADMIN', 'System Administrator'),
    ('ADMIN', 'Administrator'),
    ('USER', 'Normal User');

-- Users table
CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL DEFAULT 3,
        is_approved BOOLEAN DEFAULT FALSE,
        status ENUM ('ACTIVE', 'INACTIVE') DEFAULT 'ACTIVE',
        profile_photo VARCHAR(255) DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
    );