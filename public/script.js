
// =====================================
// SCHOOL FEE PAYMENT MANAGEMENT SYSTEM
// =====================================


// LOAD DASHBOARD
async function loadDashboard() {
    try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        document.getElementById("totalStudents").textContent =
            data.totalStudents || 0;

        document.getElementById("totalFees").textContent =
            "₹" + (data.totalFees || 0);

        document.getElementById("totalPayments").textContent =
            data.totalPayments || 0;

        document.getElementById("totalCollection").textContent =
            "₹" + (data.totalCollection || 0);

    } catch (error) {
        console.log("Dashboard Error:", error);
    }
}


// =====================================
// STUDENTS
// =====================================

async function loadStudents() {
    const table = document.getElementById("studentsTable");
    if (!table) return;

    try {
        const response = await fetch("/api/students");
        const students = await response.json();

        table.innerHTML = "";

        if (students.length === 0) {
            table.innerHTML =
                '<tr><td colspan="6">No students found</td></tr>';
            return;
        }

        students.forEach(student => {
            table.innerHTML += `
                <tr>
                    <td>${student.student_id}</td>
                    <td>${student.name}</td>
                    <td>${student.class}</td>
                    <td>${student.roll_no}</td>
                    <td>${student.phone}</td>
                    <td>${student.email}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Students Error:", error);
    }
}


const studentForm = document.getElementById("studentForm");

if (studentForm) {
    studentForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const student = {
            name: document.getElementById("name").value,
            studentClass: document.getElementById("studentClass").value,
            roll_no: document.getElementById("roll_no").value,
            phone: document.getElementById("phone").value,
            email: document.getElementById("email").value
        };

        try {
            const response = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(student)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Unable to add student");
                return;
            }

            alert("Student Added Successfully!");
            studentForm.reset();
            loadStudents();

        } catch (error) {
            alert("Error adding student");
            console.log(error);
        }
    });
}


// =====================================
// FEE DETAILS
// =====================================

async function loadFees() {
    const table = document.getElementById("feesTable");
    if (!table) return;

    try {
        const response = await fetch("/api/fees");
        const fees = await response.json();

        table.innerHTML = "";

        if (fees.length === 0) {
            table.innerHTML =
                '<tr><td colspan="6">No fee records found</td></tr>';
            return;
        }

        fees.forEach(fee => {
            table.innerHTML += `
                <tr>
                    <td>${fee.fee_id}</td>
                    <td>${fee.student_id}</td>
                    <td>${fee.academic_year}</td>
                    <td>${fee.fee_type}</td>
                    <td>₹${fee.total_amount}</td>
                    <td>${fee.due_date ? String(fee.due_date).slice(0, 10) : ""}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Fees Error:", error);
    }
}


const feeForm = document.getElementById("feeForm");

if (feeForm) {
    feeForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const fee = {
            student_id: document.getElementById("student_id").value,
            academic_year: document.getElementById("academic_year").value,
            fee_type: document.getElementById("fee_type").value,
            total_amount: document.getElementById("total_amount").value,
            due_date: document.getElementById("due_date").value
        };

        try {
            const response = await fetch("/api/fees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fee)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Unable to add fee");
                return;
            }

            alert("Fee Details Added Successfully!");
            feeForm.reset();
            loadFees();

        } catch (error) {
            alert("Error adding fee");
            console.log(error);
        }
    });
}


// =====================================
// PAYMENTS
// =====================================

async function loadPayments() {
    const table = document.getElementById("paymentsTable");
    if (!table) return;

    try {
        const response = await fetch("/api/payments");
        const payments = await response.json();

        table.innerHTML = "";

        if (payments.length === 0) {
            table.innerHTML =
                '<tr><td colspan="6">No payments found</td></tr>';
            return;
        }

        payments.forEach(payment => {
            table.innerHTML += `
                <tr>
                    <td>${payment.payment_id}</td>
                    <td>${payment.fee_id}</td>
                    <td>₹${payment.amount_paid}</td>
                    <td>${payment.payment_date ? String(payment.payment_date).slice(0, 10) : ""}</td>
                    <td>${payment.payment_method}</td>
                    <td>${payment.receipt_no}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.log("Payments Error:", error);
    }
}


const paymentForm = document.getElementById("paymentForm");

if (paymentForm) {
    paymentForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const payment = {
            fee_id: document.getElementById("fee_id").value,
            amount_paid: document.getElementById("amount_paid").value,
            payment_date: document.getElementById("payment_date").value,
            payment_method: document.getElementById("payment_method").value,
            receipt_no: document.getElementById("receipt_no").value
        };

        try {
            const response = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payment)
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Unable to record payment");
                return;
            }

            alert("Payment Recorded Successfully!");
            paymentForm.reset();
            loadPayments();

        } catch (error) {
            alert("Error recording payment");
            console.log(error);
        }
    });
}


// =====================================
// REPORTS
// =====================================

async function loadReports() {
    try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();

        const students = data.totalStudents || 0;
        const fees = Number(data.totalFees || 0);
        const collection = Number(data.totalCollection || 0);
        const pending = fees - collection;

        const values = {
            reportStudents: students,
            reportFees: "₹" + fees,
            reportCollection: "₹" + collection,
            reportPending: "₹" + pending,
            summaryStudents: students,
            summaryFees: "₹" + fees,
            summaryCollection: "₹" + collection,
            summaryPending: "₹" + pending
        };

        Object.keys(values).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = values[id];
            }
        });

    } catch (error) {
        console.log("Reports Error:", error);
    }
}


// =====================================
// PAGE LOAD
// =====================================

document.addEventListener("DOMContentLoaded", function() {
    loadDashboard();
    loadStudents();
    loadFees();
    loadPayments();
    loadReports();
});
