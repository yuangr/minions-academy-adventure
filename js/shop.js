/**
 * 《小黄人学院大冒险》格鲁实验室道具商店与军械库 (Shop & Armory Module)
 * 支持 5 大专属攻击力武器兑换装备 + 8 大发明消耗道具购买
 */

class GruShop {
  constructor(storageEngine, audioEngine) {
    this.storage = storageEngine;
    this.audio = audioEngine;
    this.activeTab = "weapons"; // "weapons" | "items"

    // 5 款特工专属武器
    this.WEAPONS = [
      {
        id: "pan",
        name: "特工平底锅",
        icon: "🍳",
        damage: 25,
        price: 0,
        rarity: "经典初始",
        effect: "基础攻击力 25。特工经典近战厨具，DuangDuang敲击声极度清脆！"
      },
      {
        id: "laser",
        name: "双重激光手枪",
        icon: "🔫",
        damage: 35,
        price: 80,
        rarity: "稀有",
        effect: "基础攻击力 35。发射双重高能红黄脉冲激光束，穿透力极强！"
      },
      {
        id: "fart",
        name: "超级放屁枪",
        icon: "💨",
        damage: 48,
        price: 160,
        rarity: "史诗",
        effect: "基础攻击力 48。奈安内博士传世名作！喷出巨大恶臭黄雾，威慑力爆表！"
      },
      {
        id: "freeze_gun",
        name: "极度冷冻炮",
        icon: "🧊",
        damage: 60,
        price: 260,
        rarity: "史诗",
        effect: "基础攻击力 60。绝对零度冰霜风暴！直接将反派冻结成大冰雕！"
      },
      {
        id: "rocket",
        name: "鲨鱼火箭炮",
        icon: "🚀",
        damage: 80,
        price: 450,
        rarity: "传说",
        effect: "基础攻击力 80。超级终极大杀器！发射鲨鱼火箭弹，全屏震颤大爆炸！"
      }
    ];

    // 8 款格鲁实验室发明道具
    this.ITEMS = [
      {
        id: "banana",
        name: "急救大香蕉",
        icon: "🍌",
        price: 30,
        effect: "战斗中一口吃下，瞬间回复 35 点生命值！",
        rarity: "常见"
      },
      {
        id: "glasses",
        name: "格鲁排除眼镜",
        icon: "🥽",
        price: 25,
        effect: "启动红外战术扫描，直接排除 1 个错误选项！",
        rarity: "常见"
      },
      {
        id: "shield",
        name: "防屁护盾",
        icon: "🛡️",
        price: 50,
        effect: "释放强力防御气体，完全抵消下一次答错扣血！",
        rarity: "稀有"
      },
      {
        id: "freeze",
        name: "冷冻射线",
        icon: "❄️",
        price: 40,
        effect: "绝对零度！倒计时重置并延长 30 秒充裕思考时间！",
        rarity: "稀有"
      },
      {
        id: "magnet",
        name: "磁力香蕉",
        icon: "🧲",
        price: 35,
        effect: "格鲁电磁吸金技术！本关通关获赠的金币收益直接翻倍！",
        rarity: "史诗"
      },
      {
        id: "omni_glasses",
        name: "全知战术镜",
        icon: "👓",
        price: 60,
        effect: "终极战术扫描，直接排除 2 个错误选项，胜券在握！",
        rarity: "史诗"
      },
      {
        id: "sticky_goo",
        name: "粘粘减速胶",
        icon: "🍯",
        price: 45,
        effect: "发射超强韧胶水，使反派下一次反击伤害降低 50%！",
        rarity: "稀有"
      },
      {
        id: "gru_power",
        name: "格鲁狂暴剂",
        icon: "🪩",
        price: 80,
        effect: "喝下特工高能药水，小黄人下一次攻击伤害直接翻倍 (+100%)！",
        rarity: "传说"
      }
    ];
  }

