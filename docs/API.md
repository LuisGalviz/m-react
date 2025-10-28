# API Documentation

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, the API does not require authentication. This can be added in future versions.

## Response Format

All API responses follow this structure:

### Success Response
```json
{
  "data": { /* response data */ },
  "statusCode": 200
}
```

### Error Response
```json
{
  "statusCode": 500,
  "message": "An error occurred while processing your request.",
  "detailed": "Detailed error message"
}
```

## Endpoints

### Properties

#### Get All Properties

Retrieve a list of properties with optional filters.

**Endpoint**: `GET /api/properties`

**Query Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| name | string | No | Filter by property name (case-insensitive partial match) |
| address | string | No | Filter by property address (case-insensitive partial match) |
| minPrice | number | No | Minimum price (inclusive) |
| maxPrice | number | No | Maximum price (inclusive) |

**Example Request**:
```bash
GET /api/properties?name=house&minPrice=100000&maxPrice=500000
```

**Example Response**:
```json
[
  {
    "idProperty": "65a1b2c3d4e5f6789def0001",
    "idOwner": "65a1b2c3d4e5f6789abc0001",
    "name": "Beautiful Beach House",
    "address": "456 Ocean Boulevard, Malibu, CA 90265",
    "price": 2500000,
    "image": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800"
  },
  {
    "idProperty": "65a1b2c3d4e5f6789def0003",
    "idOwner": "65a1b2c3d4e5f6789abc0003",
    "name": "Modern Family Home",
    "address": "789 Suburban Lane, Austin, TX 78701",
    "price": 450000,
    "image": "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"
  }
]
```

**Status Codes**:
- `200 OK`: Success
- `500 Internal Server Error`: Server error

---

#### Get Property by ID

Retrieve detailed information about a specific property.

**Endpoint**: `GET /api/properties/{id}`

**Path Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Property ID (MongoDB ObjectId) |

**Example Request**:
```bash
GET /api/properties/65a1b2c3d4e5f6789def0001
```

**Example Response**:
```json
{
  "idProperty": "65a1b2c3d4e5f6789def0001",
  "name": "Luxury Downtown Apartment",
  "address": "123 Main Street, Manhattan, NY 10001",
  "price": 850000,
  "codeInternal": "LUX-001",
  "year": 2020,
  "image": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
  "owner": {
    "idOwner": "65a1b2c3d4e5f6789abc0001",
    "name": "John Smith",
    "address": "456 Oak Avenue, New York, NY",
    "photo": "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
  },
  "additionalImages": [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
  ]
}
```

**Status Codes**:
- `200 OK`: Success
- `404 Not Found`: Property not found
- `500 Internal Server Error`: Server error

---

## Data Models

### PropertyDto

| Field | Type | Description |
|-------|------|-------------|
| idProperty | string | Unique property identifier |
| idOwner | string | Property owner identifier |
| name | string | Property name |
| address | string | Property address |
| price | number | Property price in USD |
| image | string? | URL of the main property image (optional) |

### PropertyDetailDto

| Field | Type | Description |
|-------|------|-------------|
| idProperty | string | Unique property identifier |
| name | string | Property name |
| address | string | Property address |
| price | number | Property price in USD |
| codeInternal | string | Internal property code |
| year | number | Year the property was built |
| image | string? | URL of the main property image (optional) |
| owner | OwnerDto? | Property owner information (optional) |
| additionalImages | string[] | Array of additional image URLs |

### OwnerDto

| Field | Type | Description |
|-------|------|-------------|
| idOwner | string | Unique owner identifier |
| name | string | Owner's full name |
| address | string | Owner's address |
| photo | string? | URL of owner's photo (optional) |

---

## Examples

### cURL Examples

#### Get all properties
```bash
curl -X GET "http://localhost:5000/api/properties" -H "accept: application/json"
```

#### Get properties with filters
```bash
curl -X GET "http://localhost:5000/api/properties?name=house&minPrice=100000&maxPrice=500000" \
  -H "accept: application/json"
```

#### Get property by ID
```bash
curl -X GET "http://localhost:5000/api/properties/65a1b2c3d4e5f6789def0001" \
  -H "accept: application/json"
```

### JavaScript/Axios Examples

#### Get all properties
```javascript
import axios from 'axios';

const getProperties = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/properties');
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching properties:', error);
  }
};
```

#### Get properties with filters
```javascript
const getPropertiesWithFilters = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/properties', {
      params: {
        name: 'house',
        minPrice: 100000,
        maxPrice: 500000
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching properties:', error);
  }
};
```

#### Get property by ID
```javascript
const getPropertyById = async (id) => {
  try {
    const response = await axios.get(`http://localhost:5000/api/properties/${id}`);
    console.log(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      console.error('Property not found');
    } else {
      console.error('Error fetching property:', error);
    }
  }
};
```

### C# Examples

#### Get all properties
```csharp
using System.Net.Http;
using System.Net.Http.Json;

var client = new HttpClient { BaseAddress = new Uri("http://localhost:5000") };

var properties = await client.GetFromJsonAsync<List<PropertyDto>>("/api/properties");
```

#### Get properties with filters
```csharp
var query = "?name=house&minPrice=100000&maxPrice=500000";
var properties = await client.GetFromJsonAsync<List<PropertyDto>>($"/api/properties{query}");
```

#### Get property by ID
```csharp
var id = "65a1b2c3d4e5f6789def0001";
var property = await client.GetFromJsonAsync<PropertyDetailDto>($"/api/properties/{id}");
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. This may be added in future versions.

## CORS

CORS is configured to allow all origins in development. For production, configure specific allowed origins in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy.WithOrigins("https://your-frontend-domain.com")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});
```

## Error Handling

The API uses a global exception handler middleware that catches all unhandled exceptions and returns a consistent error response.

Common error scenarios:

1. **404 Not Found**: Resource does not exist
2. **500 Internal Server Error**: Unexpected server error (check logs)

## Interactive Documentation

For interactive API testing, visit the Swagger UI at:
```
http://localhost:5000/swagger
```

Or in production:
```
https://your-domain.com/swagger
```

The Swagger UI provides:
- Interactive endpoint testing
- Request/response examples
- Schema definitions
- Authentication configuration (when added)

## Versioning

Currently at version 1.0. API versioning may be added in future releases.

## Support

For API support or questions, contact: crios@millionluxury.com
