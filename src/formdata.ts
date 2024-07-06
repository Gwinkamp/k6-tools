import { FileData } from "k6/http";

/**
 * Custom FormData
 * @description original FormData from k6/jslib class does not support Cyrillic encoding
 */
export class FormData {

  public readonly boundary: string;
  public readonly parts: Array<{ field: string; file: any }>;

  constructor() {
    this.boundary = "------RWWorkerFormDataBoundary" + Math.random().toString(36);
    this.parts = [];
  }

  /**
   * Add FormaData field
   * @param fieldName field name
   * @param data field value
   */
  public append(fieldName: string, data: string | FileData) {
    if (arguments.length < 2) {
      throw new SyntaxError("Not enough arguments");
    }
    if (typeof data === "string") {
      this.parts.push({
        field: fieldName,
        file: { data: data, content_type: "text/plain" }
      });
    } else {
      this.parts.push({ field: fieldName, file: data });
    }
  }

  /**
   * Encode form-data fields for further sending via HTTP
   */
  public body() {
    const body = new Array<number>();
    const barr = this._encode("--" + this.boundary + "\r\n");
    for (let i = 0; i < this.parts.length; i++) {
      Array.prototype.push.apply(body, barr);

      const part = this.parts[i];
      const cd = this._buildContentDisposition(part);
      Array.prototype.push.apply(body, this._encode(cd));

      const data = Array.isArray(part.file.data) ? part.file.data : this._encode(part.file.data);
      Array.prototype.push.apply(body, data);
      Array.prototype.push.apply(body, this._encode("\r\n"));
    }
    Array.prototype.push.apply(body, this._encode("--" + this.boundary + "--\r\n"));
    return new Uint8Array(body).buffer;
  }

  /**
   * Encode data to be sent over HTTP
   * @param input data for encoding
   */
  private _encode(input: string | Uint8Array | ArrayBuffer) {
    if (typeof input === "string") {
      return this._encodeString(input);
    } else if (input && input.byteLength) { /*If ArrayBuffer or typed array */
      return this._encodeBuffer(input);
    }
    throw new SyntaxError(`Unsupported data type passed: ${ typeof input }`);
  }

  /**
   * Encode a string to send over HTTP
   * @param input string for encoded
   */
  private _encodeString(input: string) {
    const utf8 = [];
    for (let i = 0; i < input.length; i++) {
      let charcode = input.charCodeAt(i);
      if (charcode < 0x80) utf8.push(charcode);
      else if (charcode < 0x800) {
        utf8.push(0xc0 | (charcode >> 6),
          0x80 | (charcode & 0x3f));
      } else if (charcode < 0xd800 || charcode >= 0xe000) {
        utf8.push(0xe0 | (charcode >> 12),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f));
      }
      // surrogate pair
      else {
        i++;
        // UTF-16 encodes 0x10000-0x10FFFF by
        // subtracting 0x10000 and splitting the
        // 20 bits of 0x0-0xFFFFF into two halves
        charcode = 0x10000 + (((charcode & 0x3ff) << 10)
          | (input.charCodeAt(i) & 0x3ff));
        utf8.push(0xf0 | (charcode >> 18),
          0x80 | ((charcode >> 12) & 0x3f),
          0x80 | ((charcode >> 6) & 0x3f),
          0x80 | (charcode & 0x3f));
      }
    }
    return utf8;
  }

  /**
   * Encode binary data to be sent over HTTP
   * @param input binary data for encoding
   */
  private _encodeBuffer(input: Uint8Array | ArrayBuffer) {
    const arr: Array<number> = [];

    let _input: Uint8Array;
    if (!("byteOffset" in input)) { /* If ArrayBuffer, wrap in view */
      _input = new Uint8Array(input);
    } else {
      _input = input;
    }

    for (let i = 0; i < _input.byteLength; ++i) {
      arr.push(_input[i] & 0xff);
    }

    return arr;
  }

  /**
   * Build the Content-Disposition attribute for form-data field
   * @param part attribute data
   */
  private _buildContentDisposition(part: { field: string; file: any }) {
    let result = "Content-Disposition: form-data; name=\"" + part.field + "\"";
    if (part.file.filename) {
      result += "; filename=\"" + part.file.filename.replace(/"/g, "%22") + "\"";
    }
    result += "\r\nContent-Type: " + (part.file.content_type || "application/octet-stream") + "\r\n\r\n";
    return result;
  }
}
