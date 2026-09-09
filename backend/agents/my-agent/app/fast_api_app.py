import contextlib
import json
import os
import re
from collections.abc import AsyncIterator

import google.auth
import httpx
from google.auth.transport.requests import Request

from a2a.server.tasks import InMemoryTaskStore
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.adk.runners import Runner
from pydantic import BaseModel

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request as StarletteRequest

from app.app_utils import services
from app.app_utils.a2a import attach_a2a_routes


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

otel_to_cloud = (
    os.environ.get(
        "GOOGLE_CLOUD_AGENT_ENGINE_ENABLE_TELEMETRY",
        "",
    ).lower()
    in ("true", "1")
)


# ============================================================
# CORS
# ============================================================

# Always allow all three local frontend ports.
# This means the frontend can run on 5173, 5174, or 5175.

default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
]

# Also allow anything specified in .env
env_origins = os.getenv("ALLOW_ORIGINS", "").split(",")

allow_origins = default_origins.copy()

for origin in env_origins:
    origin = origin.strip()

    if origin and origin not in allow_origins:
        allow_origins.append(origin)


print("[CORS] Allowed origins:")
for origin in allow_origins:
    print("   ", origin)


# ============================================================
# AGENT ENGINE
# ============================================================

AGENT_ENGINE_URL = (
    "https://us-central1-aiplatform.googleapis.com/v1/"
    "projects/double-rigging-485306-m9/"
    "locations/us-central1/"
    "reasoningEngines/7389251951550005248:streamQuery?alt=sse"
)


# ============================================================
# AGENT DIRECTORY
# ============================================================

AGENT_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)


# ============================================================
# LIFESPAN
# ============================================================

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:

    print("[LIFESPAN] Starting application...")

    from app.agent import app as adk_app
    from app.agent import root_agent

    print("[LIFESPAN] Creating Runner...")

    runner = Runner(
        app=adk_app,
        session_service=services.get_session_service(),
        artifact_service=services.get_artifact_service(),
        auto_create_session=True,
    )

    app.state.runner = runner
    app.state.agent_app_name = adk_app.name

    print("[LIFESPAN] Attaching A2A routes...")

    await attach_a2a_routes(
        app,
        agent=root_agent,
        runner=runner,
        task_store=InMemoryTaskStore(),
        rpc_path=f"/a2a/{adk_app.name}",
    )

    print("[LIFESPAN] Application ready.")

    yield



app = FastAPI(
    title="Agentic Cinema API",
    description="AI Film Research Agent API",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




class DebugMiddleware(BaseHTTPMiddleware):

    async def dispatch(
        self,
        request: StarletteRequest,
        call_next,
    ):
        print(
            f"[DEBUG REQUEST] "
            f"{request.method} "
            f"{request.url.path}"
        )

        print(
            "[DEBUG REQUEST HEADERS]",
            dict(request.headers),
        )

        response = await call_next(request)

        print(
            f"[DEBUG RESPONSE] "
            f"{request.method} "
            f"{request.url.path} "
            f"-> {response.status_code}"
        )

        return response


app.add_middleware(DebugMiddleware)




@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "Agentic Cinema backend is running",
    }




@app.get("/health")
async def health():
    return {
        "status": "healthy",
    }



class GreenlightRequest(BaseModel):
    prompt: str




def extract_text_from_event(event):

    if not isinstance(event, dict):
        return None

    content = event.get("content")

    if not isinstance(content, dict):
        return None

    parts = content.get("parts", [])

    if not isinstance(parts, list):
        return None

    text_parts = []

    for part in parts:

        if not isinstance(part, dict):
            continue

        # Ignore tool calls
        if "function_call" in part:
            continue

        # Ignore tool responses
        if "function_response" in part:
            continue

        text = part.get("text")

        if isinstance(text, str) and text.strip():
            text_parts.append(text.strip())

    if text_parts:
        return "\n".join(text_parts)

    return None



def extract_final_agent_text(response_text: str):

    events = []


    for raw_line in response_text.splitlines():

        line = raw_line.strip()

        if not line:
            continue

        # Remove SSE prefix
        if line.startswith("data:"):
            line = line[len("data:"):].strip()

        # Ignore SSE terminator
        if line == "[DONE]":
            continue

        try:

            event = json.loads(line)
            events.append(event)

        except json.JSONDecodeError:
            continue


    final_text = None

    for event in events:

        text = extract_text_from_event(event)

        if text:
            final_text = text


    if not final_text:

        try:

            event = json.loads(
                response_text.strip()
            )

            final_text = extract_text_from_event(
                event
            )

        except json.JSONDecodeError:
            pass

    return final_text



