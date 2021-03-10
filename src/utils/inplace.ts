import { EOL } from 'os';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { isNullOrUndefined, distancePercentage } from './helper';
import { join, dirname } from 'path';

import JSZip = require('jszip-sync');

export class TargetFile {
    content: string;
    currentAt: number;
    root: BaseSegment;

    public constructor(fileContent: string[]) {
        this.content = fileContent.join('\n');
        this.currentAt = 0;
        this.root = new BaseSegment(this, 0, fileContent.length);
    }

    public createSegments(): void {
        const SegmentTypes = [HeadSegment, TestStepSegment, TailSegment];

        let matchOne = true;
        while (matchOne && this.currentAt < this.content.length) {
            matchOne = false;
            for (const segmentType of SegmentTypes) {
                if (segmentType.addInstance(this)) {
                    matchOne = true;
                    break;
                }
            }
        }
    }

    public getContent(): string[] {
        return this.root.genResult().split('\n');
    }

    public merge(originA: TargetFile, customizedA: TargetFile): void {
        if (isNullOrUndefined(originA)) return;
        if (!isNullOrUndefined(customizedA)) {
            originA.root.matchCustomize(customizedA.root);
        }
        this.root.matchVA(originA.root);

        this.root.alignOrder(customizedA?.root);
        this.root.addCustomize(customizedA?.root);
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

    public constructor(target: TargetFile, startAt: number, endAt: number, name = '') {
        this.startAt = startAt;
        this.endAt = endAt;
        this.children = [];
        if (name.length > 0) {
            this.name = this.constructor.name + '_' + name;
        } else {
            const content = target.content.substr(startAt, endAt - startAt);
            if (content.trim().startsWith('def ') || content.trim().startsWith('def ')) {
                // omit parameter list for 'def' and 'class' sentence
                const firstLine = content.split('\n')[0].trim();
                const t = firstLine.indexOf('(');
                if (t > -1) {
                    this.name = firstLine.slice(0, t);
                } else {
                    this.name = firstLine;
                }
            } else {
                this.name = this.constructor.name + '_' + content.split('\n')[0];
            }
        }
        this.status = SegmentStatus.Origin;
        this.target = target;
        this.customized = undefined;
        this.originA = undefined;
    }

    public get Content(): string {
        return this.target.content.slice(this.startAt, this.endAt);
    }

    public matchCustomize(customized: BaseSegment): void {
        if (this.Content === customized.Content) {
            this.status = SegmentStatus.Origin;
        } else {
            this.status = SegmentStatus.Modified;
        }
        this.customized = customized;

        const usedChild = [];
        for (let i = 0; i < this.children.length; i++) {
            const originSeg = this.children[i];
            originSeg.status = SegmentStatus.Deleted;

            const customizedIdx = customized.findChild(originSeg, usedChild);
            if (customizedIdx >= 0) {
                originSeg.matchCustomize(customized.children[customizedIdx]);
            }
        }

        for (let i = 0; i < customized.children.length; i++) {
            if (!usedChild.includes(i)) {
                const customizedSeg = customized.children[i];
                customizedSeg.status = SegmentStatus.Added;
            }
        }
    }

    public matchVA(originA: BaseSegment): void {
        this.originA = originA;
        const usedChild = [];
        for (let i = 0; i < this.children.length; i++) {
            const vBSeg = this.children[i];
            const oAIdx = originA.findChild(vBSeg, usedChild);
            if (oAIdx >= 0) {
                vBSeg.matchVA(originA.children[oAIdx]);
            }
        }
    }

    public findChild(childSeg: BaseSegment, used: any[] = undefined, startPos = 0): number {
        if (isNullOrUndefined(used)) used = [];

        const candidates = [];

        // filter candidates by totally-match-name
        for (let i = startPos; i < this.children.length; i++) {
            if (!used.includes(i) && this.children[i].name === childSeg.name) {
                candidates.push(i);
            }
        }
        if (candidates.length === 1) {
            used.push(candidates[0]);
            return candidates[0];
        }

        // // if no name matched, all members are candidates
        // if (candidates.length<=0) {
        //     distThreashold = 0.3
        //     for (let i=startPos; i<this.children.length; i++) {
        //         if (!used.includes(i)) {
        //             candidates.push(i);
        //         }
        //     }
        // }

        // select candidate by edit distance
        let minDist;
        let ret = -1;
        for (const i of candidates) {
            const d = distancePercentage(childSeg.Content, this.children[i].Content);
            if (isNullOrUndefined(minDist) || d < minDist) {
                minDist = d;
                ret = i;
                break;
            }
        }
        if (ret >= 0) {
            used.push(ret);
            return ret;
        }
        return -1;
    }

    public alignOrder(baseline: BaseSegment): void {
        if (isNullOrUndefined(baseline)) return;

        let p = 0;
        for (const child of baseline.children) {
            // new segement  --> keep current position
            while (
                p < this.children.length &&
                isNullOrUndefined(this.children[p].originA?.customized)
            )
                p++;

            // customized segement --> find pos in customize, and move.
            let curPos = -1;
            for (let j = p; j < this.children.length; j++) {
                if (this.children[j].originA?.customized === child) {
                    curPos = j;
                }
            }
            if (curPos >= 0) {
                const moving = this.children[curPos];
                this.children.splice(curPos, 1);
                this.children.splice(p, 0, moving);
                p += 1;
            }
        }

        for (const child of this.children) {
            child.alignOrder(child.originA);
        }
    }

    public addCustomize(customizedA: BaseSegment): void {
        if (isNullOrUndefined(customizedA)) return;

        // merge new added in customziedA into this
        let previousIndex = -1;
        for (const child of this.children) {
            child.addCustomize(child.originA?.customized);
        }

        for (let i = 0; i < customizedA.children.length; i++) {
            const seg = customizedA.children[i];

            if (seg.status === SegmentStatus.Added) {
                this.children.splice(previousIndex + 1, 0, seg);
                previousIndex += 1;
            } else {
                for (let j = 0; j < this.children.length; j++) {
                    if (this.children[j].originA?.customized === seg) {
                        previousIndex = j;
                        break;
                    }
                }
            }
        }
    }

    public genResult(): string {
        if (this.originA?.status === SegmentStatus.Deleted) {
            if (this.originA.Content !== this.Content) {
                return this.Content;
            } else {
                return '';
            }
        }

        const solidChildren = this.children.filter((child) => {
            return (
                child.originA?.status !== SegmentStatus.Deleted ||
                child.Content !== child.originA?.Content
            );
        });

        let ret = '';
        if (solidChildren.length === 0) {
            if (
                isNullOrUndefined(this.originA) ||
                this.status === SegmentStatus.Added ||
                this.originA.status === SegmentStatus.Origin ||
                this.originA.Content !== this.Content
            ) {
                ret += this.Content;
            } else if (this.originA.status === SegmentStatus.Modified) {
                ret += this.originA.customized.Content;
            }
        } else {
            for (let i = 0; i < solidChildren.length; i++) {
                ret += solidChildren[i].genResult();
            }
        }
        return ret;
    }

    public createChildrenByIndent(): void {
        const lines = this.target.content.slice(this.startAt, this.endAt).split('\n');

        function lineIndent(line) {
            const firstCharAt = line.search(/\S/);
            return firstCharAt >= 0 ? firstCharAt : line.length;
        }
        const myIndent = lineIndent(lines[0]);

        let curStart = 0;
        let curEnd = 0;
        let curParathesisCount = 0;

        function getBiasOfLine(cur, startAt) {
            let ret = startAt;
            for (let i = 0; i < cur; i++) {
                ret += lines[i].length;
                if (i < lines.length - 1) ret += 1; // for \n
            }
            return ret;
        }

        while (curEnd < lines.length) {
            if (
                curParathesisCount === 0 && // all parathesis completed
                curEnd > curStart && // length greater than zero
                myIndent === lineIndent(lines[curEnd]) && // in the same indent with the parent segment
                lines[curEnd].search(/\S/) >= 0 // not full-of-space line
            ) {
                const child = new BaseSegment(
                    this.target,
                    getBiasOfLine(curStart, this.startAt),
                    getBiasOfLine(curEnd, this.startAt),
                );
                child.createChildrenByIndent();
                this.children.push(child);
                curStart = curEnd;
            }
            curParathesisCount += (lines[curEnd].match(/[([{]/g) || []).length;
            curParathesisCount -= (lines[curEnd].match(/[)\]}]/g) || []).length;
            curEnd += 1;
        }

        if (this.children.length > 0) {
            if (curEnd > curStart) {
                const child = new BaseSegment(
                    this.target,
                    getBiasOfLine(curStart, this.startAt),
                    getBiasOfLine(curEnd, this.startAt),
                );
                child.createChildrenByIndent();
                this.children.push(child);
            }
        } else {
            // find child indents
            curEnd = 1;
            curParathesisCount = 0;
            let postIdx = 1;
            while (curEnd < lines.length) {
                if (lineIndent(lines[curEnd]) > myIndent) {
                    postIdx = curEnd + 1;
                    while (
                        postIdx < lines.length &&
                        (lineIndent(lines[postIdx]) !== myIndent ||
                            lines[postIdx].trim().length === 0)
                    ) {
                        postIdx += 1;
                    }
                    break;
                }
                curEnd += 1;
            }
            if (postIdx > curEnd && curEnd < lines.length) {
                let child = new BaseSegment(
                    this.target,
                    getBiasOfLine(0, this.startAt),
                    getBiasOfLine(curEnd, this.startAt),
                    'pre',
                );
                this.children.push(child);

                child = new BaseSegment(
                    this.target,
                    getBiasOfLine(curEnd, this.startAt),
                    getBiasOfLine(postIdx, this.startAt),
                    'body',
                );
                child.createChildrenByIndent();
                this.children.push(child);

                if (lines.length > postIdx) {
                    const child = new BaseSegment(
                        this.target,
                        getBiasOfLine(postIdx, this.startAt),
                        getBiasOfLine(lines.length, this.startAt),
                        'post',
                    );
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
    const nextClass = content.search(/\n# Test class/);
    const nextCustomized = content.search(/\n# Customized/);

    const candidates = [nextEnv, nextExample, nextCase, nextClass, nextCustomized];
    candidates.sort((a, b) => a - b);
    for (const ret of candidates) {
        if (ret >= 0) {
            return ret;
        }
    }
    return -1;
}
export class HeadSegment extends BaseSegment {
    public static addInstance(target: TargetFile): boolean {
        if (target.currentAt === 0) {
            let nextAt = nextStepAt(target.content);
            if (nextAt < 0) {
                nextAt = target.content.length - 1;
            }
            nextAt += 1;
            const newStep = new HeadSegment(target, target.currentAt, nextAt);
            target.root.children.push(newStep);
            newStep.createChildrenByIndent();
            target.currentAt = nextAt;
            return true;
        }
        return false;
    }
}

export class DefSegment extends BaseSegment {}

export class TestStepSegment extends DefSegment {
    public static addInstance(target: TargetFile): boolean {
        const remain = target.content.slice(target.currentAt);
        if (target.currentAt >= 0) {
            let nextAt = nextStepAt(remain);
            if (nextAt < 0) {
                nextAt = remain.length - 1;
            }
            nextAt += target.currentAt + 1;
            const newStep = new TestStepSegment(
                target,
                target.currentAt,
                nextAt,
                remain.slice(2, remain.indexOf('\n')),
            );
            target.root.children.push(newStep);
            newStep.createChildrenByIndent();
            target.currentAt = nextAt;
            return true;
        }
        return false;
    }

    public createChildrenByTestCmd(): void {
        const seperators = [
            ['endwith', ':\n', 'declare'],
            ['startwith', '    test.cmd(', 'pre'],
            ['endwith', 'checks=checks)', 'command'],
        ];

        let bias = this.startAt;
        let t, tag, name;
        let fullMatch = true;
        for (const seperator of seperators) {
            t = seperator[0];
            tag = seperator[1];
            name = seperator[2];
            const idx = this.target.content.indexOf(tag, bias);
            if (idx >= this.endAt || idx < 0) {
                fullMatch = false;
                break;
            }
            if (t === 'endwith') {
                this.children.push(new BaseSegment(this.target, bias, idx + tag.length, name));
                bias = idx + tag.length;
            } else if (t === 'startwith') {
                this.children.push(new BaseSegment(this.target, bias, idx, name));
                bias = idx;
            }
        }
        if (fullMatch) {
            this.children.push(new BaseSegment(this.target, bias, this.endAt, 'post'));
        } else {
            this.children = [];
        }
    }
}

export class TailSegment extends BaseSegment {
    public static addInstance(target: TargetFile): boolean {
        if (target.currentAt >= 0) {
            return false;
        }
        const nextAt = target.content.length;
        const newStep = new TailSegment(target, target.currentAt, nextAt);
        target.root.children.push(newStep);
        newStep.createChildrenByIndent();
        target.currentAt = nextAt;
        return true;
    }
}

export function createTarget(file: string[] | string): TargetFile {
    if (isNullOrUndefined(file)) return null;
    let fileContent: string[];
    if (typeof file === 'string') {
        if (!existsSync(file)) return null;
        fileContent = readFileSync(file, 'utf8').split('\r\n').join('\n').split('\n');
    } else {
        fileContent = file;
    }
    const target = new TargetFile(fileContent);
    target.createSegments();
    return target;
}

export function zipFile(zipFile: string, genFile: string, content: string[]): void {
    const strContent = content.join('\n');
    const zip = new JSZip();
    zip.sync(() => {
        if (existsSync(zipFile)) {
            zip.loadAsync(readFileSync(zipFile, 'binary')).then((zip) => {
                zip.file(genFile, strContent);
            });
        } else {
            mkdirSync(dirname(zipFile), { recursive: true });
            zip.file(genFile, strContent);
        }
        zip.generateAsync({ type: 'nodebuffer' }).then(function (content) {
            writeFileSync(zipFile, content);
        });
    });
}

export function loadFromZip(zipFile: string, genFile: string): string[] {
    if (existsSync(zipFile)) {
        const zip = new JSZip();
        let content;
        zip.sync(() => {
            zip.loadAsync(readFileSync(zipFile, 'binary')).then((zip) => {
                const inFile = zip.file(genFile);
                if (!isNullOrUndefined(inFile)) {
                    inFile.async('string').then((data) => {
                        content = data.split('\n');
                    });
                }
            });
        });
        if (!isNullOrUndefined(content)) {
            return content;
        }
    }
    return undefined;
}

let zipBuffer = [];

export function openInplaceGen(): void {
    zipBuffer = [];
}

export function inplaceGen(
    outputFolder: string,
    filename: string,
    genContent: string[] | string,
): string[] {
    if (typeof genContent === 'string') {
        genContent = genContent.split(EOL);
    }
    const zipGenFile = join(outputFolder, 'gen.zip');
    const originA = createTarget(loadFromZip(zipGenFile, filename));
    const customizedA = createTarget(join(outputFolder, filename));
    putToZip(outputFolder, filename, genContent);
    const target = createTarget(genContent);
    target.merge(originA, customizedA);
    return target.getContent();
}

export function putToZip(outputFolder: string, filename: string, genContent: string[]): void {
    const zipGenFile = join(outputFolder, 'gen.zip');
    zipBuffer.push([zipGenFile, filename, genContent]);
}

export function closeInplaceGen(): void {
    for (const meta of zipBuffer) {
        zipFile(meta[0], meta[1], meta[2]);
    }
}
