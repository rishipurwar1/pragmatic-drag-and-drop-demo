import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";

const Card = ({ children, ...card }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const cardEl = cardRef.current;
    invariant(cardEl);

    // Combine draggable and dropTargetForElements cleanup functions
    // to return a single cleanup function
    return combine(
      draggable({
        element: cardEl,
        onDragStart: () => setIsDragging(true),
        onDrop: () => setIsDragging(false),
        getInitialData: () => ({ type: "card", cardId: card.id }), // To attach data to a draggable item when dragging starts
      }),
      // Add dropTargetForElements to make the card a drop target
      dropTargetForElements({
        element: cardEl,
        getData: () => ({ type: "card", cardId: card.id }), // To attach data to a drop target
        onDragEnter: (args) => {
          if (args.source.data.cardId !== card.id) {
            console.log("onDragEnter", args);
          }
        },
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
