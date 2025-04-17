class StorageWrapper {
  constructor(storage) {
    this.storage = storage;
  }
  
  validateKey(key) {
    if (typeof key !== 'string' || key.trim() === '') {
      throw new Error('Key must be a non-empty string');
    }
  }
  
  validateValue(value) {
    if (typeof value === 'undefined' || value === null) {
      throw new Error('Value cannot be null or undefined');
    }
  }
  
  set(key, value, expires = null) {
    this.validateKey(key);
    this.validateValue(value);
    const item = {
      value,
      expires: expires ? new Date().getTime() + expires : null,
    };
    this.storage.set(key, item);
  }
  
  get(key) {
    this.validateKey(key);
    const storedValue = this.storage.get(key);
    if (!storedValue) return null;
    if (storedValue.expires && new Date().getTime() > storedValue.expires) {
      this.storage.remove(key);
      return null;
    }
    return storedValue.value;
  }
  
  remove(key) {
    this.validateKey(key);
    this.storage.remove(key);
  }
}

export default StorageWrapper;