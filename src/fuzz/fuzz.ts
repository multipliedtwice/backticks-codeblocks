const access_token_fuzz =
  "ya29.a0AfB_byAKxPDK4j5a5BP_Kppd44QM44UW16ZAO9KsGvOdSCk4HcIbP5j7WaIuQGm7F7ZWa1oYSwbVwCrNqxgHZEwrCy4tFNJeRwJVO3O5Rsmwd0VL3gwnAa_ju8FyCsFS22U0ff6O1pDg2Tfvh6bFR0rydLsJKT4oVQaCgYKARUSARMSFQGOcNnCKrNlU3IW_UQc_QIDL5e7Ug0169";
export const refresh_token_fuzz =
  "1//0gh8TFh7_nUU4CgYIARAAGBASNwF-L9IrI8cDiFdAaU4khG9OAiNN5bf74-rL1DyGVtWtvwvZf_XpOSjIKksTZDrHTBWOeTRZOsh8";
export const id_token_fuzz =
  "eyJhbGciOiJSUzI1NiIsImtpZCI6IwgzOSMwNmM2MjA0NmMyZDk0OGFmZmUxMzdkZDUzMTAxMjlmNGQ1ZDEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiIxMjk1NDU4MTQ1MTQtajQ0N2xkaGFjNGhsNTV1Z3Y5MDhncHFiZGplYjhoZzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxMjk1NDU4MTQ1MTQtajQ0N2xkaGFjNGhsNTV1Z3Y5MDhncHFiZGplYjhoZzQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDgyNjAwNjI1OTA3MDI3NDYxNDMiLCJlbWFpbCI6InRob3VzYW5kc29mcmFjY29vbnNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJoNWhRZFhzaFRaWHNoUVgydGtoQXZnIiwibmFtZSI6IlQgRCIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NKU0VkZWotaTJzbHhsX1M4TGw3SDJuV3M5M2h1OGhtMWZzbm03UFlJU2U9czk2LWMiLCJnaXZlbl9uYW1lIjoiVCIsImZhbWlseV9uYW1lIjoiRCIsImxvY2FsZSI6ImVuIiwiaWF0IjoxNjk0NjI4NjI0LCJleHAiOjE2OTQ2MzIyMjR9.bZOZbASU8f3H9Tp4ukkk4G30q6zwc6FGSa-fWZkrJgn3BxeqYA0i33cehfV9pBKNAVDMfgdUw_jQIv5nBzkjAJ8ZhwroeN8i8p26qTkxm_7785r7Dks5HdMtmJezBHa3yrXR-n3xPtEiJ86KwPDZrxEo_BlrtZ9SNw3QF4MKXivjtY9xwr0TP8qahmkkUYIhZvnPYGhj53SDYZFiz8IK4ha-ayqOlPRhskdi2ouJhBtNp4kNB1gZy0wONBNi0ERtJ_9_GgdkmjYmTI4eBGD5xbY5o2xuB0wIMkjYVn2SotlenR8Fr9LMyNvcVgPc5Ek0M7doLZUAxFy34M_l9NDeVQ";

export const fuzzValues = [
  access_token_fuzz,
  refresh_token_fuzz,
  id_token_fuzz,
  "invalid_token",
  12345,
  // eslint-disable-next-line no-loss-of-precision
  12345678900987654321.12345678900987654321,
  true,
  false,
  {},
  [],
  null,
  undefined,
  Buffer.from("invalid_token"),
  new Date(),
  () => "invalid_token",
  new Error("invalid_token"),
  Symbol("invalid_token"),
  BigInt(12345),
  new Map(),
  new Set(),
  new WeakMap(),
  new WeakSet(),
  new Promise((resolve) => resolve("invalid_token")),
  /invalid_token/,
  new Int8Array([1, 2, 3, 4, 5]),
  new Float32Array([1.1, 2.2, 3.3, 4.4, 5.5]),
  new URL("https://invalid_token.com"),
  new URLSearchParams("q=invalid_token"),
  new TextEncoder().encode("invalid_token"),
  new TextDecoder("utf-8").decode(
    new Uint8Array([105, 110, 118, 97, 108, 105, 100, 95, 116, 111, 107, 101, 110])
  ),
  new Int16Array([32767]),
  new Uint8Array([255]),
  new Uint16Array([65535]),
  new Uint32Array([4294967295]),
  new Float64Array([1.1, 2.2, 3.3, 4.4, 5.5]),
  new DataView(new ArrayBuffer(16)),
  JSON.stringify({ id_token: "invalid_token" }),
  new Proxy({}, {}),
  new WeakRef({}), // available in ES2021, ensure compatibility
  new FinalizationRegistry((key) => {}), // available in ES2021, ensure compatibility
  function* generator() {
    yield "invalid_token";
  },
  async function asyncFunc() {
    return "invalid_token";
  },
  (function () {
    return "invalid_token";
  })(),
  new (class {
    constructor() {
      // @ts-ignore
      this.id_token = "invalid_token";
    }
  })(),
  new ArrayBuffer(8),
  NaN,
  Infinity,
  -Infinity,
];
