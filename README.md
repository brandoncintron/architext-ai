# Architext AI

Architext AI is a web-based application designed to bridge the gap between a product idea and a developer-ready architectural plan. It functions as an AI-powered system architect, engaging the user in a structured, conversational discovery process to design their application's architecture. The final output is a comprehensive, well-structured Technical Design Document (TDD) that can be used to kick off development immediately.

This project was built to solve a common problem for developers: the analysis paralysis that occurs when starting a new project. By automating the initial architectural planning, Architext AI empowers any developer to transform a product concept into a robust, developer-ready technical blueprint.

## Features

-   **Conversational AI Wizard:** A multi-step process that intelligently asks clarifying questions about the user's project idea.
-   **Dynamic Question Generation:** The AI analyzes the initial prompt to generate relevant questions about scale, performance, data models, and more.
-   **Technical Design Document (TDD) Generation:** Produces a complete, well-formatted TDD in Markdown.
-   **Copy to Clipboard:** Easily copy the generated TDD to use in other tools.
-   **Dark/Light Mode:** A sleek and responsive UI with theme support.

## Tech Stack

This project is a full-stack application built with a modern tech stack:

-   **Frontend:** [Next.js](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/), styled with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/).
-   **Backend:** [Python](https://www.python.org/) serverless functions running on Vercel, using the [FastAPI](https://fastapi.tiangolo.com/) framework.
-   **AI Orchestration:** [LangChain](https://www.langchain.com/) to manage the conversational flow.
-   **LLM:** The [Google Gemini API](https://ai.google.dev/docs) powers the question and TDD generation.
-   **Deployment:** The entire application is deployed on [Vercel](https://vercel.com/).

## Getting Started

To run this project locally, you'll need to have Node.js and Python installed.

### 1. Clone the repository

```bash
git clone https://github.com/brandoncintron/architext-ai.git
cd architext-ai
```

### 2. Install dependencies

This project uses both npm for the frontend and pip for the Python backend.

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r api/requirements.txt
```

### 3. Set up environment variables

You will need a Google Gemini API key. Create a `.env` file in the root of the project and add your key:

```
GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment on Vercel

This project is configured for easy deployment on Vercel.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  Vercel will automatically detect that this is a Next.js project.
4.  Add your `GEMINI_API_KEY` as an environment variable in the Vercel project settings.
5.  Deploy! Vercel will handle the rest, including installing both Node.js and Python dependencies.

The `vercel.json` file in this repository is configured to use the Python runtime for the API routes.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
