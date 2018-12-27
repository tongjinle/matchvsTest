class WaitRoom extends eui.Component implements eui.UIComponent {
  master: GameView;
  logo: eui.Image;
  otherLogo: eui.Image;
  playerName: eui.Label;
  otherPlayerName: eui.Label;
  kickBtn: eui.Button;
  startBtn: eui.Button;

  private roomId: string;
  // 是否是房主
  private isOwner: boolean;
  // 是否可以开始游戏
  private canStartGame: boolean;
  // 对手的userId
  private otherUserId: number;

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

    // 监听获取房间的详细信息
    mgr.addEventListener(
      logic.EventNames.getRoomDetail,
      this.onGetRoomDetailDone,
      this
    );

    // 监听玩家的加入房间
    mgr.addEventListener(
      logic.EventNames.joinRoomNotify,
      this.onJoinRoomNotifyDone,
      this
    );

    // 监听玩家的退出房间
    mgr.addEventListener(
      logic.EventNames.joinOverNotify,
      this.onLeaveRoomDone,
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

    let me = this.master.me;
    let owner = detail.owner;
    let userList = detail.userList;
    userList.forEach(us => {
      let profile = JSON.parse(us.userProfile) as logic.IUser;
      if (us.userId === me.id) {
        this.playerName.text = profile.name;
        this.logo.source = profile.logo;
      } else {
        this.otherPlayerName.text = profile.name;
        this.otherLogo.source = profile.logo;
      }
    });

    this.canStartGame = userList.length == 2;
    this.isOwner = owner === me.id;
    this.updateView();
  }

  // 玩家进入房间
  onJoinRoomNotifyDone(e): void {
    console.warn("someone enter room");
    let data: logic.IJoinRoomNotify = e.data;
    let profile: logic.IUser = JSON.parse(data.userProfile);
    this.otherPlayerName.text = profile.name;
    this.otherLogo.source = profile.logo;
  }

  // 玩家退出房间
  onLeaveRoomDone(e): void {}

  // 踢人
  kickPlayer(id: number) {}

  // 开始游戏
  starGame(): void {}

  private updateView() {
    this.kickBtn.enabled = this.isOwner;
    this.kickBtn.visible = this.isOwner;

    this.startBtn.enabled = this.canStartGame;
  }
}
