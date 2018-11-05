import Monk from 'monk';

class MonkWrapper {
  constructor() {
    console.log('Cstr MonkWrapper');
    this.db = null;
    this.monk = null;
  }

  connect(uri) {
    if (!this.dbClient || !this.dbClient.serverConfig.isConnected()) {
      console.log('connect', uri);
      this.monk = new Monk(uri);
      this.monk.on('open', (db) => {
        console.log('  open: ', db.serverConfig.isConnected());
        this.dbClient = db;
      });
      return this.monk;
    }
    console.log('DB already open :)');
    return Promise.resolve(true);
  }

  get(collectionName, options) {
    // eslint-disable-next-line
    options = options || {
      castIds: false, // allow custom id's
    };
    return this.monk.get(collectionName, options);
  }

  bind(name, options) {
    if (this[name]) {
      return; // already defined
    }
    Object.defineProperty(this, name, {
      get() {
        return this.get(name, options);
      },
    });
  }

  close() {
    if (this.monk) {
      this.monk.close();
    }
  }
}

export default new MonkWrapper();
