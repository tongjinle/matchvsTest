class GameView extends egret.DisplayObjectContainer {
  mgr: logic.MatchVsMgr;
  userList: logic.IUser[] = [];
  // 当前玩家的userId
  userId: number;

  // 上一个room的id
  private _lastRoomId: string;
  public get lastRoomId(): string {
    this._lastRoomId = egret.localStorage.getItem("lastRoomId") || undefined;
    return this._lastRoomId;
  }
  public set lastRoomId(v: string) {
    this._lastRoomId = v;
    egret.localStorage.setItem("lastRoomId", v);
  }

  public get me(): logic.IUser {
    return this.userList.find(n => n.id === this.userId);
  }
  private viewDict: { [index: string]: any } = {};

  private layer: eui.UILayer;
  // 当前view的名字
  private currName: string;
  // 当前view实例
  private curr: any;
  constructor() {
    super();
    this.layer = new eui.UILayer();
    this.addChild(this.layer);

    this.mgr = logic.MatchVsMgr.instance;
    this.mgr.initResponse();
  }

  private createView(name: string): any {
    let rst: any;
    if (name === "login") {
      rst = new Login(this);
    } else if (name === "lobby") {
      rst = new Lobby(this);
    } else if (name === "waitRoom") {
      rst = new WaitRoom(this);
    }
    return rst;
  }

  removeView(name: string): void {
    let view = this.viewDict[name];
    if (view) {
      if (view === this.curr) {
        this.layer.removeChild(view);
      }
      view.release();
    }
  }

  changeView(name: string): void {
    console.log("change view:", name);
    if (this.curr) {
      this.currName = undefined;
      this.curr.visible = false;
    }
    if (!this.viewDict[name]) {
      let view = this.createView(name);
      this.viewDict[name] = view;
      this.layer.addChild(view);
    }
    this.currName = name;
    this.curr = this.viewDict[name];
    this.curr.visible = true;
  }

  replaceView(name: string): void {
    console.log("replace view:", name);
    if (this.currName) {
      this.removeView(this.currName);
      delete this.viewDict[name];
    }
    let view = this.createView(name);
    this.viewDict[name] = view;
    this.currName = name;
    this.curr = view;
    this.layer.addChild(view);
  }
}
