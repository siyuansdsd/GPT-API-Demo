import NamesService from "../names.service";

describe("NamesService", () => {
  let namesService: NamesService;

  beforeEach(() => {
    namesService = new NamesService();
  });

  it("should filter names containing the input characters", () => {
    const input = "大卫";
    const expectedNames = ["David Smith 大卫 斯密斯"];
    const result = namesService.getNames(input);
    expect(result).toEqual(expectedNames);
  });

  it("should handle input with spaces", () => {
    const input = "大 卫";
    const expectedNames = ["David Smith 大卫 斯密斯"];
    const result = namesService.getNames(input);
    expect(result).toEqual(expectedNames);
  });

  it("should tolerate a certain number of different characters", () => {
    const input = "李安娜"; // Allow some tolerance
    const expectedNames = ["Annie Lee 李安妮"];
    const result = namesService.getNames(input);
    expect(result).toEqual(expectedNames);
  });

  it("should return multiple names if input matches multiple", () => {
    const input = "张";
    const expectedNames = ["Yueling Zhang 月林张"];
    const result = namesService.getNames(input);
    expect(result).toEqual(expectedNames);
  });

  it("should return empty array if no names match", () => {
    const input = "不存在的名字";
    const expectedNames: string[] = [];
    const result = namesService.getNames(input);
    expect(result).toEqual(expectedNames);
  });
});