  // 购买消耗道具
  buyItem(itemId) {
    const item = this.ITEMS.find(i => i.id === itemId);
    if (!item) return { success: false, msg: "道具不存在" };

    if (this.storage.data.coins < item.price) {
      this.audio.playSfx("wrong");
      return { success: false, msg: "香蕉金币不足，快去答题闯关赚取吧！" };
    }

    this.storage.spendCoins(item.price);
    this.storage.addItem(itemId, 1);
    this.audio.playSfx("banana");

    return {
      success: true,
      msg: `成功购买 1 个 ${item.name}！`,
      coins: this.storage.data.coins,
      inventory: this.storage.data.inventory
    };
  }

  // 兑换解锁武器
  buyWeapon(weaponId) {
    const weapon = this.WEAPONS.find(w => w.id === weaponId);
    if (!weapon) return { success: false, msg: "武器不存在" };

    const unlocked = this.storage.data.weaponsUnlocked || ["pan"];
    if (unlocked.includes(weaponId)) {
      return { success: false, msg: "您已拥有此特工武器！" };
    }

    if (this.storage.data.coins < weapon.price) {
      this.audio.playSfx("wrong");
      return { success: false, msg: "香蕉金币不足，快去答题闯关赚取吧！" };
    }

    this.storage.spendCoins(weapon.price);
    this.storage.unlockWeapon(weaponId);
    this.storage.equipWeapon(weaponId);
    this.audio.playSfx("correct");
    this.audio.playSfx(weaponId === "laser" ? "laser" : weaponId);

    return {
      success: true,
      msg: `恭喜兑换全新武器【${weapon.name}】并已成功装备出战！`,
      coins: this.storage.data.coins,
      equippedWeapon: weaponId
    };
  }

  // 装备已拥有的武器
  equipWeapon(weaponId) {
    const weapon = this.WEAPONS.find(w => w.id === weaponId);
    if (!weapon) return { success: false, msg: "武器不存在" };

    const unlocked = this.storage.data.weaponsUnlocked || ["pan"];
    if (!unlocked.includes(weaponId)) {
      return { success: false, msg: "尚未解锁该武器！" };
    }

    this.storage.equipWeapon(weaponId);
    this.audio.playSfx("click");

    return {
      success: true,
      msg: `已成功佩戴【${weapon.name}】！`,
      equippedWeapon: weaponId
    };
  }

