"use strict"

const {PI, random:rand, floor,sqrt} = Math
let ctx, w, h,particles,p,maxDist, lineWd

let init = () =>{
   
    let c = document.getElementById("c")
    ctx = c.getContext("2d")
    w = c.width = window.innerWidth
    h = c.height = window.innerHeight
    maxDist = 50
    particles = 200  
    lineWd = 1
    p = []
 
    for(let i=0; i < particles; i++){
        p.push(new Particle(randf(w), randf(h), 2, "#2ab", true))
    }
    controls()
    update()
}

const endLoad = () => {
	document.querySelector(".loader").style.display = "none"
}
let controls = () =>{
    const sliders = document.querySelectorAll(".slider"),
        vals = document.querySelectorAll(".val")
    sliders.forEach((slider,i)=>{
        vals[i].textContent = slider.value 
        slider.oninput = () =>{
            vals[i].textContent = slider.value
           
        }
    })
}

let eventL = () =>{
    let parts = document.querySelector(".parts"),
        maxdis = document.querySelector(".maxdis"),
        linewid = document.querySelector(".linewid")
        
    window.addEventListener("input", (e) =>{
        if(e.target == parts){
           particles  = parseFloat(e.target.value)
           p = []
           for(let i=0; i < particles; i++){
        p.push(new Particle(randf(w), randf(h), 2, "#2ab", true))
    }
        }
        if(e.target == maxdis){
            maxDist = parseFloat(e.target.value)
        }
        if(e.target == linewid){
            lineWd = parseFloat(e.target.value)
        }
    })
}

let line = (a, b, c, d) => {
    ctx.beginPath()
    ctx.lineWidth = lineWd 
    ctx.moveTo(a, b)
    ctx.lineTo(c, d)
    ctx.stroke()
}

let randf = (n) =>{
    return floor(rand() * n)
}

let update =()=>{
    ctx.fillStyle = "#000"
    ctx.fillRect(0, 0, w, h)
    
    for(let i=0; i < particles; i++){
        p[i].update()
        p[i].show()
    }
    
    for(let i = 0;i<p.length -1; i++){
        let pA = p[i]
        for(let j = i + 1;j<p.length; j++){
            let pB = p[j]
            if(pA.dist(pB) < maxDist ){
                line(pA.pos.x, pA.pos.y, pB.pos.x, pB.pos.y)
            }
        }
    }
    
    requestAnimationFrame(update)
}

window.onload = () =>{
    setTimeout(() => {
    endLoad()
    init()
    eventL()
    requestAnimationFrame(update)
    },2000)
}

class Vector{
    #x
    #y
    constructor(x,y){
        this.#x = x
        this.#y = y
    }
    static create(x,y){
        return Object.preventExtensions( new Vector(x,y))
    }
    get x(){
        return this.#x
    }
    setX(x){
        this.#x = x
    }
    get y(){
        return this.#y
    }
     setY(y){
        this.#y = y
    }
     get len(){
        return sqrt(this.#x**2 + this.#y**2)
    }
     get angle(){
        return atan2(this.#y,this.#x)*180/PI
    }
     setAngle(ang){
         let len = this.len
         this.#x = cos(ang * PI/180) * len
         this.#y = sin(ang * PI/180) * len
    }
    setLen(len){
         let ang = this.angle
         this.#x = cos(ang) * len
         this.#y = sin(ang) * len
    }
    add(other){
        this.#x += other.#x
        this.#y += other.#y
    }
    sub(other){
        this.#x -= other.#x
        this.#y -= other.#y
    }
    mult(val){
        this.#x *= val
        this.#y *= val
    }
    div(val){
        this.#x /= val
        this.#y /= val
    }
    addTo(other){
        return Vector.create(this.#x + other.#x, this.#y + other.#y)
    }
    subFrom(other){
        return Vector.create(this.#x - other.#x, this.#y - other.#y)
    }
    multBy(scalar){
        return Vector.create(this.#x * scalar, this.#y * scalar)
    }
    divBy(scalar){
        return Vector.create(this.#x / scalar, this.#y / scalar)
    }
}/*
let v = Vector.create(3,9)
let v2 = Vector.create(5,11)
v.div(2)
log(v.x,  v.y, v2.x)
*/
class Particle{
    constructor(x,y,s,hu,f){
        this.pos = Vector.create(x,y)
        this.hu = hu
        this.vel = Vector.create(rand()*2-1,rand()*2-1)
        this.acc = Vector.create(0,0)
        this.size = s
        this.fill = f
    }

    update(){
        this.pos.sub(this.vel)
        if(this.pos.x > w || this.pos.x < 0 ){
            this.vel.setX(-this.vel.x)
        }
        if(this.pos.y > h || this.pos.y < 0){
            this.vel.setY(-this.vel.y)
        }
        
    }
    
    dist(other){
        let dx = other.pos.x - this.pos.x
        let dy = other.pos.y - this.pos.y
        return sqrt(dx**2 + dy**2)
    }
    
    show(){
    ctx.beginPath()
    ctx.fillStyle = this.hu
    ctx.strokeStyle = this.hu
    ctx.arc(this.pos.x, this.pos.y, this.size, 0, PI * 2)
    
    if(this.fill){
        ctx.fill()
    }else{ctx.stroke()}

    }
}
