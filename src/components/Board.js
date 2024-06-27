import { useState } from "react";

import Column from "./Column";

import { BOARD_COLUMNS } from "../constant";

const Board = () => {
  const [columnsData, setColumnsData] = useState(BOARD_COLUMNS);

  return (
    <div className="board">
      {Object.keys(columnsData).map((columnId) => (
        <Column key={columnId} {...columnsData[columnId]} />
      ))}
    </div>
  );
};

export default Board;
