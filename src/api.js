const gun = Gun({
    peers: ['https://HerokuCoordinator.karmakarmeghdip.repl.co/gun']
})
const user = gun.user();

let peerIds = {}
let peerConnections = {}

const game = gun.get("high-tides-test-7")

let peer;

async function api() {
    
    if (localStorage.getItem("username") && localStorage.getItem("password")) 
    {
        console.log("Logging in with saved credentials");
        await login(localStorage.getItem("username"), localStorage.getItem("password"));
    }
    else
    {
        console.log("Creating new account");
        await createAcc(makeid(15), makeid(15));
    }
    
    peer = new Peer(undefined, {
        host: "ice-server.karmakarmeghdip.repl.co",
        port: 443,
        secure: true,
        path: "/peerjs/hightides",
    });
    
    peer.on('open', function(id) {
        console.log("peerjs connection opened [peerId: " + id + "]");
        window.peerId = id;
        user.get("peerId").put(id)
        game.get("global").set(user)
        // console.log("peerId node"+user.get("peerId")["#"])

        game.get("global").map().on((us)=> {
            if(!us) return;
            const alias = us.alias;
            peerIds[alias] = us.peerId;
            updatePeers();
        }) 
    });
    
    // on close
    peer.on('close', function() {
        console.log("peerjs connection closed");
        game.get("global").unset(user);
    });

    peer.on('connection', function(conn) {
        console.log("Connection received from : " + conn.peer);
        prepareConnection(conn, conn.peer);
    });
    

    window.addEventListener("beforeunload", function (e) {      
        peer.destroy();
        (e || window.event).returnValue = null;
        return null;
    });
}

function propagateMessageToAllActivePeers(message) {
    for (const alias in peerConnections) {
        peerConnections[alias].connection.send(message);
    }
}

function propagateShipStateUpdate(ship) {
    propagateMessageToAllActivePeers({
        type: "shipStateUpdate",
        payload: {
            alias: localStorage.getItem("username"),
            position: {
                x: ship.position.x,
                y: ship.position.y
            },
            angle: ship.angle,
            targetAngle: ship.targetAngle,
            velocity: {
                x: ship.velocity.x,
                y: ship.velocity.y                
            },
            turnAngle: ship.turnAngle,
            currentSailModeIndex: ship.currentSailModeIndex
        }
    });
}

function prepareConnection(conn, peerId)
{
    conn.on('open', function() {
        if(peerConnections[peerId]) 
        {
            return;
        }
        
        console.log("Connection opened with : " + peerId);
        peerConnections[peerId] = {
            connection : conn,
            ship : new Ship(0, 0)
        };
        
        conn.on('data', function(data) {
            // awconsole.log('Received', data);
            if (data["type"] && data["type"] == "shipStateUpdate") {
                peerConnections[peerId].ship.updateShipState(data["payload"]);
            }
        });
        
        conn.on('close', function() {
            console.log("Connection closed with : " + peerId);
            delete peerConnections[peerId];
        });

    });
    
}

function updatePeers() 
{
    for (const alias in peerIds) 
    {
        if (alias && !peerConnections[peerIds[alias]] && alias != user.is.alias) 
        {
            const conn = peer.connect(peerIds[alias]);
            prepareConnection(conn, peerIds[alias]);
        }
    }
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

api();
