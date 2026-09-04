(function () {
  'use strict';
  var root = document.documentElement;
  var NS = 'http://www.w3.org/2000/svg';

  /* The source date is the 4:00 p.m. US Eastern market close. */
  (function localizeMarketDate() {
    var el = document.querySelector('[data-market-date]');
    if (!el || !window.Intl) return;
    var value = el.getAttribute('data-market-date') || '';
    var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return;
    try {
      var y = +match[1], mo = +match[2], d = +match[3];
      var nyFmt = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York', hour12: false,
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
      var guess = Date.UTC(y, mo - 1, d, 20, 0, 0);
      for (var i = 0; i < 3; i++) {
        var parts = {};
        nyFmt.formatToParts(new Date(guess)).forEach(function (part) { parts[part.type] = part.value; });
        var wall = Date.UTC(+parts.year, +parts.month - 1, +parts.day, (+parts.hour) % 24, +parts.minute, +parts.second);
        guess = Date.UTC(y, mo - 1, d, 16, 0, 0) - (wall - guess);
      }
      var local = new Intl.DateTimeFormat(undefined, {
        year: 'numeric', month: 'short', day: 'numeric', timeZoneName: 'short'
      }).format(new Date(guess));
      var span = document.createElement('span');
      span.className = 'local-market-date';
      span.textContent = document.documentElement.lang === 'en'
        ? ' · Your local time: ' + local
        : ' · 您當地時間：' + local;
      el.appendChild(span);
    } catch (e) {}
  })();

  /* ---------- chrome: theme toggle / back-to-top / tooltip ---------- */
  var themeBtn = document.createElement('button');
  themeBtn.type = 'button';
  themeBtn.className = 'theme-toggle';
  themeBtn.setAttribute('aria-label', '切換深色/淺色模式');
  themeBtn.title = '切換深色/淺色模式';
  document.body.appendChild(themeBtn);

  var backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'back-to-top';
  backBtn.setAttribute('aria-label', '回到頂部');
  backBtn.title = '回到頂部';
  backBtn.textContent = '↑';
  document.body.appendChild(backBtn);

  var tooltip = document.createElement('div');
  tooltip.className = 'chart-tooltip';
  document.body.appendChild(tooltip);

  /* ---------- theme ---------- */
  var THEME_KEY = 'report-theme';
  function systemPrefersDark() {
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.textContent = t === 'dark' ? '☀' : '☾';
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }
  var savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  if (savedTheme === 'dark' || savedTheme === 'light') {
    setTheme(savedTheme);
  } else {
    themeBtn.textContent = systemPrefersDark() ? '☀' : '☾';
  }
  themeBtn.addEventListener('click', function () {
    var current = root.getAttribute('data-theme') || (systemPrefersDark() ? 'dark' : 'light');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Fumadocs-style report sidebar ---------- */
  (function sidebarToggle() {
    var shell = document.querySelector('.report-layout');
    var toggle = document.querySelector('[data-sidebar-toggle]');
    if (!shell || !toggle) return;
    var SIDEBAR_KEY = 'report-sidebar-collapsed';
    function setCollapsed(collapsed) {
      shell.classList.toggle('sidebar-collapsed', collapsed);
      document.body.classList.toggle('report-sidebar-collapsed', collapsed);
      shell.setAttribute('data-sidebar-state', collapsed ? 'collapsed' : 'expanded');
      toggle.setAttribute('aria-expanded', String(!collapsed));
      toggle.setAttribute('aria-label', collapsed ? '展開報告版本' : '收起報告版本');
      toggle.title = collapsed ? '展開報告版本' : '收起報告版本';
      toggle.innerHTML = '<span aria-hidden="true">' + (collapsed ? '›' : '‹') + '</span>';
    }
    var saved = null;
    try { saved = localStorage.getItem(SIDEBAR_KEY); } catch (e) {}
    setCollapsed(saved === 'true');
    toggle.addEventListener('click', function () {
      var collapsed = !shell.classList.contains('sidebar-collapsed');
      setCollapsed(collapsed);
      try { localStorage.setItem(SIDEBAR_KEY, String(collapsed)); } catch (e) {}
    });
  })();

  /* ---------- back to top ---------- */
  window.addEventListener('scroll', function () {
    if (window.scrollY > 500) backBtn.classList.add('visible');
    else backBtn.classList.remove('visible');
  }, { passive: true });
  backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- remove legacy price SVGs ----------
     Price charts are rendered by the React/Lightweight Charts components.
     Older editions contain hand-authored SVG price figures; remove only
     figures attached to a price/K-line heading so analytical SVGs remain. */
  (function removeLegacyPriceCharts() {
    var content = document.querySelector('.report-content');
    if (!content) return;
    var ticker = document.querySelector('.ticker-name span');
    if (ticker && ticker.textContent.trim() === 'TSLA') {
      Array.prototype.forEach.call(content.querySelectorAll('figure svg'), function (svg) {
        if (svg.parentNode) svg.parentNode.remove();
      });
    }
    var headings = Array.prototype.slice.call(content.querySelectorAll('h2, h3'));
    headings.forEach(function (heading) {
      var label = (heading.textContent || '').toLowerCase();
      if (!/(股價走勢|股價趨勢|k 線|k線|closing-price trend|candlestick chart)/.test(label)) return;
      var node = heading.nextElementSibling;
      while (node) {
        var next = node.nextElementSibling;
        if (node.tagName === 'H2' || node.tagName === 'H3') break;
        if (node.tagName === 'FIGURE' && node.querySelector('svg')) node.remove();
        node = next;
      }
      heading.remove();
    });
  })();

  /* ---------- collapsible sections + TOC ---------- */
  var body = document.querySelector('.report-content') || document.body;
  var sections = [];
  (function buildSections() {
    var kids = Array.prototype.slice.call(body.children);
    var current = null;
    var counter = 0;
    kids.forEach(function (el) {
      if (el.tagName === 'H2') {
        counter++;
        var id = el.getAttribute('data-anchor') || ('section-' + counter);
        el.id = id;
        el.classList.add('collapsible');
        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        var wrap = document.createElement('div');
        wrap.className = 'section-body';
        el.parentNode.insertBefore(wrap, el.nextSibling);
        current = wrap;
        sections.push({ h2: el, wrap: wrap, id: id });
      } else if (el.classList && (el.classList.contains('report-footer') || el.classList.contains('ad-slot') || el.classList.contains('related-report'))) {
        current = null;
      } else if (current) {
        current.appendChild(el);
      }
    });
  })();

  sections.forEach(function (s) {
    function toggle() {
      var collapsed = s.h2.classList.toggle('collapsed');
      s.wrap.classList.toggle('collapsed', collapsed);
    }
    s.h2.addEventListener('click', toggle);
    s.h2.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter' || evt.key === ' ') { evt.preventDefault(); toggle(); }
    });
  });

  if (sections.length) {
    var toc = document.createElement('nav');
    toc.className = 'report-toc';
    toc.setAttribute('aria-label', '章節導覽');
    sections.forEach(function (s) {
      var a = document.createElement('a');
      a.href = '#' + s.id;
      a.textContent = s.h2.textContent;
      toc.appendChild(a);
    });
    body.appendChild(toc);

    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          var link = toc.querySelector('a[href="#' + entry.target.id + '"]');
          if (!link) return;
          if (entry.isIntersecting) {
            Array.prototype.forEach.call(toc.querySelectorAll('a'), function (l) { l.classList.remove('active'); });
            link.classList.add('active');
          }
        });
      }, { rootMargin: '-10% 0px -70% 0px', threshold: 0 });
      sections.forEach(function (s) { io.observe(s.h2); });
    }
  }

  /* ---------- chart interactivity ---------- */
  function parseNumber(str) {
    var m = String(str).replace(/[, ]/g, '').match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : null;
  }
  function formatLike(sample, value) {
    var prefix = /^\s*\$/.test(sample) ? '$' : '';
    var suffix = /%\s*$/.test(sample) ? '%' : '';
    var decimals = (sample.split('.')[1] || '').replace(/[^\d]/g, '').length;
    return prefix + value.toFixed(Math.min(decimals, 2)) + suffix;
  }
  function positionTooltip(evt) {
    var tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
    var left = evt.clientX + 14, top = evt.clientY - th - 10;
    if (left + tw > window.innerWidth - 8) left = evt.clientX - tw - 14;
    if (top < 8) top = evt.clientY + 14;
    tooltip.style.left = left + 'px';
    tooltip.style.top = top + 'px';
  }

  Array.prototype.forEach.call(document.querySelectorAll('figure svg'), setupChart);

  function setupChart(svg) {
    var children = Array.prototype.slice.call(svg.children);
    var gridLines = children.filter(function (el) {
      return el.tagName === 'line' && el.getAttribute('y1') === el.getAttribute('y2') &&
        (el.getAttribute('stroke') || '').toLowerCase() === '#e8e7e1';
    });
    var yTexts = children.filter(function (el) {
      return el.tagName === 'text' && el.getAttribute('text-anchor') === 'end';
    });
    var yCal = [];
    gridLines.forEach(function (line) {
      var y = parseFloat(line.getAttribute('y1'));
      var match = yTexts.filter(function (t) { return Math.abs(parseFloat(t.getAttribute('y')) - y) < 6; })[0];
      if (match) {
        var v = parseNumber(match.textContent);
        if (v !== null) yCal.push({ y: y, v: v, sample: match.textContent });
      }
    });
    yCal.sort(function (a, b) { return a.y - b.y; });

    var polylines = children.filter(function (el) { return el.tagName === 'polyline'; });
    var rects = children.filter(function (el) {
      return el.tagName === 'rect' && el.hasAttribute('rx') &&
        (parseFloat(el.getAttribute('width')) > 16 || parseFloat(el.getAttribute('height')) > 16);
    });

    setupLegendToggle(svg, children, polylines, rects);

    if (yCal.length >= 2 && polylines.length) setupLineTooltip(svg, children, polylines, yCal);
    if (rects.length) setupBarTooltip(rects, children);
    setupCandlestickTooltip(svg);
  }

  function setupCandlestickTooltip(svg) {
    var candles = svg.querySelectorAll('g.candle');
    if (!candles.length) return;
    Array.prototype.forEach.call(candles, function (g) {
      g.addEventListener('mouseenter', function () {
        g.style.filter = 'brightness(1.2)';
        var date = g.getAttribute('data-date');
        var o = g.getAttribute('data-o'), h = g.getAttribute('data-h'),
            l = g.getAttribute('data-l'), c = g.getAttribute('data-c');
        tooltip.innerHTML = '<div class="tt-x">' + date + '</div>' +
          '<div class="tt-row">開 $' + o + '　高 $' + h + '</div>' +
          '<div class="tt-row">低 $' + l + '　收 $' + c + '</div>';
        tooltip.classList.add('visible');
      });
      g.addEventListener('mousemove', positionTooltip);
      g.addEventListener('mouseleave', function () {
        g.style.filter = '';
        tooltip.classList.remove('visible');
      });
    });
  }

  function valueFromY(y, yCal) {
    var lo = yCal[0], hi = yCal[yCal.length - 1];
    for (var i = 0; i < yCal.length - 1; i++) {
      if (y <= yCal[i].y && y >= yCal[i + 1].y) { lo = yCal[i + 1]; hi = yCal[i]; break; }
      if (y >= yCal[i].y && y <= yCal[i + 1].y) { lo = yCal[i]; hi = yCal[i + 1]; break; }
    }
    if (hi.y === lo.y) return lo.v;
    var t = (y - lo.y) / (hi.y - lo.y);
    return lo.v + t * (hi.v - lo.v);
  }

  function legendNameByColor(svg, color) {
    return (svg.__legendMap && svg.__legendMap[color.toLowerCase()]) || '';
  }

  function setupLineTooltip(svg, children, polylines, yCal) {
    var baselineY = yCal[yCal.length - 1].y;
    var xTexts = children.filter(function (el) {
      return el.tagName === 'text' && el.getAttribute('text-anchor') === 'middle' &&
        parseFloat(el.getAttribute('y')) > baselineY + 5 && parseFloat(el.getAttribute('y')) < baselineY + 30;
    });
    var xCal = xTexts.map(function (t) {
      return { x: parseFloat(t.getAttribute('x')), label: t.textContent };
    }).sort(function (a, b) { return a.x - b.x; });

    var seriesData = polylines.map(function (pl) {
      var pts = pl.getAttribute('points').trim().split(/\s+/).map(function (p) {
        var xy = p.split(',');
        return { x: parseFloat(xy[0]), y: parseFloat(xy[1]) };
      });
      var color = pl.getAttribute('stroke') || '#1B365D';
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', '3.5');
      dot.setAttribute('fill', color);
      dot.setAttribute('stroke', '#f5f4ed');
      dot.setAttribute('stroke-width', '1.2');
      dot.setAttribute('class', 'chart-crosshair');
      dot.style.display = 'none';
      svg.appendChild(dot);
      return { pts: pts, color: color, dot: dot, name: legendNameByColor(svg, color) };
    });

    var allX = [];
    seriesData.forEach(function (s) { s.pts.forEach(function (p) { if (allX.indexOf(p.x) === -1) allX.push(p.x); }); });
    if (!allX.length) return;

    var crosshair = document.createElementNS(NS, 'line');
    crosshair.setAttribute('class', 'chart-crosshair');
    crosshair.setAttribute('stroke', '#6b6a64');
    crosshair.setAttribute('stroke-width', '0.8');
    crosshair.setAttribute('stroke-dasharray', '2 2');
    crosshair.setAttribute('y1', yCal[0].y);
    crosshair.setAttribute('y2', yCal[yCal.length - 1].y);
    crosshair.style.display = 'none';
    svg.insertBefore(crosshair, svg.firstChild.nextSibling);

    function xToLabel(x) {
      if (!xCal.length) return '';
      if (x <= xCal[0].x) return xCal[0].label;
      if (x >= xCal[xCal.length - 1].x) return xCal[xCal.length - 1].label;
      for (var i = 0; i < xCal.length - 1; i++) {
        if (x >= xCal[i].x && x <= xCal[i + 1].x) {
          var t = (x - xCal[i].x) / (xCal[i + 1].x - xCal[i].x);
          return t < 0.5 ? xCal[i].label : xCal[i + 1].label;
        }
      }
      return '';
    }

    svg.addEventListener('mousemove', function (evt) {
      var pt = svg.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      var loc = pt.matrixTransform(svg.getScreenCTM().inverse());
      var nearestX = allX[0], best = Infinity;
      allX.forEach(function (x) { var d = Math.abs(x - loc.x); if (d < best) { best = d; nearestX = x; } });

      crosshair.setAttribute('x1', nearestX);
      crosshair.setAttribute('x2', nearestX);
      crosshair.style.display = '';

      var rows = '';
      seriesData.forEach(function (s) {
        if (s.dot.style.display === 'none' && s.dot.getAttribute('data-off') === '1') return;
        var p = s.pts.filter(function (pp) { return pp.x === nearestX; })[0];
        if (!p) { s.dot.style.display = 'none'; return; }
        s.dot.setAttribute('cx', p.x);
        s.dot.setAttribute('cy', p.y);
        s.dot.style.display = '';
        var val = valueFromY(p.y, yCal);
        rows += '<div class="tt-row"><span class="tt-dot" style="background:' + s.color + '"></span>' +
          (s.name ? s.name + '：' : '') + formatLike(yCal[0].sample, val) + '</div>';
      });
      if (!rows) { tooltip.classList.remove('visible'); crosshair.style.display = 'none'; return; }

      tooltip.innerHTML = '<div class="tt-x">' + xToLabel(nearestX) + '</div>' + rows;
      tooltip.classList.add('visible');
      positionTooltip(evt);
    });

    svg.addEventListener('mouseleave', function () {
      crosshair.style.display = 'none';
      seriesData.forEach(function (s) { s.dot.style.display = 'none'; });
      tooltip.classList.remove('visible');
    });
  }

  function setupBarTooltip(rects, children) {
    rects.forEach(function (rect) {
      var rx = parseFloat(rect.getAttribute('x')), rw = parseFloat(rect.getAttribute('width')), ry = parseFloat(rect.getAttribute('y'));
      var rh = parseFloat(rect.getAttribute('height'));
      var cx = rx + rw / 2;
      var candidates = children.filter(function (el) {
        if (el.tagName !== 'text') return false;
        var tx = parseFloat(el.getAttribute('x'));
        return Math.abs(tx - cx) < rw / 2 + 6;
      });
      var valueLabel = candidates.filter(function (t) { return parseFloat(t.getAttribute('y')) <= ry + 14; })
        .sort(function (a, b) { return parseFloat(b.getAttribute('y')) - parseFloat(a.getAttribute('y')); })[0];
      var catLabel = candidates.filter(function (t) { return parseFloat(t.getAttribute('y')) > ry + rh; })
        .sort(function (a, b) { return parseFloat(a.getAttribute('y')) - parseFloat(b.getAttribute('y')); })[0];

      rect.addEventListener('mouseenter', function () {
        rect.style.filter = 'brightness(1.18)';
        var html = '';
        if (valueLabel) html += '<div class="tt-row"><span class="tt-dot" style="background:' + (rect.getAttribute('fill') || '#1B365D') + '"></span>' + valueLabel.textContent + '</div>';
        if (catLabel) html = '<div class="tt-x">' + catLabel.textContent + '</div>' + html;
        if (!html) return;
        tooltip.innerHTML = html;
        tooltip.classList.add('visible');
      });
      rect.addEventListener('mousemove', positionTooltip);
      rect.addEventListener('mouseleave', function () {
        rect.style.filter = '';
        tooltip.classList.remove('visible');
      });
    });
  }

  function setupLegendToggle(svg, children) {
    var middleTexts = children.filter(function (el) { return el.tagName === 'text' && el.getAttribute('text-anchor') === 'middle'; });
    var maxTickY = 0;
    middleTexts.forEach(function (t) { maxTickY = Math.max(maxTickY, parseFloat(t.getAttribute('y')) || 0); });
    var legendRowThreshold = maxTickY + 10;

    var legendTexts = children.filter(function (el) {
      return el.tagName === 'text' && el.getAttribute('text-anchor') !== 'middle' &&
        parseFloat(el.getAttribute('y')) > legendRowThreshold;
    });
    if (!legendTexts.length) return;
    svg.__legendMap = {};

    legendTexts.forEach(function (label) {
      var idx = children.indexOf(label);
      var swatch = null;
      for (var i = idx - 1; i >= 0 && i > idx - 4; i--) {
        var el = children[i];
        if (el.tagName === 'line' || el.tagName === 'circle' || el.tagName === 'rect') { swatch = el; break; }
      }
      if (!swatch) return;
      var color = (swatch.getAttribute('stroke') || swatch.getAttribute('fill') || '').toLowerCase();
      if (!color || color === '#f5f4ed') return;
      svg.__legendMap[color] = label.textContent;

      var group = children.filter(function (el) {
        if (el === label || el === swatch) return false;
        var pos = el.hasAttribute('y') ? parseFloat(el.getAttribute('y'))
          : el.hasAttribute('cy') ? parseFloat(el.getAttribute('cy'))
          : el.hasAttribute('y1') ? parseFloat(el.getAttribute('y1'))
          : NaN;
        if (!isNaN(pos) && pos > legendRowThreshold) return false;
        var elColor = (el.getAttribute('stroke') || el.getAttribute('fill') || '').toLowerCase();
        return elColor === color;
      });
      var dots = svg.querySelectorAll('circle.chart-crosshair');
      Array.prototype.forEach.call(dots, function (d) {
        if ((d.getAttribute('fill') || '').toLowerCase() === color) group.push(d);
      });
      if (!group.length) return;

      label.classList.add('legend-hit');
      swatch.classList.add('legend-hit');
      var on = true;
      function toggle() {
        on = !on;
        group.forEach(function (el) {
          el.style.display = on ? '' : 'none';
          if (el.classList.contains('chart-crosshair')) el.setAttribute('data-off', on ? '0' : '1');
        });
        label.classList.toggle('legend-off', !on);
        swatch.style.opacity = on ? '' : '0.3';
      }
      label.addEventListener('click', toggle);
      swatch.addEventListener('click', toggle);
    });
  }
})();
