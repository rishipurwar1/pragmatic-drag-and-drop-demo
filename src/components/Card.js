import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

const Card = ({ children, ...card }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); // create a state for dragging

  useEffect(() => {
    const cardEl = cardRef.current;
    invariant(cardEl);

    return draggable({
      element: cardEl,
      onDragStart: () => setIsDragging(true), // set isDragging to true when dragging starts
      onDrop: () => setIsDragging(false), // set isDragging to false when dragging ends
    });
  }, []);
  return (
    // Add dragging class when isDragging is true
    <div className={`card ${isDragging ? "dragging" : ""}`} ref={cardRef}>
      {children}
    </div>
  );
};

export default Card;
