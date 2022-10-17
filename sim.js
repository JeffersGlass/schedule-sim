/// <reference path="p5.global-mode.d.ts" />

let debug = false

let ROOM_WIDTH = 150
let GUTTER = 100

const rooms = [
    { "name": 'In Line', "shape": [100, 100, 150, 150]  ,"realRoom": false},
    { "name": 'Lobby'  , "shape": [250, 100, 150, 150]  ,"realRoom": true},
    { "name": 'Preshow', "shape": [400, 100, 150, 300]  ,"realRoom": true},
    { "name": 'Zone 1' , "shape": [550, 250, 150, 150]  ,"realRoom": true},
    { "name": 'Zone 2' , "shape": [700, 250, 150, 150]  ,"realRoom": true},
    { "name": 'Zone 3' , "shape": [850, 250, 150, 150]  ,"realRoom": true},
    { "name": 'Exit' , "shape": [1000, 250, 150, 150] ,"realRoom": false},
]

console.log(rooms)

const scheduleTypes = {
    ROOM: 'room',
    PASSING: 'passing'
}

let DEFAULT_ROOM_SEC = (5 * 60) + 30
let DEFAULT_PASSING_SEC = 15

const DEFAULT_SCHEDULE = [
    {type: scheduleTypes.ROOM,    duration: 4 * 60,      location: rooms[rooms.findIndex((element) => element.name === 'In Line')] },
    {type: scheduleTypes.PASSING, duration: 15 },
    {type: scheduleTypes.ROOM,    duration: 1.75 * 60,      location: rooms[rooms.findIndex((element) => element.name === 'Lobby')] },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms[rooms.findIndex((element) => element.name === 'Preshow')] },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms[rooms.findIndex((element) => element.name === 'Zone 1')] },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms[rooms.findIndex((element) => element.name === 'Zone 2')] },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms[rooms.findIndex((element) => element.name === 'Zone 3')] },
    {type: scheduleTypes.PASSING, duration: DEFAULT_PASSING_SEC},
    {type: scheduleTypes.ROOM,    duration: DEFAULT_ROOM_SEC,      location: rooms[rooms.findIndex((element) => element.name === 'Exit')] },
]

const DEFAULT_SCHEDULE_OFFSET = DEFAULT_ROOM_SEC + (2 * DEFAULT_PASSING_SEC)

 const DD_100_SCHEDULE = [
    {type: scheduleTypes.ROOM,    duration: 4.0 * 60,              location: rooms[rooms.findIndex((element) => element.name === 'In Line')] },
    {type: scheduleTypes.PASSING, duration: 15 },
    {type: scheduleTypes.ROOM,    duration: (1.75 * 60),      location: rooms[rooms.findIndex((element) => element.name === 'Lobby')] },
    {type: scheduleTypes.PASSING, duration: 15 },
    {type: scheduleTypes.ROOM,    duration: (5.5 * 60) ,    location: rooms[rooms.findIndex((element) => element.name === 'Preshow')] },
    {type: scheduleTypes.PASSING, duration: 15 },
    {type: scheduleTypes.ROOM,    duration: 5.25 * 60,      location: rooms[rooms.findIndex((element) => element.name === 'Zone 1')] },
    {type: scheduleTypes.PASSING, duration: 30 },
    {type: scheduleTypes.ROOM,    duration: 5.75 *60,    location: rooms[rooms.findIndex((element) => element.name === 'Zone 2')] },
    {type: scheduleTypes.PASSING, duration: 15},
    {type: scheduleTypes.ROOM,    duration: 4.25*60,      location: rooms[rooms.findIndex((element) => element.name === 'Zone 3')] },
    {type: scheduleTypes.PASSING, duration: 1.75 * 60},
    {type: scheduleTypes.ROOM,    duration: 1.5 * 60,        location: rooms[rooms.findIndex((element) => element.name === 'Exit')] },
]

const DD_100_OFFSET = 6*60

//Initialize Groups
let groups = []

function init_groups(schedule, offset, number){
    groups = []
    for (const num of Array(15).keys()){
        groups.push(
            {name: num + 1, hue: (num * .38) % 1, timeOffset: num*(offset) , schedule: schedule}
        )
    }
}

init_groups(DD_100_SCHEDULE, DD_100_OFFSET, 15)


//Charting and Graphing
const GRAPHLINE_HEIGHT = 20
const GRAPH_TRUE_WIDTH = 10000
const GRAPH_DRAW_WIDTH = 650
let graph_x_scale = 1
let graph_start = 0

//Timing and speed
let currentTime = 0

const time_rate_list = [-300, -200, -100, -60, -35, -20, -10, -1, 0, 
    1, 10, 20, 35, 60, 100, 200, 300]
const ZERO_TIME_INDEX = 8;
let time_rate_index = ZERO_TIME_INDEX + 2;

let stored_time_rate_index = time_rate_index
let just_resumed = false
let paused = false
const MAX_TIME_RATE = 300

