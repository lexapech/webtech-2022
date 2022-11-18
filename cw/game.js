
ready = async () => {
    console.log("document loaded")

    let game = new GameManager()
}

class GameManager {
    constructor() {
        this.ctx=this.initCanvas()
        this.mapManager = new MapManager(this.ctx)
        this.mapManager.loadMap(()=>this.afterMapLoaded(this))
        this.view={x:200,y:200,zoom:4}
        this.eventManager = new EventManager(this.setPlayerSpeed.bind(this))
    }

    update() {
        for(let entity of this.entities)
            entity.update()
        this.view.x=this.player.x
        this.view.y=this.player.y
        this.mapManager.drawMap(this.ctx,this.view)
        this.drawEntities()
    }

    drawEntities() {
        this.entities=this.entities.sort((a,b)=>a.y-b.y)
        for (let entity of this.entities) {
            entity.sprite.draw(this.view)
        }
    }



    afterMapLoaded(game){
        this.wallTiles = this.mapManager.getWalls()
        this.entities =  this.mapManager.getObjects().map(x=>x)

        console.log(this.entities)

        console.log(this.entities)
        this.entities = this.entities.map((x)=>{
            x.extend = (properties) =>{
                for(let prop in properties) {
                    x[prop] = properties[prop]
                }
                return x
            }
            return x
        })
        this.entities = this.entities.map(x=>x.extend({update: ()=>{},sprite:new SpriteManager(this.ctx,x)}))

        let player = this.entities.find(x=>x.name==="player")
        this.initPlayer(player)
        let update = this.update.bind(game)
        game.mainTimer = setInterval(update,17)
    }

    initPlayer(entity) {
        this.player = entity;
        this.player.vx=0
        this.player.vy=0
        this.player.physics =new PhysicsManager(this.player,this.wallTiles)
        this.player.update=this.player.physics.update.bind(this.player.physics)
    }
    setPlayerSpeed(x,y) {
        if(x!==undefined)
            this.player.vx=x
        if(y!==undefined)
            this.player.vy=y
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


}
class EventManager {
    constructor(movePlayer) {
        this.move = movePlayer
        console.log(this.move)
        window.addEventListener("keydown",this.onKeyDown.bind(this))
        window.addEventListener("keyup",this.onKeyUp.bind(this))
        this.left=0
        this.right=0
        this.up=0
        this.down=0;
    }
    onKeyDown(e){
        if(e.key === "w" || e.key==="ArrowUp") {
            this.up=1;

        }
        else if(e.key === "s" || e.key==="ArrowDown") {
            this.down=1;

        }
        else if(e.key === "a" || e.key==="ArrowLeft") {
            this.left=1;

        }
        else if(e.key === "d" || e.key==="ArrowRight") {
            this.right=1;

        }
        this.move(this.right-this.left,this.down-this.up);
    }
    onKeyUp(e) {
        if(e.key === "w" || e.key==="ArrowUp") {
            this.up=0;

        }
        else if(e.key === "s" || e.key==="ArrowDown") {
            this.down=0;

        }
        else if(e.key === "a" || e.key==="ArrowLeft") {
            this.left=0;

        }
        else if(e.key === "d" || e.key==="ArrowRight") {
            this.right=0;

        }
        this.move(this.right-this.left,this.down-this.up);
    }

}
class SpriteManager {
    constructor(ctx,entity) {
        this.ctx=ctx
        this.entity = entity
    }
    draw(view){
        this.ctx.strokeRect((-view.x + this.entity.offsetx + this.entity.x) * view.zoom + this.ctx.canvas.clientWidth / 2,
        (-view.y + this.entity.offsety + this.entity.y - this.entity.image.height) * view.zoom + this.ctx.canvas.clientHeight / 2,
            this.entity.image.width * view.zoom,
            this.entity.image.height * view.zoom);
        let dir = (this.entity.vx>=0 || this.entity.vx===undefined)?1:-1

        this.ctx.save()
        this.ctx.translate((-view.x + this.entity.offsetx + this.entity.x + (dir===-1?this.entity.image.width:0)) * view.zoom + this.ctx.canvas.clientWidth / 2,
            (-view.y + this.entity.offsety + this.entity.y - this.entity.image.height) * view.zoom + this.ctx.canvas.clientHeight / 2);
        this.ctx.scale(dir, 1);
        this.ctx.drawImage(this.entity.image.data,
            this.entity.image.x, this.entity.image.y,
            this.entity.image.width, this.entity.image.height,
            0,
            0,
            this.entity.image.width * view.zoom, this.entity.image.height * view.zoom)
        this.ctx.restore()
    }

}
class AudioManager {

}
class PhysicsManager {
    constructor(entity,walls) {
        console.log("entity",entity)
        this.entity = entity
        this.walls=walls
        this.collision={width:1.0,height:0.1}
    }

