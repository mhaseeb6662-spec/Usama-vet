const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Provider
schema = schema.replace(/provider\s*=\s*"mysql"/g, 'provider = "mongodb"');

// Remove @db.Decimal(10, 2) and change Decimal to Float (MongoDB supports Float)
schema = schema.replace(/@db\.Decimal\(\d+,\s*\d+\)/g, '');
schema = schema.replace(/Decimal/g, 'Float');

// IDs
schema = schema.replace(/id\s+Int\s+@id\s+@default\(autoincrement\(\)\)/g, 'id String @id @default(auto()) @map("_id") @db.ObjectId');

// Foreign keys (Int? -> String? @db.ObjectId)
const foreignKeys = ['categoryId', 'subcategoryId', 'brandId', 'productId', 'reviewId', 'customerId', 'orderId'];
foreignKeys.forEach(fk => {
  schema = schema.replace(new RegExp(fk + '\\s+Int\\?', 'g'), fk + ' String? @db.ObjectId');
  schema = schema.replace(new RegExp(fk + '\\s+Int(?=\\s)', 'g'), fk + ' String @db.ObjectId');
});

fs.writeFileSync('prisma/schema.prisma', schema);
console.log("Schema migrated successfully.");
