/**
 * 《小黄人学院大冒险》本地持久化数据引擎 (LocalStorage)
 * 支持多存档槽位、金币道具背包、错题档案馆、学情数据追踪
 */

const STORAGE_KEY_PREFIX = "minions_academy_";

const DEFAULT_CHARACTER_DATA = {
  hasPlayed: false,
  coins: 50,
  unlockedStages: [1],
  stageStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  weaponsUnlocked: ["pan"],
  equippedWeapon: "pan",
  inventory: {
    banana: 1,       // 急救大香蕉：回复 35 HP
    glasses: 1,      // 排除眼镜：排除 1 个错误选项
    shield: 0,       // 防屁手枪：免除下一次答错扣血
    freeze: 0,       // 冷冻射线：重置并延长 30 秒思考
    magnet: 0,       // 磁力香蕉：本关金币翻倍
    omni_glasses: 0, // 全知全能战术镜：直接排除 2 个错误选项
    sticky_goo: 0,   // 粘粘减速胶：敌人下次攻击减伤 50%
    gru_power: 0     // 格鲁之力：下次攻击伤害翻倍 (+100%)
  }
};

const DEFAULT_PROFILE = {
  version: "2.5",
  id: "slot_1",
  name: "特工 1 号",
  selectedCharacter: "kevin", // 默认智囊凯文
  charactersUnlocked: ["kevin", "stuart", "bob", "otto"],
  // 四大特工完全隔离独立的存档进度
  characterProfiles: {
    kevin: { ...DEFAULT_CHARACTER_DATA, hasPlayed: true },
    stuart: { ...DEFAULT_CHARACTER_DATA },
    bob: { ...DEFAULT_CHARACTER_DATA },
    otto: { ...DEFAULT_CHARACTER_DATA }
  },
  // 当前活跃特工数据镜像（保持全面向后兼容）
  coins: 50,
  weaponsUnlocked: ["pan"],
  equippedWeapon: "pan",
  unlockedStages: [1],
  stageStars: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  inventory: { ...DEFAULT_CHARACTER_DATA.inventory },
  mistakes: [], // 错题列表: { id, questionId, wrongAnswer, timestamp, reviewCorrectStreak: 0 }
  stats: {
    totalAnswered: 0,
    totalCorrect: 0,
    totalPlayTimeSeconds: 0,
    subjectStats: {
      math: { answered: 0, correct: 0 },
      chinese: { answered: 0, correct: 0 },
      english: { answered: 0, correct: 0 }
    }
  },
  settings: {
    soundEnabled: true,
    ttsEnabled: true,
    ttsAutoRead: false,
    eyeCareEnabled: true
  }
};

class GameStorage {
  constructor(slotId = "slot_1") {
    this.currentSlot = slotId;
    this.data = this.loadProfile(slotId);
  }

  getStorageKey(slot = this.currentSlot) {
    return `${STORAGE_KEY_PREFIX}${slot}`;
  }

