import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { chapters, introduction, worksCited } from './storyContent'
import './App.css'

const events = chapters.flatMap(chapter =>
  chapter.events.map((event, index) => {
    const summary = event.summary ?? event
    return {
      chapter,
      summary,
      title: summary.title || `Event ${formatNumber(index + 1)}`,
      date: summary.date,
      content: event.content ?? legacyEventContent(event),
    }
  }),
)
const chapterStarts = chapters.map(chapter => events.findIndex(event => event.chapter === chapter))
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

function eventImageSource(src) {
  return src.startsWith('/images/') ? `${import.meta.env.BASE_URL}${src.slice(1)}` : src
}

function Icon({ name, size = 20 }) {
  const paths = {
    football: <><path d="M4 20C1 12 7 3 20 4c3 8-3 17-16 16Z" /><path d="m8 16 8-8M9 11l4 4M11 9l4 4M13 7l4 4M4 14l6 6M14 4l6 6" /></>,
    left: <path d="M19 12H5m6 6-6-6 6-6" />,
    right: <path d="M5 12h14m-6-6 6 6-6 6" />,
    down: <path d="M12 5v14m-6-6 6 6 6-6" />,
    up: <path d="M12 19V5m-6 6 6-6 6 6" />,
    image: <><rect x="3" y="4" width="18" height="16" rx="1" /><circle cx="9" cy="9" r="1.5" /><path d="m4 17 5-4 4 3 3-5 5 5" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function useScrollProgress(sectionRef, sceneRef) {
  const [progress, setProgress] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    const section = sectionRef.current
    const scene = sceneRef.current
    const measure = () => {
      frame.current = 0
      const distance = section.offsetHeight - scene.offsetHeight
      const offset = scene.getBoundingClientRect().top - section.getBoundingClientRect().top
      setProgress(Math.max(0, Math.min(1, offset / Math.max(1, distance))))
    }

    const scheduleMeasure = () => {
      if (!frame.current) frame.current = requestAnimationFrame(measure)
    }

    const observer = new ResizeObserver(scheduleMeasure)
    observer.observe(section)
    observer.observe(scene)
    window.addEventListener('scroll', scheduleMeasure, { passive: true })
    measure()

    return () => {
      cancelAnimationFrame(frame.current)
      frame.current = 0
      observer.disconnect()
      window.removeEventListener('scroll', scheduleMeasure)
    }
  }, [sectionRef, sceneRef])

  return [progress, setProgress]
}

function Field({ motion = 0, className = '' }) {
  return (
    <div className={`field ${className}`} aria-hidden="true" style={{ '--field-travel': `${motion}px` }}>
      <div className="field-stands field-stands-left" />
      <div className="field-stands field-stands-right" />
      <div className="field-perspective">
        <div className="field-plane">
          <div className="field-yard-lines" />
          <div className="field-hashes" />
          <div className="field-yard-numbers">
            {['50', '40', '30', '20', '10'].map(number => (
              <div key={number}><span>{number}</span><span>{number}</span></div>
            ))}
          </div>
        </div>
      </div>
      <div className="field-shade" />
    </div>
  )
}

