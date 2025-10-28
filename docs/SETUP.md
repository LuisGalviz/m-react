# Setup Guide

This guide will walk you through setting up the Real Estate Application on your local machine.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Setup](#detailed-setup)
4. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

1. **.NET 9 SDK**
   - Download: https://dotnet.microsoft.com/download/dotnet/9.0
   - Verify installation: `dotnet --version`
   - Required version: 9.0 or higher

2. **MongoDB 7.0+**
   - Download: https://www.mongodb.com/try/download/community
   - Verify installation: `mongod --version`
   - Required version: 7.0 or higher

3. **Node.js 18+**
   - Download: https://nodejs.org/
   - Verify installation: `node --version`
   - Required version: 18.0 or higher

4. **MongoDB Database Tools** (for import/export)
   - Download: https://www.mongodb.com/try/download/database-tools
   - Verify installation: `mongoimport --version`

### Optional Software

- **Git**: For version control
- **Docker Desktop**: For containerized deployment
- **Visual Studio 2022** or **VS Code**: For development

## Quick Start

### Option 1: Docker (Recommended for Quick Setup)

```bash
# Clone the repository
git clone <repository-url>
cd real-estate-app

# Start all services with Docker Compose
docker-compose up -d

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Swagger UI: http://localhost:5000
```

### Option 2: Manual Setup

```bash
# 1. Start MongoDB
mongod

# 2. Import seed data
cd database-backup
chmod +x import-data.sh
./import-data.sh

# 3. Start Backend (in a new terminal)
cd backend/src/RealEstate.API
dotnet run

# 4. Start Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

## Detailed Setup

### Step 1: MongoDB Setup

#### Windows

1. Download and install MongoDB Community Server
2. MongoDB runs as a Windows service by default
3. Verify: Open MongoDB Compass or use `mongo` command

#### macOS

```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify
mongosh
```

#### Linux (Ubuntu/Debian)

```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh
```

### Step 2: Import Sample Data

#### Prerequisites
Install `jq` for JSON processing:

```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# Windows
# Download from https://stedolan.github.io/jq/download/
```

#### Import Data

```bash
cd database-backup

# Make script executable (Unix/macOS/Linux)
chmod +x import-data.sh

# Run import
./import-data.sh

# Verify data was imported
mongosh RealEstateDb --eval "db.Properties.countDocuments()"
```

#### Manual Import (if script fails)

```bash
# Import each collection manually
mongoimport --db=RealEstateDb --collection=Owners --file=owners.json --jsonArray
mongoimport --db=RealEstateDb --collection=Properties --file=properties.json --jsonArray
mongoimport --db=RealEstateDb --collection=PropertyImages --file=images.json --jsonArray
mongoimport --db=RealEstateDb --collection=PropertyTraces --file=traces.json --jsonArray
```

### Step 3: Backend Setup

```bash
cd backend

# Restore NuGet packages
dotnet restore

# Verify the solution builds
dotnet build

# Run tests to ensure everything works
dotnet test

# Run the API
cd src/RealEstate.API
dotnet run
```

The API will start on:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `https://localhost:5001` (opens in browser)

#### Backend Configuration

Edit `backend/src/RealEstate.API/appsettings.json` if needed:

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "RealEstateDb"
  }
}
```

For custom MongoDB settings:
```bash
# Set via environment variable
export MongoDbSettings__ConnectionString="mongodb://your-host:port"
export MongoDbSettings__DatabaseName="YourDbName"
```

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

#### Frontend Configuration

Create/edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
```

### Step 5: Verify Setup

1. **Check MongoDB**:
   ```bash
   mongosh RealEstateDb --eval "db.Properties.find().limit(1)"
   ```

2. **Check Backend**:
   - Open: `http://localhost:5000/api/properties`
   - Should return JSON array of properties

3. **Check Frontend**:
   - Open: `http://localhost:3000`
   - Should display property listings

## Development Workflow

### Running in Development Mode

#### Backend (with hot reload)
```bash
cd backend/src/RealEstate.API
dotnet watch run
```

#### Frontend (with hot reload)
```bash
cd frontend
npm run dev
```

### Running Tests

#### Backend Tests
```bash
cd backend
dotnet test

# With coverage
dotnet test /p:CollectCoverage=true
```

#### Frontend Tests
```bash
cd frontend
npm test

# Watch mode
npm run test:watch

# With coverage
npm test -- --coverage
```

## Production Build

### Backend
```bash
cd backend/src/RealEstate.API
dotnet publish -c Release -o ./publish
```

### Frontend
```bash
cd frontend
npm run build
npm start
```

## Docker Deployment

### Build and Run All Services

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

### Individual Container Management

```bash
# Backend only
docker-compose up -d backend

# Frontend only
docker-compose up -d frontend

# MongoDB only
docker-compose up -d mongodb
```

## Troubleshooting

### MongoDB Issues

**Problem**: Cannot connect to MongoDB
```bash
# Check if MongoDB is running
# macOS/Linux
ps aux | grep mongod

# Windows
tasklist | findstr mongod

# Start MongoDB if not running
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Problem**: Port 27017 already in use
```bash
# Find process using port
# macOS/Linux
lsof -i :27017

# Windows
netstat -ano | findstr :27017

# Kill the process or change MongoDB port
```

### Backend Issues

**Problem**: Cannot find .NET SDK
```bash
# Verify installation
dotnet --version

# If not found, download from:
# https://dotnet.microsoft.com/download
```

**Problem**: Port 5000/5001 already in use
```bash
# Edit launchSettings.json
# Change applicationUrl to different ports
"applicationUrl": "https://localhost:7000;http://localhost:6000"
```

**Problem**: MongoDB connection error
- Check `appsettings.json` connection string
- Verify MongoDB is running
- Check firewall settings

### Frontend Issues

**Problem**: Cannot find module errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: API connection errors
- Verify backend is running
- Check `.env.local` API URL
- Check CORS settings in backend

**Problem**: Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev
```

### Docker Issues

**Problem**: Docker Compose fails to start
```bash
# Check Docker is running
docker ps

# View detailed error logs
docker-compose logs

# Rebuild images
docker-compose build --no-cache
```

**Problem**: MongoDB data not persisting
```bash
# Check volumes
docker volume ls

# Remove and recreate volumes
docker-compose down -v
docker-compose up -d
```

## Common Commands Reference

### MongoDB
```bash
# Connect to database
mongosh RealEstateDb

# View collections
show collections

# Count documents
db.Properties.countDocuments()

# View data
db.Properties.find().pretty()

# Backup database
mongodump --db=RealEstateDb --out=./backup

# Restore database
mongorestore --db=RealEstateDb ./backup/RealEstateDb
```

### .NET
```bash
# Restore packages
dotnet restore

# Build solution
dotnet build

# Run tests
dotnet test

# Run API
dotnet run

# Watch mode (hot reload)
dotnet watch run

# Publish for production
dotnet publish -c Release
```

### Node.js/Next.js
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

### Docker
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f [service-name]

# Rebuild images
docker-compose build

# Remove volumes
docker-compose down -v
```

## Next Steps

After successful setup:

1. **Explore the API**: Visit `http://localhost:5001` for Swagger documentation
2. **Test the Frontend**: Browse properties at `http://localhost:3000`
3. **Read Architecture Docs**: Check `docs/ARCHITECTURE.md`
4. **Review Code**: Explore the codebase structure

## Support

If you encounter issues not covered here:

1. Check the main `README.md`
2. Review `docs/ARCHITECTURE.md`
3. Contact: crios@millionluxury.com
