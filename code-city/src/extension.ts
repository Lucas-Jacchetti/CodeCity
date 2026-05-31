import * as vscode from 'vscode';
import { FileData } from "./Data";
import * as path from "path";

export async function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "code-city" is now activeeeeeeee!');
	const allowedExtensions = [
		".ts",
		".tsx",
		".js",
		".jsx",
		".json",
		".css",
		".html"
	];

	const dataArray: FileData[] = [];
	const files = await getFiles();

	for(const file of files){
		const ext = path.extname(file.path);
		const lineCount = await getLine(file);

		if (!allowedExtensions.includes(ext)) {
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

export async function getFiles(){
	return await vscode.workspace.findFiles("**/*", "**/{node_modules,dist,.git}/**");
}

export async function getLine(file: vscode.Uri){
	const content = await vscode.workspace.fs.readFile(file);
	const text = Buffer.from(content).toString("utf8");
	const size: number = text.split("\n").length;
	return size;
}
