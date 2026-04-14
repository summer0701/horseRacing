const shopItems = [
  { id: "hay", name: "건초", price: 20, type: "food", value: 25 },
  { id: "energy", name: "에너지 드링크", price: 45, type: "food", value: 45 },
  { id: "medicine", name: "약", price: 90, type: "medicine", value: 40 },
  {
    id: "speedBoots",
    name: "스피드 부츠",
    price: 120,
    type: "equipment",
    value: 5,
  },
  { id: "shield", name: "보호구", price: 130, type: "equipment", value: 10 },
];

function ShopPage({ horseState }) {
  const { horse, buyItem } = horseState;

  return (
    <div className="page-content">
      <section className="panel">
        <h2>상점</h2>
        <div className="shop-grid">
          {shopItems.map((item) => (
            <div key={item.id} className="shop-card">
              <h3>{item.name}</h3>
              <p>가격: {item.price}골드</p>
              <p>
                {item.type === "food"
                  ? `${item.value} 포인트 회복`
                  : item.type === "medicine"
                    ? `병 치료 및 체력회복 +${item.value}`
                    : `능력치 +${item.value}`}
              </p>
              <button
                onClick={() => buyItem(item)}
                disabled={horse.gold < item.price}
              >
                구매
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ShopPage;
