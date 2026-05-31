// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "code-city" is now activeeeeeeee!');
	const files = await vscode.workspace.findFiles(
    "**/*",
    "**/{node_modules,dist,.git}/**"
	);

	for (const file of files) {
		console.log(file.path);
		const content = await vscode.workspace.fs.readFile(file);

		const text = Buffer.from(content).toString("utf8");

		const lines = text.split("\n").length;
		console.log("linhas: " + lines);
	}



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('code-city.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Code City!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
