#!/bin/bash

# Add tools to PATH
export PATH=$PATH:$HOME/mongodb/mongodb-database-tools-ubuntu2204-x86_64-100.10.0/bin

DB_NAME="RealEstateDb"

echo "Importing Owners..."
jq -c '.owners[]' seed-data.json | mongoimport --db=$DB_NAME --collection=Owners --drop

echo "Importing Properties..."
jq -c '.properties[]' seed-data.json | mongoimport --db=$DB_NAME --collection=Properties --drop

echo "Importing PropertyImages..."
jq -c '.propertyImages[]' seed-data.json | mongoimport --db=$DB_NAME --collection=PropertyImages --drop

echo "Importing PropertyTraces..."
jq -c '.propertyTraces[]' seed-data.json | mongoimport --db=$DB_NAME --collection=PropertyTraces --drop

echo "Data import completed!"
