import { React, useState, useEffect } from 'react'
import './App.css'
import { useCommitText } from '@/hooks/useCommitText'
import { useHelia } from '@/hooks/useHelia'
import { usePubSub } from './hooks/usePubSub'

function App() {

  const [text, setText] = useState('')
  const [cid, setCid] = useState('')
  const { sendCID, messages } = usePubSub()
  const { error, starting } = useHelia()
  const {
    cidString,
    commitText,
    fetchCommittedText,
    committedText
  } = useCommitText()

  const addText = async (text) => {
    await commitText(text);
    if (cidString) {
      console.log(cidString)
      sendCID(cidString);
    }
  };

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
        onClick={() => addText(text)}
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
