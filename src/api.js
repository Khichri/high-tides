const gun = Gun( {
    peers: ['herokucoordinator.karmakarmeghdip.repl.co/gun']
} )

const user = gun.user().recall({
    sessionStorage: true
})

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

