/**
 * 《小黄人学院大冒险》特工与五大恶人形象资源库
 * 融合双模式：
 * 1. 官方电影高清剧照/渲染图（带 referrerpolicy="no-referrer" 防止防盗链拦截）
 * 2. 高保真深度还原的矢量艺术插图（支持 100% 纯离线环境无缝回退）
 */

const CHARACTER_PHOTOS = {
  // 四大小黄人主角
  kevin: "https://static.wikia.nocookie.net/despicableme/images/1/16/Moviesportykevin.jpeg/revision/latest?cb=20260426013913",
  stuart: "https://static.wikia.nocookie.net/despicableme/images/2/29/Stuart_%282010%29.jpg/revision/latest?cb=20240918210713",
  bob: "https://static.wikia.nocookie.net/despicableme/images/5/52/Bob_Bear%27s.jpg/revision/latest?cb=20211001015750",
  otto: "https://static.wikia.nocookie.net/despicableme/images/9/93/Otto_standing.png/revision/latest/scale-to-width-down/1200?cb=20241103152642",

  // 五大恶人 Boss
  boss_vector: "https://static.wikia.nocookie.net/despicableme/images/4/46/Vector_wallpaper.jpeg/revision/latest?cb=20160515045329",
  boss_elmacho: "https://static.wikia.nocookie.net/despicableme/images/a/aa/Eduardo.png/revision/latest?cb=20260225113210",
  boss_scarlet: "https://static.wikia.nocookie.net/despicableme/images/6/66/ScarletOverkillWallpaper.jpeg/revision/latest/scale-to-width-down/1200?cb=20160514174926",
  boss_bratt: "https://static.wikia.nocookie.net/despicableme/images/6/6f/Balthazar_Bratt_Transparent.png/revision/latest?cb=20170825223617",
  boss_vicious6: "https://static.wikia.nocookie.net/despicableme/images/0/07/The_Vicious_6.jpg/revision/latest/scale-to-width-down/1200?cb=20220418030617"
};

