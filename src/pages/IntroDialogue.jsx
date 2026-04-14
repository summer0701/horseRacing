import { useMemo, useState } from "react";

const script = [
  {
    speaker: "트레이너",
    text: "어서 와, 주인님. 오늘은 썬더의 컨디션을 확인해야 해요.",
    choices: [
      { id: "check", label: "말 상태를 점검할래요." },
      { id: "feed", label: "먼저 먹이를 줄게요." },
    ],
  },
  {
    speaker: "썬더",
    text: "힘이 조금 빠졌어요... 배가 고파요.",
    choices: [
      { id: "train", label: "훈련을 준비할게." },
      { id: "rest", label: "잠시 쉬게 할래." },
    ],
  },
  {
    speaker: "트레이너",
    text: "좋아요. 이제 마구간에서 전략을 세우고 첫 경주를 준비해볼까요?",
    choices: [{ id: "start", label: "게임 시작하기" }],
  },
];

function IntroDialogue({ horseState, onStart }) {
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);

  const current = script[step];

  const portrait = useMemo(() => {
    return step === 1 ? "🦄" : "👩‍🌾";
  }, [step]);

  const handleChoice = (choice) => {
    setHistory((currentHistory) => [
      ...currentHistory,
      { speaker: current.speaker, text: current.text },
      { speaker: "선택", text: choice.label },
    ]);

    if (choice.id === "feed") {
      horseState.feed(
        horseState.horse.inventory.find((item) => item.type === "food"),
      );
    }
    if (choice.id === "train") {
      horseState.addLog("말 준비를 완료했습니다. 훈련이 곧 시작됩니다.");
    }
    if (choice.id === "rest") {
      horseState.modifyHorse(
        { hp: Math.min(100, horseState.horse.hp + 10) },
        "말이 잠시 쉬었습니다.",
      );
    }

    if (step + 1 >= script.length) {
      onStart();
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="intro-shell">
      <div className="intro-panel">
        <div className="intro-header">대화 이벤트</div>
        <div className="intro-main">
          <div className="intro-portrait">{portrait}</div>
          <div className="intro-dialogue">
            <div className="intro-speech">
              <span className="speaker">{current.speaker}</span>
              <p>{current.text}</p>
            </div>
            <div className="choice-grid">
              {current.choices.map((choice) => (
                <button key={choice.id} onClick={() => handleChoice(choice)}>
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="intro-history-panel">
        <h3>대화 기록</h3>
        {history.length === 0 ? (
          <p>여기를 통해 말을 걸면 게임이 더 재미있어집니다.</p>
        ) : (
          history.map((line, index) => (
            <div key={index} className="history-line">
              <strong>{line.speaker}:</strong> {line.text}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default IntroDialogue;
