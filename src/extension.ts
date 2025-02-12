// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { NomnomlViewer } from "./Nomnoml";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "jdl-noml-uml.render",
    () => {
      const activeTextEditor = vscode.window.activeTextEditor;
      if (activeTextEditor) {
        const document = activeTextEditor.document;
        if (
          document.languageId === "jdl" ||
          document.languageId === "nomnoml"
        ) {
          new NomnomlViewer(activeTextEditor.document);
        } else {
          vscode.window.showErrorMessage(
            "Neither a JDL file nor a Nomnoml file!"
          );
        }
      } else {
        vscode.window.showErrorMessage("No file open!");
      }
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
