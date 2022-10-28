let game
const colors = ['rgba(145,145,145,0.7)',
    '#00ffd0',
    '#0033ff',
    '#ff7300',
    '#ffd500',
    '#1aff00',
    '#d000ff',
    '#ff0000']
const atlas = document.getElementById('atlas');
const blocks = [
    [
        [0,0,0,0,0],
        [0,0,0,0,0],
        [1,1,1,1,0],
        [0,0,0,0,0],
        [0,0,0,0,0]
    ],
    [
        [0,0,2],
        [2,2,2],
        [0,0,0]
    ], [
        [3,0,0],
        [3,3,3],
        [0,0,0]
    ],
    [
        [4,4],
        [4,4]
    ],
    [
        [5,5,0],
        [0,5,5],
        [0,0,0]
    ],
    [
        [0,6,0],
        [6,6,6],
        [0,0,0]
    ],
    [
        [0,7,7],
        [7,7,0],
        [0,0,0]
    ]
]
function readFromStorage() {
    return localStorage["tetris.username"];
}
function load() {
    let name=readFromStorage()
    console.log("main")
    document.getElementById('playerName').innerText = name
    document.getElementById('currLevel').innerText = "1"
    init()
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function buttonUp(){
    let grid = game.turn()
    draw(game.canvas, grid)
}
function buttonDown(){
    game.maxcounter=1
}
function buttonLeft(){
    let grid = game.moveLeft()
    draw(game.canvas, grid)
}
function buttonRight(){
    let grid = game.moveRight()
    draw(game.canvas, grid)
}
function init() {

    document.onkeydown = checkKey;

    function checkKey(e) {
        if (e.key === "ArrowUp") {
            buttonUp()
        }
        else if (e.key === "ArrowDown" ||e.key === " " ) {
            buttonDown()
        }
        else if (e.key === "ArrowLeft") {
            buttonLeft()
        }
        else if (e.key === "ArrowRight") {
            buttonRight()
        }

    }
    const canvas = document.getElementById('canvas');
    let size = Math.min(window.innerWidth-canvas.getBoundingClientRect().left,window.innerHeight/2)*0.9
    canvas.width = size
    canvas.height = 2*size


    game = new Game(canvas)
    window.setInterval(game.run, 16,game)
}

class Game {
    constructor(canvas) {
        this.x = 4;
        this.y = 22;
        this.blockId = getRandomInt(0,6)
        this.nextBlockId = getRandomInt(0,6)
        this.height=25
        this.staticLayer = new Array(10*this.height)
        this.staticLayer.fill(0)
        this.canvas = canvas
        this.counter = 0
        this.maxcounter=10
        this.angle=0
        this.score=0
        this.level=0
        this.running =true
        this.updateNextWindow()
    }

    run(game) {
        if (game.running) {
            let levelSpeeds = [50, 20]
            game.counter++
            if (game.counter > game.maxcounter) {
                game.counter = 0
                game.maxcounter = levelSpeeds[game.level]
                let displayGrid = game.moveDown()
                draw(game.canvas, displayGrid)
            }
        }
    }
    checkRow(i) {
        for(let x=0;x<10;x++) {
            if(this.staticLayer[10*i+x]===0) return false
        }
        return true
    }
    checkIfEmpty(i) {
        for(let x=0;x<10;x++) {
            if(this.staticLayer[10*i+x]>0) return false
        }
        return true
    }
    checkTopRows() {
        for(let y = 20;y<this.height;y++) {
            if (!this.checkIfEmpty(y)) {
                return true
            }
        }
        return false
    }
    deleteRow(y) {
            this.staticLayer.splice(y*10,10)
            let t = new Array(10)
            t.fill(0)
            this.staticLayer=this.staticLayer.concat(t)
    }
    checkFullRows() {
        let rowsCleared=0
        for(let y=20;y>=0;y--) {
            if (this.checkRow(y)) {
                this.deleteRow(y)
                rowsCleared++
            }
        }
        let bonus=[0,100,300,700,1500]
        this.score+=bonus[rowsCleared]
        document.getElementById('currScore').innerText = this.score
        if (this.score>5000) this.level=1
        document.getElementById('currLevel').innerText = (this.level+1).toString()
    }
    gameOver() {
        this.running=false
        let name=readFromStorage()
        let records
        try {
            records = JSON.parse( localStorage['tetris.records'])
        }
        catch (e){
            records=[]
        }
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date+' '+time;
        records[records.length] = {time:dateTime, playerName: name, playerScore: this.score }
        records = records.sort((a,b)=>+b.playerScore-a.playerScore)
        records = records.slice(0,Math.min(records.length,10))
        localStorage['tetris.records'] =JSON.stringify( records)
        window.location.href="records.html"
    }
    rotateArray(a,newAngle) {
        let n=a.length;
        let newArray = new Array(n)
        for (let y = 0; y < n; y++) {
            newArray[y] = new Array(n)
            for (let x = 0; x < n; x++) {
                newArray[y][x] = a[y][x]
            }
        }
        for (let times = 0; times < newAngle; times++) {
            for (let i=0; i<n/2; i++) {
                for (let j=i; j<n-i-1; j++) {
                    let tmp=newArray[i][j];
                    newArray[i][j]=newArray[j][n-i-1];
                    newArray[j][n-i-1]=newArray[n-i-1][n-j-1];
                    newArray[n-i-1][n-j-1]=newArray[n-j-1][i];
                    newArray[n-j-1][i]=tmp;
                }
            }
        }
        return newArray;
    }

    turn() {

        return this.update(0,0,1)
    }
    moveLeft() {
        return this.update(-1,0,0)
    }
    moveRight() {
        return this.update(1,0,0)
    }
    moveDown() {
        return this.update(0,-1,0)
    }
    updateNextWindow() {
        let nextC = document.getElementById("nextBlockCanvas")
        nextC.width = nextC.height
        if (nextC.getContext) {
            let ctx = nextC.getContext('2d');
            let blockSize = nextC.height / 4

            for (let y = 0; y < 4; y++) {
                for (let x = 0; x < 4; x++) {
                    let color
                    let nx=x
                    let ny=y
                    if (this.nextBlockId !==0) {
                        nx--
                        ny--
                    }
                    if (x > blocks[this.nextBlockId].length || y > blocks[this.nextBlockId].length)
                        color = 0
                    else {
                        if (nx<0 || ny <0)  color = 0
                        else
                            color = blocks[this.nextBlockId][ny][nx]
                    }


                    if(color===0) {
                        ctx.fillStyle = colors[color]
                        ctx.fillRect(blockSize * x, blockSize * (3 - y), blockSize, blockSize);
                    }
                    else {
                        color--
                        ctx.drawImage(atlas,128*color,0,128,128,blockSize * x, blockSize * (3 - y), blockSize, blockSize)
                    }
                }
            }


        }
    }

    nextBlock() {
        this.x = 4;
        this.y = 22;
        this.angle=0
        this.blockId = this.nextBlockId
        this.nextBlockId = getRandomInt(0,6)
        this.updateNextWindow()

    }


    placeOnLayer(newX,newY,newAngle) {
        let layer = new Array(10*this.height)
        layer.fill(0)
        let blockArray = this.rotateArray(blocks[this.blockId],newAngle)
        let blockCenter =Math.floor(blockArray.length/2)
        let blockSize =blockArray.length
        for (let blockY=0;blockY<blockSize;blockY++) {
            for (let blockX=0;blockX<blockSize;blockX++) {
                let x = blockX+newX-blockCenter
                let y = blockY+newY-blockCenter
                let block =blockArray[blockY][blockX]
                if (x >=0 && x < 10 && y >=0 && y < this.height || block===0)
                    layer[x+10*y] = block
                else return false
            }
        }
        return layer
    }
    update(dx,dy,da=0) {
        let displayLayer = new Array(10 * this.height)
        displayLayer.fill(0)
        let dynLayer = this.placeOnLayer(this.x + dx, this.y + dy,this.angle+da)
        let collision = false
        let moved = true
        if (dynLayer === false) {
            dynLayer = this.placeOnLayer(this.x, this.y,this.angle)
            moved = false
            if (dy !== 0) collision = true
        }
        for (let i = 0; i < 10 * this.height; i++) {
            if (this.staticLayer[i] > 0 && dynLayer[i] > 0) {
                dynLayer = this.placeOnLayer(this.x, this.y,this.angle)
                moved = false
                if (dy !== 0) {
                    collision = true

                }
                break
            }
        }
        for (let i = 0; i < 10 * this.height; i++) {
            displayLayer[i] = Math.max(this.staticLayer[i], dynLayer[i])
        }
        if (collision) {
            this.staticLayer = displayLayer.map((x) => x)
            if (this.checkTopRows()) this.gameOver()
            this.checkFullRows()
            this.nextBlock()
        }
        if (moved) {
            this.x += dx
            this.y += dy
            this.angle+=da
        }
        return displayLayer
    }
}


function draw(canvas,grid) {



    if (canvas.getContext) {
        let ctx = canvas.getContext('2d');
        let blockSize = canvas.height/20
        ctx.clearRect(0,0,canvas.width,canvas.height)
        for(let y=0;y<20;y++) {
            for(let x=0;x<10;x++) {
                let color = grid[x+10*y]
                if(color===0) {
                    ctx.fillStyle = colors[color]
                    ctx.fillRect(blockSize*x, blockSize*(19-y),blockSize,blockSize);
                }
                else {
                    color--
                    ctx.drawImage(atlas,128*color,0,128,128,blockSize*x, blockSize*(19-y),blockSize,blockSize)
                }

            }
        }


    }
}