  loadProfile(slot = this.currentSlot) {
    try {
      const raw = localStorage.getItem(this.getStorageKey(slot));
      if (raw) {
        const parsed = JSON.parse(raw);
        const activeChar = parsed.selectedCharacter || DEFAULT_PROFILE.selectedCharacter;

        // 迁移旧版存档至多特工独立档案表
        let characterProfiles = parsed.characterProfiles;
        if (!characterProfiles || typeof characterProfiles !== "object") {
          characterProfiles = {
            kevin: { ...DEFAULT_CHARACTER_DATA },
            stuart: { ...DEFAULT_CHARACTER_DATA },
            bob: { ...DEFAULT_CHARACTER_DATA },
            otto: { ...DEFAULT_CHARACTER_DATA }
          };
          // 将当前旧全局数据移植给已选角色
          characterProfiles[activeChar] = {
            hasPlayed: true,
            coins: parsed.coins || 50,
            unlockedStages: parsed.unlockedStages || [1],
            stageStars: parsed.stageStars || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            weaponsUnlocked: parsed.weaponsUnlocked || ["pan"],
            equippedWeapon: parsed.equippedWeapon || "pan",
            inventory: { ...DEFAULT_CHARACTER_DATA.inventory, ...(parsed.inventory || {}) }
          };
        }

        // 补齐每一个角色的默认结构
        ["kevin", "stuart", "bob", "otto"].forEach(k => {
          characterProfiles[k] = {
            ...DEFAULT_CHARACTER_DATA,
            ...(characterProfiles[k] || {}),
            inventory: { ...DEFAULT_CHARACTER_DATA.inventory, ...((characterProfiles[k] && characterProfiles[k].inventory) || {}) },
            stageStars: { ...DEFAULT_CHARACTER_DATA.stageStars, ...((characterProfiles[k] && characterProfiles[k].stageStars) || {}) }
          };
        });

        const activeProf = characterProfiles[activeChar] || characterProfiles.kevin;

        // 合并默认数据结构（防止更新遗漏字段）
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          selectedCharacter: activeChar,
          characterProfiles,
          coins: activeProf.coins,
          unlockedStages: [...activeProf.unlockedStages],
          stageStars: { ...activeProf.stageStars },
          weaponsUnlocked: [...activeProf.weaponsUnlocked],
          equippedWeapon: activeProf.equippedWeapon,
          inventory: { ...activeProf.inventory },
          stats: {
            ...DEFAULT_PROFILE.stats,
            ...(parsed.stats || {}),
            subjectStats: {
              ...DEFAULT_PROFILE.stats.subjectStats,
              ...((parsed.stats && parsed.stats.subjectStats) || {})
            }
          },
          settings: { ...DEFAULT_PROFILE.settings, ...(parsed.settings || {}) }
        };
      }
    } catch (e) {
      console.warn("Failed to load profile from LocalStorage:", e);
    }
    return JSON.parse(JSON.stringify({ ...DEFAULT_PROFILE, id: slot }));
  }

  save() {
    try {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(this.data));
    } catch (e) {
      console.error("LocalStorage save failed:", e);
    }
  }

  // 切换存档槽位
  switchSlot(slotId) {
    this.currentSlot = slotId;
    this.data = this.loadProfile(slotId);
    this.save();
    return this.data;
  }

  // 同步当前活跃特工数据到其独立存档槽位
  syncActiveToProfile() {
    const char = this.data.selectedCharacter || "kevin";
    if (!this.data.characterProfiles) {
      this.data.characterProfiles = {};
    }
    this.data.characterProfiles[char] = {
      hasPlayed: true,
      coins: this.data.coins,
      unlockedStages: [...this.data.unlockedStages],
      stageStars: { ...this.data.stageStars },
      weaponsUnlocked: [...this.data.weaponsUnlocked],
      equippedWeapon: this.data.equippedWeapon,
      inventory: { ...this.data.inventory }
    };
  }

  // 检查指定特工是否有游玩历史存档
  hasCharacterHistory(charKey) {
    if (!this.data.characterProfiles || !this.data.characterProfiles[charKey]) {
      return false;
    }
    const prof = this.data.characterProfiles[charKey];
    if (prof.hasPlayed) return true;
    const maxStage = Math.max(...(prof.unlockedStages || [1]));
    const totalStars = Object.values(prof.stageStars || {}).reduce((a, b) => a + b, 0);
    const hasMoreCoins = (prof.coins || 0) > 50;
    const hasMoreWeapons = (prof.weaponsUnlocked || []).length > 1;
    return maxStage > 1 || totalStars > 0 || hasMoreCoins || hasMoreWeapons;
  }

  // 获取特工进度概览
  getCharacterProfileSummary(charKey) {
    const prof = (this.data.characterProfiles && this.data.characterProfiles[charKey]) || DEFAULT_CHARACTER_DATA;
    const maxStage = Math.max(...(prof.unlockedStages || [1]));
    const totalStars = Object.values(prof.stageStars || {}).reduce((a, b) => a + b, 0);
    return {
      coins: prof.coins || 0,
      maxStage: maxStage,
      totalStars: totalStars,
      weaponCount: (prof.weaponsUnlocked || ["pan"]).length,
      hasPlayed: !!prof.hasPlayed
    };
  }

  // 切换特工角色（支持“继续闯关”或“重新开始”）
  switchCharacter(charKey, mode = "continue") {
    // 1. 先将当前特工的数据封存进其独立槽位
    this.syncActiveToProfile();

    if (!this.data.characterProfiles) {
      this.data.characterProfiles = {};
    }

    if (mode === "reset" || !this.data.characterProfiles[charKey]) {
      // 重置该特工为全新纯洁初始状态
      this.data.characterProfiles[charKey] = JSON.parse(JSON.stringify({ ...DEFAULT_CHARACTER_DATA, hasPlayed: false }));
    }

    // 2. 将目标特工档案载入当前活跃镜像
    const targetProf = this.data.characterProfiles[charKey];
    this.data.selectedCharacter = charKey;
    this.data.coins = targetProf.coins;
    this.data.unlockedStages = [...targetProf.unlockedStages];
    this.data.stageStars = { ...targetProf.stageStars };
    this.data.weaponsUnlocked = [...targetProf.weaponsUnlocked];
    this.data.equippedWeapon = targetProf.equippedWeapon;
    this.data.inventory = { ...targetProf.inventory };

    this.save();
    return this.data;
  }

  // 单独清空重置某个特工的进度
  resetCharacterProfile(charKey) {
    if (!this.data.characterProfiles) {
      this.data.characterProfiles = {};
    }
    this.data.characterProfiles[charKey] = JSON.parse(JSON.stringify({ ...DEFAULT_CHARACTER_DATA, hasPlayed: false }));

    if (this.data.selectedCharacter === charKey) {
      const targetProf = this.data.characterProfiles[charKey];
      this.data.coins = targetProf.coins;
      this.data.unlockedStages = [...targetProf.unlockedStages];
      this.data.stageStars = { ...targetProf.stageStars };
      this.data.weaponsUnlocked = [...targetProf.weaponsUnlocked];
      this.data.equippedWeapon = targetProf.equippedWeapon;
      this.data.inventory = { ...targetProf.inventory };
    }

    this.save();
    return true;
  }

  // 金币操作
  addCoins(amount) {
    this.data.coins = Math.max(0, (this.data.coins || 0) + amount);
    this.syncActiveToProfile();
    this.save();
    return this.data.coins;
  }

  spendCoins(amount) {
    if (this.data.coins >= amount) {
      this.data.coins -= amount;
      this.syncActiveToProfile();
      this.save();
      return true;
    }
    return false;
  }

  // 道具增减
  addItem(itemId, count = 1) {
    if (!this.data.inventory[itemId]) {
      this.data.inventory[itemId] = 0;
    }
    this.data.inventory[itemId] += count;
    this.syncActiveToProfile();
    this.save();
  }

  useItem(itemId) {
    if (this.data.inventory[itemId] && this.data.inventory[itemId] > 0) {
      this.data.inventory[itemId]--;
      this.syncActiveToProfile();
      this.save();
      return true;
    }
    return false;
  }

  // 武器解锁与装备
  unlockWeapon(weaponId) {
    if (!this.data.weaponsUnlocked) {
      this.data.weaponsUnlocked = ["pan"];
    }
    if (!this.data.weaponsUnlocked.includes(weaponId)) {
      this.data.weaponsUnlocked.push(weaponId);
      this.syncActiveToProfile();
      this.save();
      return true;
    }
    return false;
  }

  equipWeapon(weaponId) {
    if (!this.data.weaponsUnlocked) {
      this.data.weaponsUnlocked = ["pan"];
    }
    if (this.data.weaponsUnlocked.includes(weaponId)) {
      this.data.equippedWeapon = weaponId;
      this.syncActiveToProfile();
      this.save();
      return true;
    }
    return false;
  }

  // 关卡与星级进度（严格顺序探索）
  unlockStage(stageNum) {
    if (!this.data.unlockedStages.includes(stageNum)) {
      this.data.unlockedStages.push(stageNum);
      this.data.unlockedStages.sort((a, b) => a - b);
      this.syncActiveToProfile();
      this.save();
    }
  }

  updateStageStars(stageNum, stars) {
    const current = this.data.stageStars[stageNum] || 0;
    if (stars > current) {
      this.data.stageStars[stageNum] = stars;
    }
    // 严格按顺序通关解锁下一关
    if (stageNum < 5 && stars > 0) {
      this.unlockStage(stageNum + 1);
    }
    this.syncActiveToProfile();
    this.save();
  }

  // 严格按顺序探索校验：不可跳跃选关
  isStageAccessible(stageNum) {
    if (stageNum === 1) return true;
    // 第 N 关可挑战前提：前一关 (N-1) 必须已通关（至少获得 1 颗星）且当前关在已解锁列表中
    const prevCleared = (this.data.stageStars[stageNum - 1] || 0) > 0;
    const isUnlocked = (this.data.unlockedStages || [1]).includes(stageNum);
    return isUnlocked && prevCleared;
  }

  // 记录答题学情统计
  recordAnswer(subject, isCorrect) {
    this.data.stats.totalAnswered++;
    if (isCorrect) this.data.stats.totalCorrect++;

    if (!this.data.stats.subjectStats[subject]) {
      this.data.stats.subjectStats[subject] = { answered: 0, correct: 0 };
    }
    this.data.stats.subjectStats[subject].answered++;
    if (isCorrect) {
      this.data.stats.subjectStats[subject].correct++;
    }
    this.save();
  }

  // 错题档案记录
  addMistake(question, wrongAnswerIndex) {
    const existing = this.data.mistakes.find(m => m.questionId === question.id);
    if (existing) {
      existing.wrongAnswer = wrongAnswerIndex;
      existing.timestamp = Date.now();
      existing.reviewCorrectStreak = 0; // 重置复习正确连续计数
    } else {
      this.data.mistakes.push({
        id: "MISTAKE_" + Date.now(),
        questionId: question.id,
        subject: question.subject,
        unit: question.unit,
        scenario: question.scenario,
        options: question.options,
        answer: question.answer,
        explanation: question.explanation,
        wrongAnswer: wrongAnswerIndex,
        timestamp: Date.now(),
        reviewCorrectStreak: 0
      });
    }
    this.save();
  }

  // 错题复习回答判定（连续2次答对即可攻克移除）
  recordMistakeReview(questionId, isCorrect) {
    const item = this.data.mistakes.find(m => m.questionId === questionId);
    if (!item) return;

    if (isCorrect) {
      item.reviewCorrectStreak = (item.reviewCorrectStreak || 0) + 1;
      if (item.reviewCorrectStreak >= 2) {
        // 已攻克掌握，移出错题本
        this.data.mistakes = this.data.mistakes.filter(m => m.questionId !== questionId);
      }
    } else {
      item.reviewCorrectStreak = 0;
    }
    this.save();
  }

  removeMistake(questionId) {
    this.data.mistakes = this.data.mistakes.filter(m => m.questionId !== questionId);
    this.save();
  }

  // 导出存档为 JSON 备份
  exportSaveData() {
    return JSON.stringify(this.data, null, 2);
  }

  // 导入存档
  importSaveData(jsonStr) {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && parsed.version) {
        this.data = parsed;
        this.save();
        return true;
      }
    } catch (e) {
      console.error("Invalid save file JSON:", e);
    }
    return false;
  }
}

// 导出与挂载
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GameStorage, DEFAULT_PROFILE };
}
if (typeof window !== "undefined") {
  window.GameStorage = GameStorage;
}
