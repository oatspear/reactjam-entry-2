import { MinionData } from '../logic';
import './RecruitActionBar.css';

interface RecruitActionBarProps {
  bench: MinionData[];
  graveyard: MinionData[];
  canDeploy: boolean;
}


function handleSelectMinion() {}


const RecruitActionBar = ({bench, graveyard}: RecruitActionBarProps): JSX.Element => {
  const n = bench.length;

  return (
    <div className="action-bar-recruit roster">
      {
        bench.map((minion: MinionData, i: number) => (
          <div className="item" key={i} onClick={handleSelectMinion}>{i+1}</div>
        ))
      }
      {
        graveyard.map((minion: MinionData, i: number) => (
          <div className="item" key={i+n} onClick={handleSelectMinion}>{i+n+1}</div>
        ))
      }
    </div>
  );
};

export default RecruitActionBar;
