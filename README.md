# Architext AI

Architext AI is a web-based application designed to bridge the gap between a product idea and a developer-ready architectural plan. It functions as an AI-powered system architect, engaging the user in a structured, conversational discovery process to design their application's architecture. The final output is a comprehensive, well-structured Technical Design Document (TDD) that can be used to kick off development immediately.

This project was built to solve a common problem for developers: the analysis paralysis that occurs when starting a new project. By automating the initial architectural planning, Architext AI empowers any developer to transform a product concept into a robust, developer-ready technical blueprint.

## Features

- **Conversational AI Wizard:** A multi-step process that intelligently asks clarifying questions about the user's project idea.
- **Dynamic Question Generation:** The AI analyzes the initial prompt to generate relevant questions about scale, performance, data models, and more.
- **Technical Design Document (TDD) Generation:** Produces a complete, well-formatted TDD in Markdown.
- **Copy to Clipboard:** Easily copy the generated TDD to use in other tools.
- **Dark/Light Mode:** A sleek and responsive UI with theme support.

## Tech Stack

This project is a full-stack application built with a modern tech stack:

- **Frontend:** [Next.js](https://nextjs.org/) with [TypeScript](https://www.typescriptlang.org/), styled with [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/).
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) server running in a containerized [Python](https://www.python.org/) environment.
- **AI Orchestration:** [LangChain](https://www.langchain.com/) to manage the conversational flow.
- **LLM:** The [Google Gemini API](https://ai.google.dev/docs) powers the question and TDD generation.
- **Deployment:** The application is containerized using [Docker](https://www.docker.com/) and deployed on [AWS App Runner](https://aws.amazon.com/app-runner/), with images stored in [AWS ECR](https://aws.amazon.com/ecr/).
