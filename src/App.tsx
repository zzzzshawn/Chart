import { useEffect, useRef, useState } from "react";
import { queryChatContainer } from "./utils/renderLogic";
import Minimap from "./components/Minimap/Minimap";
import OptionsContainer from "./components/Options/OptionsContainer";

function App() {
  const [showMinimap, setShowMinimap] = useState<boolean>(false); 
  const [manualRefresh, setManualRefresh] = useState<boolean>(false); 
  const chatContainer = useRef<HTMLElement | null>(null); 
  const scrollContainer = useRef<HTMLElement | null>(null);

  const triggerRefresh = () => {
    setManualRefresh((prev) => !prev);
    chatContainer.current = queryChatContainer();
    if (chatContainer.current) {
      scrollContainer.current = chatContainer.current.parentElement;
    }
  };

  useEffect(() => {
    addLocationObserver(() => {
      setTimeout(() => {
        const newChat = queryChatContainer();
        if (chatContainer.current !== newChat) {
          triggerRefresh();
        }
        chatContainer.current = newChat;
        if (newChat) {
          scrollContainer.current = newChat.parentElement;
        }
      }, 500);
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

const addLocationObserver = (callback: MutationCallback) => {
  const config = {
    attributes: false,
    childList: true,
    subtree: false,
  };

  const observer = new MutationObserver(callback);

  observer.observe(document.body, config);
};
