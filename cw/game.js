
let mapObject=null
let canvasContext=null
let tilesets=[]

let ready = () =>{
    console.log("document loaded")

    window.addEventListener("resize",()=>{
        console.log("document resized")
        canvasContext = initCanvas()
    })

    loadMap()
}

let  loadMap = () =>{
    fetch("map1/map1.tmj")
        .then((response)=>response.json())
        .then((map)=> {
            mapObject=map
            canvasContext = initCanvas()
            loadTilesets(mapObject).then((ts)=>{
                tilesets=ts
                drawMap(canvasContext)
            })
        })
}
//TODO: utils
let convertColor = (hex) => {
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length === 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return {r:(c>>16)&255,g: (c>>8)&255,b: c&255}
    }
    throw new Error('Bad Hex');
}

let processImage = (tileset) => {
    let image = tileset.image

    let color = convertColor(tileset.transparentcolor)
    let canvas = new OffscreenCanvas(image.width,image.height)
    let ctx = canvas.getContext("2d")
    ctx.drawImage(image,0,0)
    let imgdata = ctx.getImageData(0,0,image.width,image.height)
    for (var i = 0; i < image.width*image.height * 4; i += 4) {
        if(imgdata.data[i]===color.r && imgdata.data[i+1]===color.g &&imgdata.data[i+2]===color.b) {
            imgdata.data[i+3] = 0;
        }
    }
    ctx.putImageData(imgdata, 0, 0);
    tileset.image = canvas.transferToImageBitmap();
    return tileset
}


let loadTilesets =async (mapObject) => {
    let tilesets=[]
    for (let tileset of mapObject.tilesets)
        tilesets[tilesets.length]={firstgid: tileset.firstgid, data:processImage( await loadTileset(tileset.source))}
    tilesets.sort((a,b)=>b.firstgid-a.firstgid)
    return tilesets
}


let loadTileset = async (name)=> {
    let response = await fetch(`map1/${name}`)
    let tileset = await response.json()

    tileset.image = (await createImageBitmap(await(await fetch(`map1/${tileset.image}`)).blob()))


    return tileset
}


let initCanvas = () => {
    let canvas = document.querySelector("#canvas")
    canvas.width = window.innerWidth-32
    canvas.height = window.innerHeight-16
    if (canvas.getContext){
        const ctx = canvas.getContext('2d')
        ctx.imageSmoothingEnabled = false;
        //window.requestAnimationFrame((time)=>draw(ctx,time))
        return ctx
    }

    return null;
}

let getTileImageBox = (id, tileset) => {

    let x = id % tileset.columns
    let y = Math.floor( id / tileset.columns)
    x = tileset.margin + x * (tileset.tilewidth+tileset.spacing)
    y = tileset.margin + y * (tileset.tileheight+tileset.spacing)
    return {x:x,y:y,width:tileset.tilewidth,height:tileset.tileheight}
}


let drawMap = (ctx) => {
    let viewx=300
    let viewy=300
    let scale=2.0
    ctx.fillStyle = '#b0906b'
    ctx.fillRect(0 ,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight);
    for (let layer of mapObject.layers) {
        //if (layer.name === "Слой тайлов 2") continue;
        if (layer.type === "tilelayer") {
            let offsetx = 0
            let offsety = 0
            if (layer.offsetx) offsetx = layer.offsetx
            if (layer.offsety) offsety = layer.offsety
            for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                    let tileid = layer.data[y * layer.height + x]
                    if (tileid === 0) continue
                    let tileset = tilesets.find((t) => t.firstgid <= (tileid & 0xFFFF))
                    let image = getTileImageBox((tileid & 0xFFFF) - tileset.firstgid, tileset.data)
                    ctx.drawImage(tileset.data.image,
                        image.x, image.y,
                        image.width, image.height,
                        (-viewx+offsetx + x * mapObject.tilewidth) * scale+ctx.canvas.clientWidth/2,
                        (-viewy+offsety + (y - (image.height / mapObject.tileheight - 1)) * mapObject.tileheight) * scale+ctx.canvas.clientHeight/2,
                        image.width * scale, image.height * scale)
                }
            }
        }
        else {
            let offsetx = 0
            let offsety = 0
            if (layer.offsetx) offsetx = layer.offsetx
            if (layer.offsety) offsety = layer.offsety
            for (let object of layer.objects) {
                let gid = object.gid
                let tileset = tilesets.find((t) => t.firstgid <= gid)
                let image = getTileImageBox(gid - tileset.firstgid, tileset.data)
                ctx.drawImage(tileset.data.image,
                    image.x, image.y,
                    image.width, image.height,
                    (-viewx+offsetx + object.x) * scale+ctx.canvas.clientWidth/2,
                    (-viewy+offsety + object.y - object.height) * scale+ctx.canvas.clientHeight/2,
                    image.width * scale, image.height * scale)
                }
            }
    }

}


let draw = (ctx,time) => {
    let pox=Math.floor(time/5) % ctx.canvas.clientWidth
    ctx.clearRect(0 ,0,ctx.canvas.clientWidth,ctx.canvas.clientHeight)
    ctx.fillStyle = '#f00'
    ctx.fillRect(pox, 10, 50, 50);
    window.requestAnimationFrame((time)=>draw(ctx,time))
}