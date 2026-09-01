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


# 3. Define root agent setup with string model identifier
root_agent = Agent(
    name="root_agent",
    model="gemini-2.5-flash",
    instruction="""
    You are a film market research assistant. 
    
    When asked about competing films, box office trends, or similar topics, 
    you MUST use the find_competing_films tool to get real search results.
    
    Do NOT answer from your own knowledge - always use the tool first.
    
    If the user asks about movie competition, respond with data from the search.
    """,
    tools=[find_competing_films],
)

app = App(
    root_agent=root_agent,
    name="app",
)