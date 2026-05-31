import { FileData } from "./Data";

export class FolderNode {
    name: string;
    fileCount = 0;
    children = new Map<string, FolderNode>();
    files: FileData[] = [];

    constructor(name: string) {
        this.name = name;
    }
}