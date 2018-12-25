module logic {
  export class User {
    // id
    userId: number;
    // 名字
    name: string;
    // token
    token: string;
    // 状态
    status: EUserStatus;
    // 所在房间id
    roomId: string;
    // 是否是房主
    isOwner: boolean;
    // 游戏数据
    gameData: GameData;
    public constructor() {}
  }

  export enum EUserStatus {}
}
