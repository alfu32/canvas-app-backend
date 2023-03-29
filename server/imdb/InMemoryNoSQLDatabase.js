const {v1} =require("uuid")
/**
 * @typedef map<T> = {{[key:string]:T}}
 */
class map{}
/**
 * @typedef Record
 * @extends map<any>
 */
class Record{
/**
 * 
 * @param {map<any>} json 
 */
  static create(json){
    const r=new Record()
    r.id=v1()
    Object.entries(json).forEach(
      ([key,val])=>{
        r[key]=val
      }
    )
    return r
  }
  /**
   * @field {string} id
   * @required
   */
  id;
}


/**
 * in memory nosql storage supporting event listeners on database operations
 */
class InMemoryNoSQLDatabase {
    constructor() {
      this.data = {};
      this.indexes = {};
      this.indexers = {};
      this.eventSubscribers = {};
    }
    /**
     * 
     * @param {string} name index name
     * @param {(record:Record)=>string[]} fn indexing function
     */
    indexBy(name,fn){
      this.indexers[name]=fn
    }
  /**
   * 
   * @param {Record} record 
   */
    add(record) {
      this.data[record.id] = Record.create(record);
      this.index(record);
      this.broadcastEvent('add', {record});
    }
  /**
   * 
   * @param {Record} record 
   */
    remove(record) {
      delete this.data[record.id];
      this.removeFromIndexes(record);
      this.broadcastEvent('remove', {record});
    }
  /**
   * 
   * @param {string} id 
   * @param {(oldRecord:Record)=>Record} updateFn 
   */
    update(id, updateFn) {
      const record = this.data[id];
      const updatedRecord = updateFn(record);
      this.data[id] = updatedRecord;
      this.removeFromIndexes(record);
      this.index(updatedRecord);
      this.broadcastEvent('update', {before:record,record:updatedRecord});
    }
  /**
   * 
   * @param {string[]} indexNames 
   * @param {string} indexValue 
   * @returns {Record[]}
   */
    findByIndexes(indexNames, indexValue) {
      const ids = indexNames.flatMap(indexName => this.indexes[indexName][indexValue]);
      if (!ids) return [];
      return ids.map(id => this.data[id]);
    }
    /**
     * 
     * @param {string} indexName 
     * @param {string} indexValue 
     * @returns {Record[]}
     */
    findByIndex(indexName, indexValue) {
      const ids = this.indexes[indexName][indexValue];
      if (!ids) return [];
      return ids.map(id => this.data[id]);
    }
  /**
   * 
   * @param {Record} record 
   */
    index(record) {
      Object.entries(this.indexers).forEach(([indexName, indexerFn]) => {
        console.log("INDEX_BY",{indexName,indexerFn:indexerFn.toString()})
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
  /**
   * 
   * @param {Record} record 
   */
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
    /**
     * 
     * @param {"add"|"remove"|"update"|"index"|"removeFromIndex"} eventType event name to subscribe to
     * @param {(eventData:{indexName:string,indexValue:string,record:Record,before:Record})=>void} callback event listener
     */
    on(eventType, callback) {
      if (!this.eventSubscribers[eventType]) {
        this.eventSubscribers[eventType] = [];
      }
      this.eventSubscribers[eventType].push(callback);
    }
    /**
     * 
     * @param {"add"|"remove"|"update"|"index"|"removeFromIndex"} eventType 
     * @param {{indexName:string,indexValue:string,record:Record,before:Record}} eventData 
     */
    broadcastEvent(eventType, eventData) {
      const subscribers = this.eventSubscribers[eventType] || [];
      subscribers.forEach(subscriber => subscriber(eventData));
    }
  }
  module.exports={
    InMemoryNoSQLDatabase
  }