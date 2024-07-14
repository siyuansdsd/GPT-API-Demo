export default class mockingData {
  private mockingData: { data: string[] };
  constructor() {
    this.mockingData = {
      data: [
        "David Smith 大卫 斯密斯",
        "Yueling Zhang 月林张",
        "Huawen Wu 华文吴",
        "Annie Lee 李安妮",
      ],
    };
  }

  public getNames = () => {
    return this.mockingData.data;
  };
}
