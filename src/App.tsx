import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";

import "./App.css";
import { itemLists } from "./object";

interface ItemT {
  category: string;
  itemId: string;
  itemName: string;
  itemPrice: number;
}

function App() {
  const [cart, setCart] = useState<ItemT[]>([]);
  const [coupon, setCoupon] = useState<"fa" | "pd" | null>(null);
  const [fa, setFa] = useState<number>(0);
  const [pd, setPd] = useState<number>(0);
  const [onTop, setOnTop] = useState<"byCategory" | "byPoint" | null>(null);
  const [byCategory, setByCategory] = useState<{
    category: "Clothing" | "Accessory" | "Electronics";
    discount: number;
  }>({ category: "Clothing", discount: 0 });
  const [byPoint, setByPoint] = useState<number>(0);
  const [seasonal, setSeasonal] = useState<{ every: number; discount: number }>(
    { every: 0, discount: 0 }
  );

  const handleAddCartAndTotal = (item: ItemT) => {
    setCart((prev) => [...prev, item]);
  };

  const handleRemoveCartAndTotal = (price: number, index: number) => {
    const newList = [...cart];
    newList.splice(index, 1);
    setCart(newList);
  };

  const handleSetCoupon = (
    e: MouseEvent<HTMLInputElement>,
    coupon: "fa" | "pd"
  ) => {
    const checked = e.currentTarget.checked;
    if (checked) {
      setCoupon(coupon);
    } else {
      setCoupon(null);
    }
  };

  const calculateTotalPrice = () => {
    let result: number = 0;

    const currentTotalInCart = cart.reduce(
      (acc, ele) => (acc += ele.itemPrice),
      0
    );

    result += currentTotalInCart;

    if (coupon == "fa") result -= fa;

    if (coupon == "pd")
      result = currentTotalInCart - (currentTotalInCart * pd) / 100;

    if (onTop == "byCategory" && cart.length) {
      cart.forEach((e) => {
        if (e.category == byCategory.category) {
          result -= (e.itemPrice * byCategory.discount) / 100;
        }
      });
    }

    if (onTop == "byPoint") result -= byPoint;

    if (seasonal.discount && seasonal.every)
      result -= Math.floor(result / seasonal.every) * seasonal.discount;

    return result;
  };

  const handleSetFa = (e: ChangeEvent<HTMLInputElement>) => {
    setFa(Number(e.currentTarget.value));
  };

  const handleSetPd = (e: ChangeEvent<HTMLInputElement>) => {
    setPd(Number(e.currentTarget.value));
  };

  const handleSetOnTop = (
    e: MouseEvent<HTMLInputElement>,
    type: "byCategory" | "byPoint"
  ) => {
    const checked = e.currentTarget.checked;
    if (checked) {
      setOnTop(type);
    } else {
      setOnTop(null);
    }
  };

  const handleSetByPoint = (e: ChangeEvent<HTMLInputElement>) => {
    setByPoint(Number(e.currentTarget.value));
  };

  const handleSetByCategory = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.currentTarget.value;
    setByCategory((prev) => ({ ...prev, category: value }));
  };

  const handleSetByCategoryDiscoint = (e: ChangeEvent<HTMLInputElement>) => {
    const discount = Number(e.currentTarget.value);
    setByCategory((prev) => ({ ...prev, discount: discount }));
  };

  const handleSetSeasonalEvery = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);
    if (typeof value == "number")
      setSeasonal((prev) => ({
        ...prev,
        every: value,
      }));
  };

  const handleSetSeasonalDiscount = (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.currentTarget.value);
    if (typeof value == "number")
      setSeasonal((prev) => ({
        ...prev,
        discount: value,
      }));
  };

  return (
    <div className="flex">
      <div className="height border">
        <span className="bold">Add Items</span>
        {itemLists.map((d) => (
          <ul>
            {d.name}
            {d.itemLists.map((i) => (
              <>
                <li
                  onClick={() =>
                    handleAddCartAndTotal({
                      category: d.name,
                      itemId: i.id,
                      itemName: i.name,
                      itemPrice: i.price,
                    })
                  }
                  style={{ cursor: "pointer" }}
                >
                  {i.icon} {i.name} {i.price}
                </li>
              </>
            ))}
          </ul>
        ))}
      </div>
      <div className="height border">
        <span className="bold">Select Discounts</span>
        <div className="flex-col">
          <div>
            Coupon
            <div>
              <input
                type="checkbox"
                onClick={(e) => handleSetCoupon(e, "fa")}
                disabled={coupon == "pd"}
              />
              Fixed Amount
              <input type="number" onChange={handleSetFa} />
            </div>
            <div>
              <input
                type="checkbox"
                onClick={(e) => handleSetCoupon(e, "pd")}
                disabled={coupon == "fa"}
              />
              Percentage Discount
              <input type="number" onChange={handleSetPd} />
            </div>
          </div>
          <div>
            On Top
            <div>
              <div>
                <input
                  type="checkbox"
                  onClick={(e) => handleSetOnTop(e, "byCategory")}
                  disabled={onTop == "byPoint"}
                />
                Percentage discount by item category
              </div>
              <select onChange={handleSetByCategory}>
                {itemLists.map((i) => (
                  <option value={i.name}>{i.name}</option>
                ))}
              </select>
              <input type="number" onChange={handleSetByCategoryDiscoint} />
            </div>
            <div>
              <input
                type="checkbox"
                onClick={(e) => handleSetOnTop(e, "byPoint")}
                disabled={onTop == "byCategory"}
              />
              Discount by points
              <input type="number" onChange={handleSetByPoint} />
            </div>
          </div>
          <div>
            Seasonal
            <div>
              <div>
                Every:
                <input type="number" onChange={handleSetSeasonalEvery} />
                THB
              </div>
              <div>
                Discount:{" "}
                <input type="number" onChange={handleSetSeasonalDiscount} />
                THB
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="height border">
        <p>
          <span className="bold">Items In Cart:</span>
          {cart.map((list, i) => (
            <div>
              {list.itemName} {list.itemPrice}
              <i
                className="fa-solid fa-x"
                onClick={() => handleRemoveCartAndTotal(list.price, i)}
              ></i>
            </div>
          ))}
        </p>
        <span className="bold">Discount:</span>
        <div>
          Coupon:{" "}
          {coupon == "fa" ? fa + "THB" : coupon == "pd" ? pd + "%" : null}
        </div>
        <div>
          OnTop:{" "}
          {onTop == "byCategory"
            ? byCategory.discount + "% Off on " + byCategory.category
            : onTop == "byPoint"
            ? byPoint + "Points"
            : null}
        </div>
        <div>
          Seasonal:{" "}
          {seasonal.discount && seasonal.every
            ? `Discount ${seasonal.discount} THB at every ${seasonal.every} THB`
            : null}
        </div>
        <span className="bold">Total Prices: </span>
        {calculateTotalPrice()}
      </div>
    </div>
  );
}

export default App;
