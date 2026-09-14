(() => {
  const boundary = () => [
    { x: 0, y: 0, w: 960, h: 20 },
    { x: 0, y: 520, w: 960, h: 20 },
    { x: 0, y: 0, w: 20, h: 540 },
    { x: 940, y: 0, w: 20, h: 540 }
  ];

  const combine = (...groups) => groups.flat();

  const levels = [
    {
      title: 'Orientation Chamber',
      start: { x: 70, y: 452 },
      exit: { x: 860, y: 444, w: 44, h: 56, requiredCrystals: 0 },
      platforms: combine(boundary(), [
        { x: 180, y: 440, w: 140, h: 18 },
        { x: 370, y: 380, w: 140, h: 18 },
        { x: 560, y: 330, w: 150, h: 18 },
        { x: 720, y: 270, w: 110, h: 18 },
        { x: 650, y: 120, w: 180, h: 18 }
      ]),
      spikes: [{ x: 520, y: 502, w: 80, h: 18 }],
      movingPlatforms: [],
      gravityZones: [],
      portals: [{ x: 760, y: 225, w: 42, h: 42 }],
      fallingBlocks: [],
      lasers: [],
      crystals: [
        { x: 256, y: 404, r: 10 },
        { x: 625, y: 294, r: 10 }
      ]
    },
    {
      title: 'Ceiling Sprint',
      start: { x: 70, y: 452 },
      exit: { x: 845, y: 48, w: 44, h: 56, requiredCrystals: 2 },
      platforms: combine(boundary(), [
        { x: 150, y: 450, w: 140, h: 18 },
        { x: 320, y: 390, w: 110, h: 18 },
        { x: 470, y: 320, w: 100, h: 18 },
        { x: 610, y: 245, w: 80, h: 18 },
        { x: 720, y: 150, w: 120, h: 18 },
        { x: 750, y: 90, w: 140, h: 18 }
      ]),
      spikes: [
        { x: 250, y: 502, w: 120, h: 18 },
        { x: 588, y: 502, w: 120, h: 18 }
      ],
      movingPlatforms: [],
      gravityZones: [{ x: 665, y: 182, w: 96, h: 124, direction: -1 }],
      portals: [],
      fallingBlocks: [],
      lasers: [],
      crystals: [
        { x: 345, y: 354, r: 10 },
        { x: 770, y: 114, r: 10 },
        { x: 790, y: 54, r: 10 }
      ]
    },
    {
      title: 'Moving Current',
      start: { x: 60, y: 452 },
      exit: { x: 845, y: 444, w: 44, h: 56, requiredCrystals: 0 },
      platforms: combine(boundary(), [
        { x: 120, y: 430, w: 120, h: 18 },
        { x: 320, y: 350, w: 110, h: 18 },
        { x: 695, y: 405, w: 160, h: 18 }
      ]),
      spikes: [
        { x: 250, y: 502, w: 120, h: 18 },
        { x: 520, y: 502, w: 100, h: 18 }
      ],
      movingPlatforms: [
        { x: 250, y: 280, w: 110, h: 18, axis: 'x', range: 150, speed: 1.2, phase: 0 },
        { x: 490, y: 215, w: 120, h: 18, axis: 'y', range: 90, speed: 1.8, phase: 0.8 }
      ],
      gravityZones: [],
      portals: [{ x: 575, y: 164, w: 40, h: 40 }],
      fallingBlocks: [],
      lasers: [],
      crystals: [
        { x: 290, y: 244, r: 10 },
        { x: 545, y: 170, r: 10 },
        { x: 815, y: 370, r: 10 }
      ]
    },
    {
      title: 'Portal Relay',
      start: { x: 64, y: 452 },
      exit: { x: 842, y: 56, w: 44, h: 56, requiredCrystals: 3 },
      platforms: combine(boundary(), [
        { x: 140, y: 445, w: 150, h: 18 },
        { x: 330, y: 365, w: 120, h: 18 },
        { x: 520, y: 280, w: 120, h: 18 },
        { x: 690, y: 205, w: 120, h: 18 },
        { x: 710, y: 94, w: 170, h: 18 }
      ]),
      spikes: [
        { x: 307, y: 502, w: 100, h: 18 },
        { x: 640, y: 502, w: 100, h: 18 }
      ],
      movingPlatforms: [
        { x: 470, y: 420, w: 95, h: 18, axis: 'x', range: 120, speed: 1.6, phase: 0.4 }
      ],
      gravityZones: [{ x: 735, y: 126, w: 120, h: 90, direction: -1 }],
      portals: [
        { x: 396, y: 322, w: 38, h: 38 },
        { x: 594, y: 236, w: 38, h: 38 }
      ],
      fallingBlocks: [],
      lasers: [],
      crystals: [
        { x: 375, y: 330, r: 10 },
        { x: 565, y: 244, r: 10 },
        { x: 770, y: 170, r: 10 },
        { x: 812, y: 58, r: 10 }
      ]
    },
    {
      title: 'Laser Lattice',
      start: { x: 60, y: 452 },
      exit: { x: 856, y: 444, w: 44, h: 56, requiredCrystals: 2 },
      platforms: combine(boundary(), [
        { x: 120, y: 440, w: 120, h: 18 },
        { x: 280, y: 390, w: 120, h: 18 },
        { x: 450, y: 335, w: 120, h: 18 },
        { x: 640, y: 385, w: 120, h: 18 }
      ]),
      spikes: [
        { x: 405, y: 502, w: 80, h: 18 },
        { x: 770, y: 502, w: 90, h: 18 }
      ],
      movingPlatforms: [
        { x: 610, y: 250, w: 110, h: 18, axis: 'y', range: 110, speed: 1.1, phase: 1.4 }
      ],
      gravityZones: [{ x: 468, y: 180, w: 100, h: 115, direction: -1 }],
      portals: [],
      fallingBlocks: [],
      lasers: [
        { x: 248, y: 320, w: 14, h: 118, cycle: 2.4, onDuration: 1.35, phase: 0 },
        { x: 575, y: 245, w: 14, h: 140, cycle: 2.9, onDuration: 1.6, phase: 1.1 },
        { x: 762, y: 220, w: 14, h: 200, cycle: 2.2, onDuration: 1.15, phase: 0.6 }
      ],
      crystals: [
        { x: 318, y: 355, r: 10 },
        { x: 516, y: 205, r: 10 },
        { x: 655, y: 220, r: 10 }
      ]
    },
    {
      title: 'Falling Press',
      start: { x: 56, y: 452 },
      exit: { x: 844, y: 444, w: 44, h: 56, requiredCrystals: 0 },
      platforms: combine(boundary(), [
        { x: 120, y: 445, w: 130, h: 18 },
        { x: 290, y: 370, w: 130, h: 18 },
        { x: 500, y: 308, w: 110, h: 18 },
        { x: 690, y: 250, w: 110, h: 18 },
        { x: 720, y: 410, w: 130, h: 18 }
      ]),
      spikes: [
        { x: 230, y: 502, w: 90, h: 18 },
        { x: 610, y: 502, w: 90, h: 18 }
      ],
      movingPlatforms: [],
      gravityZones: [],
      portals: [{ x: 748, y: 204, w: 38, h: 38 }],
      fallingBlocks: [
        { x: 345, y: 150, w: 46, h: 46, triggerDistance: 150 },
        { x: 555, y: 110, w: 46, h: 46, triggerDistance: 170 },
        { x: 795, y: 80, w: 46, h: 46, triggerDistance: 180 }
      ],
      lasers: [],
      crystals: [
        { x: 342, y: 334, r: 10 },
        { x: 545, y: 271, r: 10 },
        { x: 752, y: 375, r: 10 }
      ]
    },
    {
      title: 'Split Stream',
      start: { x: 56, y: 452 },
      exit: { x: 838, y: 52, w: 44, h: 56, requiredCrystals: 3 },
      platforms: combine(boundary(), [
        { x: 120, y: 445, w: 120, h: 18 },
        { x: 270, y: 350, w: 110, h: 18 },
        { x: 450, y: 430, w: 120, h: 18 },
        { x: 575, y: 300, w: 110, h: 18 },
        { x: 710, y: 160, w: 150, h: 18 },
        { x: 715, y: 90, w: 180, h: 18 }
      ]),
      spikes: [
        { x: 395, y: 502, w: 80, h: 18 },
        { x: 610, y: 502, w: 90, h: 18 }
      ],
      movingPlatforms: [
        { x: 405, y: 245, w: 95, h: 18, axis: 'x', range: 110, speed: 1.5, phase: 0.3 },
        { x: 620, y: 220, w: 90, h: 18, axis: 'y', range: 70, speed: 1.4, phase: 2.2 }
      ],
      gravityZones: [
        { x: 438, y: 120, w: 110, h: 95, direction: -1 },
        { x: 720, y: 190, w: 100, h: 90, direction: 1 }
      ],
      portals: [],
      fallingBlocks: [],
      lasers: [
        { x: 540, y: 168, w: 18, h: 132, cycle: 2.5, onDuration: 1.25, phase: 0.7 }
      ],
      crystals: [
        { x: 305, y: 315, r: 10 },
        { x: 450, y: 210, r: 10 },
        { x: 640, y: 186, r: 10 },
        { x: 828, y: 126, r: 10 }
      ]
    },
    {
      title: 'Locked Core',
      start: { x: 58, y: 452 },
      exit: { x: 842, y: 444, w: 44, h: 56, requiredCrystals: 4 },
      platforms: combine(boundary(), [
        { x: 100, y: 445, w: 120, h: 18 },
        { x: 260, y: 375, w: 110, h: 18 },
        { x: 420, y: 305, w: 110, h: 18 },
        { x: 610, y: 235, w: 120, h: 18 },
        { x: 760, y: 365, w: 100, h: 18 }
      ]),
      spikes: [
        { x: 210, y: 502, w: 110, h: 18 },
        { x: 535, y: 502, w: 110, h: 18 },
        { x: 725, y: 502, w: 85, h: 18 }
      ],
      movingPlatforms: [
        { x: 360, y: 230, w: 90, h: 18, axis: 'x', range: 110, speed: 1.9, phase: 1.1 }
      ],
      gravityZones: [{ x: 658, y: 120, w: 100, h: 90, direction: -1 }],
      portals: [{ x: 792, y: 322, w: 36, h: 36 }],
      fallingBlocks: [
        { x: 665, y: 65, w: 44, h: 44, triggerDistance: 150 }
      ],
      lasers: [
        { x: 578, y: 165, w: 14, h: 70, cycle: 1.9, onDuration: 1.1, phase: 0.1 }
      ],
      crystals: [
        { x: 295, y: 338, r: 10 },
        { x: 455, y: 268, r: 10 },
        { x: 678, y: 85, r: 10 },
        { x: 790, y: 286, r: 10 },
        { x: 810, y: 330, r: 10 }
      ]
    },
    {
      title: 'Inversion Gauntlet',
      start: { x: 58, y: 452 },
      exit: { x: 835, y: 54, w: 44, h: 56, requiredCrystals: 4 },
      platforms: combine(boundary(), [
        { x: 110, y: 445, w: 115, h: 18 },
        { x: 240, y: 365, w: 95, h: 18 },
        { x: 365, y: 300, w: 90, h: 18 },
        { x: 500, y: 230, w: 90, h: 18 },
        { x: 635, y: 160, w: 100, h: 18 },
        { x: 760, y: 92, w: 140, h: 18 }
      ]),
      spikes: [
        { x: 225, y: 502, w: 90, h: 18 },
        { x: 595, y: 502, w: 95, h: 18 }
      ],
      movingPlatforms: [
        { x: 430, y: 410, w: 100, h: 18, axis: 'x', range: 120, speed: 1.3, phase: 0.1 },
        { x: 605, y: 305, w: 88, h: 18, axis: 'y', range: 90, speed: 1.7, phase: 1.7 }
      ],
      gravityZones: [
        { x: 280, y: 190, w: 110, h: 95, direction: -1 },
        { x: 660, y: 250, w: 105, h: 90, direction: 1 }
      ],
      portals: [
        { x: 532, y: 188, w: 38, h: 38 },
        { x: 786, y: 52, w: 38, h: 38 }
      ],
      fallingBlocks: [
        { x: 305, y: 75, w: 42, h: 42, triggerDistance: 140 },
        { x: 585, y: 65, w: 42, h: 42, triggerDistance: 150 }
      ],
      lasers: [
        { x: 348, y: 238, w: 14, h: 128, cycle: 2.1, onDuration: 1.3, phase: 0.4 },
        { x: 730, y: 110, w: 14, h: 140, cycle: 2.6, onDuration: 1.4, phase: 0.9 }
      ],
      crystals: [
        { x: 272, y: 328, r: 10 },
        { x: 418, y: 264, r: 10 },
        { x: 630, y: 272, r: 10 },
        { x: 683, y: 125, r: 10 },
        { x: 810, y: 56, r: 10 }
      ]
    },
    {
      title: 'Final Escape',
      start: { x: 60, y: 452 },
      exit: { x: 840, y: 52, w: 44, h: 56, requiredCrystals: 5 },
      platforms: combine(boundary(), [
        { x: 100, y: 445, w: 105, h: 18 },
        { x: 220, y: 380, w: 95, h: 18 },
        { x: 335, y: 315, w: 95, h: 18 },
        { x: 460, y: 255, w: 95, h: 18 },
        { x: 580, y: 188, w: 95, h: 18 },
        { x: 690, y: 132, w: 95, h: 18 },
        { x: 770, y: 92, w: 140, h: 18 }
      ]),
      spikes: [
        { x: 195, y: 502, w: 80, h: 18 },
        { x: 440, y: 502, w: 100, h: 18 },
        { x: 650, y: 502, w: 90, h: 18 }
      ],
      movingPlatforms: [
        { x: 285, y: 228, w: 92, h: 18, axis: 'x', range: 120, speed: 1.5, phase: 0.8 },
        { x: 520, y: 348, w: 92, h: 18, axis: 'y', range: 105, speed: 1.8, phase: 0.6 },
        { x: 685, y: 280, w: 92, h: 18, axis: 'x', range: 95, speed: 2.1, phase: 1.3 }
      ],
      gravityZones: [
        { x: 180, y: 200, w: 100, h: 90, direction: -1 },
        { x: 470, y: 115, w: 100, h: 90, direction: 1 },
        { x: 725, y: 190, w: 90, h: 90, direction: -1 }
      ],
      portals: [
        { x: 392, y: 274, w: 36, h: 36 },
        { x: 618, y: 148, w: 36, h: 36 }
      ],
      fallingBlocks: [
        { x: 240, y: 90, w: 42, h: 42, triggerDistance: 140 },
        { x: 528, y: 62, w: 42, h: 42, triggerDistance: 150 },
        { x: 760, y: 48, w: 42, h: 42, triggerDistance: 150 }
      ],
      lasers: [
        { x: 320, y: 260, w: 14, h: 120, cycle: 2.0, onDuration: 1.1, phase: 0.5 },
        { x: 555, y: 190, w: 14, h: 158, cycle: 2.7, onDuration: 1.55, phase: 0.9 },
        { x: 798, y: 112, w: 14, h: 168, cycle: 2.3, onDuration: 1.2, phase: 1.2 }
      ],
      crystals: [
        { x: 248, y: 346, r: 10 },
        { x: 398, y: 280, r: 10 },
        { x: 542, y: 317, r: 10 },
        { x: 624, y: 156, r: 10 },
        { x: 725, y: 244, r: 10 },
        { x: 820, y: 58, r: 10 }
      ]
    }
  ];

  window.GravityShiftLevels = levels;
})();
