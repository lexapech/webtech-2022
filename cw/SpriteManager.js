import {processImage} from "./game.js";

export default class SpriteManager {


    constructor(ctx) {
        this.ctx=ctx

    }

    loadAtlas(cb) {
        fetch("sprites/atlas.json")
            .then((response) => response.json())
            .then((atlas) => {
                this.atlas=atlas
                fetch("sprites/atlas.png")
                    .then((response) => response.blob())
                    .then((image) => {
                        createImageBitmap(image).then(x=>{
                            this.image=processImage({image:x, transparentcolor:"#7F92FF"}).image
                            cb()
                        })

                    })
            })
    }

    getEntityImage(entity,state) {
        let name = entity.name
        if(entity.animFrame===undefined) {
            entity.animFrame=0
        }
        if(entity.frameCounter===undefined) {
            entity.frameCounter=0
        }
        if(entity.lastDir===undefined) {
            entity.lastDir = 1
        }
        if(state!==entity.lastState) {
            entity.animFrame=0
            entity.lastState=state
        }

        else {
            entity.frameCounter++
            if(entity.frameCounter===60/5) {
                entity.frameCounter=0
                entity.animFrame++
            }

            if(this.atlas.frames[`${name}-${state}-${entity.animFrame}.png`]===undefined) entity.animFrame=0
        }
        let filename=`${name}-${state}-${entity.animFrame}.png`
        //console.log(filename)
        let t = this.atlas.frames[filename]
        let res = t.frame
        res.pivot={x:Math.floor( t.pivot.x*t.frame.w),y:Math.floor(t.pivot.y*t.frame.h)}
        return res
    }

    drawGun(player,view,dir) {
        let entity = player.gun

        let angle = Math.atan2(player.aimPoint.y-player.y,player.aimPoint.x-player.x)

        entity.x=player.x+player.image.width/2
        entity.y=player.y
        this.ctx.save()

        this.ctx.translate((-view.x + entity.offsetx + entity.x+dir*player.image.width*0.25) * view.zoom + this.ctx.canvas.clientWidth / 2,
            (-view.y + entity.offsety + entity.y-player.image.height*0.25) * view.zoom + this.ctx.canvas.clientHeight / 2);
        this.ctx.rotate(angle)
        this.ctx.scale(0.75,0.75)
        if(player.aimPoint.x-player.x<0) this.ctx.scale(1,-1)
        this.ctx.translate(-entity.image.width*0.25* view.zoom,-entity.image.height/2* view.zoom);
        this.ctx.drawImage(entity.image.data,
            entity.image.x, entity.image.y,
            entity.image.width, entity.image.height,
            0,
            0,
            entity.image.width * view.zoom, entity.image.height * view.zoom)
        this.ctx.restore()
    }
    drawFire(player,view,dir) {
        let entity = player.bullet

        let angle = Math.atan2(player.aimPoint.y-player.y,player.aimPoint.x-player.x)

        entity.x=player.x+player.image.width/2
        entity.y=player.y
        this.ctx.save()

        this.ctx.translate((-view.x + entity.offsetx + entity.x+dir*player.image.width*0.25) * view.zoom + this.ctx.canvas.clientWidth / 2,
            (-view.y + entity.offsety + entity.y-player.image.height*0.25) * view.zoom + this.ctx.canvas.clientHeight / 2);

        this.ctx.rotate(angle)

        this.ctx.translate(+player.gun.image.width/2 * view.zoom,0);
        this.ctx.save()
        this.ctx.scale(player.shot,player.shot)
        this.ctx.translate(-entity.image.width/2 * view.zoom,-entity.image.height/2* view.zoom);
        this.ctx.drawImage(entity.image.data,
            entity.image.x, entity.image.y,
            entity.image.width, entity.image.height,
            0,
            0,
            entity.image.width * view.zoom, entity.image.height * view.zoom)
        this.ctx.restore()
        this.ctx.restore()
    }

    draw(entity,view){
        if(entity.class!=="" && entity.class!=="bullet" && entity.name!=="hatch" && entity.class!=="bonus") {
            let image = this.getEntityImage(entity,( entity.vx!==0 || entity.vy!==0)?"walk":"idle")
            /*this.ctx.strokeRect((-view.x + entity.offsetx + entity.x) * view.zoom + this.ctx.canvas.clientWidth / 2,
                (-view.y + entity.offsety + entity.y - image.h) * view.zoom + this.ctx.canvas.clientHeight / 2,
                image.w * view.zoom,
                image.h * view.zoom);*/
            let dir = entity.lastDir
            this.ctx.save()

            this.ctx.translate((-view.x + entity.offsetx + entity.x + (dir===-1?image.pivot.x:-image.pivot.x)  + entity.image.width/2) * view.zoom + this.ctx.canvas.clientWidth / 2,
                (-view.y + entity.offsety + entity.y - image.h) * view.zoom + this.ctx.canvas.clientHeight / 2);
            this.ctx.scale(dir, 1);

            this.ctx.drawImage(this.image,
                image.x, image.y,
                image.w, image.h,
                0,
                0,
                image.w * view.zoom, image.h * view.zoom)
            this.ctx.restore()
            if(entity.gun!==undefined) {
                this.drawGun(entity,view,dir)
                this.drawFire(entity,view,dir)
            }
            if (entity.vx!==0 && entity.vx!==undefined)
                entity.lastDir=entity.vx>0?1:-1
        }
        else {
            this.ctx.save()

            this.ctx.translate((-view.x + entity.offsetx + entity.x) * view.zoom + this.ctx.canvas.clientWidth / 2,
                (-view.y + entity.offsety + entity.y - entity.image.height) * view.zoom + this.ctx.canvas.clientHeight / 2);
            if(entity.name=== "bullet1")
                this.ctx.scale(0.5, 0.5);

            this.ctx.drawImage(entity.image.data,
                entity.image.x, entity.image.y,
                entity.image.width, entity.image.height,
                0,
                0,
                entity.image.width * view.zoom, entity.image.height * view.zoom)
            this.ctx.restore()
        }

    }

}