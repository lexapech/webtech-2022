export default class EventManager {
    constructor(movePlayer,aimAt,shot) {
        this.move = movePlayer
        this.aim = aimAt
        this.shot=shot

        console.log(this.move)
        window.addEventListener("keydown",this.onKeyDown.bind(this))
        window.addEventListener("keyup",this.onKeyUp.bind(this))
        window.addEventListener("mousemove",this.onMouseMove.bind(this))
        window.addEventListener("click",this.onClick.bind(this))
        this.left=0
        this.right=0
        this.up=0
        this.down=0;
    }
    onClick(e){
        this.shot()
    }

    onMouseMove(e){
        this.aim({x:e.clientX, y:e.clientY})
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