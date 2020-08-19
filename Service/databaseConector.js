const mysql = require("mysql");
const { config } = require("process");
const app = require("express")();
const http = require("http");

//KONEKCIJA NA BAZU
const confing = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"admin",
    port:3306,
    database:"todoblog"
});


confing.connect((err)=>{
    if(err) console.log(err);
    console.log("connected");
})
console.log("database called");

//KONEKCIJA NA BAZU




//PRAVLJENJE SERVERA

console.log(databaseConector.confing);
http.createServer((req,res)=>{
    console.log("request made")
}).listen(3000)

//PRAVLJENJE SERVERA