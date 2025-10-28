# Architecture Documentation

## Overview

This project implements a **Clean Architecture** approach with clear separation of concerns across multiple layers.

## Backend Architecture

### Layers

```
┌─────────────────────────────────────────┐
│           API Layer                      │
│  (Controllers, Middleware, Startup)      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Application Layer                 │
│  (Use Cases, DTOs, MediatR Handlers)     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      Infrastructure Layer                │
│  (Repositories, Data Access)             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Domain Layer                     │
│  (Entities, Interfaces, Business Rules)  │
└─────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. Domain Layer (`RealEstate.Domain`)
- **Purpose**: Core business logic and entities
- **Contains**:
  - Domain entities (Property, Owner, PropertyImage, PropertyTrace)
  - Repository interfaces
  - Domain events (if needed)
- **Dependencies**: None (pure business logic)

#### 2. Application Layer (`RealEstate.Application`)
- **Purpose**: Use cases and application logic
- **Contains**:
  - DTOs (Data Transfer Objects)
  - MediatR queries and handlers (CQRS)
  - AutoMapper profiles
  - Validation logic
- **Dependencies**: Domain layer only

#### 3. Infrastructure Layer (`RealEstate.Infrastructure`)
- **Purpose**: External concerns (database, external services)
- **Contains**:
  - Repository implementations
  - MongoDB configuration
  - External service integrations
- **Dependencies**: Domain and Application layers

#### 4. API Layer (`RealEstate.API`)
- **Purpose**: HTTP interface
- **Contains**:
  - Controllers
  - Middleware (exception handling)
  - Dependency injection configuration
  - API documentation (Swagger)
- **Dependencies**: All other layers

### Design Patterns

#### CQRS (Command Query Responsibility Segregation)
- **Queries**: Read operations (GetPropertiesQuery, GetPropertyByIdQuery)
- **Commands**: Write operations (if needed in future)
- **Handler**: MediatR handles routing and execution

Example:
```csharp
// Query
public class GetPropertiesQuery : IRequest<IEnumerable<PropertyDto>>
{
    public string? Name { get; set; }
    // ... other filters
}

// Handler
public class GetPropertiesQueryHandler
    : IRequestHandler<GetPropertiesQuery, IEnumerable<PropertyDto>>
{
    // Implementation
}
```

#### Repository Pattern
- Abstracts data access logic
- Provides testable interfaces
- Centralizes query optimization

Example:
```csharp
public interface IPropertyRepository
{
    Task<IEnumerable<Property>> GetAllAsync(...);
    Task<Property?> GetByIdAsync(string id);
}
```

#### Dependency Injection
- All dependencies are injected via constructor
- Configured in `Program.cs`
- Promotes loose coupling and testability

## Frontend Architecture

### Structure

```
frontend/
├── app/              # Next.js App Router (pages)
├── components/       # Reusable React components
├── services/         # API service layer
├── lib/              # Utilities and configurations
└── types/            # TypeScript type definitions
```

### Key Patterns

#### Server Components vs Client Components
- **Server Components**: Default, run on server, no JavaScript sent to client
- **Client Components**: Use `'use client'`, for interactivity

#### Data Fetching Strategy
- **TanStack Query**: For server state management
- **Benefits**:
  - Automatic caching
  - Background refetching
  - Loading and error states
  - Optimistic updates

Example:
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['properties', filters],
  queryFn: () => propertyService.getProperties(filters)
});
```

#### Form Handling
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- Type-safe validation

## Data Flow

### Property Listing Flow

```
User → PropertyList (Client Component)
  ↓
  TanStack Query
  ↓
  propertyService.getProperties()
  ↓
  Axios (HTTP GET /api/properties)
  ↓
  PropertiesController
  ↓
  MediatR (GetPropertiesQuery)
  ↓
  GetPropertiesQueryHandler
  ↓
  PropertyRepository (MongoDB)
  ↓
  Response: PropertyDto[]
```

### Property Detail Flow

```
User clicks property → Navigate to /properties/[id]
  ↓
  PropertyDetailPage
  ↓
  TanStack Query
  ↓
  propertyService.getPropertyById(id)
  ↓
  Axios (HTTP GET /api/properties/{id})
  ↓
  PropertiesController
  ↓
  MediatR (GetPropertyByIdQuery)
  ↓
  GetPropertyByIdQueryHandler
  ↓
  PropertyRepository + OwnerRepository + ImageRepository
  ↓
  Response: PropertyDetailDto
```

## Database Schema

### Collections

#### Owners
```json
{
  "_id": ObjectId,
  "name": String,
  "address": String,
  "photo": String,
  "birthday": Date
}
```

#### Properties
```json
{
  "_id": ObjectId,
  "name": String,
  "address": String,
  "price": Decimal,
  "codeInternal": String,
  "year": Int32,
  "idOwner": ObjectId
}
```

#### PropertyImages
```json
{
  "_id": ObjectId,
  "idProperty": ObjectId,
  "file": String,
  "enabled": Boolean
}
```

#### PropertyTraces
```json
{
  "_id": ObjectId,
  "idProperty": ObjectId,
  "dateSale": Date,
  "name": String,
  "value": Decimal,
  "tax": Decimal
}
```

### Indexes

**Properties Collection:**
- `name` (ascending) - for name searches
- `address` (ascending) - for address searches
- `price` (ascending) - for price range queries

**PropertyImages Collection:**
- `idProperty` (ascending) - for image lookups

## Error Handling

### Backend
- **Global Exception Middleware**: Catches all unhandled exceptions
- **Structured Responses**: Consistent error format
- **Logging**: All errors logged for debugging

### Frontend
- **Error Boundaries**: Catch React component errors
- **Query Error States**: TanStack Query error handling
- **User-Friendly Messages**: Clear error messages to users

## Performance Optimizations

### Backend
- **MongoDB Indexes**: Optimized query performance
- **Async/Await**: Non-blocking I/O operations
- **Projection**: Fetch only needed fields
- **Connection Pooling**: MongoDB driver handles connection pool

### Frontend
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: TanStack Query caching strategy
- **Lazy Loading**: Images loaded on demand

## Security Considerations

### Backend
- **Input Validation**: Query parameter validation
- **Error Messages**: No sensitive data in errors
- **CORS**: Configured for specific origins

### Frontend
- **Environment Variables**: API URL from env vars
- **Type Safety**: TypeScript prevents type errors
- **XSS Protection**: React escapes output by default

## Testing Strategy

### Backend Tests
- **Unit Tests**: Test handlers and business logic
- **Mocking**: Mock repositories with Moq
- **NUnit**: Test framework
- **Coverage**: Aim for 80%+ coverage

### Frontend Tests
- **Component Tests**: Test rendering and interactions
- **Utility Tests**: Test helper functions
- **Jest**: Test framework
- **React Testing Library**: Component testing

## Deployment

### Development
- Local MongoDB instance
- .NET development server
- Next.js dev server

### Production (Docker)
- MongoDB container
- Backend container (.NET API)
- Frontend container (Next.js)
- Docker Compose orchestration

## Future Enhancements

1. **Authentication/Authorization**: Add user login
2. **Image Upload**: Allow property image uploads
3. **Advanced Search**: Geo-location search
4. **Real-time Updates**: SignalR for live updates
5. **Caching Layer**: Redis for API caching
6. **CI/CD Pipeline**: Automated testing and deployment
