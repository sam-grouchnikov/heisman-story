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
import duringTech07 from './events/during-tech-07.js'
import duringTech08 from './events/during-tech-08.js'
import duringTech09 from './events/during-tech-09.js'
import duringTech10 from './events/during-tech-10.js'

import afterTech01 from './events/after-tech-01.js'
import afterTech02 from './events/after-tech-02.js'
import afterTech03 from './events/after-tech-03.js'
import afterTech04 from './events/after-tech-04.js'
import afterTech05 from './events/after-tech-05.js'
import afterTech06 from './events/after-tech-06.js'
import afterTech07 from './events/after-tech-07.js'
import afterTech08 from './events/after-tech-08.js'
import afterTech09 from './events/after-tech-09.js'
import afterTech10 from './events/after-tech-10.js'

export const introduction = {
  title: 'John Heisman',
  subtitle: 'The Life Behind the Legend',
  description: 'John Heisman coached Georgia Tech football from 1904 to 1919 and led the team to its first national title in 1917. He pushed to legalize the forward pass, helping reshape the game. The Heisman Memorial Trophy was named for him after his death.',
  location: 'Grant Field · Atlanta',
  date: 'October 7, 1916',
  question: 'Who coached this game?',
  homeTeam: 'Georgia Tech',
  homeScore: '222',
  awayTeam: 'Cumberland',
  awayScore: '0',
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
      duringTech07,
      duringTech08,
      duringTech09,
      duringTech10,
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
      afterTech06,
      afterTech07,
      afterTech08,
      afterTech09,
      afterTech10,
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
