export class FileData {
	private path: string;
	private lineCount: number;
	private extension: string;


	constructor(path: string, lineCount: number, extension: string) {
		this.path = path;
		this.lineCount = lineCount;
		this.extension = extension;
	}

	getPath(): string{
		return this.path;
	}

	getLineCount(): number{
		return this.lineCount;
	}

	getExtension(): string{
		return this.extension;
	}
}
