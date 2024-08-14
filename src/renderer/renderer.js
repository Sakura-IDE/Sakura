const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', function () {
  const closeButton = document.getElementById('close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      ipcRenderer.send('close');
    });
  }

  const minimizeButton = document.getElementById('minimize');
  if (minimizeButton) {
    minimizeButton.addEventListener('click', () => {
      ipcRenderer.send('minimize');
    });
  }
});