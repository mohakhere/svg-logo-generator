/**
 * LimeNit Logo Generator - Main JavaScript
 * Professional logo generation with SVG
 */

// ============================================
// Application State
// ============================================

const state = {
  logoType: 'combination',
  brandName: 'LimeNit',
  textCase: 'title',
  baseShape: 'circle',
  frameStyle: 'none',
  iconTheme: 'tech',
  colorPalette: 'warm',
  customColor: '#FF5C5C',
  complexity: 3,
  layout: 'horizontal',
  canvasTheme: 'light',
  previewingTheme: null
};

// ============================================
// Color Palettes
// ============================================

const colorPalettes = {
  warm: { primary: '#FF5C5C', secondary: '#FF9A76', accent: '#FFC947' },
  cool: { primary: '#3B82F6', secondary: '#60A5FA', accent: '#93C5FD' },
  nature: { primary: '#10B981', secondary: '#34D399', accent: '#6EE7B7' },
  luxury: { primary: '#8B5CF6', secondary: '#A78BFA', accent: '#C4B5FD' },
  energetic: { primary: '#F59E0B', secondary: '#FBBF24', accent: '#FCD34D' },
  neutral: { primary: '#6B7280', secondary: '#9CA3AF', accent: '#D1D5DB' },
  monochrome: { primary: '#1F2937', secondary: '#6B7280', accent: '#D1D5DB' },
  custom: { primary: '#FF5C5C', secondary: '#FF9A76', accent: '#FFC947' }
};

// ============================================
// DOM Ready
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initializeEventListeners();
  generateLogo();
});

// ============================================
// Event Listeners
// ============================================

function initializeEventListeners() {
  // Logo type selector
  document.getElementById('logoType').addEventListener('change', (e) => {
    state.logoType = e.target.value;
    generateLogo();
  });

  // Brand name input
  document.getElementById('brandName').addEventListener('input', (e) => {
    state.brandName = e.target.value || 'Brand';
    generateLogo();
  });

  // Complexity slider
  document.getElementById('complexity').addEventListener('input', (e) => {
    state.complexity = parseInt(e.target.value);
    document.getElementById('complexityValue').textContent = state.complexity;
    generateLogo();
  });

  // Custom color picker
  document.getElementById('customColor').addEventListener('input', (e) => {
    state.customColor = e.target.value;
    if (state.colorPalette === 'custom') {
      colorPalettes.custom.primary = state.customColor;
      generateLogo();
    }
  });

  // Case buttons
  document.querySelectorAll('.case-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.case-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      state.textCase = e.target.dataset.case;
      generateLogo();
    });
  });

  // Shape selection
  document.querySelectorAll('[data-shape]').forEach(el => {
    el.addEventListener('click', (e) => {
      const element = e.currentTarget;
      document.querySelectorAll('[data-shape]').forEach(el => el.classList.remove('selected'));
      element.classList.add('selected');
      state.baseShape = element.dataset.shape;
      generateLogo();
    });
  });

  // Frame selection
  document.querySelectorAll('[data-frame]').forEach(el => {
    el.addEventListener('click', (e) => {
      const element = e.currentTarget;
      document.querySelectorAll('[data-frame]').forEach(el => el.classList.remove('selected'));
      element.classList.add('selected');
      state.frameStyle = element.dataset.frame;
      generateLogo();
    });
  });

  // Theme selection with hover preview
  document.querySelectorAll('[data-theme]').forEach(el => {
    el.addEventListener('click', (e) => {
      const element = e.currentTarget;
      document.querySelectorAll('[data-theme]').forEach(el => el.classList.remove('selected'));
      element.classList.add('selected');
      state.iconTheme = element.dataset.theme;
      state.previewingTheme = null;
      generateLogo();
    });

    el.addEventListener('mouseenter', (e) => {
      const theme = e.currentTarget.dataset.theme;
      if (state.iconTheme !== theme) {
        state.previewingTheme = theme;
        generateLogo();
      }
    });

    el.addEventListener('mouseleave', () => {
      if (state.previewingTheme) {
        state.previewingTheme = null;
        generateLogo();
      }
    });
  });

  // Color palette selection
  document.querySelectorAll('[data-palette]').forEach(el => {
    el.addEventListener('click', (e) => {
      const element = e.currentTarget;
      document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
      element.classList.add('selected');
      state.colorPalette = element.dataset.palette;
      if (state.colorPalette === 'custom') {
        colorPalettes.custom.primary = state.customColor;
      }
      generateLogo();
    });
  });

  // Layout buttons
  document.querySelectorAll('[data-layout]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const layout = e.currentTarget.dataset.layout;
      state.layout = layout;
      document.querySelectorAll('[data-layout]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const container = document.getElementById('logoContainer');
      container.className = `logo-container ${layout === 'vertical' ? 'vertical' : ''}`;
    });
  });

  // Canvas theme buttons
  document.querySelectorAll('[data-canvas-theme]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const theme = e.currentTarget.dataset.canvasTheme;
      state.canvasTheme = theme;
      document.querySelectorAll('.theme-toggle-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      
      const canvas = document.getElementById('mainCanvas');
      const brandName = document.getElementById('brandNameDisplay');
      
      if (theme === 'dark') {
        canvas.classList.add('dark');
        brandName.classList.add('light-text');
      } else {
        canvas.classList.remove('dark');
        brandName.classList.remove('light-text');
      }
    });
  });

  // Copy SVG button
  document.getElementById('copySvgBtn').addEventListener('click', copySVG);

  // Download button
  document.getElementById('downloadBtn').addEventListener('click', downloadLogo);
}

// ============================================
// Logo Generation
// ============================================

