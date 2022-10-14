/// <reference path="p5.global-mode.d.ts" />

let ROOM_WIDTH = 150
let GUTTER = 100

const rooms = {
    InLine:  {label: 'In Line', shape: [100, 100, 150, 150]  ,realRoom: false},
    Lobby:   {label: 'Lobby', shape: [250, 100, 150, 150]  ,realRoom: true},
    Preshow: {label: 'Preshow', shape: [400, 100, 150, 300]  ,realRoom: true},
    Zone1:   {label: 'Zone 1', shape: [550, 250, 150, 150]  ,realRoom: true},
    Zone2:   {label: 'Zone 2', shape: [700, 250, 150, 150]  ,realRoom: true},
    Zone3:   {label: 'Zone 3', shape: [850, 250, 150, 150]  ,realRoom: true},
    Exit:    {label: 'Exit  ', shape: [1000, 250, 150, 150] ,realRoom: false},
}

const scheduleTypes = {
    ROOM: 'room',
    PASSING: 'passing'
}

let DEFAULT_ROOM_SEC = (5 * 60) + 30
let DEFAULT_PASSING_SEC = 30

const DEFAULT_SCHEDULE = [
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms.InLine },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms.Lobby },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms.Preshow },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms.Zone1 },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms.Zone2 },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms.Zone3 },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms.Exit },
]

const DEFAULT_SCHEDULE_OFFSET = DEFAULT_ROOM_SEC + (2 * DEFAULT_PASSING_SEC)

const PROPOSED_SCHEDULE = [
    {type: scheduleTypes.ROOM,    duration: 30,      location: rooms.InLine },
    {type: scheduleTypes.PASSING, duration: 30},
    {type: scheduleTypes.ROOM,    duration: 6*60,      location: rooms.Lobby },
    {type: scheduleTypes.PASSING, duration: 30},
    {type: scheduleTypes.ROOM,    duration: 5.5*60,      location: rooms.Preshow },
    {type: scheduleTypes.PASSING, duration: 30},
    {type: scheduleTypes.ROOM,    duration: 5*60,      location: rooms.Zone1 },
    {type: scheduleTypes.PASSING, duration: 60},
    {type: scheduleTypes.ROOM,    duration: 4.5*60,      location: rooms.Zone2 },
    {type: scheduleTypes.PASSING, duration: 90},
    {type: scheduleTypes.ROOM,    duration: 4*60,      location: rooms.Zone3 },
    {type: scheduleTypes.PASSING, duration: 30},
    {type: scheduleTypes.ROOM,    duration: 15,      location: rooms.Exit },
]

const PROPOSED_SCHEDULE_OFFSET = 10*60

/* let groups = [
    {label: "1", color: [255,100,100], timeOffset: 0, schedule: DEFAULT_SCHEDULE},
    {label: "2", color: [100, 255,100], timeOffset: 7*60, schedule: DEFAULT_SCHEDULE},
] */

let groups = []

for (const num of Array(15).keys()){
    groups.push(
        {label: num + 1, hue: (num * .38) % 1, timeOffset: (num-1)*(DEFAULT_SCHEDULE_OFFSET) , schedule: DEFAULT_SCHEDULE}
    )
}

let currentTime = 0
let time_rate = 50
let stored_time_rate = 60
let adjusted_delta = 20
let just_resumed = false
let paused = false
const MAX_TIME_RATE = 300

function setup(){
    createCanvas( ROOM_WIDTH * 7 + GUTTER * 2, 700);

    textSize(40)
    playButton = createButton("PLAY")
    playButton.position(750,450)
    playButton.mousePressed(play)

    pauseButton = createButton("PAUSE")
    pauseButton.position(830,450)
    pauseButton.mousePressed(pause)

    speedUp = createButton("FASTER")
    speedUp.position(1000, 475)
    speedUp.mousePressed(faster)

    speedUp = createButton("SLOWER")
    speedUp.position(1000, 525)
    speedUp.mousePressed(slower)

    graph = createGraphics(10000,140)
    createGraph(graph)
}
  
