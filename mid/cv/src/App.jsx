import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React, { useState, useEffect } from "react";
import "./App.css";

// Utility for fetching from local json-server
const API = (path) => `http://localhost:4000/${path}`;

// Small presentational components
function Avatar({ src, name }) {
  return (
    <div className="w-28 h-28 rounded-full overflow-hidden shadow-lg">
      <img src={src || '/avatar-placeholder.png'} alt={name} className="w-full h-full object-cover" />
    </div>
  );
}

function Header({ profile }) {
  return (
    <header className="bg-gradient-to-r from-slate-800 to-indigo-600 text-white py-8">
      <div className="container mx-auto px-6 flex items-center gap-6">
        <Avatar src={profile?.avatarUrl} name={profile?.name} />
        <div>
          <h1 className="text-3xl font-bold">{profile?.name}</h1>
          <p className="text-sm opacity-90">{profile?.title} — {profile?.location}</p>
          <div className="mt-2 flex gap-3 text-xs">
            {profile?.social?.github && <a href={profile.social.github} target="_blank" rel="noreferrer" className="underline">GitHub</a>}
            {profile?.social?.linkedin && <a href={profile.social.linkedin} target="_blank" rel="noreferrer" className="underline">LinkedIn</a>}
          </div>
        </div>
      </div>
    </header>
  );
}

function About({ about, contact }) {
  return (
    <section className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold mb-4">About</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <p className="md:col-span-2 leading-relaxed">{about}</p>
        <div className="space-y-2">
          <div><strong>Email:</strong> <a href={`mailto:${contact?.email}`} className="underline">{contact?.email}</a></div>
          <div><strong>Phone:</strong> <a href={`tel:${contact?.phone}`} className="underline">{contact?.phone}</a></div>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ exp }) {
  return (
    <article className="p-4 border rounded-lg">
      <h3 className="font-semibold">{exp.role} <span className="text-sm text-slate-500">@ {exp.company}</span></h3>
      <p className="text-xs text-slate-500 mb-2">{exp.period}</p>
      <p className="text-sm leading-snug">{exp.desc}</p>
    </article>
  );
}

function Experiences({ items }) {
  return (
    <section className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold mb-4">Experience</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items?.map(e => <ExperienceItem key={e.id} exp={e} />)}
      </div>
    </section>
  );
}

function ProjectCard({ p }) {
  return (
    <div className="p-4 border rounded-lg flex flex-col justify-between">
      <div>
        <h3 className="font-semibold">{p.title}</h3>
        <p className="text-sm mt-2 leading-snug">{p.desc}</p>
      </div>
      {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="mt-4 text-sm underline">View</a>}
    </div>
  );
}

function Projects({ items }) {
  return (
    <section className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold mb-4">Projects</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items?.map(p => <ProjectCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}

function ContactForm({ profile }) {
  return (
    <section className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold mb-4">Contact</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="mb-4">Ingin berkolaborasi atau bertanya? Kirim email ke <a href={`mailto:${profile?.email}`} className="underline">{profile?.email}</a></p>
        </div>
        <form className="space-y-3">
          <input className="w-full border rounded p-2" placeholder="Your name" />
          <input className="w-full border rounded p-2" placeholder="Your email" />
          <textarea className="w-full border rounded p-2" rows={4} placeholder="Message" />
          <button type="button" className="px-4 py-2 bg-indigo-600 text-white rounded">Send</button>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-100 py-6 mt-8">
      <div className="container mx-auto px-6 text-center text-sm text-slate-600">© {new Date().getFullYear()} — Built with React, Vite, Tailwind</div>
    </footer>
  );
}

// Root App: fetches data from json-server and passes to components
export default function App() {
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function loadAll() {
      try {
        setLoading(true);
        const [pRes, eRes, projRes] = await Promise.all([
          fetch(API('profile')),
          fetch(API('experiences')),
          fetch(API('projects')),
        ]);
        if (!pRes.ok || !eRes.ok || !projRes.ok) throw new Error('Failed to fetch');
        const [pData, eData, projData] = await Promise.all([pRes.json(), eRes.json(), projRes.json()]);
        if (!mounted) return;
        setProfile(pData);
        setExperiences(eData);
        setProjects(projData);
      } catch (err) {
        console.error(err);
        setError('Could not load data from local JSON server. Make sure `npm run json-server` is running on port 4000.');
      } finally {
        setLoading(false);
      }
    }
    loadAll();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen p-6"><div className="max-w-2xl mx-auto p-6 border rounded bg-red-50">{error}</div></div>;

  return (
    <div className="min-h-screen font-sans text-slate-800 bg-white">
      <Header profile={profile} />
      <main>
        <About about={profile?.about} contact={profile} />
        <Experiences items={experiences} />
        <Projects items={projects} />
        <ContactForm profile={profile} />
      </main>
      <Footer />
    </div>
  );
}
