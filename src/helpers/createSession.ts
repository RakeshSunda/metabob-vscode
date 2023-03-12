import * as vscode from 'vscode';
import { getAPIConfig } from '../config';
import { sessionService } from '../services/session/session.service';
import { SessionState } from '../store/session.state';

export async function createUserSession(context: vscode.ExtensionContext) {
  const sessionState = new SessionState(context);
  const apiKey = getAPIConfig();
  let payload = {
    apiKey: apiKey || '123-123-123-123-123',
  };

  const sessionToken = sessionState.get();
  if (sessionToken) {
    // @ts-ignore
    payload['sessionToken'] = sessionToken;
  }

  const response = await sessionService.createUserSession(payload);
  if (response.isOk()) {
    if (response.value?.session) {
      sessionState.set(response.value?.session);
    }
  }

  if (response.isErr()) {
    if (response.error.response.data.session) {
      sessionState.set(response.error.response.data.session);
    } else {
      vscode.window.showErrorMessage('Could not Authenticate User');
    }
  }
  // store the response in the state
}
