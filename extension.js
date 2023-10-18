const vscode = require('vscode');
const axios = require('axios');

function activate(context) {
	let disposableSummarize = vscode.commands.registerCommand('codet5-.summarizeCode', async () => {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
	  
		try {
			const response = await axios.post('http://127.0.0.1:5000/api/summarizeModel', {
				text: selectedText
			});
		
			const summarizedCode = response.data.result;
	  
			// Insert the completed code before the selected text
			const insertLine = editor.selection.start.line;
			const insertPosition = new vscode.Position(insertLine, 0);
			editor.edit(editBuilder => {
			editBuilder.insert(insertPosition, '//  '+ summarizedCode + '\n');
			});
	  
		} catch (error) {
		  vscode.window.showErrorMessage('Error!');
		}
	  });
  	let disposableAutocomplete = vscode.commands.registerCommand('codet5-.autocompleteCode', async () => {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
	
		try {
		const response = await axios.post('http://127.0.0.1:5000/api/autocompleteModel', {
			text: selectedText
		});
	
		const completedCode = response.data.result;
	
		// Insert the completed code in the next line of the selected text
		const insertLine = editor.selection.end.line + 1;
		const insertPosition = new vscode.Position(insertLine, 0);
		editor.edit(editBuilder => {
			editBuilder.insert(insertPosition, '\n' + completedCode);
		});
	
		} catch (error) {
		vscode.window.showErrorMessage('Error!');
		}
	});
	let disposableAutocompletePython = vscode.commands.registerCommand('codet5-.autocompleteCodePython', async () => {
		const editor = vscode.window.activeTextEditor;
		const selectedText = editor.document.getText(editor.selection);
	
		try {
		const response = await axios.post('http://127.0.0.1:5000/api/autocompleteModelPython', {
			text: selectedText
		});
	
		const completedCode = response.data.result;
	
		// Insert the completed code in the next line of the selected text
		const insertLine = editor.selection.end.line + 1;
		const insertPosition = new vscode.Position(insertLine, 0);
		editor.edit(editBuilder => {
			editBuilder.insert(insertPosition, '\n' + completedCode);
		});
	
		} catch (error) {
		vscode.window.showErrorMessage('Error!');
		}
	});
  context.subscriptions.push(disposableSummarize, disposableAutocomplete, disposableAutocompletePython);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};