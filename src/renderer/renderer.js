const { ipcRenderer } = require('electron')

document.addEventListener('DOMContentLoaded', function () {
  const closeButton = document.getElementById('close')
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      ipcRenderer.send('close')
    })
  }

  const minimizeButton = document.getElementById('minimize')
  if (minimizeButton) {
    minimizeButton.addEventListener('click', () => {
      ipcRenderer.send('minimize')
    })
  }

  const maximizeButton = document.getElementById('maximize')
  if (maximizeButton) {
    maximizeButton.addEventListener('click', () => {
      ipcRenderer.send('maximize')
    })
  }

  const { ipcRenderer } = require('electron')

  const button = document.getElementById('options')

  button.addEventListener('click', () => {
    ipcRenderer.send('open-options')
  })
})
