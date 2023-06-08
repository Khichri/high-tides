const gun = Gun( {
    peers: ['herokucoordinator.karmakarmeghdip.repl.co/gun']
} )

const user = gun.user().recall({
    sessionStorage: true
})

const game = gun.get("high-tides")

async function login(username, password) {
    return new Promise((resolve, reject) => {
        if(!username) reject("Username can't be empty")
        if(!password) reject("Password can't be empty")
        user.auth(username, password, (ack)=> {
            if(ack.err) reject(ack.err)
            console.log(ack)
            resolve(ack)
        })
    })
}

async function createAcc(username, password) {
    return new Promise((resolve, reject) => {
        if(!username) reject("Username can't be empty")
        if(!password) reject("Password can't be empty")
        user.create(username, password, (ack) => {
            if(ack.err) reject(ack.err)
            console.log(ack)
            resolve(ack)
        })
    })
}

async function shipStateUpdate(player) {
    return new Promise((resolve, reject) => {
        if(!user.is) reject("User not logged in")
        user.get("position").get("x").put(player.position.x)
        user.get("position").get("y").put(player.position.y)
        user.get("velocity").get("x").put(player.velocity.x)
        user.get("velocity").get("y").put(player.velocity.y)
    })
}