module logic {
  export class Lobby {
    // 房间列表
    roomList: Room[] = [];
    // 用户列表
    userList: User[] = [];

    private mgr: MatchVsMgr;

    public constructor() {
      this.mgr = MatchVsMgr.instance;
      this.listen();
    }

    // 更新房间列表信息
    updateRoomList(): void {}

    // 监听信息
    private listen(): void {
      let mgr = this.mgr;
    }
  }
}
