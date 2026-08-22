(() => {
  "use strict";

  const BRANDS = [
    {
      group: "expenses",
      container: "assets-expenses",
      assets: [
        {
          id: "expenses-icon-wordmark",
          label: "Icon + Wordmark",
          src: "brands/expenses-icon-wordmark.png",
        },
        {
          id: "expenses-squircle",
          label: "Squircle",
          src: "brands/expenses-squircle.png",
        },
        {
          id: "expenses-icon",
          label: "Icon",
          src: "brands/expenses-icon.png",
        },
        {
          id: "expenses-wordmark",
          label: "Wordmark",
          src: "brands/expenses-wordmark.png",
        },
      ],
    },
    {
      group: "glitch",
      container: "assets-glitch",
      assets: [
        {
          id: "glitchlabs-logo",
          label: "Logo",
          src: "brands/glitchlabs-logo.png",
        },
        {
          id: "glitchlabs-logo-wordmark",
          label: "Logo + Wordmark",
          src: "brands/glitchlabs-logo-wordmark.png",
        },
      ],
    },
  ];

  const PRESETS = {
    native: null,
    "1080x1080": { w: 1080, h: 1080, slug: "1080x1080" },
    "1080x1920": { w: 1080, h: 1920, slug: "1080x1920" },
    "1200x630": { w: 1200, h: 630, slug: "1200x630" },
    "1600x900": { w: 1600, h: 900, slug: "1600x900" },
  };

  const HANDLE_SIZE = 10;
  const MIN_OVERLAY = 24;

  const els = {
    canvas: document.getElementById("stage-canvas"),
    stage: document.getElementById("stage-drop"),
    empty: document.getElementById("empty-state"),
    selection: document.getElementById("selection-box"),
    bgInput: document.getElementById("bg-input"),
    preset: document.getElementById("preset-select"),
    download: document.getElementById("btn-download"),
    clear: document.getElementById("btn-clear"),
    meta: document.getElementById("meta"),
  };

  const ctx = els.canvas.getContext("2d");

  /** @type {Map<string, HTMLImageElement>} */
  const assetImages = new Map();

  const state = {
    /** @type {HTMLImageElement | null} */
    bgImage: null,
    /** canvas pixel size (export space) */
    width: 0,
    height: 0,
    /** CSS display scale: screen px / canvas px */
    viewScale: 1,
    /** offset of canvas element within stage (for selection box) */
    canvasOffset: { x: 0, y: 0 },
    /** @type {Array<{id:string, assetId:string, x:number, y:number, width:number, height:number}>} */
    overlays: [],
    selectedId: null,
    presetKey: "native",
    interaction: null,
  };

  let idSeq = 1;

  function nextId() {
    return `ov-${idSeq++}`;
  }

  function currentPreset() {
    return PRESETS[state.presetKey] || null;
  }

  function coverRect(srcW, srcH, destW, destH) {
    const scale = Math.max(destW / srcW, destH / srcH);
    const w = srcW * scale;
    const h = srcH * scale;
    return {
      x: (destW - w) / 2,
      y: (destH - h) / 2,
      w,
      h,
    };
  }

  function recomputeCanvasSize() {
    if (!state.bgImage) {
      state.width = 0;
      state.height = 0;
      return;
    }
    const preset = currentPreset();
    if (preset) {
      state.width = preset.w;
      state.height = preset.h;
    } else {
      state.width = state.bgImage.naturalWidth;
      state.height = state.bgImage.naturalHeight;
    }
  }

  function updateViewMetrics() {
    const rect = els.canvas.getBoundingClientRect();
    const stageRect = els.stage.getBoundingClientRect();
    state.viewScale =
      state.width > 0 ? rect.width / state.width : 1;
    state.canvasOffset = {
      x: rect.left - stageRect.left,
      y: rect.top - stageRect.top,
    };
  }

  function fitCanvasElement() {
    if (!state.width || !state.height) {
      els.canvas.width = 0;
      els.canvas.height = 0;
      els.canvas.style.width = "0";
      els.canvas.style.height = "0";
      return;
    }
    els.canvas.width = state.width;
    els.canvas.height = state.height;

    const pad = 32;
    const maxW = Math.max(80, els.stage.clientWidth - pad);
    const maxH = Math.max(80, els.stage.clientHeight - pad);
    const scale = Math.min(maxW / state.width, maxH / state.height, 1);
    const displayW = Math.round(state.width * scale);
    const displayH = Math.round(state.height * scale);
    els.canvas.style.width = `${displayW}px`;
    els.canvas.style.height = `${displayH}px`;
    updateViewMetrics();
  }

  function draw() {
    if (!state.bgImage || !state.width) {
      ctx.clearRect(0, 0, els.canvas.width, els.canvas.height);
      syncSelectionBox();
      return;
    }

    ctx.clearRect(0, 0, state.width, state.height);
    const cover = coverRect(
      state.bgImage.naturalWidth,
      state.bgImage.naturalHeight,
      state.width,
      state.height
    );
    ctx.drawImage(state.bgImage, cover.x, cover.y, cover.w, cover.h);

    for (const ov of state.overlays) {
      const img = assetImages.get(ov.assetId);
      if (!img) continue;
      ctx.drawImage(img, ov.x, ov.y, ov.width, ov.height);
    }

    syncSelectionBox();
    updateChrome();
  }

  function selectedOverlay() {
    return state.overlays.find((o) => o.id === state.selectedId) || null;
  }

  function syncSelectionBox() {
    const ov = selectedOverlay();
    if (!ov || !state.bgImage) {
      els.selection.hidden = true;
      return;
    }
    updateViewMetrics();
    const s = state.viewScale;
    const left = state.canvasOffset.x + ov.x * s;
    const top = state.canvasOffset.y + ov.y * s;
    const w = ov.width * s;
    const h = ov.height * s;
    els.selection.hidden = false;
    els.selection.style.left = `${left}px`;
    els.selection.style.top = `${top}px`;
    els.selection.style.width = `${w}px`;
    els.selection.style.height = `${h}px`;
  }

  function updateChrome() {
    const hasBg = Boolean(state.bgImage);
    els.empty.hidden = hasBg;
    els.download.disabled = !hasBg;
    els.clear.disabled = !hasBg || state.overlays.length === 0;

    if (!hasBg) {
      els.meta.textContent = "";
      return;
    }
    const preset = currentPreset();
    const mode = preset
      ? `preset ${preset.w}×${preset.h}`
      : `native ${state.bgImage.naturalWidth}×${state.bgImage.naturalHeight}`;
    const marks =
      state.overlays.length === 0
        ? "no marks"
        : `${state.overlays.length} mark${state.overlays.length === 1 ? "" : "s"}`;
    els.meta.textContent = `${mode} · export ${state.width}×${state.height} · ${marks}`;
  }

  function loadImageFromFile(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image"));
      };
      img.src = url;
    });
  }

  function loadImageUrl(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load ${src}`));
      img.src = src;
    });
  }

  async function setBackground(file) {
    const img = await loadImageFromFile(file);
    state.bgImage = img;
    state.overlays = [];
    state.selectedId = null;
    recomputeCanvasSize();
    fitCanvasElement();
    draw();
  }

  function defaultOverlaySize(assetId) {
    const img = assetImages.get(assetId);
    if (!img || !state.width) {
      return { width: 200, height: 200 };
    }
    const maxDim = Math.min(state.width, state.height) * 0.35;
    const scale = Math.min(maxDim / img.naturalWidth, maxDim / img.naturalHeight, 1);
    return {
      width: Math.round(img.naturalWidth * scale),
      height: Math.round(img.naturalHeight * scale),
    };
  }

  function addOverlay(assetId, canvasX, canvasY) {
    if (!state.bgImage) return;
    const size = defaultOverlaySize(assetId);
    const x =
      canvasX == null
        ? Math.round((state.width - size.width) / 2)
        : Math.round(canvasX - size.width / 2);
    const y =
      canvasY == null
        ? Math.round((state.height - size.height) / 2)
        : Math.round(canvasY - size.height / 2);

    const ov = {
      id: nextId(),
      assetId,
      x,
      y,
      width: size.width,
      height: size.height,
    };
    state.overlays.push(ov);
    state.selectedId = ov.id;
    draw();
  }

  function hitTest(cx, cy) {
    for (let i = state.overlays.length - 1; i >= 0; i--) {
      const o = state.overlays[i];
      if (
        cx >= o.x &&
        cy >= o.y &&
        cx <= o.x + o.width &&
        cy <= o.y + o.height
      ) {
        return o;
      }
    }
    return null;
  }

  function clientToCanvas(clientX, clientY) {
    const rect = els.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / state.viewScale,
      y: (clientY - rect.top) / state.viewScale,
    };
  }

  function bringToFront(id) {
    const idx = state.overlays.findIndex((o) => o.id === id);
    if (idx < 0) return;
    const [ov] = state.overlays.splice(idx, 1);
    state.overlays.push(ov);
  }

  function deleteSelected() {
    if (!state.selectedId) return;
    state.overlays = state.overlays.filter((o) => o.id !== state.selectedId);
    state.selectedId = null;
    draw();
  }

  function startMove(ov, cx, cy) {
    bringToFront(ov.id);
    state.selectedId = ov.id;
    state.interaction = {
      type: "move",
      id: ov.id,
      startX: cx,
      startY: cy,
      origX: ov.x,
      origY: ov.y,
    };
    draw();
  }

  function startScale(ov, handle, cx, cy) {
    bringToFront(ov.id);
    state.selectedId = ov.id;
    state.interaction = {
      type: "scale",
      id: ov.id,
      handle,
      startX: cx,
      startY: cy,
      origX: ov.x,
      origY: ov.y,
      origW: ov.width,
      origH: ov.height,
      aspect: ov.width / Math.max(ov.height, 1),
    };
    draw();
  }

  function applyInteraction(cx, cy) {
    const it = state.interaction;
    if (!it) return;
    const ov = state.overlays.find((o) => o.id === it.id);
    if (!ov) return;

    if (it.type === "move") {
      ov.x = Math.round(it.origX + (cx - it.startX));
      ov.y = Math.round(it.origY + (cy - it.startY));
    } else if (it.type === "scale") {
      const dx = cx - it.startX;
      const dy = cy - it.startY;
      let x = it.origX;
      let y = it.origY;
      let w = it.origW;
      let h = it.origH;
      const aspect = it.aspect;

      switch (it.handle) {
        case "se": {
          w = it.origW + dx;
          h = w / aspect;
          break;
        }
        case "sw": {
          w = it.origW - dx;
          h = w / aspect;
          x = it.origX + it.origW - w;
          break;
        }
        case "ne": {
          w = it.origW + dx;
          h = w / aspect;
          y = it.origY + it.origH - h;
          break;
        }
        case "nw": {
          w = it.origW - dx;
          h = w / aspect;
          x = it.origX + it.origW - w;
          y = it.origY + it.origH - h;
          break;
        }
      }

      if (w < MIN_OVERLAY) {
        w = MIN_OVERLAY;
        h = w / aspect;
        if (it.handle === "nw" || it.handle === "sw") {
          x = it.origX + it.origW - w;
        }
        if (it.handle === "nw" || it.handle === "ne") {
          y = it.origY + it.origH - h;
        }
      }

      ov.x = Math.round(x);
      ov.y = Math.round(y);
      ov.width = Math.round(w);
      ov.height = Math.round(h);
    }

    draw();
  }

  function endInteraction() {
    state.interaction = null;
  }

  function renderExportCanvas() {
    const out = document.createElement("canvas");
    out.width = state.width;
    out.height = state.height;
    const c = out.getContext("2d");
    const cover = coverRect(
      state.bgImage.naturalWidth,
      state.bgImage.naturalHeight,
      state.width,
      state.height
    );
    c.drawImage(state.bgImage, cover.x, cover.y, cover.w, cover.h);
    for (const ov of state.overlays) {
      const img = assetImages.get(ov.assetId);
      if (!img) continue;
      c.drawImage(img, ov.x, ov.y, ov.width, ov.height);
    }
    return out;
  }

  function downloadPng() {
    if (!state.bgImage) return;
    const out = renderExportCanvas();
    const preset = currentPreset();
    const slug = preset ? preset.slug : "native";
    out.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `glitch-compose-${slug}-${state.width}x${state.height}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  }

  function buildAssetPane() {
    for (const group of BRANDS) {
      const root = document.getElementById(group.container);
      if (!root) continue;
      for (const asset of group.assets) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "asset-chip";
        btn.draggable = true;
        btn.dataset.assetId = asset.id;
        btn.title = `Add ${asset.label}`;
        btn.innerHTML = `
          <span class="asset-thumb"><img alt="" src="${asset.src}" /></span>
          <span class="asset-label">${asset.label}</span>
        `;

        btn.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("application/x-brand-asset", asset.id);
          e.dataTransfer.setData("text/plain", asset.id);
          e.dataTransfer.effectAllowed = "copy";
        });

        btn.addEventListener("click", () => {
          if (!state.bgImage) {
            els.meta.textContent = "Upload a background first";
            return;
          }
          addOverlay(asset.id);
        });

        root.appendChild(btn);
      }
    }
  }

  async function preloadAssets() {
    const all = BRANDS.flatMap((g) => g.assets);
    await Promise.all(
      all.map(async (asset) => {
        const img = await loadImageUrl(asset.src);
        assetImages.set(asset.id, img);
      })
    );
  }

  // —— Events ——

  els.bgInput.addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    try {
      await setBackground(file);
    } catch (err) {
      els.meta.textContent = err.message || "Could not load background";
    }
    e.target.value = "";
  });

  els.preset.addEventListener("change", () => {
    state.presetKey = els.preset.value;
    if (!state.bgImage) {
      updateChrome();
      return;
    }
    // Keep overlays; remapping is approximate — clear if switching dims drastically
    const prevW = state.width;
    const prevH = state.height;
    recomputeCanvasSize();
    if (prevW && prevH && (prevW !== state.width || prevH !== state.height)) {
      const sx = state.width / prevW;
      const sy = state.height / prevH;
      const s = Math.min(sx, sy);
      for (const ov of state.overlays) {
        ov.x = Math.round(ov.x * sx);
        ov.y = Math.round(ov.y * sy);
        ov.width = Math.round(ov.width * s);
        ov.height = Math.round(ov.height * s);
      }
    }
    fitCanvasElement();
    draw();
  });

  els.download.addEventListener("click", downloadPng);
  els.clear.addEventListener("click", () => {
    state.overlays = [];
    state.selectedId = null;
    draw();
  });

  ["dragenter", "dragover"].forEach((type) => {
    els.stage.addEventListener(type, (e) => {
      e.preventDefault();
      els.stage.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach((type) => {
    els.stage.addEventListener(type, (e) => {
      e.preventDefault();
      if (type === "dragleave" && e.target !== els.stage) return;
      els.stage.classList.remove("drag-over");
    });
  });

  els.stage.addEventListener("drop", async (e) => {
    e.preventDefault();
    els.stage.classList.remove("drag-over");

    const assetId =
      e.dataTransfer.getData("application/x-brand-asset") ||
      e.dataTransfer.getData("text/plain");

    if (assetId && assetImages.has(assetId)) {
      if (!state.bgImage) {
        els.meta.textContent = "Upload a background first";
        return;
      }
      const pt = clientToCanvas(e.clientX, e.clientY);
      addOverlay(assetId, pt.x, pt.y);
      return;
    }

    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        await setBackground(file);
      } catch (err) {
        els.meta.textContent = err.message || "Could not load background";
      }
    }
  });

  els.canvas.addEventListener("pointerdown", (e) => {
    if (!state.bgImage) return;
    els.stage.focus();
    const pt = clientToCanvas(e.clientX, e.clientY);
    const hit = hitTest(pt.x, pt.y);
    if (hit) {
      els.canvas.setPointerCapture(e.pointerId);
      startMove(hit, pt.x, pt.y);
    } else {
      state.selectedId = null;
      draw();
    }
  });

  els.canvas.addEventListener("pointermove", (e) => {
    if (!state.interaction || state.interaction.type !== "move") return;
    const pt = clientToCanvas(e.clientX, e.clientY);
    applyInteraction(pt.x, pt.y);
  });

  els.canvas.addEventListener("pointerup", endInteraction);
  els.canvas.addEventListener("pointercancel", endInteraction);

  els.selection.addEventListener("pointerdown", (e) => {
    const handle = e.target.closest(".handle");
    if (!handle) return;
    e.preventDefault();
    e.stopPropagation();
    const ov = selectedOverlay();
    if (!ov) return;
    const pt = clientToCanvas(e.clientX, e.clientY);
    els.stage.setPointerCapture(e.pointerId);
    startScale(ov, handle.dataset.handle, pt.x, pt.y);
  });

  els.stage.addEventListener("pointermove", (e) => {
    if (!state.interaction || state.interaction.type !== "scale") return;
    const pt = clientToCanvas(e.clientX, e.clientY);
    applyInteraction(pt.x, pt.y);
  });

  els.stage.addEventListener("pointerup", endInteraction);
  els.stage.addEventListener("pointercancel", endInteraction);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Delete" || e.key === "Backspace") {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      if (state.selectedId) {
        e.preventDefault();
        deleteSelected();
      }
    }
    if (e.key === "Escape") {
      state.selectedId = null;
      draw();
    }
  });

  window.addEventListener("resize", () => {
    fitCanvasElement();
    draw();
  });

  // —— Boot ——
  buildAssetPane();
  preloadAssets()
    .then(() => {
      updateChrome();
    })
    .catch((err) => {
      els.meta.textContent = err.message || "Failed to load brand assets";
    });
})();
