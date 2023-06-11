class PeerHandler
{
    constructor(maxConnections, user_, game_)
    {
        this.user = user_;
        this.game = game_;
        
        this.peer = new Peer(undefined, {
            host: "ice-server.karmakarmeghdip.repl.co",
            port: 443,
            secure: true,
            path: "/peerjs/hightides"
        });
        
        this.peer.on('open',  this.onPeerOpen);
        this.peer.on('close',  this.onPeerClose);
        this.peer.on('connection', this.onPeerConnection);
        window.addEventListener("beforeunload", this.onWindowUnload);
        
        this.acceptedConnections = [];
        this.sendConnections = [];
        this.tempSentConnections = {};
        this.isAcceptingConnections = true;
        this.maxConnections = maxConnections;
        this.peerId = undefined;
        this.messageHashReceived = {};
        window.peerHandler = this;
    }
    
    onPeerOpen(id)
    {
        console.log("peerjs connection opened [peerId: " + id + "]");
        window.peerHandler.peerId = id;
        window.peerHandler.user.get("peerId").put(id);
        window.peerHandler.game.get("not_accepting").unset(window.peerHandler.user);
        window.peerHandler.game.get("accepting").set(window.peerHandler.user);
    }
    
    onPeerClose()
    {
        console.log("peerjs connection closed");
        window.peerHandler.game.get("accepting").unset(window.peerHandler.user);
        window.peerHandler.game.get("not_accepting").set(window.peerHandler.user)
    }
    
    onPeerConnection(conn)
    {
        console.log("Connection received from : " + conn.peer);
        if (!window.peerHandler.isAcceptingConnections)
        {
            conn.send({status: 401, "message": "Not accepting connections"});
            console.log("connection rejected from : " + conn.peer);
            return;
        } 
        conn.on('open', () => window.peerHandler.onPeerConnectionOpen(conn, true));
    }
    
    onPeerConnectionClose(conn, isAccepted)
    {
        console.log("connection closed from : " + conn.peer);
        if (isAccepted)
        {
            window.peerHandler.acceptedConnections = window.peerHandler.acceptedConnections.filter((c) => c.peer != conn.peer);
            if(window.peerHandler.acceptedConnections.length == window.peerHandler.maxConnections - 1)
            {
                window.peerHandler.isAcceptingConnections = true; 
                window.peerHandler.game.get("not_accepting").unset(window.peerHandler.user);
                window.peerHandler.game.get("accepting").set(window.peerHandler.user);
                // window.peerHandler.peer.reconnect();
            }
        }
        else
        {
            console.log("reattempting conenctions again");
            window.peerHandler.sendConnectionToPeers();
        }

        this.onPeerMessage(`${getByValue(window.peerIds, conn.peer)} disconnected from ${getByValue(window.peerIds, this.peerId)}`)
    }

    onPeerMessage(source, data)
    {
        const msgHash = cyrb53(JSON.stringify(data));
        if (this.messageHashReceived[msgHash]) return;
        this.messageHashReceived[msgHash] = true;
        
        msgGossipped(data);
        window.addToLog(data);
        // propagate the message to the other peers
        for (let conn of this.acceptedConnections) 
        {
            if (conn.peer == source) continue;
            conn.send(data);
        }
        for (let conn of this.sendConnections)
        {
            if (conn.peer == source) continue;
            conn.send(data);
        }
    }
    
    onPeerConnectionOpen(conn, isAccepted)
    {
        if(this.tempSentConnections[conn.peer]) delete this.tempSentConnections[conn.peer];
        if(isAccepted)
        {
            if (this.acceptedConnections.length >= this.maxConnections || this.isConnectedToPeer(conn.peer)) return;
            this.acceptedConnections.push(conn);
            console.log("connection accepted & established from : " + conn.peer);
            conn.on('close', () => {window.peerHandler.onPeerConnectionClose(conn, true)});
            conn.on('data', (data) => {window.peerHandler.onPeerMessage(conn.peer, data)});
            
            this.onPeerConnection(`${getByValue(window.peerIds, conn.peer)} connected to ${getByValue(window.peerIds, this.peerId)}`);
            
            if (this.acceptedConnections.length >= this.maxConnections) 
            {
                window.peerHandler.game.get("accepting").unset(window.peerHandler.user);
                window.peerHandler.game.get("not_accepting").set(window.peerHandler.user)
                // this.peer.disconnect();
                this.isAcceptingConnections = false;
            }
        }
        else
        {
            if (this.sendConnections.length >= this.maxConnections  || this.isConnectedToPeer(conn.peer)) return;
            console.log("connection established to : " + conn.peer);
            this.sendConnections.push(conn);
            
            this.onPeerConnection(`${getByValue(window.peerIds, this.peerId)} connected to ${getByValue(window.peerIds, conn.peer)}`);
            
            conn.on('close', () => {window.peerHandler.onPeerConnectionClose(conn, false)});
            conn.on('data', (data) => {window.peerHandler.onPeerMessage(conn.peer, data)});
        }
    }
    
    onWindowUnload(e)
    {
        window.peerHandler.peer.destroy();
        (e || window.event).returnValue = null;
        return null;
    }
    
    isConnectedToPeer(peerId)
    {
        return this.acceptedConnections.some((conn) => conn.peer == peerId) 
        || this.sendConnections.some((conn) => conn.peer == peerId);
    }    
    
    sendConnectionToPeers()
    {
        if (this.sendConnections.length >= this.maxConnections) return;
        console.log("sending connections to peers")
        
        for (const alias in window.peerIds) 
        {
            if (this.sendConnections.length >= this.maxConnections) return;
            if (this.isConnectedToPeer(alias) && tempSentConnections[window.peerIds[alias]] == undefined) continue;
            
            const conn = this.peer.connect(window.peerIds[alias]);
            conn.on('open', () => { window.peerHandler.onPeerConnectionOpen(conn, false) });
            this.tempSentConnections[window.peerIds[alias]] = conn;
        }
    }
}