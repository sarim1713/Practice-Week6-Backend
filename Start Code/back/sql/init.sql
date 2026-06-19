-- Database initialization script for Week 6 Exercise 3
-- Run this against your MySQL database

-- Create journalists table
CREATE TABLE IF NOT EXISTS journalists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    bio TEXT
);

-- Add journalist_id column to articles table if it doesn't exist
-- First check if the column exists; if not, add it
SET @exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
               WHERE TABLE_NAME = 'articles' AND COLUMN_NAME = 'journalist_id' 
               AND TABLE_SCHEMA = DATABASE());

SET @query = IF(@exists = 0, 
    'ALTER TABLE articles ADD COLUMN journalist_id INT, ADD FOREIGN KEY (journalist_id) REFERENCES journalists(id)',
    'SELECT "journalist_id already exists" AS status');

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Seed journalists
INSERT INTO journalists (name, email, bio) VALUES
('Alice Johnson', 'alice@example.com', 'Senior tech reporter covering frontend development'),
('Bob Smith', 'bob@example.com', 'Investigative journalist specializing in backend systems'),
('Carol Davis', 'carol@example.com', 'Freelance writer focused on full-stack technologies')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Seed articles (assumes articles table already exists with at least id, title, content, category)
-- Clear existing articles to avoid duplicate key issues
DELETE FROM articles;

INSERT INTO articles (title, content, journalist_id, category) VALUES
('React Basics', 'Learn the fundamentals of React including components, state, and props.', 1, 'Frontend'),
('Routing in React', 'A comprehensive guide to React Router for single-page applications.', 1, 'Frontend'),
('Understanding Node.js', 'Deep dive into the event loop, streams, and modules in Node.js.', 2, 'Backend'),
('SQL vs NoSQL Databases', 'Comparing relational and non-relational database systems.', 2, 'Database'),
('Full-Stack Deployment', 'Step-by-step guide to deploying a full-stack application.', 3, 'DevOps'),
('State Management Patterns', 'Exploring Redux, Context API, and Zustand for state management.', 3, 'Frontend');
