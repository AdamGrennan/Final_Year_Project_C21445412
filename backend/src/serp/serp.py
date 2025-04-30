import os
import requests
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()

serp_bp = Blueprint("serp", __name__)
SERP_API_KEY = os.getenv("SERPAPI_KEY")

def serp_endpoint():
    data = request.json
    user_query = data.get("query", "")

    if not query or not SERP_API_KEY:
        return jsonify({"error": "Missing API key"}), 400
    
    query = f"{user_query} decision making guide OR tips OR advice"

    response = requests.get("https://serpapi.com/search", params={
        "engine": "google",
        "q": query,
        "api_key": SERP_API_KEY,
        "num": 2
    })

    if response.status_code != 200:
        return jsonify({"error": "SerpAPI call failed"}), 500

    results = response.json().get("organic_results", [])[:2]
    
    links = [
        {
            "title": item.get("title"),
            "url": item.get("link"),
        }
        for item in results if item.get("link")
    ]

    return jsonify({"links": links})
