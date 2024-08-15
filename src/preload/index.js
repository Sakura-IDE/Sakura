import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
  sendPageLoaded: (page) => ipcRenderer.send('page-loaded', page),
  openOptionsWindow: () => ipcRenderer.send('open-options')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.Electron = electronAPI
  window.api = api
}