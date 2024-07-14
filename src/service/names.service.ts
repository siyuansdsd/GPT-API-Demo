import mockingData from "../mockingData/mockingData";

export default class NamesService {
  private Dao: mockingData;
  constructor() {
    this.Dao = new mockingData();
  }

  private isContainChars = (input: string, name: string) => {
    const inputChars = input.trim().replace(/\s+/g, "").split(""); // remove all spaces, and separate to array
    const nameChars = name.trim().replace(/\s+/g, "").split("");

    let tolerance = 0; // How many characters can be different
    if (inputChars.length > nameChars.length) {
      tolerance = Math.floor(inputChars.length / 2);
    } else {
      tolerance = Math.floor(inputChars.length / 2);
    }

    let diffCount = 0;
    const result = inputChars.every((char) => {
      if (!nameChars.includes(char)) {
        diffCount++;
      }
      return diffCount <= tolerance;
    });
    return result;
  };

  private filterNames = (input: string) => {
    const names = this.Dao.getNames();
    return names.filter((name) => this.isContainChars(input, name));
  };

  public getNames = (input: string) => {
    return this.filterNames(input);
  };
}
