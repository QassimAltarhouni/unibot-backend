# UniBot Backend

UniBot Backend is the server-side application for **UniBot**, a multilingual AI-based university assistant designed for students at Wroclaw University of Science and Technology.

The project was developed as an educational backend application and is built on my reusable **Golden Backend** template. I used that base architecture to avoid rebuilding common backend functionality from scratch, then extended it with the features needed for UniBot, including authentication, role management, database operations, real-time communication, API documentation, and AI integration.

## What the project includes

The backend provides the main services required by the UniBot application:

* REST API built with **Express** and **TypeScript**
* **MongoDB** database integration using Mongoose and Typegoose
* User registration and authentication
* JWT-based access and refresh tokens
* Role and permission management
* User, category, and to-do list operations
* Real-time chatbot communication using **Socket.IO**
* Integration with **Google Gemini**
* Conversation handling for the UniBot chatbot
* Request validation using **Zod**
* Password hashing with **bcrypt**
* API documentation using **Swagger**
* Logging and common error-handling utilities

## Tech stack

| Technology           | Usage                           |
| -------------------- | ------------------------------- |
| TypeScript           | Main backend language           |
| Node.js              | Runtime environment             |
| Express              | REST API and server             |
| MongoDB              | Application database            |
| Mongoose / Typegoose | Database models and access      |
| Socket.IO            | Real-time chatbot communication |
| Google Gemini        | AI chatbot integration          |
| JWT                  | Authentication                  |
| Zod                  | Request validation              |
| bcrypt               | Password hashing                |
| Swagger              | API documentation               |

## Project structure

The project separates the main backend responsibilities into dedicated modules.

```text
src/
├── common/
│   └── utils/
├── core/
│   ├── model/
│   ├── schema/
│   └── service/
├── middleware/
├── presentations/
├── routes/
├── socketServer.ts
└── app.ts
```

### Core

Contains the application's main models, validation schemas, and business services.

### Routes

Defines the HTTP endpoints exposed by the backend.

### Middleware

Contains shared middleware for tasks such as authentication, permission checking, and request validation.

### Presentations

Contains request handlers and controllers responsible for processing API requests and returning responses.

### Common utilities

Contains reusable functionality such as database connection helpers, JWT utilities, logging, email helpers, response wrappers, and error handling.

### Socket server

Handles the real-time communication between the UniBot client and the chatbot service through Socket.IO.

##  Getting started

### Requirements

Make sure the following tools are installed:

* Node.js 18 or later
* Git
* npm or yarn
* MongoDB

### Clone the repository

```bash
git clone https://github.com/QassimAltarhouni/unibot-backend.git
cd unibot-backend
```

### Install dependencies

Using npm:

```bash
npm install
```

or Yarn:

```bash
yarn install
```

### Run in development

```bash
npm run dev
```

### Build the project

```bash
npm run build
```

### Start the built application

```bash
npm run start
```

## Available scripts

| Command          | Purpose                             |
| ---------------- | ----------------------------------- |
| `npm run dev`    | Run the backend in development mode |
| `npm run build`  | Compile the TypeScript project      |
| `npm run start`  | Start the compiled backend          |
| `npm run format` | Format source files with Prettier   |

## API and chatbot

The application combines standard REST endpoints with real-time chatbot communication.

REST endpoints are used for application functionality such as authentication, users, roles, categories, and to-do lists.

The chatbot uses Socket.IO for real-time communication. Messages are handled by the chatbot service, which combines the user's conversation context with university-related category data and sends the resulting request to Google Gemini.

Swagger is also included in the project to make the HTTP API easier to inspect and test during development.

## Purpose of the project

UniBot is primarily an educational project used to explore how several backend concepts can work together in one application.

The project gave me practical experience with:

* designing a TypeScript backend structure
* building REST APIs
* working with MongoDB
* implementing authentication and authorization
* managing reusable backend services
* using WebSockets for real-time communication
* connecting an LLM to a web application
* structuring application data for chatbot use
* documenting and testing APIs during development

## Author

**Mohammed Altarhouni**

GitHub: [QassimAltarhouni](https://github.com/QassimAltarhouni)

## License

MIT
