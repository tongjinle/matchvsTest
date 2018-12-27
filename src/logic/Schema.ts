module logic {
  export interface IRegisterUser {
    userId: number;
    token: string;
    name: string;
  }

  export interface ILogin {
    roomId: string;
  }

  export interface ICreateRoom {
    roomId: string;
    owner: number;
  }

  export interface IJoinRoom {
    userInfoList: {
      userId: number;
      userProfile?: string;
    }[];
    roomInfo: {
      id: string;
      owner: number;
      state: number;
    };
  }

  export interface ILeaveRoom {
    roomId: string;
    userId: number;
    cpProto: string;
  }

  export interface IJoinRoomNotify {
    userId: number;
    userProfile?: string;
  }

  export interface ILeaveRoomNotify {}

  export interface IJoinOpen {}

  export interface IJoinOpenNotify {}

  export interface IJoinOver {}

  export interface IJoinOverNotify {}

  ///////////////////////////////////

  export interface IUser {
    // id
    id: number;
    // 名称
    name: string;
    // logo
    logo: string;
    // token
    token: string;
    // roomId
    roomId?: string;
  }

  export interface IRoom {
    // id
    id: string;
    // 名称
    name: string;
    // 房间状态
    status: ERoomStatus;
    // 最大玩家数量
    maxPlayer: number;
    // 房主id
    owner: number;
  }

  // 详细的房间信息
  export interface IRoomDetail {
    owner: number;
    maxPlayer: number;
    status: ERoomStatus;
    userList: {
      userId: number;
      userProfile: string;
    }[];
  }
}
