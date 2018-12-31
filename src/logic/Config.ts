module logic {
  let isDev: boolean = true;
  export class Config {
    static channel: string = "Matchvs";
    static platform: string = isDev ? "alpha" : "release";
    static gameId: number = 214360;
    static appKey: string = "a75dc42cf4ca4395ac01558252a0b00b#E";
    static appSecret: string = "84d8d5a296b54f6d9faf4214c9e42b22";

    static maxPlayer: number = 2;
    static mode: number = 1;

    static bindThirdUserIdUrl: string = isDev
      ? "http://alphavsuser.matchvs.com/wc6/thirdBind.do?"
      : "https://vsuser.matchvs.com/wc6/thirdBind.do?";
  }
}
