// Edit the matching file in src/events to update an event.
// See before-tech-01.js for an example of the summary and content fields.

import beforeTech01 from './events/before-tech-01.js'
import beforeTech02 from './events/before-tech-02.js'
import beforeTech03 from './events/before-tech-03.js'
import beforeTech04 from './events/before-tech-04.js'
import beforeTech05 from './events/before-tech-05.js'
import beforeTech06 from './events/before-tech-06.js'
import beforeTech07 from './events/before-tech-07.js'
import beforeTech08 from './events/before-tech-08.js'
import beforeTech09 from './events/before-tech-09.js'
import beforeTech10 from './events/before-tech-10.js'
import beforeTech11 from './events/before-tech-11.js'
import beforeTech12 from './events/before-tech-12.js'
import beforeTech13 from './events/before-tech-13.js'

import duringTech01 from './events/during-tech-01.js'
import duringTech02 from './events/during-tech-02.js'
import duringTech03 from './events/during-tech-03.js'
import duringTech04 from './events/during-tech-04.js'
import duringTech05 from './events/during-tech-05.js'
import duringTech06 from './events/during-tech-06.js'

import afterTech01 from './events/after-tech-01.js'
import afterTech02 from './events/after-tech-02.js'
import afterTech03 from './events/after-tech-03.js'
import afterTech04 from './events/after-tech-04.js'
import afterTech05 from './events/after-tech-05.js'

export { worksCited } from './worksCited.js'

export const chapters = [
  {
    id: 'before',
    title: 'Before Tech',
    years: '1869–1903',
    events: [
      beforeTech01,
      beforeTech02,
      beforeTech03,
      beforeTech04,
      beforeTech05,
      beforeTech06,
      beforeTech07,
      beforeTech08,
      beforeTech09,
      beforeTech10,
      beforeTech11,
      beforeTech12,
      beforeTech13,
    ],
  },
  {
    id: 'during',
    title: 'During Tech',
    years: '1904–1919',
    events: [
      duringTech01,
      duringTech02,
      duringTech03,
      duringTech04,
      duringTech05,
      duringTech06,
    ],
  },
  {
    id: 'after',
    title: 'After Tech',
    years: '1920 onward',
    events: [
      afterTech01,
      afterTech02,
      afterTech03,
      afterTech04,
      afterTech05,
    ],
  },
]

// Context citations support what an image shows when its original credit is unknown.
export const imageCitations = {
  '/images/heisman-birthplace.avif': { numbers: [34], context: true },
  '/images/heisman-1887-salutatorian.png': { numbers: [31, 33], context: true },
  '/images/heisman-upenn-1890.png': { numbers: [28, 31], context: true },
  '/images/heisman-oberlin-1892.png': { numbers: [31], credit: 'Oberlin College Archives' },
  '/images/heisman-auburn-1896.png': { numbers: [35, 40], context: true },
  '/images/heisman-clemson-1901.jpg': { numbers: [38], credit: '1901 Clemsonian' },
  '/images/heisman-clemson-1902-team.png': { numbers: [39], credit: '1903 Oconeean' },
  '/images/heisman-play-handbill.png': { numbers: [37], credit: 'Alabama Heritage via The War Eagle Reader' },
  '/images/john-heisman-georgia-tech.jpg': { numbers: [5], context: true },
  '/images/georgia-tech-football-team-1916.jpg': { numbers: [25], context: true },
  '/images/heisman-fetzer-elcock.jpg': { numbers: [25], context: true },
  '/images/georgia-tech-baseball-team-1906.jpg': { numbers: [2, 5], context: true },
  '/images/heisman-yellow-jackets-clipping.jpg': { numbers: [5], context: true },
  '/images/cumberland-game-1916.jpg': { numbers: [21], credit: 'Georgia Tech Archives' },
  '/images/cumberland-scoreboard-project-plan.jpg': { numbers: [22], context: true },
  '/images/Football Team at Penn coached by Heisman.png': { numbers: [19, 28], context: true },
  '/images/“Principles of Football” by John Heisman.png': { numbers: [30], context: true },
  '/images/Heisman Gym.png': { numbers: [15], context: true },
  '/images/Heisman’s Grave.png': { numbers: [3], context: true },
  '/images/Heisman Trophy.png': { numbers: [27], context: true },
}
