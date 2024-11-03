import { useEffect, useRef, useState } from "react";
import {
  queryAllChatElements,
  queryChatContainer,
  queryNavElement,
} from "./utils/renderLogic";
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
        onNextChat={() => onNextChat(scrollContainer.current)}
        onPreviousChat={() => onPreviousChat(scrollContainer.current)}
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

const onNextChat = (scrollContainer: HTMLElement | null) => {
  const navElement = queryNavElement();
  if (!scrollContainer || !navElement) return;
  const navHeight = navElement.offsetHeight;
  const chatElements = queryAllChatElements();
  const nextChats = chatElements.filter((element) => {
    return element.getBoundingClientRect().top > 1.1 * navHeight;
  });
  if (nextChats.length === 0) return;
  const firstNextChat = nextChats[0];
  scrollContainer.scrollTo({
    top:
      scrollContainer.scrollTop +
      firstNextChat.getBoundingClientRect().top -
      navHeight,
    behavior: "smooth",
  });
};
const onPreviousChat = (scrollContainer: HTMLElement | null) => {
  const navElement = queryNavElement();
  if (!scrollContainer || !navElement) return;
  const navHeight = navElement.offsetHeight;
  const chatElements = queryAllChatElements();
  const nextChats = chatElements.filter((element) => {
    return element.getBoundingClientRect().top < navHeight;
  });
  if (nextChats.length === 0) return;
  const firstNextChat = nextChats[nextChats.length - 1];
  scrollContainer.scrollTo({
    top:
      scrollContainer.scrollTop +
      firstNextChat.getBoundingClientRect().top -
      navHeight,
    behavior: "smooth",
  });
};
