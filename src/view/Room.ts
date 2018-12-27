class Room extends eui.Component implements eui.UIComponent {
  master: GameView;
  logo: eui.Image;
  otherLogo: eui.Image;
  playerName: eui.Label;
  otherPlayerName: eui.Label;
  kickBtn: eui.Button;
  startBtn: eui.Button;

  private roomId: string;

  public constructor(master: GameView) {
    super();
    this.master = master;
  }

  protected partAdded(partName: string, instance: any): void {
    super.partAdded(partName, instance);
    console.log(partName);
  }

  protected childrenCreated(): void {
    super.childrenCreated();

    console.warn("room childrenCreated");

    this.listen();

    let me = this.master.me;
    let roomId: string = me.roomId;
    this.init(roomId);
  }

  init(roomId?: string): void {
    if (roomId) {
      this.roomId = roomId;
    }
    this.getRoomDetail();
  }

  private listen(): void {
    let mgr = this.master.mgr;

    mgr.addEventListener(
      logic.EventNames.getRoomDetail,
      this.onGetRoomDetailDone,
      this
    );

    // 踢人
    this.kickBtn.addEventListener(
      egret.TouchEvent.TOUCH_END,
      this.kickPlayer,
      this
    );

    // 开始游戏
    this.startBtn.addEventListener(
      egret.TouchEvent.TOUCH_END,
      this.starGame,
      this
    );
  }
  private unListen(): void {
    let mgr = this.master.mgr;
    mgr.removeEventListener(
      logic.EventNames.getRoomDetail,
      this.onGetRoomDetailDone,
      this
    );

    // 踢人
    this.kickBtn.removeEventListener(
      egret.TouchEvent.TOUCH_END,
      this.kickPlayer,
      this
    );

    // 开始游戏
    this.startBtn.removeEventListener(
      egret.TouchEvent.TOUCH_END,
      this.starGame,
      this
    );
  }
  private release(): void {
    this.unListen();
  }

  //

  getRoomDetail(): void {
    this.master.mgr.getRoomDetail(this.roomId);
  }

  onGetRoomDetailDone(e): void {
    let detail: logic.IRoomDetail = e.data;
    console.log("room detail:", detail);
  }

  // 踢人
  kickPlayer(id: number) {}

  // 开始游戏
  starGame(): void {}
}
