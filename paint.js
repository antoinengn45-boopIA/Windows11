/* ==========================================
   PAINT WINDOWS 11
========================================== */

let paintCanvas = null;
let paintCtx = null;

let drawing = false;

let currentColor = "#000000";
let currentSize = 4;

let eraserMode = false;

/* ==========================================
   OUVRIR PAINT
========================================== */

function openPaint(){

    const win = createWindow(
        "Paint",
        `
        <div style="
        display:flex;
        gap:10px;
        align-items:center;
        margin-bottom:10px;
        flex-wrap:wrap;
        ">

            <input
            type="color"
            id="paintColor"
            value="#000000">

            <input
            type="range"
            id="paintSize"
            min="1"
            max="50"
            value="4">

            <button id="paintBrush">
                ✏️ Pinceau
            </button>

            <button id="paintEraser">
                🩹 Gomme
            </button>

            <button id="paintClear">
                🗑 Effacer
            </button>

            <button id="paintSave">
                💾 PNG
            </button>

            <button id="paintLoad">
                🖼 Charger image
            </button>

        </div>

        <canvas
        id="paintCanvas"
        width="900"
        height="500"
        style="
        background:white;
        border:1px solid #ccc;
        border-radius:10px;
        ">
        </canvas>
        `
    );

    win.dataset.app = "paint";

    addRunningApp("paint");

    initPaint();

}

/* ==========================================
   INITIALISATION
========================================== */

function initPaint(){

    paintCanvas =
        document.getElementById(
            "paintCanvas"
        );

    paintCtx =
        paintCanvas.getContext("2d");

    paintCtx.lineCap = "round";
    paintCtx.lineJoin = "round";

    setupPaintEvents();

}

/* ==========================================
   ÉVÉNEMENTS
========================================== */

function setupPaintEvents(){

    const colorInput =
        document.getElementById(
            "paintColor"
        );

    const sizeInput =
        document.getElementById(
            "paintSize"
        );

    const brushBtn =
        document.getElementById(
            "paintBrush"
        );

    const eraserBtn =
        document.getElementById(
            "paintEraser"
        );

    const clearBtn =
        document.getElementById(
            "paintClear"
        );

    const saveBtn =
        document.getElementById(
            "paintSave"
        );

    const loadBtn =
        document.getElementById(
            "paintLoad"
        );

    colorInput.addEventListener(
        "change",
        () => {

            currentColor =
                colorInput.value;

        }
    );

    sizeInput.addEventListener(
        "input",
        () => {

            currentSize =
                sizeInput.value;

        }
    );

    brushBtn.addEventListener(
        "click",
        () => {

            eraserMode = false;

            showNotification(
                "Paint",
                "Mode pinceau"
            );

        }
    );

    eraserBtn.addEventListener(
        "click",
        () => {

            eraserMode = true;

            showNotification(
                "Paint",
                "Mode gomme"
            );

        }
    );

    clearBtn.addEventListener(
        "click",
        clearCanvas
    );

    saveBtn.addEventListener(
        "click",
        saveCanvasPNG
    );

    loadBtn.addEventListener(
        "click",
        loadImageIntoCanvas
    );

    paintCanvas.addEventListener(
        "mousedown",
        startDraw
    );

    paintCanvas.addEventListener(
        "mousemove",
        draw
    );

    paintCanvas.addEventListener(
        "mouseup",
        stopDraw
    );

    paintCanvas.addEventListener(
        "mouseleave",
        stopDraw
    );

}

/* ==========================================
   DESSIN
========================================== */

function startDraw(e){

    drawing = true;

    paintCtx.beginPath();

    paintCtx.moveTo(
        getX(e),
        getY(e)
    );

}

function draw(e){

    if(!drawing)
        return;

    paintCtx.lineWidth =
        currentSize;

    paintCtx.strokeStyle =
        eraserMode
        ? "#FFFFFF"
        : currentColor;

    paintCtx.lineTo(
        getX(e),
        getY(e)
    );

    paintCtx.stroke();

}

function stopDraw(){

    drawing = false;

}

/* ==========================================
   POSITION SOURIS
========================================== */

function getX(e){

    const rect =
        paintCanvas.getBoundingClientRect();

    return e.clientX - rect.left;

}

function getY(e){

    const rect =
        paintCanvas.getBoundingClientRect();

    return e.clientY - rect.top;

}

/* ==========================================
   EFFACER
========================================== */

function clearCanvas(){

    if(
        !confirm(
            "Effacer le dessin ?"
        )
    ){
        return;
    }

    paintCtx.clearRect(
        0,
        0,
        paintCanvas.width,
        paintCanvas.height
    );

}

/* ==========================================
   SAUVEGARDE PNG
========================================== */

function saveCanvasPNG(){

    const link =
        document.createElement("a");

    link.download =
        "dessin.png";

    link.href =
        paintCanvas.toDataURL(
            "image/png"
        );

    link.click();

    showNotification(
        "Paint",
        "Image enregistrée"
    );

}

/* ==========================================
   CHARGER IMAGE
========================================== */

function loadImageIntoCanvas(){

    const input =
        document.createElement(
            "input"
        );

    input.type = "file";

    input.accept =
        "image/*";

    input.onchange =
        event => {

        const file =
            event.target.files[0];

        if(!file)
            return;

        const reader =
            new FileReader();

        reader.onload =
            ev => {

            const img =
                new Image();

            img.onload =
                () => {

                paintCtx.clearRect(
                    0,
                    0,
                    paintCanvas.width,
                    paintCanvas.height
                );

                paintCtx.drawImage(
                    img,
                    0,
                    0,
                    paintCanvas.width,
                    paintCanvas.height
                );

            };

            img.src =
                ev.target.result;

        };

        reader.readAsDataURL(
            file
        );

    };

    input.click();

}

/* ==========================================
   RACCOURCI CTRL+S
========================================== */

document.addEventListener(
    "keydown",
    e => {

    if(
        e.ctrlKey &&
        e.key === "s" &&
        paintCanvas
    ){

        e.preventDefault();

        saveCanvasPNG();

    }

});
