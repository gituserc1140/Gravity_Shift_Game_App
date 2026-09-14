(() => {
  class UIManager {
    constructor() {
      this.elements = {
        hudLevel: document.getElementById('hud-level'),
        hudCrystals: document.getElementById('hud-crystals'),
        hudGravity: document.getElementById('hud-gravity'),
        mainMenu: document.getElementById('main-menu'),
        levelSelectMenu: document.getElementById('level-select-menu'),
        pauseMenu: document.getElementById('pause-menu'),
        victoryScreen: document.getElementById('victory-screen'),
        levelGrid: document.getElementById('level-grid'),
        victoryText: document.getElementById('victory-text'),
        playButton: document.getElementById('play-button'),
        levelSelectButton: document.getElementById('level-select-button'),
        levelSelectBack: document.getElementById('level-select-back'),
        pauseButton: document.getElementById('pause-button'),
        resumeButton: document.getElementById('resume-button'),
        restartButton: document.getElementById('restart-button'),
        pauseLevelSelectButton: document.getElementById('pause-level-select-button'),
        nextLevelButton: document.getElementById('next-level-button'),
        victoryLevelSelectButton: document.getElementById('victory-level-select-button'),
        menuButton: document.getElementById('menu-button')
      };
      this.overlays = ['mainMenu', 'levelSelectMenu', 'pauseMenu', 'victoryScreen'];
    }

    bind(game) {
      const el = this.elements;
      el.playButton.addEventListener('click', () => game.startCampaign());
      el.levelSelectButton.addEventListener('click', () => this.show('levelSelectMenu'));
      el.levelSelectBack.addEventListener('click', () => this.show('mainMenu'));
      el.pauseButton.addEventListener('click', () => game.togglePause());
      el.resumeButton.addEventListener('click', () => game.togglePause(false));
      el.restartButton.addEventListener('click', () => game.restartLevel());
      el.pauseLevelSelectButton.addEventListener('click', () => game.openLevelSelect());
      el.nextLevelButton.addEventListener('click', () => game.advanceAfterWin());
      el.victoryLevelSelectButton.addEventListener('click', () => game.openLevelSelect());
      el.menuButton.addEventListener('click', () => game.openMainMenu());
    }

    show(name) {
      for (const overlay of this.overlays) {
        this.elements[overlay].classList.toggle('overlay--visible', overlay === name);
      }
    }

    hideAll() {
      for (const overlay of this.overlays) {
        this.elements[overlay].classList.remove('overlay--visible');
      }
    }

    updateHud(levelIndex, crystalCount, crystalTotal, gravity) {
      this.elements.hudLevel.textContent = String(levelIndex + 1);
      this.elements.hudCrystals.textContent = `${crystalCount} / ${crystalTotal}`;
      this.elements.hudGravity.textContent = gravity > 0 ? 'Down' : 'Up';
    }

    renderLevelButtons(levels, unlockedLevel, onSelect) {
      const grid = this.elements.levelGrid;
      grid.innerHTML = '';
      levels.forEach((level, index) => {
        const button = document.createElement('button');
        const unlocked = index + 1 <= unlockedLevel;
        button.type = 'button';
        button.disabled = !unlocked;
        button.textContent = unlocked ? `${index + 1}` : '🔒';
        button.title = unlocked ? level.title : 'Locked';
        if (unlocked) {
          button.addEventListener('click', () => onSelect(index));
        }
        grid.appendChild(button);
      });
    }

    showVictory(message, hasNextLevel) {
      this.elements.victoryText.textContent = message;
      this.elements.nextLevelButton.textContent = hasNextLevel ? 'Next Level' : 'Play Again';
      this.show('victoryScreen');
    }
  }

  window.GravityShiftUI = UIManager;
})();
