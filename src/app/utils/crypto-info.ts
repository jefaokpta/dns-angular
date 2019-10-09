import * as crypto from 'crypto-js';
export class CryptoInfo{
  private  secret = 'dns-vcom-123';

  encrypObject(data): string {
    return crypto.AES.encrypt(JSON.stringify(data), this.secret).toString();
  }
  decryptObject(hash){
    return JSON.parse(crypto.AES.decrypt(hash, this.secret).toString(crypto.enc.Utf8));
  }
  encrypString(data: string): string {
    return crypto.AES.encrypt(data, this.secret);
  }
  decryptString(hash){
    return crypto.AES.decrypt(hash, this.secret).toString(crypto.enc.Utf8);
  }

}
