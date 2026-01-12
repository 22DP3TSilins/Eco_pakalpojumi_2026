import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./eco_pakalpojumi.db');

db.serialize(() => {
  const products = [
    { name: 'Eco Bag', description: 'Reusable shopping bag made from recycled materials', price: 10.0, category: 'Accessories', lifecycle: 'Made from recycled PET bottles. Fully recyclable at end of life.' },
    { name: 'Solar Panel Kit', description: 'Small solar panel for home energy', price: 100.0, category: 'Energy', lifecycle: 'Silicon-based panels with 25-year warranty. Recyclable components.' },
    { name: 'Bamboo Toothbrush', description: 'Biodegradable toothbrush', price: 5.0, category: 'Personal Care', lifecycle: 'Bamboo handle is biodegradable. Replaceable bristles.' },
    { name: 'Recycled Plastic Bottle', description: 'Reusable water bottle from recycled plastic', price: 15.0, category: 'Accessories', lifecycle: 'Made from 100% recycled plastic. BPA-free and durable.' },
    { name: 'Organic Cotton T-Shirt', description: 'T-shirt made from organic cotton', price: 25.0, category: 'Clothing', lifecycle: 'Grown without pesticides. Compostable at end of life.' },
    { name: 'Compost Bin', description: 'Home compost bin for waste reduction', price: 30.0, category: 'Home', lifecycle: 'Plastic-free bamboo construction. Biodegradable.' }
  ];

  const stmt = db.prepare('INSERT INTO products (name, description, price, category, lifecycle) VALUES (?, ?, ?, ?, ?)');
  products.forEach(product => {
    stmt.run(product.name, product.description, product.price, product.category, product.lifecycle);
  });
  stmt.finalize();

  console.log('Sample products inserted');
});

db.close();