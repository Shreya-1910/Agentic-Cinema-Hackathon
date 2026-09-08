# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

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
from google.adk.cli.fast_api import get_fast_api_app
from google.adk.runners import Runner
from pydantic import BaseModel

from app.app_utils import services
from app.app_utils.a2a import attach_a2a_routes


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

otel_to_cloud = os.environ.get(
    "GOOGLE_CLOUD_AGENT_ENGINE_ENABLE_TELEMETRY",
    "",
).lower() in ("true", "1")

allow_origins = (
    os.getenv("ALLOW_ORIGINS", "").split(",")
    if os.getenv("ALLOW_ORIGINS")
    else None
)


# ============================================================
# DEPLOYED AGENT ENGINE
# ============================================================

AGENT_ENGINE_URL = (
    "https://us-central1-aiplatform.googleapis.com/v1/"
    "projects/double-rigging-485306-m9/"
    "locations/us-central1/"
    "reasoningEngines/7389251951550005248:streamQuery?alt=sse"
)


# Directory containing the agent
AGENT_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)


# ============================================================
# APPLICATION LIFESPAN
# ============================================================

@contextlib.asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """
    Set up the ADK runner and A2A routes when the FastAPI
    application starts.
    """

    from app.agent import app as adk_app
    from app.agent import root_agent

    runner = Runner(
        app=adk_app,
        session_service=services.get_session_service(),
        artifact_service=services.get_artifact_service(),
        auto_create_session=True,
    )

    app.state.runner = runner
    app.state.agent_app_name = adk_app.name

    await attach_a2a_routes(
        app,
        agent=root_agent,
        runner=runner,
        task_store=InMemoryTaskStore(),
        rpc_path=f"/a2a/{adk_app.name}",
    )

    yield


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app: FastAPI = get_fast_api_app(
    agents_dir=AGENT_DIR,
    web=True,
    artifact_service_uri=services.ARTIFACT_SERVICE_URI,
    allow_origins=allow_origins,
    session_service_uri=services.SESSION_SERVICE_URI,
    otel_to_cloud=otel_to_cloud,
    lifespan=lifespan,
)

app.title = "my-agent"
app.description = "API for interacting with the Agent my-agent"


# ============================================================
# GREENLIGHT API
# ============================================================

class GreenlightRequest(BaseModel):
    prompt: str


@app.post("/api/greenlight")
async def greenlight(request: GreenlightRequest):
    """
    Receive a movie pitch from the React frontend,
    call the deployed Google Agent Engine,
    and return the final structured Greenlight report.
    """

    try:
        # ----------------------------------------------------
        # 1. Get Google Application Default Credentials
        # ----------------------------------------------------

        credentials, project_id = google.auth.default(
            scopes=[
                "https://www.googleapis.com/auth/cloud-platform"
            ]
        )

        # ----------------------------------------------------
        # 2. Refresh credentials
        # ----------------------------------------------------

        credentials.refresh(Request())

        if not credentials.token:
            raise RuntimeError(
                "Google authentication succeeded but no access "
                "token was obtained."
            )

        # ----------------------------------------------------
        # 3. Prepare Agent Engine request
        # ----------------------------------------------------

        headers = {
            "Authorization": f"Bearer {credentials.token}",
            "Content-Type": "application/json",
        }

        payload = {
            "class_method": "async_stream_query",
            "input": {
                "user_id": "greenlight-user",
                "message": request.prompt,
            },
        }

        # ----------------------------------------------------
        # 4. Call deployed Agent Engine
        # ----------------------------------------------------

        print("[GREENLIGHT] Calling Agent Engine...")

        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                AGENT_ENGINE_URL,
                headers=headers,
                json=payload,
            )

        # ----------------------------------------------------
        # 5. Check response
        # ----------------------------------------------------

        print(
            f"[AGENT ENGINE STATUS] {response.status_code}"
        )

        if response.status_code != 200:
            raise RuntimeError(
                f"Agent Engine returned HTTP "
                f"{response.status_code}: "
                f"{response.text[:1000]}"
            )

        # ----------------------------------------------------
        # TEMPORARY DEBUG
        # ----------------------------------------------------
        # Print the returned SSE response so we can inspect
        # its structure. This does NOT print our Authorization
        # header or Google credentials.
        # ----------------------------------------------------

        print("[AGENT ENGINE RESPONSE PREVIEW]")
        print(response.text[:10000])
        print("[END RESPONSE PREVIEW]")

        # ----------------------------------------------------
        # 6. Parse Server-Sent Events
        # ----------------------------------------------------

        final_text = None

        for line in response.text.splitlines():

            line = line.strip()

            if not line.startswith("data:"):
                continue

            data = line[len("data:"):].strip()

            if not data:
                continue

            try:
                event = json.loads(data)

            except json.JSONDecodeError:
                continue

            # ------------------------------------------------
            # Look for content.parts[].text
            # ------------------------------------------------

            content = event.get("content", {})

            if not isinstance(content, dict):
                continue

            parts = content.get("parts", [])

            if not isinstance(parts, list):
                continue

            for part in parts:

                if not isinstance(part, dict):
                    continue

                text = part.get("text")

                if text:
                    final_text = text

        # ----------------------------------------------------
        # 7. Make sure we received a final response
        # ----------------------------------------------------

        if not final_text:
            raise RuntimeError(
                "Agent Engine returned successfully, but no final "
                "agent response was found in the stream."
            )

        # ----------------------------------------------------
        # 8. Remove Markdown JSON fences
        # ----------------------------------------------------

        final_text = final_text.strip()

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

        # ----------------------------------------------------
        # 9. Parse JSON
        # ----------------------------------------------------

        try:
            report = json.loads(final_text)

        except json.JSONDecodeError as e:
            raise RuntimeError(
                "The agent returned text, but it was not valid JSON. "
                f"Agent response: {final_text[:2000]}"
            ) from e

        # ----------------------------------------------------
        # 10. Return report to React
        # ----------------------------------------------------

        print("[GREENLIGHT] Report successfully parsed.")

        return report

    except HTTPException:
        raise

    except Exception as e:

        print(
            f"[GREENLIGHT ERROR] "
            f"{type(e).__name__}: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e),
        ) from e


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )