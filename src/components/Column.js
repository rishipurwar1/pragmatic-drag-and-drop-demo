import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import Card from "./Card";

const Column = ({ columnId, title, cards }) => {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
      getData: () => ({ columnId }),
      getIsSticky: () => true,
    });
  }, [columnId]);

  return (
    <div
      className="column"
      ref={ref}
      style={{
        backgroundColor: isDraggedOver ? "lightblue" : "white",
      }}
    >
      <h2>{title}</h2>
      {cards.map((card) => (
        <Card key={card.id} {...card}>
          {card.content}
        </Card>
      ))}
    </div>
  );
};

export default Column;
