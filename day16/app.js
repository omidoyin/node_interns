const express = require('express')
const app =express()
const router = express.Router()
const pagesRoutes = require("./router")
const path =require("path")

module.exports=router

app.use(express.static((path.join(__dirname,"node_modules/fabric"))))
app.use('/', pagesRoutes)

const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log('server is running at http://localhost:'+port);
})
