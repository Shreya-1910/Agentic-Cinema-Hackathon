import os
from pathlib import Path

from dotenv import load_dotenv

# ---------------------------------------------------------
# Load environment variables
# ---------------------------------------------------------

env_path = Path(__file__).resolve().parents[4] / ".env"
load_dotenv(env_path)

print(f"[PARALLEL] .env path: {env_path}")


# ---------------------------------------------------------
# Imports
# ---------------------------------------------------------

from google.adk.agents import Agent
from google.adk.apps import App
from parallel import Parallel


# ---------------------------------------------------------
# Initialize Parallel client
# ---------------------------------------------------------

parallel_api_key = os.environ.get("PARALLEL_API_KEY")

print(
    f"[PARALLEL] API key found: "
    f"{bool(parallel_api_key)}"
)

if not parallel_api_key:
    print(
        "[PARALLEL WARNING] PARALLEL_API_KEY is not set."
    )

parallel_client = Parallel(
    api_key=parallel_api_key
)


# ---------------------------------------------------------
# Competing films search tool
# ---------------------------------------------------------

def find_competing_films(query: str) -> str:
    """
    Finds competing films, box office trends, and market
    context for a given genre or movie pitch.

    Args:
        query: The search query string for movie competitors.

    Returns:
        Search results as a string.
    """

    print("\n" + "=" * 60)
    print("[SEARCH TOOL] find_competing_films called")
    print(f"[SEARCH TOOL] Query: {query}")
    print(
        "[SEARCH TOOL] API key available: "
        f"{bool(os.environ.get('PARALLEL_API_KEY'))}"
    )
    print("=" * 60)

    try:

        # Make sure the API key exists before attempting search
        if not os.environ.get("PARALLEL_API_KEY"):
            error_message = (
                "PARALLEL_API_KEY is not configured."
            )

            print(
                f"[SEARCH TOOL ERROR] {error_message}"
            )

            return (
                "Error executing search tool: "
                f"{error_message}"
            )

        # -------------------------------------------------
        # Call Parallel
        # -------------------------------------------------

        print("[SEARCH TOOL] Calling Parallel search...")

        results = parallel_client.search(
            objective=(
                f"Find competing films for: {query}"
            ),
            search_queries=[query],
        )

        # -------------------------------------------------
        # Successful search
        # -------------------------------------------------

        print(
            "[SEARCH TOOL] Parallel search "
            "completed successfully"
        )

        print(
            f"[SEARCH TOOL] Result type: "
            f"{type(results).__name__}"
        )

        print(
            f"[SEARCH TOOL] Result preview: "
            f"{str(results)[:500]}"
        )

        return str(results)

    except Exception as e:

        # -------------------------------------------------
        # Detailed error information
        # -------------------------------------------------

        print("\n" + "!" * 60)
        print("[SEARCH TOOL ERROR]")
        print(
            f"[SEARCH TOOL ERROR] "
            f"Exception type: {type(e).__name__}"
        )
        print(
            f"[SEARCH TOOL ERROR] "
            f"Exception message: {str(e)}"
        )
        print(
            f"[SEARCH TOOL ERROR] "
            f"Exception repr: {repr(e)}"
        )
        print("!" * 60 + "\n")

        return (
            "Error executing search tool: "
            f"{type(e).__name__}: {str(e)}"
        )


# ---------------------------------------------------------
# Root agent
# ---------------------------------------------------------

root_agent = Agent(
    name="root_agent",

    model="gemini-2.5-flash",

    instruction="""
You are a film market research assistant.

When asked about competing films, box office trends,
or similar topics, you MUST use the
find_competing_films tool to get real search results.

Do NOT answer from your own knowledge.

Always use the tool first.

If the user asks about movie competition,
respond using the data returned by the search tool.

If the search tool fails, clearly explain that
the search tool encountered an error.
""",

    tools=[
        find_competing_films,
    ],
)


# ---------------------------------------------------------
# ADK App
# ---------------------------------------------------------

app = App(
    root_agent=root_agent,
    name="app",
)