import Storage from './storage.js';
import { STORAGE_TYPES } from './types.js';
import StorageWrapper from './storage-wrapper.js';

const storageInstances = {
  local: new StorageWrapper(new Storage(STORAGE_TYPES.LOCAL)),
  session: new StorageWrapper(new Storage(STORAGE_TYPES.SESSION)),
  memory: new StorageWrapper(new Storage(STORAGE_TYPES.MEMORY)),
};

export default storageInstances;




//storage.local.set('key', 'value', 3600000); // expires in 1 hour
// storage.session.set('key', 'value');
//storage.memory.set('key', 'value');