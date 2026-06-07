/*
====================================
WINDOWMANAGER.JS
WINDOWS 11 WEB
====================================
*/

let highestZIndex = 100;
let windowCounter = 0;

/*
====================================
CREATE WINDOW
====================================
*/

function createWindow(
    title,
    content,
    options = {}
) {

    const width =
        options.width || 800;

    const height =
        options.height || 600;

    const left =
        options.left ||
        (window.innerWidth / 2 - width / 2);

    const top =
        options.top ||
        (window.innerHeight / 2 - height / 2);

    const id =
        "window_" + (++windowCounter);

    const win =
        document.createElement("div");

    win.className = "window";

    win.id = id;

    win.style.width =
        width + "px";

    win.style.height =
        height + "px";

    win.style.left =
        left + "px";

    win.style.top =
        top + "px";

    win.style.zIndex =
        ++highestZIndex;

    win.innerHTML = `
        <div class="titlebar">

            <div class="titlebar-title">
                ${title}
            </div>

            <div class="titlebar-buttons">

                <button
                    class="window-btn"
                    onclick="minimizeWindow('${id}')"
                >
                    ─
                </button>

                <button
                    class="window-btn"
                    onclick="maximizeWindow('${id}')"
                >
                    □
                </button>

                <button
                    class="window-btn close-btn"
                    onclick="closeWindow('${id}')"
                >
                    ✕
                </button>

            </div>

        </div>

        <div class="window-content">
            ${content}
        </div>

        <div class="window-resize"></div>
    `;

    document.body.appendChild(win);

    enableDragging(win);

    enableResizing(win);

    bringToFront(win);

    win.addEventListener(
        "mousedown",
        () => bringToFront(win)
    );

    return win;
}

/*
====================================
FOCUS
====================================
*/

function bringToFront(win) {

    win.style.zIndex =
        ++highestZIndex;
}

/*
====================================
DRAGGING
====================================
*/

function enableDragging(win) {

    const titlebar =
        win.querySelector(
            ".titlebar"
        );

    let dragging =
        false;

    let startX = 0;
    let startY = 0;

    let startLeft = 0;
    let startTop = 0;

    titlebar.addEventListener(
        "mousedown",
        function(e) {

            dragging = true;

            startX = e.clientX;
            startY = e.clientY;

            startLeft =
                parseInt(
                    win.style.left
                );

            startTop =
                parseInt(
                    win.style.top
                );

            bringToFront(win);
        }
    );

    document.addEventListener(
        "mousemove",
        function(e) {

            if (!dragging)
                return;

            const dx =
                e.clientX -
                startX;

            const dy =
                e.clientY -
                startY;

            win.style.left =
                startLeft +
                dx +
                "px";

            win.style.top =
                startTop +
                dy +
                "px";
        }
    );

    document.addEventListener(
        "mouseup",
        function() {

            dragging = false;
        }
    );
}

/*
====================================
RESIZING
====================================
*/

function enableResizing(win) {

    const resizeHandle =
        win.querySelector(
            ".window-resize"
        );

    let resizing =
        false;

    let startX = 0;
    let startY = 0;

    let startWidth = 0;
    let startHeight = 0;

    resizeHandle.addEventListener(
        "mousedown",
        function(e) {

            e.preventDefault();

            resizing = true;

            startX =
                e.clientX;

            startY =
                e.clientY;

            startWidth =
                win.offsetWidth;

            startHeight =
                win.offsetHeight;

            bringToFront(win);
        }
    );

    document.addEventListener(
        "mousemove",
        function(e) {

            if (!resizing)
                return;

            const dx =
                e.clientX -
                startX;

            const dy =
                e.clientY -
                startY;

            win.style.width =
                Math.max(
                    300,
                    startWidth + dx
                ) + "px";

            win.style.height =
                Math.max(
                    200,
                    startHeight + dy
                ) + "px";
        }
    );

    document.addEventListener(
        "mouseup",
        function() {

            resizing = false;
        }
    );
}

/*
====================================
MINIMIZE
====================================
*/

function minimizeWindow(id) {

    const win =
        document.getElementById(id);

    if (!win) return;

    win.style.display =
        "none";
}

/*
====================================
RESTORE
====================================
*/

function restoreWindow(id) {

    const win =
        document.getElementById(id);

    if (!win) return;

    win.style.display =
        "flex";

    bringToFront(win);
}

/*
====================================
MAXIMIZE
====================================
*/

function maximizeWindow(id) {

    const win =
        document.getElementById(id);

    if (!win) return;

    if (
        win.dataset.maximized
        === "true"
    ) {

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

    win.style.left =
        "0px";

    win.style.top =
        "0px";

    win.style.width =
        "100vw";

    win.style.height =
        "calc(100vh - 52px)";

    win.dataset.maximized =
        "true";
}

/*
====================================
CLOSE
====================================
*/

function closeWindow(id) {

    const win =
        document.getElementById(id);

    if (!win) return;

    win.style.opacity =
        "0";

    win.style.transform =
        "scale(.95)";

    setTimeout(() => {

        win.remove();

    }, 150);
}

/*
====================================
CASCADE WINDOWS
====================================
*/

function cascadeWindows() {

    const windows =
        document.querySelectorAll(
            ".window"
        );

    let offset = 0;

    windows.forEach(win => {

        win.style.left =
            50 + offset + "px";

        win.style.top =
            50 + offset + "px";

        offset += 30;
    });
}

/*
====================================
TILE WINDOWS
====================================
*/

function tileWindows() {

    const windows =
        document.querySelectorAll(
            ".window"
        );

    const count =
        windows.length;

    if (count === 0)
        return;

    const cols =
        Math.ceil(
            Math.sqrt(count)
        );

    const rows =
        Math.ceil(
            count / cols
        );

    const width =
        window.innerWidth /
        cols;

    const height =
        (window.innerHeight - 52)
        / rows;

    windows.forEach(
        (win, index) => {

            const row =
                Math.floor(
                    index / cols
                );

            const col =
                index % cols;

            win.style.left =
                col * width + "px";

            win.style.top =
                row * height + "px";

            win.style.width =
                width + "px";

            win.style.height =
                height + "px";
        }
    );
}

/*
====================================
SHOW ALL WINDOWS
====================================
*/

function restoreAllWindows() {

    document
    .querySelectorAll(".window")
    .forEach(win => {

        win.style.display =
            "flex";
    });
}

/*
====================================
WINDOWS SHORTCUTS
====================================
*/

document.addEventListener(
    "keydown",
    function(e) {

        if (
            e.ctrlKey &&
            e.shiftKey &&
            e.key === "M"
        ) {

            restoreAllWindows();
        }

        if (
            e.ctrlKey &&
            e.shiftKey &&
            e.key === "C"
        ) {

            cascadeWindows();
        }

        if (
            e.ctrlKey &&
            e.shiftKey &&
            e.key === "T"
        ) {

            tileWindows();
        }
    }
);

console.log(
    "Window Manager chargé."
);
