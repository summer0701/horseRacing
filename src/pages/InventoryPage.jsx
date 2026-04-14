function InventoryPage({ horseState }) {
  const { horse, feed, useMedicine } = horseState;
  const equipment = horse.inventory.filter((item) => item.type === "equipment");
  const food = horse.inventory.filter((item) => item.type === "food");
  const medicine = horse.inventory.filter((item) => item.type === "medicine");

  return (
    <div className="page-content">
      <section className="panel">
        <h2>인벤토리</h2>
        <div className="inventory-grid">
          <div className="inventory-card">
            <h3>음식</h3>
            {food.length ? (
              food.map((item) => (
                <div key={item.id} className="inventory-item">
                  <span>
                    {item.name} x{item.count}
                  </span>
                  <button onClick={() => feed(item)} disabled={item.count <= 0}>
                    먹이 주기
                  </button>
                </div>
              ))
            ) : (
              <p>음식이 없습니다.</p>
            )}
          </div>
          <div className="inventory-card">
            <h3>장비</h3>
            {equipment.length ? (
              equipment.map((item) => (
                <div key={item.id} className="inventory-item">
                  <span>
                    {item.name} x{item.count}
                  </span>
                </div>
              ))
            ) : (
              <p>장비가 없습니다.</p>
            )}
          </div>
          <div className="inventory-card">
            <h3>약</h3>
            {medicine.length ? (
              medicine.map((item) => (
                <div key={item.id} className="inventory-item">
                  <span>
                    {item.name} x{item.count}
                  </span>
                  <button onClick={useMedicine} disabled={item.count <= 0}>
                    투여하기
                  </button>
                </div>
              ))
            ) : (
              <p>약이 없습니다.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default InventoryPage;
