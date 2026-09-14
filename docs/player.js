(() => {
  const { clamp, lerp } = window.GravityShiftPhysics;

  class Player {
    constructor() {
      this.w = 28;
      this.h = 40;
      this.moveSpeed = 290;
      this.jumpStrength = 560;
      this.gravityForce = 1700;
      this.acceleration = 2400;
      this.drag = 1800;
      this.reset({ x: 0, y: 0 });
    }

    reset(start) {
      this.x = start.x;
      this.y = start.y;
      this.vx = 0;
      this.vy = 0;
      this.gravity = 1;
      this.visualGravity = 1;
      this.grounded = false;
      this.flipCooldown = 0;
      this.gravityBlend = 0;
      this.deathTimer = 0;
      this.standingPlatform = null;
      this.zoneLock = false;
      this.portalLock = false;
    }

    get rect() {
      return { x: this.x, y: this.y, w: this.w, h: this.h };
    }

    get center() {
      return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
    }

    canFlip() {
      return this.flipCooldown <= 0;
    }

    setGravity(direction) {
      if (direction !== 1 && direction !== -1) {
        return false;
      }
      if (this.gravity === direction || !this.canFlip()) {
        return false;
      }
      this.gravity = direction;
      this.flipCooldown = 0.24;
      this.gravityBlend = 1;
      this.grounded = false;
      this.vy *= 0.25;
      return true;
    }

    flip() {
      return this.setGravity(this.gravity * -1);
    }

    update(input, dt) {
      const direction = (input.left ? -1 : 0) + (input.right ? 1 : 0);
      const targetSpeed = direction * this.moveSpeed;
      const accel = direction !== 0 ? this.acceleration : this.drag;
      const step = accel * dt;
      if (this.vx < targetSpeed) {
        this.vx = Math.min(targetSpeed, this.vx + step);
      } else if (this.vx > targetSpeed) {
        this.vx = Math.max(targetSpeed, this.vx - step);
      }

      this.flipCooldown = Math.max(0, this.flipCooldown - dt);
      this.gravityBlend = Math.max(0, this.gravityBlend - dt * 3.6);
      this.visualGravity = lerp(this.visualGravity, this.gravity, clamp(dt * 10, 0, 1));
      this.vy += this.gravityForce * this.gravity * dt;

      if (input.jumpPressed && this.grounded) {
        this.vy = -this.gravity * this.jumpStrength;
        this.grounded = false;
        this.standingPlatform = null;
      }

      if (input.flipPressed) {
        this.flip();
      }
    }
  }

  window.GravityShiftPlayer = Player;
})();
