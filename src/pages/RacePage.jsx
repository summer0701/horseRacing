import { useEffect, useState } from "react";

function RacePage({ horseState }) {
  const { horse, races, runRace } = horseState;
  const [activeRace, setActiveRace] = useState(null);
  const [stage, setStage] = useState("idle");
  const [playerProgress, setPlayerProgress] = useState(0);
  const [enemyProgress, setEnemyProgress] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (stage !== "running" || !activeRace) return;

    const playerBase = horse.speed * 0.7 + horse.stamina * 0.5;
    const enemyBase = activeRace.difficulty * 6 + 10;

    const interval = setInterval(() => {
      setPlayerProgress((current) =>
        Math.min(100, current + playerBase * (0.4 + Math.random() * 0.2)),
      );
      setEnemyProgress((current) =>
        Math.min(100, current + enemyBase * (0.35 + Math.random() * 0.25)),
      );
    }, 170);

    return () => clearInterval(interval);
  }, [activeRace, horse.speed, horse.stamina, stage]);

  useEffect(() => {
    if (stage !== "running") return;
    if (playerProgress >= 100 || enemyProgress >= 100) {
      const raceResult = runRace(activeRace.id);
      setResult(raceResult);
      setStage("result");
    }
  }, [playerProgress, enemyProgress, runRace, activeRace, stage]);

  const handleEnter = (raceOption) => {
    if (horse.gold < raceOption.fee || horse.hp < 20) return;
    setActiveRace(raceOption);
    setStage("running");
    setPlayerProgress(0);
    setEnemyProgress(0);
    setResult(null);
  };

  const resetRace = () => {
    setStage("idle");
    setActiveRace(null);
    setPlayerProgress(0);
    setEnemyProgress(0);
    setResult(null);
  };

  return (
    <div className="page-content">
      <section className="panel">
        <h2>경주</h2>
        <p>말의 속도: {horse.speed.toFixed(1)}</p>
        <p>말의 지구력: {horse.stamina}</p>
        <p>친밀도: {horse.affinity}</p>
        <p>보유 골드: {horse.gold}</p>
        <p>
          체력: {horse.hp} / 배고픔: {horse.hunger}
        </p>
      </section>

      {stage === "idle" && (
        <section className="panel">
          <h3>참가 가능한 경주</h3>
          <div className="race-grid">
            {races.map((raceOption) => (
              <div key={raceOption.id} className="race-card">
                <h4>{raceOption.name}</h4>
                <p>{raceOption.description}</p>
                <p>참가비: {raceOption.fee}골드</p>
                <p>
                  보상: {raceOption.reward}골드 / 경험치 +{raceOption.exp}
                </p>
                <p>난이도: {raceOption.difficulty}</p>
                <button
                  className="wide-button"
                  onClick={() => handleEnter(raceOption)}
                  disabled={horse.gold < raceOption.fee || horse.hp < 20}
                >
                  참가하기
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {stage === "running" && activeRace && (
        <section className="panel race-stage">
          <h3>{activeRace.name} 경주 중...</h3>
          <div className="race-track">
            <div className="track-lane">
              <span
                className="horse-runner player forward-facing"
                style={{ left: `${Math.min(playerProgress, 98)}%` }}
              >
                🐎
              </span>
            </div>
            <div className="track-lane opponent">
              <span
                className="horse-runner rival"
                style={{ left: `${Math.min(enemyProgress, 98)}%` }}
              >
                🐴
              </span>
            </div>
            <div className="finish-line" />
          </div>
          <div className="race-status">
            <span>우리말: {Math.floor(playerProgress)}%</span>
            <span>상대말: {Math.floor(enemyProgress)}%</span>
          </div>
        </section>
      )}

      {stage === "result" && result && (
        <section className="panel race-stage">
          <h3>{result.win ? "승리했습니다!" : "패배했습니다..."}</h3>
          <p>{result.selected.name} 결과</p>
          <p>참가비: {result.fee}골드</p>
          <p>획득 골드: {result.rewardGold}골드</p>
          <p>획득 경험치: {result.rewardExp}</p>
          <p>말의 레이스 파워: {result.racePower}</p>
          <p>상대 파워: {result.opponentPower}</p>
          <button className="wide-button" onClick={resetRace}>
            다른 경주 보기
          </button>
        </section>
      )}
    </div>
  );
}

export default RacePage;
