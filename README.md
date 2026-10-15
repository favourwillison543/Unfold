# Unfold

Unfold is an AI-assisted product workflow planner designed to help teams structure product ideas, explore product requirements, and organize workflows.

## Project Structure

- `frontend/` — Next.js application
- `backend/` — NestJS API

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript

**Backend**
- NestJS
- TypeScript
- PostgreSQL
- TypeORM

## Getting Started

The frontend and backend are separate applications. Each has its own dependencies and environment configuration.

### Frontend

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Start the development server using the script defined in `package.json`.

### Backend

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Configure the required environment variables before starting the API. Do not commit `.env` files or credentials to version control.

## Environment Variables

The backend requires database connection settings and other configuration values defined by the application.

Keep secrets in local environment files and provide the required configuration separately when deploying.

## Development Status

Unfold is under active development.