// Convert all price fields to NumberDecimal (Decimal128) in MongoDB
db = db.getSiblingDB('RealEstateDb');

print('Converting prices to Decimal128...');

// Get all properties and check their price types
db.Properties.find().forEach(function(doc) {
    print('Property: ' + doc.name + ', Price: ' + doc.price + ', Type: ' + typeof doc.price);

    // Convert to Decimal128 regardless of current type
    db.Properties.updateOne(
        { _id: doc._id },
        { $set: { price: NumberDecimal(doc.price.toString()) } }
    );
    print('  -> Converted to Decimal128');
});

print('\nConversion complete!');
print('\nSample data:');
db.Properties.find({}, {name: 1, price: 1}).limit(3).forEach(printjson);

print('\nTesting price range query in MongoDB:');
var result = db.Properties.find({
    price: { $gte: NumberDecimal("400000"), $lte: NumberDecimal("800000") }
}, {name: 1, price: 1}).toArray();
print('Found ' + result.length + ' properties in range 400000-800000:');
result.forEach(function(prop) {
    print('  - ' + prop.name + ': $' + prop.price);
});
