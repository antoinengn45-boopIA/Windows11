/* ==========================================
   GESTIONNAIRE DE TÂCHES WINDOWS 11
========================================== */

let taskManagerInterval = null;

/* ==========================================
   OUVRIR
========================================== */

function openTaskManager(){

    const win = createWindow(
        "Gestionnaire de tâches",
        `
        <div style="height:100%;display:flex;flex-direction:column;">

            <h2>Applications en cours</h2>

            <div style="
            margin-top:10px;
            margin-bottom:10px;
            display:flex;
            gap:20px;
            flex-wrap:wrap;
            ">

                <div>
                    <b>Applications :</b>
                    <span id="taskAppCount">0</span>
                </div>

                <div>
                    <b>Fenêtres :</b>
                    <span id="taskWindowCount">0</span>
                </div>

                <div>
                    <b>Mémoire estimée :</b>
                    <span id="taskMemory">0 MB</span>
                </div>

            </div>

            <div
            id="taskList"
            style="
            flex:1;
            overflow:auto;
            border-top:1px solid #ddd;
            padding-top:10px;
            ">
            </div>

        </div>
        `
    );

    win.dataset.app = "taskmgr";

    addRunningApp("taskmgr");

    updateTaskManager();

    taskManagerInterval =
        setInterval(
            updateTaskManager,
            1000
        );

    const closeBtn =
        win.querySelector(
            ".closeBtn"
        );

    if(closeBtn){

        closeBtn.addEventListener(
            "click",
            () => {

            clearInterval(
                taskManagerInterval
            );

        });

    }

}

/* ==========================================
   MISE À JOUR
========================================== */

function updateTaskManager(){

    const list =
        document.getElementById(
            "taskList"
        );

    if(!list)
        return;

    const windows =
        document.querySelectorAll(
            ".window"
        );

    const appCount =
        document.getElementById(
            "taskAppCount"
        );

    const windowCount =
        document.getElementById(
            "taskWindowCount"
        );

    const memory =
        document.getElementById(
            "taskMemory"
        );

    if(appCount){

        appCount.textContent =
            getRunningApps()
            .length;

    }

    if(windowCount){

        windowCount.textContent =
            windows.length;

    }

    if(memory){

        memory.textContent =
            estimateMemory(
                windows.length
            ) + " MB";

    }

    let html = "";

    windows.forEach(
        (windowElement,index)=>{

        const title =
            windowElement
            .querySelector(
                ".title"
            )?.textContent
            || "Application";

        html += `
        <div style="
        display:flex;
        justify-content:space-between;
        align-items:center;

        padding:10px;

        margin-bottom:8px;

        border:1px solid #ddd;

        border-radius:10px;
        ">

            <div>

                <b>
                ${title}
                </b>

                <br>

                PID :
                ${1000 + index}

            </div>

            <button
            onclick="
            forceCloseWindow(
            ${index}
            )
            ">
            Terminer
            </button>

        </div>
        `;

    });

    if(html === ""){

        html =
        `
        <div>
        Aucune application.
        </div>
        `;

    }

    list.innerHTML =
        html;

}

/* ==========================================
   MÉMOIRE
========================================== */

function estimateMemory(
    count
){

    return (
        count * 25 +
        Math.floor(
            Math.random()*15
        )
    );

}

/* ==========================================
   FERMETURE FORCÉE
========================================== */

function forceCloseWindow(
    index
){

    const windows =
        document.querySelectorAll(
            ".window"
        );

    const target =
        windows[index];

    if(!target)
        return;

    const title =
        target
        .querySelector(
            ".title"
        )?.textContent;

    target.remove();

    removeRunningApp(
        title?.toLowerCase()
    );

    showNotification(
        "Gestionnaire de tâches",
        `${title} fermé`
    );

    updateTaskManager();

}

/* ==========================================
   FERMER TOUT
========================================== */

function closeAllApps(){

    const windows =
        document.querySelectorAll(
            ".window"
        );

    windows.forEach(
        win => {

        const title =
            win.querySelector(
                ".title"
            )?.textContent;

        if(
            title !==
            "Gestionnaire de tâches"
        ){

            win.remove();

        }

        });

    runningApps.length = 0;

    showNotification(
        "Gestionnaire de tâches",
        "Toutes les applications ont été fermées"
    );

    updateTaskManager();

}

/* ==========================================
   INFOS SYSTÈME
========================================== */

function getSystemStats(){

    return {

        apps:
            getRunningApps()
            .length,

        windows:
            document
            .querySelectorAll(
                ".window"
            ).length,

        memory:
            estimateMemory(
                document
                .querySelectorAll(
                    ".window"
                ).length
            ),

        uptime:
            Math.floor(
                performance.now()
                /1000
            )

    };

}

/* ==========================================
   RAFRAÎCHIR
========================================== */

function refreshTaskManager(){

    updateTaskManager();

}

/* ==========================================
   RACCOURCI CLAVIER
========================================== */

document.addEventListener(
    "keydown",
    e => {

    if(
        e.ctrlKey &&
        e.shiftKey &&
        e.key.toLowerCase()
        === "escape"
    ){

        openTaskManager();

    }

});
