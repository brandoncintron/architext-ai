# Architext AI

Architext AI is a web-based application designed to bridge the gap between a product idea and a developer-ready architectural plan. It functions as an AI-powered system architect, guiding users through a structured, conversational discovery process. By answering a series of targeted questions and selecting their preferred AI engine, users can generate a comprehensive architectural plan for their application. The final output is a well-structured Technical Design Document (TDD) that can be used to kick off development immediately.

This project was built to solve a common problem for developers: the analysis paralysis that occurs when starting a new project. By automating the initial architectural planning, Architext AI empowers any developer to transform a product concept into a robust, developer-ready technical blueprint.

## Features

- **Conversational AI Wizard:** A multi-step process that intelligently asks clarifying questions about the user's project idea.
- **Dynamic Question Generation:** The AI analyzes the initial prompt to generate relevant questions about scale, performance, data models, and more.
- **Flexible Model Selection:** Choose between different AI models (e.g., Gemini 2.5 Pro for complex projects, Gemini 2.0 Flash for speed) to tailor the output to your needs.
- **Technical Design Document (TDD) Generation:** Produces a complete, well-formatted TDD in Markdown.
- **Copy to Clipboard:** Easily copy the generated TDD to use in other tools.
- **Dark/Light Mode:** A sleek and responsive UI with theme support.

## Tech Stack

This project is a full-stack application built with a modern tech stack:

- **Frontend:** [Next.js](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/), styled with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/).
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) server running in a containerized [Python](https://www.python.org/) environment.
- **AI Orchestration:** [LangChain](https://www.langchain.com/) to manage the conversational flow.
- **LLM:** The [Google Gemini API](https://ai.google.dev/docs) powers the question and TDD generation, offering a choice between models like Gemini 2.5 Pro and Gemini 2.0 Flash.
- **Deployment:** The application is containerized using [Docker](https://www.docker.com/) and deployed on [Google Cloud Run](https://cloud.google.com/run), with images stored in [Google Artifact Registry](https://cloud.google.com/artifact-registry).
