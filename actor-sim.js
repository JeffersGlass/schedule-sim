/// <reference path="p5.global-mode.d.ts" />

import { AudienceGroup } from "./src/audiencegroup.js"
import { Room } from "./src/room.js"

let debug = false

let ROOM_WIDTH = 150
let GUTTER = 100

const rooms = [
    new Room({ "name": 'In Line', "shape": [100, 100, 150, 150]  ,"isRendered": false}),
    new Room({ "name": 'Lobby'  , "shape": [250, 100, 150, 150]  ,"isRendered": true}),
    new Room({ "name": 'Preshow', "shape": [400, 100, 150, 300]  ,"isRendered": true}),
    new Room({ "name": 'Zone 1' , "shape": [550, 250, 150, 150]  ,"isRendered": true}),
    new Room({ "name": 'Zone 2' , "shape": [700, 250, 150, 150]  ,"isRendered": true}),
    new Room({ "name": 'Zone 3' , "shape": [850, 250, 150, 150]  ,"isRendered": true}),
    new Room({ "name": 'Exit' , "shape": [1000, 250, 150, 150] ,"isRendered": false}),
]

let groups = [
    new AudienceGroup({label: "foo", x:100, y:100, hue:0.5})
];

//Timing and speed
let currentTime = 0

function setup(){
    createCanvas( ROOM_WIDTH * 7 + GUTTER * 2, 700);
}

function draw(){
    for (const room of rooms){
        room.draw();
    }
    
    for (const group of groups){
        group.draw()
    }
}

function keypressed(){

}

window.setup = setup
window.draw = draw
window.keypressed = keypressed