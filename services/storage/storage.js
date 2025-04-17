import StorageFactory from './storage-factory.js';
import { STORAGE_TYPES } from './types.js';

class Storage {
  constructor(storageType = STORAGE_TYPES.LOCAL) {
    this.storage = StorageFactory.createStorage(storageType);
  }

  get(key) {
    return this.storage.get(key);
  }

  set(key, value) {
    this.storage.set(key, value);
  }

  remove(key) {
    this.storage.remove(key);
  }
}

export default Storage;
