import { useState } from 'react'
import { contact, nav, rooms, work } from './content/site'

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <a href="#top" className="font-display text-[15px] font-bold tracking-[0.14em] text-white">
          QUANTEDGE
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((link) => (
            <a key={link.href} href={link.href} className="text-[13px] text-white/75 hover:text-white">
              {link.label}
            </a>
          ))}
          <a href="#contact" className="text-[13px] font-medium text-white">
            Contact
          </a>
        </nav>
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <span className="flex w-5 flex-col gap-1.5">
            <span className="h-px w-full bg-white" />
            <span className="h-px w-full bg-white" />
          </span>
        </button>
      </div>
      {open && (
        <div className="bg-ink px-6 pb-6 md:hidden">
          {[...nav, { label: 'Contact', href: '#contact' }].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-white/80"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}

export default function App() {
  return (
    <div id="top" className="bg-paper">
      <Header />

      <section className="relative min-h-[100svh] overflow-hidden">
        <img
          src="/images/hero.png"
          alt="Empty Quantedge workshop with a robot arm and workbenches"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/25" />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:pb-24">
          <h1 className="max-w-[11ch] font-display text-5xl leading-[0.95] font-extrabold text-white md:text-7xl">
            Learn it. Then build with it.
          </h1>
          <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-white/80 md:text-xl">
            Quantedge is a deep-tech centre. We train people in applied AI, run shared labs, and
            help small teams make hardware that thinks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#work" className="bg-clay px-5 py-3 text-[14px] font-medium text-white">
              What we do
            </a>
            <a href="#contact" className="border border-white/40 px-5 py-3 text-[14px] text-white">
              Get in touch
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28">
        <div>
          <p className="text-[13px] tracking-[0.16em] text-clay">WHY WE EXIST</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.05] font-bold md:text-5xl">
            AI should show up on the shop floor, not only in a demo.
          </h2>
        </div>
        <div className="space-y-5 font-serif text-[18px] leading-[1.7] text-mute">
          <p>
            Most AI courses teach people to talk about models. Most labs sit in a handful of
            coastal cities. The people who actually run plants, polytechnics, and small workshops
            are left with a chatbot and a prayer.
          </p>
          <p>
            We built a centre so a technician, a diploma student, or a two-person
            hardware team can walk in, use a robot, train a small vision model, and leave with
            something that works in their world.
          </p>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <h2 className="font-display text-3xl font-bold md:text-4xl">What happens here</h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {work.map((item) => (
            <a key={item.title} href={item.href} className="group relative block min-h-[22rem] overflow-hidden">
              <img
                src={item.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
              <div className="relative flex h-full min-h-[22rem] flex-col justify-end p-7">
                <h3 className="font-display text-3xl font-bold text-white">{item.title}</h3>
                <p className="mt-3 max-w-sm font-serif text-[16px] leading-relaxed text-white/80">
                  {item.text}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="centre" className="bg-ink py-20 text-paper md:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[13px] tracking-[0.16em] text-clay">THE CENTRE</p>
          <h2 className="mt-4 max-w-xl font-display text-4xl font-bold md:text-5xl">
            One building. Classrooms, labs, and a shop.
          </h2>
          <p className="mt-6 max-w-xl font-serif text-lg leading-relaxed text-white/65">
            A project can start on a whiteboard, move to a camera rig, get a printed enclosure,
            and leave as a working prototype without booking three different campuses.
          </p>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {rooms.map((room) => (
              <figure key={room.name}>
                <img src={room.image} alt="" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="mt-5">
                  <h3 className="font-display text-xl font-bold">{room.name}</h3>
                  <p className="mt-2 font-serif text-[16px] leading-relaxed text-white/60">{room.text}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="startups" className="relative overflow-hidden">
        <img
          src="/images/workspace.png"
          alt="Empty workspace in the Quantedge centre"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="text-[13px] tracking-[0.16em] text-clay">STARTUPS</p>
          <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-bold text-white md:text-5xl">
            Build from inside the centre.
          </h2>
          <p className="mt-5 max-w-md font-serif text-lg leading-relaxed text-white/75">
            Incubated teams sit in the same building as the labs. Write to us if you want in.
          </p>
        </div>
      </section>

      <section id="contact" className="bg-ink py-20 text-paper md:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-[14ch] font-display text-4xl font-bold md:text-6xl">
              Come see the floor.
            </h2>
            <p className="mt-5 max-w-md font-serif text-lg text-white/65">
              Students, founders, plant managers, colleges. Write to us. We will get you into the
              building.
            </p>
          </div>
          <div className="md:text-right">
            <a href={`mailto:${contact.email}`} className="font-display text-2xl font-bold text-clay md:text-3xl">
              {contact.email}
            </a>
          </div>
        </div>
      </section>

      <footer className="bg-ink border-t border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-[13px] text-white/40">
          <span>Quantedge</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  )
}
