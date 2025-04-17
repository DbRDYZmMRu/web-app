Let's add those features back in. We can create a wrapper around the storage instances that includes the additional functionality.

storage/storage-wrapper.js
```
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
```

storage/index.js
```
import Storage from './storage.js';
import { STORAGE_TYPES } from './types.js';
import StorageWrapper from './storage-wrapper.js';

const storageInstances = {
  local: new StorageWrapper(new Storage(STORAGE_TYPES.LOCAL)),
  session: new StorageWrapper(new Storage(STORAGE_TYPES.SESSION)),
  memory: new StorageWrapper(new Storage(STORAGE_TYPES.MEMORY)),
};

export default storageInstances;
```

Now, the storage instances have the additional features like validation and expiry.

You can use them like this:

```
import { storage } from './global.js';

storage.local.set('key', 'value', 3600000); // expires in 1 hour
storage.session.set('key', 'value');
storage.memory.set('key', 'value');
```

This approach combines the benefits of abstraction with the additional features you need.




It looks like you're importing all exports from `global.js` using the `* as g` syntax.

This allows you to access all exported values as properties of the `g` object.

In your case, `g` would have `store` and `storage` properties, based on the exports in `global.js`.

You can then use these properties in your functions, like this:

```
import * as g from '../../global.js';

export function getDate() {
  g.store.someValue = "easy peasy";
  // You might also want to use g.storage here?
}

export function setLs() {
  g.store.someValue = "easy peasy";
  // You might also want to use g.storage.local.set() or something similar?
}
```

Using `* as g` can be convenient when you need to access multiple exports from a module.

However, it's worth noting that some IDEs and linters might warn about using `*` imports, as they can make it harder to track what's being used from the imported module.

In general, it's a good practice to import only what you need, like this:

```
import { store, storage } from '../../global.js';
```

But `* as g` can be a good solution when you need to access many exports or when you're working with a large module.