@app.post("/api/greenlight")
async def greenlight(request: GreenlightRequest):

    print("")
    print("=" * 60)
    print("[GREENLIGHT] Endpoint hit!")
    print("=" * 60)

    print(
        "[GREENLIGHT] Prompt:",
        request.prompt,
    )

    try:

       

        print(
            "[GOOGLE AUTH] Getting credentials..."
        )

        credentials, project_id = google.auth.default(
            scopes=[
                "https://www.googleapis.com/auth/cloud-platform"
            ]
        )

        print(
            f"[GOOGLE AUTH] Project: {project_id}"
        )

        print(
            "[GOOGLE AUTH] Refreshing credentials..."
        )

        credentials.refresh(Request())

        if not credentials.token:

            raise RuntimeError(
                "Google credentials were obtained, "
                "but no access token was available."
            )

        print(
            "[GOOGLE AUTH] Token obtained successfully"
        )

    

        headers = {
            "Authorization": (
                f"Bearer {credentials.token}"
            ),
            "Content-Type": "application/json",
        }

    

        payload = {
            "class_method": "async_stream_query",
            "input": {
                "user_id": "greenlight-user",
                "message": request.prompt,
            },
        }


        print("")
        print(
            "[AGENT ENGINE] Calling Agent Engine..."
        )

        print(
            "[AGENT ENGINE] URL:"
        )

        print(AGENT_ENGINE_URL)

        async with httpx.AsyncClient(
            timeout=300.0
        ) as client:

            response = await client.post(
                AGENT_ENGINE_URL,
                headers=headers,
                json=payload,
            )

     

        print("")
        print(
            "[AGENT ENGINE STATUS]",
            response.status_code,
        )

       

        if response.status_code != 200:

            print("")
            print(
                "[AGENT ENGINE ERROR]"
            )

            print(
                response.text[:5000]
            )

            raise RuntimeError(
                "Agent Engine returned HTTP "
                f"{response.status_code}: "
                f"{response.text[:1000]}"
            )

    

        print("")
        print(
            "[AGENT ENGINE RESPONSE PREVIEW]"
        )

        print(
            response.text[:10000]
        )

        print(
            "[END RESPONSE PREVIEW]"
        )


        print("")
        print(
            "[PARSER] Looking for final agent response..."
        )

        final_text = extract_final_agent_text(
            response.text
        )

      

        if not final_text:

            print("")
            print(
                "[PARSER] No final text found."
            )

            print(
                "[PARSER] Raw response:"
            )

            print(
                response.text[:20000]
            )

            raise RuntimeError(
                "Agent Engine returned successfully, "
                "but no final textual agent response "
                "was found."
            )

    
        final_text = final_text.strip()

        # Remove markdown JSON fences

        final_text = re.sub(
            r"^```json\s*",
            "",
            final_text,
            flags=re.IGNORECASE,
        )

        final_text = re.sub(
            r"\s*```$",
            "",
            final_text,
        )

        final_text = final_text.strip()

    

        print("")
        print(
            "[GREENLIGHT] Final agent text:"
        )

        print(
            final_text[:10000]
        )

        print(
            "[END FINAL AGENT TEXT]"
        )

   

        try:

            report = json.loads(
                final_text
            )

        except json.JSONDecodeError as e:

            print("")
            print(
                "[PARSER] Final response was not JSON."
            )

            print(
                "[PARSER] Response:"
            )

            print(
                final_text[:5000]
            )

            raise RuntimeError(
                "The agent returned text, "
                "but it was not valid JSON. "
                f"Agent response: "
                f"{final_text[:2000]}"
            ) from e

    

        print("")
        print(
            "=" * 60
        )

        print(
            "[GREENLIGHT] Report successfully parsed."
        )

        print(
            "=" * 60
        )

        print("")

        return report

    except HTTPException:
        raise



    except Exception as e:

        print("")
        print(
            "=" * 60
        )

        print(
            "[GREENLIGHT ERROR]",
            f"{type(e).__name__}: {e}",
        )

        print(
            "=" * 60
        )

        print("")

        raise HTTPException(
            status_code=500,
            detail=str(e),
        ) from e


if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )