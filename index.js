const express = require("express");
const app = express();
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = process.env.DB;
const DB = "student_teacher";
app.listen(process.env.PORT || 3002);

//middleware
app.use(express.json());

app.get("/", function(req,res){
    res.json({message:"Welcome To Mentor & Student Admin Website"});
})

//Api to Create Mentor
app.post("/Mentor", async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        await db.collection("mentors").insertOne(req.body);
        await connection.close();
        res.json({message:"Insert Mentor Details"})
    } catch (error) {
        res.status(500).json({message:"Something Went Wrong"});
    }
})

// Api to Create Student
app.post("/Student", async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        await db.collection("students").insertOne(req.body);
        await connection.close();
        res.json({message:"Insert Student Details"})
    } catch (error) {
        res.status(500).json({message:"Something Went Wrong"});
    }
})

//Select one mentor and Add multiple Student 
app.post("/mentorwithstudents", async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const student = await db.collection("students").findById(req.params.student_id);
        student.mentors = req.params.mentor_id;
        const updatestudent = await student.save()
        await connection.close();
        res.status(200).json({message:"Assigned the student to the mentor"})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Something Went Wrong"});
    }
})

//A student who has a mentor should not be shown in List
app.put('/Changementor', async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const student = await db.collection("students").findById(req.params.student_id);
        const updatedstudent = await student.findByIdAndUpdate(
            student, {mentor : req.params.mentor_id} , {new : true}
        )
        await connection.close();
        res.status(200).json(updatedstudent)
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Something Went Wrong"});
    }
})

//Get students for a mentor
app.get('/StudentsDetails', async function(req,res){
    try{
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const student = await db.collection("students").find({ mentors : req.params.student_id});
        await connection.close();
        res.status(200).json(student);
    }catch (error) {
        res.status(500).json({message : "Something Went Wrong"});
    }
})

//Get mentor by id
app.get('/MentorDetails', async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const mentor = await db.collection("mentors").findOne({_id : req.params.mentor_id});
        await connection.close();
        res.status(200).json(mentor);
    } catch (error) {
        res.status(500).json({message : "Something Went Wrong"})
    }
})

//Get student by id
app.get('/studentid', async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);
        const db = connection.db(DB);
        const student = await db.collection("students").findOne({_id : req.params.student_id});
        await connection.close();
        res.json(200).json(student);
    } catch (error) {
        res.status(500).json({message : "Something Went Wrong"})
    }
})