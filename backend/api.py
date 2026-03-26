"""
api.py — FastAPI routes only.
All logic lives in functions.py.
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import sys

sys.path.insert(0, os.path.dirname(__file__))
from functions import generate_pdf

# ─── App Setup ────────────────────────────────────────────────────────────────
app = FastAPI(
    title="Resume Generator API",
    description="Generates professional PDF resumes from structured JSON data.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve frontend static files
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")


# ─── Pydantic Models ──────────────────────────────────────────────────────────
class PersonalInfo(BaseModel):
    name:     Optional[str] = ""
    title:    Optional[str] = ""
    email:    Optional[str] = ""
    phone:    Optional[str] = ""
    location: Optional[str] = ""
    linkedin: Optional[str] = ""
    github:   Optional[str] = ""
    website:  Optional[str] = ""


class ExperienceItem(BaseModel):
    company: Optional[str] = ""
    role:    Optional[str] = ""
    period:  Optional[str] = ""
    bullets: Optional[str] = ""


class EducationItem(BaseModel):
    institution: Optional[str] = ""
    degree:      Optional[str] = ""
    year:        Optional[str] = ""
    gpa:         Optional[str] = ""


class ProjectItem(BaseModel):
    name:        Optional[str] = ""
    description: Optional[str] = ""
    tech:        Optional[str] = ""
    url:         Optional[str] = ""


class ResumePayload(BaseModel):
    personal:   PersonalInfo
    summary:    Optional[str] = ""
    experience: Optional[List[ExperienceItem]] = []
    education:  Optional[List[EducationItem]] = []
    skills:     Optional[str] = ""
    projects:   Optional[List[ProjectItem]] = []
    template:   Optional[str] = "modern"  # classic | executive | modern


# ─── Routes ───────────────────────────────────────────────────────────────────
@app.get("/")
def serve_frontend():
    """Serve the main HTML page."""
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    return FileResponse(index_path)

# Define a route to explicitly serve the favicon.ico file at the root
@app.get("/favicon.ico")
def serve_favicon():
    """Serve the favicon.ico file."""
    favicon_path = os.path.join(FRONTEND_DIR, "favicon.ico")
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path, media_type="image/x-icon")
    else:
        raise HTTPException(status_code=404, detail="Favicon not found")


@app.get("/health")
def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "service": "resume-generator"}


@app.post("/generate")
def generate_resume(payload: ResumePayload):
    """
    Accept resume JSON, return a downloadable PDF file.
    """
    try:
        raw_data = payload.model_dump()
        pdf_bytes = generate_pdf(raw_data, template=payload.template or "modern")

        name = (payload.personal.name or "resume").replace(" ", "_").lower()
        filename = f"{name}_resume.pdf"

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Length": str(len(pdf_bytes)),
            },
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")