function generateLogo() {
  const activeTheme = state.previewingTheme || state.iconTheme;
  const colors = colorPalettes[state.colorPalette];
  const svg = document.getElementById('logoPreview');
  
  svg.innerHTML = '';
  
  if (state.frameStyle !== 'none') {
    generateFrame(svg, colors);
  }
  
  if (state.baseShape !== 'none') {
    generateBaseShape(svg, colors);
  }
  
  generateThemeIcon(svg, colors, activeTheme);
  
  updateBrandName();
  updatePreviews();
}

// ============================================
// Base Shape Generation
// ============================================

function generateBaseShape(svg, colors) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', 'baseShape');
  
  let path;
  
  switch(state.baseShape) {
    case 'circle':
      path = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      path.setAttribute('cx', '100');
      path.setAttribute('cy', '100');
      path.setAttribute('r', '85');
      break;
    case 'square':
      path = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      path.setAttribute('x', '15');
      path.setAttribute('y', '15');
      path.setAttribute('width', '170');
      path.setAttribute('height', '170');
      break;
    case 'rounded':
      path = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      path.setAttribute('x', '15');
      path.setAttribute('y', '15');
      path.setAttribute('width', '170');
      path.setAttribute('height', '170');
      path.setAttribute('rx', '25');
      break;
    case 'hexagon':
      path = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      path.setAttribute('points', '100,15 170,55 170,145 100,185 30,145 30,55');
      break;
    case 'diamond':
      path = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      path.setAttribute('points', '100,15 185,100 100,185 15,100');
      break;
  }
  
  if (path) {
    path.setAttribute('fill', colors.primary);
    path.setAttribute('fill-opacity', '0.12');
    path.setAttribute('stroke', colors.primary);
    path.setAttribute('stroke-width', '3');
    g.appendChild(path);
  }
  
  svg.appendChild(g);
}

// ============================================
// Frame Generation
// ============================================

function generateFrame(svg, colors) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', 'frame');
  
  switch(state.frameStyle) {
    case 'shield':
      const shield = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      shield.setAttribute('d', 'M100,20 L175,45 L175,100 Q175,145 100,180 Q25,145 25,100 L25,45 Z');
      shield.setAttribute('fill', 'none');
      shield.setAttribute('stroke', colors.primary);
      shield.setAttribute('stroke-width', '4');
      g.appendChild(shield);
      break;
    case 'badge':
      const outer = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      outer.setAttribute('cx', '100');
      outer.setAttribute('cy', '100');
      outer.setAttribute('r', '80');
      outer.setAttribute('fill', 'none');
      outer.setAttribute('stroke', colors.primary);
      outer.setAttribute('stroke-width', '3');
      g.appendChild(outer);
      
      const inner = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      inner.setAttribute('cx', '100');
      inner.setAttribute('cy', '100');
      inner.setAttribute('r', '70');
      inner.setAttribute('fill', 'none');
      inner.setAttribute('stroke', colors.secondary);
      inner.setAttribute('stroke-width', '2');
      g.appendChild(inner);
      break;
    case 'ribbon':
      const topRibbon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      topRibbon.setAttribute('d', 'M20,60 L20,50 L180,50 L180,60');
      topRibbon.setAttribute('fill', 'none');
      topRibbon.setAttribute('stroke', colors.primary);
      topRibbon.setAttribute('stroke-width', '4');
      g.appendChild(topRibbon);
      
      const bottomRibbon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      bottomRibbon.setAttribute('d', 'M20,140 L20,150 L180,150 L180,140');
      bottomRibbon.setAttribute('fill', 'none');
      bottomRibbon.setAttribute('stroke', colors.primary);
      bottomRibbon.setAttribute('stroke-width', '4');
      g.appendChild(bottomRibbon);
      break;
    case 'gear':
      const gearPath = 'M100,30 L110,45 L125,40 L130,55 L145,55 L145,70 L160,75 L155,90 L165,100 L155,110 L160,125 L145,130 L145,145 L130,145 L125,160 L110,155 L100,170 L90,155 L75,160 L70,145 L55,145 L55,130 L40,125 L45,110 L35,100 L45,90 L40,75 L55,70 L55,55 L70,55 L75,40 L90,45 Z';
      const gear = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      gear.setAttribute('d', gearPath);
      gear.setAttribute('fill', 'none');
      gear.setAttribute('stroke', colors.primary);
      gear.setAttribute('stroke-width', '3');
      g.appendChild(gear);
      break;
    case 'bracket':
      const leftBracket = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      leftBracket.setAttribute('d', 'M60,30 L40,30 Q30,30 30,40 L30,160 Q30,170 40,170 L60,170');
      leftBracket.setAttribute('fill', 'none');
      leftBracket.setAttribute('stroke', colors.primary);
      leftBracket.setAttribute('stroke-width', '4');
      leftBracket.setAttribute('stroke-linecap', 'round');
      g.appendChild(leftBracket);
      
      const rightBracket = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      rightBracket.setAttribute('d', 'M140,30 L160,30 Q170,30 170,40 L170,160 Q170,170 160,170 L140,170');
      rightBracket.setAttribute('fill', 'none');
      rightBracket.setAttribute('stroke', colors.primary);
      rightBracket.setAttribute('stroke-width', '4');
      rightBracket.setAttribute('stroke-linecap', 'round');
      g.appendChild(rightBracket);
      break;
  }
  
  svg.appendChild(g);
}

// ============================================
// Theme Icon Generation
// ============================================

