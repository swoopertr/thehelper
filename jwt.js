// Simple JWT encode and decode functions for browser environments

const base64UrlEncode = (str) => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

const base64UrlDecode = (str) => {
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4) {
    str += '=';
  }
  return Uint8Array.from(atob(str), c => c.charCodeAt(0));
};

const stringToUint8Array = (str) => {
  return new TextEncoder().encode(str);
};

const uint8ArrayToString = (array) => {
  return new TextDecoder().decode(array);
};

const jwtEncode = async (payload, secret) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const encodedHeader = base64UrlEncode(stringToUint8Array(JSON.stringify(header)));
  const encodedPayload = base64UrlEncode(stringToUint8Array(JSON.stringify(payload)));

  const data = stringToUint8Array(`${encodedHeader}.${encodedPayload}`);
  const key = await crypto.subtle.importKey(
    'raw',
    stringToUint8Array(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, data);
  const encodedSignature = base64UrlEncode(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
};

const jwtDecode = async (token, secret) => {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');

  const header = JSON.parse(uint8ArrayToString(base64UrlDecode(encodedHeader)));
  const payload = JSON.parse(uint8ArrayToString(base64UrlDecode(encodedPayload)));

  const data = stringToUint8Array(`${encodedHeader}.${encodedPayload}`);
  const key = await crypto.subtle.importKey(
    'raw',
    stringToUint8Array(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const signature = base64UrlDecode(encodedSignature);
  const isValid = await crypto.subtle.verify('HMAC', key, signature, data);

  if (!isValid) {
    throw new Error('Invalid signature');
  }

  return { header, payload };
};