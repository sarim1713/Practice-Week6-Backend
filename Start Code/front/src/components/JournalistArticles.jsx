import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticlesByJournalist } from "../services/api";

export default function JournalistArticles() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [journalistName, setJournalistName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticles();
  }, [id]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getArticlesByJournalist(id);
      setArticles(data);
      if (data.length > 0) {
        setJournalistName(data[0].journalist_name);
      }
    } catch (err) {
      setError("Failed to load articles for this journalist.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (articleId) => navigate(`/articles/${articleId}`);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Articles by {journalistName || "Journalist"}</h2>

      {!isLoading && articles.length === 0 && !error && (
        <p>No articles found for this journalist.</p>
      )}

      <div className="article-list">
        {articles.map((article) => (
          <div key={article.id} className="article-card">
            <div className="article-title">{article.title}</div>
            <div className="article-category">{article.category}</div>
            <div className="article-actions">
              <button className="button-secondary" onClick={() => handleView(article.id)}>
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
