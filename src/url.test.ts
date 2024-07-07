import { describe, expect, test } from "vitest";
import { URL } from "./url";

describe("Build URL", () => {
  test("With single query parameter", () => {
    const url = new URL("https://example.com");
    url.addParam("key", "value");
    expect(url.toString()).toBe("https://example.com?key=value");
  });

  test("With multiple query parameters", () => {
    const url = new URL("https://example.com");
    url.addParam("key1", "value1");
    url.addParam("key2", 123);
    expect(url.toString()).toBe("https://example.com?key1=value1&key2=123");
  });

  test("With array query parameter", () => {
    const url = new URL("https://example.com");
    url.addParam("key", ["value1", "value2"]);
    expect(url.toString()).toBe("https://example.com?key[]=value1&key[]=value2");
  });

  test("With single and array query parameter", () => {
    const url = new URL("https://example.com");
    url.addParam("key1", "value1");
    url.addParam("key2", ["value2", "value3"]);
    expect(url.toString()).toBe("https://example.com?key1=value1&key2[]=value2&key2[]=value3");
  });
});
