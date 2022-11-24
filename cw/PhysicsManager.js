export default class PhysicsManager {
    constructor(entity,walls,entities) {
        //console.log("entity",entity)
        this.entity = entity
        this.walls=walls
        this.getEntities=entities

    }

    canStep(entity,dir) {
        let nextx = entity.x
        let nexty = entity.y

        if(dir)
            nexty+=entity.vy
        else
            nextx+=entity.vx

        let fix  =0
        if(entity.class==="bullet") {
            fix=-8
        }

        let checks=[]
        checks.push({x: entity.w / 2 + nextx - entity.w* entity.collision.width / 2, y: -entity.h / 2 + nexty - entity.h*entity.collision.height/2 })
        checks.push({x: entity.w / 2 + nextx + entity.w*entity.collision.width / 2, y: -entity.h / 2 + nexty  - entity.h*entity.collision.height/2 })
        checks.push({x: entity.w / 2 + nextx - entity.w*entity.collision.width / 2, y: -entity.h / 2 + nexty   + entity.h*entity.collision.height/2})
        checks.push({x: entity.w / 2 + nextx + entity.w*entity.collision.width / 2, y: -entity.h / 2 + nexty  + entity.h*entity.collision.height/2})
        for(let check of checks) {
            let x = Math.floor(check.x/this.walls.width)
            let y = Math.floor((check.y+fix)/this.walls.height)
            if(this.walls.tiles[x+this.walls.xcount*y]) {
                return false

            }
        }
        return true;
    }

    checkCollisions() {
        let checkEnt = this.getEntities().filter(x=>(x.class==="bullet" || x.class==="bonus"  || x.class==="enemy" || x.class==="player"|| x.class==="portal") && this.entity !== x)
        let collisions=[]
        for (let col of checkEnt) {
            let Acenterx=this.entity.x+this.entity.vx+this.entity.w/2
            let Acentery=this.entity.y+this.entity.vy-this.entity.h/2

            let maxAx= Acenterx+this.entity.w/2*this.entity.collision.width
            let minAx= Acenterx-this.entity.w/2*this.entity.collision.width

            let maxAy= Acentery+this.entity.h/2*this.entity.collision.height
            let minAy= Acentery-this.entity.h/2*this.entity.collision.height

            let Bcenterx=col.x+col.vx+col.w/2
            let Bcentery=col.y+col.vy-col.h/2

            let maxBx= Bcenterx+col.w/2*col.collision.width
            let minBx= Bcenterx-col.w/2*col.collision.width

            let maxBy= Bcentery+col.h/2*col.collision.height
            let minBy= Bcentery-col.h/2*col.collision.height
            if(maxAx < minBx ||
                minAx > maxBx ||
                minAy > maxBy ||
                maxAy < minBy ) {}
            else  {
                   collisions.push({first:this.entity,second:col})
            }
        }
        return collisions
    }


    update() {
        if(this.entity.class==="bullet") {
            this.entity.lifetime--
            let collisions = this.checkCollisions()
            if(collisions.length>0 && collisions[0].second.class!=="player"&& collisions[0].second.class!=="bullet"){
                this.entity.lifetime=0;

                if(collisions[0].second.onHit) {
                    collisions[0].second.onHit(collisions[0].first)
                }
            }
            if(this.canStep(this.entity,false) && this.canStep(this.entity,true)) {
                this.entity.x+=this.entity.vx
                this.entity.y+=this.entity.vy
            }
            else {
                this.entity.lifetime=0
            }

        }
        else {
            if(this.entity.damageResistance && this.entity.damageResistance>0) this.entity.damageResistance--;
            if(this.entity.class==="enemy") {
                let dx= (this.entity.target.x+this.entity.target.image.width/2 - this.entity.x-this.entity.image.width/2)
                let dy = (this.entity.target.y-this.entity.target.image.height/2 - this.entity.y+this.entity.image.height/2)
                let len = Math.sqrt((Math.pow(dx, 2) +
                    Math.pow(dy, 2)))
                let vx = dx / len
                let vy = dy / len
                let steps = Math.ceil(len/16)
                let step = len / steps
                let canSee=true
                for(let i=0;i<steps;i++) {
                    let x =this.entity.x+ step*i*vx
                    let y =this.entity.y+ step*i*vy
                    let tmp = Object.assign({},this.entity)
                    tmp.x=x
                    tmp.y=y
                    tmp.vx=0
                    tmp.w=0
                    tmp.h=0
                    tmp.vy=0
                    if (!this.canStep(tmp,false)) {
                        canSee=false
                        break
                    }
                }
                if(canSee&& len<this.entity.radius && len>10) {
                    this.entity.vx=vx
                    this.entity.vy=vy
                }
                else {
                    this.entity.vx=0
                    this.entity.vy=0
                }

            }
            if(this.entity.shot!==undefined && this.entity.shot>0)
            {
                if(this.entity.shot===1) {
                    console.log("shot")
                }
                this.entity.shot-=0.1
                if( Math.abs(this.entity.shot)<0.20) this.entity.shot=0
            }
            let collisions = this.checkCollisions()
               let movex=true
               let movey=true

            for (let col of collisions) {
                if(col.first.class==="player" && (col.first.damageResistance===0||col.first.damageResistance===undefined)) {
                    if(col.first.onHit) {
                        col.first.onHit(col.second)
                        //collisions[0].second.onHit(collisions[0].first)
                    }
                    //col.first.health--;
                    //col.first.damageResistance=60
                }
                let coldir = {x:col.second.x-col.first.x,
                        y:col.second.y-col.first.y}
                if(Math.abs(coldir.x)<Math.abs(coldir.y)) coldir.x=0
                else coldir.y=0
                let dot = this.entity.vx*coldir.x+this.entity.vy*coldir.y
                if(dot>0) {movex=false;movey=false}
            }

            if (this.canStep(this.entity, false) && movex) {
                this.entity.x += this.entity.vx

            }
            if (this.canStep(this.entity, true) && movey) {
                this.entity.y += this.entity.vy

            }

        }

    }
}
