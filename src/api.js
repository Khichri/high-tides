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
    if (!players[other.alias]) players[other.alias] = new Ship(0, 0, true);
    const oth = gun.get(`~@${other.alias}`)
    oth.get("position").get("x").on((data) => {
        console.log(data)
        players[id].position.x = data
    })
    oth.get("position").get("y").on((data) => {
        console.log(data)
        players[id].position.y = data
    })
    oth.get("currentSailModeIndex").on((data) => {
        console.log(data)
        players[id].currentSailModeIndex = data
    })
    oth.get("angle").on((data) => {
        console.log(data)
        players[id].angle = data
    })


})


function playerInit(player) {
    if (user.is) {
        user.get("position").get("x").put(Math.round(player.position.x));
        user.get("position").get("y").put(Math.round(player.position.y));
        game.get("global").set(user)
    } else {
        gun.on("auth", (ack) => {
            console.log("Welcome back", ack);
            user.get("position").get("x").put(Math.round(player.position.x));
            user.get("position").get("y").put(Math.round(player.position.y));
            game.get("global").set(user)
        })
    }

}