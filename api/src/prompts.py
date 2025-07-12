"""
@file This file contains the prompt templates for the LangChain chains.
"""
import os
from langchain_core.prompts import PromptTemplate


def load_system_prompt():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    prompt_path = os.path.join(current_dir, "prompts", "sysprompt.md")
    with open(prompt_path, "r") as f:
        return f.read() + "\\n\\n"

system_prompt = load_system_prompt()

ROUTER_PROMPT_TEMPLATE = system_prompt + """
<Prompt>
    <Context>
        A user will provide their high-level project idea. The user could be an indie hacker with
        limited architectural experience or a senior developer looking to prototype quickly. Your
        questions must be clear enough for both.
    <UserIdea>{user_idea}</UserIdea>
    <Platform>{platform}</Platform>
    </Context>
<Task>    
    Your task is to analyze the user's idea and the target platform. Based on this, generate a set
    of the most critical clarifying questions needed to draft a robust Technical Design Document
    (TDD). These questions will form a conversational wizard to guide the user. Your goal here is to
    be an information-gatherer, not a solution-provider.
</Task>
<Guidelines>
    <QuestionLimit>Generate a maximum of FIVE questions. This is a strict limit.</QuestionLimit>
    <QuestionCriteria>
        Ensure any question you ask can be answered by only selecting one option. If
        your question requires more than two options to be selected, do not ask it and instead
        consider rephrasing the question so it can be answered by "All the above". DO NOT provide
        "Other" as an option.
    </QuestionCriteria>
    <Relevance>
        Your questions must be highly relevant and demonstrate a deep understanding of the
        user's request.
    <Inference>        
        Leverage your domain knowledge to make logical inferences from the user's prompt. You
        MUST NOT ask questions for which the answer is strongly implied by the terminology used. For
        example, if a user mentions building an "e-commerce platform," you should infer that it will
        need core features like a product catalog and a shopping cart. Focus your questions on less
        obvious aspects, such as "Will the platform support third-party sellers?" or "What kind of
        payment processing integration is required?"
        To avoid redundancy, consolidate related topics (e.g., combine user load and data volume
        into a single scalability question) and ensure a balanced coverage of all focus areas
        without overemphasizing one (e.g., do not use multiple questions on scalability unless
        absolutely critical).
    </Inference>
    <AvoidRedundancy>
        DO NOT ask about information that is already explicitly provided in the user's idea.
        Your goal is to fill in the most critical *unknowns*.
    </AvoidRedundancy>
</Relevance>
<TechnologyNeutrality>
    Your primary goal is to ask technology-agnostic questions to understand
    the user's *needs*, not to suggest specific products. Do not mention brand names,
    frameworks, or services (e.g., "Azure", "React", "PostgreSQL"). ASSUME the user has a blank
    slate, unless otherwise specified in the initial prompt.
<EcosystemException>    
    The ONLY exception to the technology-agnostic rule is when the user explicitly commits
    to a specific technology *ecosystem* (e.g., "I want to build an app using Microsoft
    services," "Build me a solution built on AWS," "a Google Cloud project"). In these cases,
    you MAY offer options that are well-known, first-party solutions within that ecosystem
    *if
    they are directly relevant to the question*. For example, if the user's idea is "an
    enterprise app using Microsoft services" and you ask about authentication, it is appropriate
    to include "Active Directory" as an option alongside generic options like "Email/Password".
</EcosystemException>
</TechnologyNeutrality>
<Focus>
    Questions must be technical and specific. Focus on the most impactful architectural
    decisions, ensuring balanced coverage across areas and relevance to the specified platform
    (e.g., for a desktop app, probe offline capabilities; for mobile, consider device
    constraints):
<FocusArea>
    Scalability and expected user load (limit to one question unless highly varied aspects apply).
</FocusArea>
<FocusArea>Core data entities or data models.</FocusArea>
<FocusArea>
    User authentication and management.
</FocusArea>
<FocusArea>Real-time features (if applicable).</FocusArea>
<FocusArea>
    Primary architectural priority (e.g., Low Latency, High Availability, Security, Cost-Effectiveness).
</FocusArea>
</Focus>
<ActionableOptions>    
    Each question MUST be accompanied by a set of clear, concise options. These options should
    represent distinct architectural concepts or user needs (e.g., "Relational Data",
    "Document-based Data", "Graph Data"), not specific products. Ensure options are mutually
    exclusive where possible to avoid overlap. Ensure the user has at least one option to
    opt-out for questions related to authentication and similar features that are not always
    required for applications. Also ensure to take file types into consideration for projects
    that require the user to input a specific file, such as a resume, excel sheet, etc. Use "All
    the above" for questions where multiple aspects might apply simultaneously.
</ActionableOptions>
<Examples>
    <GoodExample>
        <Question>
            What is the most critical priority for the architecture? (All others will
            still be considered.)
        </Question>
        <Options>
            <Option>Low Latency</Option>
            <Option>High Availability</Option>
            <Option>Security</Option>
            <Option>Cost-Effectiveness</Option>
        </Options>
    </GoodExample>
    <GoodExample>
        <UserIdea>I want to build a photo sharing app using a PostgreSQL database.</UserIdea>
        <Question>What is the primary characteristic of the data you'll be storing?</Question>
        <Options>
            <Option>Highly structured, relational data (e.g., user profiles, relationships)</Option>
            <Option>Unstructured or semi-structured data (e.g., user-uploaded content, logs)</Option>
            <Option>Graph-based data (e.g., social connections, recommendations)</Option>
            <Option>All the above</Option>
        </Options>
        <Reasoning>
            This question correctly ignores the user's premature technology choice
            (PostgreSQL) and instead probes for the fundamental data model requirement, which is
            a more critical architectural question at this stage. It includes "All the above"
            for comprehensiveness.
        </Reasoning>
    </GoodExample>
    <GoodExample>
        <UserIdea>I need a desktop application for managing local inventory.</UserIdea>
        <Question>For this desktop application, what offline capabilities are required?</Question>
        <Options>
            <Option>Full offline access with periodic cloud sync</Option>
            <Option>Online-only with local caching for performance</Option>
            <Option>No offline needs; always connected</Option>
        </Options>
        <Reasoning>
            This question addresses platform-specific needs (desktop) while remaining
            technology-neutral and focusing on architectural decisions like data syncing.
        </Reasoning>
    </GoodExample>
    <BadExample>
        <Question>What do you want to build?</Question>
        <Reasoning>This question is too generic and not helpful.</Reasoning>
    </BadExample>
    <BadExample>
        <UserIdea>I want to build an e-commerce site.</UserIdea>
        <Question>Will your application need a product catalog and a shopping cart?</Question>
        <Options>
            <Option>Yes, both</Option>
            <Option>No, just a catalog</Option>
        </Options>
        <Reasoning>
            This is a poor question. The term "e-commerce site" strongly implies the need
            for a product catalog and shopping cart. A better question would focus on a less
            obvious, but critical, requirement such as "How will you handle payment processing?"
            or "Will you need to manage shipping and inventory?"
        </Reasoning>
    </BadExample>
    <BadExample>
        <UserIdea>A scalable web app for social networking.</UserIdea>
        <Question>What is the expected user load?</Question>
        <Options>...</Options>
        <Question>What is the expected data growth?</Question>
        <Options>...</Options>
        <Reasoning>
            This duplicates scalability questions, violating balance and redundancy
            guidelines. Combine into one.
        </Reasoning>
    </BadExample>
</Examples>
</Guidelines>
<OutputFormat>
    Respond with a single, valid JSON object and nothing else. Do not include any
    explanatory text, markdown formatting, or any characters before or after the JSON object. The
    JSON object must contain a key "questions", which holds an array of question objects. Each
    object in the array must have two keys:
<Key name="question">A string containing the question.</Key>
<Key name="options">An array of strings representing the choices.</Key>
</OutputFormat>
</Prompt>
"""

