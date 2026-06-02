import { FileData } from "./fileData";

export class FolderData {
    private name: string;
    private fileCount: number;
    private lineCount: number; 
    private children = new Map<string, FolderData>();
    private files: FileData[] = [];

    constructor(name: string) {
        this.name = name;
        this.fileCount = 0;
        this.lineCount = 0;
    }

    getName(): string{
        return this.name;
    }

    getLineCount(): number{
        return this.lineCount;
    }

    setLineCount(lineCount: number){
        this.lineCount = lineCount;
    }

    getFileCount(): number{
        return this.fileCount;
    }

    setFileCount(fileCount: number){
        this.fileCount = fileCount;
    }

    getChildren(): Map<string, FolderData>{
        return this.children;
    }

    getFiles(): FileData[]{
        return this.files;
    }
}