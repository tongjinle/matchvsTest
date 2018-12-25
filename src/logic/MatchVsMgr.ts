module logic {
  export class MatchVsMgr extends egret.EventDispatcher {
    private engine: MatchvsEngine;
    private response: MatchvsResponse;

    // 单例
    private static _instance: MatchVsMgr = undefined;
    static get instance(): MatchVsMgr {
      if (!MatchVsMgr._instance) {
        MatchVsMgr._instance = new MatchVsMgr();
      }
      return MatchVsMgr._instance;
    }

    private constructor() {
      super();

      this.engine = new MatchvsEngine();
      this.response = new MatchvsResponse();

      this.initResponseCallbacks();
    }

    // 暴露的方法
    initResponse(): void {
      this.engine.init(
        this.response,
        Config.channel,
        Config.platform,
        Config.gameId
      );
    }

    // 注册账户
    registerUser(): void {
      this.engine.registerUser();
    }

    // 登陆
    login(userId: number, token: string): void {
      let gameId: number = Config.gameId;
      let gameVersion: number = 1;
      let appKey: string = Config.appKey;
      let appSecret: string = Config.appSecret;
      let deviceId: string = "";
      let gatewayId: number = 0;
      this.engine.login(
        userId,
        token,
        gameId,
        gameVersion,
        appKey,
        appSecret,
        deviceId,
        gatewayId
      );
    }

    // 创建房间
    createRoom(name: string, maxPlayer: number): void {
      let mode: number = Config.mode;
      let canWatch: number = 1;
      let visibility: number = 1;
      let roomProperty: any = "";
      let roomInfo: MsCreateRoomInfo = new MsCreateRoomInfo(
        name,
        maxPlayer,
        mode,
        canWatch,
        visibility,
        roomProperty
      );
      let userProfile: string = "";
      this.engine.createRoom(roomInfo, userProfile);
    }

    // 进入房间
    joinRoom(roomId: string, userProfile: string = ""): void {
      this.engine.joinRoom(roomId, userProfile);
    }

    // 打开房间
    joinOpen(customProfile: string = ""): void {
      this.engine.joinOpen(customProfile);
    }

    // 关闭房间
    joinOver(customProfile: string = ""): void {
      this.engine.joinOver(customProfile);
    }

    // 获取房间列表
    getRoomList(): void {
      // let filter = new MsRoomFilter(Config.maxPlayer, Config.mode, 1, "");
      // this.engine.getRoomList(filter);
      // 0表示任意最大玩家数
      let maxPlayer: number = 0;
      let mode: number = 0; // 	模式（0 - 全部）* 创建房间时，mode最好不要填0 	2
      let canWatch: number = 0; // 	是否可以观战（0 - 全部 1 - 可以 2 - 不可以） 	1
      let roomProperty: string = ""; // 	房间属性 	“roomProperty”
      let full: number = 0; // 	0 - 全部 1 - 满 2 - 未满 	0
      let state: number = 0; // 	0 - 全部 1 - 开放 2 - 关闭 	0
      let sort: number = 0; // 	0 - 不排序 1 - 创建时间排序 2 - 玩家数量排序 3 - 状态排序 	0
      let order: number = 0; // 	0 - ASC 1 - DESC 	0
      let pageIndex: number = 0; // 	页码 	0
      let pageSize: number = 10000; // 	每一页的数量 	10
      let filter = new MsRoomFilterEx(
        maxPlayer,
        mode,
        canWatch,
        roomProperty,
        full,
        state,
        sort,
        order,
        pageIndex,
        pageSize
      );
      this.engine.getRoomListEx(filter);
    }

    // 开始游戏
    startGame(): void {}

    private initResponseCallbacks() {
      let res = this.response;

      // 初始化response
      res.initResponse = status => {
        if (status === 200) {
          console.log("init response success.");
          this.fireEvent(EventNames.responseInit);
        }
      };

      // 用户注册
      res.registerUserResponse = userInfo => {
        if (userInfo.status === 0) {
          console.log("register success.");
          let data: IRegisterUser = {
            userId: userInfo.userID,
            token: userInfo.token,
            name: userInfo.name
          };
          this.fireEvent(EventNames.registerUser, data);
        }
      };

      // 用户登陆
      res.loginResponse = login => {
        if (login.status === 200) {
          let data: ILogin = {
            // 这个roomId为0,为0的房间,实质上就是大厅
            roomId: login.roomID
          };
          this.fireEvent(EventNames.login, data);
        }
      };

      // 创建房间
      res.createRoomResponse = room => {
        if (room.status === 200) {
          console.log("create room success.");
          let data: ICreateRoom = {
            roomId: room.roomID,
            owner: room.owner
          };
          this.fireEvent(EventNames.createRoom, data);
        }
      };

      // 加入房间(主动)
      res.joinRoomResponse = (status, userInfoList, roomInfo) => {
        if (status === 200) {
          let data: IJoinRoom = {
            userInfoList: userInfoList.map(n => {
              return {
                userId: n.userID,
                userProfile: n.userProfile
              };
            }),
            roomInfo: {
              id: roomInfo.roomID,
              state: roomInfo.state,
              owner: roomInfo.owner
            }
          };
          this.fireEvent(EventNames.joinRoom, data);
        }
      };

      // 加入房间(提醒)
      res.joinRoomNotify = userInfo => {
        let data: IJoinRoomNotify = {
          userId: userInfo.userID,
          userProfile: userInfo.userProfile
        };
        this.fireEvent(EventNames.joinRoomNotify, data);
      };

      // 打开房间
      res.joinOpenResponse = open => {
        if (open.status === 200) {
          let data: IJoinOpen = {};
          this.fireEvent(EventNames.joinOpen, data);
        }
      };

      // 打开房间(提醒)
      res.joinOpenNotify = open => {
        let data: IJoinOpenNotify = {};
        this.fireEvent(EventNames.joinOpenNotify, data);
      };

      // 关闭房间
      res.joinOverResponse = over => {
        if (over.status === 200) {
          let data: IJoinOver = {};
          this.fireEvent(EventNames.joinOver, data);
        }
      };
      // 关闭房间
      res.joinOverNotify = over => {
        let data: IJoinOverNotify = {};
        this.fireEvent(EventNames.joinOverNotify, data);
      };

      // 更新房间列表
      res.getRoomListExResponse = res => {
        let status = res.status;
        let roomList = res.roomAttrs;
        if (status === 200) {
          let data: Room[];
          data = roomList.map(n => {
            let rst: Room = new Room();
            rst.id = n.roomID;
            rst.maxPlayer = n.maxPlayer;
            rst.status = n.state === 1 ? ERoomStatus.open : ERoomStatus.close;
            rst.owner = n.owner;
            return rst;
          });
          this.fireEvent(EventNames.updateRoomList, data);
        }
      };
    }

    // 辅助函数
    private fireEvent(eventName: string, data?: any) {
      this.dispatchEvent(new egret.Event(eventName, false, false, data));
    }
  }
}
