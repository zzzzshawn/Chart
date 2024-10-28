import { useRef, useState } from "react"

function App() {
  const [showMinimap, setShowMinimap] = useState<boolean>(false); // minimap trigger
  const [manualRefresh, setManualRefresh] = useState<boolean>(false); // trigger manual refresh
  const chatContainer = useRef<HTMLElement | null>(null); // DOM of chat container
  const scrollContainer = useRef<HTMLElement | null>(null); // DOM of scroll container

  

  return (
    <div className='bg-red-700 text-black'>
      hey
    </div>
  )
}

export default App
