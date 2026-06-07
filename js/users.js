/*
====================================
WINDOWS 11 WEB - USERS SYSTEM FINAL
====================================
*/

let currentUser = null;

let users = JSON.parse(
    localStorage.getItem("w11_users")
) || [];

/*
====================================
SAVE USERS
====================================
*/

function saveUsers() {
    localStorage.setItem(
        "w11_users",
        JSON.stringify(users)
    );
}

/*
====================================
REGISTER USER
====================================
*/

function registerUser() {

    const name =
        document.getElementById("login-username").value.trim();

    const pass =
        document.getElementById("login-password").value.trim();

    if (!name || !pass) {
        alert("Remplis tous les champs");
        return;
    }

    const exists =
        users.find(u => u.name === name);

    if (exists) {
        alert("Utilisateur déjà existant");
        return;
    }

    users.push({
        name,
        pass
    });

    saveUsers();
    renderUsers();

    alert("Compte créé avec succès !");
}

/*
====================================
LOGIN USER
====================================
*/

function loginUser() {

    const name =
        document.getElementById("login-username").value.trim();

    const pass =
        document.getElementById("login-password").value.trim();

    const user =
        users.find(
            u =>
                u.name === name &&
                u.pass === pass
        );

    if (!user) {
        alert("Identifiants incorrects");
        return;
    }

    currentUser = user.name;

    localStorage.setItem(
        "w11_session",
        currentUser
    );

    startSession();
}

/*
====================================
START SESSION
====================================
*/

function startSession() {

    document.getElementById("login-screen").style.display = "none";
    document.getElementById("desktop").style.display = "block";

    if (typeof showNotification === "function") {
        showNotification(
            "Windows 11 Web",
            "Bienvenue " + currentUser
        );
    }
}

/*
====================================
LOGOUT USER
====================================
*/

function logoutUser() {

    localStorage.removeItem("w11_session");

    location.reload();
}

/*
====================================
RENDER USERS LIST
====================================
*/

function renderUsers() {

    const list =
        document.getElementById("user-list");

    if (!list) return;

    list.innerHTML =
        users.map(
            u => `<div>👤 ${u.name}</div>`
        ).join("");
}

/*
====================================
AUTO LOGIN SYSTEM
====================================
*/

window.addEventListener("load", () => {

    const session =
        localStorage.getItem("w11_session");

    const loginScreen =
        document.getElementById("login-screen");

    const desktop =
        document.getElementById("desktop");

    if (session) {

        currentUser = session;

        loginScreen.style.display = "none";
        desktop.style.display = "block";

        if (typeof showNotification === "function") {
            showNotification(
                "Windows 11 Web",
                "Bienvenue " + currentUser
            );
        }

    } else {

        loginScreen.style.display = "flex";
        desktop.style.display = "none";

        renderUsers();
    }
});

console.log("Users system FINAL chargé");
