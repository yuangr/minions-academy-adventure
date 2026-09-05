---
version: "alpha"
name: "Minions Academy Design System"
description: "Child-friendly, comic-style educational UI design system for Minions Academy Adventure"
colors:
  primary: "#FED439"         # 小黄人香蕉经典黄 (Minion Yellow)
  primary-hover: "#F5C71A"   # 黄色悬浮加深
  primary-dark: "#D4A305"    # 黄色阴影描边
  secondary: "#005C8A"       # 格鲁牛仔工装蓝 (Denim Gru Blue)
  secondary-light: "#0A7EB8" # 亮工装蓝
  secondary-dark: "#003E5C"  # 深夜蓝
  accent-purple: "#7B2CBF"   # 埃尔马乔紫药水 (Villain Purple)
  accent-orange: "#FF8500"   # 连击火焰橙 (Combo Flame)
  accent-red: "#E63946"      # 警报受击红 (Danger / Boss HP)
  accent-green: "#38B000"    # 答对通关绿 (Success Green)
  surface: "#FFFFFF"         # 卡片白
  surface-warm: "#FFFDEB"    # 护眼暖香蕉白
  background: "#F4F7FB"     # 护眼浅蓝灰底色
  text-primary: "#202428"   # 极深炭黑（高对比清晰识字）
  text-secondary: "#5A6578" # 次要说明文字
  border-comic: "#2B2D42"   # 漫画描边墨水黑
typography:
  title-hero:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Comic Sans MS', sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.2
  title-section:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1.4rem"
    fontWeight: 700
    lineHeight: 1.3
  body-question:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.8
    letterSpacing: "0.02em"
  button-text:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1.1rem"
    fontWeight: 700
    lineHeight: 1.2
  label-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "0.9rem"
    fontWeight: 600
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "14px"
  lg: "20px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  card-comic:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "20px"
---

## Overview

小黄人学院大冒险 (Minions Academy) 遵循**“童趣漫画风 × 护眼大字号 × 低挫败高反馈”**的儿童教育游戏设计哲学。
界面整体呼应《神偷奶爸》与小黄人标志性的明朗香蕉黄、牛仔工装蓝与复古漫画厚边投影，按键大而圆润，易于平板触控与鼠标点击。文字间距开阔，字号专为小学一二年级识字伴读优化。

## Colors

色彩系统建立在阳光、活力与高识别度之上：
- **Primary ({colors.primary})**：标志性香蕉黄，用于主行动按键、金币、经验与奖励高亮。
- **Secondary ({colors.secondary})**：格鲁工装牛仔蓝，代表特工科技、顶栏导航与信息卡头。
- **Accents**：
  - **Success Green ({colors.accent-green})**：用于答对反馈、血量回复、已掌握徽章。
  - **Danger Red ({colors.accent-red})**：反派血条、倒计时告急、受击伤害。
  - **Flame Orange ({colors.accent-orange})**：连击火花、暴击提示与特殊道具。
  - **Villain Purple ({colors.accent-purple})**：恶人谷 Boss 专属配色。
- **Backgrounds**：
  - 底色采用护眼浅蓝灰 (`#F4F7FB`) 与暖香蕉底 (`#FFFDEB`)，杜绝刺眼纯白反光，符合护眼指南。

## Typography

文字排印遵循儿童人体工学原则：
- **识字友好**：题干字号统一维持在 1.2rem ~ 1.3rem，行高达到 1.8，字间距略微加宽，消除低年级学生阅读压迫感；
- **字重明确**：重点词、量词与算式强化为 700 粗体，与普通题干叙述区分；
- **发音按键**：每道题干旁常驻“🔊 朗读题干”大图标按键，字图结合。

## Layout

- **响应式视口**：中央自适应游戏画幅（最大宽 960px，高响应式），平板横屏或桌面大屏居中展示，手机竖屏自适应流式排版；
- **HUD 状态栏**：顶部常驻展示玩家生命槽、Boss 生命槽、连击火苗计数与倒计时圆环；
- **网格系统**：选项采用 2x2（大屏）或单列（移动端）大卡片网格，点击热区高 ≥ 56px。

## Elevation & Depth

放弃纯扁平冷淡风，采用极具实体触感的“漫画弹跳阴影”：
- **Comic Shadow**：卡片与按钮使用 `border: 3px solid #2B2D42`，辅以 `box-shadow: 0 5px 0 #2B2D42`；
- **Active State**：按下时 `transform: translateY(3px)`，阴影收缩为 `box-shadow: 0 2px 0 #2B2D42`，赋予如同实体玩具按压般的即时触觉反馈。

## Shapes

- **Capsule & Pill**：所有交互按钮均使用药丸型 (`rounded.pill`)，呼应小黄人的胶囊身形；
- **Soft Corners**：题目容器、道具槽位均采用 16px ~ 20px 圆角卡片，消除尖锐硬边，温和友好。

## Components

- **特工血条槽**：双层厚圆角血条，带血量数值与动态扣血白条过渡；
- **选项卡片 (Choice Card)**：带有 A/B/C/D 专属彩圈前缀，悬浮微浮起，选对绿光膨胀，选错柔和轻晃；
- **格鲁道具槽 (Item Pocket)**：悬浮在屏幕右下或题干下方，包含剩余道具角标与道具说明气泡；
- **名师解析弹窗 (Explanation Modal)**：答错或过关查看时弹出，包含温和鼓励小黄人语气、教材原出处标签与算理图解。

## Do's and Don'ts

### Do's:
- ✅ 严格保证按钮点击热区 ≥ 48px × 48px，适合儿童手指点击；
- ✅ 答错提示必须温和，伴随鼓励提示与名师考点解析，杜绝打击性红叉；
- ✅ 中英文题目题干均配置明显的朗读喇叭按键；
- ✅ 色彩对比度达到 WCAG AA 级以上标准，保护孩子视力。

### Don'ts:
- ❌ 严禁出现小字号密集排版（题干字号不得小于 18px）；
- ❌ 严禁使用生硬闪烁刺眼的红白全屏爆闪特效；
- ❌ 严禁在答题过程中插入任何广告或非游戏化干扰元素。
