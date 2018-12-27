class Login extends eui.Component implements eui.UIComponent {
  master: GameView;
  loginBtn: eui.Button;
  usernameLab: eui.Label;
  public constructor(master: GameView) {
    super();
    this.master = master;
  }

  protected partAdded(partName: string, instance: any): void {
    console.log(partName);
    super.partAdded(partName, instance);
  }

  protected childrenCreated(): void {
    super.childrenCreated();
    this.listen();
  }

  private listen(): void {
    let mgr = this.master.mgr;
    mgr.addEventListener(
      logic.EventNames.responseInit,
      this.onInitResponse,
      this
    );

    mgr.addEventListener(
      logic.EventNames.registerUser,
      this.onRegisterUser,
      this
    );

    mgr.addEventListener(logic.EventNames.login, this.onLoginDone, this);

    ///
    this.loginBtn.addEventListener(
      egret.TouchEvent.TOUCH_END,
      this.onLogin,
      this
    );
  }

  private unListen(): void {
    let mgr = this.master.mgr;
    mgr.removeEventListener(
      logic.EventNames.responseInit,
      this.onInitResponse,
      this
    );

    mgr.removeEventListener(
      logic.EventNames.registerUser,
      this.onRegisterUser,
      this
    );

    mgr.removeEventListener(logic.EventNames.login, this.onLoginDone, this);

    this.loginBtn.removeEventListener(
      egret.TouchEvent.TOUCH_END,
      this.onLogin,
      this
    );
  }

  private onInitResponse() {
    console.log("init success");
    egret.localStorage.clear();
    this.master.mgr.registerUser();
  }

  private onRegisterUser(e: egret.Event) {
    console.log("register user success");
    let user: logic.IUser = e.data;
    this.master.userList.push(user);
    this.master.userId = user.id;
    console.log(user, logic.me);
  }

  private onLogin() {
    console.log("touch login button");
    this.master.mgr.login(this.master.me.id, this.master.me.token);
  }

  private onLoginDone() {
    // 切换到大厅
    this.master.replaceView("lobby");
  }

  private release(): void {
    this.unListen();
  }
}
