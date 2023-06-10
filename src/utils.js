function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

function checkIfVisible(ship, x, y) {
  if(Math.abs(x-ship.position.x)>width/2) return false;
  if(Math.abs(y-ship.position.y)>height/2) return false;
  return true;
}

async function msgGossipped(msg) {
  const encoder = new TextEncoder();
  const data = encoder.encode(msg);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const key = _arrayBufferToBase64(hash)
  msgReceived[key] = true
}

function _arrayBufferToBase64( buffer ) {
  const binary = '';
  const bytes = new Uint8Array( buffer );
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return btoa( binary );
}