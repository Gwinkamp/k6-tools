/**
 * HTTP Request Headers Builder
 */
export class Headers {
  private headers: Record<string, string>;

  constructor() {
    this.headers = {};
  }

  public reset() {
    this.headers = {};
  }

  public add(key: string, value: string) {
    this.headers[key] = value;
    return this;
  }

  public setAuth(value: string) {
    this.add("Authorization", value);
    return this;
  }

  public setJsonContentType() {
    this.setContentType("application/json");
    return this;
  }

  public setFormDataContentType(boundary: string) {
    this.setContentType(`multipart/form-data; boundary=${boundary}`);
    return this;
  }

  public setContentType(value: string) {
    this.add("Content-Type", value);
    return this;
  }

  public build(): Record<string, string> {
    const headers = { ...this.headers };
    this.reset();
    return headers;
  }
}