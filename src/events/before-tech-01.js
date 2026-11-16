// Edit summary for the card preview. Its title and date also head the event page.
// Arrange heading, paragraph, and image blocks in content in the order you want.

export default {
  summary: {
    title: 'Example event title',
    date: 'Example date',
    image: '/images/placeholder-event-1.png',
    imageAlt: 'Describe what the photo shows',
    description: 'Tell the story here.',
  },
  content: [
    { type: 'heading', text: 'Heading here' },
    { type: 'paragraph', text: 'Tell the story here.' },
    {
      type: 'image',
      src: '/images/placeholder-event-1.png',
      alt: 'Describe what the photo shows',
      caption: 'Source name (will be links later)',
    },
    { type: 'paragraph', text: 'Start a new paragraph here.' },
  ],
}
