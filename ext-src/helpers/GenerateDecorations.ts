import * as vscode from 'vscode';
import { Problem } from '../types';
import { FixSuggestionCommandHandler } from '../commands';

const removedTextBackgroundColor = new vscode.ThemeColor('diffEditor.removedTextBackground');
const insertedTextBackgroundColor = new vscode.ThemeColor('diffEditor.insertedTextBackground');

export const problemDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: removedTextBackgroundColor,
  isWholeLine: true,
  overviewRulerLane: 7,
  overviewRulerColor: removedTextBackgroundColor,
});

export const suggestionDecoration = vscode.window.createTextEditorDecorationType({
  backgroundColor: insertedTextBackgroundColor,
  isWholeLine: true,
  overviewRulerLane: 7,
  overviewRulerColor: insertedTextBackgroundColor,
});

export function GenerateDecorations(
  results: Problem[],
  editor: vscode.TextEditor,
  jobId?: string,
  _debug?: vscode.OutputChannel,
): {
  decorationType: vscode.TextEditorDecorationType;
  decorations: vscode.DecorationOptions[];
} {
  const decorations: vscode.DecorationOptions[] = results
    .filter(vulnerability => {
      const { endLine, startLine } = vulnerability;
      if ((endLine - 1) < 0 || (startLine - 1) < 0) {
        return false;
      }

      return true;
    })
    .map(vulnerability => {
      const { startLine, endLine, path, id } = vulnerability;

      const range = new vscode.Range(
        startLine - 1,
        0,
        endLine - 1,
        editor.document.lineAt(endLine - 1).text.length,
      );

      const payload: FixSuggestionCommandHandler = {
        path,
        id,
        jobId,
        vuln: vulnerability,
      };

      const viewDescriptionURI = encodeURIComponent(JSON.stringify(payload));
      _debug?.appendLine("Decoration: " + viewDescriptionURI);
      const hoverFixMessage = `**[Fix](command:metabob.fixSuggestion?${viewDescriptionURI} "This action will display a comprehensive view of the issue along with a recommended solution.")**`;
      const hoverViewDescriptionMessage = `**[More Details](command:metabob.showDetailSuggestion?${viewDescriptionURI} "This action will display a comprehensive view of the issue.")**`;
      const hoverMessage = new vscode.MarkdownString(
        `### **CATEGORY:** ${vulnerability.category}\n\n${vulnerability.summary}\n\n${hoverFixMessage} |\r${hoverViewDescriptionMessage}`,
      );
      hoverMessage.isTrusted = true;

      return {
        range,
        hoverMessage,
      } satisfies vscode.DecorationOptions;
    });

  return {
    decorationType: problemDecoration,
    decorations,
  };
}
