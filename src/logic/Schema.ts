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

  export interface IJoinRoomNotify {
    userId: number;
    userProfile?: string;
  }

  export interface IJoinOpen {}

  export interface IJoinOpenNotify {}

  export interface IJoinOver {}

  export interface IJoinOverNotify {}
}
