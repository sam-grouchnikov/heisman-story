import { chapters, imageCitations, worksCited } from './storyContent.js'
import { firstCardAngle, eventSpacing, trackEnd, projectArc, readingScale, initializeReelTrack } from './reelTrack.js'

function watchScrollProgress(section, scene, render) {
  let frame = 0

  function measure() {
    frame = 0
    const distance = section.offsetHeight - scene.offsetHeight
    const offset = scene.getBoundingClientRect().top - section.getBoundingClientRect().top
    render(Math.max(0, Math.min(1, offset / Math.max(1, distance))))
  }

  function scheduleMeasure() {
    if (!frame) frame = requestAnimationFrame(measure)
  }


  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(section)
    observer.observe(scene)
  }
  window.addEventListener('resize', scheduleMeasure)
  window.addEventListener('scroll', scheduleMeasure, { passive: true })
  measure()
}

const intro = document.getElementById('intro')
const introScene = intro.querySelector('.intro-scene')
watchScrollProgress(intro, introScene, progress => {
  const travel = progress * 168
  introScene.style.setProperty('--intro-offset', `${progress * -24}px`)
  introScene.style.setProperty('--field-travel', `${travel}px`)
  introScene.style.setProperty('--yard-number-travel', `${travel % 84 * 0.45}px`)
})

const overview = document.getElementById('overview')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
let snapTimer = 0
let overviewReached = false

function scheduleOverviewSnap() {
  clearTimeout(snapTimer)
  const distance = Math.abs(overview.getBoundingClientRect().top)
  if (distance < 2) overviewReached = true
  if (distance > window.innerHeight / 2) overviewReached = false
  if (overviewReached || distance > Math.min(180, window.innerHeight / 4)) return

  // Snap once per approach and let the next scroll leave the overview.
  snapTimer = window.setTimeout(() => {
    overviewReached = true
    const top = overview.getBoundingClientRect().top
    if (reducedMotion.matches) {
      window.scrollBy(0, top)
    } else {
      window.scrollBy({ top, behavior: 'smooth' })
    }
  }, 110)
}

window.addEventListener('scroll', scheduleOverviewSnap, { passive: true })
scheduleOverviewSnap()

const events = []
const chapterStarts = chapters.map(chapter => {
  const start = events.length
  chapter.events.forEach((event, index) => {
    const summary = event.summary || event
    events.push({
      chapter,
      summary,
      title: summary.title || `Event ${formatNumber(index + 1)}`,
      date: summary.date,
      content: event.content || legacyEventContent(event),
    })
  })
  return start
})
const lastEvent = events.length - 1
const reelLength = lastEvent + 0.75

function formatNumber(value) {
  return String(value).padStart(2, '0')
}

function legacyEventContent(event) {
  const blocks = []
  if (event.image) {
    blocks.push({
      type: 'image',
      src: event.image,
      alt: event.imageAlt,
      caption: event.imageCredit,
    })
  }
  if (event.description) {
    for (const text of event.description.split(/\n\s*\n/)) {
      blocks.push({ type: 'paragraph', text })
    }
  }
  return blocks
}

function textElement(tagName, text) {
  const element = document.createElement(tagName)
  element.textContent = text
  return element
}

function eventImage(src, alt, className = '') {
  const image = document.createElement('img')
  const path = src.startsWith('/images/') ? `./public${src}` : src
  image.className = className
  image.alt = alt || ''
  image.loading = 'lazy'

  if (src === '/images/heisman-birthplace.avif' || src === '/images/forward-pass.avif') {
    image.addEventListener('error', () => {
      image.src = path.replace(/\.avif$/, '.jpg')
    }, { once: true })
  }
  image.src = path
  return image
}

function appendCitationRefs(element, numbers, linked = true) {
  if (!numbers || !numbers.length) return

  const refs = document.createElement('span')
  refs.className = 'citation-refs'
  for (const number of numbers) {
    const reference = textElement(linked ? 'a' : 'span', `[${number}]`)
    if (linked) {
      reference.href = `#source-${number}`
      reference.setAttribute('aria-label', `Works Cited source ${number}`)
    }
    refs.append(reference)
  }
  element.append(refs)
}

