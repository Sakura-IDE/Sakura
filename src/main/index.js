import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import DiscordRPC from 'discord-rpc'

let mainWindow
let currentPage = 'default'

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    minWidth: 900,
    minHeight: 670,
    show: false,
    frame: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true, // Ensure context isolation
      enableRemoteModule: false, // Disable remote module
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.on('page-loaded', (_, page) => {
    currentPage = page
    setActivity()
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const clientId = '1272892428365594685'

DiscordRPC.register(clientId)

const rpc = new DiscordRPC.Client({ transport: 'ipc' })
const startTimestamp = new Date()

async function setActivity() {
  if (!rpc || !mainWindow) {
    return
  }

  try {
    let detailsText = ''
    let stateText = ''
    let smallImageKey = ''
    let smallImageText = ''

    switch (currentPage) {
      case 'page1':
        detailsText = 'Idle'
        stateText = 'At homepage'
        smallImageKey = 'home'
        smallImageText = 'Home'
        break
      case 'page2':
        detailsText = 'Editing'
        stateText = 'Editing a file/folder'
        smallImageKey = 'code'
        smallImageText = 'Coding'
        break
      default:
        detailsText = 'Doing nothing!'
        stateText = 'At nothing'
        smallImageKey = 'naimg'
        smallImageText = 'Unknown'
    }

    rpc.setActivity({
      details: detailsText,
      state: stateText,
      startTimestamp,
      largeImageKey: 'sakra',
      largeImageText: 'Sakura',
      smallImageKey: smallImageKey,
      smallImageText: smallImageText,
      instance: false
    })
  } catch (error) {
    console.error('Failed to set activity:', error)
  }
}

rpc.on('ready', () => {
  setActivity()

  setInterval(() => {
    setActivity()
  }, 15000) // 15 seconds
})

rpc.login({ clientId }).catch(console.error)
