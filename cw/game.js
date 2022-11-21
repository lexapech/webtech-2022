import GameManager from "./GameManager.js";

window.addEventListener("load",()=>{
    console.log("document loaded")

    let game = new GameManager()
})

let convertColor = (hex) => {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return {r: (c >> 16) & 255, g: (c >> 8) & 255, b: c & 255}
    }
    throw new Error('Bad Hex');
}

let processImage = (tileset) => {
    let image = tileset.image

    let color = convertColor(tileset.transparentcolor)
    let canvas = new OffscreenCanvas(image.width, image.height)
    let ctx = canvas.getContext("2d")
    ctx.drawImage(image, 0, 0)
    let imgdata = ctx.getImageData(0, 0, image.width, image.height)
    for (var i = 0; i < image.width * image.height * 4; i += 4) {
        if (imgdata.data[i] === color.r && imgdata.data[i + 1] === color.g && imgdata.data[i + 2] === color.b) {
            imgdata.data[i + 3] = 0;
        }
    }
    ctx.putImageData(imgdata, 0, 0);
    tileset.image = canvas.transferToImageBitmap();
    return tileset
}

export {processImage}










