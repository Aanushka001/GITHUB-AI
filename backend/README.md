# Test Case Generator Backend

This is the Node.js backend for the Test Case Generator application. It provides API endpoints for GitHub integration and AI-powered test case generation.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file based on the `.env.example` template:

```bash
cp .env.example .env
```

3. Edit the `.env` file to add your GitHub token (if needed).

4. Start the development server:

```bash
npm run dev
```

The server will be available at http://localhost:5000.

## API Endpoints

### GitHub Integration

- `GET /api/github/files` - List files from a GitHub repository
- `POST /api/github/content` - Fetch content of selected files
- `POST /api/github/create-pr` - Create a pull request with generated test files

### AI Integration

- `POST /api/ai/summarize` - Generate test case summaries from code files
- `POST /api/ai/generate-code` - Generate test code from a summary

## Project Structure

- `server.js` - Main server file
- `routes/` - API route handlers
  - `github.js` - GitHub API integration
  - `ai.js` - AI-powered test case generation