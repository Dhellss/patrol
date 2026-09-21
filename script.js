/* patrol — turn-based stealth. Cameras turn a quarter every move you make. */
(function () {
  "use strict";
  var DIRS = [{ dx: 0, dy: -1 }, { dx: 1, dy: 0 }, { dx: 0, dy: 1 }, { dx: -1, dy: 0 }];
  var ARROW = ["^", ">", "v", "<"];
  var REACH = 3;

  var $ = function (i) { return document.getElementById(i); };
  var grid = $("grid"), overlay = $("overlay"), card = $("card");
  var vLevel = $("v-level"), vMoves = $("v-moves"), vData = $("v-data"), vScore = $("v-score"), vLives = $("v-lives");

  function load(k,d){try{var v=localStorage.getItem(k);return v===null?d:v}catch(e){return d}}
  function save(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  var best = parseInt(load("pt.best","0"),10) || 0;

  var level = 1, score = 0, lives = 3, F = null, playing = false;

  function litMaps(n, cells, cams) {
    var maps = [];
    for (var p = 0; p < 4; p++) {
      var a = new Uint8Array(n * n);
      for (var k = 0; k < cams.length; k++) {
        var cam = cams[k], d = (cam.f + p) % 4;
        var x = cam.i % n, y = (cam.i / n) | 0;
        for (var s = 0; s < REACH; s++) {
          x += DIRS[d].dx; y += DIRS[d].dy;
          if (x < 0 || y < 0 || x >= n || y >= n) break;
          var j = y * n + x;
          if (cells[j]) break;
          a[j] = 1;
        }
      }
      maps.push(a);
    }
    return maps;
  }

  function solve(n, cells, lit, start, exit, data) {
    var idx = {}, i;
    for (i = 0; i < data.length; i++) idx[data[i]] = i;
    var full = (1 << data.length) - 1;
    if (lit[0][start]) return -1;
    var seen = new Uint8Array(n * n * 4 * 16);
    var key = function (c, p, m) { return (c * 4 + p) * 16 + m; };
    var q = [[start, 0, 0, 0]], head = 0;
    seen[key(start, 0, 0)] = 1;
    while (head < q.length) {
      var s = q[head++], c = s[0], p = s[1], m = s[2], dist = s[3];
      if (c === exit && m === full) return dist;
      var x = c % n, y = (c / n) | 0, opts = [c];
      for (var d = 0; d < 4; d++) {
        var nx = x + DIRS[d].dx, ny = y + DIRS[d].dy;
        if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
        opts.push(ny * n + nx);
      }
      var np = (p + 1) % 4;
      for (var o = 0; o < opts.length; o++) {
        var t = opts[o];
        if (cells[t]) continue;
        if (lit[p][t] || lit[np][t]) continue;
        var nm = m | (idx[t] === undefined ? 0 : (1 << idx[t]));
        var kk = key(t, np, nm);
        if (seen[kk]) continue;
        seen[kk] = 1;
        q.push([t, np, nm, dist + 1]);
      }
    }
    return -1;
  }

  function makeFloor(lv) {
    var small = matchMedia("(max-width:600px)").matches;
    var n = lv >= 5 && !small ? 8 : 7;
    var wantCams = Math.min(5, 2 + Math.floor(lv / 2));
    var wantData = Math.min(3, 1 + Math.floor((lv - 1) / 3));

    for (var attempt = 0; attempt < 400; attempt++) {
      var cams = attempt > 250 ? Math.max(2, wantCams - 1) : wantCams;
      var cells = new Uint8Array(n * n);
      var i, r;
      for (i = 0; i < n * n; i++) if (Math.random() < 0.14) cells[i] = 1;
      var free = [];
      for (i = 0; i < n * n; i++) if (!cells[i]) free.push(i);
      if (free.length < 14) continue;
      var pick = function () { return free.splice((Math.random() * free.length) | 0, 1)[0]; };

      var camList = [];
      for (i = 0; i < cams; i++) {
        var ci = pick();
        if (ci === undefined) break;
        cells[ci] = 2;
        camList.push({ i: ci, f: (Math.random() * 4) | 0 });
      }
      var start = pick(), exit = pick(), data = [];
      if (start === undefined || exit === undefined) continue;
      for (i = 0; i < wantData; i++) { var di = pick(); if (di !== undefined) data.push(di); }
      if (data.length < wantData) continue;

      var lit = litMaps(n, cells, camList);
      var par = solve(n, cells, lit, start, exit, data);
      if (par < 4 || par > 70) continue;

      return { n: n, cells: cells, cams: camList, lit: lit, start: start, exit: exit,
               data: data, par: par, at: start, phase: 0, moves: 0, got: [] };
    }
    return null;
  }

  function build() {
    grid.style.setProperty("--n", F.n);
    grid.innerHTML = "";
    for (var i = 0; i < F.n * F.n; i++) {
      var c = document.createElement("div");
      c.className = "c"; c.dataset.i = i;
      grid.appendChild(c);
    }
    paint();
  }

  function paint() {
    var now = F.lit[F.phase], nxt = F.lit[(F.phase + 1) % 4];
    var kids = grid.children;
    for (var i = 0; i < kids.length; i++) {
      var c = kids[i], cls = "c", txt = "";
      if (F.cells[i] === 1) cls += " wall";
      else if (F.cells[i] === 2) {
        cls += " cam";
        for (var k = 0; k < F.cams.length; k++) if (F.cams[k].i === i) txt = ARROW[(F.cams[k].f + F.phase) % 4];
      } else {
        if (nxt[i]) cls += " next";
        if (now[i]) cls += " now";
        if (i === F.exit) { cls += " exit"; txt = "="; }
        if (F.data.indexOf(i) >= 0 && F.got.indexOf(i) < 0) { cls += " data"; txt = "*"; }
        if (i === F.at) { cls += " me"; txt = "@"; }
        if (adjacent(i) && i !== F.at) cls += " step";
      }
      c.className = cls;
      c.textContent = txt;
    }
    hud();
  }

  function adjacent(i) {
    var n = F.n, x = i % n, y = (i / n) | 0, ax = F.at % n, ay = (F.at / n) | 0;
    return Math.abs(x - ax) + Math.abs(y - ay) === 1;
  }

  function hud() {
    vLevel.textContent = level;
    vMoves.innerHTML = F.moves + ' <i>/ ' + F.par + "</i>";
    vData.textContent = F.got.length + "/" + F.data.length;
    vScore.textContent = score;
    var s = ""; for (var i = 0; i < lives; i++) s += "life ";
    vLives.textContent = s.trim() || "no lives";
  }

  function step(target) {
    if (!playing) return;
    if (F.cells[target]) return;
    if (target !== F.at && !adjacent(target)) return;
    var now = F.lit[F.phase], nxt = F.lit[(F.phase + 1) % 4];
    var seen = now[target] || nxt[target];
    F.at = target;
    F.moves++;
    F.phase = (F.phase + 1) % 4;
    if (F.data.indexOf(target) >= 0 && F.got.indexOf(target) < 0) F.got.push(target);
    paint();
    if (seen) return caught();
    if (target === F.exit && F.got.length === F.data.length) return cleared();
  }

  function cleared() {
    playing = false;
    var head = level * 150, tight = Math.max(0, F.par + 4 - F.moves) * 20;
    score += head + tight;
    if (score > best) { best = score; save("pt.best", String(best)); }
    hud();
    card.innerHTML = '<h1 class="good">floor ' + level + " clear</h1><p>Out through the stairs, nothing on tape.</p>" +
      '<div class="score-rows"><div><span>floor</span><b>+' + head + "</b></div>" +
      "<div><span>quick route</span><b>+" + tight + "</b></div>" +
      "<div><span>score</span><b>" + score + "</b></div></div>" +
      '<button class="btn" id="go" type="button">Next floor</button>';
    overlay.hidden = false;
    $("go").addEventListener("click", function () { level++; load2(); }, { once: true });
  }

  function caught() {
    playing = false; lives--; hud();
    if (lives <= 0) {
      card.innerHTML = '<h1 class="bad">spotted</h1><p>Security has you on floor ' + level + ".</p>" +
        '<div class="score-rows"><div><span>score</span><b>' + score + "</b></div>" +
        "<div><span>best</span><b>" + best + "</b></div></div>" +
        '<button class="btn" id="go" type="button">Try again</button>';
      overlay.hidden = false;
      $("go").addEventListener("click", function () { level = 1; score = 0; lives = 3; load2(); }, { once: true });
    } else {
      card.innerHTML = '<h1 class="bad">spotted</h1><p>A camera caught you crossing. The floor resets.</p>' +
        '<div class="score-rows"><div><span>lives left</span><b>' + lives + "</b></div></div>" +
        '<button class="btn" id="go" type="button">Back in</button>';
      overlay.hidden = false;
      $("go").addEventListener("click", function () { reset(); }, { once: true });
    }
  }

  function reset() {
    F.at = F.start; F.phase = 0; F.moves = 0; F.got = [];
    paint(); overlay.hidden = true; playing = true;
  }

  function load2() {
    var f = makeFloor(level);
    if (!f) { level = Math.max(1, level - 1); f = makeFloor(level); }
    F = f; build(); overlay.hidden = true; playing = true;
  }

  grid.addEventListener("click", function (e) {
    var c = e.target.closest(".c");
    if (c) step(+c.dataset.i);
  });

  function move(d) {
    var n = F.n, x = F.at % n, y = (F.at / n) | 0;
    var nx = x + DIRS[d].dx, ny = y + DIRS[d].dy;
    if (nx < 0 || ny < 0 || nx >= n || ny >= n) return;
    step(ny * n + nx);
  }

  document.querySelectorAll(".pad .key").forEach(function (b) {
    b.addEventListener("click", function () {
      var d = b.dataset.d;
      if (d === "w") step(F.at); else move(+d);
    });
  });

  document.addEventListener("keydown", function (e) {
    if (!playing) return;
    var m = { ArrowUp: 0, w: 0, W: 0, ArrowRight: 1, d: 1, D: 1, ArrowDown: 2, s: 2, S: 2, ArrowLeft: 3, a: 3, A: 3 };
    if (e.key in m) { e.preventDefault(); move(m[e.key]); return; }
    if (e.key === " " || e.key === ".") { e.preventDefault(); step(F.at); }
  });

  F = makeFloor(1);
  build();
  $("go").addEventListener("click", function () { overlay.hidden = true; playing = true; }, { once: true });
})();
