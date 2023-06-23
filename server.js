const express=require("express")
const app=express()

const path=require("path")
const http=require("http")
const {Server}=require("socket.io")
const port = process.env.PORT || 3000;

const server=http.createServer(app)

const io=new Server(server)
app.use(express.static(path.resolve("")))

const connectedClients = new Map();

io.on("connection",(socket)=>{
    console.log("connected to socket .")
    socket.on("join-room",(room)=>{
        socket.join(room);
        connectedClients.set(socket.id, room);    
        // console.log("room : "+room);
        const roomy = connectedClients.get(socket.id);
        io.to(roomy).emit("join-room",room)
    })
    socket.on("coding",(e)=>{
        const room = connectedClients.get(socket.id);
        console.log(e)
        io.to(room).emit("coding",e);
    })
    socket.on("saveRoom",(e)=>{
        console.log(e);
    })
})

app.get("/",(req,res)=>{
    return res.sendFile("index.html")
})

server.listen(port,()=>{
    console.log("port connected to 3000")
})