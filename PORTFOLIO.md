# Portfolio — Source of Truth

This file is the canonical record of my professional profile. The website, CV (`public/CV.pdf`), LinkedIn, and any other format should be derived from what's here.

**Workflow:** update this file first, then propagate the change to each output. The "Appears on" notes show where every item is currently used, so it's easy to see what needs syncing.

_Last updated: 2026-10-13_

---

## Profile

| Field | Value |
| --- | --- |
| Name | Timothy Putra Prasetio |
| Headline | SWE @ Rakuten Asia \| NUS CS |
| Current role | Software Engineer, Rakuten Asia |
| Location | Singapore |
| Email | timothy.prasetio@gmail.com |
| LinkedIn | https://linkedin.com/in/timpipi |
| GitHub | https://github.com/tim-pipi |
| Portfolio | https://tim-pipi-portfolio.vercel.app/ |
| Phone | _kept off this file because the repo is public; see the CV_ |

**Focus:** Backend and real-time data infrastructure (Kafka, Apache Pinot, Spring Boot, Kubernetes)

**Top skills (LinkedIn):** Software Engineering Practices · Japanese · Healthcare Information Technology (HIT)

## Summary

**Short (LinkedIn):**
> I am someone who's passionate about building solutions for real world problems! Love getting my hands dirty through hands-on experience, prototyping solutions and improving them through feedback. Excited to collaborate with like-minded individuals and organizations to create a brighter, more inclusive future through technology!

**Long (website About section):**
- Software Engineer at Rakuten Asia in Singapore, and a Computer Science graduate of the National University of Singapore (Highest Distinction, ASEAN Undergraduate Scholar). Works on backend and real-time data infrastructure with Kafka, Apache Pinot, Spring Boot and Kubernetes.
- Passionate about building solutions for real world problems; loves hands-on experience, prototyping solutions and improving them through feedback.
- Programming journey started by building a first Android app in secondary school. Since then: mobile applications, full-stack web development, and two years as a Teaching Assistant at NUS across six semesters of programming and software engineering modules.
- Outside coding: playing badminton, playing guitar, travelling the world, exploring new technologies.

**Range About section** (`range/dossier-body.tsx`): works in Rakuten Asia's Global Advertisement Tech department on backend and real-time data infrastructure. Interests: distributed systems, data and platform engineering, SRE. Off the clock: badminton, fingerstyle guitar, drawing, travelling, learning Japanese, skydiving and roller coasters. Originally from Surabaya, Indonesia.

_Appears on: website (classic `intro.tsx`, `about.tsx`; range About), LinkedIn_

---

## Experience

### Software Engineer — Rakuten Asia
- **Department:** Global Advertisement Tech
- **Dates:** Jul 2026 – Present
- **Location:** Singapore
- **Highlights:**
  - Develop and maintain the database service storing all item and shop data for Rakuten's ad platform, backing ad serving at millions of events per day across the Rakuten ecosystem
  - Cut Google Cloud Storage costs by 67%, from ~US$1,200 to ~US$400 per day (~US$290K/year saved), by implementing data retention policies, storage-class tiering and automated cleanup of stale data
- **Technologies:** _not listed on the CV_
- _Appears on: website, CV_

### Software Engineer Intern — Rakuten Asia
- **Dates:** May 2025 – Jul 2026
- **Location:** Singapore
- **Highlights:**
  - Built a real-time KPI anomaly-detection pipeline (Kafka → Apache Pinot → ThirdEye) monitoring the full ad funnel (requests, impressions, clicks, add-to-cart, conversions and ad sales), cutting time-to-detect for metric drops from hours to minutes
  - Developed a Next.js + Spring Boot monitoring dashboard for managers and engineers, replacing ad-hoc queries
  - Extended the system with a conversational AI assistant (n8n workflows + Pinot MCP server) that lets non-engineers query ad performance and generate reports in natural language
  - Received a full-time return offer and converted to Software Engineer on the same team
- **Technologies:** Kafka, Apache Pinot, ThirdEye, Next.js, Spring Boot, n8n, MCP
- _Appears on: website, CV_

### Software Engineer Intern — CareSense.ai
- **Dates:** Oct 2024 – May 2025
- **Location:** Singapore
- **Highlights:**
  - Led Android development of a healthcare app with ~200 paying users, implementing secure Google OAuth sign-in and health-data sync via Google Fit and Health Connect
  - Built React Native (Expo) features integrating the app's AI health coach
