import os
from tavily import TavilyClient
from dotenv import load_dotenv

load_dotenv()

_client = None


def get_client() -> TavilyClient:
    global _client
    if _client is None:
        _client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    return _client


def search_learning_resources(stream: str, level: str, year: str) -> str:
    """Search for learning resources and return a synthesized context string."""
    client = get_client()

    queries = [
        f"best {stream} learning roadmap for {level} beginners 2024 2025",
        f"{stream} projects for {year} college students portfolio",
        f"top {stream} courses tutorials resources free paid",
    ]

    all_results = []
    for query in queries:
        try:
            response = client.search(
                query=query,
                search_depth="advanced",
                max_results=3,
                include_answer=True,
            )
            if response.get("answer"):
                all_results.append(f"[Search: {query}]\n{response['answer']}")
            for r in response.get("results", []):
                all_results.append(f"- {r['title']}: {r['url']}\n  {r.get('content', '')[:200]}")
        except Exception as e:
            all_results.append(f"[Search failed for '{query}': {e}]")

    return "\n\n".join(all_results)
