import { useCallback, useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import Column from "./Column";

import { COLUMN_MAP } from "../constant";

const Board = () => {
  const [columnsData, setColumnsData] = useState(COLUMN_MAP);

  const moveCard = useCallback(
    ({
      cardIndexInStartColumn,
      sourceColumnId,
      destinationColumnId,
      itemIndexInFinishColumn,
    }) => {
      console.log(
        "moveCard",
        cardIndexInStartColumn,
        sourceColumnId,
        destinationColumnId
      );
      const startColumnData = columnsData[sourceColumnId];
      const destinationColumnData = columnsData[destinationColumnId];

      const cardToMove = startColumnData.cards[cardIndexInStartColumn];

      const newStartColumnData = {
        ...startColumnData,
        cards: startColumnData.cards.filter(
          (card) => card.id !== cardToMove.id
        ),
      };

      const newDestinationCards = Array.from(destinationColumnData.cards);

      const newIndexInDestination = itemIndexInFinishColumn ?? 0;
      newDestinationCards.splice(newIndexInDestination, 0, cardToMove);

      const newFinishColumnData = {
        ...destinationColumnData,
        cards: newDestinationCards,
      };

      setColumnsData({
        ...columnsData,
        [sourceColumnId]: newStartColumnData,
        [destinationColumnId]: newFinishColumnData,
      });
    },
    [columnsData]
  );

  const reorderCard = useCallback(
    ({ columnId, startIndex, finishIndex }) => {
      const sourceColumnData = columnsData[columnId];
      console.log("reorderCard", sourceColumnData, startIndex, finishIndex);
      const updatedItems = reorder({
        list: sourceColumnData.cards,
        startIndex,
        finishIndex,
      });

      const updatedSourceColumn = {
        ...sourceColumnData,
        cards: updatedItems,
      };

      setColumnsData({
        ...columnsData,
        [columnId]: updatedSourceColumn,
      });
    },
    [columnsData]
  );

  useEffect(() => {
    return monitorForElements({
      // returns false because we're returning nothing
      // canMonitor: (args) => console.log("canMonitor", args),
      onDragStart: () => console.log("Dragging an element"),
      onDrop: ({ source, location }) => {
        // Early return if there are no drop targets in the current location
        const destination = location.current.dropTargets.length;
        if (!destination) {
          return;
        }

        if (source.data.type === "card") {
          // Retrieve the ID of the card being dragged
          const draggedCardId = source.data.cardId;

          // Get the source column from the initial drop targets
          const [, sourceColumnRecord] = location.initial.dropTargets;

          // Retrieve the ID of the source column
          const sourceColumnId = sourceColumnRecord.data.columnId;

          // Get the data of the source column
          const sourceColumnData = columnsData[sourceColumnId];

          // Get the index of the card being dragged in the source column
          const draggedCardIndex = sourceColumnData.cards.findIndex(
            (card) => card.id === draggedCardId
          );

          if (location.current.dropTargets.length === 1) {
            // Get the destination column from the current drop targets
            const [destinationColumnRecord] = location.current.dropTargets;

            // Retrieve the ID of the destination column
            const destinationColumnId = destinationColumnRecord.data.columnId;

            if (sourceColumnId === destinationColumnId) {
              console.log("hello2");
              const destinationIndex = getReorderDestinationIndex({
                startIndex: draggedCardIndex,
                indexOfTarget: sourceColumnData.cards.length - 1,
                closestEdgeOfTarget: null,
                axis: "vertical",
              });

              reorderCard({
                columnId: sourceColumnData.columnId,
                startIndex: draggedCardIndex,
                finishIndex: destinationIndex,
              });
              return;
            }

            moveCard({
              cardIndexInStartColumn: draggedCardIndex,
              sourceColumnId,
              destinationColumnId,
            });
            return;
          }

          if (location.current.dropTargets.length === 2) {
            const [destinationCardRecord, destinationColumnRecord] =
              location.current.dropTargets;

            const destinationColumnId = destinationColumnRecord.data.columnId;

            const destinationColumn = columnsData[destinationColumnId];

            const indexOfTarget = destinationColumn.cards.findIndex(
              (card) => card.id === destinationCardRecord.data.cardId
            );

            const closestEdgeOfTarget = extractClosestEdge(
              destinationCardRecord.data
            );

            if (sourceColumnId === destinationColumnId) {
              const destinationIndex = getReorderDestinationIndex({
                startIndex: draggedCardIndex,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: "vertical",
              });

              reorderCard({
                columnId: sourceColumnId,
                startIndex: draggedCardIndex,
                finishIndex: destinationIndex,
              });
              return;
            }

            const destinationIndex =
              closestEdgeOfTarget === "bottom"
                ? indexOfTarget + 1
                : indexOfTarget;

            moveCard({
              cardIndexInStartColumn: draggedCardIndex,
              sourceColumnId,
              destinationColumnId,
              itemIndexInFinishColumn: destinationIndex,
            });
          }
        }
      },
    });
  }, [columnsData, moveCard, reorderCard]);
  return (
    <div className="board">
      {Object.keys(columnsData).map((columnId) => (
        <Column key={columnId} {...columnsData[columnId]} />
      ))}
    </div>
  );
};

export default Board;
