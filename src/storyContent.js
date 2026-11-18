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

const historyPhotoSource = 'https://www.history.com/articles/john-heisman-coach-college-football-trophy'

export const introduction = {
  title: 'John Heisman',
  subtitle: 'The Coach Behind the Trophy',
  location: 'Grant Field · Atlanta',
  heading: '222–0',
  gameStory: 'On October 7, 1916, the Georgia Tech Golden Tornadoes beat Cumberland by a margin that still stands as the largest in college football history.',
  question: 'Who coached Georgia Tech that day?',
  description: [
    'Every year, the Heisman Trophy goes to an outstanding college football player. It took John Heisman’s name after his death in 1936, honoring a coach who had already changed how the game was played.',
    'Heisman coached at Georgia Tech from 1904 to 1919. He pressed for the rule change that legalized the forward pass in 1906 and led Georgia Tech to its first national championship in 1917.',
  ],
  lead: 'The story begins in the fall of 1869, when Heisman was born in Cleveland, Ohio.',
  gamePhotos: [
    {
      src: '/images/cumberland-game-1916.jpg',
      width: 800,
      height: 617,
      alt: 'Football players gather around a tackle at Grant Field',
      caption: 'Georgia Tech vs. Cumberland, 1916',
      credit: 'Georgia Tech Archives',
      source: 'https://repository.gatech.edu/bitstreams/5a059260-e64e-490e-b989-7df0b8c51a7e/download',
    },
    {
      src: '/images/cumberland-scoreboard-1916.jpg',
      width: 1200,
      height: 515,
      alt: 'Scoreboard showing Georgia Tech scoring 63, 63, 54 and 42 by quarter for a total of 222, with Cumberland at zero',
      caption: 'The final score',
      credit: 'From The Rumble Seat',
      source: 'https://www.fromtherumbleseat.com/2011/10/7/2475194/95-years-ago-today-georgia-tech-defeated-cumberland-222-0',
    },
  ],
  overviewPhotos: [
    {
      src: '/images/john-heisman-portrait.jpg',
      width: 1080,
      height: 540,
      alt: 'Black-and-white portrait of John Heisman in a dark athletic shirt',
      caption: 'John Heisman',
      credit: 'Collegiate Images / Getty Images',
      source: historyPhotoSource,
    },
    {
      src: '/images/heisman-memorial-trophy.jpg',
      width: 1200,
      height: 766,
      alt: 'The bronze Heisman Trophy depicts a football player with one arm extended',
      caption: 'The Heisman Memorial Trophy',
      credit: 'Kelly Kline / Heisman Trophy Trust / Getty Images',
      source: historyPhotoSource,
    },
  ],
}

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

// Replace the templates with the entries for the sources your team actually uses.
// The container field appears in italics.
export const worksCited = [
  {
    type: 'Web page',
    entry: '[Last Name, First Name]. “[Title of Page].”',
    container: '[Website Name]',
    details: ', [Publisher], [Day Mon. Year], [URL].',
  },
  {
    type: 'Journal article',
    entry: '[Last Name, First Name]. “[Article Title].”',
    container: '[Journal Title]',
    details: ', vol. [#], no. [#], [Year], pp. [##–##]. [DOI or URL].',
  },
  {
    type: 'Archival photograph',
    entry: '[Creator Last Name, First Name]. “[Photograph Title].” [Day Mon. Year].',
    container: '[Collection Name]',
    details: ', [Box or Identifier], [Archive or Repository], [URL].',
  },
]
