
export class TokenStore{

  public getToken(): string{
    try {
      return JSON.parse(localStorage.getItem('DNSTOKEN'));
    } catch (e) {
      console.error('Erro ao solicitar TOKEN localStorage', e);
      return 'nadinha';
    }
  }
  public setToken(t: string){
    try {
      localStorage.setItem('DNSTOKEN', JSON.stringify(t));
    } catch (e) {
      console.error('Erro ao salvar TOKEN localStorage', e);
    }
  }
  public removeToken(){
    localStorage.removeItem('DNSTOKEN');
  }
}
