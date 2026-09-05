/**
 * 《小黄人学院大冒险》回合制战斗引擎 (Battle Engine)
 * 涵盖：答题判定、特工专属被动、Boss招式、连击暴击、道具消耗与结算
 */

class BattleEngine {
  constructor(audioEngine, storageEngine) {
    this.audio = audioEngine;
    this.storage = storageEngine;

    // 当前关卡状态
    this.currentStage = 1;
    this.character = "kevin";
    this.questions = [];
    this.questionIndex = 0;
    this.currentQuestion = null;

    // 战斗数值
    this.playerMaxHp = 100;
    this.playerHp = 100;
    this.bossMaxHp = 80;
    this.bossHp = 80;
    this.bossName = "矢量 (Vector)";
    this.bossKey = "boss_vector";

    // 连击与状态
    this.combo = 0;
    this.maxCombo = 0;
    this.correctCount = 0;
    this.totalQuestionsAnswered = 0;
    this.shieldActive = false;
    this.timer = null;
    this.timeLeft = 35;
    this.isFrozen = false;
    this.isAnswering = false;

    // 战斗增益状态
    this.magnetActive = false;     // 磁力香蕉：金币翻倍
    this.stickyGooActive = false;  // 粘粘胶：反派减伤 50%
    this.gruPowerActive = false;   // 格鲁之力：攻击伤害翻倍 (+100%)
    this.equippedWeapon = this.storage.data.equippedWeapon || "pan";

    // 五大特工武器库
    this.WEAPONS = {
      pan: {
        id: "pan",
        name: "特工平底锅",
        icon: "🍳",
        damage: 25,
        sfx: "pan",
        anim: "pan",
        desc: "特工标配煎蛋锅，不仅能煎培根，更能DuangDuang敲击反派脑袋！"
      },
      laser: {
        id: "laser",
        name: "双重激光枪",
        icon: "🔫",
        damage: 35,
        sfx: "laser",
        anim: "laser",
        desc: "发射高能双脉冲激光束，穿透力极强！"
      },
      fart: {
        id: "fart",
        name: "超级放屁枪",
        icon: "💨",
        damage: 48,
        sfx: "fart",
        anim: "fart",
        desc: "奈安内博士杰作！喷出浓郁黄色恶臭云，杀伤力与威慑力爆表！"
      },
      freeze_gun: {
        id: "freeze_gun",
        name: "极度冷冻炮",
        icon: "🧊",
        damage: 60,
        sfx: "freeze_gun",
        anim: "freeze",
        desc: "极低温绝对零度暴风雪，将坏蛋瞬间冻结成大冰雕！"
      },
      rocket: {
        id: "rocket",
        name: "鲨鱼火箭炮",
        icon: "🚀",
        damage: 80,
        sfx: "rocket",
        anim: "rocket",
        desc: "重装火力！发射带有大白鲨涂装的巡航导弹，引发震撼全屏的大爆炸！"
      }
    };

    // 关卡配置对照（提升反派血量，使每关平均多答对 1~2 道题方可通关）
    this.STAGE_CONFIGS = {
      1: { name: "矢量 (Vector)", hp: 125, key: "boss_vector", reward: 30 },
      2: { name: "埃尔·马乔 (El Macho)", hp: 160, key: "boss_elmacho", reward: 40 },
      3: { name: "斯嘉丽·杀手 (Scarlet)", hp: 200, key: "boss_scarlet", reward: 50 },
      4: { name: "巴萨扎·布莱德 (Bratt)", hp: 240, key: "boss_bratt", reward: 60 },
      5: { name: "恶人六天王 (Vicious 6)", hp: 290, key: "boss_vicious6", reward: 100 }
    };

    // 角色基础属性
    this.CHARACTERS = {
      bob: { name: "鲍勃 (Bob)", hp: 120, desc: "受击扣血减免 40%" },
      stuart: { name: "斯图尔特 (Stuart)", hp: 100, desc: "2 连击后激活 1.5 倍音波暴击" },
      kevin: { name: "凯文 (Kevin)", hp: 100, desc: "开局自带 1 副排除眼镜" },
      otto: { name: "奥托 (Otto)", hp: 105, desc: "通关额外赠送 20 枚金币" }
    };
  }

