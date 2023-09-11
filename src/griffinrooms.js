const rooms = [];

import { Timeline, TriggerPoint, VideoClip, LoopingVideoClip, HoldPoint} from "./timeline";


rooms.push(
    new Room(
        {
            name: 'In Line',
            shape: [100, 100, 150, 150]  ,
            isRendered: false,
            timeline: null
        }
    )
)

rooms.push(
    new Room(
        {
            name: 'Lobby'  ,
            shape: [250, 100, 150, 150]  ,
            isRendered: true,
            timeline: new Timeline([
                LoopingVideoClip({label: "Attract Loop", duration: 210, loopDuration: 30}),
                HoldPoint({label: "Go from Room 2"}),
                VideoClip({label:"Welcome Video", duration: 30}),
                VideoClip({label:"Another Video", duration: 30}),
                VideoClip({label:"Video A", duration: 30}),
                VideoClip({label:"Video B", duration: 30}),
                VideoClip({label:"Video C", duration: 30}),
            ])         
        }
    )
)

rooms.push(
    new Room(
        {
            name: 'Preshow',
            shape: [400, 100, 150, 300]  ,
            isRendered: true,
            timeline: new Timeline([
                LoopingVideoClip({label: "Attract Loop", duration: 210, loopDuration: 30}),
                HoldPoint({label: "Go from Room 2"}),
                VideoClip({label:"Welcome Video", duration: 30}),
                VideoClip({label:"Another Video", duration: 30}),
                VideoClip({label:"Video A", duration: 30}),
                VideoClip({label:"Video B", duration: 30}),
                VideoClip({label:"Video C", duration: 30}),
            ])            
        }
    )
)

rooms.push(
    new Room(
        {
                name: 'Zone 1' ,
            shape: [550, 250, 150, 150]  ,
            isRendered: true,
            timeline: new Timeline([
                LoopingVideoClip({label: "Attract Loop", duration: 210, loopDuration: 30}),
                HoldPoint({label: "Go from Room 2"}),
                VideoClip({label:"Welcome Video", duration: 30}),
                VideoClip({label:"Another Video", duration: 30}),
                VideoClip({label:"Video A", duration: 30}),
                VideoClip({label:"Video B", duration: 30}),
                VideoClip({label:"Video C", duration: 30}),
            ])      
        }
    )
)

rooms.push(
    new Room(
        {
            name: 'Zone 2' ,
            shape: [700, 250, 150, 150]  ,
            isRendered: true,
            timeline: new Timeline([
                LoopingVideoClip({label: "Attract Loop", duration: 210, loopDuration: 30}),
                HoldPoint({label: "Go from Room 2"}),
                VideoClip({label:"Welcome Video", duration: 30}),
                VideoClip({label:"Another Video", duration: 30}),
                VideoClip({label:"Video A", duration: 30}),
                VideoClip({label:"Video B", duration: 30}),
                VideoClip({label:"Video C", duration: 30}),
            ])      
        }
    )
)

rooms.push(
    new Room(
        {
            name: 'Zone 3' ,
            shape: [850, 250, 150, 150]  ,
            isRendered: true,
            timeline: new Timeline([
                LoopingVideoClip({label: "Attract Loop", duration: 210, loopDuration: 30}),
                HoldPoint({label: "Go from Room 2"}),
                VideoClip({label:"Welcome Video", duration: 30}),
                VideoClip({label:"Another Video", duration: 30}),
                VideoClip({label:"Video A", duration: 30}),
                VideoClip({label:"Video B", duration: 30}),
                VideoClip({label:"Video C", duration: 30}),
            ])      
        }
    )
)

rooms.push(
    new Room(
        {
            name: 'Exit' ,
            shape: [1000, 250, 150, 150], 
            isRendered: false,
            timeline: new Timeline([
                LoopingVideoClip({label: "Attract Loop", duration: 210, loopDuration: 30}),
                HoldPoint({label: "Go from Room 2"}),
                VideoClip({label:"Welcome Video", duration: 30}),
                VideoClip({label:"Another Video", duration: 30}),
                VideoClip({label:"Video A", duration: 30}),
                VideoClip({label:"Video B", duration: 30}),
                VideoClip({label:"Video C", duration: 30}),
            ])      
        }
    )
)

export {rooms}