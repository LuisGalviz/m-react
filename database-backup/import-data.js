const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection settings
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = 'RealEstateDb';

// Collection names (matching appsettings.json)
const COLLECTIONS = {
  owners: 'Owners',
  properties: 'Properties',
  propertyImages: 'PropertyImages',
  propertyTraces: 'PropertyTraces'
};

async function importData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✓ Connected successfully to MongoDB\n');

    const db = client.db(DATABASE_NAME);

    // Read seed data
    const seedDataPath = path.join(__dirname, 'seed-data.json');
    const rawData = fs.readFileSync(seedDataPath, 'utf8');
    const seedData = JSON.parse(rawData);

    console.log('Starting data import...\n');

    // Import each collection
    for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
      const dataArray = seedData[key];

      if (!dataArray || dataArray.length === 0) {
        console.log(`⊘ No data found for ${collectionName}`);
        continue;
      }

      const collection = db.collection(collectionName);

      // Drop existing collection (optional - comment out if you want to keep existing data)
      await collection.drop().catch(() => {
        // Collection might not exist, ignore error
      });

      // Map to store original IDs to new ObjectIds for maintaining relationships
      const idMap = new Map();

      // Convert extended JSON format
      const documents = dataArray.map(doc => {
        const converted = {};
        for (const [field, value] of Object.entries(doc)) {
          if (value && typeof value === 'object') {
            if (value.$oid) {
              // Try to convert $oid to ObjectId, if invalid create a new one
              try {
                if (value.$oid.length === 24 && /^[0-9a-fA-F]{24}$/.test(value.$oid)) {
                  // Valid 24-character hex string
                  converted[field] = new ObjectId(value.$oid);
                } else {
                  // Invalid format, map old ID to new ObjectId
                  if (!idMap.has(value.$oid)) {
                    idMap.set(value.$oid, new ObjectId());
                  }
                  converted[field] = idMap.get(value.$oid);
                }
              } catch (err) {
                // If conversion fails, create new ObjectId
                if (!idMap.has(value.$oid)) {
                  idMap.set(value.$oid, new ObjectId());
                }
                converted[field] = idMap.get(value.$oid);
              }
            } else if (value.$date) {
              // Convert $date to Date
              converted[field] = new Date(value.$date);
            } else {
              converted[field] = value;
            }
          } else {
            converted[field] = value;
          }
        }
        return converted;
      });

      // Insert documents
      const result = await collection.insertMany(documents);
      console.log(`✓ Imported ${result.insertedCount} documents into ${collectionName}`);
    }

    console.log('\n✓ Data import completed successfully!');

    // Display collection counts
    console.log('\nCollection counts:');
    for (const collectionName of Object.values(COLLECTIONS)) {
      const count = await db.collection(collectionName).countDocuments();
      console.log(`  - ${collectionName}: ${count} documents`);
    }

  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nConnection closed.');
  }
}

// Run the import
importData();
