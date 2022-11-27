export default class AudioManager {
    constructor() {
        this.context = new AudioContext()
        this.loadedSounds=[]
        this.loaded=false;
        this.gainNode = this.context.createGain? this.context.createGain():this.context.createGainNode()
        this.gainNode.connect(this.context.destination)
    }

    loadArray(array) {
        for(let clip of array) {
            this.loadSound(clip,()=>{
                if(this.loadedSounds.length===array.length) {
                    this.loaded=true
                }
            })
        }
    }


    loadSound(sound,cb) {
        if(this.loadedSounds.find(x=>x.name===sound)) {
            cb(this.loadedSounds.find(x=>x.name===sound))

            return
        }

        fetch(`sounds/${sound}`).then((res) => res.blob()).then((data => {
            data.arrayBuffer().then(arrayBuf=>{
                this.context.decodeAudioData(arrayBuf).then(buf => {
                    let newSound={name: sound, data: buf,play:(volume,loop)=>this.playSound(sound,volume?volume:1,loop?loop:false)}
                    this.loadedSounds.push(newSound)
                    cb(newSound)
            })
            })
        }))
    }
    playSound(name,volume,loop) {
        if(!this.loaded) return
        let sound =this.context.createBufferSource()
        sound.buffer=this.loadedSounds.find(x=>x.name===name).data
        sound.connect(this.gainNode)
        sound.loop=loop
        this.gainNode.gain.value=volume
        if(!sound.start)
            sound.start=sound.noteOn
        sound.start(0)
    }

}