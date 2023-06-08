const gun = Gun({
    peers: ['https://HerokuCoordinator.karmakarmeghdip.repl.co/gun']
})

const user = gun.user().recall({
    sessionStorage: true
})

const game = gun.get("high-tides")

async function login(username, password) {
    return new Promise((resolve, reject) => {
        if (!username) reject("Username can't be empty")
        if (!password) reject("Password can't be empty")
        user.auth(username, password, (ack) => {
            if (ack.err) reject(ack.err)
            console.log(ack)
            resolve(ack)
        })
    })
}

async function createAcc(username, password) {
    return new Promise((resolve, reject) => {
        if (!username) reject("Username can't be empty")
        if (!password) reject("Password can't be empty")
        user.create(username, password, (ack) => {
            if (ack.err) reject(ack.err)
            console.log(ack)
            resolve(ack)
        })
    })
}

function shipStateUpdate(player) {
    if (user.is) {
        user.get("position").get("x").put(Math.round(player.position.x));
        user.get("position").get("y").put(Math.round(player.position.y));
        user.get("currentSailModeIndex").put(player.currentSailModeIndex)
        user.get("angle").put(player.angle);
    }
}


game.get("global").map().on((other, id) => {
    console.log(other, id);
    if(!players[id]) players[id]=new Ship(0, 0, true);
    other.get("position").get("x").on((data) => {
        console.log(data)
        players[id].position.x=data
    })
    
})


gun.on("auth", (ack) => {
    console.log("Welcome back", ack);
    user.get("position").get("x").put(Math.round(player.position.x));
    user.get("position").get("y").put(Math.round(player.position.y));
    game.get("global").set(user)
})