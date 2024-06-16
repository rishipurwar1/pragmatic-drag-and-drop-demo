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
// import { DropIndicator } from "@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box";

const DropIndicator = ({ edge, gap }) => {
  const edgeClassMap = {
    top: "edge-top",
    bottom: "edge-bottom",
  };

  const edgeClass = edgeClassMap[edge];

  const style = {
    "--gap": gap,
  };

  return <div className={`drop-indicator ${edgeClass}`} style={style}></div>;
};

const Card = ({ children, ...card }) => {
  const ref = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [isDraggedOver, setIsDraggedOver] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);

  useEffect(() => {
    const el = ref.current;

    // The tiny-invariant library is used to ensure that the ref to the card element
    // is not null or undefined when the useEffect hook runs. If the ref is null or undefined,
    // an error will be thrown. This helps to prevent the draggable function from being called
    // with an invalid argument.
    invariant(el);

    return combine(
      draggable({
        element: el,
        onDragStart: () => setDragging(true),
        onDrop: () => setDragging(false),
        getInitialData: () => ({ type: "card", cardId: card.id }),
      }),
      dropTargetForElements({
        element: el,
        getData: ({ input, element }) => {
          const data = { type: "card", cardId: card.id };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ["top", "bottom"],
          });
        },
        onDragEnter: (args) => {
          setIsDraggedOver(true);
          console.log("args", args, card.id);
          // Only update the closest edge if the card being dragged is not the same as the card
          if (args.source.data.cardId !== card.id) {
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
          setIsDraggedOver(false);
          setClosestEdge(null);
        },
        onDrop: () => {
          setIsDraggedOver(false);
          setClosestEdge(null);
        },
      })
    );
  }, [card.id]);
  console.log("closestEdge", closestEdge);
  return (
    <div className={`card ${dragging ? "dragging" : ""}`} ref={ref}>
      {children}
      {closestEdge && <DropIndicator edge={closestEdge} gap="8px" />}
    </div>
  );
};

export default Card;
