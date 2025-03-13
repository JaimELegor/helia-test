import { React, useState } from 'react'
import './App.css'
import { useCommitText } from '@/hooks/useCommitText'
import { useHelia } from '@/hooks/useHelia'

function App() {
  const [text, setText] = useState('')
  const [cid, setCid] = useState('')
  const { error, starting } = useHelia()
  const {
    cidString,
    commitText,
    fetchCommittedText,
    committedText
  } = useCommitText()

  return (
    <div className="App">
      <div
        id="heliaStatus"
        style={{
          border: `4px solid ${error
            ? 'red'
            : starting ? 'yellow' : 'green'
            }`,
          paddingBottom: '4px'
        }}
      >Helia Status</div>
      <input
        id="textInput"
        value={text}
        onChange={(event) => setText(event.target.value)}
        type="text" />
      <button
        id="commitTextButton"
        onClick={() => commitText(text)}
      >Add Text To Node</button>
      <div
        id="cidOutput"
      >textCid: {cidString}</div>
      <input
        id="textInput"
        value={cid}
        onChange={(event) => setCid(event.target.value)}
        type="text" />
      <button
        id="commitTextButton"
        onClick={() => fetchCommittedText(cid)}
      >Fetch Given Cid</button>
      {committedText &&
        <div
          id="textOutput"
        >fetched text: {committedText}</div>
      }
    </div>
  )
}

export default App
