class Login extends eui.Component implements eui.UIComponent {
  master: GameView;
  loginBtn: eui.Button;
  usernameLab: eui.Label;
  private mgr: logic.MatchVsMgr;
  public constructor() {
    super();
    this.mgr = logic.MatchVsMgr.instance;
    this.mgr.initResponse();
  }

  protected partAdded(partName: string, instance: any): void {
    console.log(partName);
    super.partAdded(partName, instance);
  }

  protected childrenCreated(): void {
    super.childrenCreated();

    console.log(this.loginBtn);

    this.loginBtn.addEventListener(
      egret.TouchEvent.TOUCH_END,
      e => {
        console.log("touch login button");
        this.mgr.login(logic.me.userId, logic.me.token);
      },
      this
    );

    this.listen();
  }

  private listen(): void {
    let mgr = this.mgr;
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

    mgr.addEventListener(logic.EventNames.login, this.onLogin, this);
  }

  private unListen(): void {
    let mgr = this.mgr;
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

    mgr.removeEventListener(logic.EventNames.login, this.onLogin, this);
  }

  private onInitResponse() {
    console.log("init success");
    egret.localStorage.clear();
    this.mgr.registerUser();
  }

  private onRegisterUser(e: egret.Event) {
    console.log("register user success");
    let user: logic.IRegisterUser = e.data;
    logic.me.name = user.name;
    logic.me.userId = user.userId;
    logic.me.token = user.token;
    console.log(user, logic.me);
  }

  private onLogin() {
    // 切换到大厅
  }

  private release(): void {
    this.unListen();
  }
}
