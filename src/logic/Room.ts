module logic {
  export class Room {
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
    public constructor() {}
  }

  export enum ERoomStatus {
    open = "open",
    close = "close"
  }
}
