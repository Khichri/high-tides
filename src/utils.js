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

const cyrb53 = (str, seed = 0) => {
	let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
	for(let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// get the key of a value in a map
function getByValue(map, searchValue) 
{
	for (let key in map)
	{
		if (map[key] == searchValue) return key;
	}
	return undefined;
}


async function msgGossipped(msg) {
	const encoder = new TextEncoder();
	const data = encoder.encode(msg);
	const hash = await crypto.subtle.digest("SHA-256", data);
	const key = _arrayBufferToBase64(hash)
	msgReceived[key] = true
}

function _arrayBufferToBase64( buffer ) {
	let binary = '';
	let bytes = new Uint8Array( buffer );
	let len = bytes.byteLength;
	for (let i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return btoa( binary );
}

async function login(username, password) {
	localStorage.setItem("username", username);
	localStorage.setItem("password", password);
	return new Promise((resolve, reject) => {
		if (!username) reject("Username can't be empty")
		if (!password) reject("Password can't be empty")
		user.auth(username, password, (ack) => {
			if (ack.err) reject(ack.err)
			// console.log(ack)
			resolve(ack)
		})
	})
}

async function createAcc(username, password) {
	localStorage.setItem("username", username);
	localStorage.setItem("password", password);
	return new Promise((resolve, reject) => {
		if (!username) reject("Username can't be empty")
		if (!password) reject("Password can't be empty")
		user.create(username, password, (ack) => {
			if (ack.err) reject(ack.err)
			// console.log(ack)
			resolve(ack)
		})
	})
}
