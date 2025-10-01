const canvas = document.getElementById("image");
const ctx = canvas.getContext("2d");

// Inputs
const uploadimg = document.getElementById("uploadimg");
const cool1 = document.getElementById("cool1");
const sizeslider = document.getElementById("fontsize");
const fontUpload = document.getElementById("uploadFont");
const wmUpload = document.getElementById("uploadWM");
const wmsizeSlider = document.getElementById("wmsize");

// State
let watermarktext = "";
let userFont = "Arial";
let hAlign = "center"; // text horizontal
let vAlign = "middle"; // text vertical
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
        canvas.width = img.width;
        canvas.height = img.height;
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

// ------------------ Draw Function ------------------
function draw() {
    if (!baseImage) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(baseImage, 0, 0);

    // ---- Draw Text Watermark ----
    if (watermarktext) {
        ctx.font = sizeslider.value + "px " + userFont;
        ctx.fillStyle = "rgba(255, 255, 255, 0.36)";
        ctx.textAlign = hAlign;
        ctx.textBaseline = vAlign;

        let x = hAlign === "left" ? 10 : hAlign === "center" ? canvas.width / 2 : canvas.width - 10;
        let y = vAlign === "top" ? 10 : vAlign === "middle" ? canvas.height / 2 : canvas.height - 10;

        ctx.fillText(watermarktext, x, y);
    }

    // ---- Draw Image Watermark ----
    if (watermarkImage) {
        let scale = wmWidth / watermarkImage.width;
        let wmHeight = watermarkImage.height * scale;

        let x = imgHAlign === "left" ? 10 : imgHAlign === "center" ? canvas.width / 2 : canvas.width - 10;
        let y = imgVAlign === "top" ? 10 : imgVAlign === "middle" ? canvas.height / 2 : canvas.height - 10;

        if (imgHAlign === "center") x -= wmWidth / 2;
        else if (imgHAlign === "right") x -= wmWidth;

        if (imgVAlign === "middle") y -= wmHeight / 2;
        else if (imgVAlign === "bottom") y -= wmHeight;

        ctx.globalAlpha = 0.36;
        ctx.drawImage(watermarkImage, x, y, wmWidth, wmHeight);
        ctx.globalAlpha = 1.0;
    }
}
