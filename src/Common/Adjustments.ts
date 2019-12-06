/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export class Adjustments
{
    public constructor (adjustments: any)
    {
        this._adjustments = adjustments;
    }

    public GetFlatten(path: string): string
    {
        let pathAdjustment = this._adjustments[path.toLowerCase()];
        if (pathAdjustment == undefined || typeof pathAdjustment != "string")
            return "";
        return pathAdjustment;
    }

    public IsPathExcludedFromInfoResponse(path: string): boolean
    {
        let pathAdjustment = this._adjustments[path.toLowerCase()];
        if (pathAdjustment == undefined || typeof pathAdjustment != "object" || pathAdjustment['info'] == undefined)
            return false;
        return !pathAdjustment["info"];
    }

    public IsPathIncludedInInfoResponse(path: string): boolean
    {
        let pathAdjustment = this._adjustments[path.toLowerCase()];
        if (pathAdjustment == undefined || typeof pathAdjustment != "object" || pathAdjustment['info'] == undefined)
            return false;
        return pathAdjustment["info"];
    }

    public IsPathIncludedInResponse(path: string): boolean
    {
        let pathAdjustment = this._adjustments[path.toLowerCase()];
        if (pathAdjustment == undefined || typeof pathAdjustment != "object" || pathAdjustment['response'] == undefined)
            return false;
        return pathAdjustment["response"];
    }

    public IsPathExcludedFromResponse(path: string): boolean
    {
        let pathAdjustment = this._adjustments[path.toLowerCase()];
        if (pathAdjustment == undefined || typeof pathAdjustment != "object" || pathAdjustment['response'] == undefined)
            return false;
        return !pathAdjustment["response"];
    }

    public IsPathIncludedInRequest(path: string): boolean
    {
        let pathAdjustment = this._adjustments[path.toLowerCase()];
        if (pathAdjustment == undefined || typeof pathAdjustment != "object" || pathAdjustment['request'] == undefined)
            return false;
        return pathAdjustment["request"];
    }

    public IsPathExcludedFromRequest(path: string): boolean
    {
        let pathAdjustment = this._adjustments[path.toLowerCase()];
        if (pathAdjustment == undefined || typeof pathAdjustment != "object" || pathAdjustment['request'] == undefined)
            return false;
        return pathAdjustment["request"];
    }

    private _adjustments: any;
}