RouterPrompt = PromptTemplate.from_template(ROUTER_PROMPT_TEMPLATE)

VALIDATOR_PROMPT_TEMPLATE = """
<Context>
The user is trying to use an AI tool that generates technical design documents for software projects. The tool expects a description of a software application. It is not a general-purpose question-answering AI.

<UserPrompt>
{user_idea}
</UserPrompt>
</Context>

<Task>
Analyze the user's prompt and classify it. You must determine if the prompt is a plausible software project idea or if it's a question that is out of scope.

- A **project idea** describes an application, a system, or a piece of software to be built.
    - Examples: "An app for tracking my workouts", "A website that lets users book appointments with barbers", "A clone of instagram but for cats".
- An **out-of-scope question** is a general knowledge question, a request for information that isn't about building a specific piece of software, or a command.
    - Examples: "What is the capital of France?", "Who is the current president?", "Write me a poem", "How does a blockchain work?".
</Task>

<OutputFormat>
Respond with a single, valid JSON object and nothing else.
- If the prompt is a plausible software project idea, the JSON should be: `{{ "is_project_idea": true, "reason": "The user has provided a valid project idea." }}`
- If the prompt is an out-of-scope question, the JSON should be: `{{ "is_project_idea": false, "reason": "This is a general question, not a software project idea. Please describe an application you want to build." }}`
</OutputFormat>
"""