  // 初始化关卡对战
  initBattle(stageNum, characterKey = "kevin", customQuestions = null) {
    this.currentStage = stageNum;
    this.character = characterKey;
    const charCfg = this.CHARACTERS[characterKey] || this.CHARACTERS.kevin;
    const stageCfg = this.STAGE_CONFIGS[stageNum] || this.STAGE_CONFIGS[1];

    this.playerMaxHp = charCfg.hp;
    this.playerHp = this.playerMaxHp;
    this.bossMaxHp = stageCfg.hp;
    this.bossHp = this.bossMaxHp;
    this.bossName = stageCfg.name;
    this.bossKey = stageCfg.key;

    this.combo = 0;
    this.maxCombo = 0;
    this.correctCount = 0;
    this.totalQuestionsAnswered = 0;
    this.shieldActive = false;
    this.isFrozen = false;
    this.isAnswering = false;

    // 重置本局特殊增益
    this.magnetActive = false;
    this.stickyGooActive = false;
    this.gruPowerActive = false;
    this.equippedWeapon = this.storage.data.equippedWeapon || "pan";

    // 特工被动：凯文入场自带1副眼镜
    if (this.character === "kevin") {
      this.storage.addItem("glasses", 1);
    }

    // 抽取或设置试题（深拷贝试题数据，每次打开关卡随机全量抽取该关试题）
    if (customQuestions && customQuestions.length > 0) {
      this.questions = this.shuffleArray(customQuestions.map(q => ({ ...q, options: [...q.options] })));
    } else {
      const allStageQuestions = (window.QUESTION_BANK || []).filter(q => q.stage === stageNum);
      // 随机打乱题目顺序，确保每局出题顺序常新
      this.questions = this.shuffleArray(allStageQuestions.map(q => ({ ...q, options: [...q.options] })));
    }

    this.questionIndex = 0;
    return this.getCurrentState();
  }

  // 局内切换装备的特工武器
  switchWeapon(weaponId) {
    if (this.WEAPONS[weaponId]) {
      this.equippedWeapon = weaponId;
      this.storage.equipWeapon(weaponId);
      return this.WEAPONS[weaponId];
    }
    return this.WEAPONS[this.equippedWeapon] || this.WEAPONS.pan;
  }

  getEquippedWeapon() {
    return this.WEAPONS[this.equippedWeapon] || this.WEAPONS.pan;
  }

  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // 获取下一道试题（动态打散选项，确保每一次出题答案选项位置随机且真实）
  nextQuestion() {
    if (this.bossHp <= 0 || this.playerHp <= 0) {
      return null;
    }

    // 题目防耗尽保障：若当前关卡题目用尽但战斗尚未结束，重新洗牌题库继续出题
    if (this.questionIndex >= this.questions.length) {
      const allStageQuestions = (window.QUESTION_BANK || []).filter(q => q.stage === this.currentStage);
      this.questions = this.shuffleArray(allStageQuestions.map(q => ({ ...q, options: [...q.options] })));
      this.questionIndex = 0;
    }

    const rawQ = this.questions[this.questionIndex];
    this.questionIndex++;

    // 动态打散选项顺序，杜绝死记硬背固定位置
    const originalAnswerText = rawQ.options[rawQ.answer];
    const shuffledOptions = this.shuffleArray([...rawQ.options]);
    const newAnswerIndex = shuffledOptions.indexOf(originalAnswerText);

    this.currentQuestion = {
      ...rawQ,
      options: shuffledOptions,
      answer: newAnswerIndex
    };

    this.timeLeft = 35;
    this.isFrozen = false;
    this.isAnswering = false;

    // 自动朗读触发
    if (this.storage.data.settings.ttsAutoRead) {
      this.audio.speakText(this.currentQuestion.scenario, this.currentQuestion.audioLang);
    }

    return this.currentQuestion;
  }

