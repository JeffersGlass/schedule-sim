import hslToRgb from "./colors.js";

const sidelength = 20;

class AudienceGroup{
    constructor({label, x, y, hue}){
        this.label = label
        this.x = x
        this.y = y
        this.hue = hue  | 0.5
    }

    draw(){
        push()
        //draw group

        fill(...hslToRgb(this.hue, .8, .6))
        strokeWeight(2)
        stroke(255,255,255)
        rect(...centeredSquare(this.x, this.y, sidelength))
        strokeWeight(1)
        pop()
    }
}

function centeredSquare(x, y, sidelength){
    return [
        x - sidelength/2,
        y - sidelength/2,
        sidelength,
        sidelength
    ]
}

export {AudienceGroup}