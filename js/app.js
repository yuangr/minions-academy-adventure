/**
 * 《小黄人学院大冒险》主应用逻辑调度器 (Main App Controller)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. 实例化核心引擎
  const audio = new GameAudioEngine();
  const storage = new GameStorage("slot_1");
  const battle = new BattleEngine(audio, storage);
  const shop = new GruShop(storage, audio);
  const report = new StudyReportModule(storage, audio);

  // 2. DOM 元素缓存
  const screens = {
    menu: document.getElementById("screen-menu"),
    map: document.getElementById("screen-map"),
    battle: document.getElementById("screen-battle"),
    shop: document.getElementById("screen-shop"),
    mistakes: document.getElementById("screen-mistakes"),
    report: document.getElementById("screen-report")
  };

  const coinCountEl = document.getElementById("header-coin-count");
  const modalOverlay = document.getElementById("game-modal-overlay");
  const modalTitle = document.getElementById("modal-title");
  const modalIcon = document.getElementById("modal-icon");
  const modalContent = document.getElementById("modal-content");
  const modalBtn = document.getElementById("modal-action-btn");
  const modalSecondaryBtn = document.getElementById("modal-secondary-btn");
  const modalActionsContainer = document.getElementById("modal-actions-container");

  // 护眼计时器 (20分钟 = 1200秒)
  let eyeCareTimerSeconds = 0;
  setInterval(() => {
    storage.data.stats.totalPlayTimeSeconds = (storage.data.stats.totalPlayTimeSeconds || 0) + 1;
    eyeCareTimerSeconds++;
    if (storage.data.settings.eyeCareEnabled && eyeCareTimerSeconds >= 1200) {
      eyeCareTimerSeconds = 0;
      triggerEyeCareAlert();
    }
  }, 1000);

  function triggerEyeCareAlert() {
    showModal("🍌 护眼休息提醒", "👀", `
      <p style="font-size:1.15rem; font-weight:700; color:#005C8A;">
        小黄人特工已经连续专注战斗 20 分钟啦！
      </p>
      <p style="margin-top:8px; color:#5A6578;">
        保护视力是特工的第一守则。请眺望窗外远方 20 秒，喝口水，转动一下眼球吧！
      </p>
    `, "我已休息好，继续冒险！", () => {
      hideModal();
    });
  }

  // 更新顶栏金币
  function updateHeaderCoins() {
    if (coinCountEl) {
      coinCountEl.textContent = storage.data.coins;
    }
  }

  // 切换屏幕视图
  function switchScreen(screenKey) {
    audio.ensureAudioContext();
    audio.playSfx("click");

    // 若从答题切换到其他任何视图（地图/商店/学情/特工），彻底停止答题、倒计时与伴读
    if (screenKey !== "battle") {
      battle.cleanupBattle();
    }

    Object.keys(screens).forEach(key => {
      if (screens[key]) {
        screens[key].classList.remove("active");
      }
    });

    if (screens[screenKey]) {
      screens[screenKey].classList.add("active");
    }

    updateHeaderCoins();

    // 针对特定视图的数据刷新
    if (screenKey === "map") renderWorldMap();
    if (screenKey === "shop") shop.renderShopItems(document.getElementById("shop-items-container"), updateHeaderCoins);
    if (screenKey === "mistakes") report.renderMistakeList(document.getElementById("mistakes-list-container"));
    if (screenKey === "report") {
      report.renderStatsOverview(document.getElementById("stats-overview-container"));
      report.drawRadarChart(document.getElementById("radar-chart-canvas"));
    }
  }

  // 战斗撤退回地图按钮绑定
  const btnBattleRetreat = document.getElementById("btn-battle-retreat");
  if (btnBattleRetreat) {
    btnBattleRetreat.onclick = () => {
      audio.playSfx("click");
      battle.cleanupBattle();
      switchScreen("map");
    };
  }

  // 通用弹窗控制器 (支持单按钮或双按钮：确认/取消/重置)
  function showModal(title, icon, htmlContent, btnText, onAction, secondaryBtnText = null, onSecondary = null) {
    modalTitle.textContent = title;
    modalIcon.textContent = icon;
    modalContent.innerHTML = htmlContent;
    modalBtn.textContent = btnText;
    modalBtn.onclick = () => {
      audio.playSfx("click");
      if (onAction) onAction();
      else hideModal();
    };

    if (modalSecondaryBtn) {
      if (secondaryBtnText) {
        modalSecondaryBtn.style.display = "inline-flex";
        modalSecondaryBtn.textContent = secondaryBtnText;
        modalSecondaryBtn.onclick = () => {
          audio.playSfx("click");
          if (onSecondary) onSecondary();
          else hideModal();
        };
        if (modalActionsContainer) {
          modalActionsContainer.classList.add("has-secondary");
        }
      } else {
        modalSecondaryBtn.style.display = "none";
        if (modalActionsContainer) {
          modalActionsContainer.classList.remove("has-secondary");
        }
      }
    }

    modalOverlay.classList.add("active");
  }

  function hideModal() {
    modalOverlay.classList.remove("active");
    if (modalSecondaryBtn) {
      modalSecondaryBtn.style.display = "none";
    }
    if (modalActionsContainer) {
      modalActionsContainer.classList.remove("has-secondary");
    }
  }

  const CHAR_DISPLAY_MAP = {
    kevin: { shortName: "凯文", icon: "🕶️", fullName: "凯文 Kevin", hp: 100, passive: "【特工智囊】开局自带1副排除镜，连击伤害更高" },
    stuart: { shortName: "斯图尔特", icon: "🎸", fullName: "斯图尔特 Stuart", hp: 100, passive: "【摇滚暴击】连对2题后，激活1.5倍音波暴击" },
    bob: { shortName: "鲍勃", icon: "🧸", fullName: "鲍勃 Bob", hp: 120, passive: "【防挫卫士】血量更高，受击扣血减免 40%" },
    otto: { shortName: "奥托", icon: "🪙", fullName: "奥托 Otto", hp: 105, passive: "【话痨招财】通关额外+20金币，金币掉落+20%" }
  };

  function updateCurrentCharacterUI() {
    const charKey = storage.data.selectedCharacter || "kevin";
    const info = CHAR_DISPLAY_MAP[charKey] || CHAR_DISPLAY_MAP.kevin;

    const headerCharName = document.getElementById("header-character-name");
    const headerCharIcon = document.getElementById("header-character-icon");
    if (headerCharName) headerCharName.textContent = info.shortName;
    if (headerCharIcon) headerCharIcon.textContent = info.icon;

    const mapAvatar = document.getElementById("map-agent-avatar");
    const mapName = document.getElementById("map-agent-name");
    const mapPassive = document.getElementById("map-agent-passive");
    if (mapAvatar && AVATAR_SVGS[charKey]) mapAvatar.innerHTML = AVATAR_SVGS[charKey];
    if (mapName) mapName.textContent = `${info.fullName} (${info.hp} HP)`;
    if (mapPassive) mapPassive.textContent = info.passive;
  }

  // ==========================================
  // 1. 主菜单与特工角色选择（独立存档与重置机制）
  // ==========================================
  const charCards = document.querySelectorAll(".character-card");

  function refreshSelectedCardHighlight() {
    const currentKey = storage.data.selectedCharacter;
    charCards.forEach(c => {
      if (c.getAttribute("data-char") === currentKey) {
        c.classList.add("selected");
      } else {
        c.classList.remove("selected");
      }
    });
  }

  charCards.forEach(card => {
    const charKey = card.getAttribute("data-char");
    const avatarBox = card.querySelector(".character-avatar");
    if (avatarBox && AVATAR_SVGS[charKey]) {
      avatarBox.innerHTML = AVATAR_SVGS[charKey];
    }

    if (charKey === storage.data.selectedCharacter) {
      card.classList.add("selected");
    }

    card.addEventListener("click", () => {
      // 若点击的是当前出战特工，无需切换
      if (charKey === storage.data.selectedCharacter) {
        audio.playSfx("click");
        return;
      }

      const targetInfo = CHAR_DISPLAY_MAP[charKey];
      const hasHistory = storage.hasCharacterHistory(charKey);

      if (!hasHistory) {
        // 无历史存档（首次使用该特工）：直接切换，自动分配全新独立档案
        audio.playSfx("click");
        storage.switchCharacter(charKey, "continue");
        refreshSelectedCardHighlight();
        updateCurrentCharacterUI();
        updateHeaderCoins();
      } else {
        // 有历史存档：弹出选择“继续闯关”还是“重新开始”
        const summary = storage.getCharacterProfileSummary(charKey);
        audio.playSfx("click");

        showModal(
          `特工【${targetInfo.fullName}】档案记录`,
          targetInfo.icon,
          `
            <div style="text-align:center;">
              <p style="font-size:1.05rem; font-weight:700; color:#005C8A;">
                发现特工【${targetInfo.fullName}】的历史探险档案！
              </p>
              <div style="margin:12px 0; background:#FFFDEB; border:2px dashed #FED439; border-radius:12px; padding:12px; text-align:left; font-size:0.92rem; line-height:1.8;">
                <div>🪙 <b>金币存量：</b> ${summary.coins} 枚</div>
                <div>🗺️ <b>最高通关：</b> 第 ${summary.maxStage} 岛</div>
                <div>★ <b>获得总星数：</b> ${summary.totalStars} 颗星</div>
                <div>⚔️ <b>拥有特工武器：</b> ${summary.weaponCount} 款</div>
              </div>
              <p style="color:#555; font-size:0.9rem;">
                您可以选择继承历史进度继续闯关，或重新开启崭新冒险：
              </p>
            </div>
          `,
          "▶️ 继续此特工进度",
          () => {
            // 继续历史进度
            storage.switchCharacter(charKey, "continue");
            refreshSelectedCardHighlight();
            updateCurrentCharacterUI();
            updateHeaderCoins();
            hideModal();
          },
          "🔄 重新开始冒险",
          () => {
            // 用户选择重置，弹出高危防误触二次确认弹窗！
            showModal(
              "⚠️ 确认重置特工记录？",
              "🚨",
              `
                <div style="text-align:center;">
                  <p style="font-size:1.1rem; font-weight:800; color:#E63946;">
                    确定要清空【${targetInfo.fullName}】的所有历史进度吗？
                  </p>
                  <div style="margin:12px 0; background:#FFF0F0; border:2px solid #E63946; border-radius:12px; padding:12px; color:#C62828; font-size:0.9rem; line-height:1.6; text-align:left;">
                    ⚠️ <b>警告：</b>此操作将彻底清空该特工拥有的全部金币、关卡星级、武器与道具，该特工将从第 1 岛重新开始，<b>此操作无法撤销！</b>
                  </div>
                </div>
              `,
              "确认清空并重新开始",
              () => {
                storage.switchCharacter(charKey, "reset");
                refreshSelectedCardHighlight();
                updateCurrentCharacterUI();
                updateHeaderCoins();
                audio.playSfx("wrong");
                hideModal();
              },
              "取消 (保留进度)",
              () => {
                hideModal();
              }
            );
          }
        );
      }
    });
  });

  const btnStartAdv = document.getElementById("btn-start-adventure");
  btnStartAdv.addEventListener("click", () => {
    btnStartAdv.textContent = "🚀 出发！智闯恶人谷";
    switchScreen("map");
  });

  // 顶栏特工切换按钮
  const navCharBtn = document.getElementById("nav-character-btn");
  if (navCharBtn) {
    navCharBtn.onclick = () => {
      btnStartAdv.textContent = "✅ 确认特工并返回地图";
      switchScreen("menu");
    };
  }

  // 地图页切换特工按钮
  const changeAgentMapBtn = document.getElementById("btn-change-agent-from-map");
  if (changeAgentMapBtn) {
    changeAgentMapBtn.onclick = () => {
      btnStartAdv.textContent = "✅ 确认特工并返回地图";
      switchScreen("menu");
    };
  }

  // 顶栏导航按钮绑定
  document.getElementById("nav-map-btn").onclick = () => switchScreen("map");
  document.getElementById("nav-shop-btn").onclick = () => switchScreen("shop");
  document.getElementById("nav-mistakes-btn").onclick = () => switchScreen("mistakes");
  document.getElementById("nav-report-btn").onclick = () => switchScreen("report");

  // ==========================================
  // 2. 欢乐岛群岛大地图渲染 (严格按顺序学习不可跳跃)
  // ==========================================
  function renderWorldMap() {
    updateCurrentCharacterUI();
    const container = document.getElementById("stages-map-container");
    if (!container) return;

    container.innerHTML = "";
    const stars = storage.data.stageStars || {};
    const selectedChar = storage.data.selectedCharacter || "kevin";
    const charInfo = CHAR_DISPLAY_MAP[selectedChar] || CHAR_DISPLAY_MAP.kevin;

    // 找出当前特工正在挑战的最前线关卡
    let currentChallengingStage = 1;
    for (let i = 1; i <= 5; i++) {
      if (storage.isStageAccessible(i)) {
        currentChallengingStage = i;
        if ((stars[i] || 0) === 0) break;
      }
    }

    const islandConfigs = {
      1: { islandName: "矢量数数沙洲", icon: "🌴", tags: ["表内乘法", "场景歌", "Unit 1 问候家庭"] },
      2: { islandName: "马乔熔岩岩礁", icon: "🌋", tags: ["表内除法", "部首查字法", "Unit 2-3 宠物与特征"] },
      3: { islandName: "斯嘉丽城堡崖", icon: "🏰", tags: ["7-9乘除法", "古诗二首", "Unit 4 季节与天气"] },
      4: { islandName: "布莱德算盘屿", icon: "🪩", tags: ["三位数与传统算盘", "寓言哲理", "Unit 5-6 饮食与招待"] },
      5: { islandName: "六天王金香蕉峰", icon: "👑", tags: ["有余数除法", "动物成语", "Unit 7-8 校园与活动"] }
    };

    for (let stageNum = 1; stageNum <= 5; stageNum++) {
      const cfg = battle.STAGE_CONFIGS[stageNum];
      const islandInfo = islandConfigs[stageNum];
      const isAccessible = storage.isStageAccessible(stageNum);
      const starCount = stars[stageNum] || 0;
      const isCleared = starCount > 0;
      const isCurrent = stageNum === currentChallengingStage && isAccessible;

      // 岛屿之间的悬索木桥通道
      if (stageNum > 1) {
        const prevCleared = (stars[stageNum - 1] || 0) > 0;
        const bridgeEl = document.createElement("div");
        bridgeEl.className = "island-bridge-connector";
        bridgeEl.innerHTML = `
          <div class="bridge-plank ${prevCleared ? "active" : "locked"}"></div>
          <div class="bridge-plank ${prevCleared ? "active" : "locked"}"></div>
          <div class="bridge-plank ${prevCleared ? "active" : "locked"}"></div>
          <div style="font-size:0.75rem; font-weight:800; color:${prevCleared ? '#FFD166' : 'rgba(255,255,255,0.7)'}; background:rgba(0,0,0,0.3); padding:2px 8px; border-radius:10px;">
            ${prevCleared ? '🪵 连通航道 🌊' : '🔒 迷雾阻隔 🌫️'}
          </div>
          <div class="bridge-plank ${prevCleared ? "active" : "locked"}"></div>
          <div class="bridge-plank ${prevCleared ? "active" : "locked"}"></div>
          <div class="bridge-plank ${prevCleared ? "active" : "locked"}"></div>
        `;
        container.appendChild(bridgeEl);
      }

      // 创建岛屿节点卡片
      const card = document.createElement("div");
      card.className = `island-atoll-card island-theme-${stageNum} ${isAccessible ? "" : "locked"} ${isCurrent ? "current-active island-pulsing" : ""}`;

      let statusBadgeHtml = "";
      if (isCleared) {
        statusBadgeHtml = `<span class="island-status-tag cleared">🚩 已攻克</span>`;
      } else if (isCurrent) {
        statusBadgeHtml = `<span class="island-status-tag current">🎯 正在挑战</span>`;
      } else {
        statusBadgeHtml = `<span class="island-status-tag locked">🔒 迷雾锁定</span>`;
      }

      // 特工动态驻扎定位旗标
      let agentPinHtml = "";
      if (isCurrent) {
        agentPinHtml = `
          <div class="agent-island-pin agent-pin-bouncing">
            <span>${charInfo.icon}</span>
            <span>特工${charInfo.shortName}正在此岛！</span>
          </div>
        `;
      }

      const starStr = isCleared ? "★".repeat(starCount) + "☆".repeat(3 - starCount) : (isAccessible ? "☆☆☆" : "🔒 待解锁");
      const tagsHtml = islandInfo.tags.map(t => `<span class="stage-tag">${t}</span>`).join("");

      card.innerHTML = `
        ${agentPinHtml}
        <div class="stage-info">
          <div class="stage-boss-avatar">
            ${AVATAR_SVGS[cfg.key] || '👾'}
          </div>
          <div class="stage-details">
            <div class="island-badge-row">
              <span class="island-num-tag">第 ${stageNum} 岛 · ${islandInfo.icon}</span>
              ${statusBadgeHtml}
            </div>
            <h3>${islandInfo.islandName} · ${cfg.name}</h3>
            <div class="stage-tags">${tagsHtml}</div>
          </div>
        </div>
        <div class="stage-stars">${starStr}</div>
      `;

      // 点击事件（严格按顺序：未解锁绝不允许跳跃）
      card.onclick = () => {
        if (isAccessible) {
          startStageBattle(stageNum);
        } else {
          // 严禁跳跃选关！触发抖动与名师温馨提示
          audio.playSfx("wrong");
          card.classList.add("island-locked-shake");
          setTimeout(() => card.classList.remove("island-locked-shake"), 500);

          showModal(
            "🔒 岛屿尚未开放",
            "🏝️",
            `
              <div style="text-align:center;">
                <p style="font-size:1.15rem; font-weight:800; color:#005C8A;">
                  小黄人特工必须严格按顺序闯关学习哦！
                </p>
                <div style="margin:12px 0; background:#FFFDEB; border:2px dashed #FED439; border-radius:12px; padding:12px; text-align:left; color:#5A6578; font-size:0.92rem; line-height:1.6;">
                  前方海面被浓密迷雾与惊涛巨浪阻隔！<br/>
                  请先击败 <b>第 ${stageNum - 1} 岛</b> 的恶人并夺取胜利钥匙，方能搭通连接该岛的悬索浮桥！
                </div>
              </div>
            `,
            "我知道了，按顺序挑战！"
          );
        }
      };

      container.appendChild(card);
    }
  }

  // ==========================================
  // 3. 战斗主逻辑
  // ==========================================
  const playerHpFill = document.getElementById("player-hp-fill");
  const playerHpText = document.getElementById("player-hp-text");
  const enemyHpFill = document.getElementById("enemy-hp-fill");
  const enemyHpText = document.getElementById("enemy-hp-text");
  const playerNameEl = document.getElementById("battle-player-name");
  const enemyNameEl = document.getElementById("battle-enemy-name");
  const playerAvatarBox = document.getElementById("battle-player-avatar");
  const enemyAvatarBox = document.getElementById("battle-enemy-avatar");
  const arenaPlayerSvg = document.getElementById("arena-player-actor");
  const arenaEnemySvg = document.getElementById("arena-enemy-actor");
  const arenaContainer = document.getElementById("battle-stage-arena");
  const comboBadge = document.getElementById("battle-combo-badge");
  const timerTextEl = document.getElementById("battle-timer-text");
  const qBadgeSubject = document.getElementById("q-badge-subject");
  const qBadgeUnit = document.getElementById("q-badge-unit");
  const qScenarioEl = document.getElementById("question-scenario-text");
  const optionsGrid = document.getElementById("options-grid-container");
  const btnTts = document.getElementById("btn-read-question");

  function startStageBattle(stageNum) {
    const selectedChar = storage.data.selectedCharacter || "kevin";
    battle.initBattle(stageNum, selectedChar);

    const stageTitleEl = document.getElementById("battle-stage-title");
    if (stageTitleEl) {
      stageTitleEl.textContent = `第 ${stageNum} 关：${battle.bossName}`;
    }

    // 渲染角色与反派头像
    playerNameEl.textContent = battle.CHARACTERS[selectedChar].name;
    enemyNameEl.textContent = battle.bossName;
    playerAvatarBox.innerHTML = AVATAR_SVGS[selectedChar];
    enemyAvatarBox.innerHTML = AVATAR_SVGS[battle.bossKey];
    arenaPlayerSvg.innerHTML = AVATAR_SVGS[selectedChar];
    arenaEnemySvg.innerHTML = AVATAR_SVGS[battle.bossKey];

    updateHpBars();
    updateComboDisplay();
    renderCombatWeapons();
    renderCombatItems();

    switchScreen("battle");
    loadNextBattleQuestion();
  }

  // 渲染局内特工武器快速切换栏
  function renderCombatWeapons() {
    const container = document.getElementById("battle-weapons-container");
    if (!container) return;

    container.innerHTML = "";
    const unlocked = storage.data.weaponsUnlocked || ["pan"];
    const currentWeaponId = battle.equippedWeapon || "pan";

    unlocked.forEach(wId => {
      const w = battle.WEAPONS[wId];
      if (!w) return;

      const isEquipped = w.id === currentWeaponId;
      const btn = document.createElement("button");
      btn.className = `weapon-chip-btn ${isEquipped ? "active" : ""}`;
      btn.title = `${w.name} (基础攻击力 ${w.damage})\n点击立即切换为该武器出击！`;
      btn.innerHTML = `
        <span>${w.icon}</span>
        <span>${w.name}</span>
        <span class="weapon-dmg-tag">⚔️ ${w.damage}</span>
      `;

      btn.onclick = () => {
        if (battle.equippedWeapon !== w.id) {
          battle.switchWeapon(w.id);
          audio.playSfx("click");
          audio.playSfx(w.sfx === "laser" ? "laser" : w.sfx);
          renderCombatWeapons();
          spawnDamageFloat(`⚔️ 装备【${w.name}】(攻 ${w.damage})`, arenaPlayerSvg, "heal-text");
        }
      };

      container.appendChild(btn);
    });
  }

  function updateHpBars() {
    const pRatio = Math.max(0, battle.playerHp / battle.playerMaxHp);
    const eRatio = Math.max(0, battle.bossHp / battle.bossMaxHp);

    playerHpFill.style.width = (pRatio * 100) + "%";
    playerHpText.textContent = `${battle.playerHp} / ${battle.playerMaxHp}`;

    enemyHpFill.style.width = (eRatio * 100) + "%";
    enemyHpText.textContent = `${battle.bossHp} / ${battle.bossMaxHp}`;
  }

  function updateComboDisplay() {
    if (battle.combo >= 2) {
      comboBadge.textContent = `🔥 连击 × ${battle.combo}`;
      comboBadge.classList.add("active");
    } else {
      comboBadge.classList.remove("active");
    }
  }

  // 加载并渲染下一题
  function loadNextBattleQuestion() {
    const q = battle.nextQuestion();
    if (!q) return;

    // 学科与单元标签
    const subjectNames = { math: "苏教版数学", chinese: "统编版语文", english: "译林版英语" };
    qBadgeSubject.textContent = subjectNames[q.subject] || q.subject;
    qBadgeSubject.className = `q-badge ${q.subject}`;
    qBadgeUnit.textContent = q.unit;

    // 题干与朗读事件
    qScenarioEl.textContent = q.scenario;
    btnTts.onclick = () => {
      audio.speakText(q.scenario, q.audioLang);
    };

    // 渲染选项 (带有 A/B/C/D 专属圆标)
    optionsGrid.innerHTML = "";
    const prefixes = ["A", "B", "C", "D"];
    q.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.innerHTML = `
        <span class="option-prefix">${prefixes[idx]}</span>
        <span>${optText}</span>
      `;

      btn.onclick = () => {
        handleOptionClick(idx, btn);
      };

      optionsGrid.appendChild(btn);
    });

    // 启动 35 秒倒计时
    timerTextEl.textContent = "35s";
    battle.startTimer(
      (timeLeft) => {
        timerTextEl.textContent = `${timeLeft}s`;
        if (timeLeft <= 10) {
          timerTextEl.style.color = "#E63946";
        } else {
          timerTextEl.style.color = "#005C8A";
        }
      },
      () => {
        // 超时按放弃/答错处理
        handleTimeOut();
      }
    );
  }

  // 选项点击作答响应
  function handleOptionClick(chosenIndex, clickedBtn) {
    // 禁用所有选项防止重复连点
    const allBtns = optionsGrid.querySelectorAll(".option-btn");
    allBtns.forEach(b => b.disabled = true);

    const result = battle.submitAnswer(chosenIndex);
    if (!result) return;

    updateHpBars();
    updateComboDisplay();
    updateHeaderCoins();

    if (result.isCorrect) {
      clickedBtn.classList.add("correct");
      // 小黄人挥舞武器攻击前进动画
      arenaPlayerSvg.classList.add("actor-attack");

      // 触发专属武器攻击动画特效
      spawnWeaponAttack(result.weapon);

      setTimeout(() => {
        arenaPlayerSvg.classList.remove("actor-attack");
        arenaEnemySvg.classList.add("actor-shake");

        // 若是火箭炮，触发全场震撼摇晃
        if (result.weapon === "rocket") {
          arenaContainer.classList.add("screen-quake");
          setTimeout(() => arenaContainer.classList.remove("screen-quake"), 600);
        }

        // 浮动伤害数字（支持暴击、格鲁狂暴翻倍与武器名称显示）
        let dmgPrefix = "";
        if (result.isGruBuffed) dmgPrefix += "🪩双倍狂暴! ";
        if (result.isCrit) dmgPrefix += "🔥摇滚暴击! ";

        spawnDamageFloat(
          `${dmgPrefix}-${result.damageDealt} [${result.weaponName}]`,
          arenaEnemySvg,
          result.isCrit || result.isGruBuffed ? "crit-damage" : "boss-damage"
        );
        setTimeout(() => arenaEnemySvg.classList.remove("actor-shake"), 400);
      }, 240);

      setTimeout(() => {
        if (result.battleResult === "VICTORY") {
          handleBattleVictory();
        } else {
          loadNextBattleQuestion();
        }
      }, 1300);
    } else {
      // 答错
      clickedBtn.classList.add("wrong");
      allBtns[result.correctIndex].classList.add("correct");

      // Boss 突进反击
      arenaEnemySvg.classList.add("boss-lunging");
      setTimeout(() => {
        arenaEnemySvg.classList.remove("boss-lunging");
        if (result.shieldAbsorbed) {
          spawnDamageFloat("🛡️ 防屁护盾吸收抵御！", arenaPlayerSvg, "heal-text");
        } else {
          arenaPlayerSvg.classList.add("actor-shake");
          spawnDamageFloat(`-${result.damageTaken}`, arenaPlayerSvg, "player-damage");
          setTimeout(() => arenaPlayerSvg.classList.remove("actor-shake"), 400);
        }
      }, 200);

      setTimeout(() => {
        // 弹出温和的名师考点解析，帮助孩子即刻理解吸收
        showModal(
          "💡 名师考点点拨",
          "📖",
          `
            <div style="font-weight:700; color:#C62828; margin-bottom:6px;">
              刚才选了：${battle.currentQuestion.options[chosenIndex]}
            </div>
            <div style="font-weight:700; color:#2E7D32; margin-bottom:10px;">
              正确答案：${battle.currentQuestion.options[result.correctIndex]}
            </div>
            <div style="color:#333; line-height:1.6;">
              ${result.explanation}
            </div>
          `,
          result.battleResult === "DEFEAT" ? "查看结果" : "我懂了，继续挑战！",
          () => {
            hideModal();
            if (result.battleResult === "DEFEAT") {
              handleBattleDefeat();
            } else {
              loadNextBattleQuestion();
            }
          }
        );
      }, 1000);
    }
  }

  // 倒计时超时判定
  function handleTimeOut() {
    audio.playSfx("wrong");
    showModal("⏱️ 思考时间结束", "⏳", `
      <p>思考时间到了哦，不要着急，仔细看名师解析：</p>
      <div style="margin-top:10px; font-weight:700; color:#2E7D32;">
        正确答案：${battle.currentQuestion.options[battle.currentQuestion.answer]}
      </div>
      <div style="margin-top:6px; color:#555;">
        ${battle.currentQuestion.explanation}
      </div>
    `, "继续加油", () => {
      hideModal();
      loadNextBattleQuestion();
    });
  }

  // 胜利通关演出
  function handleBattleVictory() {
    spawnConfetti();
    const vic = battle.handleVictory();

    showModal(
      "🎉 冒险大胜利！",
      "🏆",
      `
        <div style="text-align:center;">
          <div style="font-size:2.2rem; color:#FFB703; margin-bottom:8px;">
            ${"★".repeat(vic.stars)}${"☆".repeat(3 - vic.stars)}
          </div>
          <p style="font-size:1.15rem; font-weight:800; color:#005C8A;">
            成功击退 ${battle.bossName}！格鲁实验室安全了！
          </p>
          <div style="margin-top:12px; background:#FFFDEB; border:2px dashed #FED439; border-radius:12px; padding:10px;">
            <div style="font-weight:700; color:#D4A305; font-size:1.1rem;">
              获赠香蕉金币：+${vic.coinsGained} 🪙
            </div>
            <div style="font-size:0.9rem; color:#666; margin-top:4px;">
              本次答题正确率：${Math.round(vic.accuracy * 100)}%
            </div>
          </div>
        </div>
      `,
      "前往大地图",
      () => {
        hideModal();
        switchScreen("map");
      }
    );
  }

  // 失败鼓励演出 (低挫败保护)
  function handleBattleDefeat() {
    showModal(
      "💪 特工重整旗鼓",
      "🧸",
      `
        <p style="font-size:1.15rem; font-weight:700; color:#005C8A;">
          别灰心！特工从不言败！
        </p>
        <p style="color:#5A6578; margin-top:8px;">
          所有答错的题目已自动收录入【错题档案馆】，去实验室多备两根急救大香蕉，再次挑战吧！
        </p>
      `,
      "返回重试",
      () => {
        hideModal();
        switchScreen("map");
      }
    );
  }

  // 特工道具栏渲染与使用绑定 (支持全部 8 款发明道具)
  function renderCombatItems() {
    const container = document.getElementById("battle-items-container");
    if (!container) return;

    container.innerHTML = "";
    const items = [
      { id: "banana", icon: "🍌", name: "大香蕉" },
      { id: "glasses", icon: "🥽", name: "排除镜" },
      { id: "shield", icon: "🛡️", name: "防屁盾" },
      { id: "freeze", icon: "❄️", name: "冷冻线" },
      { id: "magnet", icon: "🧲", name: "磁力蕉" },
      { id: "omni_glasses", icon: "👓", name: "全知镜" },
      { id: "sticky_goo", icon: "🍯", name: "减速胶" },
      { id: "gru_power", icon: "🪩", name: "狂暴剂" }
    ];

    items.forEach(it => {
      const count = storage.data.inventory[it.id] || 0;
      const btn = document.createElement("button");
      btn.className = "item-slot-btn";
      btn.disabled = count <= 0;
      btn.innerHTML = `
        <span>${it.icon}</span>
        <span>${it.name}</span>
        <span class="item-badge">${count}</span>
      `;

      btn.onclick = () => {
        const useRes = battle.useCombatItem(it.id);
        if (useRes) {
          renderCombatItems();
          updateHpBars();

          if (useRes.type === "heal") {
            spawnDamageFloat(`+${useRes.value} HP`, arenaPlayerSvg, "heal-text");
          } else if (useRes.type === "eliminate") {
            const allBtns = optionsGrid.querySelectorAll(".option-btn");
            if (allBtns[useRes.eliminatedIndex]) {
              allBtns[useRes.eliminatedIndex].classList.add("eliminated");
            }
          } else if (useRes.type === "eliminate_multiple") {
            const allBtns = optionsGrid.querySelectorAll(".option-btn");
            useRes.eliminatedIndices.forEach(idx => {
              if (allBtns[idx]) allBtns[idx].classList.add("eliminated");
            });
            spawnDamageFloat("👓 全知战术排除2个错误！", arenaPlayerSvg, "heal-text");
          } else if (useRes.type === "shield") {
            spawnDamageFloat("🛡️ 防屁护盾就绪！", arenaPlayerSvg, "heal-text");
          } else if (useRes.type === "freeze") {
            timerTextEl.textContent = `${useRes.timeLeft}s`;
            spawnDamageFloat("❄️ 时间冻结+30s！", arenaContainer, "heal-text");
          } else if (useRes.msg) {
            spawnDamageFloat(useRes.msg, arenaPlayerSvg, "heal-text");
          }
        }
      };

      container.appendChild(btn);
    });
  }

  // 动效辅助：浮动伤害文字
  function spawnDamageFloat(text, targetEl, className) {
    if (!targetEl) return;
    const floatEl = document.createElement("div");
    floatEl.className = `damage-float-text ${className}`;
    floatEl.textContent = text;

    const rect = targetEl.getBoundingClientRect();
    const parentRect = arenaContainer.getBoundingClientRect();

    floatEl.style.left = (rect.left - parentRect.left + 20) + "px";
    floatEl.style.top = (rect.top - parentRect.top) + "px";

    arenaContainer.appendChild(floatEl);
    setTimeout(() => floatEl.remove(), 900);
  }

  // 动效辅助：触发武器专属华丽攻击特效
  function spawnWeaponAttack(weaponId) {
    if (weaponId === "pan") {
      // 1. 特工平底锅飞旋敲击
      const pan = document.createElement("div");
      pan.className = "pan-projectile-fx";
      pan.textContent = "🍳";
      arenaContainer.appendChild(pan);
      setTimeout(() => pan.remove(), 450);
    } else if (weaponId === "laser") {
      // 2. 双重脉冲高能激光
      spawnLaserBeam();
    } else if (weaponId === "fart") {
      // 3. 超级放屁枪黄色毒雾
      const fart = document.createElement("div");
      fart.className = "fart-cloud-fx";
      fart.textContent = "💨";
      arenaContainer.appendChild(fart);
      setTimeout(() => fart.remove(), 750);
    } else if (weaponId === "freeze_gun") {
      // 4. 极度冷冻炮暴风雪与冰霜结晶
      const freeze = document.createElement("div");
      freeze.className = "freeze-storm-fx";
      freeze.textContent = "❄️";
      const aura = document.createElement("div");
      aura.className = "freeze-frozen-aura";
      arenaContainer.appendChild(freeze);
      arenaContainer.appendChild(aura);
      setTimeout(() => {
        freeze.remove();
        aura.remove();
      }, 800);
    } else if (weaponId === "rocket") {
      // 5. 鲨鱼火箭炮巡航导弹与全屏火焰大爆炸
      const rocket = document.createElement("div");
      rocket.className = "rocket-projectile-fx";
      rocket.textContent = "🚀";
      arenaContainer.appendChild(rocket);

      setTimeout(() => {
        rocket.remove();
        const boom = document.createElement("div");
        boom.className = "explosion-fireball-fx";
        arenaContainer.appendChild(boom);
        setTimeout(() => boom.remove(), 650);
      }, 350);
    } else {
      spawnLaserBeam();
    }
  }

  // 动效辅助：发射双重激光束
  function spawnLaserBeam() {
    const beam1 = document.createElement("div");
    beam1.className = "laser-dual-beam-fx";
    beam1.style.top = "55px";
    arenaContainer.appendChild(beam1);

    const beam2 = document.createElement("div");
    beam2.className = "laser-dual-beam-fx";
    beam2.style.top = "70px";
    beam2.style.background = "linear-gradient(90deg, #00B4D8, #7B2CBF, #FFFFFF)";
    arenaContainer.appendChild(beam2);

    setTimeout(() => {
      beam1.remove();
      beam2.remove();
    }, 350);
  }

  // 动效辅助：彩色礼花碎片
  function spawnConfetti() {
    const colors = ["#FED439", "#005C8A", "#FF8500", "#38B000", "#E63946", "#7B2CBF"];
    for (let i = 0; i < 40; i++) {
      const conf = document.createElement("div");
      conf.className = "confetti-particle";
      conf.style.background = colors[Math.floor(Math.random() * colors.length)];
      conf.style.left = Math.random() * 100 + "%";
      conf.style.top = (Math.random() * 20) + "%";
      conf.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 2500);
    }
  }

  // 错题打印按钮
  const printMistakesBtn = document.getElementById("btn-print-mistakes");
  if (printMistakesBtn) {
    printMistakesBtn.onclick = () => report.printMistakes();
  }

  // 初始化特工与金币显示
  updateCurrentCharacterUI();
  updateHeaderCoins();
});
