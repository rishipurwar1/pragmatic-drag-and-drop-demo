import Card from "./Card";

const Column = ({ columnId, title, cards }) => {
  return (
    <div className="column">
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