    canStep(entity,dir) {
        let nextx = entity.x
        let nexty = entity.y

        if(dir)
            nexty+=entity.vy
        else
            nextx+=entity.vx



        let checks=[]
        checks.push({x: entity.image.width / 2 + nextx - entity.image.width* this.collision.width / 2, y: nexty - entity.image.height*this.collision.height })
        checks.push({x: entity.image.width / 2 + nextx + entity.image.width*this.collision.width / 2, y: nexty - entity.image.height*this.collision.height })
        checks.push({x: entity.image.width / 2 + nextx - entity.image.width*this.collision.width / 2, y: nexty})
        checks.push({x: entity.image.width / 2 + nextx + entity.image.width*this.collision.width / 2, y: nexty})
        for(let check of checks) {
            let x = Math.floor(check.x/this.walls.width)
            let y = Math.floor(check.y/this.walls.height)
            if(this.walls.tiles[x+this.walls.xcount*y]) {
                return false

            }
        }
        return true;
    }

    update() {
        if(this.canStep(this.entity,false)) {
            this.entity.x+=this.entity.vx

        }
        if(this.canStep(this.entity,true)) {
            this.entity.y+=this.entity.vy

        }

    }
}



class MapManager {

    constructor(ctx) {
        this.ctx=ctx
        this.tilesets = []

    }

    loadMap = (callback) => {

        fetch("map1/map1.tmj")
            .then((response) => response.json())
            .then((map) => {
                this.mapObject = map
                this.loadTilesets(this.mapObject).then((ts) => {
                    this.tilesets = ts
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

    getObjects(){
        let entities = []
        for (let layer of this.mapObject.layers) {
            if (layer.type === "objectgroup") {
                let offsetx = 0
                let offsety = 0
                if (layer.offsetx) offsetx = layer.offsetx
                if (layer.offsety) offsety = layer.offsety
                for (let obj of layer.objects) {
                    let gid = obj.gid
                    let tileset = this.tilesets.find((t) => t.firstgid <= gid)
                    let image = this.getTileImageBox(gid - tileset.firstgid, tileset.data)
                    entities.push({
                        x:obj.x,
                        y:obj.y,
                        class: obj.class,
                        name: obj.name,
                        id: obj.id,
                        visible: obj.visible,
                        rotation: obj.rotation,
                        image: {x:image.x,y:image.y,width:image.width,height:image.height,data:tileset.data.image},
                        layer: layer.name,
                        offsetx: offsetx,
                        offsety: offsety
                    })


                }
            }
        }
        return entities
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

    getTile(x,y,layer) {
        let tile={}

        tile.id = layer.data[y * layer.height + x]
        if (tile.id === 0) return tile;
        tile.tileset = this.tilesets.find((t) => t.firstgid <= (tile.id & 0xFFFF))
        tile.image = this.getTileImageBox((tile.id & 0xFFFF) - tile.tileset.firstgid, tile.tileset.data)
        return tile
    }

    isVisible(x,y,width,height,ctx,view) {
        return !((x - view.x + width) * view.zoom < -this.ctx.canvas.clientWidth / 2 ||
            (y - view.y + height) * view.zoom < -this.ctx.canvas.clientHeight / 2 ||
            (x - view.x) * view.zoom > this.ctx.canvas.clientWidth / 2 ||
            (y - view.y) * view.zoom > this.ctx.canvas.clientHeight / 2);

    }

    getWalls(){
        let tiles=[]
        let layer = this.mapObject.layers.find(layer=>layer.type === "tilelayer" && layer.name==="walls")
        if (!layer) return tiles
        for (let y = 0; y < layer.height; y++) {
            for (let x = 0; x < layer.width; x++) {
                let tile = this.getTile(x, y,layer)
                if (tile.id===0) {tiles[x+layer.width*y]=false; continue}
                let tilex = x * this.mapObject.tilewidth
                let tiley = (y - (tile.image.height / this.mapObject.tileheight - 1)) * this.mapObject.tileheight
                tiles[x+layer.width*y] = true
                //tiles.push({x: tilex, y: tiley,width:this.mapObject.tilewidth,height:this.mapObject.tileheight})
            }
        }
        return {width: this.mapObject.tilewidth, height: this.mapObject.tileheight,xcount:layer.width, tiles: tiles}
    }

    drawLayer(layer,ctx,view) {
        if (layer.type === "tilelayer") {
            let offsetx = 0
            let offsety = 0
            if (layer.offsetx) offsetx = layer.offsetx
            if (layer.offsety) offsety = layer.offsety
            for (let y = 0; y < layer.height; y++) {
                for (let x = 0; x < layer.width; x++) {
                    let tile = this.getTile(x, y,layer)
                    if (tile.id===0) continue
                    let tilex = offsetx + x * this.mapObject.tilewidth
                    let tiley = offsety + (y - (tile.image.height / this.mapObject.tileheight - 1)) * this.mapObject.tileheight
                    if(!this.isVisible(tilex,tiley,tile.image.width,tile.image.height,this.ctx,view)) continue
                    ctx.drawImage(tile.tileset.data.image,
                        tile.image.x, tile.image.y,
                        tile.image.width, tile.image.height,
                        (-view.x + tilex) * view.zoom + this.ctx.canvas.clientWidth / 2,
                        (-view.y + tiley) * view.zoom + this.ctx.canvas.clientHeight / 2,
                        tile.image.width * view.zoom, tile.image.height * view.zoom)

                }
            }
        }
    }

    drawMap = (ctx,view) => {

        ctx.fillStyle = '#b0906b'
        ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        for (let layer of this.mapObject.layers) {
            //if (layer.name === "Слой тайлов 2") continue;
            this.drawLayer(layer,ctx,view)
        }

    }



}