function appendImageCitation(element, src, linked = true) {
  const citation = imageCitations[src]
  if (!citation) return

  const credit = textElement('span', citation.context ? 'Context' : citation.credit || 'Image source')
  credit.className = 'image-citation'
  appendCitationRefs(credit, citation.numbers, linked)
  if (citation.context && linked) credit.append(textElement('span', ' · Image credit unverified'))
  element.append(credit)
}

const citationList = document.querySelector('.citation-list')
for (const { number, entry, container, details, url } of worksCited) {
  const item = document.createElement('li')
  item.id = `source-${number}`
  item.tabIndex = -1
  const numberLabel = textElement('span', `[${number}]`)
  numberLabel.className = 'citation-number'
  const citation = document.createElement('p')
  if (entry) citation.append(`${entry} `)
  citation.append(textElement('cite', container), details)
  if (url) {
    const link = textElement('a', 'View source')
    link.href = url
    link.setAttribute('aria-label', `Open source ${number}: ${entry || container}`)
    citation.append(' ', link)
  }
  item.append(numberLabel, citation)
  citationList.append(item)
}

const lanes = [-0.68, 0, 0.68]

const timeline = document.getElementById('timeline')
const scene = timeline.querySelector('.timeline-scene')
const era = timeline.querySelector('.timeline-era')
const years = timeline.querySelector('.timeline-years')
const track = timeline.querySelector('.reel-track')
const renderTrack = initializeReelTrack(track, chapters, chapterStarts, lastEvent)
const dates = track.querySelector('.reel-dates')
const cards = timeline.querySelector('.timeline-cards')
const cardTemplate = document.getElementById('event-card-template')
const slider = timeline.querySelector('.timeline-slider')
const range = slider.querySelector('input')
const previous = timeline.querySelector('[aria-label="Previous event"]')
const next = timeline.querySelector('[aria-label="Next event"]')
const eventCounter = timeline.querySelector('.event-navigation output')
eventCounter.lastChild.nodeValue = ` ${formatNumber(events.length)}`
const scrollHint = timeline.querySelector('p.timeline-scroll-hint')
const citedLink = timeline.querySelector('a.timeline-scroll-hint')

timeline.style.setProperty('--reel-length', reelLength)
timeline.style.setProperty('--event-intervals', lastEvent)
const sliderPercent = position => `${position / Math.max(1, lastEvent) * 100}%`
slider.style.setProperty('--during-start', sliderPercent(chapterStarts[1] - 0.5))
slider.style.setProperty('--after-start', sliderPercent(chapterStarts[2] - 0.5))
range.max = lastEvent

const chapterNav = timeline.querySelector('.chapter-nav')
const chapterButtons = chapters.map((chapter, index) => {
  const button = document.createElement('button')
  const dot = document.createElement('span')
  dot.className = 'chapter-dot'
  button.type = 'button'
  button.className = `era-${chapter.id}`
  button.append(dot, chapter.title)
  button.addEventListener('click', () => goToEvent(chapterStarts[index]))
  chapterNav.append(button)
  return button
})

let currentIndex = -1
let currentChapter
let previousPosition = -1
const visibleCards = new Map()

function goToEvent(index) {
  const sectionTop = timeline.getBoundingClientRect().top + window.scrollY
  const distance = timeline.offsetHeight - scene.offsetHeight
  const position = Math.max(0, Math.min(lastEvent, index))
  window.scrollTo(0, sectionTop + distance * position / reelLength)
  renderTimeline(position)
}

function renderTimeline(position) {
  if (position === previousPosition) return
  previousPosition = position
  const index = Math.round(position)

  if (index !== currentIndex) {
    currentIndex = index
    const event = events[index]
    if (event.chapter !== currentChapter) {
      currentChapter = event.chapter
      scene.className = `timeline-scene era-${currentChapter.id}`
      era.textContent = currentChapter.title
      years.textContent = currentChapter.years
      chapterButtons.forEach((button, chapterIndex) => {
        if (chapters[chapterIndex] === currentChapter) button.setAttribute('aria-current', 'step')
        else button.removeAttribute('aria-current')
      })
    }

    eventCounter.firstChild.nodeValue = `${formatNumber(index + 1)} `
    range.setAttribute('aria-valuetext', `${currentChapter.title}, ${event.title}`)
    previous.disabled = index === 0
    next.disabled = index === lastEvent
    scrollHint.hidden = index === lastEvent
    citedLink.hidden = index !== lastEvent
  }

  slider.style.setProperty('--timeline-progress', sliderPercent(position))
  range.value = position
  renderReel(position)
}

