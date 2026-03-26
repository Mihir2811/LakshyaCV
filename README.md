# LakshyaCV - Professional Resume Generator

## Overview

LakshyaCV is a full-stack web application designed to enable users to create professional, ATS-friendly PDF resumes through an intuitive, step-by-step interface. The application features a responsive frontend with guided form inputs and a backend API that generates polished PDF documents using customizable templates.

Key capabilities include:
- Multi-step form for collecting personal information, professional summary, work experience, education, skills, and projects
- Three professional resume templates: Classic (traditional serif), Executive (navy and gold corporate), and Modern (teal accent contemporary)
- Real-time progress tracking and inline validation
- Client-side data processing with secure server-side PDF generation
- Downloadable A4-formatted PDF output with hyperlinks and precise typography

The application emphasizes data privacy by processing user inputs entirely within the browser session, with PDF generation occurring server-side without persistent storage.

## Project Structure

```
LakshyaCV/
├── backend/
│   ├── api.py              # FastAPI routes and Pydantic models
│   └── functions.py         # Core PDF generation logic (ReportLab)
├── frontend/
│   ├── index.html          # Main application interface
│   ├── app.js              # Client-side interactivity and form handling
│   ├── style.css           # Responsive GOV.UK-inspired design system
│   └── favicon.ico         # Application icon
├── demo.html               # Animated product demonstration
├── static/                 # Served frontend assets
└── .gitignore              # Repository exclusions
```

## Technology Stack

**Backend:**
- FastAPI (ASGI web framework)
- ReportLab (PDF generation library)
- Pydantic (data validation and serialization)
- CORS middleware for frontend integration

**Frontend:**
- Vanilla JavaScript (no build tools or frameworks)
- Semantic HTML5 with ARIA attributes
- CSS Grid/Flexbox responsive layout
- Custom design system inspired by GOV.UK components

**PDF Features:**
- A4 page formatting with precise typography
- Three template variants with distinct color schemes
- Hyperlinked contact information (email, LinkedIn, GitHub, portfolio)
- Dynamic skill tag rendering
- Automated footer with generation timestamp

## Features

### Frontend
- Four-step wizard interface with progress visualization
- Template selector with live previews (Classic, Executive, Modern)
- Inline tooltips with resume-writing best practices
- AI-assisted description generators for summaries and achievements
- Real-time character counting and form validation
- Dynamic repeatable sections for experience, education, and projects
- Mobile-responsive design with sticky navigation
- Review summary before PDF generation

### Backend
- `/generate` POST endpoint accepting structured JSON payload
- Template-aware PDF rendering with custom styles
- Secure file download headers with dynamic naming
- Health check endpoint (`/health`)
- Static file serving for frontend assets
- Comprehensive error handling with HTTP status codes

### PDF Templates
1. **Classic**: Black & white, Times serif typography, traditional layout for law/finance/academia
2. **Executive**: Navy & gold accents, corporate authority styling for management/consulting
3. **Modern**: Teal highlights, clean sans-serif design for technology/startups

## Prerequisites

- Python 3.8+ (for backend)
- pip (for dependency installation)
- Web browser (Chrome/Firefox/Safari/Edge recommended)

## Setup and Installation

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd LakshyaCV
   ```

2. **Backend setup:**
   ```
   cd backend
   pip install fastapi uvicorn reportlab pydantic
   uvicorn api:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Access the application:**
   Open `http://localhost:8000` in your web browser

The frontend is automatically served from the `/static` mount point. No separate build process is required.

## Usage

1. Navigate to the application URL
2. Select preferred resume template
3. Complete the four-step form:
   - Step 1: Personal details, summary, skills
   - Step 2: Work experience (achievements format)
   - Step 3: Education and certifications
   - Step 4: Projects/portfolio + final review
4. Click "Download PDF" to generate and save the resume

## API Endpoints

| Method | Endpoint      | Description                          |
|--------|---------------|--------------------------------------|
| GET    | `/`           | Serve main application HTML          |
| GET    | `/health`     | Health check                         |
| POST   | `/generate`   | Generate PDF from JSON payload       |
| GET    | `/favicon.ico`| Application favicon                  |

**Generate payload schema:**
```json
{
  "personal": { "name": "str", "title": "str", ... },
  "summary": "str",
  "experience": [{ "company": "str", "role": "str", ... }],
  "education": [{ "institution": "str", ... }],
  "skills": "str",
  "projects": [{ "name": "str", ... }],
  "template": "classic|executive|modern"
}
```

## Customization

### Adding Templates
1. Define new styles in `backend/functions.py`
2. Add template builder function matching existing pattern
3. Update frontend template selector in `frontend/index.html`

## Demo

An interactive demonstration is available at `demo.html`, showcasing the complete user workflow with automated form filling and PDF preview.

## Security Considerations

- User data processed in memory only, never persisted
- No external dependencies requiring network access during PDF generation
- Input sanitization via Pydantic models
- CORS configured for browser-only origins

## License

Contact Owner for any.

For production deployment, consider Docker containerization and process manager configuration (Gunicorn/PM2).
