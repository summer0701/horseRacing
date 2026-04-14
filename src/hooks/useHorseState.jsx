import { useCallback, useEffect, useMemo, useState } from "react";

const initialHorse = {
  name: "썬더",
  level: 1,
  hp: 100,
  hunger: 50,
  speed: 10,
  stamina: 10,
  exp: 0,
  gold: 100,
  sick: false,
  equipment: [],
  inventory: [
    { id: "hay", name: "건초", type: "food", value: 25, count: 3 },
    { id: "energy", name: "에너지 드링크", type: "food", value: 40, count: 1 },
  ],
  skills: ["질주", "회복"],
  horses: [{ name: "썬더", rarity: "일반", speed: 10, stamina: 10 }],
};

const STORAGE_KEY = "horseRacingGameState";

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialHorse;
  } catch (error) {
    console.error("저장된 상태 로드 오류", error);
    return initialHorse;
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function useHorseState() {
  const [horse, setHorse] = useState(loadState);
  const [log, setLog] = useState(["게임 시작!"]);
  const [dialogue, setDialogue] = useState("준비 완료. 말을 돌봐주세요.");

  useEffect(() => {
    saveState(horse);
  }, [horse]);

  const addLog = useCallback((message) => {
    setLog((items) => [message, ...items].slice(0, 10));
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHorse((prev) => {
        const nextHunger = Math.max(0, prev.hunger - 3);
        const nextHp = Math.min(100, prev.hp + (prev.hunger < 20 ? -5 : 1));
        const nextSick = prev.sick || nextHp < 30 || nextHunger < 10;
        if (!prev.sick && nextSick) {
          setTimeout(
            () => addLog("말이 병에 걸렸습니다. 약을 사서 치료하세요."),
            0,
          );
        }
        return {
          ...prev,
          hunger: nextHunger,
          hp: Math.max(0, nextHp),
          sick: nextSick,
        };
      });
    }, 10000);

    return () => clearInterval(timer);
  }, [addLog]);

  useEffect(() => {
    const talkTimer = setInterval(() => {
      if (horse.hunger < 25) {
        setDialogue("배가 정말 고파요... 먹을 거 없나요?");
      } else if (horse.hp < 35) {
        setDialogue("조금 쉬면 더 잘 달릴 수 있을 것 같아요.");
      } else if (Math.random() < 0.4) {
        setDialogue("오늘도 함께 달릴 준비가 되었어요!");
      } else {
        setDialogue("말을 돌봐줘서 고마워요.");
      }
    }, 25000);

    return () => clearInterval(talkTimer);
  }, [horse.hunger, horse.hp]);

  const modifyHorse = useCallback(
    (partial, message) => {
      setHorse((prev) => ({ ...prev, ...partial }));
      if (message) addLog(message);
    },
    [addLog],
  );

  const feed = useCallback(
    (food) => {
      if (!food || food.count <= 0) return;
      modifyHorse(
        {
          hunger: Math.min(100, horse.hunger + food.value),
          hp: Math.min(100, horse.hp + Math.floor(food.value * 0.5)),
          inventory: horse.inventory.map((item) =>
            item.id === food.id ? { ...item, count: item.count - 1 } : item,
          ),
        },
        `${horse.name}에게 ${food.name}를 먹였습니다!`,
      );
      setDialogue(`${horse.name}이(가) ${food.name}를 맛있게 먹었어요.`);
    },
    [horse, modifyHorse],
  );

  const train = useCallback(() => {
    if (horse.hp < 20) {
      addLog("체력이 부족하여 훈련할 수 없습니다.");
      setDialogue("체력이 부족해서 오늘은 휴식이 필요해요.");
      return;
    }
    const gainExp = 15 + Math.floor(Math.random() * 10);
    const gainGold = 10 + Math.floor(Math.random() * 15);
    const hungerCost = Math.min(100, horse.hunger + 15);
    const hpCost = Math.max(0, horse.hp - 10);
    const nextExp = horse.exp + gainExp;
    const nextLevel = horse.level + (nextExp >= 100 ? 1 : 0);
    const nextExpRemainder = nextExp >= 100 ? nextExp - 100 : nextExp;
    modifyHorse(
      {
        exp: nextExpRemainder,
        level: nextLevel,
        gold: horse.gold + gainGold,
        hunger: hungerCost,
        hp: hpCost,
        speed: horse.speed + 0.5,
        stamina: Math.min(100, horse.stamina + 1),
      },
      `${horse.name}이(가) 훈련을 완료했습니다! +${gainExp} 경험, +${gainGold} 골드`,
    );
    setDialogue("훈련이 끝났어요! 조금 피곤하지만 기운이 나요.");
  }, [horse, modifyHorse, addLog]);

  const race = useCallback(() => {
    if (horse.hp < 15) {
      addLog("체력이 부족하여 경주에 참가할 수 없습니다.");
      setDialogue("체력이 너무 낮아요... 경주는 다음에 도전할게요.");
      return;
    }
    const opponentSpeed = 8 + Math.random() * 12;
    const score = horse.speed + horse.stamina / 10 + Math.random() * 8;
    const difficulty = opponentSpeed + Math.random() * 10;

    const win = score >= difficulty;
    const rewardGold = win ? 80 + Math.floor(Math.random() * 50) : 20;
    const rewardExp = win ? 40 + Math.floor(Math.random() * 20) : 10;
    const nextHp = Math.max(0, horse.hp - (win ? 8 : 18));
    const nextHunger = Math.min(100, horse.hunger + 20);

    modifyHorse(
      {
        gold: horse.gold + rewardGold,
        exp: horse.exp + rewardExp,
        hp: nextHp,
        hunger: nextHunger,
      },
      win
        ? `경주 승리! +${rewardGold}골드, +${rewardExp}경험`
        : `경주 패배... +${rewardGold}골드, +${rewardExp}경험`,
    );
    setDialogue(
      win
        ? "우와! 최고의 질주였어요!"
        : "이번엔 아쉽지만 다음에는 이길 수 있어요.",
    );
  }, [horse, modifyHorse, addLog]);

  const races = useMemo(
    () => [
      {
        id: "rookie",
        name: "루키 레이스",
        fee: 20,
        reward: 60,
        exp: 20,
        difficulty: 3,
        description: "가벼운 연습 경기입니다.",
      },
      {
        id: "champion",
        name: "챔피언 리그",
        fee: 60,
        reward: 180,
        exp: 55,
        difficulty: 7,
        description: "상위 선수들과 경쟁하는 높은 난이도 경기입니다.",
      },
      {
        id: "legend",
        name: "레전드 클래식",
        fee: 120,
        reward: 380,
        exp: 110,
        difficulty: 10,
        description: "가장 어려운 레이스로, 최고 보상이 걸려 있습니다.",
      },
    ],
    [],
  );

  const runRace = useCallback(
    (raceId) => {
      const selected = races.find((item) => item.id === raceId);
      if (!selected) {
        addLog("선택한 경주를 찾을 수 없습니다.");
        return null;
      }
      if (horse.gold < selected.fee) {
        addLog("골드가 부족하여 참가할 수 없습니다.");
        return null;
      }
      if (horse.hp < 20) {
        addLog("체력이 부족하여 참가할 수 없습니다.");
        return null;
      }

      const racePower =
        horse.speed * 1.2 + horse.stamina * 0.9 + Math.random() * 18;
      const opponentPower = selected.difficulty * 9 + Math.random() * 20;
      const win = racePower >= opponentPower;
      const rewardGold = win
        ? selected.reward
        : Math.floor(selected.reward / 4);
      const rewardExp = win ? selected.exp : Math.floor(selected.exp / 2);
      const hpCost = win ? 12 : 26;
      const nextHp = Math.max(0, horse.hp - hpCost);
      const nextHunger = Math.min(100, horse.hunger + (win ? 18 : 28));
      const nextGold = horse.gold - selected.fee + rewardGold;
      const nextExpTotal = horse.exp + rewardExp;
      const nextLevel = horse.level + (nextExpTotal >= 100 ? 1 : 0);
      const nextExp = nextExpTotal >= 100 ? nextExpTotal - 100 : nextExpTotal;

      modifyHorse(
        {
          gold: nextGold,
          exp: nextExp,
          level: nextLevel,
          hp: nextHp,
          hunger: nextHunger,
        },
        win
          ? `${selected.name}에서 우승! 참가비 ${selected.fee}골드, 보상 ${rewardGold}골드, 경험치 ${rewardExp}`
          : `${selected.name}에서 패배... 참가비 ${selected.fee}골드, 보상 ${rewardGold}골드, 경험치 ${rewardExp}`,
      );

      return {
        selected,
        win,
        rewardGold,
        rewardExp,
        fee: selected.fee,
        opponentPower: opponentPower.toFixed(1),
        racePower: racePower.toFixed(1),
      };
    },
    [horse, modifyHorse, addLog, races],
  );

  const buyItem = useCallback(
    (item) => {
      if (horse.gold < item.price) {
        addLog("골드가 부족합니다.");
        return;
      }
      const existing = horse.inventory.find((entry) => entry.id === item.id);
      const inventory = existing
        ? horse.inventory.map((entry) =>
            entry.id === item.id ? { ...entry, count: entry.count + 1 } : entry,
          )
        : [...horse.inventory, { ...item, count: 1 }];

      modifyHorse(
        { gold: horse.gold - item.price, inventory },
        `${item.name}을(를) 구매했습니다.`,
      );
    },
    [horse, modifyHorse, addLog],
  );

  const saveToGoogleSheet = useCallback(
    async (endpointUrl) => {
      try {
        await fetch(endpointUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ horse }),
        });
        addLog("구글 시트에 저장 요청을 보냈습니다.");
      } catch (error) {
        addLog("구글 시트 저장에 실패했습니다.");
        console.error(error);
      }
    },
    [horse, addLog],
  );

  const recruitHorse = useCallback(() => {
    const cost = 150;
    if (horse.gold < cost) {
      addLog("골드가 부족하여 새로운 말을 수집할 수 없습니다.");
      return;
    }
    const rarities = [
      { label: "희귀", chance: 0.12, speed: 16, stamina: 14 },
      { label: "특별", chance: 0.24, speed: 14, stamina: 12 },
      { label: "일반", chance: 0.64, speed: 11, stamina: 10 },
    ];
    const roll = Math.random();
    let accumulated = 0;
    const picked =
      rarities.find((item) => {
        accumulated += item.chance;
        return roll <= accumulated;
      }) || rarities[2];
    const newHorse = {
      name: `말-${Date.now().toString().slice(-4)}`,
      rarity: picked.label,
      speed: picked.speed,
      stamina: picked.stamina,
    };

    modifyHorse(
      {
        horses: [...horse.horses, newHorse],
        gold: horse.gold - cost,
      },
      `${newHorse.rarity} 말 ${newHorse.name}을(를) 수집했습니다!`,
    );
  }, [horse, modifyHorse, addLog]);

  const clickIdle = useCallback(() => {
    const gainGold = 5 + Math.floor(Math.random() * 10);
    modifyHorse(
      { gold: horse.gold + gainGold, hunger: Math.min(100, horse.hunger + 2) },
      `말을 쓰다듬어 ${gainGold}골드를 얻었습니다!`,
    );
    setDialogue("쓰다듬어주니 기분이 좋아졌어요!");
  }, [horse, modifyHorse]);

  const useMedicine = useCallback(() => {
    const medicine = horse.inventory.find((item) => item.id === "medicine");
    if (!medicine || medicine.count <= 0) {
      addLog("약이 없습니다.");
      setDialogue("약이 없어서 치료할 수 없어요.");
      return;
    }

    modifyHorse(
      {
        hp: Math.min(100, horse.hp + 40),
        hunger: Math.min(100, horse.hunger + 8),
        sick: false,
        inventory: horse.inventory.map((item) =>
          item.id === "medicine" ? { ...item, count: item.count - 1 } : item,
        ),
      },
      `약을 먹여서 병을 치료했습니다!`,
    );
    setDialogue("약을 먹고 몸 상태가 좋아졌어요.");
  }, [horse, modifyHorse, addLog]);

  const status = useMemo(
    () => ({
      expToNext: 100 - horse.exp,
      rarity: horse.level >= 10 ? "희귀" : "일반",
    }),
    [horse.exp, horse.level],
  );

  return {
    horse,
    log,
    dialogue,
    status,
    feed,
    train,
    race,
    runRace,
    races,
    buyItem,
    useMedicine,
    saveToGoogleSheet,
    recruitHorse,
    clickIdle,
    modifyHorse,
    addLog,
  };
}

export default useHorseState;
