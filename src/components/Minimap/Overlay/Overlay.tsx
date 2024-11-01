import React, { useEffect, useState } from "react";

interface OverlayProps {
  refreshCanvas: boolean;
  scale: number;
  scrolContainer: HTMLElement | null;
}

export const Overlay = ({
  refreshCanvas,
  scale,
  scrolContainer,
}: OverlayProps) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [height, setHeight] = useState(0);

  const onScroll = (scrolContainer: HTMLElement, scale: number) => {
    setScrollTop(scrolContainer.scrollTop * scale);
    setHeight(scrolContainer.offsetHeight * scale);
  };

  useEffect(() => {
    if (!scrolContainer) return;
    onScroll(scrolContainer, scale);
    scrolContainer.addEventListener("scroll", (e) => {
      if (!(e.target instanceof HTMLElement)) return;
      onScroll(e.target, scale);
    });
  }, [scale, refreshCanvas, scrolContainer]);

  const currentViewStyle: React.CSSProperties = {
    top: `${scrollTop}px`,
    height: `${height}px`,
  };

  return (
    <div
      style={currentViewStyle}
      className="absolute left-0 w-full bg-[#00FFD744] cursor-grab"
    >
      Overlay
    </div>
  );
};
