(() => {
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (start, end, t) => start + (end - start) * t;

  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function contains(rect, point) {
    return point.x >= rect.x && point.x <= rect.x + rect.w && point.y >= rect.y && point.y <= rect.y + rect.h;
  }

  function updateMovingPlatform(platform, time) {
    const offset = Math.sin(time * platform.speed + platform.phase) * platform.range;
    const x = platform.axis === 'x' ? platform.x + offset : platform.x;
    const y = platform.axis === 'y' ? platform.y + offset : platform.y;
    const previous = platform.current || { x, y, w: platform.w, h: platform.h };

    platform.current = { x, y, w: platform.w, h: platform.h };
    platform.deltaX = x - previous.x;
    platform.deltaY = y - previous.y;
    return platform.current;
  }

  function updateFallingBlock(block, player, solids, dt) {
    if (!block.current) {
      block.current = { x: block.x, y: block.y, w: block.w, h: block.h };
      block.velocityY = 0;
      block.active = false;
      block.settled = false;
    }

    const horizontalDistance = Math.abs((player.x + player.w / 2) - (block.current.x + block.current.w / 2));
    const playerBelow = player.y > block.current.y;
    if (!block.active && !block.settled && playerBelow && horizontalDistance < block.triggerDistance) {
      block.active = true;
    }

    if (!block.active || block.settled) {
      return block.current;
    }

    block.velocityY += 1900 * dt;
    block.current.y += block.velocityY * dt;

    for (const solid of solids) {
      if (!overlaps(block.current, solid)) {
        continue;
      }
      if (block.velocityY >= 0 && block.current.y + block.current.h <= solid.y + block.velocityY * dt + 8) {
        block.current.y = solid.y - block.current.h;
        block.velocityY = 0;
        block.settled = true;
        break;
      }
    }

    return block.current;
  }

  function isLaserActive(laser, time) {
    const cycleTime = (time + laser.phase) % laser.cycle;
    return cycleTime < laser.onDuration;
  }

  function resolveActorWorld(actor, solids, dt) {
    let grounded = false;
    let standingPlatform = null;
    const previousX = actor.x;
    const previousY = actor.y;

    actor.x += actor.vx * dt;
    for (const solid of solids) {
      if (!overlaps(actor, solid)) {
        continue;
      }
      if (actor.vx > 0) {
        actor.x = solid.x - actor.w;
      } else if (actor.vx < 0) {
        actor.x = solid.x + solid.w;
      }
      actor.vx = 0;
    }

    actor.y += actor.vy * dt;
    for (const solid of solids) {
      if (!overlaps(actor, solid)) {
        continue;
      }

      const previousBottom = previousY + actor.h;
      const previousTop = previousY;
      const movingDown = actor.vy >= 0;

      if (movingDown && previousBottom <= solid.y + 6) {
        actor.y = solid.y - actor.h;
        grounded = actor.gravity > 0;
        standingPlatform = solid.source || null;
      } else if (!movingDown && previousTop >= solid.y + solid.h - 6) {
        actor.y = solid.y + solid.h;
        grounded = actor.gravity < 0;
        standingPlatform = solid.source || null;
      } else if (previousX + actor.w <= solid.x + 6) {
        actor.x = solid.x - actor.w;
      } else if (previousX >= solid.x + solid.w - 6) {
        actor.x = solid.x + solid.w;
      }

      actor.vy = 0;
    }

    return { grounded, standingPlatform };
  }

  window.GravityShiftPhysics = {
    clamp,
    lerp,
    overlaps,
    contains,
    updateMovingPlatform,
    updateFallingBlock,
    isLaserActive,
    resolveActorWorld
  };
})();