function renderReel(position) {
  renderTrack(position)

  const firstVisible = Math.max(0, Math.floor(position) - 1)
  const lastVisible = Math.min(lastEvent, Math.ceil(position) + 8)
  const indices = new Set()
  let nextCard = cards.firstElementChild
  let nextDate = dates.firstElementChild

  for (let index = firstVisible; index <= lastVisible; index++) {
    const angle = firstCardAngle + (index - position) * eventSpacing
    if (angle <= 0 || angle >= trackEnd) continue

    const { y, halfWidth, scale } = projectArc(angle)
    const { card, date } = visibleCards.get(index) || createCard(index)
    indices.add(index)
    if (!card.parentNode) {
      cards.insertBefore(card, nextCard)
      dates.insertBefore(date, nextDate)
    }
    nextCard = card.nextElementSibling
    nextDate = date.nextElementSibling

    const active = index === currentIndex
    card.classList.toggle('is-current', active)
    card.tabIndex = active ? 0 : -1
    card.style.setProperty('--card-x', `${lanes[index % lanes.length] * halfWidth * 100}%`)
    card.style.setProperty('--card-y', `${y * 100}%`)
    card.style.setProperty('--card-scale', scale / readingScale)
    card.style.setProperty('--card-tilt', `${(angle - firstCardAngle) * 180 / Math.PI}deg`)
    card.style.setProperty('--card-opacity', Math.min(1, angle / 0.05, (trackEnd - angle) / 0.28))

    date.style.left = `${(0.5 + halfWidth + 0.055 * scale) * 100}%`
    date.style.top = `${y * 100}%`
    date.style.setProperty('--marker-scale', scale / readingScale)
  }

  for (const [index, { card, date }] of visibleCards) {
    if (indices.has(index)) continue
    card.remove()
    date.remove()
    visibleCards.delete(index)
  }
}

function createCard(index) {
  const event = events[index]
  const card = cardTemplate.content.firstElementChild.cloneNode(true)
  card.classList.add(`era-${event.chapter.id}`)
  card.style.zIndex = events.length - index
  card.setAttribute('aria-label', `Open ${event.title}, ${event.chapter.title}`)
  card.querySelector('.event-card-era').textContent = event.chapter.title
  card.querySelector('.event-card-title').textContent = event.title
  const cardDate = card.querySelector('.event-date')
  cardDate.textContent = event.date || 'Date placeholder'
  appendCitationRefs(cardDate, event.summary.citations, false)

  const preview = card.querySelector('.event-card-preview')
  if (event.summary.description) {
    appendCitationRefs(preview, event.summary.previewCitations, false)
    preview.append(` ${event.summary.description}`)
  } else {
    preview.remove()
  }

  if (event.summary.image) {
    const placeholder = card.querySelector('.event-card-image-placeholder')
    const image = eventImage(event.summary.image, event.summary.imageAlt, 'event-card-image')
    const credit = document.createDocumentFragment()
    appendImageCitation(credit, event.summary.image, false)
    placeholder.replaceWith(image, credit)
  }

  card.addEventListener('click', () => openEvent(index))
  const date = textElement('span', event.date || formatNumber(index + 1))
  const entry = { card, date }
  visibleCards.set(index, entry)
  return entry
}

const dialog = timeline.querySelector('.event-dialog')
const detailCopy = dialog.querySelector('.event-detail-copy')
const detailTitle = dialog.querySelector('.event-detail-title')
const detailDate = detailTitle.querySelector('.event-date')
const detailHeading = detailTitle.querySelector('h2')
const detailEra = dialog.querySelector('.event-detail-bar-inner > span')
const detailBack = dialog.querySelector('.event-detail-back')
const nativeDialog = typeof dialog.showModal === 'function'

