const express = require('express');

const app = express();

app.use("/",(req,res)=>{
    res.send('hello from the Dashboard');
});

app.use("/test",(req,res)=>{
    res.send('test server');
});
app.use("/hello",(req,res)=>{
    res.send('hello');
});

app.listen(3000, ()=>{
    console.log('Server is successfully running on post 3000.'); 
});

