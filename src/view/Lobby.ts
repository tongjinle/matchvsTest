class Lobby extends eui.Component implements eui.UIComponent {
  master: GameView;
  roomList: eui.List;
  createRoomBtn: eui.Button;
  enterRoomBtn: eui.Button;

  private roomDataList: logic.IRoom[] = [];

  public constructor(master: GameView) {
    super();
    this.master = master;
  }

  protected partAdded(partName: string, instance: any): void {
    super.partAdded(partName, instance);
  }

  protected childrenCreated(): void {
    super.childrenCreated();

    this.getRoomList();

    this.roomList.itemRenderer = RoomItem;
    // this.roomList.dataProvider = new eui.ArrayCollection(["1", "2", "3"]);

    this.listen();
  }

  // 根据当前[我]的状态,来设置下ui的表现
  // eg:如果[我]已经有了roomId,那么新建房间是不可以的,而进入房间就可以了
  refrechUiView(): void {
    let me = this.master.me;
    this.createRoomBtn.enabled = !me.roomId;
    this.enterRoomBtn.enabled = !!me.roomId;
  }

  private listen(): void {
    this.roomList.addEventListener(
      egret.TouchEvent.TOUCH_END,
      this.onSelectRoom,
      this
    );

    // 创建房间
    this.createRoomBtn.addEventListener(
      egret.TouchEvent.TOUCH_END,
      this.onCreateRoom,
      this
    );

    // 加入房间完成
    this.master.mgr.addEventListener(
      logic.EventNames.joinRoom,
      this.onJoinRoomDone,
      this
    );

    // 创建房间完成
    this.master.mgr.addEventListener(
      logic.EventNames.createRoom,
      this.onCreateRoomDone,
      this
    );
    // 获取房间列表完成
    this.master.mgr.addEventListener(
      logic.EventNames.getRoomListEx,
      this.onGetRoomListDone,
      this
    );
  }

  private unListen(): void {
    this.createRoomBtn.removeEventListener(
      eui.ItemTapEvent.ITEM_TAP,
      this.onCreateRoom,
      this
    );
  }

  private onSelectRoom(e): void {
    let item: logic.IRoom = this.roomList.selectedItem;
    let index = this.roomList.selectedIndex;
    let data = this.roomDataList[index];
    console.warn("you select item name:", item.name, data);

    let roomId: string = data.id;
    let userProfile: string = JSON.stringify(this.master.me);
    this.master.mgr.joinRoom(roomId, userProfile);
  }

  private onCreateRoom(): void {
    console.log("touch createRoom button");
    let name: string = "room-" + Math.floor(1e8 * Math.random()).toString(16);
    let maxPlayer = logic.Config.maxPlayer;
    let userProfile: string = JSON.stringify(this.master.me);
    this.master.mgr.createRoom(name, maxPlayer, userProfile);
  }

  private onCreateRoomDone(e): void {
    this.getRoomList();

    // 更改自己的属性,表示已经在房间了
    // 创建房间的按钮不能再用了
    let data: logic.ICreateRoom = e.data;
    let roomId: string = data.roomId;
    this.master.me.roomId = roomId;

    // 设置下"进入房间"按钮可用
    this.refrechUiView();

    // 去我的房间
    this.master.changeView("waitRoom");
  }

  private getRoomList(): void {
    this.master.mgr.getRoomListEx();
  }

  private onGetRoomListDone(e): void {
    let data: logic.IRoom[] = e.data;
    this.roomDataList.push(...data);
    let me = this.master.me;
    let formatData = data.map(n => {
      return {
        isMe: n.owner === me.id,
        name: n.name,
        openText: n.status === logic.ERoomStatus.open ? "open" : "close"
      };
    });
    console.log(formatData);
    this.roomList.dataProvider = new eui.ArrayCollection(formatData);
  }

  private onJoinRoomDone(e): void {
    console.log("onJoinRoomDone");
    let data: logic.IJoinRoom = e.data;
    this.master.me.roomId = data.roomInfo.id;
    this.master.changeView("waitRoom");
  }

  private release(): void {
    this.unListen();
  }
}
