import * as vscode from 'vscode';
import { FileData } from "./Data";
import { FolderNode } from "./folderNode";
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

async function getLine(file: vscode.Uri){
	const content = await vscode.workspace.fs.readFile(file);
	const text = Buffer.from(content).toString("utf8");
	const size: number = text.split("\n").length;
	return size;
}

function addFile(root: FolderNode, file: FileData){
	const parts = file.path.split("/").filter(Boolean);

	let current = root;

	for (let i = 0; i < parts.length - 1; i++) {
		const folderName = parts[i];
		
		if (!current.children.has(folderName)) {
			current.children.set(folderName, new FolderNode(folderName));
		}

		current = current.children.get(folderName)!;
	}

	current.files.push(file);
}

function calculateFileCount(node: FolderNode){
	let count = node.files.length;

	for(const child of node.children.values()){
		count += calculateFileCount(child);
	}

	node.fileCount = count;

	return count;
}
