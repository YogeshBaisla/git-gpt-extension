const vscode = require('vscode');
const { OpenAI } = require('openai'); 

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.showChat', async () => {
      const panel = vscode.window.createWebviewPanel(
        'chatWebview',
        'Git Command Generator',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getWebviewContent();

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(async (message) => {
        if (message.command === 'generateGitCommand') {
          const userInput = message.text;
          try {
            const gitCommand = await generateGitCommand(userInput);
            panel.webview.postMessage({ type: 'gitCommand', data: gitCommand });
          } catch (error) {
            panel.webview.postMessage({ type: 'error', data: error.message });
          }
        } else if (message.command === 'executeGitCommand') {
          executeGitCommandInTerminal(message.text);
        }
      });
    })
  );
}

async function generateGitCommand(query) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        { role: "system", content: "You are a helpful assistant who generates Git commands." },
        { role: "user", content: query },
      ],
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating Git command:', error);
    throw new Error('Failed to generate Git command. Please try again.');
  }
}

// Function to execute the generated Git command in the terminal
function executeGitCommandInTerminal(gitCommand) {
  const terminal = vscode.window.createTerminal('Git Command Executor');
  terminal.sendText(gitCommand);
  terminal.show();
}

function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <body>
      <div id="root">
        <input type="text" id="input" placeholder="Enter your query" />
        <button id="generateBtn">Generate Git Command</button>
        <button id="executeBtn" style="display: none;">Execute Git Command</button>
        <div id="output"></div>
      </div>
      <script>
        const vscode = acquireVsCodeApi();

        document.getElementById('generateBtn').addEventListener('click', () => {
          const userInput = document.getElementById('input').value;
          vscode.postMessage({ command: 'generateGitCommand', text: userInput });
        });

        document.getElementById('executeBtn').addEventListener('click', () => {
          const gitCommand = document.getElementById('output').innerText.replace('Generated Git Command: ', '');
          vscode.postMessage({ command: 'executeGitCommand', text: gitCommand });
        });

        window.addEventListener('message', (event) => {
          const message = event.data; 

          switch (message.type) {
            case 'gitCommand':
              document.getElementById('output').innerText = 'Generated Git Command: ' + message.data;
              document.getElementById('executeBtn').style.display = 'block';
              break;
            case 'error':
              document.getElementById('output').innerText = 'Error: ' + message.data;
              break;
          }
        });
      </script>
    </body>
    </html>
  `;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
