# k6-tools

Tools for [k6](https://k6.io/) scripts.

## Install

```shell
npm i @gwinkamp/k6-tools
```

## Usage

### Request headrs builder

designed for easy assembly of HTTP request headers.

```javascript
import { Headers } from "@gwinkamp/k6-tools";
import http from "k6/http";

export default function() {
  const headers = new Headers();

  // add custom header
  headers.add("X-CustomHeader", "Value");

  // set Authorization header
  headers.setAuth("my-secret-token");

  // set Content-Type header
  headers.setContentType("plain/text");

  // set Content-Type header with "application/json" value
  headers.setJsonContentType();

  // set multipart/form-data Content-Type header with boundary
  headers.setFormDataContentType("test-boundary");

  const response = http.get("http://localhost:8080/get", {
    headers: headers.build()  // build headers
  });
}
```

### Multipart form-data builder

designed for assembling multipart form-data payload of request body.

```javascript
import { FormData, Headers } from "@gwinkamp/k6-tools";
import http from "k6/http";

const file = open("test.txt", "b");

export default function() {
  const headers = new Headers();
  const form = new FormData();

  // add string field to form
  form.append("param", "value");

  // add file field to form
  form.append("file", http.file(file, "test.txt"));

  // set multipart/form-data Content-Type header with boundary
  headers.setFormDataContentType(form.boundary);

  const response = http.post(
    "http://localhost:8080/post",
    form.body(),
    {
      headers: headers.build(),
    }
  );
}
```

### k6 utils

All methods from the [k6-util](https://grafana.com/docs/k6/latest/javascript-api/jslib/utils/) library are also available. For example:

```javascript
import { randomString } from "@gwinkamp/k6-tools"

export default function() {
  console.log(randomString(10));
}
```

## Contribution

Freely. I am always glad to have suggestions
