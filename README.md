# 말 키우는 픽셀 아트 게임

React + Vite로 만든 말 육성 클릭형 방치형 게임입니다.

## 주요 기능

- `HorsePage`: 말 상태 확인, 먹이 주기, 훈련, 경주, 클릭 보상
- `StablePage`: 마구간 업그레이드, 희귀 말 수집, 보유 말 확인
- `ShopPage`: 음식과 장비 구매
- `InventoryPage`: 인벤토리 관리, 먹이 사용
- `RacePage`: 경주 참가 및 보상 획득
- `useHorseState`: 말 상태, 로컬 저장, 시간 경과 자동 변화, 구글 시트 저장 함수

## 실행

1. `npm install`
2. `npm run dev`

## 빌드

- `npm run build`

## 구글 시트 저장

- `src/pages/HorsePage.jsx`의 `saveToGoogleSheet` 버튼에 Google Apps Script 엔드포인트 URL을 입력하세요.