function openEvent(index) {
  if (index !== currentIndex) goToEvent(index)
  const event = events[index]
  dialog.className = `event-dialog era-${event.chapter.id}`
  detailDate.hidden = !event.date
  detailDate.textContent = event.date || ''
  appendCitationRefs(detailDate, event.summary.citations)
  detailHeading.textContent = event.title
  detailEra.textContent = event.chapter.title
  const blocks = event.content.length
    ? event.content.map(renderDetailBlock).filter(Boolean)
    : [textElement('p', '[Add the story for this event.]')]
  const cover = event.summary.image
  if (imageCitations[cover] && !event.content.some(block => block.src === cover)) {
    blocks.push(renderDetailBlock({ type: 'image', src: cover, alt: event.summary.imageAlt, caption: event.summary.imageAlt }))
  }
  while (detailTitle.nextElementSibling) detailTitle.nextElementSibling.remove()
  detailCopy.append(...blocks)
  document.documentElement.classList.add('event-detail-open')
  if (nativeDialog) {
    dialog.showModal()
  } else {
    dialog.setAttribute('open', '')
    detailBack.focus()
  }
  dialog.scrollTop = 0
}

function renderDetailBlock(block) {
  switch (block.type) {
    case 'heading':
      return textElement('h3', block.text)
    case 'paragraph': {
      const paragraph = textElement('p', block.text)
      appendCitationRefs(paragraph, block.citations)
      if (block.citationNote) {
        const note = textElement('span', ` [${block.citationNote}]`)
        note.className = 'citation-note'
        paragraph.append(note)
      }
      return paragraph
    }
    case 'image': {
      const figure = document.createElement('figure')
      figure.className = block.wide ? 'event-detail-image is-wide' : 'event-detail-image'
      figure.append(eventImage(block.src, block.alt))
      if (block.caption || imageCitations[block.src]) {
        const caption = document.createElement('figcaption')
        if (block.caption) caption.append(textElement('span', block.caption))
        appendImageCitation(caption, block.src)
        figure.append(caption)
      }
      return figure
    }
    default:
      return null
  }
}

let followingCitation = false

function restoreTimelineFocus() {
  document.documentElement.classList.remove('event-detail-open')
  const activeCard = visibleCards.get(currentIndex)
  if (activeCard && !followingCitation) activeCard.card.focus({ preventScroll: true })
  followingCitation = false
}

function closeEvent() {
  if (nativeDialog) {
    dialog.close()
  } else {
    dialog.removeAttribute('open')
    restoreTimelineFocus()
  }
}

if (nativeDialog) {
  dialog.addEventListener('close', restoreTimelineFocus)
} else {
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.querySelector('form').addEventListener('submit', event => {
    event.preventDefault()
    closeEvent()
  })
  document.addEventListener('keydown', event => {
    if (!dialog.hasAttribute('open')) return
    if (event.key === 'Escape') closeEvent()
    if (event.key !== 'Tab') return

    const focusable = dialog.querySelectorAll('button, a[href]')
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    const active = document.activeElement
    if (!dialog.contains(active) || (event.shiftKey ? active === first : active === last)) {
      event.preventDefault()
      const target = event.shiftKey ? last : first
      target.focus()
    }
  })
}

dialog.addEventListener('click', event => {
  const citation = event.target.closest('.citation-refs a')
  if (!citation || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  followingCitation = true
  document.documentElement.classList.remove('event-detail-open')
  closeEvent()
})

previous.addEventListener('click', () => goToEvent(currentIndex - 1))
next.addEventListener('click', () => goToEvent(currentIndex + 1))
range.addEventListener('input', () => goToEvent(range.valueAsNumber))
range.addEventListener('keydown', event => {
  const destinations = {
    ArrowLeft: currentIndex - 1,
    ArrowDown: currentIndex - 1,
    ArrowRight: currentIndex + 1,
    ArrowUp: currentIndex + 1,
    Home: 0,
    End: lastEvent,
  }
  if (!Object.prototype.hasOwnProperty.call(destinations, event.key)) return
  event.preventDefault()
  goToEvent(destinations[event.key])
})

if (window.scrollY === 0) {
  const target = document.getElementById(window.location.hash.slice(1))
  if (target) target.scrollIntoView()
}

watchScrollProgress(timeline, scene, progress => {
  renderTimeline(Math.min(lastEvent, progress * reelLength))
})
