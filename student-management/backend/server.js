import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req,res) => {
    res.send("Student Management API is running");
});

app.get("/api/students", async(req,res) => {
    try{
        const[students] = await db.query(
            "SELECT * FROM students ORDER BY id DESC"
        );
        res.json(students);
    } catch(error){
        console.error(error);
        res.status(500).json({message: "Failed to fetch students"});
    }
});


app.post("/api/students", async(req,res) => {
    try{
        const{name, course, department, year, email, phone} = req.body;
        if(
            !name?.trim()||
            !course ||
            !department ||
            !year ||
            !email?.trim() ||
            !phone?.trim()
        ){
            return res.status(400).json({
                message: "Please enter all student details",
            });
        }
         
        const [result] = await db.execute(
            `INSERT INTO  students
            (name, course, department, year, email, phone)
            VALUES (?,?,?,?,?,?)`,
            [
                name.trim(),
                course,
                department,
                year,
                email.trim(),
                phone.trim(),
            ]
        ); 
        const [rows] = await db.execute(
            "SELECT * FROM students WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json(rows[0]);
    }catch(error){
        console.error("Add student error:", error);

    res.status(500).json({
        message: "Failed to add student",
        error: error.message,
    });
    }
});

app.put("/api/students/:id", async(req,res) => {
    try{
        const {name, course, department, year, email, phone} = req.body;
        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id<1){
            return res.status(400).json({message: "Invalid student ID"});
        }

        if(
            !name?.trim()||
            !course ||
            !department ||
            !year ||
            !email?.trim() ||
            !phone?.trim()
        ){
            return res.status(400).json({
                message: "Please enter all student details",
            });
        }

        const [result] = await db.execute(
            `UPDATE students
            SET name = ?, course = ?, department = ?,
            year = ?, email = ?, phone = ?
            WHERE id = ?`,
            [
                name.trim(),
                course,
                department,
                year,
                email.trim(),
                phone.trim(),
                id,
            ]
        );
        if (result.affectedRows === 0){
            return res.status(404).json({message: "Student not found"});
        }

        const [rows] = await db.execute(
            "SELECT * FROM students WHERE id = ?",
            [id]
        );
        res.json(rows[0]);

    } catch(error){
        console.error("Update student error:", error);
        res.status(500).json({
            message: "Failed to update student",
            error: error.message,
        });
    }
});

app.delete("/api/students/:id", async(req,res) => {
    try{
        const id = Number(req.params.id);

        if(!Number.isInteger(id) || id < 1){
            return res.status(400).json({message:"Invalid student Id"});
        }

        const [result]= await db.execute(
            "DELETE FROM students WHERE id=?", 
            [id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({message: " Student not found"});
        }

        res.json({message: "Student deleted successfully"});
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Failed to delete student"})

    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});