  // 玩家作答
  submitAnswer(chosenIndex) {
    if (this.isAnswering || !this.currentQuestion) return null;
    this.isAnswering = true;
    this.stopTimer();

    const isCorrect = chosenIndex === this.currentQuestion.answer;
    this.totalQuestionsAnswered++;
    this.storage.recordAnswer(this.currentQuestion.subject, isCorrect);

    let damageDealt = 0;
    let damageTaken = 0;
    let isCrit = false;
    let shieldAbsorbed = false;
    let isGruBuffed = false;
    const currentWpn = this.getEquippedWeapon();

    if (isCorrect) {
      this.correctCount++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;

      // 基础伤害由当前装备的特工武器决定
      let baseDmg = currentWpn.damage;

      // 格鲁之力增益：下次攻击伤害翻倍 (+100%)
      if (this.gruPowerActive) {
        baseDmg *= 2;
        this.gruPowerActive = false;
        isGruBuffed = true;
      }

      // 连击加成：每连对 1 题 +10% 伤害 (上限 2.0x)
      const comboMultiplier = Math.min(2.0, 1.0 + (this.combo - 1) * 0.1);
      damageDealt = Math.round(baseDmg * comboMultiplier);

      // 特工被动：斯图尔特连击 >= 2 时必定暴击 1.5 倍
      if (this.character === "stuart" && this.combo >= 2) {
        damageDealt = Math.round(damageDealt * 1.5);
        isCrit = true;
      }

      this.bossHp = Math.max(0, this.bossHp - damageDealt);

      // 奖励香蕉金币 (基础 8 + 连击加成)
      const earnedCoins = Math.min(20, 8 + this.combo);
      this.storage.addCoins(earnedCoins);

      if (isCrit) {
        this.audio.playSfx("crit");
      } else {
        this.audio.playSfx("correct");
        this.audio.playSfx(currentWpn.sfx);
      }
    } else {
      // 答错处理
      this.combo = 0;

      // 记录错题本
      this.storage.addMistake(this.currentQuestion, chosenIndex);

      if (this.shieldActive) {
        // 护盾免伤
        shieldAbsorbed = true;
        this.shieldActive = false;
        this.audio.playSfx("shield");
      } else {
        // Boss 反击伤害 (常规 20 点)
        let baseEnemyDmg = 20;
        // 特工被动：鲍勃减伤 40%
        if (this.character === "bob") {
          baseEnemyDmg = Math.round(baseEnemyDmg * 0.6); // 12 点
        }
        // 粘粘减速胶减伤 50%
        if (this.stickyGooActive) {
          baseEnemyDmg = Math.round(baseEnemyDmg * 0.5);
          this.stickyGooActive = false;
        }
        damageTaken = baseEnemyDmg;
        this.playerHp = Math.max(0, this.playerHp - damageTaken);

        this.audio.playSfx("wrong");
        this.audio.playSfx("hit");
      }
    }

    // 检查胜负
    let battleResult = null;
    if (this.bossHp <= 0) {
      battleResult = "VICTORY";
      this.handleVictory();
    } else if (this.playerHp <= 0) {
      battleResult = "DEFEAT";
      this.audio.playSfx("defeat");
    } else if (this.questionIndex >= this.questions.length) {
      // 题库用完：若Boss剩余血量较少直接判胜，否则判平局/提示重试
      if (this.bossHp <= 25) {
        this.bossHp = 0;
        battleResult = "VICTORY";
        this.handleVictory();
      } else {
        battleResult = "DEFEAT";
        this.audio.playSfx("defeat");
      }
    }

    return {
      isCorrect,
      chosenIndex,
      correctIndex: this.currentQuestion.answer,
      explanation: this.currentQuestion.explanation,
      damageDealt,
      damageTaken,
      isCrit,
      isGruBuffed,
      weapon: currentWpn.id,
      weaponName: currentWpn.name,
      weaponIcon: currentWpn.icon,
      weaponAnim: currentWpn.anim,
      shieldAbsorbed,
      playerHp: this.playerHp,
      bossHp: this.bossHp,
      combo: this.combo,
      battleResult
    };
  }

  // 胜利结算
  handleVictory() {
    this.audio.playSfx("victory");

    // 计算星级：★通关，★★正确率>=70%，★★★正确率>=90%且剩余血量>=50%
    const accuracy = this.totalQuestionsAnswered > 0 ? (this.correctCount / this.totalQuestionsAnswered) : 1;
    const hpRatio = this.playerHp / this.playerMaxHp;

    let stars = 1;
    if (accuracy >= 0.70) stars = 2;
    if (accuracy >= 0.90 && hpRatio >= 0.50) stars = 3;

    // 基础金币与星级倍率
    const stageCfg = this.STAGE_CONFIGS[this.currentStage] || { reward: 30 };
    let coinsGained = Math.round(stageCfg.reward * (stars === 3 ? 1.5 : (stars === 2 ? 1.2 : 1.0)));

    // 特工被动：奥托通关额外获赠 20 金币，且金币掉落 +20%
    if (this.character === "otto") {
      coinsGained = Math.round(coinsGained * 1.2) + 20;
    }

    // 磁力香蕉收益翻倍
    if (this.magnetActive) {
      coinsGained = Math.round(coinsGained * 2);
      this.magnetActive = false;
    }

    this.storage.addCoins(coinsGained);
    this.storage.updateStageStars(this.currentStage, stars);

    return { stars, coinsGained, accuracy };
  }

