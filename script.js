const gun = Gun({
	peers: ['https://HerokuCoordinator.karmakarmeghdip.repl.co/gun']
})
const user = gun.user();

document.getElementsByClassName('signup-form')[0].addEventListener('submit', async (e)=>{
	e.preventDefault();
	const alias = document.getElementById("signup_username").value
	const password = document.getElementById("signup_password").value
	console.log("Logging in...", alias, password)
	await createAcc(alias, password)
	if(!user.is) login(alias, password)
	
	console.log("Signed up...")
	window.location.href = "game.html"
	// window.location = "./game.html";
	// document.getElementsByTagName("canvas")[0].style.display = "block"
	// document.getElementById("login_page").style.display = "none"
})

document.getElementsByClassName('login-form')[0].addEventListener('submit', async (e)=>{
	e.preventDefault();
	const alias = document.getElementById("login_username").value
	const password = document.getElementById("login_password").value
	console.log("Logging in...", alias, password)
	await login(alias, password)
	console.log("Logged in...")
	window.location.href = "game.html"
	// window.location = "game.html";
	
	
	// document.getElementsByTagName("canvas")[0].style.display = "block"
	// document.getElementById("login_page").style.display = "none"
})

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

// Get the modal
var modal1 = document.getElementById("sign_up");

// Get the button that opens the modal
var btn1 = document.getElementById("signup");
var modal2 = document.getElementById("log_in");
var btn2 = document.getElementById("login");
// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close1")[0];
var span2 = document.getElementsByClassName("close2")[0];

// When the user clicks the button, open the modal
btn1.onclick = function () {
	modal1.style.display = "block";
};

btn2.onclick = function () {
	modal2.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span1.onclick = function () {
	modal1.style.display = "none";
	modal2.style.display = "none";
};
span2.onclick = function () {
	modal1.style.display = "none";
	modal2.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
	if (event.target == modal1) {
		modal1.style.display = "none";
		modal2.style.display = "none";
	}
	if (event.target == modal2) {
		modal1.style.display = "none";
		modal2.style.display = "none";
	}
};