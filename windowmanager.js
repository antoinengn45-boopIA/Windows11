/* ==========================================
   WINDOW MANAGER WINDOWS 11
========================================== */

let activeWindow = null;

/* ==========================================
   INITIALISATION
========================================== */

function initWindowManager(){

    document.addEventListener(
        "mousedown",
        e => {

        const win =
            e.target.closest(
                ".window"
            );

        if(!win) return;

        focusWindow(win);

    });

}

/* ==========================================
   FOCUS
========================================== */

function focusWindow(win){

    activeWindow = win;

    const windows =
        document.querySelectorAll(
            ".window"
        );

    windows.forEach(w=>{

        w.classList.remove(
            "active-window"
        );

    });

    win.classList.add(
        "active-window"
    );

    win.style.zIndex =
        ++zIndexCounter;

}

/* ==========================================
   MAXIMISER
========================================== */

function maximizeWindow(win){

    if(
        win.dataset.maximized
        === "true"
    ){

        restoreWindow(win);

        return;

    }

    win.dataset.oldLeft =
        win.style.left;

    win.dataset.oldTop =
        win.style.top;

    win.dataset.oldWidth =
        win.style.width;

    win.dataset.oldHeight =
        win.style.height;

    win.style.left = "0px";
    win.style.top = "0px";

    win.style.width =
        window.innerWidth +
        "px";

    win.style.height =
        (
            window.innerHeight
            - 70
        ) + "px";

    win.dataset.maximized =
        "true";

}

/* ==========================================
   RESTAURER
========================================== */

function restoreWindow(win){

    win.style.left =
        win.dataset.oldLeft;

    win.style.top =
        win.dataset.oldTop;

    win.style.width =
        win.dataset.oldWidth;

    win.style.height =
        win.dataset.oldHeight;

    win.dataset.maximized =
        "false";

}

/* ==========================================
   SNAP GAUCHE
========================================== */

function snapLeft(win){

    win.style.left = "0px";
    win.style.top = "0px";

    win.style.width =
        (
            window.innerWidth / 2
        ) + "px";

    win.style.height =
        (
            window.innerHeight
            - 70
        ) + "px";

}

/* ==========================================
   SNAP DROITE
========================================== */

function snapRight(win){

    win.style.left =
        (
            window.innerWidth / 2
        ) + "px";

    win.style.top = "0px";

    win.style.width =
        (
            window.innerWidth / 2
        ) + "px";

    win.style.height =
        (
            window.innerHeight
            - 70
        ) + "px";

}

/* ==========================================
   REDIMENSIONNEMENT
========================================== */

function addResizeHandle(win){

    const handle =
        document.createElement(
            "div"
        );

    handle.className =
        "resize-handle";

    handle.style.position =
        "absolute";

    handle.style.right =
        "0";

    handle.style.bottom =
        "0";

    handle.style.width =
        "15px";

    handle.style.height =
        "15px";

    handle.style.cursor =
        "nwse-resize";

    win.appendChild(
        handle
    );

    let resizing =
        false;

    let startX,
        startY,
        startW,
        startH;

    handle.addEventListener(
        "mousedown",
        e => {

        e.preventDefault();

        resizing = true;

        startX =
            e.clientX;

        startY =
            e.clientY;

        startW =
            win.offsetWidth;

        startH =
            win.offsetHeight;

    });

    document.addEventListener(
        "mousemove",
        e => {

        if(!resizing)
            return;

        const width =
            startW +
            (
                e.clientX
                - startX
            );

        const height =
            startH +
            (
                e.clientY
                - startY
            );

        win.style.width =
            Math.max(
                350,
                width
            ) + "px";

        win.style.height =
            Math.max(
                250,
                height
            ) + "px";

    });

    document.addEventListener(
        "mouseup",
        ()=>{

        resizing = false;

    });

}

/* ==========================================
   BOUTONS WINDOWS
========================================== */

function addWindowButtons(win){

    const controls =
        win.querySelector(
            ".controls"
        );

    if(!controls)
        return;

    const maxBtn =
        document.createElement(
            "button"
        );

    maxBtn.innerHTML =
        "🗖";

    maxBtn.onclick =
        ()=>{

        maximizeWindow(
            win
        );

    };

    controls.insertBefore(
        maxBtn,
        controls.lastElementChild
    );

    const bar =
        win.querySelector(
            ".titlebar"
        );

    if(bar){

        bar.addEventListener(
            "dblclick",
            ()=>{

            maximizeWindow(
                win
            );

        });

    }

}

/* ==========================================
   RACCOURCIS CLAVIER
========================================== */

document.addEventListener(
    "keydown",
    e => {

    if(!activeWindow)
        return;

    if(
        e.altKey &&
        e.key === "ArrowLeft"
    ){

        snapLeft(
            activeWindow
        );

    }

    if(
        e.altKey &&
        e.key === "ArrowRight"
    ){

        snapRight(
            activeWindow
        );

    }

    if(
        e.altKey &&
        e.key === "ArrowUp"
    ){

        maximizeWindow(
            activeWindow
        );

    }

});

/* ==========================================
   INTÉGRATION
========================================== */

function enhanceWindow(win){

    addResizeHandle(
        win
    );

    addWindowButtons(
        win
    );

    focusWindow(
        win
    );

}

/* ==========================================
   DÉMARRAGE
========================================== */

window.addEventListener(
    "load",
    ()=>{

    initWindowManager();

});
