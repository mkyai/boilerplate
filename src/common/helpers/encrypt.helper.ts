import * as crypto from 'crypto';

export class Encrypter {
  private readonly algorithm: string;

  private readonly key: Buffer;

  constructor(encryptionKey: string) {
    this.algorithm = 'aes-128-cbc';
    this.key = crypto.scryptSync(encryptionKey, 'salt', 16);
  }

  encryptIv(clearText: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = cipher.update(clearText, 'utf8', 'hex');

    return [
      encrypted + cipher.final('hex'),
      Buffer.from(iv).toString('hex'),
    ].join('');
  }

  dencryptIv(encryptedText: string) {
    const [encrypted, iv] = <[string, string]>(
      encryptedText.match(new RegExp(`.{1,${32}}`, 'g'))
    );
    if (!iv) throw new Error('IV not found');
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.key,
      Buffer.from(iv, 'hex'),
    );

    return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  }

  encrypt(clearText: string) {
    const cipher = crypto.createCipher(this.algorithm, 'this.key');
    const encrypted = cipher.update(clearText, 'utf8', 'hex');

    return encrypted + cipher.final('hex');
  }

  dencrypt(encryptedText: string) {
    const decipher = crypto.createDecipher(this.algorithm, 'this.key');

    return (
      decipher.update(encryptedText, 'hex', 'utf8') + decipher.final('utf8')
    );
  }
}
