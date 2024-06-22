import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

import Column from "./Column";

import { BOARD_COLUMNS } from "../constant";

const Board = () => {
  const [columnsData, setColumnsData] = useState(BOARD_COLUMNS);

  const handleDrop = ({ source, location }) => {
    // Early return if there are no drop targets in the current location
    const destination = location.current.dropTargets.length;
    if (!destination) {
      return;
    }

    if (source.data.type === "card") {
      if (location.current.dropTargets.length === 1) {
        console.log(
          "dropTargets1",
          location.current.dropTargets,
          location.current.dropTargets.length
        );
      }

      if (location.current.dropTargets.length === 2) {
        console.log(
          "dropTargets2",
          location.current.dropTargets,
          location.current.dropTargets.length
        );
      }
    }
  };

  useEffect(() => {
    return monitorForElements({
      onDrop: handleDrop,
    });
  }, []);
  return (
    <div className="board">
      {columnsData.map((columnData) => (
        <Column key={columnData.columnId} {...columnData} />
      ))}
    </div>
  );
};

export default Board;
