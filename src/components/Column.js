import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import Card from "./Card";

const Column = ({ columnId, title, cards }) => {
  const columnRef = useRef(null);
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  useEffect(() => {
    const columnEl = columnRef.current;
    invariant(columnEl);

    return dropTargetForElements({
      element: columnEl,
      onDragEnter: () => setIsDraggedOver(true),
      onDragStart: () => setIsDraggedOver(true),
      onDragLeave: () => setIsDraggedOver(false),
      onDrop: () => setIsDraggedOver(false),
      getData: () => ({ columnId }),
      getIsSticky: () => true,
    });
  }, [columnId]);
  return (
    <div
      className={`column ${isDraggedOver ? "dragged-over" : ""}`}
      ref={columnRef} // attach a columnRef to the column div
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
