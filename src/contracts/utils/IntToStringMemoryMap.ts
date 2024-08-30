import {
  Blockchain,
  StoredString
} from '@btc-vision/btc-runtime/runtime';
import { u256 } from 'as-bignum/assembly';

export class IntToStringMap<K extends u256, V extends string> {
  public pointer: u16;

  constructor(
    pointer: u16
  ) {
    this.pointer = pointer;
  }

  public set(key: K, value: V): this {
    // override the current value if it already exists
    if (this.has(key)) {
      const storagePointer = Blockchain.getStorageAt(this.pointer, key, u256.Zero);

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
      throw new Error('Key not found.');
    }

    const storagePointer = Blockchain.getStorageAt(this.pointer, key, u256.Zero);
    const str = new StoredString(storagePointer.as<u16>());
    return str.value as V;
  }

  public has(key: K): bool {
    return Blockchain.hasStorageAt(this.pointer, key);
  }

  public delete(key: K): bool {
    if (!this.has(key)) {
      return false;
    }

    const storagePointer = Blockchain.getStorageAt(this.pointer, key, u256.Zero);

    const str = new StoredString(storagePointer.as<u16>());

    str.value = '';

    Blockchain.setStorageAt(this.pointer, key, u256.Zero);
    return true;
  }

}