const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    roll_no : Number , 
    name: String,
    class: String, 
    dateOfBirth: Date,
    schoolName: String, 
    adress: String,
    
});

const Stundent = mongoose.model("Student", studentSchema);

module.exports = Student;