// Replace an empty object with an event in chronological order. Every field is optional.
// Example: { title: 'Event title', date: '1904', image: '/images/photo.jpg',
//   imageAlt: 'Description of the photo', imageCredit: 'Archive or photographer',
//   description: 'Your story goes here.' }
// Put local photos in public/images. Use a blank line to start a new paragraph.

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
      {}, // 01
      {}, // 02
      {}, // 03
      {}, // 04
      {}, // 05
      {}, // 06
      {}, // 07
      {}, // 08
      {}, // 09
      {}, // 10
    ],
  },
  {
    id: 'during',
    title: 'During Tech',
    years: '1904–1919',
    events: [
      {}, // 01
      {}, // 02
      {}, // 03
      {}, // 04
      {}, // 05
      {}, // 06
      {}, // 07
      {}, // 08
      {}, // 09
      {}, // 10
    ],
  },
  {
    id: 'after',
    title: 'After Tech',
    years: '1920 onward',
    events: [
      {}, // 01
      {}, // 02
      {}, // 03
      {}, // 04
      {}, // 05
      {}, // 06
      {}, // 07
      {}, // 08
      {}, // 09
      {}, // 10
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
