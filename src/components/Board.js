import { useState } from "react";

import Column from "./Column";

import { BOARD_COLUMNS } from "../constant";

const Board = () => {
  const [columnsData, setColumnsData] = useState(BOARD_COLUMNS);

  return (
    <div className="board">
      {columnsData.map((columnData) => (
        <Column key={columnData.columnId} {...columnData} />
      ))}
    </div>
  );
};

export default Board;
