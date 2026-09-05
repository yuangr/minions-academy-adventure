/**
 * 《小黄人学院大冒险》学情报告与错题档案馆 (Report & Mistakes Module)
 * 包含：HTML5 Canvas 动态五维学情雷达图、错题专项回顾与打印练习卷
 */

class StudyReportModule {
  constructor(storageEngine, audioEngine) {
    this.storage = storageEngine;
    this.audio = audioEngine;
  }

  // ==========================================
  // HTML5 Canvas 五维学情能力雷达图绘制
  // ==========================================
  drawRadarChart(canvasElement) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext("2d");
    const width = canvasElement.width;
    const height = canvasElement.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 38;

    ctx.clearRect(0, 0, width, height);

    // 五维维度
    const dimensions = [
      { label: "表内乘法", score: this.calculateDimensionScore("math_mul") },
      { label: "除法与算盘", score: this.calculateDimensionScore("math_div") },
      { label: "识字与阅读", score: this.calculateDimensionScore("chinese_read") },
      { label: "词句成语", score: this.calculateDimensionScore("chinese_word") },
      { label: "英语交际", score: this.calculateDimensionScore("english") }
    ];

    const totalSides = dimensions.length;
    const angleStep = (Math.PI * 2) / totalSides;

    // 1. 绘制网格多边形底图 (4层同心五边形)
    const levels = 4;
    for (let l = 1; l <= levels; l++) {
      const levelRadius = (radius / levels) * l;
      ctx.beginPath();
      for (let i = 0; i < totalSides; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * levelRadius;
        const y = centerY + Math.sin(angle) * levelRadius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = "#D1DCE5";
      ctx.lineWidth = 1.5;
      ctx.fillStyle = l % 2 === 0 ? "#F8FAFC" : "#FFFFFF";
      ctx.fill();
      ctx.stroke();
    }

    // 2. 绘制轴线与文字标签
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let i = 0; i < totalSides; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      // 轴线
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#B8C5D0";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 标签文字坐标微调
      const labelX = centerX + Math.cos(angle) * (radius + 24);
      const labelY = centerY + Math.sin(angle) * (radius + 18);
      ctx.fillStyle = "#202428";
      ctx.fillText(dimensions[i].label, labelX, labelY);
    }

