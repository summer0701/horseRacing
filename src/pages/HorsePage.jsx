function HorsePage({ horseState }) {
  const {
    horse,
    status,
    feed,
    train,
    saveToGoogleSheet,
    clickIdle,
    helpWithFarming,
    offerHorseRide,
    doCommunityService,
    useMedicine,
    log,
  } = horseState;
  const foodItems = horse.inventory.filter((item) => item.type === "food");
  const medicineItem = horse.inventory.find((item) => item.id === "medicine");
  const horseImage = horse.sick
    ? "🤕🐴"
    : horse.hp <= 25
      ? "🥵🐴"
      : horse.hp >= 80
        ? "✨🐎"
        : "🐎";

  return (
    <div className="page-content">
      <section className="panel">
        <h2>내 말 정보</h2>
        <div className="horse-card">
          <div className="pixel-horse">{horseImage}</div>
          <div className="horse-stats">
            <p>이름: {horse.name}</p>
            <p>레벨: {horse.level}</p>
            <p>경험치: {horse.exp} / 100</p>
            <p>체력: {horse.hp}</p>
            <p>배고픔: {horse.hunger}</p>
            <p>속도: {horse.speed.toFixed(1)}</p>
            <p>지구력: {horse.stamina}</p>
            <p>친밀도: {horse.affinity}</p>
            <p>골드: {horse.gold}</p>
            <p>상태: {horse.sick ? "아픔" : "정상"}</p>
            <p>희귀도: {status.rarity}</p>
          </div>
        </div>
      </section>

      <section className="panel actions-panel">
        <h3>행동</h3>
        <div className="action-grid">
          <button onClick={clickIdle}>말 쓰다듬기</button>
          <button
            onClick={() => feed(foodItems[0])}
            disabled={!foodItems.length}
          >
            먹이 주기
          </button>
          <button onClick={train}>훈련하기</button>
          <button onClick={helpWithFarming}>농사 도와주기</button>
          <button onClick={offerHorseRide}>말 태워주기</button>
          <button onClick={doCommunityService}>지역 봉사</button>
          <button
            onClick={() =>
              saveToGoogleSheet("https://your-script-url.example.com")
            }
          >
            구글 시트 저장
          </button>
          <button
            onClick={useMedicine}
            disabled={!medicineItem || medicineItem.count <= 0}
          >
            약 먹이기 {medicineItem ? `(${medicineItem.count}개)` : ""}
          </button>
        </div>
        <p className="note">
          * 원하는 Google Apps Script 엔드포인트로 URL을 바꾸세요.
        </p>
      </section>

      <section className="panel">
        <h3>로그</h3>
        <div className="log-box">
          {log.map((entry, index) => (
            <div key={index} className="log-entry">
              {entry}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HorsePage;
