
const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
// SERVER TEST
app.get("/test", (req, res) => {
    console.log("Test API Requested");
    res.send("Express Server Working!");
});

// HOME PAGE
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// STUDENTS - GET ALL
app.get("/api/students", (req, res) => {
    console.log("Students API Requested");

    db.query("SELECT * FROM students", (err, result) => {
        console.log("Database Query Completed");

        if (err) {
            console.log("Query Error:", err.message);
            return res.status(500).json({ message: err.message });
        }

        console.log("Students Count:", result.length);
        res.json(result);
    });
});

// ADD STUDENT
app.post("/api/students", (req, res) => {
    const { name, studentClass, roll_no, phone, email } = req.body;

    const sql = `
        INSERT INTO students
        (name, class, roll_no, phone, email)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [name, studentClass, roll_no, phone, email], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Student added successfully!" });
    });
});

// UPDATE STUDENT
app.put("/api/students/:id", (req, res) => {
    const { name, studentClass, roll_no, phone, email } = req.body;

    const sql = `
        UPDATE students
        SET name=?, class=?, roll_no=?, phone=?, email=?
        WHERE student_id=?
    `;

    db.query(sql, [name, studentClass, roll_no, phone, email, req.params.id], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Student updated successfully!" });
    });
});

// DELETE STUDENT
app.delete("/api/students/:id", (req, res) => {
    db.query(
        "DELETE FROM students WHERE student_id=?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).json({ message: err.message });
            res.json({ message: "Student deleted successfully!" });
        }
    );
});

// FEE DETAILS - GET ALL
app.get("/api/fees", (req, res) => {
    const sql = `
        SELECT f.*, s.name, s.roll_no, s.class
        FROM fee_details f
        JOIN students s ON f.student_id = s.student_id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result);
    });
});

// ADD FEE
app.post("/api/fees", (req, res) => {
    const { student_id, academic_year, fee_type, total_amount, due_date } = req.body;

    const sql = `
        INSERT INTO fee_details
        (student_id, academic_year, fee_type, total_amount, due_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [student_id, academic_year, fee_type, total_amount, due_date], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Fee assigned successfully!" });
    });
});

// PAYMENTS - GET ALL
app.get("/api/payments", (req, res) => {
    const sql = `
        SELECT p.*, s.name, f.fee_type
        FROM payments p
        JOIN fee_details f ON p.fee_id = f.fee_id
        JOIN students s ON f.student_id = s.student_id
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result);
    });
});

// ADD PAYMENT
app.post("/api/payments", (req, res) => {
    const { fee_id, amount_paid, payment_date, payment_method, receipt_no } = req.body;

    const sql = `
        INSERT INTO payments
        (fee_id, amount_paid, payment_date, payment_method, receipt_no)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [fee_id, amount_paid, payment_date, payment_method, receipt_no], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json({ message: "Payment recorded successfully!" });
    });
});

// DASHBOARD AND REPORTS
app.get("/api/dashboard", (req, res) => {
    const sql = `
        SELECT
            (SELECT COUNT(*) FROM students) AS totalStudents,
            (SELECT IFNULL(SUM(total_amount), 0) FROM fee_details) AS totalFees,
            (SELECT COUNT(*) FROM payments) AS totalPayments,
            (SELECT IFNULL(SUM(amount_paid), 0) FROM payments) AS totalCollection,
            (
                (SELECT IFNULL(SUM(total_amount), 0) FROM fee_details)
                -
                (SELECT IFNULL(SUM(amount_paid), 0) FROM payments)
            ) AS pendingFees
    `;

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json({ message: err.message });
        res.json(result[0]);
    });
});

// SERVER
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
