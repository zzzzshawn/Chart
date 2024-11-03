import { useEffect, useRef, useState } from "react";
import { queryChatContainer } from "./utils/renderLogic";
import Minimap from "./components/Minimap/Minimap";
import OptionsContainer from "./components/Options/OptionsContainer";

function App() {
  const [showMinimap, setShowMinimap] = useState<boolean>(false); // minimap trigger
  const [manualRefresh, setManualRefresh] = useState<boolean>(false); // trigger manual refresh
  const chatContainer = useRef<HTMLElement | null>(null); // DOM of chat container
  const scrollContainer = useRef<HTMLElement | null>(null); // DOM of scroll container

  // refresh the map canvas
  const triggerRefresh = () => {
    setManualRefresh((prev) => !prev);
    chatContainer.current = queryChatContainer();
    if (chatContainer.current) {
      scrollContainer.current = chatContainer.current.parentElement;
    }
  };

  useEffect(() => {
    // checks if there are changes to chat or if switched to a different chat
    addLocationObserver(() => {
      setTimeout(() => {
        const newChat = queryChatContainer();
        if (chatContainer.current !== newChat) {
          triggerRefresh();
        }
        // to ensure accurate reference
        chatContainer.current = newChat;
        if (newChat) {
          scrollContainer.current = newChat.parentElement;
        }
      }, 500); // delay execution to let chats load
    });
  }, []);

  const toggleMap = () => {
    setShowMinimap((prev) => !prev);
    triggerRefresh();
  };

  const refreshMap = () => {
    triggerRefresh();
  };

  return (
    <div style={appContainerStyle}>
      <OptionsContainer
        onToggleMinimap={toggleMap}
        onRefreshMinimap={refreshMap}
        showMinimap={showMinimap}
      />
      {showMinimap && (
        <Minimap
          onRefreshMinimap={refreshMap}
          refreshMap={manualRefresh}
          chatContainer={chatContainer.current}
          scrollContainer={scrollContainer.current}
        />
      )}
    </div>
  );
}

const appContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "0.25em",
  height: "100%",
  width: "100%",
  overflow: "hidden",
  justifyContent: "right",
  pointerEvents: "none",
  userSelect: "none",
};

export default App;

// observes child changes in document.body
const addLocationObserver = (callback: MutationCallback) => {
  // what changes observer should observe
  const config = {
    attributes: false,
    childList: true,
    subtree: false,
  };

  const observer = new MutationObserver(callback);

  // start observing document.body with the given config
  observer.observe(document.body, config);
};