  // 使用特工道具
  useCombatItem(itemId) {
    if (!this.storage.useItem(itemId)) return false;

    switch (itemId) {
      case "banana": // 急救大香蕉：瞬间回血 35 HP
        this.playerHp = Math.min(this.playerMaxHp, this.playerHp + 35);
        this.audio.playSfx("banana");
        return { type: "heal", value: 35, playerHp: this.playerHp };

      case "glasses": // 排除眼镜：排除 1 个错误选项
        this.audio.playSfx("glasses");
        if (this.currentQuestion) {
          const wrongIndices = this.currentQuestion.options
            .map((_, idx) => idx)
            .filter(idx => idx !== this.currentQuestion.answer);
          const eliminated = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
          return { type: "eliminate", eliminatedIndex: eliminated };
        }
        return true;

      case "shield": // 防屁护盾：开启护盾免除下次扣血
        this.shieldActive = true;
        this.audio.playSfx("shield");
        return { type: "shield" };

      case "freeze": // 冷冻射线：倒计时重置并延长 30 秒思考
        this.timeLeft += 30;
        this.isFrozen = true;
        this.audio.playSfx("freeze");
        return { type: "freeze", timeLeft: this.timeLeft };

      case "magnet": // 磁力香蕉：本关金币翻倍
        this.magnetActive = true;
        this.audio.playSfx("magnet");
        return { type: "magnet", msg: "🧲 磁力香蕉激活！通关金币收益直接翻倍！" };

      case "omni_glasses": // 全知战术镜：直接排除 2 个错误选项
        this.audio.playSfx("glasses");
        if (this.currentQuestion) {
          const wrongIndices = this.currentQuestion.options
            .map((_, idx) => idx)
            .filter(idx => idx !== this.currentQuestion.answer);
          this.shuffleArray(wrongIndices);
          const eliminatedList = wrongIndices.slice(0, 2);
          return { type: "eliminate_multiple", eliminatedIndices: eliminatedList };
        }
        return true;

      case "sticky_goo": // 粘粘减速胶：反派下次攻击减伤 50%
        this.stickyGooActive = true;
        this.audio.playSfx("goo");
        return { type: "sticky_goo", msg: "🍯 粘粘减速胶就绪！反派下次反击伤害减少 50%！" };

      case "gru_power": // 格鲁之力：下次攻击伤害翻倍 (+100%)
        this.gruPowerActive = true;
        this.audio.playSfx("correct");
        return { type: "gru_power", msg: "🪩 格鲁狂暴药剂喝下！下次攻击伤害翻倍 (+100%)！" };

      default:
        return false;
    }
  }

  // 彻底停止与清理当前对战状态（切回地图、离开对战时调用）
  cleanupBattle() {
    this.stopTimer();
    this.audio.stopSpeaking();
    this.isAnswering = false;
    this.currentQuestion = null;
    this.isFrozen = false;
  }

  // 倒计时控制
  startTimer(onTick, onTimeOut) {
    this.stopTimer();
    this.timer = setInterval(() => {
      if (!this.isFrozen) {
        this.timeLeft--;
        if (onTick) onTick(this.timeLeft);
        if (this.timeLeft <= 0) {
          this.stopTimer();
          if (onTimeOut) onTimeOut();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  getCurrentState() {
    return {
      stage: this.currentStage,
      character: this.character,
      playerHp: this.playerHp,
      playerMaxHp: this.playerMaxHp,
      bossHp: this.bossHp,
      bossMaxHp: this.bossMaxHp,
      bossName: this.bossName,
      bossKey: this.bossKey,
      combo: this.combo,
      inventory: this.storage.data.inventory,
      coins: this.storage.data.coins
    };
  }
}

// 导出与挂载
if (typeof module !== "undefined" && module.exports) {
  module.exports = { BattleEngine };
}
if (typeof window !== "undefined") {
  window.BattleEngine = BattleEngine;
}