function IntroPhotos({ photos, lazy = false }) {
  return (
    <div className="intro-photos">
      {photos.map(({ src, width, height, alt, caption, credit, source }) => (
        <figure key={src}>
          <img src={eventImageSource(src)} alt={alt} width={width} height={height} loading={lazy ? 'lazy' : 'eager'} />
          <figcaption>
            <span>{caption}</span>
            <a href={source}>{credit}</a>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}

function Introduction() {
  const sectionRef = useRef(null)
  const sceneRef = useRef(null)
  const [progress] = useScrollProgress(sectionRef, sceneRef)

  return (
    <section id="intro" className="intro-scroll" ref={sectionRef} aria-labelledby="hook-title">
      <div className="intro-scene" ref={sceneRef} style={{ '--intro-offset': `${progress * -24}px` }}>
        <Field className="intro-field" motion={progress * 168} />
        <div className="intro-inner">
          <div className="intro-copy">
            <p className="intro-location"><span />{introduction.location}</p>
            <h2 id="hook-title" className="intro-heading">{introduction.heading}</h2>
            <p className="intro-game-story">{introduction.gameStory}</p>
            <p className="intro-question">{introduction.question}</p>
            <a className="explore-link" href="#overview"><Icon name="down" size={17} /> Meet the coach</a>
          </div>
          <IntroPhotos photos={introduction.gamePhotos} />
        </div>
      </div>
    </section>
  )
}

function Overview() {
  const overviewRef = useRef(null)
  const snap = useRef({ timer: 0, reached: false })

  useEffect(() => {
    const overview = overviewRef.current
    const state = snap.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    function scheduleSnap() {
      clearTimeout(state.timer)
      const distance = Math.abs(overview.getBoundingClientRect().top)
      if (distance < 2) state.reached = true
      if (distance > window.innerHeight / 2) state.reached = false
      if (state.reached || distance > Math.min(180, window.innerHeight / 4)) return

      // Snap once when the reader reaches the panel, then let the next scroll leave it.
      state.timer = window.setTimeout(() => {
        state.reached = true
        window.scrollBy({
          top: overview.getBoundingClientRect().top,
          behavior: reducedMotion.matches ? 'instant' : 'smooth',
        })
      }, 110)
    }

    window.addEventListener('scroll', scheduleSnap, { passive: true })
    scheduleSnap()

    return () => {
      window.removeEventListener('scroll', scheduleSnap)
      clearTimeout(state.timer)
    }
  }, [])

  return (
    <section id="overview" className="story-overview" ref={overviewRef} aria-labelledby="overview-title" tabIndex={-1}>
      <div className="story-overview-inner">
        <div className="story-overview-copy">
          <p className="section-label"><span />{introduction.subtitle}</p>
          <h1 id="overview-title">{introduction.title}</h1>
          {introduction.description.map(paragraph => (
            <p key={paragraph} className="story-overview-summary">{paragraph}</p>
          ))}
          <p className="story-overview-lead">{introduction.lead}</p>
          <a className="explore-link" href="#timeline"><Icon name="down" size={17} /> Explore the timeline</a>
        </div>
        <IntroPhotos photos={introduction.overviewPhotos} lazy />
      </div>
    </section>
  )
}

function EventCardImage({ image, imageAlt }) {
  if (image) {
    return <img className="event-card-image" src={eventImageSource(image)} alt={imageAlt || ''} loading="lazy" />
  }
  return (
    <span className="event-card-image-placeholder" aria-hidden="true">
      <Icon name="image" size={24} />
      <span>Image placeholder</span>
    </span>
  )
}

const firstCardAngle = 0.18
const eventSpacing = 0.26
const trackEnd = 1.57
const lanes = [-0.68, 0, 0.68]

function projectArc(angle) {
  // The circular rail recedes by sin(angle) and rises by 1 - cos(angle).
  const distance = 0.42
  const scale = distance / (distance + Math.sin(angle))
  return {
    y: 0.48 + scale * (0.56 - 2.33 * (1 - Math.cos(angle))),
    halfWidth: 0.55 * scale,
    scale,
  }
}

const readingScale = projectArc(firstCardAngle).scale
const railPoints = Array.from({ length: 37 }, (_, i) => projectArc(trackEnd * i / 36))
const railPath = (lane, points = railPoints) => points.map(({ y, halfWidth }) =>
  `${(0.5 + lane * halfWidth) * 1000} ${y * 1000}`,
).join(' L ')
const trackShape = `M ${railPath(-1)} L ${railPath(1, [...railPoints].reverse())} Z`

function ReelTrack({ cards, position }) {
  const tickSpacing = eventSpacing / 5
  const tickPaths = []
  for (let angle = (firstCardAngle - position * eventSpacing) % tickSpacing; angle < trackEnd; angle += tickSpacing) {
    if (angle < 0) continue
    const { y, halfWidth, scale } = projectArc(angle)
    const left = (0.5 - halfWidth) * 1000
    const right = (0.5 + halfWidth) * 1000
    tickPaths.push(`M ${left} ${y * 1000} h ${-13 * scale} M ${right} ${y * 1000} h ${13 * scale}`)
  }
  const markerPaths = cards.map(({ projection: { y, halfWidth, scale } }) =>
    `M ${(0.5 - halfWidth - 0.042 * scale) * 1000} ${y * 1000} H ${(0.5 + halfWidth + 0.042 * scale) * 1000}`,
  )

  return (
    <div className="reel-track" aria-hidden="true">
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <linearGradient id="reel-surface" x2="0" y2="1">
            <stop className="reel-surface-top" />
            <stop className="reel-surface-bottom" offset="1" />
          </linearGradient>
        </defs>
        <path d={trackShape} fill="url(#reel-surface)" />
        {[-1, -1 / 3, 1 / 3, 1].map(lane => (
          <path key={lane} className={Math.abs(lane) === 1 ? 'reel-rail' : 'reel-lane'} d={`M ${railPath(lane)}`} />
        ))}
        <path className="reel-ticks" d={tickPaths.join(' ')} />
        <path className="reel-markers" d={markerPaths.join(' ')} />
      </svg>
      <div className="reel-dates">
        {cards.map(({ event, index, projection: { y, halfWidth, scale } }) => (
          <span key={index} style={{
            left: `${(0.5 + halfWidth + 0.055 * scale) * 100}%`,
            top: `${y * 100}%`,
            '--marker-scale': scale / readingScale,
          }}>{event.date || formatNumber(index + 1)}</span>
        ))}
      </div>
    </div>
  )
}

function EventCard({ card, active, onOpen }) {
  const { event, index, angle, projection: { y, halfWidth, scale } } = card
  const lane = lanes[index % lanes.length]
  const opacity = Math.min(1, angle / 0.05, (trackEnd - angle) / 0.28)
  const style = {
    '--card-x': `${lane * halfWidth * 100}%`,
    '--card-y': `${y * 100}%`,
    '--card-scale': scale / readingScale,
    '--card-tilt': `${(angle - firstCardAngle) * 180 / Math.PI}deg`,
    '--card-opacity': opacity,
    zIndex: events.length - index,
  }

  return (
    <button
      type="button"
      className={`event-card era-${event.chapter.id}${active ? ' is-current' : ''}`}
      style={style}
      onClick={onOpen}
      tabIndex={active ? 0 : -1}
      aria-label={`Open ${event.title}, ${event.chapter.title}`}
    >
      <span className="event-card-era">{event.chapter.title}</span>
      <EventCardImage image={event.summary.image} imageAlt={event.summary.imageAlt} />
      <div className="event-card-copy">
        <div className="event-card-title">{event.title}</div>
        <div className="event-date">{event.date || 'Date placeholder'}</div>
        {event.summary.description && <p className="event-card-preview">{event.summary.description}</p>}
      </div>
    </button>
  )
}

function EventContentBlock({ block }) {
  switch (block.type) {
    case 'heading':
      return <h3>{block.text}</h3>
    case 'paragraph':
      return <p>{block.text}</p>
    case 'image':
      return (
        <figure className={block.wide ? 'event-detail-image is-wide' : 'event-detail-image'}>
          <img src={eventImageSource(block.src)} alt={block.alt || ''} loading="lazy" />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      )
    default:
      return null
  }
}

function EventDialog({ event, dialogRef, onClose }) {
  return (
    <dialog
      className={`event-dialog era-${event?.chapter.id || chapters[0].id}`}
      ref={dialogRef}
      onClose={onClose}
      aria-labelledby="event-dialog-title"
    >
      {event && (
        <article className="event-detail">
          <header className="event-detail-bar">
            <div className="event-detail-bar-inner">
              <form method="dialog">
                <button className="event-detail-back"><Icon name="left" size={18} /> Back to timeline</button>
              </form>
              <span>{event.chapter.title}</span>
            </div>
          </header>
          <div className="event-detail-copy">
            <div className="event-detail-title">
              {event.date && <div className="event-date">{event.date}</div>}
              <h2 id="event-dialog-title">{event.title}</h2>
            </div>
            {event.content.length
              ? event.content.map((block, index) => <EventContentBlock key={index} block={block} />)
              : <p>[Add the story for this event.]</p>}
          </div>
        </article>
      )}
    </dialog>
  )
}

function Timeline() {
  const sectionRef = useRef(null)
  const sceneRef = useRef(null)
  const dialogRef = useRef(null)
  const activeCardRef = useRef(null)
  const [detail, setDetail] = useState(null)
  const [progress, setProgress] = useScrollProgress(sectionRef, sceneRef)
  const position = Math.min(lastEvent, progress * reelLength)
  const currentIndex = Math.round(position)
  const current = events[currentIndex]
  const firstVisible = Math.max(0, Math.floor(position) - 1)
  const lastVisible = Math.min(lastEvent, Math.ceil(position) + 8)
  const cards = events.slice(firstVisible, lastVisible + 1).map((event, offset) => {
    const index = firstVisible + offset
    const angle = firstCardAngle + (index - position) * eventSpacing
    return { event, index, angle }
  }).filter(({ angle }) => angle > 0 && angle < trackEnd)
    .map(card => ({ ...card, projection: projectArc(card.angle) }))

  function goToEvent(index) {
    const section = sectionRef.current
    const scene = sceneRef.current
    const sectionTop = section.getBoundingClientRect().top + window.scrollY
    const distance = section.offsetHeight - scene.offsetHeight
    const next = Math.max(0, Math.min(lastEvent, index)) / reelLength
    window.scrollTo({ top: sectionTop + distance * next, behavior: 'instant' })
    setProgress(next)
  }

  function openEvent(index) {
    setDetail(events[index])
    if (index !== currentIndex) goToEvent(index)
  }

  function handleSliderKey(event) {
    const destinations = {
      ArrowLeft: currentIndex - 1,
      ArrowDown: currentIndex - 1,
      ArrowRight: currentIndex + 1,
      ArrowUp: currentIndex + 1,
      Home: 0,
      End: lastEvent,
    }
    if (!Object.hasOwn(destinations, event.key)) return
    event.preventDefault()
    goToEvent(destinations[event.key])
  }

  useEffect(() => {
    const dialog = dialogRef.current
    if (detail && !dialog.open) {
      dialog.showModal()
      dialog.scrollTop = 0
    }
  }, [detail])

  function closeEvent() {
    setDetail(null)
    const activeCard = activeCardRef.current.querySelector('.is-current')
    activeCard?.focus({ preventScroll: true })
  }

  return (
    <section id="timeline" className="timeline-scroll" ref={sectionRef} aria-labelledby="timeline-title" tabIndex={-1} style={{ '--reel-length': reelLength, '--event-intervals': lastEvent }}>
      <div className={`timeline-scene era-${current.chapter.id}`} ref={sceneRef}>
        <div className="timeline-stage">
          <ReelTrack cards={cards} position={position} />
          <div className="timeline-stage-inner">
            <div className="timeline-heading">
              <h2 id="timeline-title">The Timeline</h2>
              <div className="timeline-era">{current.chapter.title}</div>
              <p className="timeline-years">{current.chapter.years}</p>
            </div>
            {currentIndex === lastEvent
              ? <a className="timeline-scroll-hint" href="#works-cited">Works Cited <Icon name="down" size={16} /></a>
              : <p className="timeline-scroll-hint">Scroll downfield <Icon name="down" size={16} /></p>}
            <div className="timeline-cards" ref={activeCardRef}>
              {cards.map(card => <EventCard key={card.index} card={card} active={card.index === currentIndex} onOpen={() => openEvent(card.index)} />)}
            </div>
          </div>
        </div>
        <div className="timeline-controls">
          <div className="timeline-controls-inner">
            <nav className="chapter-nav" aria-label="Timeline chapters">
              {chapters.map((chapter, index) => (
                <button key={chapter.id} type="button" aria-current={current.chapter === chapter ? 'step' : undefined} onClick={() => goToEvent(chapterStarts[index])}>
                  <span className="chapter-dot" />{chapter.title}
                </button>
              ))}
            </nav>
            <div className="timeline-slider" style={{
              '--timeline-progress': `${position / Math.max(1, lastEvent) * 100}%`,
              '--during-start': `${(chapterStarts[1] - .5) / lastEvent * 100}%`,
              '--after-start': `${(chapterStarts[2] - .5) / lastEvent * 100}%`,
            }}>
              <div className="timeline-track" aria-hidden="true" />
              <input
                type="range"
                aria-label="Timeline event"
                aria-valuetext={`${current.chapter.title}, ${current.title}`}
                min="0"
                max={lastEvent}
                step="any"
                value={position}
                onChange={e => goToEvent(e.target.valueAsNumber)}
                onKeyDown={handleSliderKey}
              />
            </div>
            <div className="event-navigation">
              <button className="icon-button" type="button" aria-label="Previous event" disabled={currentIndex === 0} onClick={() => goToEvent(currentIndex - 1)}><Icon name="left" size={18} /></button>
              <output aria-label="Event position">{formatNumber(currentIndex + 1)} <span>/</span> {formatNumber(events.length)}</output>
              <button className="icon-button" type="button" aria-label="Next event" disabled={currentIndex === lastEvent} onClick={() => goToEvent(currentIndex + 1)}><Icon name="right" size={18} /></button>
            </div>
          </div>
        </div>
      </div>
      <EventDialog event={detail} dialogRef={dialogRef} onClose={closeEvent} />
    </section>
  )
}

function WorksCited() {
  return (
    <section className="works-cited" id="works-cited" aria-labelledby="works-cited-title">
      <div className="works-cited-inner">
        <div className="works-cited-heading">
          <div className="section-label"><span /> MLA format</div>
          <h2 id="works-cited-title">Works Cited</h2>
        </div>
        <ul className="citation-list">
          {worksCited.map(({ type, entry, container, details }, index) => (
            <li key={index}>
              {type && <div className="citation-type">{type}</div>}
              <p>{entry} <cite>{container}</cite>{details}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function App() {
  useLayoutEffect(() => {
    if (window.scrollY === 0) {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#intro">Skip to story</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="site-brand" href="#intro"><Icon name="football" size={24} />{introduction.title}</a>
          <nav className="site-nav" aria-label="Story sections">
            <a href="#intro">Intro</a>
            <a href="#timeline">Timeline</a>
            <a href="#works-cited">Works Cited</a>
          </nav>
        </div>
      </header>
      <main>
        <Introduction />
        <Overview />
        <Timeline />
        <WorksCited />
      </main>
      <footer className="site-footer">
        <div className="footer-inner">
          <span>{introduction.title} <span className="footer-divider">/</span> {introduction.subtitle}</span>
          <a href="#intro">Back to top <Icon name="up" size={15} /></a>
        </div>
      </footer>
    </>
  )
}

export default App
