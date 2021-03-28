import * as vscode from 'vscode';

type Translation = {
	id: string;
	translation: string;
};

export function activate(context: vscode.ExtensionContext) {
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('showtranslationinstances.helloWorld', async () => {
		let { activeTextEditor } = vscode.window;
		let selection: string = activeTextEditor?.document.getText(activeTextEditor?.selection) || "";
		if (selection.length == 0) {
			console.debug('Using clipboard');
			let onreadclipboard = (value: string) => {
				if (value.length == 0) {
					vscode.window.showErrorMessage('No text selected or found in clipboard');
				}
				selection = value;
			};
			let onrejectedclipboardread = (reason:any) => {
				vscode.window.showErrorMessage('Error reading clipboard');
			};
			await vscode.env.clipboard.readText().then(onreadclipboard, onrejectedclipboardread);
		}
		const relativePattern = new vscode.RelativePattern(vscode.workspace.workspaceFolders?.[0] || "", 'i18n/en.json');
		let uri = vscode.Uri.file(`${relativePattern.base}/${relativePattern.pattern}`);
		let onfulfilled = (value: vscode.TextDocument) => {
			let translations: Array<Translation> = JSON.parse(value.getText());
			let translation = translations.find(item => item.translation == selection);
			if (typeof translation === 'undefined' || translation === null) {
				vscode.window.showErrorMessage(`No matching translation entry.`);
				return;
			}
			vscode.commands.executeCommand('workbench.action.findInFiles', {
				query: translation?.id,
				filesToInclude: '*.go',
				triggerSearch: true
			});
		};
		let onrejected = (reason: any) => {
			vscode.window.showErrorMessage('No matching translation entry');
		};
		vscode.workspace.openTextDocument(uri).then(onfulfilled, onrejected);
	});
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
