helper = {
  IndexedDB: {
    open: function(dbName, version, upgradeCallback) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version);
        request.onerror = event => reject('IndexedDB error: ' + event.target.error);
        
        request.onsuccess = event => resolve(event.target.result);
        
        if (upgradeCallback) {
          request.onupgradeneeded = event => upgradeCallback(event.target.result);
        }
      });
    },
    
    _performTransaction: function(db, storeName, mode, operation) {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], mode);
        const store = transaction.objectStore(storeName);
        const request = operation(store);
        
        request.onerror = event => reject(`Transaction error: ${event.target.error}`);
        request.onsuccess = event => resolve(event.target.result);
      });
    },
    
    add: function(db, storeName, data) {
      return this._performTransaction(db, storeName, 'readwrite', store => store.add(data));
    },
    
    get: function(db, storeName, key) {
      return this._performTransaction(db, storeName, 'readonly', store => store.get(key));
    },
    
    update: function(db, storeName, key, data) {
      return this._performTransaction(db, storeName, 'readwrite', store => store.put(data, key));
    },
    
    delete: function(db, storeName, key) {
      return this._performTransaction(db, storeName, 'readwrite', store => store.delete(key));
    },
    
    getAll: function(db, storeName) {
      return this._performTransaction(db, storeName, 'readonly', store => store.getAll());
    }
  }
};