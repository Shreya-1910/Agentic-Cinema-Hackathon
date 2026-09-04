import os
from dotenv import load_dotenv

# 1. Load environment variables before initializing API clients
load_dotenv()

from google.adk.agents import Agent
from google.adk.apps import App
from parallel import Parallel

# 2. Initialize Parallel client using environment key
parallel_client = Parallel(api_key=os.environ.get("PARALLEL_API_KEY"))


def find_competing_films(query: str) -> str:
    """Finds competing films, box office trends, and market context for a given genre or movie pitch.

    Args:
        query: The search query string for movie competitors.
    """
    try:
        results = parallel_client.search(
            objective=f"Find competing films for: {query}",
            search_queries=[query]
        )
        return str(results)
    except Exception as e:
        return f"Error executing search tool: {str(e)}"

def audience_trends_search(query: str) -> str:
    """Searches for demographic interest, audience sentiment, and viewing trends for a specific genre or theme.

    Args:
        query: The genre, theme, or topic query to analyze audience interest for.
    """
    try:
        results = parallel_client.search(
            objective=f"Analyze audience trends, demographics, and social sentiment for: {query}",
            search_queries=[query]
        )
        return str(results)
    except Exception as e:
        return f"Error executing audience trends search tool: {str(e)}"


def review_sentiment_search(query: str) -> str:
    """Searches critical review aggregations, audience reception scores, and common praise or complaints for a movie or subgenre.

    Args:
        query: The movie title or subgenre query to analyze critical reception and sentiment for.
    """
    try:
        results = parallel_client.search(
            objective=f"Gather critical review sentiment, score summaries, and audience reception for: {query}",
            search_queries=[query]
        )
        return str(results)
    except Exception as e:
        return f"Error executing review sentiment tool: {str(e)}"


def market_gap_search(query: str) -> str:
    """Identifies underserviced market niches, missing themes, or unexploited opportunities in a film genre or market.

    Args:
        query: The film genre or subject area to discover market gaps and opportunities for.
    """
    try:
        results = parallel_client.search(
            objective=f"Identify market gaps, unfulfilled audience demand, and industry opportunities in: {query}",
            search_queries=[query]
        )
        return str(results)
    except Exception as e:
        return f"Error executing market gap search tool: {str(e)}"


def box_office_search(query: str) -> str:
    """Retrieves financial figures, budget allocations, production costs, and box office revenue data for films.

    Args:
        query: The film title or genre to lookup box office returns and budget metrics for.
    """
    try:
        results = parallel_client.search(
            objective=f"Retrieve exact box office revenue, budget figures, and financial returns for: {query}",
            search_queries=[query]
        )
        return str(results)
    except Exception as e:
        return f"Error executing box office search tool: {str(e)}"


# 3. Define root agent setup with string model identifier
root_agent = Agent(
    name="root_agent",
    model="gemini-2.5-flash",
    instruction="""
    You are a film market research assistant analyzing a movie pitch. You have access
    to 5 research tools: find_competing_films, box_office_search, review_sentiment_search, 
    market_gap_search, and audience_trends_search.

    You MUST use the relevant tools to gather real market intelligence before answering.
    Do NOT answer from your own knowledge — always use the appropriate tool first.

    Call ALL 5 tools to gather complete research on the pitch, then combine everything
    into ONE final structured report.

    RULES:
    - Only include information the search results actually support — do not invent details.
    - Skip generic "best of" list articles that don't give substantive comparable data.
    - Prefer drawing information from DIFFERENT source URLs when multiple equally relevant options exist.
    - Any fact and its source_url must come from the SAME source article — never mix facts
      about one film with a source that discusses a different film.
    - For "risks": derive each risk directly from patterns in the competitors, audience_trends, 
      review_sentiment, and market_gaps data gathered above — not from general genre knowledge. 
      Each risk's "reasoning" must reference a specific finding (e.g. a named competitor's 
      underperformance, a stated trend, a specific gap or lack of gap).
    - The final recommendation must cite at least one specific competitor and one specific risk.
    - Output ONLY valid JSON, no other text, in this format:

    {
      "pitch_summary": "",
      "verdict": "GREENLIGHT | PASS",
      "score": 0,
      "competitors": [
        { "title": "", "release_year": null, "similarity_reason": "", "box_office": "", "source_url": "" }
      ],
      "audience_trends": [
        { "trend": "", "description": "", "relevance_reason": "", "supporting_data": "", "source_url": "" }
      ],
      "review_sentiment": [
        { "title": "", "release_year": null, "sentiment_summary": "", "score": "", "relevance_reason": "", "source_url": "" }
      ],
      "market_gaps": [
        { "gap": "", "description": "", "relevance_reason": "", "supporting_data": "", "source_url": "" }
      ],
      "risks": [
        { "risk": "", "reasoning": "" }
      ],
      "recommendation": "",
      "sources": [""]
    }
    """,
    tools=[
        find_competing_films,
        box_office_search,
        review_sentiment_search,
        market_gap_search,
        audience_trends_search,
    ],
)

app = App(
    root_agent=root_agent,
    name="app",
)