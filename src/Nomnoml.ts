import * as vscode from "vscode";
import * as path from "path";
import { jdlToNoml } from "./JDLToNoml";

export class NomnomlViewer {
  private _doc: vscode.TextDocument;
  private _txt: string = "";

  constructor(doc: vscode.TextDocument) {
    this._doc = doc;
    this.view();
  }

  public view() {
    const panel = vscode.window.createWebviewPanel(
      "nomnoml.viewer",
      "Nomnoml Viewer",
      vscode.ViewColumn.Beside,
      {}
    );

    const renderLoop = setInterval(() => {
      let text = this._doc.getText();
      if (this._txt === text) {
        return;
      }
      this._txt = text;
      if (path.extname(this._doc.fileName) === ".jdl") {
        text = jdlToNoml(text);
      }

      const nomnoml = require("nomnoml");
      const svg = nomnoml.renderSvg(
        !text.includes("#background")
          ? text.concat("\n\n#background: lightgrey")
          : text
      );

      panel.webview.html = `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                </head>
                <body>
                    <div>
                        ${svg}
                    </div>
                </body>
            </html>
            `;
    }, 500);

    panel.onDidDispose(() => {
      clearInterval(renderLoop);
    });
  }

  public get doc() {
    return this._doc;
  }
  public get uri() {
    return this._doc.uri;
  }
}