function generateThemeIcon(svg, colors, theme) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('id', 'icon');
  g.setAttribute('transform', 'translate(100, 100)');
  
  const c = state.complexity;
  
  const generators = {
    tech: () => generateTechIcon(g, colors, c),
    finance: () => generateFinanceIcon(g, colors, c),
    nature: () => generateNatureIcon(g, colors, c),
    food: () => generateFoodIcon(g, colors, c),
    luxury: () => generateLuxuryIcon(g, colors, c),
    craft: () => generateCraftIcon(g, colors, c),
    legal: () => generateLegalIcon(g, colors, c),
    medical: () => generateMedicalIcon(g, colors, c),
    media: () => generateMediaIcon(g, colors, c),
    education: () => generateEducationIcon(g, colors, c),
    ecommerce: () => generateEcommerceIcon(g, colors, c),
    realestate: () => generateRealEstateIcon(g, colors, c),
    travel: () => generateTravelIcon(g, colors, c),
    crypto: () => generateCryptoIcon(g, colors, c),
    fitness: () => generateFitnessIcon(g, colors, c),
    beauty: () => generateBeautyIcon(g, colors, c),
    nonprofit: () => generateNonprofitIcon(g, colors, c),
    startup: () => generateStartupIcon(g, colors, c)
  };
  
  const generator = generators[theme];
  if (generator) {
    generator();
  }
  
  svg.appendChild(g);
}

// ============================================
// Individual Theme Generators
// ============================================

function generateTechIcon(g, colors, c) {
  createRect(g, -28, -28, 56, 56, 6, colors.primary);
  
  if (c >= 1) {
    createPath(g, 'M-28,0 L-18,0 L-18,-10 L-8,-10', 'none', colors.secondary, 2.5);
    createPath(g, 'M28,0 L18,0 L18,10 L8,10', 'none', colors.secondary, 2.5);
  }
  
  if (c >= 2) {
    createCircle(g, -18, -10, 3, colors.accent);
    createCircle(g, 18, 10, 3, colors.accent);
    createPath(g, 'M0,-28 L0,-18 L10,-18 L10,-8', 'none', colors.secondary, 2.5);
  }
  
  if (c >= 3) {
    const innerChip = createRect(g, -16, -16, 32, 32, 4, colors.accent);
    innerChip.setAttribute('opacity', '0.3');
    for(let i = -12; i <= 12; i += 8) {
      createLine(g, i, -12, i, 12, colors.secondary, 1);
      createLine(g, -12, i, 12, i, colors.secondary, 1);
    }
  }
  
  if (c >= 4) {
    const pinPositions = [-20, -10, 0, 10, 20];
    pinPositions.forEach(pos => {
      createRect(g, pos - 2, -35, 4, 7, 1, colors.secondary);
      createRect(g, pos - 2, 28, 4, 7, 1, colors.secondary);
    });
  }
  
  if (c >= 5) {
    const glow = createCircle(g, 0, 0, 45, 'none', colors.accent, 2);
    glow.setAttribute('opacity', '0.2');
    glow.setAttribute('stroke-dasharray', '5,5');
  }
}

function generateFinanceIcon(g, colors, c) {
  const trendPath = 'M-35,20 L-15,5 L5,-5 L25,-20 L35,-30';
  createPath(g, trendPath, 'none', colors.primary, 4);
  createPath(g, 'M35,-30 L30,-25 L35,-35 L40,-30 Z', colors.primary);
  
  if (c >= 2) {
    createCircle(g, -35, 20, 5, colors.secondary);
    createCircle(g, -15, 5, 5, colors.secondary);
    createCircle(g, 5, -5, 5, colors.secondary);
    createCircle(g, 25, -20, 5, colors.secondary);
  }
  
  if (c >= 3) {
    const barHeights = [15, 25, 20, 35, 30];
    barHeights.forEach((h, i) => {
      const x = -30 + i * 15;
      const bar = createRect(g, x, 40 - h, 10, h, 2, colors.accent);
      bar.setAttribute('opacity', '0.6');
    });
  }
  
  if (c >= 4) {
    const progressCircle = createCircle(g, 0, 0, 50, 'none', colors.secondary, 3);
    progressCircle.setAttribute('stroke-dasharray', '100 314');
    progressCircle.setAttribute('opacity', '0.4');
  }
  
  if (c >= 5) {
    createPath(g, 'M-50,-50 L-40,-50 L-40,-40', 'none', colors.accent, 2);
    createPath(g, 'M50,-50 L40,-50 L40,-40', 'none', colors.accent, 2);
  }
}

function generateNatureIcon(g, colors, c) {
  const leafPath = 'M0,-35 Q15,-20 20,0 Q15,15 0,30 Q-15,15 -20,0 Q-15,-20 0,-35';
  createPath(g, leafPath, colors.primary, colors.primary, 2);
  
  if (c >= 2) {
    createPath(g, 'M0,-35 L0,30', 'none', colors.secondary, 2);
  }
  
  if (c >= 3) {
    createPath(g, 'M0,-15 Q10,-10 15,0', 'none', colors.secondary, 1.5);
    createPath(g, 'M0,-15 Q-10,-10 -15,0', 'none', colors.secondary, 1.5);
    createPath(g, 'M0,5 Q10,10 15,20', 'none', colors.secondary, 1.5);
    createPath(g, 'M0,5 Q-10,10 -15,20', 'none', colors.secondary, 1.5);
  }
  
  if (c >= 4) {
    const smallLeaf1 = 'M-25,-10 Q-20,-5 -18,5 Q-20,12 -25,18 Q-30,12 -32,5 Q-30,-5 -25,-10';
    createPath(g, smallLeaf1, colors.accent, colors.accent, 1.5);
    const smallLeaf2 = 'M25,-10 Q30,-5 32,5 Q30,12 25,18 Q20,12 18,5 Q20,-5 25,-10';
    createPath(g, smallLeaf2, colors.accent, colors.accent, 1.5);
  }
  
  if (c >= 5) {
    const bgCircle = createCircle(g, 0, 0, 55, colors.primary);
    bgCircle.setAttribute('opacity', '0.08');
  }
}

