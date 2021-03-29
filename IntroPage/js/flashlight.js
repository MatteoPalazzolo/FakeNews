/********* PARAMETERS *********/
const f_wallSelector = ".wall";

/********* REFERENCES *********/
let wall;

/********* STATES *********/
let isTorchEnable = false;

/********* CODE *********/
window.addEventListener("load", () => {
    wall = document.querySelector(f_wallSelector);

    SetupEventListeners();
});

let touchtime = 0;
let delay = 400;
let action = null;
function SetupEventListeners() {    
    if (isMobile) {
        window.addEventListener("click", e => {
            torchRadius = mobile_torchRadius;

            /*Double Click */
            if ((new Date().getTime() - touchtime) < delay) {
                clearTimeout(action);

                TurnTorch();
                
                touchtime = 0;
            }
            /* Single Click */
            else {
                touchtime = new Date().getTime();
            
                action = setTimeout(() => {
                    //single click
                },  delay);
            }
            
            SetTorchlightPosition(GetMousePos(e));

        });

        window.addEventListener("touchmove", e => {
            console.log(e);
            SetTorchlightPosition(GetTouchMovePos(e));
        });
    }
    else {
        torchRadius = pc_torchRadius;

        window.addEventListener("scroll", e => {
            SetTorchlightPosition(GetMousePos(undefined));
        });
        
        window.addEventListener("mousemove", e => {
            SetTorchlightPosition(GetMousePos(e));
        });
        
        window.addEventListener("mousedown", e => {
            if (e.button === 2) TurnTorch();
            SetTorchlightPosition(GetMousePos(undefined));
        });
    }
}

function TurnTorch() {
    isTorchEnable = !isTorchEnable;
    if (isTorchEnable) PlayAudio(torchOn_SFX);
    else PlayAudio(torchOff_SFX);
}

function GetTouchMovePos(e) {
    let mousePos;
    if (e) {
        mousePos = {x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY};
    }
    else {
        mousePos = {x: window.event.changedTouches[0].clientX, y: window.event.changedTouches[0].clientY};
    }
    return mousePos;
}

function GetMousePos(e) {
    let mousePos;
    if (e) {
        mousePos = {x: e.pageX, y: e.pageY};
    }
    else {
        mousePos = {x: window.event.pageX, y: window.event.pageY};
    }
    return mousePos;
}

function SetTorchlightPosition(cursorPos) {
    let path;
    if (isTorchEnable) {
        path = "circle(" + torchRadius + "px at " + cursorPos.x + "px " + cursorPos.y + "px)";
        TorchOn();
    }
    else {
        path = "none";
        TorchOff();
    }
    wall.style.clipPath = path;
}

function TorchOn() {
    if (!isTorchEnable) {
        isTorchEnable = true;
        PlayAudio(torchOn_SFX);
    }
    pointer.style.opacity = "100%";
    wall.style.opacity = "100%";
    wall.style.pointerEvents = "auto";
}

function TorchOff() {
    if (isTorchEnable) {
        isTorchEnable = false;
        PlayAudio(torchOff_SFX);
    }
    pointer.style.opacity = "0%";
    wall.style.opacity = "0%";
    wall.style.pointerEvents = "none";
}