export class URL {
  private readonly baseURL: string;
  private queryParams: Array<[key: string, value: string]>;

  constructor(url: string) {
    this.baseURL = url;
    this.queryParams = new Array<[string, string]>();
  }

  public addParam(key: string, value: any): this {
    if (value.constructor == Array) {
      value.forEach((item) => this.addParam(`${key}[]`, item));
    } else {
      this.queryParams.push([key, String(value)]);
    } 
    return this;
  }

  public toString(): string {
    if (this.queryParams.length == 0) {
      return this.baseURL;
    }
    const params = this.queryParams
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

    return `${this.baseURL}?${params}`;
  }
}