// ==========================================
// 深度高保真还原的纯代码 SVG 矢量素材
// ==========================================
const RAW_VECTOR_SVGS = {
  // 凯文 Kevin：修长身材、头顶冲天呆毛、双眼金属厚护目镜、自信大哥神情
  kevin: `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="minionYellowK" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFE14C" />
          <stop offset="60%" stop-color="#FED439" />
          <stop offset="100%" stop-color="#E5B208" />
        </linearGradient>
        <linearGradient id="denimBlueK" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0E6BA8" />
          <stop offset="100%" stop-color="#004369" />
        </linearGradient>
        <linearGradient id="silverGoggle" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#E6EAF0" />
          <stop offset="50%" stop-color="#9BA5B5" />
          <stop offset="100%" stop-color="#697486" />
        </linearGradient>
      </defs>
      <!-- 头顶直立呆毛小辫 -->
      <path d="M57,18 Q55,4 58,2 Q62,10 60,18" fill="#202428" />
      <path d="M53,20 Q48,7 52,5 Q55,12 55,20" fill="#202428" />
      <path d="M62,20 Q66,8 68,6 Q67,14 63,20" fill="#202428" />
      <!-- 瘦长胶囊身体 -->
      <rect x="32" y="16" width="56" height="98" rx="28" fill="url(#minionYellowK)" stroke="#2B2D42" stroke-width="3" />
      <!-- 黑色橡胶眼镜带 -->
      <rect x="25" y="38" width="70" height="10" rx="2" fill="#24272C" />
      <!-- 双金属护目镜框 -->
      <circle cx="47" cy="43" r="15" fill="url(#silverGoggle)" stroke="#2B2D42" stroke-width="3" />
      <circle cx="73" cy="43" r="15" fill="url(#silverGoggle)" stroke="#2B2D42" stroke-width="3" />
      <circle cx="47" cy="43" r="10.5" fill="#FFFFFF" />
      <circle cx="73" cy="43" r="10.5" fill="#FFFFFF" />
      <!-- 眼睛瞳孔 (深棕色) -->
      <circle cx="49" cy="43" r="5" fill="#653818" />
      <circle cx="49" cy="43" r="2.5" fill="#1A0D05" />
      <circle cx="50.5" cy="41.5" r="1.5" fill="#FFFFFF" />
      <circle cx="71" cy="43" r="5" fill="#653818" />
      <circle cx="71" cy="43" r="2.5" fill="#1A0D05" />
      <circle cx="72.5" cy="41.5" r="1.5" fill="#FFFFFF" />
      <!-- 自信歪嘴笑 -->
      <path d="M50,68 Q60,76 70,68" stroke="#2B2D42" stroke-width="3" fill="none" stroke-linecap="round" />
      <!-- 牛仔连体背带裤 -->
      <path d="M32,88 Q60,94 88,88 L88,114 Q60,118 32,114 Z" fill="url(#denimBlueK)" stroke="#2B2D42" stroke-width="3" />
      <rect x="42" y="76" width="36" height="26" fill="url(#denimBlueK)" stroke="#2B2D42" stroke-width="2.5" />
      <!-- 背带与金属扣 -->
      <path d="M32,78 L45,86" stroke="#003554" stroke-width="5" stroke-linecap="round" />
      <circle cx="44" cy="85" r="2.5" fill="#C59B27" />
      <path d="M88,78 L75,86" stroke="#003554" stroke-width="5" stroke-linecap="round" />
      <circle cx="76" cy="85" r="2.5" fill="#C59B27" />
      <!-- 格鲁 G 标志徽章 -->
      <circle cx="60" cy="94" r="6" fill="#1C2128" />
      <path d="M60,91 L62,94 L60,97 L58,94 Z" fill="#FED439" />
      <!-- 小黑鞋 -->
      <ellipse cx="46" cy="120" rx="9" ry="5" fill="#202428" stroke="#111" stroke-width="2" />
      <ellipse cx="74" cy="120" rx="9" ry="5" fill="#202428" stroke="#111" stroke-width="2" />
    </svg>
  `,

  // 斯图尔特 Stuart：经典单眼、整齐中分、自信摇滚风
  stuart: `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="minionYellowS" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFE14C" />
          <stop offset="60%" stop-color="#FED439" />
          <stop offset="100%" stop-color="#E5B208" />
        </linearGradient>
      </defs>
      <!-- 中分发丝 -->
      <path d="M60,20 Q44,22 34,32" stroke="#2B2D42" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M60,20 Q76,22 86,32" stroke="#2B2D42" stroke-width="3" fill="none" stroke-linecap="round" />
      <!-- 中等圆润身体 -->
      <rect x="30" y="20" width="60" height="92" rx="30" fill="url(#minionYellowS)" stroke="#2B2D42" stroke-width="3" />
      <!-- 黑色眼带 -->
      <rect x="23" y="44" width="74" height="11" fill="#24272C" />
      <!-- 标志性单眼大护目镜 -->
      <circle cx="60" cy="49" r="21" fill="#9BA5B5" stroke="#2B2D42" stroke-width="3.5" />
      <circle cx="60" cy="49" r="15" fill="#FFFFFF" />
      <circle cx="60" cy="49" r="7.5" fill="#754215" />
      <circle cx="60" cy="49" r="3.5" fill="#1A0D05" />
      <circle cx="62" cy="46" r="2" fill="#FFFFFF" />
      <!-- 酷酷的半月微笑 -->
      <path d="M52,76 Q62,84 72,76" stroke="#2B2D42" stroke-width="3" fill="none" stroke-linecap="round" />
      <!-- 工装牛仔裤 -->
      <path d="M30,86 Q60,92 90,86 L90,112 Q60,116 30,112 Z" fill="#005C8A" stroke="#2B2D42" stroke-width="3" />
      <rect x="42" y="76" width="36" height="24" fill="#005C8A" stroke="#2B2D42" stroke-width="2.5" />
      <!-- 背带 -->
      <path d="M30,76 L44,85" stroke="#003554" stroke-width="5" stroke-linecap="round" />
      <path d="M90,76 L76,85" stroke="#003554" stroke-width="5" stroke-linecap="round" />
      <!-- 背后斜背的摇滚小吉他 -->
      <ellipse cx="26" cy="80" rx="6" ry="12" fill="#C14917" stroke="#2B2D42" stroke-width="2" transform="rotate(-25 26 80)" />
      <!-- 鞋子 -->
      <ellipse cx="44" cy="118" rx="9" ry="5" fill="#202428" />
      <ellipse cx="76" cy="118" rx="9" ry="5" fill="#202428" />
    </svg>
  `,

  // 鲍勃 Bob：矮胖软萌、标志性异色双瞳 (左绿右棕)、抱着小熊提姆 Tim
  bob: `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="minionYellowB" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFE66D" />
          <stop offset="60%" stop-color="#FED439" />
          <stop offset="100%" stop-color="#E5B208" />
        </linearGradient>
      </defs>
      <!-- 矮胖圆滚滚无毛光头身体 -->
      <rect x="25" y="28" width="70" height="84" rx="35" fill="url(#minionYellowB)" stroke="#2B2D42" stroke-width="3" />
      <!-- 眼带 -->
      <rect x="18" y="48" width="84" height="10" fill="#24272C" />
      <!-- 异色双眸护目镜 -->
      <circle cx="45" cy="53" r="16" fill="#9BA5B5" stroke="#2B2D42" stroke-width="3" />
      <circle cx="75" cy="53" r="16" fill="#9BA5B5" stroke="#2B2D42" stroke-width="3" />
      <circle cx="45" cy="53" r="11" fill="#FFFFFF" />
      <circle cx="75" cy="53" r="11" fill="#FFFFFF" />
      <!-- 左绿 (翠绿) -->
      <circle cx="46" cy="53" r="5.5" fill="#2EC4B6" />
      <circle cx="46" cy="53" r="2.5" fill="#0E4F49" />
      <circle cx="47.5" cy="51" r="1.5" fill="#FFFFFF" />
      <!-- 右棕 (蜜棕) -->
      <circle cx="74" cy="53" r="5.5" fill="#8B4513" />
      <circle cx="74" cy="53" r="2.5" fill="#3D1D06" />
      <circle cx="75.5" cy="51" r="1.5" fill="#FFFFFF" />
      <!-- 萌萌大笑露粉舌 -->
      <path d="M48,74 Q60,86 72,74 Z" fill="#D90429" stroke="#2B2D42" stroke-width="2" />
      <path d="M52,78 Q60,82 68,78" fill="#FF758F" />
      <!-- 胖裤子 -->
      <path d="M25,86 Q60,92 95,86 L95,112 Q60,116 25,112 Z" fill="#005C8A" stroke="#2B2D42" stroke-width="3" />
      <rect x="38" y="74" width="44" height="24" fill="#005C8A" stroke="#2B2D42" stroke-width="2.5" />
      <!-- 泰迪熊 Tim -->
      <circle cx="32" cy="85" r="9" fill="#99582A" stroke="#2B2D42" stroke-width="2" />
      <circle cx="26" cy="78" r="3.5" fill="#7F441E" />
      <circle cx="38" cy="78" r="3.5" fill="#7F441E" />
      <text x="29" y="87" font-size="6" font-family="sans-serif">✕</text>
      <!-- 脚步 -->
      <ellipse cx="44" cy="118" rx="9" ry="5" fill="#202428" />
      <ellipse cx="76" cy="118" rx="9" ry="5" fill="#202428" />
    </svg>
  `,

  // 奥托 Otto：圆胖体态、散落发丝、金属牙套钢牙、挂着宠物石
  otto: `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="minionYellowO" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#FFE14C" />
          <stop offset="60%" stop-color="#FED439" />
          <stop offset="100%" stop-color="#E5B208" />
        </linearGradient>
      </defs>
      <!-- 头顶杂乱几根毛 -->
      <path d="M52,18 Q50,6 54,6" stroke="#2B2D42" stroke-width="2" fill="none" />
      <path d="M60,18 Q62,4 64,5" stroke="#2B2D42" stroke-width="2" fill="none" />
      <path d="M68,19 Q72,8 74,10" stroke="#2B2D42" stroke-width="2" fill="none" />
      <!-- 最圆胖身材 -->
      <rect x="22" y="20" width="76" height="92" rx="38" fill="url(#minionYellowO)" stroke="#2B2D42" stroke-width="3" />
      <!-- 眼带 -->
      <rect x="15" y="44" width="90" height="10" fill="#24272C" />
      <!-- 双眼 -->
      <circle cx="45" cy="49" r="16" fill="#9BA5B5" stroke="#2B2D42" stroke-width="3" />
      <circle cx="75" cy="49" r="16" fill="#9BA5B5" stroke="#2B2D42" stroke-width="3" />
      <circle cx="45" cy="49" r="11" fill="#FFFFFF" />
      <circle cx="75" cy="49" r="11" fill="#FFFFFF" />
      <circle cx="46" cy="49" r="5" fill="#6B3F1D" />
      <circle cx="74" cy="49" r="5" fill="#6B3F1D" />
      <!-- 标志性银色金属牙套 (Braces) -->
      <rect x="42" y="68" width="36" height="11" rx="4" fill="#FFFFFF" stroke="#2B2D42" stroke-width="2" />
      <line x1="42" y1="73.5" x2="78" y2="73.5" stroke="#9E9E9E" stroke-width="2.5" />
      <rect x="47" y="71" width="3" height="5" fill="#607D8B" />
      <rect x="54" y="71" width="3" height="5" fill="#607D8B" />
      <rect x="61" y="71" width="3" height="5" fill="#607D8B" />
      <rect x="68" y="71" width="3" height="5" fill="#607D8B" />
      <!-- 胖裤子与腰间宠物石 -->
      <path d="M22,86 Q60,92 98,86 L98,112 Q60,116 22,112 Z" fill="#005C8A" stroke="#2B2D42" stroke-width="3" />
      <circle cx="78" cy="94" r="7" fill="#40916C" stroke="#2B2D42" stroke-width="2" />
      <!-- 鞋子 -->
      <ellipse cx="44" cy="118" rx="9" ry="5" fill="#202428" />
      <ellipse cx="76" cy="118" rx="9" ry="5" fill="#202428" />
    </svg>
  `,

  // 矢量 Vector：橙色立领运动服、标志性盖儿头、粗黑框方眼镜、狡黠得瑟
  boss_vector: `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="vectorOrange" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FF7B00" />
          <stop offset="100%" stop-color="#E85D04" />
        </linearGradient>
      </defs>
      <!-- 橙色运动服立领与上身 -->
      <path d="M25,55 L95,55 L102,120 L18,120 Z" fill="url(#vectorOrange)" stroke="#2B2D42" stroke-width="3" />
      <line x1="60" y1="55" x2="60" y2="120" stroke="#FFFFFF" stroke-width="4" />
      <path d="M20,70 L30,70 L35,120 L25,120 Z" fill="#FFFFFF" />
      <path d="M100,70 L90,70 L85,120 L95,120 Z" fill="#FFFFFF" />
      <!-- 瘦长脸型与尖下巴 -->
      <polygon points="60,65 32,32 88,32" fill="#FAD2B8" stroke="#2B2D42" stroke-width="2.5" />
      <!-- 标志性锅盖刘海深棕短发 -->
      <path d="M28,32 C28,10 92,10 92,32 C92,34 84,34 84,30 C76,24 44,24 36,30 C36,34 28,34 28,32 Z" fill="#382214" stroke="#2B2D42" stroke-width="3" />
      <!-- 硕大的黑白双色方框极客眼镜 -->
      <rect x="33" y="24" width="22" height="17" rx="3" fill="#FFFFFF" stroke="#2B2D42" stroke-width="3" />
      <rect x="65" y="24" width="22" height="17" rx="3" fill="#FFFFFF" stroke="#2B2D42" stroke-width="3" />
      <line x1="55" y1="32" x2="65" y2="32" stroke="#2B2D42" stroke-width="3.5" />
      <circle cx="44" cy="32" r="3.5" fill="#1C1917" />
      <circle cx="76" cy="32" r="3.5" fill="#1C1917" />
      <!-- 得意得瑟的斜尖嘴笑 -->
      <path d="M48,50 Q56,58 68,48" stroke="#2B2D42" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <!-- 飞天乌贼枪徽章 -->
      <circle cx="40" cy="80" r="8" fill="#FFF" stroke="#2B2D42" stroke-width="2" />
      <text x="35" y="84" font-size="10">🦑</text>
    </svg>
  `,

  // 埃尔·马乔 El Macho：魁梧无敌摔跤霸王、红金烈焰摔跤面具、霸气咆哮胸毛 M
  boss_elmacho: `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="machoRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#E63946" />
          <stop offset="100%" stop-color="#9D0208" />
        </linearGradient>
      </defs>
      <!-- 庞大健硕的身躯与紫色斗篷 -->
      <path d="M12,45 L108,45 L114,125 L6,125 Z" fill="#3C096C" stroke="#2B2D42" stroke-width="3" />
      <!-- 健硕麦色胸膛 -->
      <path d="M26,50 L94,50 L88,115 L32,115 Z" fill="#DDA15E" stroke="#2B2D42" stroke-width="3" />
      <!-- 经典摔跤手烈火红金面具 -->
      <circle cx="60" cy="36" r="26" fill="url(#machoRed)" stroke="#2B2D42" stroke-width="3" />
      <!-- 面具金色双鹰烈火纹饰 -->
      <path d="M46,20 Q60,32 74,20 Q60,26 46,20 Z" fill="#FFB703" stroke="#2B2D42" stroke-width="2" />
      <!-- 威严怒视的白目与黑瞳 -->
      <polygon points="43,34 53,37 45,42" fill="#FFFFFF" stroke="#2B2D42" stroke-width="1.5" />
      <polygon points="77,34 67,37 75,42" fill="#FFFFFF" stroke="#2B2D42" stroke-width="1.5" />
      <circle cx="48" cy="38" r="2" fill="#000" />
      <circle cx="72" cy="38" r="2" fill="#000" />
      <!-- 狂暴浓密的黑色胸毛 (标志性巨型字母 M) -->
      <path d="M40,70 L50,86 L60,74 L70,86 L80,70" stroke="#1F1D1D" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      <!-- 腰带金骷髅扣 -->
      <rect x="42" y="110" width="36" height="12" rx="4" fill="#FFB703" stroke="#2B2D42" stroke-width="2.5" />
    </svg>
  `,

  // 斯嘉丽·杀手 Scarlet Overkill：蜂窝复古盘发、窈窕红色火箭熔岩裙、冷艳高贵
  boss_scarlet: `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="dressRed" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#E63946" />
          <stop offset="100%" stop-color="#9D0208" />
        </linearGradient>
      </defs>
      <!-- 火箭熔岩下摆与火焰喷射 -->
      <path d="M46,65 L22,122 L98,122 L74,65 Z" fill="url(#dressRed)" stroke="#2B2D42" stroke-width="3" />
      <path d="M36,122 L45,135 L60,126 L75,135 L84,122 Z" fill="#FF8500" />
      <!-- 修长身段与黑色长手套 -->
      <rect x="46" y="52" width="28" height="22" fill="#202428" stroke="#2B2D42" stroke-width="2" />
      <ellipse cx="60" cy="38" rx="18" ry="20" fill="#FDE2E4" stroke="#2B2D42" stroke-width="2" />
      <!-- 60年代高耸蜂窝乌黑发髻 (Beehive) -->
      <path d="M34,40 C20,12 100,12 86,40 C98,28 88,4 60,4 C32,4 22,28 34,40 Z" fill="#1A181B" stroke="#2B2D42" stroke-width="3" />
      <!-- 迷人魅惑的丹凤眼与长睫毛 -->
      <path d="M48,34 Q54,30 58,35" stroke="#2B2D42" stroke-width="2.5" fill="none" />
      <path d="M62,35 Q66,30 72,34" stroke="#2B2D42" stroke-width="2.5" fill="none" />
      <circle cx="53" cy="35" r="2" fill="#005C8A" />
      <circle cx="67" cy="35" r="2" fill="#005C8A" />
      <!-- 烈焰红唇 -->
      <path d="M54,48 Q60,54 66,48 Q60,51 54,48 Z" fill="#D90429" stroke="#2B2D42" stroke-width="1.5" />
    </svg>
  `,

  // 巴萨扎·布莱德 Balthazar Bratt：80年代扫把头、大宽垫肩紫西装、吹粉色泡泡糖
  boss_bratt: `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="retroPurple" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#9D4EDD" />
          <stop offset="100%" stop-color="#5A189A" />
        </linearGradient>
      </defs>
      <!-- 80年代夸张平肩双排扣紫西装 -->
      <path d="M12,54 L108,54 L92,122 L28,122 Z" fill="url(#retroPurple)" stroke="#2B2D42" stroke-width="3" />
      <polygon points="60,54 48,82 60,90 72,82" fill="#FFF" stroke="#2B2D42" stroke-width="2" />
      <!-- 极瘦的尖下巴与胡渣 -->
      <polygon points="60,62 42,28 78,28" fill="#F8D7C4" stroke="#2B2D42" stroke-width="2" />
      <!-- 80年代莫霍克平顶高耸发型 -->
      <rect x="50" y="4" width="20" height="26" fill="#1C1917" stroke="#2B2D42" stroke-width="2.5" />
      <!-- 细长浓密一字眉与小眼睛 -->
      <line x1="46" y1="35" x2="74" y2="35" stroke="#1C1917" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="52" cy="39" r="2" fill="#000" />
      <circle cx="68" cy="39" r="2" fill="#000" />
      <!-- 细长小胡子 -->
      <path d="M52,52 Q60,54 68,52" stroke="#1C1917" stroke-width="2.5" fill="none" />
      <!-- 巨大粉红泡泡糖球 -->
      <circle cx="60" cy="50" r="13" fill="#F72585" opacity="0.9" stroke="#7209B7" stroke-width="2" />
      <circle cx="64" cy="46" r="3.5" fill="#FFFFFF" opacity="0.6" />
    </svg>
  `,

  // 恶人六天王 Vicious 6：暗黑生肖远古金龙符石联盟、复古巨型阿芙罗盘头金冠
  boss_vicious6: `
    <svg viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="zodiacGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFD166" />
          <stop offset="70%" stop-color="#D4A305" />
          <stop offset="100%" stop-color="#6F4E37" />
        </radialGradient>
      </defs>
      <!-- 远古暗黑符文大阵金环 -->
      <circle cx="60" cy="70" r="48" fill="#1A1C23" stroke="url(#zodiacGlow)" stroke-width="4" />
      <circle cx="60" cy="70" r="38" fill="#540804" stroke="#D00000" stroke-width="2" stroke-dasharray="6,4" />
      <!-- 远古生肖神龙与首领金冠 -->
      <path d="M42,56 Q60,34 78,56 Q70,90 60,98 Q50,90 42,56 Z" fill="url(#zodiacGlow)" stroke="#2B2D42" stroke-width="3" />
      <!-- 怒目赤瞳 -->
      <polygon points="50,60 56,62 52,66" fill="#FF0054" stroke="#FFF" stroke-width="1.5" />
      <polygon points="70,60 64,62 68,66" fill="#FF0054" stroke="#FFF" stroke-width="1.5" />
      <!-- 龙首尖牙与利角 -->
      <path d="M50,78 L54,84 L60,80 L66,84 L70,78" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <!-- 头顶生肖秘宝龙珠 (翡翠宝石) -->
      <polygon points="60,20 50,34 70,34" fill="#06D6A0" stroke="#FFD166" stroke-width="2.5" />
    </svg>
  `
};

