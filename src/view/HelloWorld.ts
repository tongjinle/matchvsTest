class HelloWorld extends eui.Component implements eui.UIComponent {
  public group: eui.Group;
  public logo: eui.Image;
  public btn: eui.Button;

  public constructor() {
    super();
  }

  protected partAdded(partName: string, instance: any): void {
    console.log("partAdded");
    console.log(partName);

    // if (partName === "btn") {
    //   this.btn = instance;
    //   this.btn.addEventListener(
    //     egret.TouchEvent.TOUCH_TAP,
    //     () => {
    //       console.log("touch logo");
    //     },
    //     this
    //   );
    // }

    super.partAdded(partName, instance);
  }

  protected childrenCreated(): void {
    console.log("childrenCreated");
    super.childrenCreated();
    console.log(this.group, this.logo, this.btn);
    this.btn.addEventListener(
      egret.TouchEvent.TOUCH_TAP,
      () => {
        console.log("touch logo, add eventlistener in childrenCreated");
      },
      this
    );
  }
}
