class GameView extends egret.DisplayObjectContainer {
  mgr: logic.MatchVsMgr;
  me: logic.User;
  private layer: eui.UILayer;
  private curr: any;
  constructor() {
    super();
    this.layer = new eui.UILayer();
    this.addChild(this.layer);

    this.mgr = logic.MatchVsMgr.instance;
    this.mgr.initResponse();

    this.me = new logic.User();
  }

  toView(name: string) {
    this.clearAll();
    if (name === "login") {
      this.curr = new Login(this);
    } else if (name === "lobby") {
      this.curr = new Lobby(this);
    }
    this.layer.addChild(this.curr);
  }

  private clearAll(): void {
    if (this.curr) {
      this.layer.removeChild(this.curr);
      this.curr.release && this.curr.release();
    }
  }
}
