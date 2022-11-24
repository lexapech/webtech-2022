import MapManager from "./MapManager.js"
import SpriteManager from "./SpriteManager.js";
import EventManager from "./EventManager.js";
import PhysicsManager from "./PhysicsManager.js";
import AudioManager from "./AudioManager.js"

export default class GameManager {
    constructor() {
        fetch("sprites/heart.png").then((res=>res.blob())).then((data=>{
           createImageBitmap(data).then((x)=>{
               this.heartImage=x
            })
            this.ctx=this.initCanvas()
            this.screenAim=undefined
            this.maps=["map1","map2"]
            this.currentMapIndex=0
            this.view={x:200,y:200,zoom:4}
            this.spriteManager = new SpriteManager(this.ctx)
            this.audioManager = new AudioManager()
            this.audioManager.loadArray(["shot.mp3","kill.mp3","hit.mp3","portal.mp3","steps.mp3"])
            this.eventManager = new EventManager(this.setPlayerSpeed.bind(this),this.aim.bind(this),this.shot.bind(this))
            this.loadMap(this.maps[this.currentMapIndex])
        }))
    }

    loadMap(map) {
        this.mapManager = new MapManager(this.ctx,map)
        this.mapManager.loadMap(()=>{
            this.spriteManager.loadAtlas(this.afterMapLoaded.bind(this))
        })
    }

    update() {
        if(this.player) {
        this.entities = this.entities.filter(x=>{return( x.lifetime>0 || x.lifetime===undefined) && (x.health>0 || x.health===undefined)})

            this.player.aimPoint = {
                x: (this.screenAim.x - this.ctx.canvas.clientWidth / 2) / this.view.zoom + this.view.x,
                y: (this.screenAim.y - this.ctx.canvas.clientHeight / 2) / this.view.zoom + this.view.y
            }
            if(this.player.vx!==0 || this.player.vy!==0) {
                if(this.player.soundTimer===0 || this.player.soundTimer===undefined) {
                    this.audioManager.playSound("steps.mp3", 0.3, false)
                    this.player.soundTimer=18
                }
                this.player.soundTimer--
            }


        for(let entity of this.entities) {
            entity.update()
        }
            if(!this.player) return
        this.view.x=this.player.x
        this.view.y=this.player.y
        this.mapManager.drawMap(this.ctx,this.view,this.drawEntities.bind(this))

        for(let i=0;i<this.player.health;i++)
            this.ctx.drawImage(this.heartImage,0,0,13,12,10+(13*4+10)*i,10,13*4,12*4)
        this.ctx.font = '48px Roboto sans-serif';
        this.ctx.fillStyle="black"
        this.ctx.fillText(`Score: ${this.player.score}`, 10, 100);
        }
    }

    drawEntities(layer) {

        this.entities=this.entities.sort((a,b) => a.y - b.y)
        for (let entity of this.entities) {
            this.spriteManager.draw(entity,this.view)
            //entity.sprite.draw(this.view)
        }
    }



    afterMapLoaded(){
        if(this.currentMapIndex===0)
            this.startTime=Date.now()

        this.wallTiles = this.mapManager.getWalls()
        this.entities =  this.mapManager.getObjects().map(x=>x)

        this.entities = this.entities.map((x)=>{
            x.extend = (properties) =>{
                for(let prop in properties) {
                    x[prop] = properties[prop]
                }
                return x
            }
            return x
        })
        this.entities = this.entities.map(x=>x.extend({update: ()=>{},vx:0,vy:0}))
        let portal = this.entities.find(x=>x.class==="portal")
        portal.collision={width: portal.name==="hatch"?0.2:0.9, height: portal.name==="hatch"?0.2:0.4}
        let player = this.entities.find(x=>x.class==="player")
        let gun = this.entities.find(x=>x.class==="gun")
        let bullet = this.entities.find(x=>x.class==="bullet")
        let bonus = this.entities.filter(x=>x.class==="bonus")
        for(let bn of bonus) {
            bn.collision={width:1.0,height:1.0}
        }
        this.entities = this.entities.filter(x=>{ return x.class!=="gun" && x.class!=="bullet"})
        this.initPlayer(player,gun,bullet)
        for(let enemy of this.entities.filter(x=>{ return x.class==="enemy"}))
            this.initEnemy(enemy)

        let update = this.update.bind(this)
        this.mainTimer = setInterval(update,17)
    }
    initEnemy(entity) {
        entity.vx=0
        entity.vy=0
        //entity.health=10
        //entity.collision={width:0.5,height:0.5}
        entity.collision={width:entity.collision_size,height:entity.collision_size}
        entity.target  = this.player
        entity.onHit = (hit)=>{

            entity.health--
            this.player.score++
            if(entity.health===0) {
                this.audioManager.playSound("kill.mp3",0.5,false)
                this.player.score+=5
            }
        }
        entity.physics =new PhysicsManager(entity,this.wallTiles,()=>this.entities)
        entity.update=entity.physics.update.bind(entity.physics)
    }

