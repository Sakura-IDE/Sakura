const editor = document.getElementById('editor')
const lineNumbers = document.getElementById('lineNumbers')
const suggestionsBox = document.getElementById('suggestions')
let htmlTags = []

async function fetchHtmlTags() {
  htmlTags = [
    'html',
    'head',
    'body',
    'div',
    'span',
    'script',
    'style',
    'p',
    'a',
    'ul',
    'li',
    'table',
    'tr',
    'td',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'meta',
    'link',
    'title',
    'nav',
    'header',
    'footer',
    'section',
    'article',
    'aside',
    'main',
    'form',
    'input',
    'button',
    'label',
    'textarea',
    'select',
    'option'
  ]
}

function updateLineNumbers() {
  const lines = editor.value.split('\n').length
  lineNumbers.innerHTML = ''
  for (let i = 1; i <= lines; i++) {
    lineNumbers.innerHTML += `<div>${i}</div>`
  }
}

function insertText(text) {
  const start = editor.selectionStart
  const end = editor.selectionEnd
  editor.setRangeText(text, start, end, 'end')
}

function handleAutoIndent() {
  const start = editor.selectionStart
  const textBefore = editor.value.substring(0, start)
  const lastLine = textBefore.split('\n').pop()
  const indent = lastLine.match(/^\s*/)[0]

  const openTagMatch = lastLine.match(/<(\w+)[^>]*>(?!.*<\/\1>)/)
  if (openTagMatch) {
    const tagName = openTagMatch[1]
    if (htmlTags.includes(tagName)) {
      const newIndent = indent + '\t'
      insertText('\n' + newIndent + '\n' + indent + '</' + tagName + '>')
      editor.selectionEnd = start + newIndent.length + 1
      updateLineNumbers()
      return
    }
  }

  insertText('\n' + indent)
  updateLineNumbers()
}

function showSuggestions() {
  const cursorPosition = editor.selectionStart
  const textBeforeCursor = editor.value.substring(0, cursorPosition)
  const lastWord = textBeforeCursor.split(/\s+/).pop().toLowerCase()

  const matches = htmlTags.filter((tag) => tag.startsWith(lastWord))

  if (matches.length > 0 && lastWord.length > 0) {
    suggestionsBox.style.display = 'block'
    suggestionsBox.innerHTML = matches
      .map((match) => `<div class="suggestion-item">${match}</div>`)
      .join('')
    const rect = editor.getBoundingClientRect()
    suggestionsBox.style.top = `${rect.top + window.scrollY + 20}px`
    suggestionsBox.style.left = `${rect.left + window.scrollX + 20}px`
  } else {
    suggestionsBox.style.display = 'none'
  }
}

editor.addEventListener('input', () => {
  updateLineNumbers()
  showSuggestions()
})

editor.addEventListener('scroll', () => {
  lineNumbers.scrollTop = editor.scrollTop
})

editor.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault()
    insertText('\t')
  } else if (e.key === 'Enter') {
    e.preventDefault()
    handleAutoIndent()
  }
})

suggestionsBox.addEventListener('click', (e) => {
  if (e.target.classList.contains('suggestion-item')) {
    const selectedWord = e.target.textContent
    const cursorPosition = editor.selectionStart
    const textBeforeCursor = editor.value.substring(0, cursorPosition)
    const lastWord = textBeforeCursor.split(/\s+/).pop()
    editor.setRangeText(selectedWord, cursorPosition - lastWord.length, cursorPosition, 'end')
    suggestionsBox.style.display = 'none'
    editor.focus()
  }
})

fetchHtmlTags()
updateLineNumbers()
