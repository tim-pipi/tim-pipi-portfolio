// Single source of portfolio content, shared by the range homepage (`/`)
// and the classic scrolling page (`/classic`).

export const profile = {
  name: 'Timothy Putra Prasetio',
  shortName: 'Tim',
  role: 'Software Engineer',
  company: 'Rakuten Asia',
  team: 'Ads',
  since: 'July 2026, full-time after interning on the same team',
  location: 'Singapore',
  hometown: 'Surabaya, Indonesia',
  interests: 'Distributed systems, data and platform engineering, SRE',
  hobbies:
    'Badminton, fingerstyle guitar, drawing, travelling, learning Japanese, and anything with a big drop: skydiving, roller coasters.',
  email: 'timothy.prasetio@gmail.com',
  github: 'https://github.com/tim-pipi',
  linkedin: 'https://linkedin.com/in/timpipi',
  resume: '/CV.pdf',
};

export type ExperienceItem = {
  title: string;
  company: string;
  location: string;
  description: string[];
  technologies?: string;
  date: string;
  imageUrl: string;
};

export const experienceData: ExperienceItem[] = [
  {
    title: 'Software Engineer',
    company: 'Rakuten Asia',
    location: 'Singapore',
    description: [
      'Joined the Ads team full-time after my internship, working on backend and data infrastructure',
    ],
    date: 'Jul 2026 - Present',
    imageUrl: '',
  },
  {
    title: 'Software Engineer Intern',
    company: 'Rakuten Asia',
    location: 'Singapore',
    description: [
      'Built a real-time anomaly detection and KPI monitoring system: events stream through Kafka into Apache Pinot, ThirdEye flags anomalies, and a Next.js and Spring Boot dashboard shows them',
      "Added a chat assistant on top with n8n workflows and Pinot's MCP server, so the team can ask about metrics in plain language",
    ],
    technologies: 'Kafka, Apache Pinot, ThirdEye, Next.js, Spring Boot, n8n, MCP',
    date: 'May 2025 - Jul 2026',
    imageUrl: '',
  },
  {
    title: 'Software Engineer Intern',
    company: 'CareSense.ai',
    location: 'Singapore',
    description: [
      'Developed a mobile application with Expo to improve healthcare through the help of an intelligent automated health coach',
      'Led Android development for the healthcare application, implementing secure authentication and health data integration using Google APIs',
    ],
    technologies:
      'React Native, Expo, Google APIs (Login, Fit, Health Connect), Android Development',
    date: 'Oct 2024 - May 2025',
    imageUrl: '/caresenseai.jpg',
  },
  {
    title: 'Teaching Assistant',
    company: 'National University of Singapore',
    location: 'Singapore',
    description: [
      'Taught CS1101S (Programming Methodology I) across AY23/24 Sem 1 and AY24/25 Sem 1',
      'Taught CS2103T (Software Engineering) across AY24/25 Sem 1 and Sem 2',
      'Taught CS2030S (Programming Methodology II) in AY23/24 Sem 2 and GEA1000N (Reasoning with Data) in AY22/23 Sem 2',
      'Recognised on the Honour List of Student Tutors for teaching excellence',
    ],
    date: 'Aug 2023 - May 2025',
    imageUrl: '',
  },
  {
    title: 'Full Stack Developer Intern',
    company: 'HomePal',
    location: 'Singapore',
    description: [
      'Built a mobile application using Flutter and Firebase to notify users of AI-detected falls, improving real-time alert efficiency for elderly care',
      'Designed and developed a GUI using Tkinter for Raspberry Pi, streamlining data interaction for machine learning model training, resulting in a 300% increase in processing speed',
      "Extended accessibility of Raspberry Pi's GUI by implementing a cross-platform web-based application using Python Dash, enhancing usability for diverse platforms",
      'Collaborated with cross-functional teams to integrate AI algorithms into applications, enhancing the reliability and accuracy of fall detection systems',
    ],
    technologies: 'Flutter, Firebase, Tkinter, Dash',
    date: 'Aug 2023 - Feb 2025',
    imageUrl: '/homepal.jpg',
  },
];

export const leadershipData = [
  { title: 'Residential Assistant', organisation: 'NUS College' },
  {
    title: 'Team Captain',
    organisation: 'NUSC Valorant interest group · NUSChooChoo',
  },
];

export type Project = {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  githubUrl: string;
  liveUrl: string;
  badge?: string;
};

