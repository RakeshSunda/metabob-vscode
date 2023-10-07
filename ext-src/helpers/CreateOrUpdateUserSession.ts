import * as vscode from 'vscode'
import { GetAPIConfig, GetRequestParamId } from '../config'
import { sessionService, CreateSessionRequest } from '../services'
import { Session } from '../state'

export async function createOrUpdateUserSession(context: vscode.ExtensionContext): Promise<undefined> {
  const sessionState = new Session(context)
  const apiKey = GetAPIConfig()
  const requestParamId = GetRequestParamId()
  const payload: CreateSessionRequest = {
    apiKey: apiKey || '',
    meta: {
      supplementaryId: requestParamId
    }
  }
  const sessionToken = sessionState.get()
  if (sessionToken) {
    payload['sessionToken'] = sessionToken.value
  }

  const response = await sessionService.createUserSession(payload)

  if (response.isOk()) {
    if (response.value?.session) {
      sessionState.set(response.value?.session)
    }
  }

  if (response.isErr()) {
    if (response.error.response?.data.session ?? undefined) {
      sessionState.set(response.error.response.data.session)
    } else {
      return
    }
  }

  return
}

export async function deleteUserSession(context: vscode.ExtensionContext): Promise<undefined> {
  const sessionState = new Session(context)
  const sessionToken = sessionState.get()?.value
  if (!sessionToken) return undefined
  const response = await sessionService.deleteUserSession(sessionToken)
  if (response.isErr()) {
    // TODO: Check cases
  }
  sessionState.clear()

  return
}
