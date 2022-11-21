import {processImage} from "./game.js";


export default class MapManager {

    constructor(ctx,map) {
        this.ctx=ctx
        this.tilesets = []
        this.map=map
    }

    loadMap = (callback) => {

        fetch(`${this.map}/${this.map}.tmj`)
            .then((response) => response.json())
            .then((map) => {
                this.mapObject = map
                this.loadTilesets(this.mapObject).then((ts) => {
                    this.tilesets = ts
                    callback()
                })
            })
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
                        w:obj.width,
                        h:obj.height,
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
                data: processImage(await this.loadTileset(tileset.source))
            }
        tilesets.sort((a, b) => b.firstgid - a.firstgid)
        return tilesets
    }


    loadTileset = async (name) => {
        let response = await fetch(`${this.map}/${name}`)
        let tileset = await response.json()

        tileset.image = (await createImageBitmap(await (await fetch(`${this.map}/${tileset.image}`)).blob()))


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

    drawMap = (ctx,view,entityDraw) => {

        ctx.fillStyle = '#b0906b'
        ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        for (let layer of this.mapObject.layers) {
            if (layer.type === "objectgroup") {
                entityDraw(layer.name)
            }
            else {
                this.drawLayer(layer, ctx, view)
            }
        }

    }



}