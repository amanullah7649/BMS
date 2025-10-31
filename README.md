# Book Management System (BMS)

A RESTful API for managing books and authors built with NestJS, TypeScript, and MongoDB.

## 📋 Prerequisites

- Node.js (v18+)
- Docker & Docker Compose
- npm or yarn

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd bms
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/book_management?authSource=admin
PORT=3000
NODE_ENV=development
```

### 3. Start Database (Docker)

```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# Verify containers are running
docker ps
```

**Access:**
- MongoDB: `localhost:27017`
- Mongo Express (UI): `http://localhost:8081`
  - Username: `admin`
  - Password: `admin123`

### 4. Run Application

```bash
# Development mode (with auto-reload)
npm run start:dev

# Production mode
npm run start:prod
```

API will be available at: `http://localhost:3000`

---

## 🧪 Testing

### Unit Tests

Run unit tests for services (AuthorsService, BooksService):

```bash
# Run all unit tests
npm test

# Run specific test file
npm test -- books.service.spec.ts

# Run with coverage
npm run test:cov

# Watch mode
npm run test:watch
```

### E2E Tests

**Setup:**

1. Create `.env.e2e` file:

```env
MONGODB_URI=mongodb://admin:admin123@localhost:27017/book_management_test?authSource=admin
PORT=3001
NODE_ENV=test
```

2. Ensure MongoDB is running:

```bash
docker-compose up -d mongodb
```

**Run E2E Tests:**

```bash
# Run all E2E tests
npm run test:e2e

# Run with verbose output
npm run test:e2e -- --verbose
```

---

## 🐳 Docker

### Full Stack with Docker Compose

```bash
# Start all services (MongoDB + Mongo Express)
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build
```

### Services

| Service | Port | Description |
|---------|------|-------------|
| MongoDB | 27017 | Database |
| Mongo Express | 8081 | Database UI |

---

## 📚 API Documentation

### Authors Endpoints

```bash
# Create author
POST   /authors

# Get all authors (with pagination & search)
GET    /authors?page=1&limit=10&firstName=John

# Get author by ID
GET    /authors/:id

# Update author
PATCH  /authors/:id

# Delete author
DELETE /authors/:id
```

### Books Endpoints

```bash
# Create book
POST   /books

# Get all books (with pagination & filters)
GET    /books?page=1&limit=10&title=Book&authorId=xxx

# Get book by ID (with author info)
GET    /books/:id?expand=author

# Update book
PATCH  /books/:id

# Delete book
DELETE /books/:id
```

---

## 📁 Project Structure

```
bms/
├── src/
│   ├── common/          # Shared utilities, filters, helpers
│   ├── config/          # Configuration files
│   ├── database/        # Database module & providers
│   ├── modules/
│   │   ├── authors/     # Author module (controller, service, repository, DTOs)
│   │   └── books/       # Book module (controller, service, repository, DTOs)
│   └── main.ts          # Application entry point
├── test/                # E2E tests
├── docker-compose.yml   # Docker services configuration
├── .env                 # Development environment variables
├── .env.e2e            # E2E test environment variables
└── package.json
```

---

## 🛠️ Development Scripts

```bash
# Development
npm run start:dev        # Start with hot-reload
npm run start:debug      # Start in debug mode

# Build
npm run build           # Build for production

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format code with Prettier

# Testing
npm test                # Run unit tests
npm run test:cov        # Run tests with coverage
npm run test:e2e        # Run E2E tests
```

---

## 🔧 Database Choice

**Using:** MongoDB with Mongoose

**Why MongoDB:**
- I have strong experience with NoSQL databases, while also being familiar with traditional SQL databases.
---

## ✅ Features

- ✅ RESTful API with NestJS
- ✅ MongoDB with Mongoose ODM
- ✅ Data validation with class-validator
- ✅ Global exception filtering
- ✅ Pagination & search filters
- ✅ Unit tests (Jest)
- ✅ E2E tests (Supertest)
- ✅ Docker containerization
- ✅ TypeScript path aliases
- ✅ ISBN validation
- ✅ 409 Conflict handling (duplicate ISBN)

---

## 📝 Example Requests

### Create Author

```bash
curl -X POST http://localhost:3000/authors \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "bio": "A prolific writer",
    "birthDate": "1980-05-20"
  }'
```

### Create Book

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Great Novel",
    "isbn": "978-3-16-148410-0",
    "publishedDate": "2024-01-15",
    "genre": "Fantasy",
    "authorId": "<AUTHOR_ID_HERE>"
  }'
```

### Get Books with Filter

```bash
curl "http://localhost:3000/books?page=1&limit=10&authorId=<AUTHOR_ID>"
```
