const STORAGE_KEY = "students";

const form = document.getElementById("studentForm");
const alertBox = document.getElementById("alertBox");
const courseList = document.getElementById("courseList");

const keys = ["rollNo", "name", "email", "phone", "course", "year"];
const inputs = {};
const errors = {};
keys.forEach(function (key) {
    inputs[key] = document.getElementById(key);
    errors[key] = document.getElementById("err-" + key);
});

// ---------- Storage ----------
function getStudents() {
    try {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(data) ? data : [];
    } catch (e) {
        return [];
    }
}

function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// ---------- Course suggestions (existing courses + a few common ones) ----------
function fillCourseSuggestions() {
    const defaults = ["B.Tech CSE", "B.Tech ECE", "B.Tech Mechanical", "BCA", "B.Sc", "MBA"];
    const existing = getStudents().map(function (s) { return s.course; }).filter(Boolean);
    const all = Array.from(new Set(existing.concat(defaults)));
    courseList.innerHTML = "";
    all.forEach(function (course) {
        const option = document.createElement("option");
        option.value = course;
        courseList.appendChild(option);
    });
}

// ---------- Messages ----------
function setError(key, message) {
    errors[key].textContent = message;
    inputs[key].classList.add("invalid");
}

function clearError(key) {
    errors[key].textContent = "";
    inputs[key].classList.remove("invalid");
}

function clearAllErrors() {
    keys.forEach(clearError);
}

function showAlert(message, type, withLink) {
    alertBox.className = "alert alert-" + type;
    alertBox.textContent = message + " ";
    if (withLink) {
        const link = document.createElement("a");
        link.href = "students.html";
        link.textContent = "View student list";
        alertBox.appendChild(link);
    }
    alertBox.hidden = false;
}

// ---------- Validation ----------
function readValues() {
    return {
        rollNo: inputs.rollNo.value.trim(),
        name: inputs.name.value.trim().replace(/\s+/g, " "),
        email: inputs.email.value.trim(),
        phone: inputs.phone.value.trim(),
        course: inputs.course.value.trim(),
        year: inputs.year.value
    };
}

function validate(values) {
    clearAllErrors();
    let valid = true;
    const students = getStudents();

    function fail(key, message) {
        setError(key, message);
        valid = false;
    }

    // Roll number
    if (!values.rollNo) {
        fail("rollNo", "Roll number is required.");
    } else if (values.rollNo.length > 20) {
        fail("rollNo", "Roll number can have at most 20 characters.");
    } else if (students.some(function (s) {
        return String(s.rollNo).toLowerCase() === values.rollNo.toLowerCase();
    })) {
        fail("rollNo", "This roll number already exists.");
    }

    // Name
    if (!values.name) {
        fail("name", "Name is required.");
    } else if (values.name.length < 2) {
        fail("name", "Name must have at least 2 characters.");
    } else if (!/^[A-Za-z .'-]+$/.test(values.name)) {
        fail("name", "Name can contain only letters and spaces.");
    }

    // Email
    if (!values.email) {
        fail("email", "Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        fail("email", "Enter a valid email address.");
    } else if (students.some(function (s) {
        return String(s.email).toLowerCase() === values.email.toLowerCase();
    })) {
        fail("email", "This email is already used by another student.");
    }

    // Phone
    if (!values.phone) {
        fail("phone", "Phone number is required.");
    } else if (!/^[0-9]{10}$/.test(values.phone)) {
        fail("phone", "Phone number must be exactly 10 digits.");
    }

    // Course and year
    if (!values.course) {
        fail("course", "Course is required.");
    }
    if (!values.year) {
        fail("year", "Please select the year.");
    }

    return valid;
}

// ---------- Events ----------
form.addEventListener("submit", function (e) {
    e.preventDefault();
    alertBox.hidden = true;

    const values = readValues();
    if (!validate(values)) {
        showAlert("Please fix the highlighted fields.", "warning", false);
        return;
    }

    const students = getStudents();
    students.push({
        id: Date.now(),
        rollNo: values.rollNo,
        name: values.name,
        email: values.email,
        phone: values.phone,
        course: values.course,
        year: values.year
    });
    saveStudents(students);

    // Clear the form first: reset() hides the message box, so show the message afterwards
    form.reset();
    clearAllErrors();
    fillCourseSuggestions();
    showAlert(values.name + " was added successfully.", "success", true);
    inputs.rollNo.focus();
});

form.addEventListener("reset", function () {
    clearAllErrors();
    alertBox.hidden = true;
});

// Remove a field's error as soon as the user edits it
keys.forEach(function (key) {
    inputs[key].addEventListener("input", function () { clearError(key); });
    inputs[key].addEventListener("change", function () { clearError(key); });
});

// Only digits in the phone box
inputs.phone.addEventListener("input", function () {
    inputs.phone.value = inputs.phone.value.replace(/[^0-9]/g, "");
});

fillCourseSuggestions();
