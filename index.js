const express=require("express")
require('dotenv').config()
const cors=require("cors")
const fs = require('fs-extra')
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kar2i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const PORT=process.env.PORT||5500 
var ObjectId = require('mongodb').ObjectId
const app=express()
app.use(express.json())
app.use(cors())

app.get("/",(req,res)=>{
    res.send("This is Backend")
})

client.connect(err => {
    const adminsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION1);
    const appointmentsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION2);
    const blogsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION3);
    const servicesCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION4);
    const teamsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION5);
    const testimonialsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_COLLECTION6);
     

    app.post("/addMember",(req,res)=>{
        // console.log(req.body)

        teamsCollection.insertOne(req.body)
        .then(result=>{
            res.send(result.insertedCount>0)
        })
        .catch(err=>console.log(err))
    })

    app.get("/allMember", (req, res) => {
        teamsCollection.find({}).toArray((err,result)=>{
            // console.log(err)
            // console.log(result.length)
            res.send(result)
        })
    })

    app.post("/addBlog",(req,res)=>{
        blogsCollection.insertOne(req.body)
        .then(result=>{
            // console.log(result.insertedCount>0)
            res.send(result.insertedCount>0)

        })
        .catch(err=>console.log(err))
    })

    app.get("/allBlog", (req, res) => {
        blogsCollection.find({}).toArray((err,result)=>{
            res.send(result)
        })
    })

    app.post("/checkIsAdmin",(req,res)=>{
        // console.log(req.body)
        adminsCollection.find({email:req.body.email})
        .toArray((err,result)=>{
            res.send(result.length>0)
                // res.send(result)          
        })
    })


    app.post("/addReview",(req,res)=>{
        testimonialsCollection.insertOne(req.body)
        .then(result=>{
            res.send(result.insertedCount>0)
        })
        .catch(err=>console.log(err))
    })

    app.get("/allReview",(req,res)=>{
        testimonialsCollection.find({}).toArray((err,result)=>{
            // console.log(err)
            res.send(result)
        })
    })

    app.post("/addAdmin", (req, res) => {
        // console.log(req.body)
        adminsCollection.insertOne(req.body)
        .then(result=>{
            res.send(result.insertedCount>0)
        })
        .catch(err=>console.log(err))
    })

    app.post("/addProduct", (req, res) => {
        servicesCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
            .catch(err => console.log(err))
    })


    app.post("/orderPlace", (req, res) => {
        appointmentsCollection.insertOne(req.body)
            .then(result => {
                // console.log(result.insertedCount>0)
                res.send(result.insertedCount > 0)
            })
            .catch(err => console.log(err))
    })

    app.get("/allOrders",(req,res)=>{
        appointmentsCollection.find({}).toArray((err,result)=>{
            res.send(result)
        })
        
    })

    app.post("/ordersByEmail",(req,res)=>{
        // console.log(req.body)
        appointmentsCollection.find({email:req.body.email})
        .toArray((err,result)=>{
            console.log(err)
            res.send(result)

        })       

    })

    app.post("/updateOrder",(req,res)=>{
        // console.log(req.body)
        appointmentsCollection.updateOne(
            { _id: ObjectId(req.body.id) },
            {
                $set: { status: req.body.status },
                $currentDate: { lastModified: true }
            })
            .then((result)=> {
                res.send(result.modifiedCount>0)
            })
    })

    app.get("/allProduct", (req, res) => {
        servicesCollection.find({}).toArray((err,result)=>{
            // console.log(result.length)
            res.send(result)
        })
    })

    app.get("/specificProduct/:id", (req, res) => {
        servicesCollection.find({ _id: ObjectId(req.params.id)}).toArray((err, result) => {
            // console.log(result.length)
            res.send(result[0])
        })
    })      
    console.log("Total Errors",err)
});

app.listen(PORT,()=>console.log("Listening to port 5500..."))








