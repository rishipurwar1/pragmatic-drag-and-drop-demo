import { useCallback, useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { getReorderDestinationIndex } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

import Column from "./Column";

import { BOARD_COLUMNS } from "../constant";

const Board = () => {
  const [columnsData, setColumnsData] = useState(BOARD_COLUMNS);

  const reorderCard = useCallback(
    ({ columnId, startIndex, finishIndex }) => {
      const sourceColumnData = columnsData[columnId];

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

  const moveCard = useCallback(
    ({
      movedCardIndexInSourceColumn,
      sourceColumnId,
      destinationColumnId,
      movedCardIndexInDestinationColumn,
    }) => {
      // Get data of the source column
      const sourceColumnData = columnsData[sourceColumnId];

      // Get data of the destination column
      const destinationColumnData = columnsData[destinationColumnId];

      // Identify the card to move
      const cardToMove = sourceColumnData.cards[movedCardIndexInSourceColumn];

      // Create new source column data without the moved card
      const newSourceColumnData = {
        ...sourceColumnData,
        cards: sourceColumnData.cards.filter(
          (card) => card.id !== cardToMove.id
        ),
      };

      // Create a copy of the destination column's cards array
      const newDestinationCards = Array.from(destinationColumnData.cards);

      // Determine the new index in the destination column
      const newIndexInDestination = movedCardIndexInDestinationColumn ?? 0;

      // Insert the moved card into the new index in the destination column
      newDestinationCards.splice(newIndexInDestination, 0, cardToMove);

      // Create new destination column data with the moved card
      const newFinishColumnData = {
        ...destinationColumnData,
        cards: newDestinationCards,
      };

      // Update the state with the new columns data
      setColumnsData({
        ...columnsData,
        [sourceColumnId]: newSourceColumnData,
        [destinationColumnId]: newFinishColumnData,
      });
    },
    [columnsData]
  );

  const handleDrop = useCallback(
    ({ source, location }) => {
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

          // check if the source and destination columns are the same
          if (sourceColumnId === destinationColumnId) {
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

          console.log("draggedCardIndex", draggedCardIndex);

          moveCard({
            movedCardIndexInSourceColumn: draggedCardIndex,
            sourceColumnId,
            destinationColumnId,
          });
          return;
        }

        // Check if the current location has exactly two drop targets
        if (location.current.dropTargets.length === 2) {
          // Destructure and extract the destination card and column data from the drop targets
          const [destinationCardRecord, destinationColumnRecord] =
            location.current.dropTargets;

          // Extract the destination column ID from the destination column data
          const destinationColumnId = destinationColumnRecord.data.columnId;

          // Retrieve the destination column data using the destination column ID
          const destinationColumn = columnsData[destinationColumnId];

          // Find the index of the target card within the destination column's cards
          const indexOfTarget = destinationColumn.cards.findIndex(
            (card) => card.id === destinationCardRecord.data.cardId
          );

          // Determine the closest edge of the target card: top or bottom
          const closestEdgeOfTarget = extractClosestEdge(
            destinationCardRecord.data
          );

          console.log(closestEdgeOfTarget);

          // Check if the source and destination columns are the same
          if (sourceColumnId === destinationColumnId) {
            // Calculate the destination index for the card to be reordered within the same column
            const destinationIndex = getReorderDestinationIndex({
              startIndex: draggedCardIndex,
              indexOfTarget,
              closestEdgeOfTarget,
              axis: "vertical",
            });

            // Perform the card reordering within the same column
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
            movedCardIndexInSourceColumn: draggedCardIndex,
            sourceColumnId,
            destinationColumnId,
            movedCardIndexInDestinationColumn: destinationIndex,
          });
        }
      }
    },
    [columnsData, moveCard, reorderCard]
  );

  useEffect(() => {
    return monitorForElements({
      onDrop: handleDrop,
    });
  }, [handleDrop]);
  return (
    <div className="board">
      {Object.keys(columnsData).map((columnId) => (
        <Column key={columnId} {...columnsData[columnId]} />
      ))}
    </div>
  );
};

export default Board;
