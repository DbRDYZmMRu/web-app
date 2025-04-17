import StorageBase from './storage-base.js';

class MemoryStorage extends StorageBase {
  constructor() {
    super();
    this.storage = {};
  }

  get(key) {
    return this.storage[key] ? JSON.parse(JSON.stringify(this.storage[key])) : null;
  }

  set(key, value) {
    this.storage[key] = value;
  }

  remove(key) {
    delete this.storage[key];
  }
}

export default MemoryStorage;
