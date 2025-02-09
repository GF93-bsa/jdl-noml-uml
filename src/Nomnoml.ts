import * as vscode from "vscode";
import * as path from "path";
import { jdlToNoml } from "./JDLToNoml";

export class NomnomlViewer {
  private _doc: vscode.TextDocument;
  private _nml: string = "";
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
      const text = this._doc.getText();
      if (this._txt === text) {
        return;
      }
      this._txt = text;
      this._nml =
        path.extname(this._doc.fileName) === ".jdl" ? jdlToNoml(text) : text;

      const nomnoml = require("nomnoml");
      const svg = nomnoml.renderSvg(
        !this._nml.includes("#background")
          ? this._nml.concat("\n\n#background: lightgrey")
          : this._nml
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
