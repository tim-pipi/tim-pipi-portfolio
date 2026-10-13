'use client';

import React from 'react';
import Link from 'next/link';
import {
  benchIdeas,
  certificationsData,
  courseworkData,
  educationData,
  experienceData,
  leadershipData,
  profile,
  projectsData,
  skillsData,
} from '@/data/portfolio';
import type { BotId } from './engine';
import s from './range.module.css';

function About() {
  return (
    <>
      <p className={s.lede}>
        I&apos;m {profile.shortName}, a {profile.role.toLowerCase()} on the{' '}
        {profile.team} team at {profile.company} in {profile.location}. I work on
        backend and data infrastructure: pipelines that move a lot of events
        quickly and still have to be right.
      </p>
      <dl className={s.facts}>
        <dt>Role</dt>
        <dd>
          {profile.role}, {profile.team} · {profile.company}
        </dd>
        <dt>Since</dt>
        <dd>{profile.since}</dd>
        <dt>Studied</dt>
        <dd>
          {educationData[0].qualification}, {educationData[0].institution} ·{' '}
          {educationData[0].date}
        </dd>
        <dt>Also</dt>
        <dd>
          {educationData
            .slice(1)
            .map((e) => `${e.institution} (${e.qualification})`)
            .join(' · ')}
        </dd>
        <dt>Based in</dt>
        <dd>
          {profile.location} · originally from {profile.hometown}
        </dd>
        <dt>Into</dt>
        <dd>{profile.interests}</dd>
      </dl>
      <h3 className={s.sub}>Off the clock</h3>
      <p>{profile.hobbies}</p>
      <p className={s.note}>
        Yes, the whole site is an aim trainer. Keys 1 to 5 flick to each bot if
        you&apos;d rather not aim, or read the{' '}
        <Link href="/classic">classic scrolling version</Link>.
      </p>
    </>
  );
}

function Experience() {
  return (
    <>
      <ol className={s.tl}>
        {experienceData.map((item) => (
          <li key={`${item.company}-${item.title}-${item.date}`}>
            <div className={s.when}>{item.date.replace(' - ', ' – ')}</div>
            <div>
              <h3>{item.title}</h3>
              <p className={s.org}>
                {item.company} · {item.location}
              </p>
              {item.description.length > 0 && (
                <ul>
                  {item.description.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
              {item.technologies && (
                <p className={s.stack} style={{ marginTop: 8 }}>
                  {item.technologies.split(', ').join(' · ')}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <h3 className={s.sub}>Leadership</h3>
      <ul className={s.bullets}>
        {leadershipData.map((item) => (
          <li key={item.title}>
            <strong>{item.title}</strong>, {item.organisation}
          </li>
        ))}
      </ul>
    </>
  );
}

function Projects() {
  return (
    <>
      <div className={s.cards}>
        {projectsData.map((project) => (
          <article className={s.card} key={project.title}>
            <div className={s.cardTop}>
              <h3>{project.title}</h3>
              {project.badge && <span className={s.tag}>{project.badge}</span>}
            </div>
            <p>{project.description}</p>
            {project.tags.length > 0 && (
              <p className={s.stack}>{project.tags.join(' · ')}</p>
            )}
            {(project.githubUrl || project.liveUrl) && (
              <p className={s.links}>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noreferrer">
                    Code ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer">
                    Live ↗
                  </a>
                )}
              </p>
            )}
          </article>
        ))}
      </div>
      <h3 className={s.sub}>On the bench</h3>
      <ul className={s.bullets}>
        {benchIdeas.map((idea) => (
          <li key={idea}>{idea}</li>
        ))}
      </ul>
    </>
  );
}

function Loadout() {
  return (
    <>
      <div className={s.loadout}>
        {skillsData.map((group) => (
          <section className={s.loRow} key={group.category}>
            <div className={s.loSlot}>{group.slot}</div>
            <div>
              <h3>{group.category}</h3>
              <p className={s.stack}>{group.skills.join(' · ')}</p>
            </div>
          </section>
        ))}
      </div>
      <h3 className={s.sub}>Coursework I&apos;d bring up</h3>
      <ul className={s.bullets}>
        {courseworkData.map((course) => (
          <li key={course.code}>
            {course.name} ({course.code})
          </li>
        ))}
      </ul>
      <h3 className={s.sub}>Badges</h3>
      <ul className={s.bullets}>
        {certificationsData.map((cert) => (
          <li key={cert}>{cert}</li>
        ))}
      </ul>
    </>
  );
}

function CopyButton({ text }: { text: string }) {
  const [label, setLabel] = React.useState('Copy');
  const onClick = () => {
    const done = (l: string) => {
      setLabel(l);
      setTimeout(() => setLabel('Copy'), 1600);
    };
    if (!navigator.clipboard) return done('Failed');
    navigator.clipboard.writeText(text).then(
      () => done('Copied'),
      () => done('Failed'),
    );
  };
  return (
    <button className={s.btnCopy} onClick={onClick}>
      {label}
    </button>
  );
}

function Contact() {
  const handle = (url: string) => url.replace(/^https?:\/\//, '');
  return (
    <>
      <p className={s.lede}>
        Happy to talk about data infrastructure, backend systems, or a few
        rounds after work.
      </p>
      <div className={s.contact}>
        <div className={s.cRow}>
          <span className={s.cLabel}>Email</span>
          <code>{profile.email}</code>
          <CopyButton text={profile.email} />
        </div>
        <div className={s.cRow}>
          <span className={s.cLabel}>GitHub</span>
          <a href={profile.github} target="_blank" rel="noreferrer">
            {handle(profile.github)}
          </a>
          <span />
        </div>
        <div className={s.cRow}>
          <span className={s.cLabel}>LinkedIn</span>
          <a href={profile.linkedin} target="_blank" rel="noreferrer">
            {handle(profile.linkedin)}
          </a>
          <span />
        </div>
        <div className={s.cRow}>
          <span className={s.cLabel}>Résumé</span>
          <a href={profile.resume} target="_blank" rel="noreferrer">
            CV.pdf
          </a>
          <span />
        </div>
      </div>
    </>
  );
}

const SECTIONS: Record<BotId, () => React.JSX.Element> = {
  about: About,
  experience: Experience,
  projects: Projects,
  loadout: Loadout,
  contact: Contact,
};

export default function DossierBody({ id }: { id: BotId }) {
  const Section = SECTIONS[id];
  return <Section />;
}