- **Technologies:** React Native, Expo, Google APIs (OAuth, Fit, Health Connect), Android Development
- **Image:** `/caresenseai.jpg`
- _Appears on: website, CV, LinkedIn (older wording, first bullet only)_

### Teaching Assistant — National University of Singapore
- **Dates:** Aug 2023 – May 2025
- **Location:** Singapore
- **Courses taught:**
  | Semester | Course |
  | --- | --- |
  | AY22/23 Sem 2 | GEA1000N — Reasoning with Data |
  | AY23/24 Sem 1 | CS1101S — Programming Methodology I |
  | AY23/24 Sem 2 | CS2030S — Programming Methodology II |
  | AY24/25 Sem 1 | CS1101S — Programming Methodology I |
  | AY24/25 Sem 1 | CS2103T — Software Engineering |
  | AY24/25 Sem 2 | CS2103T — Software Engineering |
- **Recognition:** Honour List of Student Tutors
- _Appears on: website, LinkedIn_

### Full-stack Developer Intern (Part-time) — HomePal Technologies
- **Dates:** Aug 2023 – Dec 2024
- **Location:** Singapore
- **Highlights:**
  - Built an AI-enabled fall-detection app (Flutter, Django) with Firebase real-time alerts for elderly-care monitoring, deployed across 2 nursing homes
  - Built Raspberry Pi tooling (Tkinter, Dash) for ML training-data preparation, cutting processing time from ~12h to ~4h (3× faster)
- **Technologies:** Flutter, Django, Firebase, Tkinter, Dash
- **Image:** `/homepal.jpg`
- _Appears on: website, CV, LinkedIn (older wording: "Full Stack Developer Intern — HomePal", Aug 2023 – Feb 2025)_

---

## Leadership

| Role | Organisation | Dates | Details | Appears on |
| --- | --- | --- | --- | --- |
| Vice President | NUS Guitar Ensemble | Apr 2023 – Apr 2024 | Led a 10-member executive committee; managed a $20,000 budget for concerts reaching 500+ attendees | website, CV |
| House Captain | NUS College | Aug 2022 – Aug 2023 | Ran 10 welfare initiatives for 150 residents | website, CV |
| Residential Assistant | NUS College | — | — | website |
| Team Captain | NUSC Valorant interest group (NUSChooChoo) | — | — | website |

---

## Education

| Institution | Qualification | Dates | Appears on |
| --- | --- | --- | --- |
| National University of Singapore | Bachelor of Computing (Honours) in Computer Science, Highest Distinction · GPA 4.55 / 5.00 · ASEAN Undergraduate Scholarship (full ride) | Aug 2022 – May 2026 | website, CV, LinkedIn (degree name only) |
| NUS College | Bachelor's Degree | Aug 2022 – Aug 2026 | website, LinkedIn |
| Anglo-Chinese School (Independent) | International Baccalaureate | Feb 2020 – Nov 2021 | website, LinkedIn |
| Anglo-Chinese School (Independent) | Integrated Programme | 2018 – 2019 | LinkedIn |
| SMP Kristen Petra 1 | — | 2014 – 2016 | LinkedIn |

**Selected coursework** (website): CS3230 Algorithm design and NP-completeness · CS4222 IoT and wireless networking on CC2650 SensorTags with Contiki-NG · CS4225 Big data with PySpark

---

## Projects

### rizzedin.com
An AI-powered matching platform for tech professionals, built at CursorHackSG 2025 and placed in the top 15 of ~500 participants.
- **Tech:** LinkedIn OAuth, Groq, Exa AI, Convex
- **Code:** —
- **Live:** https://rizzedin.com _(unconfirmed)_
- _Appears on: website, CV_

### Badminton Finder _(building)_
Reads game listings from Telegram groups and turns them into a searchable web app, so you can search for a game instead of scrolling chats.
- **Tech:** Next.js, Supabase, Python, Telethon
- _Appears on: website_

### VCNet (publication)
**The Geometry of Cortical Computation: Manifold Disentanglement and Predictive Dynamics in VCNet.** B. A. Hill, X. Zhang, T. P. Prasetio. arXiv:2508.02995, 2025.
- **Paper:** https://arxiv.org/abs/2508.02995
- _Appears on: website, CV_

