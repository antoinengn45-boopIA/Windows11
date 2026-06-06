/* ==========================================
   EXPLORATEUR WINDOWS 11
========================================== */

const FILESYSTEM_KEY = "virtual_filesystem";

/* ==========================================
   INITIALISATION
========================================== */

function initFileSystem(){

    const fs = loadData(
        FILESYSTEM_KEY,
        null
    );

    if(fs) return;

    const defaultFS = {

        Documents:[
            {
                type:"file",
                name:"Bienvenue.txt",
                content:
`Bienvenue dans Virtual Windows 11 !

Ce fichier est stocké dans localStorage.
`
            }
        ],

        Images:[],

        Téléchargements:[]

    };

    saveData(
        FILESYSTEM_KEY,
        defaultFS
    );

}

/* ==========================================
   LECTURE FS
========================================== */

function getFileSystem(){

    return loadData(
        FILESYSTEM_KEY,
        {}
    );

}

function saveFileSystem(fs){

    saveData(
        FILESYSTEM_KEY,
        fs
    );

}

/* ==========================================
   EXPLORATEUR
========================================== */

function openExplorer(){

    initFileSystem();

    const win = createWindow(
        "Explorateur de fichiers",
        `
        <div id="explorer">

            <div style="
            display:flex;
            gap:10px;
            margin-bottom:15px;
            ">

                <button onclick="createFolder()">
                Nouveau dossier
                </button>

                <button onclick="createTextFile()">
                Nouveau fichier texte
                </button>

            </div>

            <div id="explorerContent">

            </div>

        </div>
        `
    );

    win.dataset.app =
        "explorer";

    addRunningApp(
        "explorer"
    );

    renderExplorer();

}

/* ==========================================
   AFFICHAGE
========================================== */

function renderExplorer(){

    const container =
        document.getElementById(
            "explorerContent"
        );

    if(!container) return;

    const fs =
        getFileSystem();

    let html =
        `<div class="file-grid">`;

    Object.keys(fs).forEach(
        folder=>{

        html += `
        <div class="file"
        ondblclick="
        openFolder('${folder}')
        ">
            <div style="font-size:50px">
            📁
            </div>

            <div>
            ${folder}
            </div>
        </div>
        `;

    });

    html += "</div>";

    container.innerHTML =
        html;

}

/* ==========================================
   DOSSIER
========================================== */

function openFolder(folderName){

    const fs =
        getFileSystem();

    const files =
        fs[folderName];

    const container =
        document.getElementById(
            "explorerContent"
        );

    let html = `
    <button onclick="
    renderExplorer()
    ">
    ← Retour
    </button>

    <h3 style="
    margin-top:10px;
    margin-bottom:10px;
    ">
    ${folderName}
    </h3>

    <div class="file-grid">
    `;

    files.forEach((file,index)=>{

        html += `
        <div class="file">

            <div
            ondblclick="
            openFile(
            '${folderName}',
            ${index}
            )
            "
            style="font-size:50px">

            📄

            </div>

            <div>
            ${file.name}
            </div>

            <button
            onclick="
            renameFile(
            '${folderName}',
            ${index}
            )
            ">
            Renommer
            </button>

            <button
            onclick="
            deleteFile(
            '${folderName}',
            ${index}
            )
            ">
            Supprimer
            </button>

        </div>
        `;

    });

    html += "</div>";

    container.innerHTML =
        html;

}

/* ==========================================
   CRÉATION DOSSIER
========================================== */

function createFolder(){

    const name =
        prompt(
            "Nom du dossier"
        );

    if(!name) return;

    const fs =
        getFileSystem();

    if(fs[name]){

        alert(
            "Existe déjà"
        );

        return;

    }

    fs[name] = [];

    saveFileSystem(fs);

    renderExplorer();

}

/* ==========================================
   FICHIER TEXTE
========================================== */

function createTextFile(){

    const folder =
        prompt(
        "Dans quel dossier ?"
        );

    if(!folder) return;

    const fs =
        getFileSystem();

    if(!fs[folder]){

        alert(
            "Dossier introuvable"
        );

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
        : name+".txt",

        content:""

    });

    saveFileSystem(fs);

    openFolder(folder);

}

/* ==========================================
   OUVRIR FICHIER
========================================== */

function openFile(
    folder,
    index
){

    const fs =
        getFileSystem();

    const file =
        fs[folder][index];

    if(
        file.name.endsWith(".txt")
    ){

        if(
            typeof openNotepad
            === "function"
        ){

            openNotepad(
                file,
                folder,
                index
            );

        }

    }

}

/* ==========================================
   RENOMMER
========================================== */

function renameFile(
    folder,
    index
){

    const fs =
        getFileSystem();

    const file =
        fs[folder][index];

    const newName =
        prompt(
            "Nouveau nom",
            file.name
        );

    if(!newName) return;

    file.name =
        newName;

    saveFileSystem(fs);

    openFolder(folder);

}

/* ==========================================
   SUPPRIMER
========================================== */

function deleteFile(
    folder,
    index
){

    const fs =
        getFileSystem();

    if(
        !confirm(
            "Supprimer ?"
        )
    ){
        return;
    }

    fs[folder].splice(
        index,
        1
    );

    saveFileSystem(fs);

    openFolder(folder);

}

/* ==========================================
   ENREGISTRER
========================================== */

function saveTextFile(
    folder,
    index,
    content
){

    const fs =
        getFileSystem();

    fs[folder][index]
        .content =
        content;

    saveFileSystem(fs);

}
