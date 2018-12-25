class GameView extends egret.DisplayObjectContainer {
  private layer: eui.UILayer;
  private curr: any;
  constructor() {
    super();
    this.layer = new eui.UILayer();
    this.addChild(this.layer);
  }

  toView(name: string) {
    this.clearAll();
    if (name === "login") {
      this.curr = new Login();
    }
    this.layer.addChild(this.curr);
    this.curr.master = this;
  }

  private clearAll(): void {
    if (this.curr && this.curr.release) {
      this.curr.release();
      this.removeChild(this.curr);
    }
  }
}
