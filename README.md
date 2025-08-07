# Test Case Generator App

A full-stack web application that integrates with GitHub to generate test cases for your code using AI.

## Features

- GitHub repository integration (public or with token)
- Code file listing and selection
- AI-powered test case summary generation
- Test code generation for multiple languages (JavaScript, Java, Python)
- Code viewer for generated test cases
- (Optional) Pull request creation

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express
- **AI Model**: Trea AI
- **API Integration**: GitHub API

## Project Structure

```
├── frontend/           # React frontend application
├── backend/            # Node.js backend server
├── .env                # Environment variables
└── README.md           # Project documentation
```

## Setup Instructions

1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables
4. Run the development servers

## API Endpoints

- `GET /api/github/files` - List files from GitHub repository
- `POST /api/github/content` - Fetch content of selected files
- `POST /api/ai/summarize` - Generate test case summaries
- `POST /api/ai/generate-code` - Generate test code from summary
- `POST /api/github/create-pr` - (Optional) Create a pull request



# Test Case Generator Frontend

This is the React frontend for the Test Case Generator application. It provides a user interface for connecting to GitHub repositories, selecting files, generating test case summaries, and creating test code.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

The application will be available at http://localhost:3000.

## Features

- GitHub repository integration
- File selection and filtering
- Test case summary generation
- Test code generation for multiple languages
- Code viewer with syntax highlighting
- Pull request creation

## Project Structure

- `src/components/github/` - Components for GitHub integration
- `src/components/test/` - Components for test case generation
- `src/components/layout/` - Layout components (header, footer)
- `src/pages/` - Main application pages
- `src/services/` - API service functions

## Dependencies

- React
- Material-UI for UI components
- Axios for API requests
- Prism.js for code syntax highlighting
- React Router for navigation