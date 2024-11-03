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
        return;
      }

      isLoading.current = true;

      canvasContainer.innerHTML = ""; 
      const loaderDiv = document.createElement("div");
      loaderDiv.className = "loader-container";
      const spinner = document.createElement("div");
      spinner.className = "spinner";
      loaderDiv.appendChild(spinner);
      canvasContainer.appendChild(loaderDiv);

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

const spinnerStyle = document.createElement("style");
spinnerStyle.innerHTML = `
  .loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
  }
  .spinner {
    width: 25px;
    height: 25px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(spinnerStyle);

export default memo(Canvas);