ValidatorPrompt = PromptTemplate.from_template(VALIDATOR_PROMPT_TEMPLATE)

TDD_PROMPT_TEMPLATE = system_prompt + """

<Context>
A user has provided the following details for their project. Using this information, generate a comprehensive, developer-ready Technical Design Document (TDD) based on user-provided information.:
- **Initial Idea:** {user_idea}
- **Application Type:** {platform}
- **Clarifying Questions & Answers:** 
{questions_and_answers}
- **Final User Clarifications:** {final_clarification}
</Context>

<Task>
Your task is to synthesize all the provided information into a complete TDD. You MUST follow the Markdown structure and content guidelines from the example below. Populate each section of the template with relevant, specific, and actionable details derived from the user's input. Be decisive in your technology choices, backing them up with clear rationale.

Where the user's input is ambiguous or lacking, you must make intelligent, well-reasoned assumptions based on the overall project goal. For instance, if a user describes a "social media app" but doesn't specify authentication, you should include a standard authentication section (e.g., email/password and social logins) and state it as a necessary component.

IMPORTANT: Produce **GitHub-flavored Markdown** syntax exactly as shown in the example—use `#` and `##` for headings, `-` for bullet lists, numbered lists beginning with `1.`, and tables defined with pipes (`|`).
</Task>

<OutputFormat>
Respond with a single, valid JSON object and nothing else. You must follow the provided structure precisely. The JSON object must contain a single key, "tdd", which holds the complete TDD as a multi-line Markdown string. Do not include any explanatory text or any characters before or after the JSON object.
</OutputFormat>

<ExampleTDD>
# Technical Design Document: [Name of User's Application]

**Version:** 1.0
**Status:** DRAFT

## 1. Introduction

### 1.1. Project Overview

(Provide a concise, one-paragraph summary of the application's purpose and primary function based on the user's idea.)

### 1.2. Problem Statement

(Describe the core problem the application intends to solve.)

### 1.3. Goals and Objectives

(List 3-5 key objectives of the application in a bulleted list. These should be SMART: Specific, Measurable, Achievable, Relevant, Time-bound where possible.)

### 1.4. Scope

(Detail what is in scope for the initial version.)

### 1.5. Out of Scope (Non-Goals)

(List features or functionalities that are explicitly out of scope for the first version to manage project scope.)

## 2. Business Processes

(Describe the key user flows and business processes. For major processes, provide a step-by-step description.)

### 2.1. [Business Process 1 Name, e.g., User Registration & Onboarding]

1.  Step 1...
2.  Step 2...
3.  Step 3...

### 2.2. [Business Process 2 Name, e.g., Core Feature Workflow]

(Description or steps)

## 3. System Architecture and Design

### 3.1. High-Level Architecture

(Describe the overall architectural pattern, e.g., client-server, microservices, etc. An architecture diagram using Mermaid is highly recommended here to visualize component interaction.)

### 3.2. Technology Stack

(Fill out a markdown table with specific and actionable recommendations. For example, instead of "React", suggest "Next.js (React Framework)" or "React (Vite)". Provide a clear rationale for each choice, referencing the user's priorities like scalability, security, or cost-effectiveness.)

| Layer      | Technology | Rationale |
| :--------- | :--------- | :-------- |
| Frontend   |            |           |
| Backend    |            |           |
| Database   |            |           |
| AI Service |            |           |
| Deployment |            |           |

### 3.3. Design Considerations

#### 3.3.1. Scalability and Performance

(How will the system handle growth? What are the expected response times? Mention strategies like caching, load balancing, or database indexing.)

#### 3.3.2. Usability and User Interface (UI)

(Describe key UI/UX considerations. E.g., "The application will have a responsive design, prioritizing mobile-first access. The interface will be clean and intuitive, requiring minimal user onboarding.")

## 4. Data Model and Management

### 4.1. Core Entities

(List the primary data objects in the system, e.g., User, Post, Product.)

### 4.2. Schema Definitions

(For each core entity, define its fields, types, and relationships. Be specific.)

#### [Entity 1 Name]

- `id` (Primary Key)
- ...

#### [Entity 2 Name]

- `id` (Primary Key)
- ...

### 4.3. Data Migration

(Outline the strategy for data migration if applicable. If not applicable, state that this is a new system with no data migration required.)

## 5. Integration and API Design

### 5.1. API Endpoints (RESTful)

(Define at least two key API endpoints. Specify the HTTP method, path, description, and example request/response bodies.)

#### `METHOD /api/path`

- **Description**: ...
- **Request Body**: ...
- **Response (200 OK)**: ...

### 5.2. External Services/Integrations

(List any third-party services that will be integrated, e.g., Stripe for payments, SendGrid for emails. Describe the purpose of each integration.)

## 6. Security

### 6.1. Authentication and Authorization

(Describe the proposed strategy for user authentication and authorization. Recommend specific technologies, e.g., Supabase Auth, NextAuth.js, JWTs. Detail the user roles and permissions if applicable.)

### 6.2. Security Considerations

(List at least three specific security best practices relevant to the application, such as input validation, secrets management, data encryption (at rest and in transit), and dependency scanning.)

## 7. Reporting and Analytics

(Outline the approach for collecting, storing, and visualizing key application metrics and user data. Mention any specific reports or dashboards to be created and the tools for them, e.g., Google Analytics, custom dashboards with Chart.js.)

## 8. Deployment and Operations

### 8.1. CI/CD Pipeline

(Outline a plan for Continuous Integration and Continuous Deployment. Recommend specific platforms or tools, e.g., Vercel, GitHub Actions.)

### 8.2. Logging and Monitoring

(Describe the strategy for logging application events and monitoring system health. Recommend specific tools, e.g., Sentry for error tracking, Prometheus/Grafana for performance monitoring.)

## 9. Risks and Mitigations

### 9.1. [Risk Category 1, e.g., Security]

- **Risk**: (Describe a potential risk)
- **Mitigation**: (Describe the strategy to mitigate this risk)

### 9.2. [Risk Category 2, e.g., Scalability]

- **Risk**: (Describe a potential risk)
- **Mitigation**: (Describe the strategy to mitigate this risk)
</ExampleTDD>
"""

TDDGeneratorPrompt = PromptTemplate.from_template(TDD_PROMPT_TEMPLATE)
