import {readFileSync, existsSync, writeFileSync, mkdirSync} from 'fs';
import { isNullOrUndefined } from 'util';
import {join, dirname} from "path"
import JSZip = require('jszip-sync');
import { distancePercentage } from './helper'

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
        return this.root.genResult().split("\n");
    }

    public merge(originA: TargetFile, customizedA: TargetFile) {
        if (isNullOrUndefined(originA)) return;
        if (!isNullOrUndefined(customizedA)) {
            originA.root.matchCustomize(customizedA.root);
        }
        this.root.matchVA(originA.root);
        if (!isNullOrUndefined(customizedA)) {
            this.root.addCustomize(customizedA.root);
            this.root.alignOrder(customizedA.root);
        }   
    }
}

export enum SegmentStatus {
    Origin,
    Added,
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
    originA: BaseSegment;

    public constructor(target: TargetFile,startAt: number, endAt: number, name: string="") {
        this.startAt = startAt;
        this.endAt = endAt;
        this.children = [];
        if (name.length>0) {
            this.name = this.constructor.name+ "_"+name;
        }
        else {
            let content = target.content.substr(startAt, endAt-startAt);
            this.name = this.constructor.name + "_"+content.split("\n")[0];
        }
        this.status = SegmentStatus.Origin;
        this.target = target;
        this.customized = undefined;
        this.originA = undefined;
    }

    public get Content() {
        return this.target.content.slice(this.startAt, this.endAt);
    }

    public matchCustomize(customized: BaseSegment) {
        if (this.Content == customized.Content) {
            this.status = SegmentStatus.Origin;
        }
        else {
            this.status = SegmentStatus.Modified;
            this.customized = customized;
        }

        for (let i=0; i<this.children.length;i++) {
            let originSeg = this.children[i];
            originSeg.status = SegmentStatus.Deleted;
            
            let customizedIdx = customized.findChild(originSeg);
            if (customizedIdx>=0) {
                originSeg.matchCustomize(customized.children[customizedIdx]);
            }
        }

        for (let i=0; i<customized.children.length;i++) {
            let customizedSeg = customized.children[i];
            let thisIdx = this.findChild(customizedSeg);
            if (thisIdx<0) {
                customizedSeg.status = SegmentStatus.Added;
            }
        }
    }

    public matchVA(originA: BaseSegment) {
        this.originA = originA;
        for (let i=0; i<this.children.length;i++) {
            let vBSeg = this.children[i];
            let oAIdx = originA.findChild(vBSeg);
            if (oAIdx>=0) {
                vBSeg.matchVA(originA.children[oAIdx]);
            }
        }
    }

    public findChild(childSeg: BaseSegment, startPos = 0): number {
        for (let i=startPos; i<this.children.length;i++) {
            if (this.children[i].name == childSeg.name) {
                return i;
            }
        }

        let minDist = 1;
        let ret = -1;
        for (let i=startPos; i<this.children.length;i++) {  
            let d = distancePercentage(childSeg.Content, this.children[i].Content);
            if (d<minDist)  {
                minDist = d;
                ret = i;
            }
        }
        if (minDist<0.3)    return ret;
        
        return -1;
    }

    public alignOrder(baseline: BaseSegment) {
        let p = 0;
        for (let child of baseline.children) {
            while(p<this.children.length && baseline.findChild(this.children[p])<0) p++;

            let curPos = this.findChild(child, p);
            if (curPos>=0) {
                let moving = this.children[curPos];
                this.children.splice(curPos, 1);
                this.children.splice(p, 0, moving);
                p += 1;
            }
        }
    }

    public addCustomize(customizedA: BaseSegment) {
        //merge new added in customziedA into this
        let previousIndex: number = -1;
        for (let i=0; i<customizedA.children.length;i++) {
            let seg = customizedA.children[i];
            let t = this.findChild(seg);
            if (t>=0) {
                previousIndex = t;
                this.children[t].addCustomize(seg);
            }
            else if(seg.status == SegmentStatus.Added) {
                this.children.splice(previousIndex+1, 0, seg);
                previousIndex += 1;
            }
        }
    } 

