import * as vscode from 'vscode';

export class MetaBobCodeActionProvider implements vscode.CodeActionProvider {
  private readonly disposable: vscode.Disposable;

  constructor() {
    // Register the code action provider for a specific document selector
    this.disposable = vscode.languages.registerCodeActionsProvider(
      { scheme: 'file', language: '*' },
      this
    );
  }

  dispose() {}
  // Implement the provideCodeActions method to return the code actions for a given range
  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range
  ): vscode.ProviderResult<(vscode.Command | vscode.CodeAction)[]> {
    // Return an array of code actions with the apply fix command
    return [
      {
        command: 'metabob.applyFix',
        title: 'Apply Fix',
        arguments: [document, range],
      },
    ];
  }

  // Add a command to apply the fix
  public applyFix(document: vscode.TextDocument, range: vscode.Range): void {
    // Implement the fix logic here
  }
}