function setup(){
    createCanvas( ROOM_WIDTH * 7 + GUTTER * 2, 700);
    graph = createGraphics(GRAPH_TRUE_WIDTH,140)
    labelledGraph = createGraphics(GRAPH_TRUE_WIDTH, 140)

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

    scheduleSelect = createSelect()
    scheduleSelect.position(75,475)
    scheduleSelect.option('Rolling Schedule')
    scheduleSelect.option('100% DD Schedule')
    scheduleSelect.selected('100% DD Schedule')
    scheduleSelect.changed(setSchedule)
}
  
function draw() {
    if (just_resumed) {
        currentTime += time_rate_list[time_rate_index] * (20 / 1000)
        just_resumed = false
    }
    else {
        currentTime += time_rate_list[time_rate_index] * ( deltaTime / 1000)
    }

    currentTime = Math.max(0, currentTime)

    //If we rewind to 00:00, set speed to zero.
    if (currentTime < 1 && time_rate_index < ZERO_TIME_INDEX){
        time_rate_index = ZERO_TIME_INDEX
        stored_time_rate_index = time_rate_index
    }

    background(240);
    
    //Draw rooms
    for (const room of rooms){
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
        text(room.name, ...topCenter)
    };

    //draw groups
    for (const group of groups){
        //console.log(group)
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

            fill(...hslToRgb(group.hue, .3, .6), 100)
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
        text(group.name, ...center)
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
    const relative_speed = time_rate_list[stored_time_rate_index] / 2 / Math.max(...time_rate_list)
    if (relative_speed >= 0) {fill(50,255,50); stroke(50, 255, 50, 255)} //green
    else {fill(255,50,50); stroke(255,50,50,255)} //red

    if (paused) { fill(0,0,0,0) }
    rect(1100, 560 - 75 -(relative_speed * 150), 50, relative_speed * 150)

    //Draw speed text
    let speed_text = time_rate_list[time_rate_index].toString() + "x"
    textAlign(CENTER, TOP)
    textSize(32)
    text(speed_text, 1125, 575)

    //speed indicator border
    stroke(0)
    fill(0,0,0,0)
    rect(1100, 560 - 150, 50, 150)
    strokeWeight(2)
    line(1100, 560 - 75, 1100 + 50, 560 - 75)
    strokeWeight(1)

    //graph
    createGraph(graph)
    labelGraph(graph)
    //image(labelledGraph, 60, 500, 0 + GRAPH_DRAW_WIDTH, 140, 0, 0, GRAPH_DRAW_WIDTH, 140)
    image(labelledGraph, 60, 500)
    //image(graph, 60, 500, 0 + GRAPH_DRAW_WIDTH, 140, graph_start, 0, GRAPH_TRUE_WIDTH/graph_x_scale, 140)

    push()
    textSize(24)
    fill(0)
    noStroke()
    textAlign(CENTER, TOP)
    text("Time", 370, 645)
    pop()

    push()
    for (const [num, room] of rooms.entries()){
        //Room labels
        textSize(16)
        textAlign(LEFT, CENTER)
        fill(0)
        noStroke()
        text(room.name, 0, 500 + num * 20 + 10)
    }
    pop()

    push()
    textSize(12)
    textAlign(LEFT, TOP)
    noStroke()
    fill(0)
    if (debug){
        const data = {
            'debug': debug,
            'current time': currentTime,
            'graph_x_scale': graph_x_scale
        }
        let index = 0
        for (const [key, value] of Object.entries(data)){
            text(`${key} : ${value}`, 0, index * 20 + 10)
            index += 1
        }
    }
    else {
        text("Press 'd' for debug info", 0, 10)
    }
    pop()
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
    time_factor = currentTime / 15
    translate(x, y)
    rotate(PI/8 * time_factor)
    rect(-sidelength/2, -sidelength/2, sidelength, sidelength)
    rotate(-PI/8 * time_factor)
    translate(-x, -y)
}

function faster(){
    if (!paused) {
        time_rate_index = Math.min(time_rate_index + 1, time_rate_list.length - 1)
        //time_rate = Math.min(Math.floor(time_rate + 25), MAX_TIME_RATE)
        stored_time_rate_index = time_rate_index
    }
}

function slower(){
    if (!paused) {
        time_rate_index = Math.max(time_rate_index - 1, 0)
        stored_time_rate_index = time_rate_index
    }
}

function play(){
    time_rate_index = stored_time_rate_index
    just_resumed = true
    paused = false
}

function pause(){
    stored_time_rate_index = time_rate_index
    time_rate_index = ZERO_TIME_INDEX
    paused = true
}

function createGraph(gp){
    //scale - horizontally, 1 pixel is 1 second
    gp.background(250);

    gp.stroke(0)
    gp.strokeWeight(0)

    for (const group of groups){
        push()
        let trackTime = group.timeOffset

        for (const [index, period] of group.schedule.entries()){
            //console.log({period})

            if (period.type == scheduleTypes.ROOM){
                //console.log("Drawing rectangle for this room")
                y = GRAPHLINE_HEIGHT * rooms.findIndex((room) => {return room.name === period.location.name})
                gp.fill(hslToRgb(group.hue, .8, .8))
                gp.rect(trackTime, y, period.duration, GRAPHLINE_HEIGHT);
            }
            else if (period.type == scheduleTypes.PASSING){
                previousRoom = group.schedule[index - 1]
                //console.log({previousRoom})
                nextRoom = group.schedule[index + 1]
                y = GRAPHLINE_HEIGHT * rooms.findIndex((room) => {return room.name === previousRoom.location.name})
                gp.fill(...hslToRgb(group.hue, .6, .6), 100)
                gp.rect(trackTime, y, period.duration, GRAPHLINE_HEIGHT * 2);
            }

            
            //console.log({y})

            trackTime += period.duration
        }
        pop()
    }

    // horizontal dividing lines
    for (const num of Array(Object.keys(rooms).length).keys()){
        
        push()
        gp.stroke(0)
        gp.strokeWeight(.5)
        gp.line(0, (num + 1) * GRAPHLINE_HEIGHT, GRAPH_TRUE_WIDTH, (num + 1) * GRAPHLINE_HEIGHT)

        pop()
        }    
    
    //vertical dividing lines

    const seconds_per_division = secondsPerDivision(graph_x_scale)
    push()
    for (const num of Array(100).keys()){
        gp.strokeWeight(graphToScreenScale(1))
        if (graph_x_scale >= 16 && ! (num % 4)) { gp.strokeWeight(graphToScreenScale(3))}
        gp.stroke(0,0,0,100)
        gp.line(num * seconds_per_division, 0, num * seconds_per_division, 140)
    }
    pop()
        
    //Time Marker
    push()
    //Line
    gp.fill(255,0,0,255)
    gp.strokeWeight(graphToScreenScale(1))
    gp.stroke(255,0,0)
    gp.line(currentTime, 10, currentTime, 140-10)
    
    //Triangles
    gp.fill(255,0,0,255)
    gp.noStroke()
    gp.triangle(currentTime - graphToScreenScale(5), 0, currentTime + graphToScreenScale(5), 0, currentTime, 10)
    gp.triangle(currentTime - graphToScreenScale(5), 140, currentTime + graphToScreenScale(5), 140, currentTime, 140 - 10)
    pop()
}

function labelGraph(sourceGraph){
    labelledGraph.image(graph, 0, 0, 0 + GRAPH_DRAW_WIDTH, 140, graph_start, 0, GRAPH_TRUE_WIDTH/graph_x_scale, 140)

    const seconds_per_division = secondsPerDivision(graph_x_scale);
    push()
    for (const num of Array(100).keys()){
        labelledGraph.fill(0,0,0,255)
        labelledGraph.textSize(12)
        labelledGraph.textAlign(CENTER, BOTTOM)
        labelledGraph.text(Math.round(100 * seconds_per_division * num / 60) / 100, screenToGraphScale(num  * seconds_per_division) - screenToGraphScale(graph_start), 140)
    }
    pop()
}

function mouseWheel(event){
    if (event.delta < 0){
        graph_x_scale = Math.min(graph_x_scale * 2, 32)
    }
    if (event.delta > 0){
        graph_x_scale = Math.max(graph_x_scale / 2, 1)
    }
}

function mouseDragged(event){
    graph_start -= (event.movementX * (GRAPH_TRUE_WIDTH / GRAPH_DRAW_WIDTH) / graph_x_scale)
    graph_start = Math.max(graph_start, 0)
    graph.start = Math.min(graph_start, GRAPH_TRUE_WIDTH)
}

function graphToScreenScale(graphDistance){
    return graphDistance * (GRAPH_TRUE_WIDTH / GRAPH_DRAW_WIDTH) / graph_x_scale
}

function screenToGraphScale(screenDistance){
    return screenDistance * graph_x_scale * (GRAPH_DRAW_WIDTH / GRAPH_TRUE_WIDTH)
}

function keyTyped(){
    if (key === 'd'){
        debug = !debug
        console.log({debug})
    }
}

function setSchedule(){
    let sched = scheduleSelect.value()
    console.log(`Got schedule valuve ${sched}`)
    if (sched === "100% DD Schedule"){
        init_groups(DD_100_SCHEDULE, DD_100_OFFSET, 15)
        currentTime = 0
    }
    else if (sched === "Rolling Schedule"){
        init_groups(DEFAULT_SCHEDULE, DEFAULT_SCHEDULE_OFFSET, 15)
        currentTime = 0
    }
    else {
        console.error("Invalid schedule selected")
    }
}

function secondsPerDivision(scale) {
    if (scale <= 1) {
        return 6 * 60
    }
    if (scale <= 4) {
        return 2 * 60
    }
    if (scale <= 16) {
        return 60
    }
    return 15
    
}