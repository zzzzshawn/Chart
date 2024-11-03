import { useEffect, useState } from "react";
import { queryChatContainer } from "./utils/renderLogic";
import Minimap from "./components/Minimap/Minimap";
import OptionsContainer from "./components/Options/OptionsContainer";

function App() {
  const [showMinimap, setShowMinimap] = useState<boolean>(false);
  const [chatContainer, setChatContainer] = useState<HTMLElement | null>(null);
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(
    null
  );

  const triggerRefresh = () => {
    const newChatContainer = queryChatContainer();
    setChatContainer(newChatContainer);
    if (newChatContainer) {
      setScrollContainer(newChatContainer.parentElement);
    }
  };

  useEffect(() => {
    const observeChatIdChange = () => {
      const observer = new MutationObserver(() => {
        triggerRefresh();
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

  const refreshMap = () => {
    setShowMinimap(false); 
    setChatContainer(null);
    setScrollContainer(null);
    setTimeout(() => {
      triggerRefresh(); 
      setShowMinimap(true); 
    }, 100); 
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
