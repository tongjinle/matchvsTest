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
      this.onRegisterUserDone,
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
      this.onRegisterUserDone,
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
    // egret.localStorage.clear();
    // this.master.mgr.registerUser();

    if (!egret.localStorage.getItem("openId")) {
      egret.localStorage.setItem(
        "openId",
        "user" + Math.floor(1e8 * Math.random()).toString(16)
      );
    }
    let openId: string = egret.localStorage.getItem("openId");
    let session: string = "0";
    this.master.mgr.registerWithThirdPart(openId, session).then(data => {
      let user: logic.IUser = {
        id: data.userId,
        token: data.token,
        logo: "http://pic.vszone.cn/upload/avatar/1464079978.png",
        name: openId
      };
      this.master.userList.push(user);
      this.master.userId = user.id;
    });
  }

  private onRegisterUserDone(e: egret.Event) {
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
