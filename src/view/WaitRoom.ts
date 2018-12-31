class WaitRoom extends eui.Component implements eui.UIComponent {
  master: GameView;
  logo: eui.Image;
  otherLogo: eui.Image;
  playerName: eui.Label;
  otherPlayerName: eui.Label;
  // 踢人按钮
  kickBtn: eui.Button;
  // 离开房间按钮
  leaveBtn: eui.Button;
  // 开始游戏按钮
  startBtn: eui.Button;

  private _currentPlayer: { userId: number; name: string; logo: string };
  public get currentPlayer(): { userId: number; name: string; logo: string } {
    return this._currentPlayer;
  }
  public set currentPlayer(v: { userId: number; name: string; logo: string }) {
    this._currentPlayer = v;
    //
    if (v) {
      this.logo.source = v.logo;
      this.playerName.text = v.name;
    }
    this.updateView();
  }

  private _otherPlayer: { userId: number; name: string; logo: string };
  public get otherPlayer(): { userId: number; name: string; logo: string } {
    return this._otherPlayer;
  }
  public set otherPlayer(v: { userId: number; name: string; logo: string }) {
    this._otherPlayer = v;
    if (v) {
      this.otherLogo.visible = true;
      this.otherLogo.source = v.logo;
      this.otherPlayerName.text = v.name;
    } else {
      this.otherLogo.visible = false;
      this.otherPlayerName.text = "";
    }
    this.updateView();
  }
  // 房间id
  private roomId: string;
  // 房间detail
  private detail: logic.IRoomDetail;
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

    this.clearStauts();
    this.updateView();

    this.listen();

    let me = this.master.me;
    let roomId: string = me.roomId;
    this.roomId = me.roomId;
    this.getRoomDetail(this.roomId);
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

    // 监听(其他)玩家的退出房间
    mgr.addEventListener(
      logic.EventNames.leaveRoomNotify,
      this.onLeaveRoomNotifyDone,
      this
    );

    // 监听(自己)退出房间
    mgr.addEventListener(
      logic.EventNames.leaveRoom,
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

    // 离开房间
    this.leaveBtn.addEventListener(
      egret.TouchEvent.TOUCH_END,
      this.leaveRoom,
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

    //
  }
  private release(): void {
    this.unListen();
  }

  //

  getRoomDetail(roomId: string): void {
    this.master.mgr.getRoomDetail(roomId);
  }

  onGetRoomDetailDone(e): void {
    let detail: logic.IRoomDetail = e.data;
    console.log("room detail:", detail);
    this.detail = detail;
    let me = this.master.me;
    let userList = detail.userList;
    this.currentPlayer = undefined;
    this.otherPlayer = undefined;
    userList.forEach(us => {
      let profile = JSON.parse(us.userProfile) as logic.IUser;
      if (us.userId === me.id) {
        this.currentPlayer = {
          userId: us.userId,
          name: profile.name,
          logo: profile.logo
        };
      } else {
        this.otherPlayer = {
          userId: us.userId,
          name: profile.name,
          logo: profile.logo
        };
      }
    });

    // 记录最新的房间id
    this.master.lastRoomId = this.roomId;
  }

  // 玩家进入房间
  onJoinRoomNotifyDone(e): void {
    console.warn("someone enter room");
    let data: logic.IJoinRoomNotify = e.data;
    let profile: logic.IUser = JSON.parse(data.userProfile);
    this.otherPlayerName.text = profile.name;
    this.otherLogo.source = profile.logo;
  }
  // 其他玩家退出房间
  onLeaveRoomNotifyDone(e): void {
    console.warn("someone leave room");
    let data: logic.ILeaveRoomNotify = e.data;

    // 清空对方选手的显示
    this.otherPlayer = undefined;
  }

  // 玩家退出房间
  onLeaveRoomDone(e): void {
    let data: logic.ILeaveRoom = e.data;

    // 状态清空(还原到还没有进来的时候)
    this.clearStauts();
    // 当前roomId置空
    this.master.me.roomId = undefined;
    this.master.lastRoomId = undefined;
    // 切换到lobbyView
    this.master.changeView("lobby");
  }

  // 踢人
  kickPlayer() {
    let userId = this.otherPlayer.userId;
    this.master.mgr.kickPlayer(userId);
    console.log("kick player:", userId);
  }

  // 开始游戏
  starGame(): void {}

  // 离开房间
  leaveRoom(): void {
    this.master.mgr.leaveRoom();
  }

  private updateView() {
    this.startBtn.enabled = this.detail && this.detail.userList.length == 2;
    this.kickBtn.visible = this.kickBtn.enabled =
      this.detail &&
      this.currentPlayer &&
      this.otherPlayer &&
      this.detail.owner === this.master.me.id;
  }

  private clearStauts(): void {
    this.roomId = undefined;
    this.canStartGame = false;
    this.isOwner = false;
  }
}
