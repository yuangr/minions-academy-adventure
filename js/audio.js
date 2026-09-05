/**
 * 《小黄人学院大冒险》离线原生音频与TTS引擎
 * 1. Web Audio API：纯程序化合成音效（完全离线，零外部资源依赖）
 * 2. Web Speech API：双语伴读发音引擎（支持中英文自动切换、慢速护耳）
 */

class GameAudioEngine {
  constructor() {
    this.audioCtx = null;
    this.soundEnabled = true;
    this.ttsEnabled = true;
    this.ttsAutoRead = false;
    this.currentUtterance = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  ensureAudioContext() {
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  // ==========================================
  // Web Audio API 程序化合成音效
  // ==========================================
  playSfx(type) {
    if (!this.soundEnabled || !this.audioCtx) return;
    this.ensureAudioContext();

    const now = this.audioCtx.currentTime;

    switch (type) {
      case "correct": // 答对：欢快上扬的大三和弦
        this.playToneSeries([
          { freq: 523.25, time: now, dur: 0.1 },        // C5
          { freq: 659.25, time: now + 0.08, dur: 0.1 }, // E5
          { freq: 783.99, time: now + 0.16, dur: 0.1 }, // G5
          { freq: 1046.50, time: now + 0.24, dur: 0.25 } // C6
        ], "triangle", 0.35);
        break;

      case "wrong": // 答错：柔和的弹簧音（不刺耳、低挫败）
        this.playSlideTone(350, 180, 0.3, "sine", 0.3);
        setTimeout(() => this.playSlideTone(220, 140, 0.25, "sine", 0.25), 120);
        break;

      case "laser": // 小黄人激光手枪：双脉冲高能电音
        this.playSlideTone(900, 260, 0.18, "sawtooth", 0.25);
        setTimeout(() => this.playSlideTone(960, 300, 0.15, "sawtooth", 0.2), 60);
        break;

      case "pan": // 特工平底锅：清脆 Duang~ 金属敲击与回响
        this.playSlideTone(580, 320, 0.12, "square", 0.35);
        this.playMetallicChime(now + 0.05);
        this.playNoiseImpact(0.1, 0.3);
        break;

      case "fart": // 超级放屁枪：滑稽噗嗤下坠低音与气泡声
        this.playSlideTone(220, 55, 0.35, "sawtooth", 0.4);
        setTimeout(() => this.playSlideTone(160, 45, 0.25, "sine", 0.35), 100);
        this.playNoiseImpact(0.2, 0.25);
        break;

      case "freeze_gun": // 极度冷冻炮：晶莹高频冰霜与水晶冻结碎裂
        this.playToneSeries([
          { freq: 1100, time: now, dur: 0.1 },
          { freq: 1650, time: now + 0.06, dur: 0.12 },
          { freq: 2200, time: now + 0.12, dur: 0.18 },
          { freq: 3300, time: now + 0.18, dur: 0.25 }
        ], "sine", 0.35);
        this.playNoiseImpact(0.18, 0.2);
        break;

      case "rocket": // 鲨鱼火箭炮：呼啸冲刺 + 震撼大爆炸重低音
        this.playSlideTone(200, 750, 0.2, "sawtooth", 0.35);
        setTimeout(() => {
          this.playNoiseImpact(0.45, 0.5);
          this.playSlideTone(120, 30, 0.4, "sine", 0.45);
        }, 180);
        break;

      case "magnet": // 磁力香蕉：清脆金币吸附音
        this.playToneSeries([
          { freq: 987.77, time: now, dur: 0.08 },
          { freq: 1318.51, time: now + 0.06, dur: 0.1 },
          { freq: 1760.00, time: now + 0.12, dur: 0.2 }
        ], "sine", 0.3);
        break;

      case "goo": // 粘粘减速胶：咕嘟粘液喷射声
        this.playSlideTone(400, 110, 0.22, "sine", 0.35);
        break;

      case "hit": // 反派/我方受击震动音
        this.playNoiseImpact(0.2, 0.35);
        break;

      case "crit": // 暴击音效：高亮碎裂音 + 爆发
        this.playSlideTone(1200, 400, 0.2, "square", 0.28);
        this.playToneSeries([
          { freq: 880, time: now, dur: 0.08 },
          { freq: 1320, time: now + 0.06, dur: 0.15 },
          { freq: 1760, time: now + 0.12, dur: 0.25 }
        ], "triangle", 0.4);
        break;

      case "shield": // 护盾抵挡：金属清脆回响
        this.playMetallicChime(now);
        break;

      case "banana": // 吃香蕉回血：可爱的啵啵升调
        this.playSlideTone(300, 750, 0.2, "sine", 0.35);
        break;

      case "freeze": // 冰冻射线：晶莹剔透的水晶音
        this.playToneSeries([
          { freq: 1200, time: now, dur: 0.12 },
          { freq: 1600, time: now + 0.08, dur: 0.15 },
          { freq: 2000, time: now + 0.16, dur: 0.3 }
        ], "sine", 0.3);
        break;

      case "glasses": // 排除眼镜扫描音
        this.playToneSeries([
          { freq: 600, time: now, dur: 0.06 },
          { freq: 900, time: now + 0.06, dur: 0.06 },
          { freq: 1200, time: now + 0.12, dur: 0.12 }
        ], "sine", 0.25);
        break;

      case "victory": // 胜利过关：凯旋号角
        this.playToneSeries([
          { freq: 523.25, time: now, dur: 0.15 },
          { freq: 659.25, time: now + 0.15, dur: 0.15 },
          { freq: 783.99, time: now + 0.30, dur: 0.15 },
          { freq: 1046.50, time: now + 0.45, dur: 0.4 },
          { freq: 783.99, time: now + 0.85, dur: 0.15 },
          { freq: 1046.50, time: now + 1.0, dur: 0.6 }
        ], "triangle", 0.4);
        break;

      case "defeat": // 失败鼓励音
        this.playToneSeries([
          { freq: 440, time: now, dur: 0.2 },
          { freq: 392, time: now + 0.2, dur: 0.2 },
          { freq: 349, time: now + 0.4, dur: 0.2 },
          { freq: 440, time: now + 0.6, dur: 0.4 }
        ], "sine", 0.3);
        break;

      case "click": // 按钮点击轻音
        this.playTone(600, now, 0.04, "triangle", 0.15);
        break;

      default:
        break;
    }
  }

  // 单频音发生器
  playTone(freq, startTime, duration, type = "sine", vol = 0.3) {
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.error(e);
    }
  }

  // 连续音符序列
  playToneSeries(notes, type = "triangle", vol = 0.3) {
    notes.forEach(note => {
      this.playTone(note.freq, note.time, note.dur, type, vol);
    });
  }

  // 滑音发生器 (滑动频率)
  playSlideTone(startFreq, endFreq, duration, type = "sine", vol = 0.3) {
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const now = this.audioCtx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(10, endFreq), now + duration);

      gain.gain.setValueAtTime(vol, now);
      gain.gain.linearRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.error(e);
    }
  }

  // 金属回响效果
  playMetallicChime(startTime) {
    [880, 1318.5, 1760].forEach((freq, idx) => {
      this.playTone(freq, startTime + idx * 0.03, 0.35, "sine", 0.2);
    });
  }

  // 打击白噪声
  playNoiseImpact(duration = 0.15, vol = 0.3) {
    try {
      const bufferSize = this.audioCtx.sampleRate * duration;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, this.audioCtx.currentTime + duration);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(this.audioCtx.currentTime);
    } catch (e) {
      console.error(e);
    }
  }

  // ==========================================
  // Web Speech API 智能双语伴读引擎
  // ==========================================
  speakText(text, lang = "zh-CN", onEndCallback = null) {
    if (!this.ttsEnabled || !("speechSynthesis" in window)) {
      if (onEndCallback) onEndCallback();
      return;
    }

    this.stopSpeaking();

    // 净化朗读文本：去除部分格式符号，保持顺畅朗读
    const cleanText = text
      .replace(/【.*?】/g, "")
      .replace(/（.*?）/g, "")
      .replace(/_{2,}/g, "横线")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === "en-US" ? "en-US" : "zh-CN";
    utterance.rate = 0.92; // 0.92x稍慢适中语速，适合小学低年级
    utterance.pitch = 1.05; // 稍带轻快童趣的语调

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (err) => {
      console.warn("TTS Error:", err);
      this.currentUtterance = null;
      if (onEndCallback) onEndCallback();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  stopSpeaking() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  toggleSound(enable = null) {
    this.soundEnabled = enable !== null ? enable : !this.soundEnabled;
    return this.soundEnabled;
  }

  toggleTTS(enable = null) {
    this.ttsEnabled = enable !== null ? enable : !this.ttsEnabled;
    if (!this.ttsEnabled) this.stopSpeaking();
    return this.ttsEnabled;
  }

  toggleAutoRead(enable = null) {
    this.ttsAutoRead = enable !== null ? enable : !this.ttsAutoRead;
    return this.ttsAutoRead;
  }
}

// 导出与挂载
if (typeof module !== "undefined" && module.exports) {
  module.exports = { GameAudioEngine };
}
if (typeof window !== "undefined") {
  window.GameAudioEngine = GameAudioEngine;
}