function generateFoodIcon(g, colors, c) {
  createPath(g, 'M-15,-30 L-15,30', 'none', colors.primary, 3);
  createPath(g, 'M-20,-30 L-20,-10', 'none', colors.primary, 2);
  createPath(g, 'M-10,-30 L-10,-10', 'none', colors.primary, 2);
  createPath(g, 'M15,-30 L15,30', 'none', colors.primary, 3);
  createPath(g, 'M15,-30 L20,-25 L15,-20 Z', colors.secondary);
  
  if (c >= 2) {
    const plate = createCircle(g, 0, 0, 45, 'none', colors.secondary, 2.5);
    plate.setAttribute('opacity', '0.4');
  }
  
  if (c >= 3) {
    const hatPath = 'M-18,-40 Q-18,-50 -10,-50 Q-10,-55 0,-55 Q10,-55 10,-50 Q18,-50 18,-40 L15,-35 L-15,-35 Z';
    createPath(g, hatPath, colors.accent, colors.accent, 2);
  }
  
  if (c >= 4) {
    createPath(g, 'M-5,-38 Q-3,-45 -5,-52', 'none', colors.accent, 1.5);
    createPath(g, 'M0,-40 Q2,-47 0,-54', 'none', colors.accent, 1.5);
    createPath(g, 'M5,-38 Q7,-45 5,-52', 'none', colors.accent, 1.5);
  }
  
  if (c >= 5) {
    const innerPlate = createCircle(g, 0, 0, 35, 'none', colors.primary, 1.5);
    innerPlate.setAttribute('opacity', '0.25');
    innerPlate.setAttribute('stroke-dasharray', '3,3');
  }
}

function generateLuxuryIcon(g, colors, c) {
  createPath(g, 'M-30,10 L-30,15 L30,15 L30,10 Z', colors.primary);
  createPath(g, 'M-30,10 L-20,-15 L-10,5', colors.primary);
  createPath(g, 'M-10,5 L0,-25 L10,5', colors.primary);
  createPath(g, 'M10,5 L20,-15 L30,10', colors.primary);
  
  if (c >= 2) {
    createCircle(g, -20, -15, 4, colors.accent);
    createCircle(g, 0, -25, 5, colors.accent);
    createCircle(g, 20, -15, 4, colors.accent);
  }
  
  if (c >= 3) {
    createPath(g, 'M0,-25 L5,-20 L0,-15 L-5,-20 Z', colors.secondary);
  }
  
  if (c >= 4) {
    createPath(g, 'M-30,12 L30,12', 'none', colors.accent, 2);
    for(let x = -25; x <= 25; x += 10) {
      createCircle(g, x, 12, 2, colors.secondary);
    }
  }
  
  if (c >= 5) {
    for(let angle = 0; angle < 360; angle += 45) {
      const rad = (angle * Math.PI) / 180;
      const x1 = Math.cos(rad) * 35;
      const y1 = Math.sin(rad) * 35 - 5;
      const x2 = Math.cos(rad) * 50;
      const y2 = Math.sin(rad) * 50 - 5;
      const line = createLine(g, x1, y1, x2, y2, colors.accent, 1.5);
      line.setAttribute('opacity', '0.3');
    }
  }
}

function generateCraftIcon(g, colors, c) {
  createPath(g, 'M-20,-10 L-20,30', 'none', colors.primary, 4);
  createRect(g, -30, -18, 20, 8, 1, colors.secondary);
  createPath(g, 'M10,25 L20,-20', 'none', colors.primary, 4);
  createCircle(g, 22, -24, 6, 'none', colors.secondary, 3);
  
  if (c >= 2) {
    createPath(g, 'M-20,20 L-16,20', 'none', colors.accent, 2);
    createPath(g, 'M14,10 L18,8', 'none', colors.accent, 2);
  }
  
  if (c >= 3) {
    const gearSmall = 'M30,20 L32,22 L35,21 L36,24 L39,25 L38,28 L40,30 L38,32 L39,35 L36,36 L35,39 L32,38 L30,40 L28,38 L25,39 L24,36 L21,35 L22,32 L20,30 L22,28 L21,25 L24,24 L25,21 L28,22 Z';
    createPath(g, gearSmall, colors.accent, colors.accent, 1.5);
  }
  
  if (c >= 4) {
    createCircle(g, -25, -14, 2, colors.accent);
    createCircle(g, -15, -14, 2, colors.accent);
    for(let y = 0; y < 20; y += 5) {
      createPath(g, `M-18,${y} L-16,${y}`, 'none', colors.secondary, 1);
    }
  }
  
  if (c >= 5) {
    const toolbox = createRect(g, -40, 35, 80, 12, 2, 'none', colors.primary, 2);
    toolbox.setAttribute('opacity', '0.3');
  }
}

function generateLegalIcon(g, colors, c) {
  createPath(g, 'M0,-30 L0,30', 'none', colors.primary, 3);
  createPath(g, 'M-35,-15 L35,-15', 'none', colors.primary, 3);
  createPath(g, 'M-35,-15 L-40,-10 L-30,-10 Z', colors.secondary);
  createPath(g, 'M35,-15 L40,-10 L30,-10 Z', colors.secondary);
  
  if (c >= 2) {
    createPath(g, 'M-35,-15 L-35,-20', 'none', colors.accent, 2);
    createPath(g, 'M35,-15 L35,-20', 'none', colors.accent, 2);
  }
  
  if (c >= 3) {
    createRect(g, -20, 30, 40, 5, 2, colors.primary);
    createPath(g, 'M-5,-30 L-5,30', 'none', colors.secondary, 1.5);
    createPath(g, 'M5,-30 L5,30', 'none', colors.secondary, 1.5);
  }
  
  if (c >= 4) {
    createRect(g, -8, -32, 16, 4, 1, colors.accent);
    createCircle(g, -35, -12, 3, colors.accent);
    createCircle(g, 35, -12, 3, colors.accent);
  }
  
  if (c >= 5) {
    createPath(g, 'M-40,0 Q-45,-15 -35,-25', 'none', colors.accent, 2);
    createPath(g, 'M40,0 Q45,-15 35,-25', 'none', colors.accent, 2);
    const shield = 'M0,-35 L20,-30 L20,0 Q20,15 0,25 Q-20,15 -20,0 L-20,-30 Z';
    const shieldEl = createPath(g, shield, 'none', colors.primary, 2);
    shieldEl.setAttribute('opacity', '0.15');
  }
}

