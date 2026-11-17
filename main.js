import de from './de.js'

// ---------- Language: English by default, German on request. Stored per browser. ----------
const lang = (() => {
  try {
    const q = new URLSearchParams(location.search).get('lang')
    if (q === 'de' || q === 'en') localStorage.setItem('lang', q)
    return localStorage.getItem('lang') || 'en'
  } catch { return 'en' }
})()
const dict = lang === 'de' ? de : {}
const t = (s) => dict[s] ?? s
{
  const INLINE = new Set(['BR', 'SPAN', 'EM', 'B', 'I', 'S', 'SMALL', 'STRONG', 'SUP', 'U'])
  const UNITS = new Set(['H1', 'H2', 'H3', 'H4', 'P', 'LI', 'TD', 'TH', 'LABEL', 'BUTTON', 'A', 'OPTION', 'TITLE', 'FIGCAPTION'])
  const norm = (x) => x.replace(/\s+/g, ' ').trim()
  const inlineOnly = (el) => [...el.children].every((c) => INLINE.has(c.tagName) && inlineOnly(c))
  const walk = (node) => {
    if (node.nodeType === 3) {
      const v = dict[norm(node.nodeValue)]
      if (v == null) return
      const m = node.nodeValue.match(/^(\s*)[\s\S]*?(\s*)$/)
      node.nodeValue = m[1] + v + m[2]
      return
    }
    if (node.nodeType !== 1) return
    const tag = node.tagName.toUpperCase()
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG') return
    for (const a of ['placeholder', 'aria-label', 'alt', 'data-text', 'content']) {
      const v = node.getAttribute(a)
      if (v && dict[v]) node.setAttribute(a, dict[v])
    }
    if (node.dataset && node.dataset.rotate) node.dataset.rotate = JSON.stringify(JSON.parse(node.dataset.rotate).map(t))
    if (UNITS.has(tag) && node.children.length && inlineOnly(node)) {
      const v = dict[norm(node.textContent)]
      if (v != null) node.innerHTML = v
      return
    }
    ;[...node.childNodes].forEach(walk)
  }
  if (lang === 'de') { walk(document.documentElement); document.documentElement.lang = 'de' }
  document.documentElement.classList.add('ready')
  document.querySelectorAll('.lang').forEach((b) => {
    b.textContent = lang === 'de' ? 'EN' : 'DE'
    b.setAttribute('aria-label', t('Read this site in German'))
    b.addEventListener('click', () => {
      try { localStorage.setItem('lang', lang === 'de' ? 'en' : 'de') } catch {}
      const u = new URL(location.href); u.searchParams.delete('lang'); location.href = u.href
    })
  })
}

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches

// ---------- Mobile menu ----------
const menu = document.querySelector('.menu')
const links = document.querySelector('.links')
if (menu) {
  menu.addEventListener('click', () => {
    const open = links.classList.toggle('open')
    menu.setAttribute('aria-expanded', String(open))
  })
}

// ---------- Current page in nav ----------
const here = location.pathname.split('/').pop() || 'index.html'
document.querySelectorAll('.links a').forEach((a) => {
  if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page')
})

// ---------- Scroll reveals ----------
const els = document.querySelectorAll('.reveal')
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        obs.unobserve(e.target)
      }
    }),
    { threshold: 0.08 },
  )
  els.forEach((e) => obs.observe(e))
} else {
  els.forEach((e) => e.classList.add('visible'))
}

// ---------- Hero rotator ----------
const rot = document.querySelector('[data-rotate]')
if (rot && !reduced) {
  const words = JSON.parse(rot.dataset.rotate)
  let i = 0
  setInterval(() => {
    i = (i + 1) % words.length
    rot.textContent = words[i]
  }, 2600)
}

// ---------- Drag anything marked [data-drag] ----------
// Positions live only in memory, so a reload puts everything back where we placed it.
// data-drag="wide" only drags on desktop widths (on phones those items are stacked links).
let zTop = 10
document.querySelectorAll('[data-drag]').forEach((el) => {
  let id = null, px = 0, py = 0, ox = 0, oy = 0, bx = 0, by = 0, moved = false, lim = null
  el.addEventListener('dragstart', (e) => e.preventDefault())
  el.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return
    if (el.dataset.drag === 'wide' && innerWidth <= 850) return
    id = e.pointerId
    el.setPointerCapture(id)
    px = e.clientX; py = e.clientY; bx = ox; by = oy; moved = false
    const zone = el.closest('[data-zone]') || el.parentElement
    const r = el.getBoundingClientRect(), z = zone.getBoundingClientRect()
    lim = { x0: ox - (r.left - z.left), x1: ox + (z.right - r.right), y0: oy - (r.top - z.top), y1: oy + (z.bottom - r.bottom) }
    el.style.zIndex = ++zTop
  })
  el.addEventListener('pointermove', (e) => {
    if (e.pointerId !== id) return
    const dx = e.clientX - px, dy = e.clientY - py
    if (!moved && Math.hypot(dx, dy) < 5) return
    if (!moved) { moved = true; el.classList.add('dragging') }
    ox = Math.min(lim.x1, Math.max(lim.x0, bx + dx))
    oy = Math.min(lim.y1, Math.max(lim.y0, by + dy))
    el.style.setProperty('--dx', ox + 'px')
    el.style.setProperty('--dy', oy + 'px')
  })
  const end = (e) => {
    if (e.pointerId !== id) return
    id = null
    el.classList.remove('dragging')
  }
  el.addEventListener('pointerup', end)
  el.addEventListener('pointercancel', end)
  // A drag should not count as a click on a card link
  el.addEventListener('click', (e) => {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false }
  }, true)
})

