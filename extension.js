import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.showChat', () => {
      const panel = vscode.window.createWebviewPanel(
        'chatWebview',
        'Git Command Generator',
        vscode.ViewColumn.One,
        {
          enableScripts: true
        }
      );

      panel.webview.html = getWebviewContent();
    })
  );
}

function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <body>
      <div id="root"></div>
      <script src="webview-panel/build/static/js/main.js"></script>
    </body>
    </html>
  `;
}
