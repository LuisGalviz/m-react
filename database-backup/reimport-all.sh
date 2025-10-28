#!/bin/bash

# Re-import all collections with correct data types
export PATH=$PATH:$HOME/mongodb/mongodb-database-tools-ubuntu2204-x86_64-100.10.0/bin

DB_NAME="RealEstateDb"
SEED_FILE="seed-data.json"

echo "Extracting and importing collections..."

# Extract and import Owners
cat $SEED_FILE | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data['owners']))" | mongoimport --db=$DB_NAME --collection=Owners --drop --jsonArray
echo "Owners imported!"

# Extract and import Properties
cat $SEED_FILE | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data['properties']))" | mongoimport --db=$DB_NAME --collection=Properties --drop --jsonArray
echo "Properties imported!"

# Extract and import PropertyImages
cat $SEED_FILE | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data['propertyImages']))" | mongoimport --db=$DB_NAME --collection=PropertyImages --drop --jsonArray
echo "PropertyImages imported!"

# Extract and import PropertyTraces
cat $SEED_FILE | python3 -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data['propertyTraces']))" | mongoimport --db=$DB_NAME --collection=PropertyTraces --drop --jsonArray
echo "PropertyTraces imported!"

echo "All collections re-imported successfully!"
