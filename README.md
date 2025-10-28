# Real Estate Application
https://m-react-two.vercel.app/
A full-stack real estate property management application built with .NET 8, MongoDB, and Next.js 14.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Development](#development)

## Overview

This application provides a comprehensive solution for managing and browsing real estate properties. It features a clean architecture backend with .NET 8, MongoDB for data persistence, and a modern, responsive frontend built with Next.js 14 and TypeScript.

## Features

### Backend
- RESTful API built with .NET 8
- Clean Architecture (Domain, Application, Infrastructure, API layers)
- MongoDB integration with optimized queries
- CQRS pattern using MediatR
- Repository pattern for data access
- AutoMapper for DTO mappings
- Global exception handling
- Comprehensive logging
- Swagger/OpenAPI documentation
- Unit tests with NUnit

### Frontend
- Next.js 14 with App Router
- TypeScript for type safety
- Responsive UI with Tailwind CSS
- TanStack Query for data fetching
- React Hook Form with Zod validation
- Server and Client Components
- Image optimization with Next.js Image
- Jest and React Testing Library tests

### Functionality
- **Property Search**: Filter properties by name, address, and price range
- **Property Listing**: Browse all available properties with images
- **Property Details**: View detailed information including owner details
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Image Gallery**: Multiple images per property

## Tech Stack

### Backend
- **Framework**: .NET 8
- **Language**: C# 12
- **Database**: MongoDB 7.0+
- **ORM**: MongoDB.Driver
- **API Documentation**: Swagger/Swashbuckle
- **Testing**: NUnit, Moq
- **Patterns**: Clean Architecture, CQRS, Repository Pattern

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Testing**: Jest, React Testing Library
- **Icons**: Lucide React

## Architecture

### Backend Architecture

```
backend/
├── src/
│   ├── RealEstate.Domain/         # Entities and interfaces
│   ├── RealEstate.Application/    # Business logic, DTOs, MediatR handlers
│   ├── RealEstate.Infrastructure/ # Data access, repositories
│   └── RealEstate.API/           # Controllers, middleware
└── tests/
    └── RealEstate.Tests.Unit/    # Unit tests
```

**Layers:**
1. **Domain**: Core business entities and repository interfaces
2. **Application**: Use cases, DTOs, query/command handlers (CQRS)
3. **Infrastructure**: MongoDB repositories, data persistence
4. **API**: REST endpoints, middleware, configuration

### Frontend Architecture

```
frontend/
└── src/
    ├── app/                 # Next.js App Router pages
    ├── components/          # React components
    ├── services/           # API service layer
    ├── lib/                # Utilities and configurations
    └── types/              # TypeScript type definitions
```

## Getting Started

### Prerequisites

- **.NET 8 SDK**: [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **MongoDB 7.0+**: [Download](https://www.mongodb.com/try/download/community)
- **Node.js 18+**: [Download](https://nodejs.org/)
- **MongoDB Database Tools**: [Download](https://www.mongodb.com/try/download/database-tools) (for import/export)

### Installation

#### 1. Clone the repository

```bash
git clone <repository-url>
cd real-estate-app
```

#### 2. Set up MongoDB

**Start MongoDB** (if not running):
```bash
mongod
```

**Import seed data**:
```bash
cd database-backup
chmod +x import-data.sh
./import-data.sh
```

> **Note**: The import script requires `jq` and `mongoimport`. Install them:
> - macOS: `brew install jq mongodb-database-tools`
> - Ubuntu: `sudo apt-get install jq mongodb-database-tools`
> - Windows: Download from official sites

#### 3. Set up Backend

```bash
cd backend

# Restore dependencies
dotnet restore

# Build the solution
dotnet build

# Run tests
dotnet test

# Run the API (from RealEstate.API directory)
cd src/RealEstate.API
dotnet run
```

The API will be available at: `https://localhost:5001` (or `http://localhost:5000`)

**Swagger UI**: Navigate to `https://localhost:5001` to access the API documentation.

#### 4. Set up Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will be available at: `http://localhost:3000`

### Configuration

#### Backend Configuration

Edit `backend/src/RealEstate.API/appsettings.json`:

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RealEstateDb"
  }
}
```

#### Frontend Configuration

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── RealEstate.Domain/
│   │   ├── Entities/              # Domain models
│   │   └── Interfaces/            # Repository interfaces
│   │
│   ├── RealEstate.Application/
│   │   ├── DTOs/                  # Data Transfer Objects
│   │   ├── Features/              # CQRS queries and handlers
│   │   └── Mappings/              # AutoMapper profiles
│   │
│   ├── RealEstate.Infrastructure/
│   │   ├── Persistence/           # MongoDB settings
│   │   └── Repositories/          # Repository implementations
│   │
│   └── RealEstate.API/
│       ├── Controllers/           # API endpoints
│       ├── Middleware/            # Global exception handling
│       └── Program.cs             # Application startup
│
└── tests/
    └── RealEstate.Tests.Unit/     # Unit tests
```

### Frontend Structure

```
frontend/
└── src/
    ├── app/
    │   ├── page.tsx               # Home page
    │   ├── properties/[id]/       # Property detail page
    │   ├── layout.tsx             # Root layout
    │   └── providers.tsx          # React Query provider
    │
    ├── components/
    │   ├── PropertyCard.tsx       # Property card component
    │   ├── PropertyFilters.tsx    # Filter form component
    │   └── PropertyList.tsx       # Property list with filters
    │
    ├── services/
    │   └── propertyService.ts     # API service functions
    │
    ├── lib/
    │   ├── axios.ts               # Axios instance
    │   └── utils.ts               # Utility functions
    │
    └── types/
        └── property.ts            # TypeScript types
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Get All Properties
```http
GET /api/properties
```

**Query Parameters:**
- `name` (optional): Filter by property name (case-insensitive partial match)
- `address` (optional): Filter by address (case-insensitive partial match)
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Example:**
```bash
GET /api/properties?name=house&minPrice=100000&maxPrice=500000
```

**Response:**
```json
[
  {
    "idProperty": "65a1b2c3d4e5f6789def0001",
    "idOwner": "65a1b2c3d4e5f6789abc0001",
    "name": "Beautiful House",
    "address": "123 Main St",
    "price": 250000,
    "image": "https://example.com/image.jpg"
  }
]
```

#### Get Property by ID
```http
GET /api/properties/{id}
```

**Response:**
```json
{
  "idProperty": "65a1b2c3d4e5f6789def0001",
  "name": "Beautiful House",
  "address": "123 Main St",
  "price": 250000,
  "codeInternal": "BH-001",
  "year": 2020,
  "image": "https://example.com/image1.jpg",
  "owner": {
    "idOwner": "65a1b2c3d4e5f6789abc0001",
    "name": "John Doe",
    "address": "456 Owner St",
    "photo": "https://example.com/owner.jpg"
  },
  "additionalImages": [
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ]
}
```

### Interactive API Documentation

Access the Swagger UI at `https://localhost:5001` for interactive API documentation and testing.

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
dotnet test

# Run tests with coverage
dotnet test /p:CollectCoverage=true
```

**Test Coverage:**
- Repository query handlers
- Filter logic
- DTO mappings
- Edge cases (null values, empty results)

### Frontend Tests

```bash
cd frontend

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

**Test Coverage:**
- Component rendering
- User interactions
- Utility functions
- API service mocking

## Development

### Backend Development

**Running in development mode:**
```bash
cd backend/src/RealEstate.API
dotnet watch run
```

**Adding migrations or new features:**
1. Create entities in `Domain/Entities`
2. Add interfaces in `Domain/Interfaces`
3. Implement repositories in `Infrastructure/Repositories`
4. Create DTOs in `Application/DTOs`
5. Add query handlers in `Application/Features`
6. Create controllers in `API/Controllers`
7. Write unit tests

### Frontend Development

**Running in development mode:**
```bash
cd frontend
npm run dev
```

**Code formatting:**
```bash
npm run lint
```

**Building for production:**
```bash
npm run build
npm start
```

## Docker Setup

Docker configuration files are included for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d

# Stop services
docker-compose down
```

## Database Backup

### Export Data
```bash
cd database-backup
chmod +x export-data.sh
./export-data.sh
```

This creates a timestamped backup folder with all collections.

### Import Data
```bash
cd database-backup
chmod +x import-data.sh
./import-data.sh
```

## Contributing

1. Follow Clean Code principles
2. Write unit tests for new features
3. Update documentation
4. Follow the existing code style

## Code Standards

### Backend
- Use async/await for all database operations
- Follow SOLID principles
- Use dependency injection
- Add XML documentation comments
- Keep controllers thin, logic in handlers

### Frontend
- Use TypeScript strict mode
- Follow React best practices
- Use functional components
- Implement proper error handling
- Keep components small and focused