function generateMedicalIcon(g, colors, c) {
  createRect(g, -6, -30, 12, 60, 2, colors.primary);
  createRect(g, -30, -6, 60, 12, 2, colors.primary);
  
  if (c >= 2) {
    const heartbeat = 'M-35,0 L-25,0 L-20,-15 L-15,15 L-10,-10 L-5,0 L35,0';
    createPath(g, heartbeat, 'none', colors.accent, 2.5);
  }
  
  if (c >= 3) {
    createCircle(g, 0, 0, 45, 'none', colors.secondary, 3);
  }
  
  if (c >= 4) {
    createPath(g, 'M-3,-30 Q-10,-15 -3,0 Q4,15 -3,30', 'none', colors.accent, 2);
    createPath(g, 'M3,-30 Q10,-15 3,0 Q-4,15 3,30', 'none', colors.accent, 2);
  }
  
  if (c >= 5) {
    for(let i = 0; i < 4; i++) {
      const angle = (i * 90 * Math.PI) / 180;
      const x = Math.cos(angle) * 50;
      const y = Math.sin(angle) * 50;
      createCircle(g, x, y, 3, colors.secondary);
    }
  }
}

function generateMediaIcon(g, colors, c) {
  createPath(g, 'M-15,-25 L-15,25 L25,0 Z', colors.primary);
  
  if (c >= 2) {
    createRect(g, -35, -30, 70, 60, 4, 'none', colors.secondary, 3);
  }
  
  if (c >= 3) {
    const perfPositions = [-25, -15, -5, 5, 15, 25];
    perfPositions.forEach(y => {
      createRect(g, -38, y - 2, 3, 4, 1, colors.accent);
      createRect(g, 35, y - 2, 3, 4, 1, colors.accent);
    });
  }
  
  if (c >= 4) {
    const lens1 = createCircle(g, 0, 0, 35, 'none', colors.accent, 2);
    const lens2 = createCircle(g, 0, 0, 28, 'none', colors.accent, 1.5);
    lens1.setAttribute('opacity', '0.3');
    lens2.setAttribute('opacity', '0.3');
  }
  
  if (c >= 5) {
    for(let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180;
      const x1 = Math.cos(angle) * 20;
      const y1 = Math.sin(angle) * 20;
      const x2 = Math.cos(angle) * 30;
      const y2 = Math.sin(angle) * 30;
      const blade = createLine(g, x1, y1, x2, y2, colors.secondary, 2.5);
      blade.setAttribute('opacity', '0.4');
    }
  }
}

function generateEducationIcon(g, colors, c) {
  createPath(g, 'M-40,-10 L0,-25 L40,-10 L0,5 Z', colors.primary);
  createPath(g, 'M0,-25 L0,-35', 'none', colors.accent, 2);
  createCircle(g, 0, -37, 3, colors.accent);
  
  if (c >= 2) {
    createRect(g, -25, 5, 50, 35, 2, colors.secondary);
    createPath(g, 'M-25,5 L-25,40', 'none', colors.primary, 3);
  }
  
  if (c >= 3) {
    for(let y = 10; y < 40; y += 5) {
      createPath(g, `M-23,${y} L23,${y}`, 'none', colors.accent, 1);
    }
  }
  
  if (c >= 4) {
    const orbit1 = createEllipse(g, 0, -5, 30, 15, 45, colors.accent, 1.5);
    const orbit2 = createEllipse(g, 0, -5, 30, 15, -45, colors.accent, 1.5);
    orbit1.setAttribute('opacity', '0.4');
    orbit2.setAttribute('opacity', '0.4');
    createCircle(g, 0, -5, 4, colors.primary);
  }
  
  if (c >= 5) {
    const bulb = 'M-8,-45 Q-8,-55 0,-55 Q8,-55 8,-45 L8,-40 Q8,-38 6,-38 L-6,-38 Q-8,-38 -8,-40 Z';
    const bulbEl = createPath(g, bulb, colors.accent, colors.accent, 1.5);
    bulbEl.setAttribute('opacity', '0.6');
  }
}

function generateEcommerceIcon(g, colors, c) {
  createPath(g, 'M-30,-10 L-25,-10 L-10,20 L20,20', 'none', colors.primary, 3);
  createRect(g, -10, -10, 30, 20, 2, 'none', colors.primary, 3);
  createCircle(g, -5, 25, 4, colors.secondary);
  createCircle(g, 15, 25, 4, colors.secondary);
  
  if (c >= 2) {
    createRect(g, -5, -8, 8, 8, 1, colors.accent);
    createRect(g, 5, -5, 8, 8, 1, colors.accent);
  }
  
  if (c >= 3) {
    createRect(g, 22, -15, 20, 12, 2, colors.secondary);
    createPath(g, 'M24,-10 L40,-10', 'none', colors.accent, 1.5);
  }
  
  if (c >= 4) {
    createPath(g, 'M-35,-25 L-25,-25 L-20,-30 L-25,-35 L-35,-35 Z', colors.accent);
    createCircle(g, -30, -30, 2, colors.primary);
    createPath(g, 'M25,-35 L25,-20 Q25,-15 30,-15 L40,-15 Q45,-15 45,-20 L45,-35 Z', 'none', colors.secondary, 2);
  }
  
  if (c >= 5) {
    createRect(g, -45, 10, 15, 15, 1, 'none', colors.accent, 2);
    createPath(g, 'M-37.5,10 L-37.5,25', 'none', colors.accent, 1.5);
    createPath(g, 'M-45,17.5 L-30,17.5', 'none', colors.accent, 1.5);
  }
}

