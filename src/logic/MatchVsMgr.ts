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
      let code: number = this.engine.init(
        this.response,
        Config.channel,
        Config.platform,
        Config.gameId
      );
      console.log("init response CODE:", code);
    }

    registerWithThirdPart(
      openId: string,
      session: string
    ): Promise<{ userId: number; token: string }> {
      let hash = new md5();
      let reqUrl = Config.bindThirdUserIdUrl;
      let appKey = Config.appKey;
      let secretKey = Config.appSecret;
      let gameId = Config.gameId;
      //sign=md5(appKey&gameID=value1&openID=value2&session=value3&thirdFlag=value4&appSecret)
      let params =
        appKey +
        "&gameID=" +
        gameId +
        "&openID=" +
        openId +
        "&session=" +
        session +
        "&thirdFlag=1&" +
        secretKey;
      //计算签名
      let signstr = hash.hex_md5(params); //MD5 需要自己找方法
      console.log({ signstr });
      //重组参数 userID 传0
      //用于post请求，不能使用get请求，如果使用get请求可能会出现签名失败，因为微信session_key有需要url编码的字符
      let jsonParam = {
        userID: 0,
        gameID: gameId,
        openID: openId,
        session: session,
        thirdFlag: 1,
        sign: signstr
      };
      return new Promise((resolve, reject) => {
        var request = new egret.HttpRequest();
        request.responseType = egret.HttpResponseType.TEXT;
        request.open(reqUrl, egret.HttpMethod.POST);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(jsonParam));

        request.addEventListener(
          egret.Event.COMPLETE,
          (event: egret.Event) => {
            var request = <egret.HttpRequest>event.currentTarget;
            console.log("bindOpenIDWithUserID get data : ", request.response);
            let repData = JSON.parse(request.response);
            console.log("bindOpenIDWithUserID repData : ", repData);
            //绑定成功
            if (repData.status == 0) {
              //绑定成功就会返回 userID等信息
              resolve({
                userId: repData.data.userid,
                token: repData.data.token
              });
            } else {
              reject();
            }
          },
          this
        );
      });
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
    createRoom(
      name: string,
      maxPlayer: number,
      userProfile: string = ""
    ): void {
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
      this.engine.createRoom(roomInfo, userProfile);
    }

    // 进入房间
    joinRoom(roomId: string, userProfile: string = ""): void {
      this.engine.joinRoom(roomId, userProfile);
    }

    // 离开房间
    leaveRoom(cpProto: string = ""): void {
      this.engine.leaveRoom(cpProto);
    }

    // 踢人
    kickPlayer(userId: number, cpProto: string = ""): void {
      this.engine.kickPlayer(userId, cpProto);
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
    getRoomListEx(): void {
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

    // 获取房间信息
    getRoomDetail(roomId: string): void {
      this.engine.getRoomDetail(roomId);
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
          console.log("register success.", userInfo);
          let data: IUser = {
            id: userInfo.userID,
            token: userInfo.token,
            name: userInfo.name,
            logo: userInfo.avatar
          };
          this.fireEvent(EventNames.registerUser, data);
        }
      };

      // 用户登陆
      res.loginResponse = login => {
        console.log(login);
        if (login.status === 200) {
          console.log("login success.", login);
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
          console.warn("joinRoom in mgr:", userInfoList);

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
        } else {
          console.error("join room error code:", status);
        }
      };

      // 加入房间(提醒)
      res.joinRoomNotify = userInfo => {
        console.warn("joinRoomNotify in mgr:", userInfo);
        let data: IJoinRoomNotify = {
          userId: userInfo.userID,
          userProfile: userInfo.userProfile
        };
        this.fireEvent(EventNames.joinRoomNotify, data);
      };

      // 离开房间(主动)
      res.leaveRoomResponse = res => {
        let status = res.status;
        if (status === 200) {
          let data: ILeaveRoom = {
            roomId: res.roomID,
            userId: res.userID,
            cpProto: res.cpProto
          };
          this.fireEvent(EventNames.leaveRoom, data);
        }
      };

      // 离开房间(提醒)
      res.leaveRoomNotify = res => {
        let data: ILeaveRoomNotify = {
          owner: res.owner,
          roomId: res.roomID,
          userId: res.userID,
          cpProto: res.cpProto
        };
        this.fireEvent(EventNames.leaveRoomNotify, data);
      };

      // 踢出房间(主动)
      res.kickPlayerResponse = kick => {
        if (kick.status === 200) {
          let data: IKickPlayer = {
            owner: kick.owner,
            userId: kick.userID
          };
          this.fireEvent(EventNames.kickPlayer, data);
        }
      };

      // 踢出房间(被动)
      res.kickPlayerNotify = kick => {
        let data: IKickPlayerNotify = {
          owner: kick.owner,
          userId: kick.userID
        };
        this.fireEvent(EventNames.kickPlayerNotify, data);
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
          let data: IRoom[];
          data = roomList.map(n => {
            let rst: IRoom = {
              id: n.roomID,
              name: n.roomName,
              maxPlayer: n.maxPlayer,
              status: n.state === 1 ? ERoomStatus.open : ERoomStatus.close,
              owner: n.owner
            };

            return rst;
          });
          this.fireEvent(EventNames.getRoomListEx, data);
        }
      };

      // 获取房间详情
      res.getRoomDetailResponse = res => {
        let status = res.status;
        if (status === 200) {
          let data: IRoomDetail;
          data = {
            owner: res.owner,
            maxPlayer: res.maxPlayer,
            status: res.state === 1 ? ERoomStatus.open : ERoomStatus.close,
            userList: res.userInfos.map(n => {
              let rst = { userId: n.userID, userProfile: n.userProfile };
              return rst;
            })
          };
          this.fireEvent(EventNames.getRoomDetail, data);
        } else {
          console.error("getRoomDetailResponse status:", status);
        }
      };
    }

    // 辅助函数
    private fireEvent(eventName: string, data?: any) {
      this.dispatchEvent(new egret.Event(eventName, false, false, data));
    }
  }
}
