HMCTS TASK MANAGEMENT SYSTEM
============================

Overview  
This project provides:

- A Java Spring Boot backend exposing a REST API for task management
- A React frontend offering a clean, user-friendly interface
- Full CRUD functionality
- Validation on both frontend and backend
- API documentation via Swagger
- Unit tests using Mockito
- H2 in-memory database for development and testing

The system is designed to be simple, readable, and aligned with typical HMCTS service patterns.

------------------------------------------------------------

FEATURES

Backend
- Create tasks with:  
  TaskID  
  Title  
  Description  
  Status  
  Due date and time

Users can:
- Retrieve a task by ID
- Retrieve all tasks
- Update task status, description and title
- Update due date/time
- Delete tasks
- Automatically move overdue tasks into the “Completed” section

Validation includes:
- Title required
- Description required
- Due date must be in the future
- Due time must be in the future

Additional backend features:
- Structured error responses
- Unit tests using Mockito
- Swagger UI for API documentation

Frontend
- React GUI
- Create new tasks
- Update existing tasks (only when a valid ID is provided)
- Delete tasks using a trash icon
- Mark tasks complete/incomplete using a circular toggle icon
- Search tasks by ID
- View completed tasks on a dedicated page
- Navigation via tabs
- Validation preventing invalid submissions
- Overdue tasks automatically marked as completed
- Clean, readable UI designed around basic CRUD operations

------------------------------------------------------------

TECH STACK

Backend  
Java  
Spring Boot  
Spring Web  
Spring Data JPA  
H2 Database  
Mockito / JUnit  
Swagger / OpenAPI

Frontend  
React (Hooks)  
Axios  
Vite  
CSS modules or standard CSS

------------------------------------------------------------

HOW TO RUN THE APPLICATION

1. Prerequisites  
   Install:
- Java 21
- Node.js 18+
- Docker Desktop
- Git

2. Start the PostgreSQL Database (Docker)  
   From the project root run:  
   docker compose up -d

Check the container is running:  
docker ps

Hibernate will automatically generate the schema.

3. Run the Spring Boot Backend  
   cd backend  
   ./gradlew bootRun

Backend runs at:  
http://localhost:8082

Swagger UI:  
http://localhost:8082/swagger-ui/index.html

4. Run the React Frontend  
   cd frontend  
   npm install  
   npm run dev

Frontend runs at:  
http://localhost:5173

The frontend communicates with the backend at:  
http://localhost:8082/tasks

5. Run Backend Tests  
   ./gradlew test

6. Stop the Application  
   Stop backend/frontend with CTRL + C  
   Stop database:  
   docker compose down

------------------------------------------------------------

DATABASE  
The backend uses an H2 in-memory database for development and testing.  
Schema is generated automatically by JPA.

H2 Console:  
http://localhost:8082/h2-console

------------------------------------------------------------

API ENDPOINTS

POST /tasks – Create a new task  
GET /tasks/{id} – Retrieve a task by ID  
GET /tasks – Retrieve all tasks  
PATCH /tasks/{id}/status – Update task status  
PATCH /tasks/{id}/due-date – Update due date/time  
DELETE /tasks/{id} – Delete a task

Full documentation available via Swagger.

------------------------------------------------------------

TESTING  
Backend tests use JUnit + Mockito to validate:
- Service logic
- Validation behaviour
- Repository interactions
- Custom error handling

Run tests:  
./gradlew test

------------------------------------------------------------

FRONTEND UI OVERVIEW
- Task List Page – view all active tasks
- Create Task Page – add new tasks with validation
- Update Task Page – update tasks by entering a valid ID
- Search Page – search tasks by ID
- Completed Page – view completed or overdue tasks

Task icons:
- Circle icon – toggle complete/incomplete
- Trash icon – delete task

Navigation is via a tab bar.

------------------------------------------------------------

VALIDATION AND ERROR HANDLING  
Both frontend and backend enforce:
- Required fields
- Future due date/time
- Prevention of invalid updates
- Meaningful error messages
- Warnings when updating non-existent tasks

------------------------------------------------------------

FUTURE IMPROVEMENTS
- Accessibility improvements
- Integration tests
- Responsive UI
- Additional security features

------------------------------------------------------------
