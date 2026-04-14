function StablePage({ horseState }) {
  const { horse, modifyHorse, addLog, recruitHorse } = horseState;

  const upgradeStable = () => {
    const cost = 200 + horse.level * 50;
    if (horse.gold < cost) {
      addLog("골드가 부족합니다.");
      return;
    }
    modifyHorse(
      {
        gold: horse.gold - cost,
        hp: Math.min(100, horse.hp + 20),
        stamina: Math.min(100, horse.stamina + 5),
      },
      "마구간을 업그레이드했습니다! 체력과 지구력이 증가했습니다.",
    );
  };

  return (
    <div className="page-content">
      <section className="panel">
        <h2>마구간 관리</h2>
        <div className="stable-grid">
          <div className="stable-card">
            <h3>마구간 상태</h3>
            <p>말 수: {horse.horses.length}</p>
            <p>현재 보유 골드: {horse.gold}</p>
            <p>업그레이드 비용: {200 + horse.level * 50}골드</p>
          </div>
          <div className="stable-card">
            <h3>말 성장치</h3>
            <p>속도: {horse.speed.toFixed(1)}</p>
            <p>지구력: {horse.stamina}</p>
          </div>
        </div>

        <div className="stable-grid">
          <button className="wide-button" onClick={upgradeStable}>
            마구간 업그레이드
          </button>
          <button className="wide-button" onClick={recruitHorse}>
            희귀 말 수집하기 (150골드)
          </button>
        </div>
      </section>

      <section className="panel">
        <h3>보유 말</h3>
        {horse.horses.map((item, index) => (
          <div key={`${item.name}-${index}`} className="inventory-item">
            <span>
              {item.name} ({item.rarity})
            </span>
            <span>
              속도 {item.speed}, 지구력 {item.stamina}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default StablePage;
