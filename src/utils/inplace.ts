import {readFileSync, existsSync} from 'fs';

export class TargetFile {
    content: string;
    currentAt: number;
    root: BaseSegment;

    public constructor(fileContent: string[]) {
        this.content = fileContent.join("\n");
        this.currentAt = 0;
        this.root = new BaseSegment(this, 0, fileContent.length);
    }

    public createSegments() {
        const SegmentTypes = [
            HeadSegment,
            testStepSegment,
            TailSegment,
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
        for (let i=0; i<originA.children.length;i++) {
            let originSeg = originA.children[i];
            originSeg.status = SegmentStatus.Deleted;
            for (let j=0; j<customizedA.children.length; j++) {
                let customizedSeg = customizedA.children[j];
                if (originSeg.name == customizedSeg.name) {
                    if (originSeg.Content == customizedSeg.Content) {
                        originSeg.status = SegmentStatus.Origin;
                    }
                    else {
                        originSeg.status = SegmentStatus.Origin;
                    }
                    break
                }
            }
        }
    }
}

export enum SegmentStatus {
    Origin,
    Modified,
    Deleted,
}

export class BaseSegment {
    children: BaseSegment[];
    startAt: number;
    endAt: number;
    name: string;
    status: SegmentStatus;
    target: TargetFile;
    customized: BaseSegment;

    public constructor(target: TargetFile,startAt: number, endAt: number, name: string="") {
        this.startAt = startAt;
        this.endAt = endAt;
        this.children = [];
        this.name = this.constructor.name+ "_"+name;
        this.status = SegmentStatus.Origin;
        this.target = target;
        this.customized = undefined;
    }

    public get Content() {
        return this.target.content.slice(this.startAt, this.endAt);
    }

    public status
}

export class HeadSegment extends BaseSegment {
    public static addInstance(target: TargetFile): boolean {
        if (target.currentAt==0) {
            let nextAt =target.content.search(/\n##/);
            if (nextAt<0) {
                nextAt = target.content.length-1;
            }
            nextAt += 1;
            target.children.push(new HeadSegment(target, target.currentAt, nextAt));
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
        if (target.currentAt>=0 && remain.startsWith("## ")) {
            let nextAt =remain.search(/\n##/);
            if (nextAt<0) {
                nextAt = target.content.length-1;
            }
            nextAt +=  target.currentAt + 1;
            target.children.push(new testStepSegment(target, target.currentAt, nextAt, remain.slice(3, remain.indexOf("\n"))));
            target.currentAt = nextAt;
            return true;
        }
        return false;
    }

    public createChildren(target: TargetFile) {
        let seperators = [
            ["endwith", ":\n", "declare"],
            ["startwith", "    test.cmd(", "pre"],
            ["endwith", "checks=[", "command"],
            ["startwith", "])\n", "checkers"],
        ];

        let bias = this.startAt;
        let t, tag, name;
        for (let seperator of seperators) {
            t = seperator[0];
            tag = seperator[1];
            name = seperator[2];
            let idx = target.content.indexOf(tag, bias);
            if (t=="endwith") {
                this.children.push(new BaseSegment(target, bias, idx+tag.length, name));
                bias = idx + tag.length;
            }
            else if (t=="startwith") {
                this.children.push(new BaseSegment(target, bias, idx, name));
                bias = idx;
            }
        }
        this.children.push(new BaseSegment(target, bias, this.endAt, "post"));
    }
}


export class TailSegment extends BaseSegment {
    public static addInstance(target: TargetFile): boolean {
        if (target.currentAt>=0) {
            return false;
        }
        const nextAt = target.content.length;
        target.children.push(new TailSegment(target, target.currentAt, nextAt));
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