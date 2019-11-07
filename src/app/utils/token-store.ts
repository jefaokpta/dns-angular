
export class TokenStore{

  public getTokenOld(): string{
    try {
      return JSON.parse(localStorage.getItem('DNSTOKEN'));
    } catch (e) {
      console.error('Erro ao solicitar TOKEN localStorage', e);
      return 'nadinha';
    }
  }
  public setTokenOld(t: string){
    try {
      localStorage.setItem('DNSTOKEN', JSON.stringify(t));
    } catch (e) {
      console.error('Erro ao salvar TOKEN localStorage', e);
    }
  }
  public removeTokenOld(){
    localStorage.removeItem('DNSTOKEN');
  }
}
