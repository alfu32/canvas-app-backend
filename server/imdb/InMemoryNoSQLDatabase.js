class InMemoryNoSQLDatabase {
    constructor() {
      this.data = {};
      this.indexes = {};
      this.indexers = {};
      this.eventSubscribers = {};
    }
    indexBy(name,fn){
      this.indexers[name]=fn
    }
  
    add(record) {
      this.data[record.id] = record;
      this.index(record);
      this.broadcastEvent('add', record);
    }
  
    remove(id) {
      const record = this.data[id];
      delete this.data[id];
      this.removeFromIndexes(record);
      this.broadcastEvent('remove', record);
    }
  
    update(id, updateFn) {
      const record = this.data[id];
      const updatedRecord = updateFn(record);
      this.data[id] = updatedRecord;
      this.removeFromIndexes(record);
      this.index(updatedRecord);
      this.broadcastEvent('update', updatedRecord);
    }
  
    findByIndexes(indexNames, indexValue) {
      const ids = indexNames.flatMap(indexName => this.indexes[indexName][indexValue]);
      if (!ids) return [];
      return ids.map(id => this.data[id]);
    }
    findByIndex(indexName, indexValue) {
      const ids = this.indexes[indexName][indexValue];
      if (!ids) return [];
      return ids.map(id => this.data[id]);
    }
  
    index(record) {
      Object.entries(this.indexers).forEach(([indexName, indexerFn]) => {
        const indexValues = indexerFn(record);
        indexValues.forEach(indexValue => {
          if (!this.indexes[indexName]) {
            this.indexes[indexName]={};
          }
          if (!this.indexes[indexName][indexValue]) {
            this.indexes[indexName][indexValue] = [];
          }
          this.indexes[indexName][indexValue].push(record.id);
          this.broadcastEvent('index', { indexName, indexValue, record });
        });
      });
      //// Object.entries(this.indexes).forEach(([indexName, indexerFn]) => {
      ////   const indexValues = indexerFn(record);
      ////   indexValues.forEach(indexValue => {
      ////     if (!this.indexes[indexName][indexValue]) {
      ////       this.indexes[indexName][indexValue] = [];
      ////     }
      ////     this.indexes[indexName][indexValue].push(record.id);
      ////     this.broadcastEvent('index', { indexName, indexValue, record });
      ////   });
      //// });
    }
  
    removeFromIndexes(record) {
      Object.entries(this.indexers).forEach(([indexName, indexerFn]) => {
        const indexValues = indexerFn(record);
        indexValues.forEach(indexValue => {
          const index = this.indexes[indexName][indexValue];
          if (index) {
            const indexIndex = index.indexOf(record.id);
            if (indexIndex !== -1) {
              index.splice(indexIndex, 1);
              this.broadcastEvent('removeFromIndex', { indexName, indexValue, record });
            }
          }
        });
      });
    }
  
    subscribeEvent(eventType, callback) {
      if (!this.eventSubscribers[eventType]) {
        this.eventSubscribers[eventType] = [];
      }
      this.eventSubscribers[eventType].push(callback);
    }
  
    broadcastEvent(eventType, eventData) {
      const subscribers = this.eventSubscribers[eventType] || [];
      subscribers.forEach(subscriber => subscriber(eventData));
    }
  }
  module.exports={
    InMemoryNoSQLDatabase
  }