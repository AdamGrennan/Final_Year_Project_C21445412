import logging
from flask import request, jsonify
from newsapi import NewsApiClient
from sklearn.metrics.pairwise import cosine_similarity

logging.basicConfig(level=logging.INFO)  
logger = logging.getLogger(__name__)

newsapi = NewsApiClient(api_key='ff2821922ae545f1b0a770cc8bf2d7c3')

def news_api_endpoint(sbert_model):

    try:
        data = request.json
        input_text = data.get("input", "").strip()

        if not input_text:
            return jsonify({"error": "No input provided"}), 400


        articles = newsapi.get_top_headlines(country="us", page_size=5)

        if "message" in articles:
            return jsonify({"error": f"NewsAPI error: {articles['message']}"}), 500

        if articles.get("status") != "ok" or articles.get("totalResults", 0) == 0:
            return jsonify({"message": "No relevant news articles found"}), 200

        article_texts = [article["title"] for article in articles.get("articles", []) if article.get("title")]

        if not article_texts:
            return jsonify({"message": "No similar articles found"}), 200

        encoded_articles = sbert_model.encode(article_texts)
        encoded_input = sbert_model.encode([input_text]).reshape(1, -1)

        similarities = cosine_similarity(encoded_input, encoded_articles)[0]

        article_match = similarities.argmax()
        article_title = article_texts[article_match]
        article_similarity = round(float(similarities[article_match]), 2)

        logger.info(f"Most Similar Article: {article_title} (Similarity: {article_similarity})")
        if article_similarity >= 0.25:
            return jsonify({
                "most_similar_article": {
                    "title": article_title,
                    "similarity": article_similarity
                }
            }), 200
        else:
            return jsonify({
                "message": "No highly relevant articles",
                "highest_similarity": article_similarity
            }), 200

    except Exception as e:
        logger.exception("Unexpected error occurred in news_api_endpoint.")
        return jsonify({"error": "Internal server error", "details": str(e)}), 500
