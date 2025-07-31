# School Database Task

## Overview
This folder contains a school database management task implemented in SQL and documented in PDF format. The `school_db_task.sql` file includes the complete database schema, sample data, and solutions to 20 assigned queries. The `school_db_task_doc.pdf` provides the original task details, including schema, data, and query requirements extracted via OCR.

## Purpose
This Week 4 assignment focuses on SQL database design and querying, managing student, class, teacher, and marks data to demonstrate skills in table creation, data manipulation, and complex queries.

## Contents
- **school_db_task.sql**:
  - `CREATE TABLE` statements for `Students`, `Classes`, `Teachers`, and `Marks`.
  - `INSERT` data for 7 students, 3 classes, 3 teachers, and 10 marks.
  - 20 queries, including selects, joins, aggregations, updates, deletions, and a temporary table (`Temp_TotalMarks`).
- **school_db_task_doc.pdf**:
  - Pages 1-2: Schema and sample data.
  - Pages 3-9: List of 20 queries with partial solutions.
  - Page 10: Temporary table reference.
  - Timestamps: 10:42 and 12:25:59 indicate work progression.

## Technical Details
- **Format**: `.sql` for execution, `.pdf` for documentation.
- **Database**: Uses `schooldb` context.
- **Time of Creation**: Prepared on July 31, 2025, at 11:56 AM PKT.

## Usage
1. Run `school_db_task.sql` in a MySQL environment to set up the database and execute queries.
2. Refer to `school_db_task_doc.pdf` for the original task and partial solutions.
3. Verify results (e.g., `SELECT * FROM Temp_TotalMarks` for Query 20).

## Known Issues
- OCR errors in PDF (e.g., `student_id` as strings) corrected in `.sql`.
- Partial solutions in PDF; full solutions in `.sql`.

## Future Enhancements
- Add foreign key constraints.
- Include query result sets.
- Expand with additional data or tables.

## Notes
Part of Week 4 curriculum, showcasing SQL proficiency.
