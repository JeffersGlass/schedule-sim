class Room{
    constructor({name, shape, isRendered}){
        this.name = name;
        this.shape = shape;
        this.isRendered = isRendered | true;
    }

    draw(){
        const shape = this.shape

        //draw walls
        if (this.isRendered){ stroke(0); strokeWeight(2)}
        else{ noStroke()}
        fill(255)
        rect(shape[0], shape[1], shape[2], shape[3])
        strokeWeight(1)

        //label
        const topCenter = [shape[0] + .5 * shape[2], shape[1]]
        fill(0)
        if (this.isRendered) {textSize(24) }
        else {textSize (16)}
        textAlign(CENTER, BOTTOM)
        //text(room.name, ...topCenter)
    };
}  

export {Room}