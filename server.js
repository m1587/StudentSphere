const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ====================== STUDENTS ======================

const STUDENTS_PATH = './students.json';

function readStudents() {
  try {
    const data = fs.readFileSync(STUDENTS_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeStudents(students) {
  fs.writeFileSync(STUDENTS_PATH, JSON.stringify(students, null, 2));
}

app.get('/students', (req, res) => {
  res.json(readStudents());
});

app.get('/students/:id', (req, res) => {
  const students = readStudents();
  const student = students.find(s => s.id == req.params.id);
  student ? res.json(student) : res.status(404).json({ error: "Student not found" });
});

app.post('/students', (req, res) => {
  const students = readStudents();
  const newStudent = { ...req.body, id: students.length ? students[students.length - 1].id + 1 : 1 };
  students.push(newStudent);
  writeStudents(students);
  res.status(201).json(newStudent);
});

// ====================== COURSES ======================

const COURSES_PATH = './courses.json';

function readCourses() {
  try {
    const data = fs.readFileSync(COURSES_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeCourses(courses) {
  fs.writeFileSync(COURSES_PATH, JSON.stringify(courses, null, 2));
}

app.get('/courses', (req, res) => {
  res.json(readCourses());
});

app.get('/courses/:id', (req, res) => {
  const courses = readCourses();
  const course = courses.find(c => c.id == req.params.id);
  course ? res.json(course) : res.status(404).json({ error: "Course not found" });
});

app.post('/courses', (req, res) => {
  const { title, teacher, description, duration } = req.body;

  // 1. בדיקה שאין נתונים חסרים
  if (!title || !teacher || !description || !duration) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["title", "teacher", "description", "duration"]
    });
  }

  const courses = readCourses();
  const newCourse = {
    id: courses.length ? courses[courses.length - 1].id + 1 : 1,
    title,
    teacher,
    description,
    duration
  };

  courses.push(newCourse);
  writeCourses(courses);

  res.status(201).json(newCourse);
});


// ====================== SERVER ======================

const PORT = 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
