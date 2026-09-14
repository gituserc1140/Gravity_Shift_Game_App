(() => {
  const LEVELS = window.GravityShiftLevels;
  const Physics = window.GravityShiftPhysics;
  const Player = window.GravityShiftPlayer;
  const UI = window.GravityShiftUI;

  const WORLD = { width: 960, height: 540 };
  const SAVE_KEY = 'gravity-shift-save-v1';
  const cloneLevel = (level) => JSON.parse(JSON.stringify(level));

  class GravityShiftGame {
    constructor() {
      this.canvas = document.getElementById('game-canvas');
      this.ctx = this.canvas.getContext('2d');
      this.ui = new UI();
      this.ui.bind(this);
      this.player = new Player();
      this.state = {
        mode: 'menu',
        paused: false,
        levelIndex: 0,
        time: 0,
        deaths: 0,
        crystalCount: 0,
        levelCrystals: 0,
        unlockedLevel: 1,
        crystalsByLevel: {},
        totalCrystalsEarned: 0
      };
      this.input = {
        left: false,
        right: false,
        jumpPressed: false,
        flipPressed: false
      };
      this.levelState = null;
      this.touchButtons = [...document.querySelectorAll('[data-control]')];
      this.lastFrame = performance.now();
      this.resize();
      this.loadProgress();
      this.bindInput();
      this.openMainMenu();
      requestAnimationFrame((ts) => this.loop(ts));
    }

    loadProgress() {
      try {
        const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
        this.state.unlockedLevel = Math.max(1, Math.min(LEVELS.length, parsed.unlockedLevel || 1));
        this.state.crystalsByLevel = parsed.crystalsByLevel || {};
      } catch (error) {
        this.state.unlockedLevel = 1;
        this.state.crystalsByLevel = {};
      }
      this.state.totalCrystalsEarned = Object.values(this.state.crystalsByLevel).reduce((sum, count) => sum + count, 0);
      this.ui.renderLevelButtons(LEVELS, this.state.unlockedLevel, (index) => this.startLevel(index));
    }

    saveProgress() {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({
          unlockedLevel: this.state.unlockedLevel,
          crystalsByLevel: this.state.crystalsByLevel
        }));
      } catch (error) {
        return;
      }
    }

    bindInput() {
      const setKey = (pressed, code) => {
        if (code === 'KeyA' || code === 'ArrowLeft') {
          this.input.left = pressed;
        }
        if (code === 'KeyD' || code === 'ArrowRight') {
          this.input.right = pressed;
        }
        if (pressed && code === 'Space') {
          this.input.jumpPressed = true;
        }
        if (pressed && (code === 'ShiftLeft' || code === 'ShiftRight')) {
          this.input.flipPressed = true;
        }
      };

      window.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
          event.preventDefault();
          if (this.state.mode === 'playing' || this.state.mode === 'paused') {
            this.togglePause();
          }
          return;
        }
        if (['Space', 'ArrowLeft', 'ArrowRight'].includes(event.code) || event.code.startsWith('Shift')) {
          event.preventDefault();
        }
        setKey(true, event.code);
      });

      window.addEventListener('keyup', (event) => setKey(false, event.code));
      window.addEventListener('resize', () => this.resize());
      this.canvas.addEventListener('pointerdown', () => this.canvas.focus());

      const bindTouch = (button, control) => {
        const down = (event) => {
          event.preventDefault();
          button.classList.add('is-active');
          if (control === 'left') this.input.left = true;
          if (control === 'right') this.input.right = true;
          if (control === 'jump') this.input.jumpPressed = true;
          if (control === 'flip') this.input.flipPressed = true;
        };
        const up = (event) => {
          event.preventDefault();
          button.classList.remove('is-active');
          if (control === 'left') this.input.left = false;
          if (control === 'right') this.input.right = false;
        };
        button.addEventListener('pointerdown', down);
        button.addEventListener('pointerup', up);
        button.addEventListener('pointercancel', up);
        button.addEventListener('pointerleave', up);
      };

      this.touchButtons.forEach((button) => bindTouch(button, button.dataset.control));
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = this.canvas.clientWidth || WORLD.width;
      const height = this.canvas.clientHeight || WORLD.height;
      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.scale = Math.min(width / WORLD.width, height / WORLD.height);
      this.offsetX = (width - WORLD.width * this.scale) / 2;
      this.offsetY = (height - WORLD.height * this.scale) / 2;
    }

    startCampaign() {
      this.startLevel(Math.max(0, this.state.unlockedLevel - 1));
    }

    startLevel(index) {
      this.state.levelIndex = index;
      this.state.mode = 'playing';
      this.state.paused = false;
      this.state.time = 0;
      this.state.crystalCount = 0;
      const level = LEVELS[index];
      this.state.levelCrystals = level.crystals.length;
      this.levelState = cloneLevel(level);
      this.player.reset(level.start);
      this.prepareLevelState();
      this.ui.hideAll();
      this.ui.updateHud(index, 0, this.state.levelCrystals, this.player.gravity);
    }

    prepareLevelState() {
      this.levelState.crystals.forEach((crystal) => { crystal.collected = false; });
      this.levelState.movingPlatforms.forEach((platform) => {
        platform.current = { x: platform.x, y: platform.y, w: platform.w, h: platform.h };
        platform.deltaX = 0;
        platform.deltaY = 0;
      });
      this.levelState.fallingBlocks.forEach((block) => {
        block.current = { x: block.x, y: block.y, w: block.w, h: block.h };
        block.velocityY = 0;
        block.active = false;
        block.settled = false;
      });
      this.levelState.portals.forEach((portal) => { portal.cooldown = 0; });
    }

    restartLevel() {
      this.startLevel(this.state.levelIndex);
    }

    openMainMenu() {
      this.state.mode = 'menu';
      this.state.paused = false;
      this.ui.show('mainMenu');
    }

    openLevelSelect() {
      this.state.mode = 'menu';
      this.state.paused = false;
      this.ui.renderLevelButtons(LEVELS, this.state.unlockedLevel, (index) => this.startLevel(index));
      this.ui.show('levelSelectMenu');
    }

    togglePause(force) {
      if (this.state.mode !== 'playing' && this.state.mode !== 'paused') {
        return;
      }
      const shouldPause = typeof force === 'boolean' ? force : !this.state.paused;
      this.state.paused = shouldPause;
      this.state.mode = shouldPause ? 'paused' : 'playing';
      if (shouldPause) {
        this.ui.show('pauseMenu');
      } else {
        this.ui.hideAll();
      }
    }

    advanceAfterWin() {
      const nextIndex = this.state.levelIndex + 1;
      if (nextIndex < LEVELS.length) {
        this.startLevel(nextIndex);
      } else {
        this.startLevel(0);
      }
    }

    buildSolids() {
      const solids = this.levelState.platforms.map((platform) => ({ ...platform }));
      this.levelState.movingPlatforms.forEach((platform) => {
        solids.push({ ...platform.current, source: platform, isMoving: true });
      });
      this.levelState.fallingBlocks.forEach((block) => {
        solids.push({ ...block.current, source: block, isFalling: true });
      });
      return solids;
    }

    respawn() {
      this.state.deaths += 1;
      this.restartLevel();
    }

    completeLevel() {
      const nextUnlock = Math.min(LEVELS.length, Math.max(this.state.unlockedLevel, this.state.levelIndex + 2));
      this.state.unlockedLevel = nextUnlock;
      const previousBest = this.state.crystalsByLevel[this.state.levelIndex] || 0;
      if (this.state.crystalCount > previousBest) {
        this.state.crystalsByLevel[this.state.levelIndex] = this.state.crystalCount;
      }
      this.state.totalCrystalsEarned = Object.values(this.state.crystalsByLevel).reduce((sum, count) => sum + count, 0);
      this.saveProgress();
      this.ui.renderLevelButtons(LEVELS, this.state.unlockedLevel, (index) => this.startLevel(index));
      const totalPossible = LEVELS.reduce((sum, level) => sum + level.crystals.length, 0);
      const message = this.state.levelIndex === LEVELS.length - 1
        ? `You escaped every chamber with ${this.state.totalCrystalsEarned} / ${totalPossible} crystals collected.`
        : `Level ${this.state.levelIndex + 1} complete. Crystals collected: ${this.state.crystalCount} / ${this.state.levelCrystals}.`;
      this.state.mode = 'menu';
      this.ui.showVictory(message, this.state.levelIndex < LEVELS.length - 1);
    }

    update(dt) {
      if (this.state.mode !== 'playing') {
        this.input.jumpPressed = false;
        this.input.flipPressed = false;
        return;
      }

      dt = Math.min(dt, 0.02);
      this.state.time += dt;

      this.levelState.movingPlatforms.forEach((platform) => Physics.updateMovingPlatform(platform, this.state.time));
      if (this.player.standingPlatform && this.player.standingPlatform.deltaX !== undefined) {
        this.player.x += this.player.standingPlatform.deltaX;
        this.player.y += this.player.standingPlatform.deltaY;
      }

      let solids = this.buildSolids();
      this.levelState.fallingBlocks.forEach((block) => Physics.updateFallingBlock(block, this.player, solids, dt));
      solids = this.buildSolids();

      this.levelState.portals.forEach((portal) => {
        portal.cooldown = Math.max(0, (portal.cooldown || 0) - dt);
      });

      this.player.update(this.input, dt);
      const collision = Physics.resolveActorWorld(this.player, solids, dt);
      this.player.grounded = collision.grounded;
      this.player.standingPlatform = collision.standingPlatform;

      if (
        this.player.x > WORLD.width + 80 ||
        this.player.x + this.player.w < -80 ||
        this.player.y > WORLD.height + 80 ||
        this.player.y + this.player.h < -80
      ) {
        this.respawn();
        return;
      }

      this.checkGravityZones();
      this.checkPortals();
      this.collectCrystals();

      if (this.hitHazard()) {
        this.respawn();
        return;
      }

      if (this.reachedExit()) {
        this.completeLevel();
        return;
      }

      this.ui.updateHud(this.state.levelIndex, this.state.crystalCount, this.state.levelCrystals, this.player.gravity);
      this.input.jumpPressed = false;
      this.input.flipPressed = false;
    }

    checkGravityZones() {
      let inZone = false;
      for (const zone of this.levelState.gravityZones) {
        if (Physics.overlaps(this.player.rect, zone)) {
          inZone = true;
          if (!this.player.zoneLock) {
            this.player.setGravity(zone.direction);
            this.player.zoneLock = true;
          }
        }
      }
      if (!inZone) {
        this.player.zoneLock = false;
      }
    }

    checkPortals() {
      let touchedPortal = false;
      for (const portal of this.levelState.portals) {
        if (Physics.overlaps(this.player.rect, portal)) {
          touchedPortal = true;
          if (!this.player.portalLock && portal.cooldown <= 0) {
            const flipped = this.player.flip();
            if (flipped) {
              this.teleportFromPortal(portal);
              this.player.portalLock = true;
              portal.cooldown = 0.3;
              break;
            }
          }
        }
      }
      if (!touchedPortal) {
        this.player.portalLock = false;
      }
    }

    teleportFromPortal(portal) {
      if (portal.pair === undefined) {
        return;
      }
      const destination = this.levelState.portals[portal.pair];
      if (!destination) {
        return;
      }
      const centeredX = destination.x + (destination.w - this.player.w) / 2;
      const offsetY = this.player.gravity > 0
        ? destination.y - this.player.h - 6
        : destination.y + destination.h + 6;
      this.player.x = Physics.clamp(centeredX, 22, WORLD.width - this.player.w - 22);
      this.player.y = Physics.clamp(offsetY, 22, WORLD.height - this.player.h - 22);
      this.player.vx *= 0.6;
      destination.cooldown = 0.3;
    }

    collectCrystals() {
      const center = this.player.center;
      this.levelState.crystals.forEach((crystal) => {
        if (crystal.collected) {
          return;
        }
        const distance = Math.hypot(center.x - crystal.x, center.y - crystal.y);
        if (distance <= crystal.r + 18) {
          crystal.collected = true;
          this.state.crystalCount += 1;
        }
      });
    }

    hitHazard() {
      for (const spike of this.levelState.spikes) {
        if (Physics.overlaps(this.player.rect, spike)) {
          return true;
        }
      }
      for (const block of this.levelState.fallingBlocks) {
        if (block.active && !block.settled && Physics.overlaps(this.player.rect, block.current)) {
          return true;
        }
      }
      for (const laser of this.levelState.lasers) {
        if (Physics.isLaserActive(laser, this.state.time) && Physics.overlaps(this.player.rect, laser)) {
          return true;
        }
      }
      return false;
    }

    reachedExit() {
      const exit = this.levelState.exit;
      return Physics.overlaps(this.player.rect, exit) && this.state.crystalCount >= exit.requiredCrystals;
    }

    drawWorldRect(rect, fill, glow = fill) {
      const ctx = this.ctx;
      ctx.shadowBlur = 18;
      ctx.shadowColor = glow;
      ctx.fillStyle = fill;
      ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      ctx.shadowBlur = 0;
    }

    render() {
      const ctx = this.ctx;
      const width = this.canvas.clientWidth || WORLD.width;
      const height = this.canvas.clientHeight || WORLD.height;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(this.offsetX, this.offsetY);
      ctx.scale(this.scale, this.scale);

      this.drawBackground(ctx);
      if (this.levelState) {
        this.renderLevel();
      }
      ctx.restore();
    }

    drawBackground(ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 0, WORLD.height);
      gradient.addColorStop(0, '#0c1637');
      gradient.addColorStop(1, '#050b1d');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, WORLD.width, WORLD.height);

      ctx.strokeStyle = 'rgba(89, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 20; x < WORLD.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORLD.height);
        ctx.stroke();
      }
      for (let y = 20; y < WORLD.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD.width, y);
        ctx.stroke();
      }
    }

    renderLevel() {
      const ctx = this.ctx;
      const level = this.levelState;

      level.gravityZones.forEach((zone) => {
        const color = zone.direction > 0 ? 'rgba(89, 240, 255, 0.18)' : 'rgba(161, 77, 255, 0.22)';
        ctx.fillStyle = color;
        ctx.strokeStyle = zone.direction > 0 ? 'rgba(89, 240, 255, 0.55)' : 'rgba(161, 77, 255, 0.55)';
        ctx.lineWidth = 2;
        ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
        ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
      });

      level.platforms.forEach((platform) => this.drawWorldRect(platform, '#1d9bff', 'rgba(29, 155, 255, 0.55)'));
      level.movingPlatforms.forEach((platform) => this.drawWorldRect(platform.current, '#54baff', 'rgba(89, 240, 255, 0.65)'));
      level.fallingBlocks.forEach((block) => this.drawWorldRect(block.current, '#7a8cab', 'rgba(122, 140, 171, 0.4)'));

      level.spikes.forEach((spike) => {
        ctx.fillStyle = '#ff3c5e';
        ctx.shadowColor = 'rgba(255, 60, 94, 0.65)';
        ctx.shadowBlur = 18;
        const steps = Math.max(2, Math.floor(spike.w / 18));
        const size = spike.w / steps;
        for (let i = 0; i < steps; i += 1) {
          const x = spike.x + i * size;
          ctx.beginPath();
          ctx.moveTo(x, spike.y + spike.h);
          ctx.lineTo(x + size / 2, spike.y);
          ctx.lineTo(x + size, spike.y + spike.h);
          ctx.closePath();
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      });

      level.lasers.forEach((laser) => {
        const active = Physics.isLaserActive(laser, this.state.time);
        ctx.fillStyle = active ? 'rgba(255, 60, 94, 0.95)' : 'rgba(255, 60, 94, 0.18)';
        ctx.shadowColor = 'rgba(255, 60, 94, 0.8)';
        ctx.shadowBlur = active ? 22 : 0;
        ctx.fillRect(laser.x, laser.y, laser.w, laser.h);
        ctx.shadowBlur = 0;
      });

      level.portals.forEach((portal) => {
        const gradient = ctx.createRadialGradient(
          portal.x + portal.w / 2,
          portal.y + portal.h / 2,
          4,
          portal.x + portal.w / 2,
          portal.y + portal.h / 2,
          portal.w
        );
        gradient.addColorStop(0, 'rgba(255,255,255,0.95)');
        gradient.addColorStop(0.45, 'rgba(89,240,255,0.95)');
        gradient.addColorStop(1, 'rgba(161,77,255,0.25)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(portal.x + portal.w / 2, portal.y + portal.h / 2, portal.w / 2, 0, Math.PI * 2);
        ctx.fill();
      });

      level.crystals.forEach((crystal) => {
        if (crystal.collected) {
          return;
        }
        ctx.save();
        ctx.translate(crystal.x, crystal.y + Math.sin(this.state.time * 3 + crystal.x * 0.02) * 4);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = '#7effd6';
        ctx.shadowColor = 'rgba(126, 255, 214, 0.8)';
        ctx.shadowBlur = 18;
        ctx.fillRect(-10, -10, 20, 20);
        ctx.restore();
      });

      const exit = level.exit;
      const unlocked = this.state.crystalCount >= exit.requiredCrystals;
      ctx.fillStyle = unlocked ? '#7effd6' : '#5f6a8d';
      ctx.shadowColor = unlocked ? 'rgba(126, 255, 214, 0.85)' : 'rgba(95, 106, 141, 0.55)';
      ctx.shadowBlur = 18;
      ctx.fillRect(exit.x, exit.y, exit.w, exit.h);
      ctx.fillStyle = '#050b1d';
      ctx.fillRect(exit.x + 10, exit.y + 10, exit.w - 20, exit.h - 20);
      ctx.shadowBlur = 0;
      if (!unlocked && exit.requiredCrystals > 0) {
        ctx.fillStyle = '#e4f0ff';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${exit.requiredCrystals}`, exit.x + exit.w / 2, exit.y - 10);
      }

      this.renderPlayer();
      ctx.fillStyle = 'rgba(228, 240, 255, 0.8)';
      ctx.font = '16px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(level.title, 32, 42);
    }

    renderPlayer() {
      const ctx = this.ctx;
      const player = this.player;
      const glow = player.gravity > 0 ? 'rgba(89, 240, 255, 0.85)' : 'rgba(161, 77, 255, 0.85)';
      const flipPulse = 1 + player.gravityBlend * 0.25;

      ctx.save();
      ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
      ctx.scale(1, player.visualGravity * flipPulse);
      ctx.shadowBlur = 18;
      ctx.shadowColor = glow;
      ctx.fillStyle = '#f6fbff';
      ctx.fillRect(-player.w / 2, -player.h / 2, player.w, player.h);
      ctx.fillStyle = '#050b1d';
      ctx.fillRect(-8, -8, 16, 8);
      ctx.restore();
    }

    loop(timestamp) {
      const dt = (timestamp - this.lastFrame) / 1000;
      this.lastFrame = timestamp;
      this.update(dt);
      this.render();
      requestAnimationFrame((ts) => this.loop(ts));
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    window.gravityShiftGame = new GravityShiftGame();
  });
})();