// Empty `imageUrl` / `githubUrl` / `liveUrl` means "none".
export const projectsData: Project[] = [
  {
    title: 'rizzedin.com',
    description:
      'An AI dating platform for tech professionals, built at CursorHackSG 2025 and placed in the top 15 of ~500 participants.',
    tags: ['LinkedIn OAuth', 'Groq', 'Exa AI', 'Convex'],
    imageUrl: '',
    githubUrl: '',
    liveUrl: 'https://rizzedin.com',
    badge: 'Top 15 of ~500 · CursorHackSG 2025',
  },
  {
    title: 'Badminton Finder',
    description:
      'Reads game listings from Telegram groups and turns them into a searchable web app, so you can search for a game instead of scrolling chats.',
    tags: ['Next.js', 'Supabase', 'Python', 'Telethon'],
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    badge: 'Building',
  },
  {
    title: 'VCNet',
    // TODO: add a one-line summary and the arXiv link
    description: 'Research publication on arXiv.',
    tags: [],
    imageUrl: '',
    githubUrl: '',
    liveUrl: '',
    badge: 'arXiv · 2025',
  },
  {
    title: 'PeerPrep',
    description:
      'A collaborative coding platform designed for technical interview preparation, featuring real-time pair programming capabilities, video communication, and LeetCode-style coding problems. The platform includes a WebSocket-based pair programming system, question management interface, and user progress tracking system.',
    tags: [
      'React',
      'TypeScript',
      'Java Spring Boot',
      'MongoDB',
      'Docker',
      'WebSocket',
      'RabbitMQ',
      'shadcn/ui',
    ],
    imageUrl: '/peerprep.png',
    githubUrl: 'https://github.com/tim-pipi/peerprep',
    liveUrl: '',
  },
  {
    title: 'LetsGetHired',
    description:
      'A desktop application for internship application tracking built with Java and JavaFX. Features include comprehensive test suite using Gradle with over 90% test coverage, helping students manage their internship application process effectively.',
    tags: ['Java', 'JavaFX', 'Gradle', 'JUnit'],
    imageUrl: '/letsgethired.png',
    githubUrl: 'https://github.com/tim-pipi/letsgethired',
    liveUrl: '',
  },
  {
    title: 'Public Health Screening Application',
    description:
      'A web application enabling medical clerks to manage patient data and diagnoses. Features responsive UI components built with React and seamless integration with MongoDB backend for efficient data management.',
    tags: ['JavaScript', 'React', 'MongoDB'],
    imageUrl: '',
    githubUrl: 'https://github.com/tim-pipi/phs-app',
    liveUrl: '',
  },
  {
    title: 'This Portfolio',
    description:
      'This portfolio website is built with Next.js, Tailwind CSS, and Framer Motion. The homepage is an aim trainer drawn on a canvas, where each target bot opens a section; a classic scrolling version sits alongside it.',
    tags: ['Next.js', 'Canvas', 'Tailwind CSS', 'Framer Motion'],
    imageUrl: '/portfolio.png',
    githubUrl: 'https://github.com/tim-pipi/portfolio',
    liveUrl: '',
  },
];

export const benchIdeas = [
  'A bill-splitting tracker for housemates sharing rent and utilities',
  'A pixel-art inventory of things I own that grows into a small life sim',
];

// `slot` is the loadout name the range homepage shows for each category.
export const skillsData = [
  {
    category: 'Programming Languages',
    slot: 'Primary',
    skills: [
      'Java',
      'Python',
      'C++',
      'JavaScript',
      'TypeScript',
      'Golang',
      'Dart',
      'SQL',
    ],
  },
  {
    category: 'Backend Development',
    slot: 'Secondary',
    skills: [
      'Spring Boot',
      'Django',
      'Firebase',
      'MongoDB',
      'Supabase',
      'Convex',
    ],
  },
  {
    category: 'Data & Streaming',
    slot: 'Heavy',
    skills: ['Kafka', 'Apache Pinot', 'ThirdEye', 'PySpark'],
  },
  {
    category: 'Frontend Development',
    slot: 'Sidearm',
    skills: [
      'React',
      'Next.js',
      'HTML/CSS',
      'Flutter',
      'React Native',
      'Expo',
      'Tkinter',
    ],
  },
  {
    category: 'Tools & Infrastructure',
    slot: 'Utility',
    skills: [
      'Git',
      'Docker',
      'Kubernetes',
      'Jenkins',
      'Bash',
      'PostgreSQL',
      'RabbitMQ',
      'WebSocket',
    ],
  },
  {
    category: 'Agents & Automation',
    slot: 'Ultimate',
    skills: ['n8n', 'MCP servers', 'Groq', 'Exa AI'],
  },
];

export const educationData = [
  {
    institution: 'National University of Singapore',
    qualification: 'Bachelor of Computing in Computer Science',
    date: 'Aug 2022 - May 2026',
  },
  {
    institution: 'NUS College',
    qualification: "Bachelor's Degree",
    date: 'Aug 2022 - Aug 2026',
  },
  {
    institution: 'Anglo-Chinese School (Independent)',
    qualification: 'International Baccalaureate',
    date: 'Feb 2020 - Nov 2021',
  },
];

export const courseworkData = [
  { code: 'CS3230', name: 'Algorithm design and NP-completeness' },
  {
    code: 'CS4222',
    name: 'IoT and wireless networking on CC2650 SensorTags with Contiki-NG',
  },
  { code: 'CS4225', name: 'Big data with PySpark' },
];

export const certificationsData = [
  'Software Engineering Focus Area',
  'Japanese Language Proficiency (Intermediate)',
  'Top Students for Digital Ethics and Data Privacy',
  'Honour List of Student Tutors',
  'Orbital - Apollo 11 (Advanced)',
];
