

document.addEventListener("DOMContentLoaded", function () {

    console.log("Student Management System Home Page Loaded");

    
    const welcomeHeading = document.querySelector(".welcome h1");

    
    welcomeHeading.addEventListener("click", function () {
        alert("Welcome to Student Management System!");
    });

  
    const navLinks = document.querySelectorAll("nav a");

    
    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            console.log("Opening page: " + link.textContent);
        });
    });

});
