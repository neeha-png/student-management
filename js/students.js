
const STORAGE_KEY = "students";

const searchInput = document.getElementById("searchInput");
const countLabel = document.getElementById("countLabel");
const tableBody = document.getElementById("studentBody");
const tableWrapper = document.getElementById("tableWrapper");
const emptyState = document.getElementById("emptyState");
const emptyMessage = document.getElementById("emptyMessage");

// Read all students
function getStudents() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
}

// Save students
function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// Escape HTML
function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
}

// Filter students
function getFilteredStudents() {
    const query = searchInput.value.trim().toLowerCase();
    const students = getStudents();

    if (!query) return students;

    return students.filter(function (s) {
        return String(s.name || "").toLowerCase().includes(query) ||
               String(s.rollNo || "").toLowerCase().includes(query);
    });
}

// Display student table
function renderTable() {
    const total = getStudents().length;
    const list = getFilteredStudents();

    tableBody.innerHTML = list.map(function (s, i) {
        return `
            <tr>
                <td>${i + 1}</td>
                <td>${escapeHTML(s.rollNo)}</td>
                <td>${escapeHTML(s.name)}</td>
                <td>${escapeHTML(s.email)}</td>
                <td>${escapeHTML(s.phone)}</td>
                <td>${escapeHTML(s.course)}</td>
                <td>${escapeHTML(s.year)}</td>

                <td class="action-buttons">
                    <button class="btn-edit" data-id="${escapeHTML(s.id)}">
                        Edit
                    </button>

                    <button class="btn-delete" data-id="${escapeHTML(s.id)}">
                        Delete
                    </button>
                </td>
            </tr>`;
    }).join("");

    countLabel.textContent =
        "Showing " + list.length + " of " + total +
        (total === 1 ? " student" : " students");

    const isEmpty = list.length === 0;
    tableWrapper.hidden = isEmpty;
    emptyState.hidden = !isEmpty;

    if (total === 0) {
        emptyMessage.innerHTML =
            'No students added yet. <a href="add-student.html">Add a student</a>.';
    } else {
        emptyMessage.textContent = "No students match your search.";
    }
}

// Delete student
function deleteStudent(id) {
    const student = getStudents().find(function (s) {
        return String(s.id) === String(id);
    });

    if (!student) return;

    if (confirm("Delete " + student.name + " (" + student.rollNo + ")?")) {
        saveStudents(getStudents().filter(function (s) {
            return String(s.id) !== String(id);
        }));

        renderTable();
    }
}

// Handle Edit and Delete buttons
tableBody.addEventListener("click", function (e) {

    const editBtn = e.target.closest(".btn-edit");
    const deleteBtn = e.target.closest(".btn-delete");

    // Navigate to separate Edit page
    if (editBtn) {
        window.location.href =
            "edit-student.html?id=" +
            encodeURIComponent(editBtn.dataset.id);
    }

    // Delete student
    if (deleteBtn) {
        deleteStudent(deleteBtn.dataset.id);
    }
});

// Search while typing
searchInput.addEventListener("input", renderTable);

// Initial display
renderTable();
