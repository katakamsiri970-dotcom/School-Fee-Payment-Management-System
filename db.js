
const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "root",
    database: "school_fee_db"
});

db.connect((err) => {
    if (err) {
        console.log("Database Error:", err.message);
    } else {
        console.log("MySQL Connected!");

db.query("SELECT * FROM students", (err, result) => {            if (err) {
                console.log("Test Query Error:", err.message);
            } else {
                console.log("Test Query Success:", result);
            }
        });
    }
});

module.exports = db;
