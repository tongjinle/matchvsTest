class Lobby extends eui.Component implements eui.UIComponent {
  master: GameView;
  roomList: eui.List;
  createRoomBtn: eui.Button;

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

  private listen(): void {
    this.roomList.addEventListener(
      egret.TouchEvent.TOUCH_END,
      this.onSelectRoom,
      this
    );

    this.createRoomBtn.addEventListener(
      egret.TouchEvent.TOUCH_END,
      this.onCreateRoom,
      this
    );
    ////
    this.master.mgr.addEventListener(
      logic.EventNames.createRoom,
      this.onCreateRoomDone,
      this
    );

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
    console.log("you select item name:", item.name);
  }

  private onCreateRoom(): void {
    console.log("touch createRoom button");
    let name: string = Math.floor(1e8 * Math.random()).toString(16);
    let maxPlayer = logic.Config.maxPlayer;
    this.master.mgr.createRoom(name, maxPlayer);
  }

  private onCreateRoomDone(e): void {
    this.getRoomList();
  }

  private getRoomList(): void {
    this.master.mgr.getRoomList();
  }

  private onGetRoomListDone(e): void {
    let data: logic.IRoom[] = e.data;
    this.roomList.dataProvider = new eui.ArrayCollection(data);
  }

  private release(): void {
    this.unListen();
  }
}
