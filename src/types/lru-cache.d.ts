declare module 'lru-cache' {
    export default class LRUCache<K, V> {
      constructor(options?: object);
      get(key: K): V | undefined;
      set(key: K, value: V): void;
    }
  }  