function generateRealEstateIcon(g, colors, c) {
  createPath(g, 'M-35,0 L0,-30 L35,0', 'none', colors.primary, 4);
  createRect(g, -30, 0, 60, 35, 2, colors.secondary);
  createRect(g, -8, 15, 16, 20, 2, colors.accent);
  
  if (c >= 2) {
    createRect(g, -22, 8, 10, 10, 1, colors.primary);
    createRect(g, 12, 8, 10, 10, 1, colors.primary);
    createPath(g, 'M-17,8 L-17,18', 'none', colors.secondary, 1);
    createPath(g, 'M-22,13 L-12,13', 'none', colors.secondary, 1);
    createPath(g, 'M17,8 L17,18', 'none', colors.secondary, 1);
    createPath(g, 'M12,13 L22,13', 'none', colors.secondary, 1);
  }
  
  if (c >= 3) {
    createRect(g, 15, -25, 8, 15, 1, colors.primary);
    createPath(g, 'M19,-10 Q17,-15 19,-20', 'none', colors.accent, 1.5);
  }
  
  if (c >= 4) {
    createCircle(g, 0, -5, 5, 'none', colors.accent, 2);
    createPath(g, 'M5,-5 L15,-5 L15,-3 L12,-3 L12,-7 L15,-7', 'none', colors.accent, 2);
  }
  
  if (c >= 5) {
    const boundary = createRect(g, -45, -40, 90, 80, 3, 'none', colors.primary, 2);
    boundary.setAttribute('opacity', '0.2');
    boundary.setAttribute('stroke-dasharray', '5,5');
  }
}

function generateTravelIcon(g, colors, c) {
  createPath(g, 'M-30,0 L30,0', 'none', colors.primary, 4);
  createPath(g, 'M-10,-5 L-10,-25 L10,-15 L10,-5', colors.secondary);
  createPath(g, 'M-5,0 L-15,20 L5,15 L5,0', colors.secondary);
  createPath(g, 'M20,0 L25,-15 L30,0', colors.accent);
  
  if (c >= 2) {
    for(let x = -20; x < 20; x += 8) {
      createCircle(g, x, 0, 2.5, colors.accent);
    }
  }
  
  if (c >= 3) {
    const globe = createCircle(g, 0, 0, 45, 'none', colors.primary, 2);
    globe.setAttribute('opacity', '0.3');
    createPath(g, 'M-45,0 L45,0', 'none', colors.secondary, 1);
    createPath(g, 'M-40,-15 L40,-15', 'none', colors.secondary, 1);
    createPath(g, 'M-40,15 L40,15', 'none', colors.secondary, 1);
  }
  
  if (c >= 4) {
    createPath(g, 'M0,-50 L0,-45 M0,45 L0,50', 'none', colors.accent, 2);
    createPath(g, 'M-50,0 L-45,0 M45,0 L50,0', 'none', colors.accent, 2);
  }
  
  if (c >= 5) {
    const flightPath = 'M-50,-20 Q-25,-30 0,-15 Q25,-25 50,-10';
    const pathEl = createPath(g, flightPath, 'none', colors.accent, 2);
    pathEl.setAttribute('stroke-dasharray', '5,3');
    pathEl.setAttribute('opacity', '0.5');
  }
}

function generateCryptoIcon(g, colors, c) {
  createPath(g, 'M0,-35 L30,-17.5 L30,17.5 L0,35 L-30,17.5 L-30,-17.5 Z', 'none', colors.primary, 3);
  createPath(g, 'M0,-20 L17,-10 L17,10 L0,20 L-17,10 L-17,-10 Z', colors.secondary);
  
  if (c >= 2) {
    createCircle(g, 0, -35, 4, colors.accent);
    createCircle(g, 30, -17.5, 4, colors.accent);
    createCircle(g, 30, 17.5, 4, colors.accent);
    createCircle(g, 0, 35, 4, colors.accent);
    createCircle(g, -30, 17.5, 4, colors.accent);
    createCircle(g, -30, -17.5, 4, colors.accent);
  }
  
  if (c >= 3) {
    createPath(g, 'M-17,-10 L17,-10', 'none', colors.accent, 1.5);
    createPath(g, 'M-17,10 L17,10', 'none', colors.accent, 1.5);
    createPath(g, 'M0,-20 L0,-35', 'none', colors.accent, 1.5);
    createPath(g, 'M0,20 L0,35', 'none', colors.accent, 1.5);
  }
  
  if (c >= 4) {
    const binary = ['1', '0', '1', '1', '0', '1'];
    binary.forEach((bit, i) => {
      const angle = (i * 60 * Math.PI) / 180;
      const x = Math.cos(angle) * 25;
      const y = Math.sin(angle) * 25;
      createText(g, x, y, bit, colors.accent, 8);
    });
  }
  
  if (c >= 5) {
    const outerRing = createCircle(g, 0, 0, 50, 'none', colors.primary, 2);
    outerRing.setAttribute('opacity', '0.3');
    outerRing.setAttribute('stroke-dasharray', '10,5');
  }
}

