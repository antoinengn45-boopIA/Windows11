/* ==========================================
   CALCULATRICE WINDOWS 11
========================================== */

let calcDisplayValue = "";
let calcMemory = 0;
let calcHistory = [];

/* ==========================================
   OUVRIR CALCULATRICE
========================================== */

function openCalculator(){

    const win = createWindow(
        "Calculatrice",
        `
        <div style="display:flex;gap:15px;height:100%;">

            <div style="flex:1;">

                <input
                id="calcDisplay"
                class="calc-display"
                readonly
                value="">

                <div class="calc">

                    <button onclick="memoryClear()">MC</button>
                    <button onclick="memoryRecall()">MR</button>
                    <button onclick="memoryAdd()">M+</button>
                    <button onclick="memorySubtract()">M-</button>

                    <button onclick="appendCalc('7')">7</button>
                    <button onclick="appendCalc('8')">8</button>
                    <button onclick="appendCalc('9')">9</button>
                    <button onclick="appendCalc('/')">÷</button>

                    <button onclick="appendCalc('4')">4</button>
                    <button onclick="appendCalc('5')">5</button>
                    <button onclick="appendCalc('6')">6</button>
                    <button onclick="appendCalc('*')">×</button>

                    <button onclick="appendCalc('1')">1</button>
                    <button onclick="appendCalc('2')">2</button>
                    <button onclick="appendCalc('3')">3</button>
                    <button onclick="appendCalc('-')">−</button>

                    <button onclick="appendCalc('0')">0</button>
                    <button onclick="appendCalc('.')">.</button>
                    <button onclick="calculate()">=</button>
                    <button onclick="appendCalc('+')">+</button>

                    <button onclick="sqrtCalc()">√</button>
                    <button onclick="powerCalc()">x²</button>
                    <button onclick="percentCalc()">%</button>
                    <button onclick="clearCalc()">C</button>

                </div>

            </div>

            <div style="
            width:220px;
            border-left:1px solid #ddd;
            padding-left:10px;
            overflow:auto;
            ">

                <h3>Historique</h3>

                <div id="calcHistory">
                Aucun calcul
                </div>

            </div>

        </div>
        `
    );

    win.dataset.app = "calculator";

    addRunningApp("calculator");

}

/* ==========================================
   AFFICHAGE
========================================== */

function getDisplay(){

    return document.getElementById(
        "calcDisplay"
    );

}

function updateDisplay(){

    const display = getDisplay();

    if(display){

        display.value =
            calcDisplayValue;

    }

}

/* ==========================================
   SAISIE
========================================== */

function appendCalc(value){

    calcDisplayValue += value;

    updateDisplay();

}

/* ==========================================
   EFFACER
========================================== */

function clearCalc(){

    calcDisplayValue = "";

    updateDisplay();

}

/* ==========================================
   CALCUL
========================================== */

function calculate(){

    try{

        const expression =
            calcDisplayValue;

        const result =
            Function(
                "return (" +
                expression +
                ")"
            )();

        addHistory(
            expression,
            result
        );

        calcDisplayValue =
            String(result);

        updateDisplay();

    }
    catch{

        calcDisplayValue =
            "Erreur";

        updateDisplay();

    }

}

/* ==========================================
   RACINE CARRÉE
========================================== */

function sqrtCalc(){

    try{

        const value =
            Number(
                calcDisplayValue
            );

        const result =
            Math.sqrt(value);

        addHistory(
            `√(${value})`,
            result
        );

        calcDisplayValue =
            String(result);

        updateDisplay();

    }
    catch{}

}

/* ==========================================
   PUISSANCE
========================================== */

function powerCalc(){

    try{

        const value =
            Number(
                calcDisplayValue
            );

        const result =
            Math.pow(
                value,
                2
            );

        addHistory(
            `${value}²`,
            result
        );

        calcDisplayValue =
            String(result);

        updateDisplay();

    }
    catch{}

}

/* ==========================================
   POURCENTAGE
========================================== */

function percentCalc(){

    try{

        const value =
            Number(
                calcDisplayValue
            );

        const result =
            value / 100;

        addHistory(
            `${value}%`,
            result
        );

        calcDisplayValue =
            String(result);

        updateDisplay();

    }
    catch{}

}

/* ==========================================
   MÉMOIRE
========================================== */

function memoryClear(){

    calcMemory = 0;

    showNotification(
        "Calculatrice",
        "Mémoire effacée"
    );

}

function memoryRecall(){

    calcDisplayValue +=
        String(calcMemory);

    updateDisplay();

}

function memoryAdd(){

    const value =
        Number(
            calcDisplayValue
        );

    if(!isNaN(value)){

        calcMemory += value;

    }

}

function memorySubtract(){

    const value =
        Number(
            calcDisplayValue
        );

    if(!isNaN(value)){

        calcMemory -= value;

    }

}

/* ==========================================
   HISTORIQUE
========================================== */

function addHistory(
    expression,
    result
){

    calcHistory.unshift({

        expression,
        result

    });

    if(
        calcHistory.length > 25
    ){

        calcHistory.pop();

    }

    renderHistory();

}

function renderHistory(){

    const container =
        document.getElementById(
            "calcHistory"
        );

    if(!container)
        return;

    if(
        calcHistory.length === 0
    ){

        container.innerHTML =
            "Aucun calcul";

        return;

    }

    let html = "";

    calcHistory.forEach(
        item => {

        html += `
        <div style="
        margin-bottom:10px;
        padding-bottom:10px;
        border-bottom:1px solid #eee;
        ">

            <div>
            ${item.expression}
            </div>

            <strong>
            ${item.result}
            </strong>

        </div>
        `;

    });

    container.innerHTML =
        html;

}

/* ==========================================
   CLAVIER
========================================== */

document.addEventListener(
    "keydown",
    e => {

    const display =
        document.getElementById(
            "calcDisplay"
        );

    if(!display)
        return;

    const allowed =
        "0123456789+-*/.";

    if(
        allowed.includes(
            e.key
        )
    ){

        appendCalc(
            e.key
        );

    }

    if(
        e.key === "Enter"
    ){

        calculate();

    }

    if(
        e.key === "Escape"
    ){

        clearCalc();

    }

});
