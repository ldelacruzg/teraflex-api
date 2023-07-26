import { Environment } from '@shared/constants/environment';
import { createCipheriv, randomBytes, scrypt, createDecipheriv } from 'crypto';
import { promisify } from 'util';

export class EncryptService {
  private iv: Buffer;
  private key: Buffer;

  constructor() {
    this.generateKey();
  }
  private async generateKey() {
    this.iv = randomBytes(16);

    this.key = (await promisify(scrypt)(
      Environment.JWT_SECRETKEY,
      'salt',
      32,
    )) as Buffer;
  }

  async encrypt(textToEncrypt: string): Promise<string> {
    const cipher = createCipheriv('aes-256-ctr', this.key, this.iv);

    return Buffer.concat([
      cipher.update(textToEncrypt),
      cipher.final(),
    ]).toString('hex');
  }

  async decrypt(textToDecrypt: string) {
    const textToDecryptBuffer = Buffer.from(textToDecrypt, 'hex');

    const decipher = createDecipheriv('aes-256-ctr', this.key, this.iv);

    return Buffer.concat([
      decipher.update(textToDecryptBuffer),
      decipher.final(),
    ]);
  }
}
