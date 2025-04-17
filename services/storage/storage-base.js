class StorageBase {
  constructor() {}

  get(key) {
    throw new Error('Method not implemented');
  }

  set(key, value) {
    throw new Error('Method not implemented');
  }

  remove(key) {
    throw new Error('Method not implemented');
  }
}

export default StorageBase;