    public genResult(): string {
        let ret = "";
        if (this.children.length==0) {
            if (isNullOrUndefined(this.originA) || this.status==SegmentStatus.Added || this.originA.status== SegmentStatus.Origin || this.originA.Content!=this.Content) {
                ret += this.Content;
            }
            else if (this.originA.status==SegmentStatus.Deleted) {
                // skip this segment
            }
            else if (this.originA.status == SegmentStatus.Modified) {
                ret +=this.originA.customized.Content;
            }
        }
        else {
            for (let i=0; i<this.children.length;i++) {
                ret += this.children[i].genResult();
            }
        }
        return ret;
    }

    public createChildrenByIndent() {
        let lines = this.target.content.slice(this.startAt, this.endAt).split("\n");

        function lineIndent(line) {
            let firstCharAt = line.search(/\S/);
            return firstCharAt>=0? firstCharAt: line.length;
        }
        let myIndent = lineIndent(lines[0]);

        let curStart = 0;
        let curEnd = 0;
        let curParathesisCount = 0;

        function getBiasOfLine(cur, startAt) {
            let ret = startAt;
            for (let i=0; i<cur; i++) {
                ret += lines[i].length;
                if (i<lines.length-1)   ret += 1; //for \n
            }
            return ret;
        }

        while (curEnd<lines.length) {
            if (curParathesisCount==0   // all parathesis completed
                && curEnd>curStart      // length greater than zero
                && myIndent==lineIndent(lines[curEnd])  // in the same indent with the parent segment
                && lines[curEnd].search(/\S/)>=0    // not full-of-space line
                ) {
                let child = new BaseSegment(this.target, getBiasOfLine(curStart, this.startAt), getBiasOfLine(curEnd, this.startAt));
                child.createChildrenByIndent();
                this.children.push(child);
                curStart = curEnd;
            }
            curParathesisCount += (lines[curEnd].match(/[\(\[\{]/g) || []).length;
            curParathesisCount -= (lines[curEnd].match(/[\)\]\}]/g) || []).length;
            curEnd += 1;
        }

        if (this.children.length>0) {
            if (curEnd>curStart ) {
                let child = new BaseSegment(this.target, getBiasOfLine(curStart, this.startAt), getBiasOfLine(curEnd, this.startAt));
                child.createChildrenByIndent();
                this.children.push(child);
            }
        }
        else {  // find child indents
            let curIndent = myIndent;
            curEnd = 0;
            while (curEnd<lines.length) {
                let t = lines[curEnd].search(/\S/);
                if (t>curIndent ) {
                    let child = new BaseSegment(this.target, getBiasOfLine(curStart, this.startAt), getBiasOfLine(curEnd, this.startAt));
                    child.createChildrenByIndent();
                    this.children.push(child);
                    curStart = curEnd;
                    curIndent = t;
                }
                curEnd += 1;
                if (curEnd>=lines.length && this.children.length>0) {
                    let child = new BaseSegment(this.target, getBiasOfLine(curStart, this.startAt), getBiasOfLine(curEnd, this.startAt));
                    child.createChildrenByIndent();
                    this.children.push(child);
                }
            }
        }
    }
}

