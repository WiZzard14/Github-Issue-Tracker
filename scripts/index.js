const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function () {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    if (username === "admin" && password === "admin123") {
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("mainSection").classList.remove("hidden");
    } else {
        alert("Wrong username or password");
    }
});

