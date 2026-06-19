import pool from "../utils/database.js";

//
//  This repository shall:
//  - Connect to the database (using the pool provided by the database.js)
//  - Perfrom the SQL querries to implement the bellow API
//

// Get all articles
export async function getArticles() {
    const [rows] = await pool.query(
        "SELECT articles.*, journalists.name AS journalist_name FROM articles JOIN journalists ON articles.journalist_id = journalists.id"
    );
    return rows;
}

// Get one article by ID
export async function getArticleById(id) {
    const [rows] = await pool.query(
        "SELECT articles.*, journalists.name AS journalist_name, journalists.email, journalists.bio FROM articles JOIN journalists ON articles.journalist_id = journalists.id WHERE articles.id = ?",
        [id]
    );
    return rows[0] || null;
}

// Create a new article
export async function createArticle(article) {
    const { title, content, journalist_id, category } = article;
    const [result] = await pool.query(
        "INSERT INTO articles (title, content, journalist_id, category) VALUES (?, ?, ?, ?)",
        [title, content, journalist_id, category]
    );
    return { id: result.insertId, ...article };
}

// Update an article by ID
export async function updateArticle(id, updatedData) {
    const { title, content, journalist_id, category } = updatedData;
    const [result] = await pool.query(
        "UPDATE articles SET title = ?, content = ?, journalist_id = ?, category = ? WHERE id = ?",
        [title, content, journalist_id, category, id]
    );
    if (result.affectedRows === 0) return null;
    const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [id]);
    return rows[0];
}

// Get all articles by journalist ID
export async function getArticlesByJournalistId(journalistId) {
    const [rows] = await pool.query(
        "SELECT articles.*, journalists.name AS journalist_name FROM articles JOIN journalists ON articles.journalist_id = journalists.id WHERE articles.journalist_id = ?",
        [journalistId]
    );
    return rows;
}

// Delete an article by ID
export async function deleteArticle(id) {
    const [result] = await pool.query("DELETE FROM articles WHERE id = ?", [id]);
    return result.affectedRows > 0;
}