    onWin(){
        console.log("level passed")

        if(this.currentMapIndex<this.maps.length-1) {
            this.entities=[]
            this.loadMap(this.maps[++this.currentMapIndex])
        }
        else {
            let rec = localStorage["nt.records"]
            if(rec) {
                try {
                    rec = JSON.parse(rec)
                }
                catch (e) {
                    rec=[]
                }
            }
            else
            {
                rec=[]
            }
            let time =new Date( Date.now()-this.startTime)
            rec.push({playerName: localStorage["nt.username"], playerScore: this.player.score, time: time})
            rec=rec.sort((a,b)=>b.playerScore-a.playerScore)
            rec=rec.filter((v,i) => i < 10)
                localStorage["nt.records"]=JSON.stringify(rec)
            console.log("win")
            location.href="records.html"
        }
    }
    onGameOver(){
        this.audioManager.playSound("kill.mp3",0.5,false)
        console.log("game over")
        this.player=undefined
        document.querySelector("#retry-container").style.display="flex"

    }

    initPlayer(entity, gun,bullet) {
        let health = 5
        let score = 0
        if(this.player) {
            //
            score = this.player.score
        }
        this.player = entity;
        this.player.vx=0
        this.player.vy=0
        this.player.shot=0
        this.player.health = health
        this.player.score = score
        this.player.collision={width:1.0,height:0.8}
        this.player.gun = gun
        this.player.bullet = bullet
        this.player.gun.name=""
        this.player.onHit = (hit)=>{
            if(hit.class==="enemy") {

                this.player.health--
                this.player.damageResistance = 60;
                this.player.score -= 5
                if (this.player.health === 0) {

                    clearInterval(this.mainTimer)
                    this.onGameOver()
                }
                else {
                    this.audioManager.playSound("hit.mp3",0.5,false)
                }
            }
            else if(hit.class==="portal"){
                this.audioManager.playSound("portal.mp3",0.5,false)
                clearInterval(this.mainTimer)
                this.onWin()
            }
            else if (hit.class==="bonus") {
                this.entities=this.entities.filter(x=>x!==hit)
                this.audioManager.playSound("portal.mp3",0.5,false)
                this.player.health++
            }
        }
        this.player.physics =new PhysicsManager(this.player,this.wallTiles,()=>this.entities)
        this.player.update=this.player.physics.update.bind(this.player.physics)
    }
    setPlayerSpeed(x,y) {
        if(x!==undefined)
            this.player.vx=x
        if(y!==undefined)
            this.player.vy=y
    }
    aim(point) {
        this.screenAim=point

    }

    shot() {
        if(!this.player) return
        this.audioManager.playSound("shot.mp3",0.3,false)
        this.player.shot=1
        let bullet  =Object.assign( {},this.player.bullet)
        let len = Math.sqrt((Math.pow((this.player.aimPoint.x-this.player.x),2)+Math.pow((this.player.aimPoint.y-this.player.y),2)))
        bullet.x= this.player.x+(this.player.aimPoint.x-this.player.x)/len*10+(this.player.lastDir===1? this.player.image.width/2:0)
        bullet.y= this.player.y+(this.player.aimPoint.y-this.player.y)/len*10+this.player.image.height/2

        bullet.vx=(this.player.aimPoint.x-this.player.x)/len*3
        bullet.vy=(this.player.aimPoint.y-this.player.y)/len*3
        bullet.lifetime=600
        bullet.collision={width:1,height:1}
        bullet.physics =new PhysicsManager(bullet,this.wallTiles,()=>this.entities)
        bullet.update = bullet.physics.update.bind(bullet.physics)
        this.entities.push(bullet)
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