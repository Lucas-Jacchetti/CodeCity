import * as vscode from 'vscode';
import { FileData } from "./fileData";
import { FolderData } from "./folderData";
import * as path from "path";

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "code-city" is now activeeeeeeee!');
	const disallowedExtensions = [
		".png",
		".jpg",
		".jpeg",
		".gif",
		".webp",
		".svg",
		".ico",
		".mp4",
		".mp3",
		".wav",
		".zip",
		".rar",
		".7z",
		".pdf"
	];
	const disallowedFiles = [
		"package-lock.json",
		"yarn.lock",
		"pnpm-lock.yaml"
	];

	const dataArray: FileData[] = [];
	const files = await getFiles();

	populateFileDataArray(dataArray, files, disallowedExtensions, disallowedFiles);

	const root = new FolderData("root");

	for (const file of dataArray) {
		addFile(root, file);
	}

	calculateMetrics(root);

	const disposable = vscode.commands.registerCommand('code-city.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		vscode.window.showInformationMessage('Hello World from Code City!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

async function getFiles(){
	return await vscode.workspace.findFiles("**/*", "**/{node_modules,dist,.git}/**");
}

async function getLine(file: vscode.Uri): Promise<number>{
	const content = await vscode.workspace.fs.readFile(file);
	const text = Buffer.from(content).toString("utf8");
	const size: number = text.split("\n").length;
	return size;
}

function addFile(root: FolderData, file: FileData){
	const parts = file.getPath().normalize(file.getPath()).split(path.sep).filter(Boolean);

	let current = root;

	for (let i = 0; i < parts.length - 1; i++) {
		const folderName = parts[i];
		
		if (!current.getChildren().has(folderName)) {
			current.getChildren().set(folderName, new FolderData(folderName));
		}

		current = current.getChildren().get(folderName)!;
	}

	current.getFiles().push(file);
}

function calculateMetrics(node: FolderData){
	let files = node.getFiles().length;
	let lines = 0

	for(const file of node.getFiles()){
		lines += file.getLineCount();
	}

	for (const child of node.getChildren().values()) {
        calculateMetrics(child);

        files += child.getFileCount();
        lines += child.getLineCount();
    }

    node.setFileCount(files);
    node.setLineCount(lines);
}

async function populateFileDataArray(dataArray: FileData[], files: vscode.Uri[], disallowedExtensions: string[], disallowedFiles: string[]){
	for(const file of files){
		const ext = path.extname(file.path);
		const fileName = path.basename(file.path);
		const lineCount = await getLine(file);

		if (disallowedExtensions.includes(ext)) {
			continue;
		}
		if (disallowedFiles.includes(fileName)) {
			continue;
		}

		const data = new FileData(file.path, lineCount, ext);
		dataArray.push(data);
	}
}
