// Fix MongoDB script to convert price from string to number
db = db.getSiblingDB('RealEstateDb');

// Update all properties to ensure price is a number
db.Properties.find().forEach(function(doc) {
    if (typeof doc.price === 'string') {
        db.Properties.updateOne(
            { _id: doc._id },
            { $set: { price: NumberDecimal(doc.price) } }
        );
        print('Fixed price for: ' + doc.name);
    } else if (typeof doc.price === 'number') {
        // Already a number, but ensure it's decimal
        db.Properties.updateOne(
            { _id: doc._id },
            { $set: { price: NumberDecimal(doc.price.toString()) } }
        );
        print('Ensured decimal for: ' + doc.name);
    }
});

print('Price fix complete!');
print('Sample prices:');
db.Properties.find({}, {name: 1, price: 1}).limit(3).forEach(printjson);