function draw() {
    if (just_resumed) {
        currentTime += time_rate * (20 / 1000)
        just_resumed = false
    }
    else {
        currentTime += time_rate * ( deltaTime / 1000)
    }

    currentTime = Math.max(0, currentTime)

    background(240);
    
    //Draw rooms
    for (var [key, room] of Object.entries(rooms)){
        shape = room.shape

        //draw walls
        if (room.realRoom){ stroke(0); strokeWeight(2)}
        else{ noStroke()}
        fill(255)
        rect(shape[0], shape[1], shape[2], shape[3])
        strokeWeight(1)

        //label
        topCenter = [shape[0] + .5 * shape[2], shape[1]]
        fill(0)
        if (room.realRoom) {textSize(24) }
        else {textSize (16)}
        textAlign(CENTER, BOTTOM)
        text(room.label, ...topCenter)
    };

    //draw groups
    for (const [index, group] of groups.entries()){
        const groupTime = currentTime - group.timeOffset
        const groupPeriodData = periodAtTime(group, groupTime) 
        if (groupPeriodData === -1){
            //console.log("Group " + group.label + " Is out of bounds")
            continue
        } 

        let center

        //In a room
        if (groupPeriodData.currentPeriod.type === scheduleTypes.ROOM){
            //fill room with visibilty

            fill(...hslToRgb(group.hue, .8, .6), 100)
            rect(...groupPeriodData.currentPeriod.location.shape)

            //draw group
            center = getRectCenter(groupPeriodData.currentPeriod.location.shape)

            fill(...hslToRgb(group.hue, .8, .6))
            strokeWeight(2)
            stroke(255,255,255)
            if (groupPeriodData.currentPeriod.location.realRoom){
                spinningSquare(...center, 50)
            }
            else{
                rect(...centeredSquare(...center, 50))
            }
            strokeWeight(1)
         
        }
        //passing period
        else if (groupPeriodData.currentPeriod.type === scheduleTypes.PASSING) {
            const previousRoom = group.schedule[groupPeriodData.index-1]
            const nextRoom = group.schedule[groupPeriodData.index + 1]
            //draw visibility

            fill(...hslToRgb(group.hue, .8, .6), 100)
            rect(...previousRoom.location.shape)
            rect(...nextRoom.location.shape)

            //draw group
            const previousCoords = getRectCenter(previousRoom.location.shape)
            const nextCoords = getRectCenter(nextRoom.location.shape)

            const progress = (groupTime - groupPeriodData.startedAt)/(groupPeriodData.endsAt - groupPeriodData.startedAt)
            
            center =  [
               lerp(previousCoords[0], nextCoords[0], progress),
               lerp(previousCoords[1], nextCoords[1], progress),
            ]

            fill(...hslToRgb(group.hue, .8, .8))
            stroke(0,0,0,127)
            circle(...center, 50)
            }

        //label group
        fill(0)
        stroke(0,0,0,0)
        textSize(32)
        textAlign(CENTER, CENTER)
        text(group.label, ...center)
    }

    //Draw time
    fill(0)
    textSize(64)
    textAlign(LEFT, TOP)
    seconds = String(Math.floor(currentTime % 60)).padStart(2, '0')
    minutes = String(Math.floor((currentTime / 60) % 60)).padStart(2, '0')
    hours = String(Math.floor(currentTime / 3600)).padStart(2, '0')
    text(hours + ":" + minutes + ":" + seconds, 720, 475)

    //Paused Indicator
    if (paused){
        fill(0,180,0)
        stroke(0,0,0,0)
        textSize(32)
        textAlign(CENTER, TOP)
        text("PAUSED", 885, 540)
    }

    //Draw Speed indicator
    const relative_speed = stored_time_rate / 2 / MAX_TIME_RATE
    if (time_rate >= 0) {fill(50,255,50); stroke(50, 255, 50, 255)} //green
    else {fill(255,50,50); stroke(255,50,50,255)} //red

    if (paused) { fill(0,0,0,0) }
    rect(1100, 560 - 75 -(relative_speed * 150), 50, relative_speed * 150)

    //speed indicator border
    stroke(0)
    fill(0,0,0,0)
    rect(1100, 560 - 150, 50, 150)
    strokeWeight(2)
    line(1100, 560 - 75, 1100 + 50, 560 - 75)
    strokeWeight(1)

    //graph
    image(graph, 0, 500, 700, 140)
}

function getRectCenter(rect) {
    return [
        rect[0] + .5 * rect[2],
        rect[1] + .5 * rect[3]
    ]    
}

function periodAtTime(group, time){
    //find location in schedule
    const localTime = time
    const endOfSchedule = group.schedule.reduce((total, period) => period.duration + total, 0)
    
    if (localTime < 0 || localTime > endOfSchedule) {
        return -1
    }

    var scheduleTotal = 0
    for (const [index, period] of group.schedule.entries()){
        scheduleTotal += period.duration
        if (scheduleTotal > localTime){
            return {currentPeriod: period, index: index, startedAt: scheduleTotal-period.duration, endsAt: scheduleTotal}
        }
    }

    return "NONE"
}

function randomColor(minVal) {
    hue = Math.random()
    return hslToRgb(hue, .8, .8)
    /* return  [
        Math.floor(Math.random() * (255-minVal) + minVal),
        Math.floor(Math.random() * (255-minVal) + minVal),
        Math.floor(Math.random() * (255-minVal) + minVal)
    ]     */
}

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function centeredSquare(x, y, sidelength){
    return [
        x - sidelength/2,
        y - sidelength/2,
        sidelength,
        sidelength
    ]
}

function spinningSquare(x, y, sidelength){
    time_factor = currentTime / 25
    translate(x, y)
    rotate(PI/8 * time_factor)
    rect(-sidelength/2, -sidelength/2, sidelength, sidelength)
    rotate(-PI/8 * time_factor)
    translate(-x, -y)
}

function faster(){
    if (!paused) {
        time_rate = Math.min(Math.floor(time_rate + 25), MAX_TIME_RATE)
        stored_time_rate = time_rate
    }
}

function slower(){
    if (!paused) {
        time_rate = Math.max(Math.floor(time_rate - 25), -MAX_TIME_RATE)
        stored_time_rate = time_rate
    }
}

function play(){
    time_rate = stored_time_rate
    just_resumed = true
    paused = false
}

function pause(){
    stored_time_rate = time_rate
    time_rate = 0
    paused = true
}

function createGraph(gp){
    //scale - horizontally, 1 pixel is 1 second
    gp.background(255);
    for (const num of Array(Object.keys(rooms).length).keys()){
        stroke(0)
        strokeWeight(.5)
        gp.line(0, num * 20, 10000, num * 20)
        }
    //Create chart here
    //image() access subrectange to draw
}