const {InMemoryNoSQLDatabase} = require('./InMemoryNoSQLDatabase')
// Create a new database
const db = new InMemoryNoSQLDatabase();
db.indexBy("id",e=>[e.id])
db.indexBy("name",e=>[e.name])
db.indexBy("age",e=>[e.age])

// Subscribe to the 'add' event
db.subscribeEvent('add', record => {
  console.log(`Added record with id ${record.id}`);
});
// Subscribe to the 'remove' event
db.subscribeEvent('remove', record => {
  console.log(`Removed record with id ${record.id}`);
});
// Subscribe to the 'update' event
db.subscribeEvent('update', record => {
  console.log(`Updated record with id ${record.id}`);
});
// Subscribe to the 'index' event
db.subscribeEvent('index', ({ indexName, indexValue, record })=>{
    console.log("index",{ indexName, indexValue, record })
})

// Subscribe to the 'removeFromIndex' event
db.subscribeEvent('removeFromIndex', ({ indexName, indexValue, record })=>{
    console.log("removeFromIndex",{ indexName, indexValue, record })
})
// Add a record
db.add({ id: '1', name: 'Alice', age: 30 });
// Update a record
db.add({ id: '2', name: 'Bob', age: 25 });
// Update a record
db.add({ id: '3', name: 'Alice', age: 26 });
db.add({ id: '4', name: 'John', age: 25 });
db.add({ id: '5', name: 'Paul', age: 30 });
db.add({ id: '6', name: 'San', age: 30 });
console.log(db)
console.log(db.indexes)
// Output: Added record with id 1


// Remove a record
db.remove('1');
// Output: Removed record with id 1


db.update('2', record => ({ ...record, age: 26 }));
// Output: Updated record with id 2

db.update('2', record => ({ ...record, id:'10',age: 27 }));
// Output: Updated record with id 2
console.log(db)
console.log(db.indexes)

