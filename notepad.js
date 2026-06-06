/* ==========================================
   BLOC-NOTES WINDOWS 11
========================================== */

let currentNotepad = null;

/* ==========================================
   OUVRIR BLOC NOTES
========================================== */

function openNotepad(
    file = null,
    folder = null,
    index = null
){

    const content =
        file
        ? file.content
        : "";

    const title =
        file
        ? file.name
        : "Nouveau document";

    const win =
        createWindow(
            "Bloc-notes",
            `
            <div style="
            display:flex;
            gap:10px;
            margin-bottom:10px;
            ">

                <button
                id="npSave">
                💾 Enregistrer
                </button>

                <button
                id="npSaveAs">
                📄 Enregistrer sous
                </button>

                <button
                id="npNew">
                ➕ Nouveau
                </button>

            </div>

            <div style="
            margin-bottom:10px;
            font-size:13px;
            color:#666;
            ">
            ${title}
            </div>

            <textarea
            id="notepadArea"
            class="notepad"
            >${escapeHtml(content)}</textarea>
            `
        );

    win.dataset.app =
        "notepad";

    addRunningApp(
        "notepad"
    );

    currentNotepad = {

        file,
        folder,
        index,
        window:win

    };

    setupNotepad();

}

/* ==========================================
   INITIALISATION
========================================== */

function setupNotepad(){

    const area =
        document.getElementById(
            "notepadArea"
        );

    const saveBtn =
        document.getElementById(
            "npSave"
        );

    const saveAsBtn =
        document.getElementById(
            "npSaveAs"
        );

    const newBtn =
        document.getElementById(
            "npNew"
        );

    if(saveBtn){

        saveBtn.addEventListener(
            "click",
            saveCurrentFile
        );

    }

    if(saveAsBtn){

        saveAsBtn.addEventListener(
            "click",
            saveAsNewFile
        );

    }

    if(newBtn){

        newBtn.addEventListener(
            "click",
            ()=>{
                openNotepad();
            }
        );

    }

    if(area){

        area.addEventListener(
            "input",
            autoSave
        );

    }

}

/* ==========================================
   SAUVEGARDE AUTO
========================================== */

function autoSave(){

    if(
        !currentNotepad ||
        currentNotepad.folder === null
    ){
        return;
    }

    const area =
        document.getElementById(
            "notepadArea"
        );

    saveTextFile(
        currentNotepad.folder,
        currentNotepad.index,
        area.value
    );

}

/* ==========================================
   ENREGISTRER
========================================== */

function saveCurrentFile(){

    const area =
        document.getElementById(
            "notepadArea"
        );

    if(!area) return;

    if(
        currentNotepad &&
        currentNotepad.folder !== null
    ){

        saveTextFile(
            currentNotepad.folder,
            currentNotepad.index,
            area.value
        );

        showNotification(
            "Bloc-notes",
            "Fichier enregistré"
        );

        return;

    }

    saveAsNewFile();

}

/* ==========================================
   ENREGISTRER SOUS
========================================== */

function saveAsNewFile(){

    const area =
        document.getElementById(
            "notepadArea"
        );

    if(!area) return;

    const fs =
        getFileSystem();

    const folders =
        Object.keys(fs);

    if(
        folders.length === 0
    ){

        alert(
            "Aucun dossier disponible"
        );

        return;

    }

    const folder =
        prompt(
            "Nom du dossier :\n\n" +
            folders.join("\n")
        );

    if(
        !folder ||
        !fs[folder]
    ){
        return;
    }

    const name =
        prompt(
            "Nom du fichier"
        );

    if(!name) return;

    fs[folder].push({

        type:"file",

        name:
        name.endsWith(".txt")
        ? name
        : name + ".txt",

        content:
        area.value

    });

    saveFileSystem(fs);

    showNotification(
        "Bloc-notes",
        "Nouveau fichier enregistré"
    );

}

/* ==========================================
   NOUVEAU DOCUMENT
========================================== */

function newDocument(){

    openNotepad();

}

/* ==========================================
   EXPORT TXT
========================================== */

function exportTxt(){

    const area =
        document.getElementById(
            "notepadArea"
        );

    if(!area) return;

    const blob =
        new Blob(
            [area.value],
            {
                type:"text/plain"
            }
        );

    const a =
        document.createElement("a");

    a.href =
        URL.createObjectURL(blob);

    a.download =
        "document.txt";

    a.click();

    URL.revokeObjectURL(
        a.href
    );

}

/* ==========================================
   IMPORT TXT
========================================== */

function importTxt(){

    const input =
        document.createElement(
            "input"
        );

    input.type =
        "file";

    input.accept =
        ".txt";

    input.onchange =
        e => {

        const file =
            e.target.files[0];

        if(!file)
            return;

        const reader =
            new FileReader();

        reader.onload =
            ev => {

            const area =
                document.getElementById(
                    "notepadArea"
                );

            if(area){

                area.value =
                    ev.target.result;

            }

        };

        reader.readAsText(
            file
        );

    };

    input.click();

}

/* ==========================================
   UTILITAIRE
========================================== */

function escapeHtml(text){

    if(!text)
        return "";

    return text
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        );

}

/* ==========================================
   RACCOURCIS CLAVIER
========================================== */

document.addEventListener(
    "keydown",
    e => {

    const area =
        document.getElementById(
            "notepadArea"
        );

    if(!area) return;

    if(
        e.ctrlKey &&
        e.key === "s"
    ){

        e.preventDefault();

        saveCurrentFile();

    }

});
