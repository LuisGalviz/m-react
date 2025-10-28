#!/bin/bash

# MongoDB Import Script
# This script imports the seed data into MongoDB

DB_NAME="RealEstateDb"
HOST="localhost"
PORT="27017"

echo "Starting MongoDB data import..."

# Check if mongoimport is available
if ! command -v mongoimport &> /dev/null; then
    echo "Error: mongoimport is not installed or not in PATH"
    echo "Please install MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

# Parse JSON and import each collection
echo "Importing Owners..."
cat seed-data.json | jq -c '.owners[]' | mongoimport \
    --host="$HOST" \
    --port="$PORT" \
    --db="$DB_NAME" \
    --collection="Owners" \
    --drop

echo "Importing Properties..."
cat seed-data.json | jq -c '.properties[]' | mongoimport \
    --host="$HOST" \
    --port="$PORT" \
    --db="$DB_NAME" \
    --collection="Properties" \
    --drop

echo "Importing PropertyImages..."
cat seed-data.json | jq -c '.propertyImages[]' | mongoimport \
    --host="$HOST" \
    --port="$PORT" \
    --db="$DB_NAME" \
    --collection="PropertyImages" \
    --drop

echo "Importing PropertyTraces..."
cat seed-data.json | jq -c '.propertyTraces[]' | mongoimport \
    --host="$HOST" \
    --port="$PORT" \
    --db="$DB_NAME" \
    --collection="PropertyTraces" \
    --drop

echo "Data import completed successfully!"