function nextStepAt(content: string): number {
    const nextEnv = content.search(/\n# Env/);
    const nextExample = content.search(/\n# EXAMPLE/);
    const nextCase = content.search(/\n# Testcase/);

    let candidates = [nextEnv, nextExample, nextCase];
    candidates.sort((a, b) => a - b);
    for (let ret of candidates) {
        if (ret>=0) {
            return ret;
        }
    }
    return -1;
}
export class HeadSegment extends BaseSegment {
    public static addInstance(target: TargetFile): boolean {
        if (target.currentAt==0) {
            let nextAt =nextStepAt(target.content);
            if (nextAt<0) {
                nextAt = target.content.length-1;
            }
            nextAt += 1;
            target.root.children.push(new HeadSegment(target, target.currentAt, nextAt));
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
        if (target.currentAt>=0) {
            let nextAt =nextStepAt(remain);
            if (nextAt<0) {
                nextAt = remain.length-1;
            }
            nextAt +=  target.currentAt + 1;
            const newStep = new testStepSegment(target, target.currentAt, nextAt, remain.slice(2, remain.indexOf("\n")))
            target.root.children.push(newStep);
            newStep.createChildren();
            target.currentAt = nextAt;
            return true;
        }
        return false;
    }

    public createChildren() {
        this.createChildrenByIndent();
    }

    public createChildrenByTestCmd() {
        let seperators = [
            ["endwith", ":\n", "declare"],
            ["startwith", "    test.cmd(", "pre"],
            ["endwith", "checks=checks)", "command"],
        ];

        let bias = this.startAt;
        let t, tag, name;
        let fullMatch = true;
        for (let seperator of seperators) {
            t = seperator[0];
            tag = seperator[1];
            name = seperator[2];
            let idx = this.target.content.indexOf(tag, bias);
            if (idx>=this.endAt || idx<0) {
                fullMatch = false;
                break;
            }
            if (t=="endwith") {
                this.children.push(new BaseSegment(this.target, bias, idx+tag.length, name));
                bias = idx + tag.length;
            }
            else if (t=="startwith") {
                this.children.push(new BaseSegment(this.target, bias, idx, name));
                bias = idx;
            }
        }
        if (fullMatch) {
            this.children.push(new BaseSegment(this.target, bias, this.endAt, "post"));
        }
        else {
            this.children = [];
        }
    }
}


export class TailSegment extends BaseSegment {
    public static addInstance(target: TargetFile): boolean {
        if (target.currentAt>=0) {
            return false;
        }
        const nextAt = target.content.length;
        target.root.children.push(new TailSegment(target, target.currentAt, nextAt));
        target.currentAt = nextAt;
        return true;
    }
}

export function createTarget(file: string[]| string): TargetFile {
    if (isNullOrUndefined(file))    return null;
    let fileContent: string[];
    if (typeof file == 'string') {
        if (!existsSync(file))  return null;
        fileContent = readFileSync(file,'utf8').split("\r\n").join("\n").split("\n");
    }
    else {
        fileContent = file;
    }
    let target = new TargetFile(fileContent);
    target.createSegments();
    return target;
}

export function zipFile(zipFile: string, genFile: string, content: string[]) {
    let strContent = content.join("\n");
    let zip = new JSZip();
    zip.sync(()=>{
        if (existsSync(zipFile)) {
            zip.loadAsync(readFileSync(zipFile,'binary')).then(zip => {
                zip.file(genFile, strContent);
            });
        }
        else {
            mkdirSync(dirname(zipFile), {recursive: true});
            zip.file(genFile, strContent);
        }
        zip.generateAsync({type: "nodebuffer"})
        .then(function(content) {
            writeFileSync(zipFile, content);
        });
    });
}

export function loadFromZip(zipFile: string, genFile: string): string[] {
    if (existsSync(zipFile)) {
        let zip = new JSZip();
        let content = undefined;
        zip.sync(()=>{
            zip.loadAsync(readFileSync(zipFile,'binary')).then(zip => {
                const inFile = zip.file(genFile);
                if (!isNullOrUndefined(inFile)) {
                    inFile.async("string").then(data =>{
                        content = data.split("\n");
                    })
                }
            });
        });
        if (!isNullOrUndefined(content)) {
            return content;
        }
    }
    return undefined;
}

export function inplaceGen(outputFolder: string, filename: string, genContent: string[]): string[] {
    let zipGenFile = join(outputFolder, "gen.zip");
    let originA = createTarget(loadFromZip(zipGenFile, filename));
    let customizedA = createTarget(join(outputFolder, filename));
    zipFile(zipGenFile, filename, genContent);
    let target = createTarget(genContent);
    target.merge(originA, customizedA);
    return target.getContent();
}