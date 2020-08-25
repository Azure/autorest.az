import {readFileSync, existsSync} from 'fs';

export class TargetFile {
    content: string;
    currentAt: number;
    children: BaseSegment[];

    public constructor(fileContent: string[]) {
        this.content = fileContent.join("\n");
        this.currentAt = 0;
        this.children = [];
    }

    public createSegments() {
        const SegmentTypes = [
            HeadSegment,
            testStepSegment,
        ]
        
        let matchOne = true;
        while(matchOne && this.currentAt<this.content.length) {
            matchOne = false;
            for (let segmentType of SegmentTypes) {
                if (segmentType.addInstance(this)) {
                    matchOne = true;
                    break;
                }
            }
        }
    }

    public getContent(): string[] {
        return this.content.split("\n");
    }

    public merge(originA: TargetFile, customizedA: TargetFile) {

    }
}


export class BaseSegment {
    children: BaseSegment[];
    startAt: number;
    endAt: number;
    id: string;

    public constructor(startAt: number, endAt: number, name: string="") {
        this.startAt = startAt;
        this.endAt = endAt;
        this.children = [];
        this.id = this.constructor.name+ "_"+name;
    }
}

export class HeadSegment extends BaseSegment {

    public static addInstance(target: TargetFile): boolean {
        if (target.currentAt==0) {
            let startDef = target.content.indexOf("\ndef ");
            let startClass = target.content.indexOf("\nclass ");
            if (startDef<0) startDef = target.content.length-1;
            if (startClass<0) startClass = target.content.length-1;
            const nextAt = Math.min(startDef, startClass) +1;
            target.children.push(new HeadSegment(0, nextAt));
            target.currentAt = nextAt;
            return true;
        }
        return false;
    }
}

export class DefSegment extends BaseSegment {
    
}

export class testStepSegment extends DefSegment {
    public static addInstance(target: TargetFile): boolean {
        const remain = target.content.slice(target.currentAt);
        if (target.currentAt>=0 && remain.startsWith("def step_")) {
            let nextAt =remain.search(/\n\S/) + target.currentAt;
            if (nextAt<0) {
                nextAt = target.content.length-1;
            }
            nextAt += 1;
            target.children.push(new testStepSegment(target.currentAt, nextAt, remain.slice(0+4, remain.indexOf("("))));
            target.currentAt = nextAt;
            return true;
        }
        return false;
    }
}


export class TailSegment extends BaseSegment {
    public static addInstance(target: TargetFile): boolean {
        if (target.currentAt>=0 && target.content.slice(target.currentAt).startsWith("def step_")) {
            return false;
        }
        const nextAt = target.content.length;
        target.children.push(new testStepSegment(target.currentAt, nextAt));
        target.currentAt = nextAt;
        return true;
    }
}

export function createTarget(file: string[]| string): TargetFile {
    let fileContent: string[];
    if (typeof file == 'string') {
        if (!existsSync(file))  return null;
        fileContent = readFileSync(file,'utf8').split("\n");
    }
    else {
        fileContent = file;
    }
    let target = new TargetFile(fileContent);
    target.createSegments();
    return target;
}