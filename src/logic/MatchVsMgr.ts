module logic {
  export class MatchVsMgr extends egret.EventDispatcher {
    engine: MatchvsEngine;
    response: MatchvsResponse;

    public constructor() {
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
      let mode: number = 1;
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
    }

    // 辅助函数
    private fireEvent(eventName: string, data?: any) {
      this.dispatchEvent(new egret.Event(eventName, false, false, data));
    }
  }
}
