
const STORAGE_KEY = "students";

const form = document.getElementById("editStudentForm");

const params = new URLSearchParams(window.location.search);
const studentId = params.get("id");

// Get students from localStorage
function getStudents() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(data) ? data : [];
    } catch (error) {
        return [];
    }
}

// Find selected student
const students = getStudents();

const student = students.find(function(s) {
    return String(s.id) === String(studentId);
});

// Load student details into form
if (!student || studentId === null) {

    alert("Student not found!");
    window.location.href = "students.html";

} else {

    document.getElementById("rollNo").value = student.rollNo || "";
    document.getElementById("name").value = student.name || "";
    document.getElementById("email").value = student.email || "";
    document.getElementById("phone").value = student.phone || "";
    document.getElementById("course").value = student.course || "";
    document.getElementById("year").value = student.year || "";

}

// Update student details
form.addEventListener("submit", function(e) {

    e.preventDefault();

    const updatedStudents = getStudents();

    const index = updatedStudents.findIndex(function(s) {
        return String(s.id) === String(studentId);
    });

    if (index === -1) {
        alert("Student not found!");
        window.location.href = "students.html";
        return;
    }

    // Update all fields
    updatedStudents[index].rollNo =
        document.getElementById("rollNo").value.trim();

    updatedStudents[index].name =
        document.getElementById("name").value.trim();

    updatedStudents[index].email =
        document.getElementById("email").value.trim();

    updatedStudents[index].phone =
        document.getElementById("phone").value.trim();

    updatedStudents[index].course =
        document.getElementById("course").value.trim();

    updatedStudents[index].year =
        document.getElementById("year").value;

    // Save updated information
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedStudents)
    );

    alert("Student updated successfully!");

    window.location.href = "students.html";

});
