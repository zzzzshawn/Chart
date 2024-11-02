import React, { useEffect, useState, useRef } from "react";

interface OverlayProps {
  refreshCanvas: boolean;
  scale: number;
  scrollContainer: HTMLElement | null;
}

export const Overlay = ({
  refreshCanvas,
  scale,
  scrollContainer,
}: OverlayProps) => {
  const [scrollTop, setScrollTop] = useState(0);  // Top position of the overlay
  const [height, setHeight] = useState(0);  // Height of the overlay (based on scale)
  const overlayRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false); // Flag to indicate if dragging is in progress
  const startY = useRef(0); // Starting Y position for the drag
  const startScrollTop = useRef(0); // Initial scroll top when the drag starts

  const updateOverlayPosition = (scrollPosition: number) => {
    setScrollTop(scrollPosition * scale);
    setHeight(scrollContainer ? scrollContainer.offsetHeight * scale : 0);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current || !scrollContainer) return;

    // Calculate dynamic drag factor based on content height
    const scrollableHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const dragFactor = scrollableHeight > 0 ? scrollableHeight / scrollContainer.clientHeight : 1;

    // Calculate the new scroll position with the dynamic factor
    const deltaY = (e.clientY - startY.current) * dragFactor;
    const newScrollTop = startScrollTop.current + deltaY;

    // Apply new scroll position and update overlay position
    scrollContainer.scrollTo(0, newScrollTop);
    updateOverlayPosition(scrollContainer.scrollTop);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!overlayRef.current) return;
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollContainer ? scrollContainer.scrollTop : 0;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    if (!scrollContainer) return;
    updateOverlayPosition(scrollContainer.scrollTop);
    scrollContainer.addEventListener("scroll", () =>
      updateOverlayPosition(scrollContainer.scrollTop)
    );

    return () => {
      scrollContainer.removeEventListener("scroll", () =>
        updateOverlayPosition(scrollContainer.scrollTop)
      );
    };
  }, [scale, refreshCanvas, scrollContainer]);

  const currentViewStyle: React.CSSProperties = {
    position: "absolute",
    top: `${scrollTop}px`,
    left: "0",
    width: "100%",
    height: `${height}px`,
    backgroundColor: `#00FFD744`,
    cursor: isDragging.current ? "grabbing" : "grab",
  };

  return (
    <div
      ref={overlayRef}
      style={currentViewStyle}
      onMouseDown={handleMouseDown} // Initiate drag on mouse down
    ></div>
  );
};
