#!/bin/bash

# Re-import properties with correct price types
export PATH=$PATH:$HOME/mongodb/mongodb-database-tools-ubuntu2204-x86_64-100.10.0/bin

DB_NAME="RealEstateDb"

echo "Re-importing Properties with numeric prices..."

# Create temporary file with corrected data
jq '.properties[] | .price = (.price | tonumber)' seed-data.json | mongoimport --db=$DB_NAME --collection=Properties --drop

echo "Properties re-imported!"
echo "Verifying..."

export PATH=$PATH:$HOME/mongodb/mongodb-linux-x86_64-ubuntu2204-7.0.15/bin
mongo $DB_NAME --eval "db.Properties.find({}, {name: 1, price: 1}).limit(3).pretty()" 2>/dev/null || echo "Verification requires mongosh"
