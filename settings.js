/* ==========================================
   PARAMÈTRES WINDOWS 11
========================================== */

const DEFAULT_WALLPAPERS = [
    "https://wallpaperaccess.com/full/317501.jpg",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    "https://images.unsplash.com/photo-1511497584788-876760111969"
];

/* ==========================================
   OUVRIR PARAMÈTRES
========================================== */

function openSettings(){

    const win = createWindow(
        "Paramètres",
        `
        <div style="display:flex;height:100%;">

            <div style="
            width:220px;
            border-right:1px solid #ddd;
            padding-right:15px;
            ">

                <h3>Personnalisation</h3>

                <button
                onclick="openWallpaperSettings()"
                style="width:100%;margin-top:10px;">
                Fond d'écran
                </button>

                <button
                onclick="openThemeSettings()"
                style="width:100%;margin-top:10px;">
                Thème
                </button>

                <button
                onclick="openSystemInfo()"
                style="width:100%;margin-top:10px;">
                Système
                </button>

            </div>

            <div
            id="settingsContent"
            style="
            flex:1;
            padding-left:20px;
            ">
            </div>

        </div>
        `
    );

    win.dataset.app = "settings";

    addRunningApp("settings");

    openWallpaperSettings();

}

/* ==========================================
   FONDS D'ÉCRAN
========================================== */

function openWallpaperSettings(){

    const content =
        document.getElementById(
            "settingsContent"
        );

    if(!content) return;

    let html = `
    <h2>Fond d'écran</h2>

    <p>
    Choisissez un fond d'écran.
    </p>

    <div style="
    display:flex;
    flex-wrap:wrap;
    gap:15px;
    margin-top:20px;
    ">
    `;

    DEFAULT_WALLPAPERS.forEach(
        wallpaper => {

        html += `
        <img
        src="${wallpaper}"
        onclick="
        setWallpaper(
        '${wallpaper}'
        )
        "
        style="
        width:180px;
        height:100px;
        object-fit:cover;
        cursor:pointer;
        border-radius:12px;
        border:2px solid #ddd;
        ">
        `;

    });

    html += `
    </div>

    <hr style="margin:20px 0">

    <button
    onclick="customWallpaper()">
    Utiliser une image locale
    </button>
    `;

    content.innerHTML = html;

}

/* ==========================================
   IMAGE PERSONNELLE
========================================== */

function customWallpaper(){

    const input =
        document.createElement(
            "input"
        );

    input.type = "file";

    input.accept = "image/*";

    input.onchange =
        event => {

        const file =
            event.target.files[0];

        if(!file)
            return;

        const reader =
            new FileReader();

        reader.onload =
            e => {

            setWallpaper(
                e.target.result
            );

            showNotification(
                "Paramètres",
                "Fond d'écran changé"
            );

        };

        reader.readAsDataURL(
            file
        );

    };

    input.click();

}

/* ==========================================
   THÈME
========================================== */

function openThemeSettings(){

    const content =
        document.getElementById(
            "settingsContent"
        );

    if(!content) return;

    content.innerHTML = `
    <h2>Thème</h2>

    <p>
    Choisissez un thème.
    </p>

    <div style="
    display:flex;
    gap:15px;
    margin-top:20px;
    ">

        <button
        onclick="setTheme('light')">
        ☀ Clair
        </button>

        <button
        onclick="setTheme('dark')">
        🌙 Sombre
        </button>

    </div>
    `;

}

/* ==========================================
   APPLIQUER THÈME
========================================== */

function setTheme(theme){

    document.body.dataset.theme =
        theme;

    saveData(
        "theme",
        theme
    );

    if(theme === "dark"){

        document.documentElement.style
        .setProperty(
            "--mica",
            "rgba(30,30,30,.85)"
        );

        document.documentElement.style
        .setProperty(
            "--bg-dark",
            "rgba(15,15,15,.85)"
        );

    }
    else{

        document.documentElement.style
        .setProperty(
            "--mica",
            "rgba(255,255,255,.75)"
        );

        document.documentElement.style
        .setProperty(
            "--bg-dark",
            "rgba(32,32,32,.75)"
        );

    }

    showNotification(
        "Paramètres",
        "Thème appliqué"
    );

}

/* ==========================================
   CHARGEMENT THÈME
========================================== */

function loadTheme(){

    const theme =
        loadData(
            "theme",
            "light"
        );

    setTheme(theme);

}

/* ==========================================
   INFOS SYSTÈME
========================================== */

function openSystemInfo(){

    const content =
        document.getElementById(
            "settingsContent"
        );

    if(!content) return;

    content.innerHTML = `
    <h2>Informations système</h2>

    <br>

    <b>Navigateur :</b>
    ${navigator.userAgent}

    <br><br>

    <b>Langue :</b>
    ${navigator.language}

    <br><br>

    <b>Plateforme :</b>
    ${navigator.platform}

    <br><br>

    <b>Résolution :</b>
    ${screen.width} x ${screen.height}

    <br><br>

    <b>Virtual OS :</b>
    Windows 11 Build 1.0
    `;

}

/* ==========================================
   DÉMARRAGE
========================================== */

window.addEventListener(
    "load",
    () => {

    loadTheme();

});
