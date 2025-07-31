SELECT DATABASE();
use schooldb;
 CREATE TABLE Students (
    student_id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    gender VARCHAR(10),
    class_id INT
);CREATE TABLE Classes (
    class_id INT PRIMARY KEY,
    class_name VARCHAR(50),
    teacher_id INT
);CREATE TABLE Teachers (
    teacher_id INT PRIMARY KEY,
    name VARCHAR(50),
    subject VARCHAR(50)
);CREATE TABLE Marks (
    mark_id INT PRIMARY KEY,
    student_id INT,
    subject VARCHAR(50),
    marks INT
);
10:42
INSERT DATA-- Students
INSERT INTO Students (student_id, name, age, gender, class_id) VALUES
(1, 'Ahmed', 17, 'Male', 1),
(2, 'Sara', 18, 'Female', 2),
(3, 'Ali', 19, 'Male', 1),
(4, 'Ayesha', 17, 'Female', 3),
(5, 'Usman', 21, 'Male', 2),
(6, 'Zara', 22, 'Female', 3),
(7, 'Hassan', 20, 'Male', 1);-- Classes
INSERT INTO Classes (class_id, class_name, teacher_id) VALUES
(1, 'Class 10', 101),
(2, 'Class 9', 102),
(3, 'Class 8', 103);-- Teachers
INSERT INTO Teachers (teacher_id, name, subject) VALUES
(101, 'Mr. Khan', 'Math'),
(102, 'Ms. Fatima', 'Science'),
(103, 'Mr. Bilal', 'English');-- Marks
INSERT INTO Marks (mark_id, student_id, subject, marks) VALUES
(1, 1, 'Math', 88),
(2, 2, 'Science', 75),
(3, 3, 'Math', 90),
(4, 4, 'English', 65),
(5, 5, 'Science', 95),
(6, 6, 'English', 85),
(7, 7, 'Math', 72),
(8, 1, 'Science', 70),
(9, 2, 'Math', 67),
(10, 4, 'Math', 78);

SHOW TABLES;
SELECT * FROM Students;
SHOW KEYS FROM Students WHERE Key_name = 'PRIMARY';
DESCRIBE teachers;

SELECT name FROM Students;

SELECT name
FROM Students
WHERE gender = 'Male';

SELECT *
FROM Students
WHERE age > 18;

SELECT *
FROM Students
WHERE class_id = 2;


-- Select all columns from the Students table
SELECT * 
FROM Students
ORDER BY age ASC;

-- Get top 5 students with the highest marks in Math
SELECT s.name AS student_name, m.marks
FROM Students s
JOIN Marks m ON s.student_id = m.student_id
WHERE m.subject = 'Math'
ORDER BY m.marks DESC
LIMIT 5;

-- List student names with their class names
SELECT s.name AS student_name, c.class_name
FROM Students s
JOIN Classes c ON s.class_id = c.class_id;


-- Show student names with their teacher's name
SELECT s.name AS student_name, t.name AS teacher_name
FROM Students s
JOIN Classes c ON s.class_id = c.class_id
JOIN Teachers t ON c.teacher_id = t.teacher_id;

-- Find average marks for each subject
SELECT subject, AVG(marks) AS average_marks
FROM Marks
GROUP BY subject;

-- Count how many students are in each class
SELECT c.class_name, COUNT(s.student_id) AS student_count
FROM Students s
JOIN Classes c ON s.class_id = c.class_id
GROUP BY c.class_name;

-- Count number of students in each class, showing class names
SELECT c.class_name, COUNT(s.student_id) AS student_count
FROM Students s
JOIN Classes c ON s.class_id = c.class_id
GROUP BY c.class_name;

-- Find the highest marks scored in Science
SELECT MAX(marks) AS highest_science_marks
FROM Marks
WHERE subject = 'Science';

-- List student names who scored more than the average marks
SELECT s.name AS student_name, m.subject, m.marks
FROM Marks m
JOIN Students s ON m.student_id = s.student_id
WHERE m.marks > (
    SELECT AVG(marks) FROM Marks
);

-- Find the class name where the oldest student studies
SELECT c.class_name
FROM Students s
JOIN Classes c ON s.class_id = c.class_id
WHERE s.age = (
    SELECT MAX(age) FROM Students
);

-- Insert a new student named Ali into class 3
INSERT INTO Students (student_id, name, age, gender, class_id)
VALUES (9, 'Ali', 17, 'Male', 3);
SELECT * FROM Students
WHERE class_id = 3;



-- Update subject of teacher with ID 101 to "Computer Science"
UPDATE Teachers
SET subject = 'Computer Science'
WHERE teacher_id = 101;

-- Check if teacher_id = 1 exists
SELECT * FROM Teachers WHERE teacher_id = 101;


-- Delete all students older than 25
DELETE FROM Students
WHERE student_id IN (
  SELECT student_id FROM (
    SELECT student_id FROM Students WHERE age > 25
  ) AS temp
);

-- Students who have NOT received marks in English
SELECT s.name
FROM Students s
WHERE NOT EXISTS (
    SELECT 1
    FROM Marks m
    WHERE m.student_id = s.student_id
      AND m.subject = 'English'
);

-- Class-wise total male and female students
SELECT 
  c.class_name,
  COUNT(CASE WHEN s.gender = 'Male' THEN 1 END) AS male_students,
  COUNT(CASE WHEN s.gender = 'Female' THEN 1 END) AS female_students
FROM Students s
JOIN Classes c ON s.class_id = c.class_id
GROUP BY c.class_name;

-- List of students with total marks across all subjects, highest to lowest
SELECT s.name AS student_name, SUM(m.marks) AS total_marks
FROM Students s
JOIN Marks m ON s.student_id = m.student_id
GROUP BY s.student_id, s.name
ORDER BY total_marks DESC;

-- Create a temporary table to store total marks per student
CREATE TEMPORARY TABLE Temp_TotalMarks AS
SELECT s.student_id, s.name AS student_name, SUM(m.marks) AS total_marks
FROM Students s
JOIN Marks m ON s.student_id = m.student_id
GROUP BY s.student_id, s.name
ORDER BY total_marks DESC;
SELECT * FROM Temp_TotalMarks;

