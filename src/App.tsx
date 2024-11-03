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
    const observeChatIdChange = () => {
      const currentChatId = window.location.pathname; 
      const observer = new MutationObserver(() => {
        const newChatId = window.location.pathname;
        if (currentChatId !== newChatId) {
          triggerRefresh();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      return () => {
        observer.disconnect();
      };
    };

    observeChatIdChange();
  }, []);

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