// ---------- Home: living network of the three worlds ----------
const net = document.querySelector('#network')
if (net) {
  const cv = net.querySelector('canvas')
  const ctx = cv.getContext('2d')
  const hubs = [
    { label: t('LEARN'), x: 0.27, y: 0.3, c: '#d8c9f4' },
    { label: t('SYSTEMS'), x: 0.74, y: 0.36, c: '#dcece1' },
    { label: t('FOUNDRY'), x: 0.48, y: 0.74, c: '#f4d7c6' },
  ]
  const pairs = [[0, 1], [1, 2], [2, 0]]
  const parts = Array.from({ length: 36 }, (_, i) => ({ p: i % 3, t: Math.random(), s: 0.0016 + Math.random() * 0.0028, dir: Math.random() < 0.5 ? 1 : -1 }))
  let W = 0, H = 0, drag = null, running = false
  const R = () => Math.max(44, Math.min(W, H) * 0.12)
  const size = () => {
    const d = devicePixelRatio || 1
    W = net.clientWidth; H = net.clientHeight
    cv.width = W * d; cv.height = H * d
    ctx.setTransform(d, 0, 0, d, 0, 0)
    draw()
  }
  // Hubs drift a little on their own so the picture is alive even untouched
  let clockT = 0
  const P = (h) => {
    const k = hubs.indexOf(h)
    const wob = h === drag || reduced ? 0 : 7
    return [h.x * W + Math.sin(clockT + k * 2.1) * wob, h.y * H + Math.cos(clockT * 0.8 + k * 1.3) * wob]
  }
  const ctrl = (a, b) => {
    const [ax, ay] = P(a), [bx, by] = P(b)
    return [(ax + bx) / 2 - (by - ay) * 0.2, (ay + by) / 2 + (bx - ax) * 0.2]
  }
  const at = (a, b, t) => {
    const [ax, ay] = P(a), [bx, by] = P(b), [cx, cy] = ctrl(a, b), u = 1 - t
    return [u * u * ax + 2 * u * t * cx + t * t * bx, u * u * ay + 2 * u * t * cy + t * t * by]
  }
  function draw() {
    ctx.clearRect(0, 0, W, H)
    ctx.lineWidth = 1.5
    ctx.strokeStyle = '#202139'
    ctx.setLineDash([3, 8])
    pairs.forEach(([i, j]) => {
      const [ax, ay] = P(hubs[i]), [bx, by] = P(hubs[j]), [cx, cy] = ctrl(hubs[i], hubs[j])
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.quadraticCurveTo(cx, cy, bx, by); ctx.stroke()
    })
    ctx.setLineDash([])
    parts.forEach((q) => {
      const [i, j] = pairs[q.p]
      const [x, y] = at(hubs[i], hubs[j], q.dir > 0 ? q.t : 1 - q.t)
      ctx.beginPath(); ctx.arc(x, y, 4.5, 0, Math.PI * 2)
      ctx.fillStyle = hubs[q.dir > 0 ? j : i].c; ctx.fill()
      ctx.lineWidth = 1.5; ctx.stroke()
    })
    const r = R()
    hubs.forEach((h) => {
      const [x, y] = P(h)
      ctx.beginPath(); ctx.arc(x + 8, y + 8, r, 0, Math.PI * 2); ctx.fillStyle = '#2021391a'; ctx.fill()
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = h.c; ctx.fill()
      ctx.lineWidth = 2.5; ctx.stroke()
      ctx.fillStyle = '#202139'; ctx.font = '600 15px "Space Grotesk", sans-serif'
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
      ctx.fillText(h.label, x, y)
    })
  }
  function tick() {
    if (!running) return
    clockT += 0.012
    parts.forEach((q) => { q.t += q.s; if (q.t > 1) q.t -= 1 })
    draw()
    requestAnimationFrame(tick)
  }
  const hit = (e) => {
    const b = cv.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top
    return hubs.find((h) => Math.hypot(h.x * W - x, h.y * H - y) < R())
  }
  cv.addEventListener('pointerdown', (e) => { drag = hit(e); if (drag) cv.setPointerCapture(e.pointerId) })
  cv.addEventListener('pointermove', (e) => {
    if (!drag) { cv.style.cursor = hit(e) ? 'grab' : 'default'; return }
    cv.style.cursor = 'grabbing'
    const b = cv.getBoundingClientRect(), r = R()
    drag.x = Math.min(1 - r / W, Math.max(r / W, (e.clientX - b.left) / W))
    drag.y = Math.min(1 - r / H, Math.max(r / H, (e.clientY - b.top) / H))
    if (!running) draw()
  })
  const stop = () => { drag = null }
  cv.addEventListener('pointerup', stop)
  cv.addEventListener('pointercancel', stop)
  new ResizeObserver(size).observe(net)
  if (!reduced) {
    new IntersectionObserver(([e]) => {
      running = e.isIntersecting
      if (running) requestAnimationFrame(tick)
    }).observe(net)
  }
}

