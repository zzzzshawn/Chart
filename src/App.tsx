import { useEffect, useState } from "react";
import { queryChatContainer } from "./utils/renderLogic";
import Minimap from "./components/Minimap/Minimap";
import OptionsContainer from "./components/Options/OptionsContainer";

function App() {
  const [showMinimap, setShowMinimap] = useState<boolean>(false); 
  const [chatContainer, setChatContainer] = useState<HTMLElement | null>(null); 
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);

  const triggerRefresh = () => {
    const newChatContainer = queryChatContainer();
    setChatContainer(newChatContainer);
    if (newChatContainer) {
      setScrollContainer(newChatContainer.parentElement);
    }
  };

  useEffect(() => {
    addLocationObserver(() => {
      setTimeout(() => {
        const newChat = queryChatContainer();
        if (chatContainer !== newChat) {
          triggerRefresh();
        }
        setChatContainer(newChat);
        if (newChat) {
          setScrollContainer(newChat.parentElement);
        } else {
          setScrollContainer(null);
        }
      }, 500);
    });
  }, [chatContainer]);

  const toggleMap = () => {
    setShowMinimap((prev) => !prev);
    triggerRefresh();
  };


  return (
    <div style={appContainerStyle}>
      <OptionsContainer
        onToggleMinimap={toggleMap}
        onRefreshMinimap={triggerRefresh}
        showMinimap={showMinimap}
      />
      {showMinimap && (
        <Minimap
          onRefreshMinimap={triggerRefresh}
          chatContainer={chatContainer}
          scrollContainer={scrollContainer}
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
