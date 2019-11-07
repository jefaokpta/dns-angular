declare var M: any;
export class Toast {

  public showToast(message: string, color: string, timeout: number){
    M.toast({
      html: message,
      displayLength: timeout,
      classes: color
    });
  }
}
