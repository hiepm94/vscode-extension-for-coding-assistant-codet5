const vscode = require('vscode');
const axios = require('axios');

function activate(context) {
  let disposable = vscode.commands.registerCommand('codet5p.showQuickPick', () => {
    const editor = vscode.window.activeTextEditor;
    const selectedText = editor.document.getText(editor.selection);

    if (selectedText) {
      const actions = ['CodeT5+: Code Summarization', 'CodeT5+: Code Autocompletion','CodeT5+: Code Autocompletion (Python specific)',
                        'CodeT5+: Text-to-code Generatation', 'CodeT5+: Text-to-code Generatation (Python specific)']
      const options = {
        placeHolder: 'Select an action'
      };
      vscode.window.showQuickPick(actions, options)
        .then(async selectedAction => {
          switch (selectedAction) {
            case 'CodeT5+: Code Summarization':
              try {
                const response = await axios.post('http://127.0.0.1:5000/api/summarizeModel', {
                  text: selectedText
                });
          
                const summarizedCode = response.data.result;
          
                // Insert the summarized code before the selected text
                const insertLine = editor.selection.start.line;
                const insertPosition = new vscode.Position(insertLine, 0);
                editor.edit(editBuilder => {
                  editBuilder.insert(insertPosition, '#  ' + summarizedCode + '\n');
                });
          
              } catch (error) {
                vscode.window.showErrorMessage('Error!');
              }
              break;
          
            case 'CodeT5+: Code Autocompletion':
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
              break;
            
            case 'CodeT5+: Code Autocompletion (Python specific)':
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
              break;
            
            case 'CodeT5+: Text-to-code Generatation':
              try {
                const response = await axios.post('http://127.0.0.1:5000/api/gencodeModel', {
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
              break;
            case 'CodeT5+: Text-to-code Generatation (Python specific)':
              try {
                const response = await axios.post('http://127.0.0.1:5000/api/gencodeModelPython', {
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
              break;
            default:
              vscode.window.showErrorMessage('Error!');
              break;
          }
        });
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};