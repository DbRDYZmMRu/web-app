import LocalStorage from './local-storage.js';
import SessionStorage from './session-storage.js';
import MemoryStorage from './memory-storage.js';
import { STORAGE_TYPES } from './types.js';

class StorageFactory {
  static createStorage(storageType) {
    switch (storageType) {
      case STORAGE_TYPES.LOCAL:
        return new LocalStorage();
      case STORAGE_TYPES.SESSION:
        return new SessionStorage();
      case STORAGE_TYPES.MEMORY:
        return new MemoryStorage();
      default:
        throw new Error(`Unsupported storage type: ${storageType}`);
    }
  }
}

export default StorageFactory;
