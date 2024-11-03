import { useEffect, useRef, useState } from "react";
import Canvas from "./Canvas/Canvas";
import { Overlay } from "./Overlay/Overlay";

interface MiniMapProps {
  chatContainer: HTMLElement | null;
  scrollContainer: HTMLElement | null;
  onRefreshMinimap: CallableFunction;
}

const Minimap = ({
  chatContainer,
  scrollContainer,
  onRefreshMinimap,
}: MiniMapProps) => {
  const [scale, setScale] = useState<number>(0); 
  const [dragPos, setDragPos] = useState<number>(0); 
  const minimapRef = useRef<HTMLDivElement>(null); 
  const mouseDown = useRef<boolean>(false); 
  useEffect(() => {
    const mapContainer = minimapRef.current;
    if (!mapContainer) return;

    const handleMouseUp = () => {
      mouseDown.current = false;
    };

    window.addEventListener("mouseup", handleMouseUp);

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

  useEffect(() => {
    const mapContainer = minimapRef.current;
    if (!mapContainer || !scrollContainer) return;

    const handleScroll = () => onScroll(mapContainer, scrollContainer);
    scrollContainer.addEventListener("scroll", handleScroll);

    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [scale, scrollContainer]);

  useEffect(() => {
    const mapContainer = minimapRef.current;
    if (!mapContainer || !scrollContainer) return;
    onDrag(mapContainer, scrollContainer, scale, dragPos);
  }, [dragPos, scrollContainer, scale]);

  return (
    <div ref={minimapRef} style={minimapContainerStyle}>
      <Canvas
        chatContainer={chatContainer}
        setScale={setScale}
        onRefreshMinimap={onRefreshMinimap}
      />
      <Overlay
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
  backgroundColor: "#00000000",
  pointerEvents: "all",
  overflowY: "hidden",
};

export default Minimap;

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

const onScroll = (
  minimapContainer: HTMLElement,
  scrollContainer: HTMLElement,
) => {
  const scrollRatio = scrollContainer.scrollTop / (scrollContainer.scrollHeight - scrollContainer.clientHeight);
  minimapContainer.scrollTop = scrollRatio * (minimapContainer.scrollHeight - minimapContainer.clientHeight);
};
