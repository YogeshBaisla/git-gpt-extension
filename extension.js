const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.showChat', () => {
      const panel = vscode.window.createWebviewPanel(
        'chatWebview', // Identifies the type of the webview. Used internally
        'Git Command Generator', // Title of the panel displayed to the user
        vscode.ViewColumn.One, // Editor column to show the new webview panel in
        {
          enableScripts: true, // Enable scripts in the webview
        }
      );

      panel.webview.html = getWebviewContent();
    })
  );
}

/**
 * Function to return the HTML content for the webview panel
 * @returns {string}
 */
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

/**
 * This method is called when your extension is deactivated
 */
function deactivate() {}

module.exports = {
  activate,
  deactivate
};
