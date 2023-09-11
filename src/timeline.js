class Timeline{
    constructor(clips){
        this.clips = clips | [];
    }
}

class TimelineItem{
    reset(){

    }
}

class TriggerPoint extends TimelineItem{
    constructor({label, signalTo}){
        this.label = label;
        this.blocking = true;
        this.signalTo = signalTo | [];
    }
}

class VideoClip extends TimelineItem{
    constructor({label, duration}){
        this.label = label;
        this.duration = duration
        this.looping = null;
    }
}

class LoopingVideoClip extends VideoClip{
    constructor({label, duration, loopDuration}){
        super(label, duration);
        this.looping = true;
        this.holdAtLoopEnd = true;
        this.loopDuration = null;
    }

    reset(){
        this.holdAtLoopEnd = true;  
    }
}

class HoldPoint  extends TimelineItem{
    constructor({label}){
        this.label = label;
        this.blocked = true;
    }
}

export {Timeline, TriggerPoint, VideoClip, LoopingVideoClip, HoldPoint};