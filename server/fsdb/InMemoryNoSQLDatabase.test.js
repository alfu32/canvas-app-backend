
const {InMemoryNoSQLDatabase} = require('./InMemoryNoSQLDatabase')
const {describe,beforeEach,it,expect} = require('../test')

describe('InMemoryNoSQLDatabase', () => {
    let db = new InMemoryNoSQLDatabase();

    beforeEach(() => {
        db = new InMemoryNoSQLDatabase();
    });

    describe('add()', () => {
        it('adds a record to the database', () => {
            db.add({ id: '1', name: 'Alice', age: 30 });
            expect(db.data['1']).toEqual({ id: '1', name: 'Alice', age: 30 });
        });

        it('indexes the record', () => {
            db.indexes['age'] = record => [record.age];
            db.add({ id: '1', name: 'Alice', age: 30 });
            expect(db.indexes['age']['30']).toEqual(['1']);
        });

        it('broadcasts an "add" event', () => {
            const mockCallback = (...args)=>{console.log("callback",args)};
            db.subscribeEvent('add', mockCallback);
            db.add({ id: '1', name: 'Alice', age: 30 });
            expect(mockCallback).toHaveBeenCalledWith({ id: '1', name: 'Alice', age: 30 });
        });
    });

    describe('remove()', () => {
        beforeEach(() => {
            db.add({ id: '1', name: 'Alice', age: 30 });
        });

        it('removes a record from the database', () => {
            db.remove('1');
            expect(db.data['1']).toBeUndefined();
        });

        it('removes the record from its indexes', () => {
            db.indexes['age'] = record => [record.age];
            db.remove('1');
            expect(db.indexes['age']['30']).toBeUndefined();
        });

        it('broadcasts a "remove" event', () => {
            const mockCallback = (...args)=>{console.log("callback",args)};
            db.subscribeEvent('remove', mockCallback);
            db.remove('1');
            expect(mockCallback).toHaveBeenCalledWith({ id: '1', name: 'Alice', age: 30 });
        });
    });

    describe('update()', () => {
        beforeEach(() => {
            db.add({ id: '1', name: 'Alice', age: 30 });
        });

        it('updates a record in the database', () => {
            db.update('1', record => ({ ...record, age: 31 }));
            expect(db.data['1']).toEqual({ id: '1', name: 'Alice', age: 31 });
        });

        it('updates the record in its indexes', () => {
            db.indexes['age'] = record => [record.age];
            db.update('1', record => ({ ...record, age: 31 }));
            expect(db.indexes['age']['30']).toBeUndefined();
            expect(db.indexes['age']['31']).toEqual(['1']);
        });

        it('broadcasts an "update" event', () => {
            const mockCallback = (...args)=>{console.log("callback",args)};
            db.subscribeEvent('update', mockCallback);
            db.update('1', record => ({ ...record, age: 31 }));
            expect(mockCallback).toHaveBeenCalledWith({ id: '1', name: 'Alice', age: 31 });
        });
    });

    describe('findByIndex()', () => {
        beforeEach(() => {
            db.indexes['age'] = record => [record.age];
            db.indexes['name'] = record => [record.name];
            db.add({ id: '1', name: 'Alice', age: 30 });
            db.add({ id: '2', name: 'Bob', age: 25 });
        });

        it('finds records by a single index', () => {
            const results = db.findByIndex('age', 30);
            expect(results).toEqual([{ id: '1', name: 'Alice', age: 30 }]);
        });

        it('finds records by multiple indexes', () => {
            const results = db.findByIndexes(['name', 'age'], ['Bob', 25]);
            expect(results).toEqual([{ id: '2', name: 'Bob', age: 25 }]);
        });
    });

    describe('removeFromIndexes()', () => {
        beforeEach(() => {
            db.indexes['age'] = record => [record.age];
            db.add({ id: '1', name: 'Alice', age: 30 });
        });

        it('removes a record from an index', () => {
            db.removeFromIndexes(['age'], 30, '1');
            expect(db.indexes['age']['30']).toEqual([]);
        });

        it('broadcasts a "removeFromIndex" event', () => {
            const mockCallback = (...args)=>{console.log("callback",args)};
            db.subscribeEvent('removeFromIndex', mockCallback);
            db.removeFromIndexes(['age'], 30, '1');
            expect(mockCallback).toHaveBeenCalledWith('age', 30, '1');
        });
    });

    describe('subscribeEvent()', () => {
        it('subscribes to an event and calls the callback on the event', () => {
            const mockCallback = (...args)=>{console.log("callback",args)};
            db.subscribeEvent('add', mockCallback);
            db.add({ id: '1', name: 'Alice', age: 30 });
            expect(mockCallback).toHaveBeenCalledWith({ id: '1', name: 'Alice', age: 30 });
        });

        it('does not call the callback if the event has not occurred', () => {
            const mockCallback = (...args)=>{console.log("callback",args)};
            db.subscribeEvent('remove', mockCallback);
            expect(mockCallback).not.toHaveBeenCalled();
        });
    });
});
