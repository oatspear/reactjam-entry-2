import './GridComponent.css';


// Define the type for component props
interface GridComponentProps {
  enemies: Array<number>;
  minions: Array<number>;
}


function newGridItem(minion: number, i: number) {
  return (
    <div className={"grid-item " + (!!minion ? "" : "empty")} key={i}>
      {minion}
    </div>
  );
}


const GridComponent = ({enemies, minions}: GridComponentProps): JSX.Element => {
  const $enemies = enemies.map(newGridItem);
  const $minions = minions.map(newGridItem);

  return (
    <div className="grid-container">
      <div className="sub-grid">
        { $enemies }
      </div>
      <div className="empty-container">
        <div className="power-label"><span>4</span></div>
        <div className="power-label"><span>100</span></div>
      </div>
      <div className="sub-grid">
        { $minions }
      </div>
    </div>
  );
};

export default GridComponent;
