import { useEffect, useRef, useState } from "react";
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

    // Listen for mouse up event globally to stop dragging
    const handleMouseUp = () => {
      mouseDown.current = false;
    };

    window.addEventListener("mouseup", handleMouseUp);

    // Listen for mouse events within the minimap
    const handleMouseDown = () => {
      mouseDown.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (mouseDown.current) {
        setDragPos(e.clientY);
      }
    };

    mapContainer.addEventListener("mousedown", handleMouseDown);
    mapContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      mapContainer.removeEventListener("mousedown", handleMouseDown);
      mapContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, [setDragPos]);

  // Synchronize minimap scroll when the chat scrolls
  useEffect(() => {
    const mapContainer = minimapRef.current;
    if (!mapContainer || !scrollContainer) return;

    const handleScroll = () => onScroll(mapContainer, scrollContainer);
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [refreshMap, scale, scrollContainer]);

  // Synchronize main chat scroll when dragging minimap
  useEffect(() => {
    const mapContainer = minimapRef.current;
    if (!mapContainer || !scrollContainer) return;
    onDrag(mapContainer, scrollContainer, scale, dragPos);
  }, [dragPos, scrollContainer, scale]);

  return (
    <div ref={minimapRef} style={minimapContainerStyle}>
      <Canvas
        refreshCanvas={refreshMap}
        chatContainer={chatContainer}
        setScale={setScale}
      />
      <Overlay
        refreshCanvas={refreshMap}
        scrollContainer={scrollContainer}
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
  overflowY: "hidden", // hides scrollbar, use custom scroll logic
};

export default Minimap;

// Scrolls the main chat to match minimap position on drag
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

  scrollContainer.scrollTo({ top: newScrollPos, behavior: "smooth" });
};

// Synchronizes minimap position when the chat scrolls
const onScroll = (
  minimapContainer: HTMLElement,
  scrollContainer: HTMLElement,
) => {
  const scrollRatio = scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight);
  minimapContainer.scrollTop = scrollRatio * (minimapContainer.scrollHeight - minimapContainer.clientHeight);
};
