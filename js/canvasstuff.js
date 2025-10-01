const canvas = document.getElementById("image");
const ctx = canvas.getContext("2d");

// Hidden canvas for original size (download)
const hiddenCanvas = document.createElement("canvas");
const hiddenCtx = hiddenCanvas.getContext("2d");

// Inputs
const uploadimg = document.getElementById("uploadimg");
const cool1 = document.getElementById("cool1");
const sizeslider = document.getElementById("fontsize");
const fontUpload = document.getElementById("uploadFont");
const wmUpload = document.getElementById("uploadWM");
const wmsizeSlider = document.getElementById("wmsize");
const downloadLink = document.getElementById("downloadLink");

// State
let watermarktext = "";
let userFont = "Arial";
let hAlign = "center";
let vAlign = "middle";
let watermarkImage = null;
let wmWidth = 100;
let baseImage = null;

// Image watermark alignment
let imgHAlign = "center";
let imgVAlign = "middle";

// ------------------ Base Image Upload ------------------
uploadimg.addEventListener("change", () => {
    const file = uploadimg.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        baseImage = img;
        draw();
    };
});

// ------------------ Text Font Upload ------------------
fontUpload.addEventListener("change", async () => {
    const file = fontUpload.files[0];
    if (!file) return;

    const fontName = "UserFont";
    const arrayBuffer = await file.arrayBuffer();
    const font = new FontFace(fontName, arrayBuffer);
    await font.load();
    document.fonts.add(font);

    userFont = fontName;
    draw();
});

// ------------------ Image Watermark Upload ------------------
wmUpload.addEventListener("change", () => {
    const file = wmUpload.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        watermarkImage = img;
        draw();
    };
});

// ------------------ Sliders ------------------
sizeslider.addEventListener("input", draw);
wmsizeSlider.addEventListener("input", () => {
    wmWidth = parseInt(wmsizeSlider.value);
    draw();
});

// ------------------ Watermark Text ------------------
cool1.addEventListener("input", () => {
    watermarktext = cool1.value;
    draw();
});

// ------------------ Alignment Buttons ------------------
// Text alignment
document.querySelectorAll(".hbtn").forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        hAlign = btn.dataset.align;
        draw();
    });
});
document.querySelectorAll(".vbtn").forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        vAlign = btn.dataset.align;
        draw();
    });
});

// Image alignment
document.querySelectorAll(".img-hbtn").forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        imgHAlign = btn.dataset.align;
        draw();
    });
});
document.querySelectorAll(".img-vbtn").forEach(btn => {
    btn.addEventListener("click", e => {
        e.preventDefault();
        imgVAlign = btn.dataset.align;
        draw();
    });
});

//------------ Draw Function 
function draw() {
    if (!baseImage) return;

    //  Draw on hidden canvas (original size) 
    hiddenCanvas.width = baseImage.width;
    hiddenCanvas.height = baseImage.height;

    hiddenCtx.clearRect(0, 0, hiddenCanvas.width, hiddenCanvas.height);
    hiddenCtx.drawImage(baseImage, 0, 0);

    // Text watermark
    if (watermarktext) {
        hiddenCtx.font = sizeslider.value + "px " + userFont;
        hiddenCtx.fillStyle = "rgba(255,255,255,0.36)";
        hiddenCtx.textAlign = hAlign;
        hiddenCtx.textBaseline = vAlign;

        let x = hAlign === "left" ? 10 : hAlign === "center" ? hiddenCanvas.width / 2 : hiddenCanvas.width - 10;
        let y = vAlign === "top" ? 10 : vAlign === "middle" ? hiddenCanvas.height / 2 : hiddenCanvas.height - 10;

        hiddenCtx.fillText(watermarktext, x, y);
    }

    // Image watermark
    if (watermarkImage) {
        let scale = wmWidth / watermarkImage.width;
        let wmHeight = watermarkImage.height * scale;

        let x = imgHAlign === "left" ? 10 : imgHAlign === "center" ? hiddenCanvas.width / 2 : hiddenCanvas.width - 10;
        let y = imgVAlign === "top" ? 10 : imgVAlign === "middle" ? hiddenCanvas.height / 2 : hiddenCanvas.height - 10;

        if (imgHAlign === "center") x -= wmWidth / 2;
        else if (imgHAlign === "right") x -= wmWidth;

        if (imgVAlign === "middle") y -= wmHeight / 2;
        else if (imgVAlign === "bottom") y -= wmHeight;

        hiddenCtx.globalAlpha = 0.36;
        hiddenCtx.drawImage(watermarkImage, x, y, wmWidth, wmHeight);
        hiddenCtx.globalAlpha = 1.0;
    }

    // Scale hidden canvas to visible canvas 
    const sidebarWidth = document.querySelector(".sidebar").offsetWidth;
    const availableWidth = window.innerWidth - sidebarWidth;
    const availableHeight = window.innerHeight;

    const scale = Math.min(availableWidth / baseImage.width, availableHeight / baseImage.height);

    canvas.width = baseImage.width * scale;
    canvas.height = baseImage.height * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(hiddenCanvas, 0, 0, canvas.width, canvas.height);

    // Update download link
    updateDownloadLink();
}

// Update download link (original size)
function updateDownloadLink() {
    downloadLink.href = hiddenCanvas.toDataURL("image/png");
}

// Redraw on window resize
window.addEventListener("resize", draw);
