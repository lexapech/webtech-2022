
ready = async () => {
    console.log("document loaded")

    let mapMan = new mapManager()
    mapMan.loadMap(()=>{
        let graphics = new GraphicsController()

        let pos = mapMan.getPlayerSpawnPos()
        console.log(mapMan)
        let playerManager = new playerController(pos.x,pos.y)
        graphics.renderList.push((x)=>mapMan.drawMap(x,{x: playerManager.playerX,y: playerManager.playerY}))
        graphics.renderList.push(()=>playerManager.movePlayer())
    })
}

class GraphicsController {
    constructor(ctx) {
        this.renderList=[]
        this.ctx = this.initCanvas()
        window.requestAnimationFrame((time) => this.draw(this.ctx, time))
    }

    initCanvas = () => {
        let canvas = document.querySelector("#canvas")
        canvas.width = window.innerWidth - 32
        canvas.height = window.innerHeight - 16
        if (canvas.getContext) {
            const ctx = canvas.getContext('2d')
            ctx.imageSmoothingEnabled = false;

            return ctx
        }

        return null;
    }

    draw = (ctx, time) => {
        for (let f of this.renderList){
            f(ctx)
        }
        //this.drawMap(ctx,{x:pox,y:100})
        window.requestAnimationFrame((time) => this.draw(ctx, time))
    }
}





class playerController {

    constructor(x,y) {
        this.playerX = x
        this.playerY = y
        this.playerVx = 0
        this.playerVy = 0
        this.prevtime=undefined
        window.addEventListener("keydown",(e)=>{
            if(e.key === "w" || e.key==="ArrowUp") {
                this.playerVy=-1;
            }
            else if(e.key === "s" || e.key==="ArrowDown") {
                this.playerVy=1;
            }
            else if(e.key === "a" || e.key==="ArrowLeft") {
                this.playerVx=-1;
            }
            else if(e.key === "d" || e.key==="ArrowRight") {
                this.playerVx=1;
            }
        })
        window.addEventListener("keyup",(e)=>{
            if(e.key === "w" || e.key==="ArrowUp") {
                this.playerVy=0;
            }
            else if(e.key === "s" || e.key==="ArrowDown") {
                this.playerVy=0;
            }
            else if(e.key === "a" || e.key==="ArrowLeft") {
                this.playerVx=0;
            }
            else if(e.key === "d" || e.key==="ArrowRight") {
                this.playerVx=0;
            }
        })
    }

    movePlayer = () => {
        this.playerX+=this.playerVx
        this.playerY+=this.playerVy
    }
}




class mapManager {

    constructor() {
        this.tilesets = []

    }

    loadMap = (callback) => {
        fetch("map1/map1.tmj")
            .then((response) => response.json())
            .then((map) => {
                this.mapObject = map
                this.loadTilesets(this.mapObject).then((ts) => {
                    this.tilesets = ts
                    //window.requestAnimationFrame((time)=>draw(this.canvasContext,time))
                    //this.drawMap(this.canvasContext,{x:100,y:100})
                    callback()
                })
            })
    }
//TODO: utils
    convertColor = (hex) => {
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

    processImage = (tileset) => {
        let image = tileset.image

        let color = this.convertColor(tileset.transparentcolor)
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


    loadTilesets = async (mapObject) => {
        let tilesets = []
        for (let tileset of mapObject.tilesets)
            tilesets[tilesets.length] = {
                firstgid: tileset.firstgid,
                data: this.processImage(await this.loadTileset(tileset.source))
            }
        tilesets.sort((a, b) => b.firstgid - a.firstgid)
        return tilesets
    }


    loadTileset = async (name) => {
        let response = await fetch(`map1/${name}`)
        let tileset = await response.json()

        tileset.image = (await createImageBitmap(await (await fetch(`map1/${tileset.image}`)).blob()))


        return tileset
    }




    getTileImageBox = (id, tileset) => {

        let x = id % tileset.columns
        let y = Math.floor(id / tileset.columns)
        x = tileset.margin + x * (tileset.tilewidth + tileset.spacing)
        y = tileset.margin + y * (tileset.tileheight + tileset.spacing)
        return {x: x, y: y, width: tileset.tilewidth, height: tileset.tileheight}
    }

    getPlayerSpawnPos = () => {
        let object = this.mapObject.layers.find((l)=>l.name==="player").objects[0]
        return {x:object.x, y:object.y}
    }

    drawMap = (ctx,view) => {
        let viewx = view.x
        let viewy = view.y
        let scale = 4.0
        ctx.fillStyle = '#b0906b'
        ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        for (let layer of this.mapObject.layers) {
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
                        let tileset = this.tilesets.find((t) => t.firstgid <= (tileid & 0xFFFF))
                        let image = this.getTileImageBox((tileid & 0xFFFF) - tileset.firstgid, tileset.data)
                        ctx.drawImage(tileset.data.image,
                            image.x, image.y,
                            image.width, image.height,
                            (-viewx + offsetx + x * this.mapObject.tilewidth) * scale + ctx.canvas.clientWidth / 2,
                            (-viewy + offsety + (y - (image.height / this.mapObject.tileheight - 1)) * this.mapObject.tileheight) * scale + ctx.canvas.clientHeight / 2,
                            image.width * scale, image.height * scale)
                    }
                }
            } else {

                let offsetx = 0
                let offsety = 0
                if (layer.offsetx) offsetx = layer.offsetx
                if (layer.offsety) offsety = layer.offsety
                for (let object of layer.objects) {
                    if (layer.name==="player") {
                        object.x=viewx-object.width/2
                        object.y=viewy+object.height/2
                    }
                    let gid = object.gid
                    let tileset = this.tilesets.find((t) => t.firstgid <= gid)
                    let image = this.getTileImageBox(gid - tileset.firstgid, tileset.data)
                    ctx.drawImage(tileset.data.image,
                        image.x, image.y,
                        image.width, image.height,
                        (-viewx + offsetx + object.x) * scale + ctx.canvas.clientWidth / 2,
                        (-viewy + offsety + object.y - object.height) * scale + ctx.canvas.clientHeight / 2,
                        image.width * scale, image.height * scale)
                }
            }
        }

    }



}


