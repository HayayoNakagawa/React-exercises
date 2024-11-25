import { useEffect, useState } from "react";
import "./styles.css"; // CSSファイルをインポート

// APIからデータを取得する関数（モンスター）
async function fetchMonsters() {
  const response = await fetch("https://mhw-db.com/monsters");
  return response.json();
}

// APIからデータを取得する関数（武器）
async function fetchWeapons() {
  const response = await fetch("https://mhw-db.com/weapons");
  return response.json();
}

// APIからデータを取得する関数（防具）
async function fetchArmor() {
  const response = await fetch("https://mhw-db.com/armor");
  return response.json();
}

export default function App() {
  const [monsters, setMonsters] = useState([]); // モンスターのリスト
  const [weapons, setWeapons] = useState([]); // 武器のリスト
  const [armor, setArmor] = useState([]); // 防具のリスト
  const [filteredItems, setFilteredItems] = useState([]); // フィルタリングされたリスト
  const [category, setCategory] = useState("All"); // カテゴリ選択
  const [searchTerm, setSearchTerm] = useState(""); // 検索語句
  const [type, setType] = useState("Monsters"); // 表示するデータタイプ（Monsters / Weapons / Armor）
  const [stage, setStage] = useState("all"); // 武器の強化段階（all, initial, upgraded, final）
  const [weaponType, setWeaponType] = useState("All"); // 武器タイプ
  const [weaponElement, setWeaponElement] = useState("All"); // 武器の属性
  const [weaponRarity, setWeaponRarity] = useState("all"); // 武器のレアリティ
  const [armorRarity, setArmorRarity] = useState("all"); // 防具のレアリティ
  const [armorRank, setArmorRank] = useState("all"); // 防具のランク（high, low）

  useEffect(() => {
    (async () => {
      const monsterData = await fetchMonsters();
      setMonsters(monsterData);

      const weaponData = await fetchWeapons();
      setWeapons(weaponData);

      const armorData = await fetchArmor();
      setArmor(armorData);

      setFilteredItems(monsterData);
    })();
  }, []);

  useEffect(() => {
    const items =
      type === "Monsters"
        ? monsters
        : type === "Weapons"
        ? weapons
        : armor;

    const results = items.filter((item) => {
      const matchesCategory =
        type !== "Monsters" ||
        category === "All" ||
        item.type?.toLowerCase() === category.toLowerCase();

      const matchesStage =
        type !== "Weapons" ||
        stage === "all" ||
        (stage === "initial" && item.crafting?.craftable) ||
        (stage === "upgraded" && item.crafting?.previous) ||
        (stage === "final" && item.crafting?.branches?.length === 0);

      const matchesWeaponType =
        type !== "Weapons" ||
        weaponType === "All" ||
        item.type?.toLowerCase() === weaponType.toLowerCase();

      const matchesWeaponElement =
        type !== "Weapons" ||
        weaponElement === "All" ||
        item.elements?.some(
          (el) => el.type?.toLowerCase() === weaponElement.toLowerCase()
        );

      const matchesWeaponRarity =
        type !== "Weapons" ||
        weaponRarity === "all" ||
        item.rarity === parseInt(weaponRarity);

      const matchesArmorRarity =
        type !== "Armor" ||
        armorRarity === "all" ||
        item.rarity === parseInt(armorRarity);

      const matchesArmorRank =
        type !== "Armor" ||
        armorRank === "all" ||
        item.rank?.toLowerCase() === armorRank.toLowerCase();

      const matchesSearchTerm = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return (
        matchesCategory &&
        matchesStage &&
        matchesWeaponType &&
        matchesWeaponElement &&
        matchesWeaponRarity &&
        matchesArmorRarity &&
        matchesArmorRank &&
        matchesSearchTerm
      );
    });

    setFilteredItems(results);
  }, [
    category,
    searchTerm,
    type,
    stage,
    weaponType,
    weaponElement,
    weaponRarity,
    armorRarity,
    armorRank,
    monsters,
    weapons,
    armor,
  ]);

  return (
    <>
      <header>
        <h1>Monster Hunter World Database</h1>
      </header>
      <div>
        <aside>
          <form>
            <div>
              <label htmlFor="type">Choose type:</label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Monsters">Monsters</option>
                <option value="Weapons">Weapons</option>
                <option value="Armor">Armor</option>
              </select>
            </div>
            {type === "Weapons" && (
              <>
                <div>
                  <label htmlFor="stage">Choose upgrade stage:</label>
                  <select
                    id="stage"
                    value={stage}
                    onChange={(e) => setStage(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="initial">Initial</option>
                    <option value="upgraded">Upgraded</option>
                    <option value="final">Final</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="weaponType">Filter by weapon type:</label>
                  <select
                    id="weaponType"
                    value={weaponType}
                    onChange={(e) => setWeaponType(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="great-sword">Great Sword</option>
                    <option value="long-sword">Long Sword</option>
                    <option value="sword-and-shield">Sword and Shield</option>
                    <option value="dual-blades">Dual Blades</option>
                    <option value="hammer">Hammer</option>
                    <option value="hunting-horn">Hunting Horn</option>
                    <option value="lance">Lance</option>
                    <option value="gunlance">Gunlance</option>
                    <option value="switch-axe">Switch Axe</option>
                    <option value="charge-blade">Charge Blade</option>
                    <option value="insect-glaive">Insect Glaive</option>
                    <option value="light-bowgun">Light Bowgun</option>
                    <option value="heavy-bowgun">Heavy Bowgun</option>
                    <option value="bow">Bow</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="weaponElement">Filter by element:</label>
                  <select
                    id="weaponElement"
                    value={weaponElement}
                    onChange={(e) => setWeaponElement(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="fire">Fire</option>
                    <option value="water">Water</option>
                    <option value="thunder">Thunder</option>
                    <option value="ice">Ice</option>
                    <option value="dragon">Dragon</option>
                    <option value="poison">Poison</option>
                    <option value="paralysis">Paralysis</option>
                    <option value="sleep">Sleep</option>
                    <option value="blast">Blast</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="weaponRarity">Filter by rarity:</label>
                  <select
                    id="weaponRarity"
                    value={weaponRarity}
                    onChange={(e) => setWeaponRarity(e.target.value)}
                  >
                    <option value="all">All</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        Rarity {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
            {type === "Armor" && (
              <>
                <div>
                  <label htmlFor="armorRarity">Filter by rarity:</label>
                  <select
                    id="armorRarity"
                    value={armorRarity}
                    onChange={(e) => setArmorRarity(e.target.value)}
                  >
                    <option value="all">All</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        Rarity {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="armorRank">Filter by rank:</label>
                  <select
                    id="armorRank"
                    value={armorRank}
                    onChange={(e) => setArmorRank(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="low">Low Rank</option>
                    <option value="high">High Rank</option>
                  </select>
                </div>
              </>
            )}
            <div>
              <label htmlFor="searchTerm">Enter search term:</label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search for ${type.toLowerCase()}...`}
              />
            </div>
          </form>
        </aside>
        <main>
          {filteredItems.map((item) => (
            <section key={item.id} className={item.type?.toLowerCase()}>
              <h2>{item.name}</h2>
              {type === "Monsters" ? (
                <>
                  <p>Type: {item.type}</p>
                  <p>Species: {item.species}</p>
                  <p>Description: {item.description}</p>
                </>
              ) : type === "Weapons" ? (
                <>
                  <p>Type: {item.type}</p>
                  <p>Attack: {item.attack?.display || "N/A"}</p>
                  <p>Rarity: {item.rarity}</p>
                  <p>Element: {item.elements?.map((el) => el.type).join(", ") || "None"}</p>
                </>
              ) : (
                <>
                  <p>Type: {item.type}</p>
                  <p>Rarity: {item.rarity}</p>
                  <p>Rank: {item.rank}</p>
                </>
              )}
            </section>
          ))}
        </main>
      </div>
      <footer>
        <p>
          Monster Hunter World Data from <a href="https://mhw-db.com">MHW Database</a>
        </p>
      </footer>
    </>
  );
}