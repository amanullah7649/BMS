# Test Task Node

## NestJS Backend Developer - Coding Challenge

**Objective:** Develop a simple RESTful API for a "Book Management System" using NestJS. The system should allow for managing books and their authors.

### Requirements

#### Project Setup
- Initialize a new NestJS project.
- Use TypeScript.
- Choose a database (e.g., PostgreSQL, MongoDB, SQLite). For simplicity, you can use SQLite with TypeORM/Mongoose for this task, but mention what database you'd typically prefer and why.

#### Core Entities

**Author:**
- id (unique identifier)
- firstName (string, required)
- lastName (string, required)
- bio (string, optional)
- birthDate (Date, optional)
- createdAt (Date, auto-generated)
- updatedAt (Date, auto-generated)

**Book:**
- id (unique identifier)
- title (string, required)
- isbn (string, unique, required, e.g., "978-3-16-148410-0")
- publishedDate (Date, optional)
- genre (string, optional, e.g., "Fantasy", "Science Fiction", "Thriller")
- author (relation to an Author, required)
- createdAt (Date, auto-generated)
- updatedAt (Date, auto-generated)

#### API Endpoints

**Authors:**
- `POST /authors`: Create a new author.
  - Request body: `{ "firstName": "John", "lastName": "Doe", "bio": "...", "birthDate": "YYYY-MM-DD" }`
  - Response: The created author object.
- `GET /authors`: Get a list of all authors.
  - Supports optional query parameters for pagination (page, limit) and searching by firstName or lastName (partial match, case-insensitive).
- `GET /authors/:id`: Get a single author by ID.
  - Response: The author object or 404 if not found.
- `PATCH /authors/:id`: Update an existing author by ID.
  - Request body: Partial author object (e.g., `{ "bio": "Updated bio" }`)
  - Response: The updated author object or 404 if not found.
- `DELETE /authors/:id`: Delete an author by ID.
  - Response: 204 No Content on successful deletion, or 404 if not found. (Consider implications if an author has associated books).

**Books:**
- `POST /books`: Create a new book.
  - Request body: `{ "title": "The Great Novel", "isbn": "...", "publishedDate": "YYYY-MM-DD", "genre": "...", "authorId": "..." }`
  - authorId should reference an existing author. If the author doesn't exist, return a 400 Bad Request.
  - Response: The created book object (including the linked author information).
- `GET /books`: Get a list of all books.
  - Supports optional query parameters for pagination (page, limit), searching by title or isbn (partial match, case-insensitive), and filtering by authorId.
- `GET /books/:id`: Get a single book by ID.
  - Response: The book object (including the linked author information) or 404 if not found.
- `PATCH /books/:id`: Update an existing book by ID.
  - Request body: Partial book object (e.g., `{ "genre": "Sci-Fi" }`)
  - Response: The updated book object or 404 if not found.
- `DELETE /books/:id`: Delete a book by ID.
  - Response: 204 No Content on successful deletion, or 404 if not found.

#### Data Validation
- Implement DTOs (Data Transfer Objects) for all incoming request bodies using class-validator and class-transformer.
- Ensure all required fields are validated.
- Validate data types (e.g., isString, isDateString, isISBN).
- Handle validation errors gracefully, returning appropriate HTTP status codes (e.g., 400 Bad Request).

#### Error Handling
- Implement custom exception filters or use NestJS's built-in exception layer to handle common errors (e.g., 404 Not Found, 400 Bad Request due to validation, 409 Conflict for unique constraints like ISBN).
- Ensure consistent error response format (e.g., `{ "statusCode": 404, "message": "Author not found", "error": "Not Found" }`).

#### Testing
- Write unit tests for at least one service (e.g., AuthorsService or BooksService) covering basic CRUD operations. Use Jest (default NestJS testing framework) and mocking.
- Write at least one end-to-end (e2e) test for a critical API endpoint (e.g., creating an author and then retrieving it). Use Supertest.