  // 渲染商店界面
  renderShopItems(containerElement, onUpdateCallback) {
    if (!containerElement) return;

    containerElement.innerHTML = "";

    // 1. 顶部 Tab 切换器
    const tabNav = document.createElement("div");
    tabNav.className = "shop-tabs-nav";
    tabNav.innerHTML = `
      <button class="shop-tab-btn ${this.activeTab === "weapons" ? "active" : ""}" data-tab="weapons">
        🔫 特工军械库 (武器)
      </button>
      <button class="shop-tab-btn ${this.activeTab === "items" ? "active" : ""}" data-tab="items">
        🧪 格鲁发明道具箱 (消耗品)
      </button>
    `;

    const tabBtns = tabNav.querySelectorAll(".shop-tab-btn");
    tabBtns.forEach(btn => {
      btn.onclick = () => {
        this.activeTab = btn.getAttribute("data-tab");
        this.audio.playSfx("click");
        this.renderShopItems(containerElement, onUpdateCallback);
      };
    });
    containerElement.appendChild(tabNav);

    // 2. 列表内容容器
    const contentGrid = document.createElement("div");
    contentGrid.className = "shop-grid";

    if (this.activeTab === "weapons") {
      // 渲染武器卡片
      const unlocked = this.storage.data.weaponsUnlocked || ["pan"];
      const currentEquipped = this.storage.data.equippedWeapon || "pan";

      this.WEAPONS.forEach(weapon => {
        const isOwned = unlocked.includes(weapon.id);
        const isEquipped = currentEquipped === weapon.id;
        const canAfford = this.storage.data.coins >= weapon.price;

        const card = document.createElement("div");
        card.className = `shop-item-card weapon-card ${isEquipped ? "equipped" : ""}`;
        card.innerHTML = `
          <div class="shop-item-header">
            <span class="shop-item-icon">${weapon.icon}</span>
            <div class="shop-item-info">
              <h4>${weapon.name}</h4>
              <div style="display:flex; gap:8px; align-items:center; margin-top:2px;">
                <span class="weapon-dmg-badge">⚔️ 攻击力: ${weapon.damage}</span>
                <span style="font-size:0.75rem; color:#7B2CBF; font-weight:700;">[${weapon.rarity}]</span>
              </div>
            </div>
          </div>
          <p class="shop-item-desc">${weapon.effect}</p>
          <div class="shop-buy-row">
            <span style="font-size:1.1rem; font-weight:900; color:#D4A305;">
              ${weapon.price === 0 ? "🎁 免费获得" : `🪙 ${weapon.price} 金币`}
            </span>
            <div class="weapon-action-box"></div>
          </div>
        `;

        const actionBox = card.querySelector(".weapon-action-box");
        if (isEquipped) {
          actionBox.innerHTML = `
            <button class="btn-primary" style="padding:6px 16px; font-size:0.95rem; background:#38B000; color:#fff;" disabled>
              ✅ 出战中
            </button>
          `;
        } else if (isOwned) {
          const equipBtn = document.createElement("button");
          equipBtn.className = "btn-secondary";
          equipBtn.style.cssText = "padding:6px 16px; font-size:0.95rem;";
          equipBtn.textContent = "👉 装备";
          equipBtn.onclick = () => {
            const res = this.equipWeapon(weapon.id);
            if (onUpdateCallback) onUpdateCallback(res);
            this.renderShopItems(containerElement, onUpdateCallback);
          };
          actionBox.appendChild(equipBtn);
        } else {
          const buyBtn = document.createElement("button");
          buyBtn.className = "btn-primary";
          buyBtn.style.cssText = "padding:6px 16px; font-size:0.95rem;";
          buyBtn.disabled = !canAfford;
          buyBtn.textContent = "🪙 兑换解锁";
          buyBtn.onclick = () => {
            const res = this.buyWeapon(weapon.id);
            if (onUpdateCallback) onUpdateCallback(res);
            this.renderShopItems(containerElement, onUpdateCallback);
          };
          actionBox.appendChild(buyBtn);
        }

        contentGrid.appendChild(card);
      });
    } else {
      // 渲染消耗道具
      this.ITEMS.forEach(item => {
        const owned = this.storage.data.inventory[item.id] || 0;
        const canAfford = this.storage.data.coins >= item.price;

        const card = document.createElement("div");
        card.className = "shop-item-card";
        card.innerHTML = `
          <div class="shop-item-header">
            <span class="shop-item-icon">${item.icon}</span>
            <div class="shop-item-info">
              <h4>${item.name}</h4>
              <span style="font-size:0.8rem; color:#7B2CBF; font-weight:700;">[${item.rarity}] 已拥有: ${owned}</span>
            </div>
          </div>
          <p class="shop-item-desc">${item.effect}</p>
          <div class="shop-buy-row">
            <span style="font-size:1.1rem; font-weight:900; color:#D4A305;">🪙 ${item.price} 金币</span>
            <button class="btn-primary" style="padding:6px 16px; font-size:0.95rem;" ${canAfford ? "" : "disabled"}>
              购买
            </button>
          </div>
        `;

        const buyBtn = card.querySelector("button");
        buyBtn.onclick = () => {
          const res = this.buyItem(item.id);
          if (onUpdateCallback) onUpdateCallback(res);
          this.renderShopItems(containerElement, onUpdateCallback);
        };

        contentGrid.appendChild(card);
      });
    }

    containerElement.appendChild(contentGrid);
  }
}

// 导出与挂载
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GruShop };
}
if (typeof window !== "undefined") {
  window.GruShop = GruShop;
}
