const students = JSON.parse(localStorage.getItem("students")) || [];
const attendance = JSON.parse(localStorage.getItem("attendance")) || {};

document.getElementById("total-students").textContent = students.length;

// Class view: B.Tech CSE, year 3
const classStudents = students.filter(s =>
  String(s.course || "").toLowerCase().includes("cse") && String(s.year) === "3"
);

// Attendance percentage from all saved dates
function attendancePercent(rollNo) {
  let total = 0;
  let present = 0;
  for (const date in attendance) {
    const status = attendance[date][rollNo];
    if (status) {
      total++;
      if (status === "Present") present++;
    }
  }
  return total === 0 ? "No records" : Math.round((present / total) * 100) + "%";
}

// Build the table
const tbody = document.getElementById("class-body");
document.getElementById("class-count").textContent = classStudents.length;

tbody.innerHTML = classStudents.map(s => `
  <tr>
    <td>${s.rollNo}</td>
    <td>${s.name}</td>
    <td>${attendancePercent(s.rollNo)}</td>
  </tr>
`).join("");