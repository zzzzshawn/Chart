import { memo, useEffect, useRef } from "react";
import { generateMapCanvas } from "../../../utils/renderLogic";

interface CanvasProps {
  setScale: CallableFunction;
  chatContainer: HTMLElement | null;
  onRefreshMinimap: CallableFunction;
}

const Canvas = ({ setScale, chatContainer, onRefreshMinimap }: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const isLoading = useRef<boolean>(false);

  useEffect(() => {
    if (isLoading.current === true) return;
    (async () => {
      const canvasContainer = canvasRef.current;
      if (!canvasContainer) return;
      if (!chatContainer) {
          onRefreshMinimap();
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
  }, [setScale, chatContainer, onRefreshMinimap]);

  return <div ref={canvasRef} style={canvasContainerStyle}></div>;
};

const canvasContainerStyle: React.CSSProperties = {
  width: "100%",
  textAlign: "center",
  color: "white",
};

export default memo(Canvas);
