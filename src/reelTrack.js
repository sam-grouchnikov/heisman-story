export const firstCardAngle = 0.18
export const eventSpacing = 0.26
export const trackEnd = 1.57

export function projectArc(angle) {
  // The circular rail recedes by sin(angle) and rises by 1 - cos(angle).
  const distance = 0.42
  const scale = distance / (distance + Math.sin(angle))
  return {
    y: 0.48 + scale * (0.56 - 2.33 * (1 - Math.cos(angle))),
    halfWidth: 0.55 * scale,
    scale,
  }
}

export const readingScale = projectArc(firstCardAngle).scale

function fieldPoint({ y, halfWidth }, lane) {
  return `${(0.5 + lane * halfWidth) * 1000} ${y * 1000}`
}

function fieldSurface(points) {
  const left = points.map(point => fieldPoint(point, -1)).join(' L ')
  const right = points.slice().reverse().map(point => fieldPoint(point, 1)).join(' L ')
  return `M ${left} L ${right} Z`
}

function createPath(group, className) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('class', className)
  group.append(path)
  return path
}

function createLabel(group, className, text) {
  const label = document.createElement('span')
  label.className = className
  label.textContent = text
  group.append(label)
  return label
}

export function initializeReelTrack(track, chapters, chapterStarts, lastEvent) {
  const surface = track.querySelector('.reel-surface')
  const turf = track.querySelector('.reel-sections')
  const stripes = track.querySelector('.reel-stripes')
  const lines = track.querySelector('.reel-yard-lines')
  const hashes = track.querySelector('.reel-hashes')
  const goals = track.querySelector('.reel-goal-lines')
  const goalpost = track.querySelector('.reel-goalpost')
  const markings = track.querySelector('.reel-markings')
  const railPoints = Array.from({ length: 37 }, (_, index) => projectArc(trackEnd * index / 36))
  surface.setAttribute('d', fieldSurface(railPoints))

  const firstEventYard = -5
  const lastEventYard = 105
  const yardsPerEvent = (lastEventYard - firstEventYard) / Math.max(1, lastEvent)
  const eventYard = index => firstEventYard + index * yardsPerEvent
  const chapterLines = [0, ...chapterStarts.slice(1).map(index => eventYard(index - 0.5)), 100]
  const fieldSections = [
    { start: -10, end: 0, era: chapters[0].id, endZone: true },
    ...chapters.map((chapter, index) => ({
      start: chapterLines[index],
      end: chapterLines[index + 1],
      era: chapter.id,
    })),
    { start: 100, end: 110, era: chapters[chapters.length - 1].id, endZone: true },
  ].map(section => ({
    ...section,
    path: createPath(turf, `reel-turf era-${section.era}${section.endZone ? ' reel-end-zone' : ''}`),
  }))

  const goalLines = [-10, 0, 100, 110]
  const yardLines = Array.from({ length: 19 }, (_, index) => (index + 1) * 5)
  const hashYards = Array.from({ length: 99 }, (_, index) => index + 1).filter(yard => yard % 5 !== 0)
  const grassStripes = yardLines.filter(yard => yard % 10 === 5).map(yard => ({
    yard,
    path: createPath(stripes, 'reel-grass-stripe'),
  }))
  const yardNumbers = yardLines.filter(yard => yard % 10 === 0).map(yard => ({
    yard,
    labels: [-1, 1].map(side => ({
      side,
      element: createLabel(markings, 'reel-yard-number', Math.min(yard, 100 - yard)),
    })),
  }))
  const endZones = [{ yard: -7, label: 'START' }, { yard: 103, label: 'FINISH' }].map(({ yard, label }) => ({
    yard,
    element: createLabel(markings, 'reel-end-zone-label', label),
  }))

  return function renderTrack(position) {
    const cameraYard = eventYard(position)
    const angleAt = yard => firstCardAngle + (yard - cameraYard) * eventSpacing / yardsPerEvent
    const isVisible = yard => angleAt(yard) >= 0 && angleAt(yard) <= trackEnd
    const project = yard => projectArc(angleAt(yard))

    function crossLine(yard, left = -1, right = 1) {
      const point = project(yard)
      return `M ${fieldPoint(point, left)} L ${fieldPoint(point, right)}`
    }

    function surfaceBetween(start, end) {
      const near = Math.max(0, angleAt(start))
      const far = Math.min(trackEnd, angleAt(end))
      if (near >= far) return ''
      const segments = Math.ceil((far - near) / 0.04)
      const points = Array.from({ length: segments + 1 }, (_, index) => projectArc(near + (far - near) * index / segments))
      return fieldSurface(points)
    }

    for (const { start, end, path } of fieldSections) path.setAttribute('d', surfaceBetween(start, end))
    for (const { yard, path } of grassStripes) path.setAttribute('d', surfaceBetween(yard - 5, yard))
    lines.setAttribute('d', yardLines.filter(isVisible).map(yard => crossLine(yard)).join(' '))
    hashes.setAttribute('d', hashYards.filter(isVisible).map(yard => (
      crossLine(yard, -0.98, -0.92) + crossLine(yard, -0.24, -0.17) +
      crossLine(yard, 0.17, 0.24) + crossLine(yard, 0.92, 0.98)
    )).join(' '))
    goals.setAttribute('d', goalLines.filter(isVisible).map(yard => crossLine(yard)).join(' '))

    if (isVisible(110)) {
      const { y, scale, halfWidth } = project(110)
      const crossbar = (y - 0.09 * scale) * 1000
      const upright = (y - 0.22 * scale) * 1000
      const left = (0.5 - 0.14 * halfWidth) * 1000
      const right = (0.5 + 0.14 * halfWidth) * 1000
      goalpost.setAttribute('stroke-width', 3 * scale)
      goalpost.setAttribute('d', `M 500 ${y * 1000} V ${crossbar} M ${left} ${upright} V ${crossbar} H ${right} V ${upright}`)
    } else {
      goalpost.setAttribute('d', '')
    }

    for (const { yard, labels } of yardNumbers) {
      const visible = isVisible(yard)
      for (const { side, element } of labels) {
        element.hidden = !visible
        if (!visible) continue
        const { y, halfWidth, scale } = project(yard - 1)
        element.style.left = `${(0.5 + side * 0.75 * halfWidth) * 100}%`
        element.style.top = `${y * 100}%`
        element.style.setProperty('--marker-scale', scale / readingScale)
      }
    }
    for (const { yard, element } of endZones) {
      element.hidden = !isVisible(yard)
      if (element.hidden) continue
      const { y, scale } = project(yard)
      element.style.top = `${y * 100}%`
      element.style.setProperty('--marker-scale', scale / readingScale)
    }
  }
}
