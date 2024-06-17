import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

const Card = ({ children, ...card }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false); // create a state for dragging

  useEffect(() => {
    const cardEl = cardRef.current;
    invariant(cardEl);

    return combine(
      draggable({
        element: cardEl,
        onDragStart: () => setIsDragging(true), // set isDragging to true when dragging starts
        onDrop: () => setIsDragging(false), // set isDragging to false when dragging ends
        getInitialData: () => ({ type: "card", cardId: card.id }),
      }),
      dropTargetForElements({
        element: cardEl,
        getData: () => ({ type: "card", cardId: card.id }),
      })
    );
  }, [card.id]);
  return (
    // Add dragging class when isDragging is true
    <div className={`card ${isDragging ? "dragging" : ""}`} ref={cardRef}>
      {children}
    </div>
  );
};

export default Card;