function generateFitnessIcon(g, colors, c) {
  createRect(g, -25, -3, 50, 6, 2, colors.primary);
  createRect(g, -35, -12, 10, 24, 2, colors.secondary);
  createRect(g, -40, -10, 5, 20, 1, colors.accent);
  createRect(g, 25, -12, 10, 24, 2, colors.secondary);
  createRect(g, 35, -10, 5, 20, 1, colors.accent);
  
  if (c >= 2) {
    createPath(g, 'M-15,-25 L-10,-25 L-5,-35 L0,-15 L5,-30 L10,-25 L15,-25', 'none', colors.accent, 2.5);
  }
  
  if (c >= 3) {
    const ring1 = createCircle(g, 0, 0, 45, 'none', colors.accent, 3);
    ring1.setAttribute('stroke-dasharray', '100 283');
    ring1.setAttribute('opacity', '0.4');
  }
  
  if (c >= 4) {
    createPath(g, 'M-25,15 Q-30,20 -25,30 Q-20,35 -10,30 Q0,25 0,15', colors.secondary, colors.secondary, 2);
  }
  
  if (c >= 5) {
    for(let r = 55; r > 35; r -= 10) {
      const zone = createCircle(g, 0, 0, r, 'none', colors.primary, 1);
      zone.setAttribute('opacity', '0.15');
    }
  }
}

function generateBeautyIcon(g, colors, c) {
  createRect(g, -6, -10, 12, 35, 2, colors.primary);
  createPath(g, 'M-6,-10 L-3,-20 L3,-20 L6,-10', colors.accent);
  
  if (c >= 2) {
    createCircle(g, 20, -15, 18, 'none', colors.secondary, 3);
    createPath(g, 'M20,3 L20,20', 'none', colors.secondary, 3);
  }
  
  if (c >= 3) {
    for(let i = 0; i < 5; i++) {
      const angle = (i * 72 * Math.PI) / 180;
      const x = Math.cos(angle) * 35 - 15;
      const y = Math.sin(angle) * 35;
      createCircle(g, x, y, 6, colors.accent);
    }
    createCircle(g, -15, 0, 5, colors.primary);
  }
  
  if (c >= 4) {
    createPath(g, 'M-35,-25 L-25,-15', 'none', colors.primary, 3);
    createPath(g, 'M-35,-25 Q-38,-28 -35,-31 Q-32,-28 -35,-25', colors.accent);
  }
  
  if (c >= 5) {
    const sparklePositions = [[25, -35], [-5, -30], [35, 5], [-30, 20]];
    sparklePositions.forEach(([x, y]) => {
      createPath(g, `M${x},${y-4} L${x},${y+4} M${x-4},${y} L${x+4},${y}`, 'none', colors.accent, 1.5);
    });
  }
}

function generateNonprofitIcon(g, colors, c) {
  createPath(g, 'M0,10 L-20,-10 Q-25,-20 -15,-25 Q-5,-25 0,-15 Q5,-25 15,-25 Q25,-20 20,-10 Z', colors.primary);
  
  if (c >= 2) {
    createPath(g, 'M-35,15 L-30,10 L-25,15 L-30,20', 'none', colors.secondary, 3);
    createPath(g, 'M35,15 L30,10 L25,15 L30,20', 'none', colors.secondary, 3);
  }
  
  if (c >= 3) {
    const supportCircle = createCircle(g, 0, 0, 45, 'none', colors.accent, 2.5);
    supportCircle.setAttribute('opacity', '0.4');
  }
  
  if (c >= 4) {
    createCircle(g, -25, -30, 4, colors.accent);
    createCircle(g, 0, -35, 4, colors.accent);
    createCircle(g, 25, -30, 4, colors.accent);
    createPath(g, 'M-25,-26 L-25,-15 M-30,-20 L-20,-20', 'none', colors.accent, 2);
    createPath(g, 'M0,-31 L0,-20 M-5,-25 L5,-25', 'none', colors.accent, 2);
    createPath(g, 'M25,-26 L25,-15 M20,-20 L30,-20', 'none', colors.accent, 2);
  }
  
  if (c >= 5) {
    createPath(g, 'M-5,25 L-5,40 Q-5,45 0,45 Q5,45 5,40 L5,25 Q5,20 0,25 Q-5,20 -5,25', colors.secondary, colors.secondary, 2);
  }
}

function generateStartupIcon(g, colors, c) {
  createPath(g, 'M0,-35 L-12,-5 L-12,20 L12,20 L12,-5 Z', colors.primary);
  createPath(g, 'M0,-35 L-12,-5 L12,-5 Z', colors.secondary);
  createPath(g, 'M-12,10 L-25,25 L-12,20', colors.accent);
  createPath(g, 'M12,10 L25,25 L12,20', colors.accent);
  
  if (c >= 2) {
    createCircle(g, 0, 5, 5, colors.accent);
  }
  
  if (c >= 3) {
    createPath(g, 'M-8,20 Q-10,30 -5,35', 'none', colors.accent, 3);
    createPath(g, 'M0,20 Q0,32 0,40', 'none', colors.secondary, 3);
    createPath(g, 'M8,20 Q10,30 5,35', 'none', colors.accent, 3);
  }
  
  if (c >= 4) {
    const starPositions = [[-30, -25], [30, -20], [-35, 5], [35, 0]];
    starPositions.forEach(([x, y]) => {
      createStar(g, x, y, 3, colors.accent);
    });
  }
  
  if (c >= 5) {
    const trajectory = 'M0,40 Q-20,20 -30,0 Q-35,-15 -30,-30';
    const trajEl = createPath(g, trajectory, 'none', colors.secondary, 2);
    trajEl.setAttribute('stroke-dasharray', '5,5');
    trajEl.setAttribute('opacity', '0.4');
    createPath(g, 'M15,30 L20,25 L25,20 L30,10', 'none', colors.accent, 2);
  }
}

// ============================================
// SVG Helper Functions
// ============================================

function createRect(parent, x, y, width, height, rx, fill = null, stroke = null, strokeWidth = 0) {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', width);
  rect.setAttribute('height', height);
  if (rx) rect.setAttribute('rx', rx);
  if (fill) rect.setAttribute('fill', fill);
  if (stroke) {
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', strokeWidth);
  }
  if (!fill && !stroke) rect.setAttribute('fill', 'currentColor');
  parent.appendChild(rect);
  return rect;
}