### PeerPrep
A collaborative technical-interview platform (Aug – Nov 2024): containerised microservices for real-time pair programming with video calls, with WebSocket-based collaborative editing and RabbitMQ for matchmaking and inter-service messaging.
- **Tech:** React, TypeScript, Java Spring Boot, MongoDB, Docker, WebSocket, RabbitMQ, shadcn/ui
- **Code:** https://github.com/tim-pipi/peerprep
- **Live:** —
- **Image:** `/peerprep.png`
- _Appears on: website, CV_

### LetsGetHired
A desktop application for internship application tracking built with Java and JavaFX. Features include a comprehensive test suite using Gradle with over 90% test coverage, helping students manage their internship application process effectively.
- **Tech:** Java, JavaFX, Gradle, JUnit
- **Code:** https://github.com/tim-pipi/letsgethired
- **Live:** —
- **Image:** `/letsgethired.png`
- _Appears on: website_

### Public Health Screening Application
A web application enabling medical clerks to manage patient data and diagnoses. Features responsive UI components built with React and seamless integration with a MongoDB backend for efficient data management.
- **Tech:** JavaScript, React, MongoDB
- **Code:** https://github.com/tim-pipi/phs-app
- **Live:** —
- **Image:** —
- _Appears on: website_

### This Portfolio
A portfolio website built with Next.js, Tailwind CSS, and Framer Motion. The homepage is an aim trainer drawn on a canvas, where each target bot opens a section; a classic scrolling version sits alongside it.
- **Tech:** Next.js, Canvas, Tailwind CSS, Framer Motion
- **Code:** https://github.com/tim-pipi/tim-pipi-portfolio
- **Live:** https://tim-pipi-portfolio.vercel.app/
- **Image:** `/portfolio.png`
- _Appears on: website_

**On the bench** (website): a bill-splitting tracker for housemates sharing rent and utilities; a pixel-art inventory of things I own that grows into a small life sim.

---

## Skills

| Category | Skills | Range slot |
| --- | --- | --- |
| Languages | Java, Python, TypeScript, JavaScript, SQL, C++ | Primary |
| Data & Infrastructure | Kafka, Apache Pinot, ThirdEye, Docker, Kubernetes, Jenkins, RabbitMQ, WebSocket | Heavy |
| Backend | Spring Boot, Django, PostgreSQL, MongoDB, Firebase, REST APIs | Secondary |
| Frontend & Mobile | React, Next.js, Flutter, React Native | Sidearm |
| AI Tooling | n8n, Model Context Protocol (MCP), LLM APIs | Ultimate |
| Spoken languages | Japanese (Intermediate) | — |
| Domains | Healthcare Information Technology (HIT) | — |

_Appears on: website and CV (first five rows), LinkedIn (Japanese, HIT, Software Engineering Practices). Previously on the website but dropped to match the CV: Golang, Dart, HTML/CSS, Expo, Tkinter, Git._

---

## Certifications & Awards

- Software Engineering Focus Area
- Japanese Language Proficiency (Intermediate)
- Top Students for Digital Ethics and Data Privacy
- Honour List of Student Tutors
- Orbital — Apollo 11 (Advanced)

_Appears on: website, LinkedIn_

---

## Where each format lives

| Format | Location | How to update |
| --- | --- | --- |
| Website | `src/data/portfolio.ts` (shared by the range at `/` and the classic page at `/classic`) | Edit the data there; prose in `intro.tsx`, `about.tsx`, `contact.tsx` and `range/dossier-body.tsx` |
| CV | `Timothy_Prasetio_CV.md` → `public/CV.pdf` | Update the markdown from this file, regenerate the PDF and replace `public/CV.pdf` |
| LinkedIn | https://linkedin.com/in/timpipi | Edit manually; export with "Save to PDF" to check it against this file |

## Open items

- [x] Write highlights and technologies for both Rakuten Asia roles (filled from the CV; the full-time role still has no technologies line)
- [x] The website's "This Portfolio" project now links to `github.com/tim-pipi/tim-pipi-portfolio` (this repo)
- [ ] Add a CareSense.ai bullet about Android development and the technologies to LinkedIn
- [ ] Check that `public/CV.pdf` matches this file (it predates `Timothy_Prasetio_CV.md`)
- [ ] Confirm https://rizzedin.com is live
- [ ] Update LinkedIn experience wording to match the CV (Rakuten, CareSense, HomePal)
