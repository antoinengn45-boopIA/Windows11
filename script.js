/* ==========================================
   WINDOWS 11 CORE
========================================== */

let zIndexCounter = 100;
const runningApps = [];

/* ==========================================
   INITIALISATION
========================================== */

window.addEventListener("load", () => {

    updateClock();

    setInterval(updateClock, 1000);

    const startBtn = document.getElementById("startBtn");
    const startMenu = document.getElementById("startMenu");

    if(startBtn && startMenu){

        startBtn.addEventListener("click", (e)=>{
            e.stopPropagation();

            startMenu.style.display =
                startMenu.style.display === "block"
                ? "none"
                : "block";
        });

        document.addEventListener("click", (e)=>{

            if(
                !startMenu.contains(e.target)
                &&
                !startBtn.contains(e.target)
            ){
                startMenu.style.display = "none";
            }

        });

    }

});

/* ==========================================
   HORLOGE
========================================== */

function updateClock(){

    const clock = document.getElementById("clock");

    if(!clock) return;

    const now = new Date();

    clock.innerHTML =
        now.toLocaleTimeString("fr-FR",{
            hour:"2-digit",
            minute:"2-digit"
        });

}

/* ==========================================
   FENÊTRES
========================================== */

function createWindow(title, content){

    const win = document.createElement("div");

    win.className = "window";

    win.style.left =
        Math.floor(Math.random()*200+100)+"px";

    win.style.top =
        Math.floor(Math.random()*100+80)+"px";

    win.style.zIndex = ++zIndexCounter;

    win.innerHTML = `
    <div class="titlebar">

        <div class="title">
            ${title}
        </div>

        <div class="controls">

            <button class="minBtn">
                ─
            </button>

            <button class="closeBtn">
                ✕
            </button>

        </div>

    </div>

    <div class="window-content">
        ${content}
    </div>
    `;

    document.body.appendChild(win);

    makeDraggable(win);

    win.addEventListener("mousedown",()=>{
        win.style.zIndex = ++zIndexCounter;
    });

    win.querySelector(".closeBtn")
    .addEventListener("click",()=>{

        const appName =
            win.dataset.app;

        removeRunningApp(appName);

        win.remove();

    });

    win.querySelector(".minBtn")
    .addEventListener("click",()=>{

        win.style.display = "none";

    });

    return win;
}

/* ==========================================
   DRAG WINDOWS
========================================== */

function makeDraggable(win){

    const bar =
        win.querySelector(".titlebar");

    let offsetX = 0;
    let offsetY = 0;

    let dragging = false;

    bar.addEventListener("mousedown",(e)=>{

        dragging = true;

        offsetX =
            e.clientX - win.offsetLeft;

        offsetY =
            e.clientY - win.offsetTop;

    });

    document.addEventListener("mousemove",(e)=>{

        if(!dragging) return;

        win.style.left =
            (e.clientX-offsetX)+"px";

        win.style.top =
            (e.clientY-offsetY)+"px";

    });

    document.addEventListener("mouseup",()=>{

        dragging = false;

    });

}

/* ==========================================
   APPLICATIONS
========================================== */

function openApp(app){

    switch(app){

        case "explorer":
            if(typeof openExplorer==="function"){
                openExplorer();
            }
            break;

        case "notepad":
            if(typeof openNotepad==="function"){
                openNotepad();
            }
            break;

        case "paint":
            if(typeof openPaint==="function"){
                openPaint();
            }
            break;

        case "calculator":
            if(typeof openCalculator==="function"){
                openCalculator();
            }
            break;

        case "settings":
            if(typeof openSettings==="function"){
                openSettings();
            }
            break;

        case "taskmgr":
            if(typeof openTaskManager==="function"){
                openTaskManager();
            }
            break;

        default:

            createWindow(
                app,
                "<h2>Application inconnue</h2>"
            );

    }

}

/* ==========================================
   BARRE DES TÂCHES
========================================== */

function addRunningApp(name){

    if(runningApps.includes(name))
        return;

    runningApps.push(name);

}

function removeRunningApp(name){

    const index =
        runningApps.indexOf(name);

    if(index !== -1){

        runningApps.splice(index,1);

    }

}

function getRunningApps(){

    return runningApps;

}

/* ==========================================
   NOTIFICATIONS
========================================== */

function showNotification(
    title,
    message
){

    let container =
        document.getElementById(
            "notifications"
        );

    if(!container){

        container =
            document.createElement("div");

        container.id =
            "notifications";

        document.body.appendChild(
            container
        );

    }

    const notif =
        document.createElement("div");

    notif.className =
        "notification";

    notif.innerHTML = `
    <strong>${title}</strong>
    <br>
    ${message}
    `;

    container.appendChild(notif);

    setTimeout(()=>{

        notif.remove();

    },4000);

}

/* ==========================================
   LOCAL STORAGE
========================================== */

function saveData(
    key,
    value
){

    localStorage.setItem(
        key,
        JSON.stringify(value)
    );

}

function loadData(
    key,
    defaultValue = null
){

    const data =
        localStorage.getItem(key);

    if(!data)
        return defaultValue;

    try{

        return JSON.parse(data);

    }
    catch{

        return defaultValue;

    }

}

/* ==========================================
   BUREAU
========================================== */

function setWallpaper(url){

    document.body.style.backgroundImage =
        `url('${url}')`;

    saveData(
        "wallpaper",
        url
    );

}

function loadWallpaper(){

    const wallpaper =
        loadData(
            "wallpaper",
            null
        );

    if(wallpaper){

        document.body.style.backgroundImage =
            `url('${wallpaper}')`;

    }

}

loadWallpaper();

/* ==========================================
   MENU DÉMARRER
========================================== */

function closeStartMenu(){

    const startMenu =
        document.getElementById(
            "startMenu"
        );

    if(startMenu){

        startMenu.style.display =
            "none";

    }

}

/* ==========================================
   BOOT
========================================== */

showNotification(
    "Windows 11",
    "Bienvenue sur Virtual Windows 11"
);
