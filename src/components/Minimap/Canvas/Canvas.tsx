import { memo, useEffect, useRef } from "react";
import { generateMapCanvas } from "../../../utils/renderLogic";

interface CanvasProps {
  refreshCanvas: boolean;
  setScale: CallableFunction;
  chatContainer: HTMLElement | null;
}

const Canvas = ({ refreshCanvas, setScale, chatContainer }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isLoading = useRef<boolean>(false);

  useEffect(() => {
    if (isLoading.current === true) return;
    (async () => {
      const canvasContainer = canvasRef.current;
      if (!canvasContainer) return;
      if (canvasContainer.parentElement) {
        // scroll to top to display message
        canvasContainer.parentElement.scrollTo(0, 0);
      }
      if (!chatContainer) {
        canvasContainer.innerHTML =
          "No chat detected, try refreshing the minimap";
        return;
      }
      isLoading.current = true;
      // console.log("generating minmiap canvas...")
      canvasContainer.innerHTML = "loading..";
      const canvas = await generateMapCanvas(chatContainer);
      isLoading.current = false;
      canvasContainer.innerHTML = "";
      canvasContainer.appendChild(canvas);

      const scale = canvasContainer.offsetWidth / canvas.offsetWidth;
      canvas.style.width = `${canvasContainer.offsetWidth}px`;
      canvas.style.height = `${scale * canvas.offsetHeight}px`;
      setScale(canvas.offsetHeight / chatContainer.offsetHeight);
    })();
  }, [refreshCanvas, setScale, chatContainer]);

  return <div ref={canvasRef} style={canvasContainerStyle}></div>;
};

const canvasContainerStyle: React.CSSProperties = {
  width: "100%",
  color: "white",
  fontWeight: "bold",
};

export default memo(Canvas);
