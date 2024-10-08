import {
  Blockchain,
  StoredString
} from '@btc-vision/btc-runtime/runtime';
import { u256 } from 'as-bignum/assembly';

export class IntToStringMemoryMap<K extends u256, V extends string> {
  public pointer: u16;

  constructor(
    pointer: u16,
    private readonly defaultValue: V,
  ) {
    this.pointer = pointer;
  }

  public set(key: K, value: V): this {
    // override the current value if it already exists
    if (this.has(key)) {
      const storagePointer = Blockchain.getStorageAt(this.pointer, key, u256.Zero);

      // TODO: what if we actually get a zero value? 

      const str = new StoredString(storagePointer.as<u16>());

      str.value = value;
      return this;
    }

    // Otherwise
    // Store the key and the pointer to the string chunks
    const storagePointer = Blockchain.nextPointer;
    Blockchain.setStorageAt(this.pointer, key, u256.from<u16>(storagePointer));

    // Store the string chunks at the pointer
    const str = new StoredString(storagePointer);
    str.value = value;

    return this;
  }

  public get(key: K): V {
    if (!this.has(key)) {
      // TODO: We can throw an error, return a default value or return null
      // I see that they are mostly using default values in the runtime, 
      // although I do believe that it makes it more confusing than anything
      // so not sure how I want to handle this yet. 
      return this.defaultValue;
    }

    const storagePointer = Blockchain.getStorageAt(this.pointer, key, u256.Zero);
    const str = new StoredString(storagePointer.as<u16>());
    return str.value as V;
  }

  public has(key: K): bool {
    const storagePointer = Blockchain.getStorageAt(this.pointer, key, u256.Zero);

    return storagePointer != u256.Zero;
  }

  public delete(key: K): bool {
    if (!this.has(key)) {
      return false;
    }

    const storagePointer = Blockchain.getStorageAt(this.pointer, key, u256.Zero);

    // TODO: What is we actually get a zero value? It shouldn't be possible but need to confirm.

    const str = new StoredString(storagePointer.as<u16>());

    str.value = '';

    Blockchain.setStorageAt(this.pointer, key, u256.Zero);
    return true;
  }

}