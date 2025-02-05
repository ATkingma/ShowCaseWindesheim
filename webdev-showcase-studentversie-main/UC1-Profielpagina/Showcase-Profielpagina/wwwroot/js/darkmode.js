document.addEventListener("DOMContentLoaded", function () {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // Check for the theme in localStorage and apply the corresponding class
    if (localStorage.getItem("theme") === "light") {
        body.classList.add("light-mode");
        darkModeToggle.textContent = "Dark Mode";
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
        darkModeToggle.textContent = "Light Mode";
    }

    // Toggle the theme on button click
    darkModeToggle.addEventListener("click", function () {
        if (body.classList.contains("light-mode")) {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            localStorage.setItem("theme", "dark");
            darkModeToggle.textContent = "Light Mode";
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
            darkModeToggle.textContent = "Dark Mode";
        }
    });
});