    // 3. 绘制学生实际得分多边形 (香蕉黄渐变填充 + 深黄描边)
    ctx.beginPath();
    dimensions.forEach((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      // 分数归一化到 0.2 ~ 1.0 (即使 0 分也保留基础底色)
      const normalized = Math.max(0.25, Math.min(1.0, dim.score / 100));
      const currentR = radius * normalized;
      const x = centerX + Math.cos(angle) * currentR;
      const y = centerY + Math.sin(angle) * currentR;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    ctx.fillStyle = "rgba(254, 212, 57, 0.55)";
    ctx.fill();
    ctx.strokeStyle = "#D4A305";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 4. 绘制得分数据节点圆点
    dimensions.forEach((dim, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const normalized = Math.max(0.25, Math.min(1.0, dim.score / 100));
      const currentR = radius * normalized;
      const x = centerX + Math.cos(angle) * currentR;
      const y = centerY + Math.sin(angle) * currentR;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#005C8A";
      ctx.fill();
      ctx.strokeStyle = "#FFF";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  // 根据做题统计折算维度分数 (默认基准 75 分，根据正答率动态浮动)
  calculateDimensionScore(dimType) {
    const stats = this.storage.data.stats;
    const subStats = stats.subjectStats;

    if (dimType.startsWith("math")) {
      const math = subStats.math;
      if (!math || math.answered === 0) return 80;
      return Math.round((math.correct / math.answered) * 100);
    } else if (dimType.startsWith("chinese")) {
      const chi = subStats.chinese;
      if (!chi || chi.answered === 0) return 85;
      return Math.round((chi.correct / chi.answered) * 100);
    } else {
      const eng = subStats.english;
      if (!eng || eng.answered === 0) return 78;
      return Math.round((eng.correct / eng.answered) * 100);
    }
  }

  // 渲染学情报告汇总数据
  renderStatsOverview(containerElement) {
    if (!containerElement) return;
    const stats = this.storage.data.stats;
    const total = stats.totalAnswered;
    const correct = stats.totalCorrect;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100;
    const playMinutes = Math.round((stats.totalPlayTimeSeconds || 0) / 60);

    containerElement.innerHTML = `
      <div class="stat-item-box">
        <span>📝 累计作答试题</span>
        <span class="stat-num">${total} 道</span>
      </div>
      <div class="stat-item-box">
        <span>🎯 答题总正确率</span>
        <span class="stat-num" style="color: ${accuracy >= 80 ? '#38B000' : '#FF8500'};">${accuracy}%</span>
      </div>
      <div class="stat-item-box">
        <span>📚 待消灭错题</span>
        <span class="stat-num" style="color:#E63946;">${this.storage.data.mistakes.length} 道</span>
      </div>
      <div class="stat-item-box">
        <span>⏱️ 专注学习时长</span>
        <span class="stat-num">${playMinutes} 分钟</span>
      </div>
    `;
  }

  // ==========================================
  // 错题档案馆渲染与管理
  // ==========================================
  renderMistakeList(containerElement, onReviewCallback) {
    if (!containerElement) return;
    const mistakes = this.storage.data.mistakes;

    if (mistakes.length === 0) {
      containerElement.innerHTML = `
        <div style="text-align:center; padding: 40px 10px;">
          <div style="font-size: 3.5rem; margin-bottom: 12px;">🌟</div>
          <h3 style="color:#005C8A; font-weight:800;">太棒了！错题档案馆空空如也！</h3>
          <p style="color:#5A6578; margin-top:6px;">保持专注答题，小黄人特工以你为荣！</p>
        </div>
      `;
      return;
    }

    containerElement.innerHTML = "";
    mistakes.forEach((m, idx) => {
      const card = document.createElement("div");
      card.className = "mistake-card";

      const subjectName = m.subject === "math" ? "数学" : (m.subject === "chinese" ? "语文" : "英语");
      const badgeClass = m.subject;

      card.innerHTML = `
        <div class="mistake-meta">
          <span class="q-badge ${badgeClass}">${subjectName} · ${m.unit || '知识点'}</span>
          <span>连续答对: ${m.reviewCorrectStreak || 0}/2 次攻克</span>
        </div>
        <p style="font-weight:700; font-size:1.05rem; line-height:1.6; margin-bottom:10px;">${m.scenario}</p>
        <div style="background:#FFF9E6; border:1px solid #FFE082; border-radius:8px; padding:8px 12px; font-size:0.9rem; line-height:1.5; margin-bottom:10px;">
          <div style="color:#C62828; font-weight:700;">❌ 错选项：${m.options[m.wrongAnswer] || '未作答'}</div>
          <div style="color:#2E7D32; font-weight:700; margin-top:2px;">✅ 正确答案：${m.options[m.answer]}</div>
          <div style="color:#555; margin-top:4px;">📖 名师解析：${m.explanation}</div>
        </div>
        <div style="display:flex; justify-content:flex-end; gap:8px;">
          <button class="btn-secondary btn-del-mistake" style="padding:4px 12px; font-size:0.85rem; background:#6C757D;">
            已掌握移除
          </button>
        </div>
      `;

      card.querySelector(".btn-del-mistake").onclick = () => {
        this.storage.removeMistake(m.questionId);
        this.renderMistakeList(containerElement, onReviewCallback);
      };

      containerElement.appendChild(card);
    });
  }

  // 打印练习卷
  printMistakes() {
    window.print();
  }
}

// 导出与挂载
if (typeof module !== "undefined" && module.exports) {
  module.exports = { StudyReportModule };
}
if (typeof window !== "undefined") {
  window.StudyReportModule = StudyReportModule;
}
