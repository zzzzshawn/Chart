import React, { memo, useEffect, useRef } from "react";
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
        // minimap conatiner is parent
        canvasContainer.parentElement.scrollTo(0, 0);
      }
      if (!chatContainer) {
        canvasContainer.innerHTML = "No Chat";
        return;
      }
      isLoading.current = true;
      canvasContainer.innerHTML = "loading..";
      const canvas = await generateMapCanvas(chatContainer);
      isLoading.current = false;
      canvasContainer.innerHTML = "";
      canvasContainer.appendChild(canvas);

      const scale = canvasContainer.offsetWidth / canvas.offsetHeight;
      canvas.style.width = `${canvasContainer.offsetWidth}px`;
      canvas.style.height = `${scale * canvas.offsetHeight}px`;
      setScale(scale);
    })();
  }, [refreshCanvas, setScale, chatContainer]);

  return <div ref={canvasRef} className="w-full text-white"></div>;
};

export default memo(Canvas);
