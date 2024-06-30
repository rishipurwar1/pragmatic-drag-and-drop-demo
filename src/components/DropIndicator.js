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

export default DropIndicator;
