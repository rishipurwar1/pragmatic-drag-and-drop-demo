import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import {
  draggable,
  dropTargetForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge,
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import DropIndicator from "./DropIndicator";

const Card = ({ children, ...card }) => {
  const cardRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);

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
        getData: ({ input, element }) => {
          // To attach card data to a drop target
          const data = { type: "card", cardId: card.id };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        getIsSticky: () => true,
        onDragEnter: (args) => {
          // Only update the closest edge if the card being dragged is not the same as the card
          if (args.source.data.cardId !== card.id) {
            console.log("onDragEnter", args.self.data);
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          // Only update the closest edge if the card being dragged is not the same as the card
          if (args.source.data.cardId !== card.id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      })
    );
  }, [card.id]);
  return (
    // Add dragging class when isDragging is true
    <div className={`card ${isDragging ? "dragging" : ""}`} ref={cardRef}>
      {children}
      {/* render the DropIndicator if there's a closest edge */}
      {closestEdge && <DropIndicator edge={closestEdge} gap="8px" />}
    </div>
  );
};

export default Card;
