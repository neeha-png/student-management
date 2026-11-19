document.addEventListener("DOMContentLoaded", () => {

    // Student Details
    const students = [
        { roll: "CS101", name: "Asha Reddy" },
        { roll: "CS102", name: "Ravi Kumar" },
        { roll: "EC201", name: "Sneha Rao" },
        { roll: "ME301", name: "Arjun Singh" }
    ];

    const dateInput = document.getElementById("attendanceDate");
    const table = document.getElementById("attendanceTable");

    const STORAGE_KEY = "studentAttendance";

    // Check required HTML elements
    if (!dateInput || !table) {
        console.error("Attendance HTML elements are missing.");
        return;
    }

    // Today's Date
    const today = new Date();
    const todayString = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.value = todayString;

    // Read LocalStorage safely
    function getAttendance() {
        try {
            return JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "{}"
            );
        } catch (error) {
            console.error("Unable to read attendance:", error);
            return {};
        }
    }

    // Display Students
    function displayStudents() {

        table.innerHTML = "null";

        const selectedDate = dateInput.value;
        const allAttendance = getAttendance();
        const savedRecords = allAttendance[selectedDate] || {};

        students.forEach((student, index) => {

            const status = savedRecords[student.roll] || "Present";

            const row = document.createElement("tr");

            // Serial Number
            const serialCell = document.createElement("td");
            serialCell.textContent = index + 1;

            // Roll Number
            const rollCell = document.createElement("td");
            rollCell.textContent = student.roll;

            // Student Name
            const nameCell = document.createElement("td");
            nameCell.textContent = student.name;

            // Attendance Status
            const statusCell = document.createElement("td");

            ["Present", "Absent"].forEach(value => {

                const label = document.createElement("label");
                label.className = "status-option";

                const radio = document.createElement("input");

                radio.type = "radio";
                radio.name = "attendance_" + student.roll;
                radio.value = value;
                radio.checked = status === value;

                radio.addEventListener("change", updateSummary);

                label.appendChild(radio);
                label.appendChild(
                    document.createTextNode(" " + value)
                );

                statusCell.appendChild(label);
            });

            // Overall Attendance
            const overallCell = document.createElement("td");

            let presentDays = 0;
            let totalDays = 0;

            Object.values(allAttendance).forEach(day => {

                if (day && day[student.roll]) {

                    totalDays++;

                    if (day[student.roll] === "Present") {
                        presentDays++;
                    }
                }
            });

            overallCell.textContent = totalDays
                ? Math.round((presentDays / totalDays) * 100) + "%"
                : "-";

            row.append(
                serialCell,
                rollCell,
                nameCell,
                statusCell,
                overallCell
            );

            table.appendChild(row);
        });

        updateSummary();
        updateDateMessage();
    }

    // Update Attendance Count
    function updateSummary() {

        let present = 0;
        let absent = 0;

        students.forEach(student => {

            const selected = document.querySelector(
                `input[name="attendance_${student.roll}"]:checked`
            );

            if (selected?.value === "Present") {
                present++;
            } else if (selected?.value === "Absent") {
                absent++;
            }
        });

        document.getElementById("presentCount").textContent = present;
        document.getElementById("absentCount").textContent = absent;
    }

    // Update Date Message
    function updateDateMessage() {

        const allAttendance = getAttendance();
        const message = document.getElementById("dateMessage");

        if (!message) return;

        if (allAttendance[dateInput.value]) {

            message.textContent =
                "Attendance for " + dateInput.value + " is already saved.";

        } else {

            message.textContent =
                "Attendance for " + dateInput.value +
                " is not saved yet. Everyone is set to Present until you save.";
        }
    }

    // Mark All Present
    document.getElementById("markPresent")
        .addEventListener("click", () => {

            students.forEach(student => {

                const radio = document.querySelector(
                    `input[name="attendance_${student.roll}"][value="Present"]`
                );

                if (radio) radio.checked = true;
            });

            updateSummary();
        });

    // Mark All Absent
    document.getElementById("markAbsent")
        .addEventListener("click", () => {

            students.forEach(student => {

                const radio = document.querySelector(
                    `input[name="attendance_${student.roll}"][value="Absent"]`
                );

                if (radio) radio.checked = true;
            });

            updateSummary();
        });

    // Save Attendance
    document.getElementById("saveAttendance")
        .addEventListener("click", () => {

            const selectedDate = dateInput.value;

            if (!selectedDate) {
                alert("Please select a date.");
                return;
            }

            const attendanceRecords = {};

            for (const student of students) {

                const selected = document.querySelector(
                    `input[name="attendance_${student.roll}"]:checked`
                );

                if (!selected) {
                    alert("Please mark attendance for every student.");
                    return;
                }

                attendanceRecords[student.roll] = selected.value;
            }

            const allAttendance = getAttendance();

            allAttendance[selectedDate] = attendanceRecords;

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    JSON.stringify(allAttendance)
                );

                const successMessage =
                    document.getElementById("successMessage");

                if (successMessage) {
                    successMessage.textContent =
                        "Attendance saved successfully!";
                }

                displayStudents();

            } catch (error) {

                console.error("Saving failed:", error);
                alert("Unable to save attendance. Please try again.");

            }
        });

    // Change Date
    dateInput.addEventListener("change", () => {

        const successMessage =
            document.getElementById("successMessage");

        if (successMessage) {
            successMessage.textContent = "";
        }

        displayStudents();
    });

    // Initial Display
    displayStudents();

});