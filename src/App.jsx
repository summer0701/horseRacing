import { useState } from "react";
import useHorseState from "./hooks/useHorseState";
import IntroDialogue from "./pages/IntroDialogue";
import HorsePage from "./pages/HorsePage";
import StablePage from "./pages/StablePage";
import ShopPage from "./pages/ShopPage";
import RacePage from "./pages/RacePage";
import InventoryPage from "./pages/InventoryPage";

const pages = [
  { id: "horse", label: "말 정보" },
  { id: "stable", label: "마구간" },
  { id: "shop", label: "상점" },
  { id: "race", label: "경주" },
  { id: "inventory", label: "인벤토리" },
];

function App() {
  const [activePage, setActivePage] = useState("horse");
  const [started, setStarted] = useState(false);
  const horseState = useHorseState();

  if (!started) {
    return (
      <div className="app-shell intro-mode">
        <header className="top-bar intro-top-bar">
          <div className="title">말 키우는 픽셀 아트 게임</div>
          <div className="summary">초기 대화로 게임을 시작하세요.</div>
        </header>
        <main className="intro-view">
          <IntroDialogue
            horseState={horseState}
            onStart={() => setStarted(true)}
          />
        </main>
      </div>
    );
  }

  const itemSummary = horseState.horse.inventory
    .filter((item) => item.count > 0)
    .map((item) => `${item.name} x${item.count}`)
    .join(" ・ ");

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <div className="title">말 키우는 픽셀 아트 게임</div>
          <div className="subsummary">
            {itemSummary || "인벤토리가 비어 있어요."}
          </div>
        </div>
        <div className="summary">
          금화: {horseState.horse.gold} / 레벨: {horseState.horse.level}
        </div>
      </header>
      <div className="dialogue-bar">{horseState.dialogue}</div>

      <div className="layout">
        <nav className="sidebar">
          {pages.map((page) => (
            <button
              key={page.id}
              className={
                activePage === page.id ? "nav-button active" : "nav-button"
              }
              onClick={() => setActivePage(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>

        <main className="page-view">
          {activePage === "horse" && <HorsePage horseState={horseState} />}
          {activePage === "stable" && <StablePage horseState={horseState} />}
          {activePage === "shop" && <ShopPage horseState={horseState} />}
          {activePage === "race" && <RacePage horseState={horseState} />}
          {activePage === "inventory" && (
            <InventoryPage horseState={horseState} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
