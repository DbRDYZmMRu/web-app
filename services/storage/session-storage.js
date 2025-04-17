import StorageBase from './storage-base.js';

class SessionStorage extends StorageBase {
  constructor() {
    super();
    this.storage = window.sessionStorage;
  }
  
  get(key) {
    const storedValue = this.storage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  }
  
  set(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }
  
  remove(key) {
    this.storage.removeItem(key);
  }
}

export default SessionStorage;