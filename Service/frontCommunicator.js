const mysql = require("mysql");
const { config } = require("process");
const app = require("express")();
const http = require("http").createServer(app);
const socket = require("socket.io")(http);
let confing;
//KONEKCIJA NA BAZU
confing = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "admin",
    port: 3306,
    database: "todoblog"
});
//KONEKCIJA NA BAZU

socket.on("connection", (socket) => {
    console.log("konektovan");
    console.log(socket.id);
    //SLANJE TODO-A NA KONEKCIJU
    socket.on("todoReq", (userName) => {
        confing.query(`SELECT * FROM todo WHERE userName = "${userName}"`, (err, res) => {
            if (err) throw err;
            // console.log("todores")
            if(res.length > 0){
                socket.emit("todoRes", res);
            }
            console.log("connected");
        })
    });
    // //USER SIGN UP
    socket.on("signUp", (data) => {
        confing.query(`SELECT * FROM users WHERE userName = "${data.userName}"`, (err, res) => {
            if (err) throw err;
            // console.log("todores")
            // console.log(res)
            if(res.length > 0){
                socket.emit("signUpInfo", {message:"User with that account already exists!"});
            }
            else{
                // console.log(data);
                let sql = `INSERT INTO users(userName,password) VALUES("${data.userName}","${data.password}")`
                confing.query(sql, (err, result) => {
                    if (err) throw err;
                    console.log("1 record inserted");
                });
                socket.emit("signUpInfo",{redirect:"redir"});
            }
            console.log("connected");
        })
    })
    //SIGN IN 
    socket.on("signIn", (data) => {
        // console.log(data);
        let sql = `SELECT * FROM users WHERE userName = "${data.userName}" AND password = "${data.password}";`
        confing.query(sql, (err, result) => {
            if (err) throw err;
            if(result.length > 0){
                socket.emit("signInInfo",result);
            }
            else{
                socket.emit("signInInfo",{message:"Wrong username or password"})
            }
        });
    })
    //PROVERA ADMINA
    socket.on("signInAsAdmin",user=>{
        confing.query(`SELECT * FROM users WHERE userName = "${user}"`,(err,res)=>{
           if(res[0].admin == null){
               socket.emit("notAdmin");
           }
        })
    })
    // SLANJE BLOGOVA NA KONEKCIJU
    socket.on("blogReq", (userName) => {
        confing.query(`SELECT * FROM blog WHERE userName = "${userName}"`, (err, res) => {
            if (err) throw err;
            // console.log("blogres")
            // console.log(res);
            if(res.length > 0){
                socket.emit("blogRes", res);
            }
        })
    });
    // //DODAVANJE TODO-A U BAZU
    socket.on("addTodo", (data) => {
        // console.log("Dodavanje todo-a")
        // console.log(data);
        let sql = `INSERT INTO todo(userName,title,content) VALUES("${data.name}","${data.title}","${data.todo}")`
        confing.query(sql, (err, result) => {
            if (err) throw err;
            console.log("1 record inserted");
        });
    })
    // //DODAVANJE BLOG-A U BAZU
    socket.on("addblog", (data) => {
        // console.log(data);
        let sql = `INSERT INTO blog(userName,blogTitle,blogContent) VALUES("${data.name}","${data.title}","${data.blog}")`
        confing.query(sql, (err, result) => {
            if (err) throw err;
            console.log("1 record inserted");
        });
    })
    // //BRISANJE TODO-A
    socket.on("removeTodo",(data)=>{
        console.log(data)
        let sql = `DELETE FROM todo WHERE todoId  = "${data.todo}" AND userName = "${data.userName}"`;
        confing.query(sql,(err,res)=>{
            if(err) throw err;
            console.log("removed one row");
        })
    })
    // //BRISANJE BLOG-A
    socket.on("removeBlog",(data)=>{
        let sql = `DELETE FROM blog WHERE blogId ="${data.blog}" AND userName = "${data.userName}"`;
        confing.query(sql,(err,res)=>{
            if(err) throw err;
            console.log("removed one row");
        })
    })
    //GET USERS FOR ADMIN 
    socket.on("getUsers",()=>{
        confing.query(`SELECT userName FROM users`,(err,res)=>{
            socket.emit("userInfo",res)
        })
    })
    socket.on("deleteUser",(user)=>{
        confing.query(`DELETE FROM users WHERE userName = "${user}"`,(err,res)=>{
            socket.emit("userDeleted",{message:"User deleted"})
        })
        confing.query(`DELETE FROM todo WHERE userName = "${user}"`,(err,res)=>{
        })
        confing.query(`DELETE FROM blog WHERE userName = "${user}"`,(err,res)=>{
        })
    })
})
//PRAVLJENJE SERVERA
app.get("/", (req, res) => {
    console.log("request made")
})
http.listen(3000)
//PRAVLJENJE SERVERA