function createCircle(parent, cx, cy, r, fill = null, stroke = null, strokeWidth = 0) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', r);
  if (fill) circle.setAttribute('fill', fill);
  if (stroke) {
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', strokeWidth);
    if (!fill) circle.setAttribute('fill', 'none');
  }
  if (!fill && !stroke) circle.setAttribute('fill', 'currentColor');
  parent.appendChild(circle);
  return circle;
}

function createPath(parent, d, fill = null, stroke = null, strokeWidth = 2) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  if (fill) path.setAttribute('fill', fill);
  if (stroke) {
    path.setAttribute('stroke', stroke);
    path.setAttribute('stroke-width', strokeWidth);
    if (!fill) path.setAttribute('fill', 'none');
  }
  if (!fill && !stroke) path.setAttribute('fill', 'currentColor');
  parent.appendChild(path);
  return path;
}

function createLine(parent, x1, y1, x2, y2, stroke, strokeWidth = 2) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', stroke);
  line.setAttribute('stroke-width', strokeWidth);
  parent.appendChild(line);
  return line;
}

function createEllipse(parent, cx, cy, rx, ry, rotation, stroke, strokeWidth) {
  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
  ellipse.setAttribute('cx', cx);
  ellipse.setAttribute('cy', cy);
  ellipse.setAttribute('rx', rx);
  ellipse.setAttribute('ry', ry);
  ellipse.setAttribute('transform', `rotate(${rotation} ${cx} ${cy})`);
  ellipse.setAttribute('fill', 'none');
  ellipse.setAttribute('stroke', stroke);
  ellipse.setAttribute('stroke-width', strokeWidth);
  parent.appendChild(ellipse);
  return ellipse;
}

function createText(parent, x, y, content, fill, fontSize) {
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y);
  text.setAttribute('fill', fill);
  text.setAttribute('font-size', fontSize);
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('dominant-baseline', 'middle');
  text.setAttribute('font-weight', 'bold');
  text.textContent = content;
  parent.appendChild(text);
  return text;
}

function createStar(parent, cx, cy, size, fill) {
  const points = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 144 - 90) * Math.PI / 180;
    const x = cx + Math.cos(angle) * size;
    const y = cy + Math.sin(angle) * size;
    points.push(`${x},${y}`);
  }
  const star = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  star.setAttribute('points', points.join(' '));
  star.setAttribute('fill', fill);
  parent.appendChild(star);
  return star;
}

// ============================================
// Brand Name Update
// ============================================

function updateBrandName() {
  const display = document.getElementById('brandNameDisplay');
  let text = state.brandName;
  
  switch(state.textCase) {
    case 'upper':
      text = text.toUpperCase();
      break;
    case 'lower':
      text = text.toLowerCase();
      break;
    case 'title':
      text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      break;
  }
  
  display.textContent = text;
  
  if (state.logoType === 'icon') {
    display.style.display = 'none';
  } else {
    display.style.display = 'block';
  }
}

// ============================================
// Preview Updates
// ============================================

function updatePreviews() {
  const svg = document.getElementById('logoPreview');
  const svgClone = svg.cloneNode(true);
  
  const preview1 = document.getElementById('preview1');
  preview1.innerHTML = '';
  preview1.appendChild(createPreviewContainer(svgClone.cloneNode(true), true));
  
  const preview2 = document.getElementById('preview2');
  preview2.innerHTML = '';
  preview2.appendChild(createPreviewContainer(svgClone.cloneNode(true), false));
  
  const preview3 = document.getElementById('preview3');
  preview3.innerHTML = '';
  preview3.appendChild(createPreviewContainer(svgClone.cloneNode(true), true));
  
  const preview4 = document.getElementById('preview4');
  preview4.innerHTML = '';
  const iconOnly = svg.cloneNode(true);
  iconOnly.setAttribute('width', '100');
  iconOnly.setAttribute('height', '100');
  preview4.appendChild(iconOnly);
  
  const preview5 = document.getElementById('preview5');
  preview5.innerHTML = '';
  preview5.appendChild(createPreviewContainer(svgClone.cloneNode(true), false, true));
  
  const preview6 = document.getElementById('preview6');
  preview6.innerHTML = '';
  preview6.appendChild(createPreviewContainer(svgClone.cloneNode(true), false, false, true));
}

function createPreviewContainer(svg, isDark, isSmall = false, isStacked = false) {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.gap = isStacked ? '12px' : '16px';
  container.style.flexDirection = isStacked ? 'column' : 'row';
  
  const size = isSmall ? '60' : '80';
  svg.setAttribute('width', size);
  svg.setAttribute('height', size);
  
  if (state.logoType === 'combination') {
    container.appendChild(svg);
    
    const brandName = document.createElement('div');
    brandName.textContent = state.brandName;
    brandName.style.fontSize = isSmall ? '16px' : '20px';
    brandName.style.fontWeight = '800';
    brandName.style.color = isDark ? '#FAFAFA' : '#1A1A1A';
    container.appendChild(brandName);
  } else {
    container.appendChild(svg);
  }
  
  return container;
}

// ============================================
// Export Functions
// ============================================

function copySVG() {
  const svg = document.getElementById('logoPreview');
  const svgData = new XMLSerializer().serializeToString(svg);
  
  navigator.clipboard.writeText(svgData).then(() => {
    showNotification('SVG code copied to clipboard!');
  }).catch(() => {
    showNotification('Failed to copy SVG', 'error');
  });
}

function downloadLogo() {
  const svg = document.getElementById('logoPreview');
  const svgData = new XMLSerializer().serializeToString(svg);
  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${state.brandName.toLowerCase().replace(/\s+/g, '-')}-logo.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showNotification('Logo downloaded successfully!');
}

// ============================================
// Notification System
// ============================================

function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.style.background = type === 'success' ? '#10b981' : '#ef4444';
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
