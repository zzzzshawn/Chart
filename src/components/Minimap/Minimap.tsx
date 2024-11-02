import  { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas/Canvas";
import { Overlay } from "./Overlay/Overlay";

interface MiniMapProps {
  refreshMap: boolean;
  chatContainer: HTMLElement | null;
  scrollContainer: HTMLElement | null;
}

const Minimap = ({
  refreshMap,
  chatContainer,
  scrollContainer,
}: MiniMapProps) => {
  const [scale, setScale] = useState<number>(0); // sets scale of minimap
  const [dragPos, setDragPos] = useState<number>(0); // vertical mouse position
  const minimapRef = useRef<HTMLDivElement>(null); // ref to minimap container
  const mouseDown = useRef<boolean>(false); // if mouse is clicked and held

  useEffect(() => {
    const mapContainer = minimapRef.current;
    if (!mapContainer) return;

    // events to check mouse events
    // when mouse is not clicked
    window.addEventListener("mouseup", () => {
      mouseDown.current = false;
    });
    // fire when mouse is clicked inside map
    mapContainer.addEventListener("mousedown", () => {
      mouseDown.current = true;
    });
    // if mouse is pressed and moved set drag position
    mapContainer.addEventListener("mousemove", (e) => {
      if (mouseDown.current) {
        setDragPos(e.clientY);
      }
    });
  }, [setDragPos]);

  // to manage position of scroll container
  useEffect(() => {
    const mapContainer = minimapRef.current;
    if (!mapContainer) return;
    if (!scrollContainer) return;
    onDrag(mapContainer, scrollContainer, scale, dragPos);
  }, [dragPos, scrollContainer, scale]);

  useEffect(() => {
    const minimapContainer = minimapRef.current;
    if (!scrollContainer) return;
    if (!minimapContainer) return;
    scrollContainer.addEventListener("scroll", () =>
      onScroll(minimapContainer, scrollContainer, scale)
    );
  }, [refreshMap, scale, scrollContainer]);

  return (
    <div
      ref={minimapRef}
      style={minimapContainerStyle}
    >
      <Canvas
        refreshCanvas={refreshMap}
        chatContainer={chatContainer}
        setScale={setScale}
      />
      <Overlay
        refreshCanvas={refreshMap}
        scrolContainer={scrollContainer}
        scale={scale}
      />
    </div>
  );
};

const minimapContainerStyle: React.CSSProperties = {
  position: "relative",
  width: "80px",
  height: "90vh",
  backgroundColor: "#343442",
  pointerEvents: "all",
  boxShadow: "0 0 20px rgba(0, 0, 0, 1)",
  overflowY: "scroll",
  scrollbarWidth: "none",
};

export default Minimap;

// sets scroll for the main chat of gpt when i adjust scroll for minimap
const onDrag = (
  mapContainer: HTMLElement,
  scrollContainer: HTMLElement,
  scale: number,
  mousePos: number
) => {
  const relativeMousePos = mousePos - mapContainer.getBoundingClientRect().top;
  const newScrollPos =
    (relativeMousePos + mapContainer.scrollTop) / scale -
    0.5 * scrollContainer.offsetHeight;

  // scroll container should be at newscrollpos. 0 indicates no horizontal scroll
  scrollContainer.scrollTo(0, newScrollPos);
};

// sets scroll for minimap when i scroll on main map
const onScroll = (
  minimapContainer: HTMLElement,
  scrollContainer: HTMLElement,
  scale: number
) => {
  const ratio =
    scrollContainer.scrollTop /
    (scrollContainer.scrollHeight + scrollContainer.offsetHeight);

  minimapContainer.scrollTop =
    scale * scrollContainer.scrollTop - ratio * minimapContainer.offsetHeight;
};