// ---------- Learning: scrub through one live class ----------
const ses = document.querySelector('#session')
if (ses) {
  const r = ses.querySelector('.scrub')
  const panes = [...ses.querySelectorAll('.pane')]
  const segs = [...ses.querySelectorAll('.segs span')]
  const clock = ses.querySelector('[data-clock]')
  const typed = ses.querySelector('.typed')
  let current = -1, auto = !reduced, typer = null
  const which = (v) => (v < 15 ? 0 : v < 35 ? 1 : 2)
  const type = () => {
    clearInterval(typer)
    const full = typed.dataset.text
    if (reduced) { typed.textContent = full; return }
    let n = 0
    typed.textContent = ''
    typer = setInterval(() => {
      typed.textContent = full.slice(0, ++n)
      if (n >= full.length) clearInterval(typer)
    }, 26)
  }
  const show = () => {
    const v = +r.value, i = which(v)
    r.style.setProperty('--p', (v / 50) * 100 + '%')
    clock.textContent = t('PART {n} OF 3').replace('{n}', i + 1)
    if (i === current) return
    current = i
    panes.forEach((p, k) => { p.classList.toggle('on', k === i); p.setAttribute('aria-hidden', String(k !== i)) })
    segs.forEach((s, k) => s.classList.toggle('on', k === i))
    if (i === 0) type()
  }
  const stopAuto = () => { auto = false }
  r.addEventListener('input', () => { stopAuto(); show() })
  r.addEventListener('pointerdown', stopAuto)
  r.addEventListener('keydown', stopAuto)
  let visible = false
  new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.4 }).observe(ses)
  setInterval(() => {
    if (!auto || !visible) return
    r.value = (+r.value + 1) % 51
    show()
  }, 420)
  show()
}

// ---------- About: founder cards flip on tap ----------
document.querySelectorAll('.fliptoggle').forEach((b) => {
  b.addEventListener('click', (e) => {
    // With a mouse the card turns on hover; latching it on click too would leave it stuck face-down
    if (e.detail > 0 && matchMedia('(hover:hover)').matches) return
    const card = b.closest('.flip')
    const on = card.classList.toggle('on')
    b.setAttribute('aria-pressed', String(on))
  })
})

// ---------- Connect form: sends through EmailJS, then confirms on the page ----------
const ask = document.querySelector('#ask')
if (ask) {
  const btn = ask.querySelector('button')
  const fail = () => {
    btn.disabled = false
    btn.textContent = t('Write to us')
    let err = ask.querySelector('.formerr')
    if (!err) {
      err = document.createElement('p')
      err.className = 'formerr'
      err.setAttribute('role', 'alert')
      ask.append(err)
    }
    err.textContent = t('That did not send. Please try again, or email info@thequantedge.ai.')
  }
  ask.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!window.emailjs) return fail()
    const data = new FormData(ask)
    btn.disabled = true
    btn.textContent = t('Sending…')
    window.emailjs
      .send('service_h4vb90a', 'contact_form', {
        to_email: 'info@thequantedge.ai',
        from_name: data.get('name'),
        from_email: data.get('email'),
        interest: data.get('interest'),
        message: data.get('message'),
      }, { publicKey: 'W_2M9UhGQ3tE2Vyw' })
      .then(() => {
        const done = document.createElement('div')
        done.className = 'sent'
        done.setAttribute('role', 'status')
        done.innerHTML = '<span class="eyebrow">' + t('MESSAGE SENT') + '</span><h3>' + t('Thank you. We have your note.') + '</h3><p></p>'
        const [before, after] = t('We will reply to {email} soon.').split('{email}')
        done.querySelector('p').append(before, Object.assign(document.createElement('b'), { textContent: data.get('email') }), after)
        ask.replaceWith(done)
        done.scrollIntoView({ block: 'center', behavior: 'smooth' })
      })
      .catch((e) => { console.error(e); fail() })
  })
}