/**
 * 核心渲染函数：
 * 优先展示高清角色肖像图（自动支持 referrerpolicy="no-referrer" 跨域展示），
 * 离线时自动无缝降级显示全新绘制的高清矢量艺术模型。
 */
function createCharacterAvatarMarkup(charKey) {
  const photoUrl = CHARACTER_PHOTOS[charKey] || "";
  const svgFallback = RAW_VECTOR_SVGS[charKey] || "";

  return `
    <div class="character-avatar-wrap" data-char="${charKey}">
      <img src="${photoUrl}"
           alt="${charKey}"
           class="character-photo"
           referrerpolicy="no-referrer"
           loading="lazy"
           onload="this.classList.add('loaded')"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
      <div class="character-svg-fallback" style="display:none;">
        ${svgFallback}
      </div>
    </div>
  `;
}

// 映射给系统各模块引用的全局 AVATAR_SVGS 对象
const AVATAR_SVGS = {};
Object.keys(RAW_VECTOR_SVGS).forEach(key => {
  AVATAR_SVGS[key] = createCharacterAvatarMarkup(key);
});

// 导出与全局挂载
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AVATAR_SVGS, CHARACTER_PHOTOS, RAW_VECTOR_SVGS, createCharacterAvatarMarkup };
}
if (typeof window !== "undefined") {
  window.AVATAR_SVGS = AVATAR_SVGS;
  window.CHARACTER_PHOTOS = CHARACTER_PHOTOS;
  window.RAW_VECTOR_SVGS = RAW_VECTOR_SVGS;
  window.createCharacterAvatarMarkup = createCharacterAvatarMarkup;
}
