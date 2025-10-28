#!/bin/bash

# MongoDB Export/Backup Script
# This script exports all collections from the RealEstateDb database

DB_NAME="RealEstateDb"
HOST="localhost"
PORT="27017"
OUTPUT_DIR="backup-$(date +%Y%m%d-%H%M%S)"

echo "Starting MongoDB data export..."

# Check if mongoexport is available
if ! command -v mongoexport &> /dev/null; then
    echo "Error: mongoexport is not installed or not in PATH"
    echo "Please install MongoDB Database Tools: https://www.mongodb.com/try/download/database-tools"
    exit 1
fi

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Export each collection
echo "Exporting Owners..."
mongoexport \
    --host="$HOST" \
    --port="$PORT" \
    --db="$DB_NAME" \
    --collection="Owners" \
    --out="$OUTPUT_DIR/owners.json" \
    --jsonArray \
    --pretty

echo "Exporting Properties..."
mongoexport \
    --host="$HOST" \
    --port="$PORT" \
    --db="$DB_NAME" \
    --collection="Properties" \
    --out="$OUTPUT_DIR/properties.json" \
    --jsonArray \
    --pretty

echo "Exporting PropertyImages..."
mongoexport \
    --host="$HOST" \
    --port="$PORT" \
    --db="$DB_NAME" \
    --collection="PropertyImages" \
    --out="$OUTPUT_DIR/property-images.json" \
    --jsonArray \
    --pretty

echo "Exporting PropertyTraces..."
mongoexport \
    --host="$HOST" \
    --port="$PORT" \
    --db="$DB_NAME" \
    --collection="PropertyTraces" \
    --out="$OUTPUT_DIR/property-traces.json" \
    --jsonArray \
    --pretty

echo "Data export completed successfully!"
echo "Backup saved in: $OUTPUT_DIR"
