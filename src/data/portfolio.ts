// Single source of portfolio content, shared by the range homepage (`/`)
// and the classic scrolling page (`/classic`).

export const profile = {
  name: 'Timothy Putra Prasetio',
  shortName: 'Tim',
  role: 'Software Engineer',
  company: 'Rakuten Asia',
  team: 'Global Advertisement Tech',
  since: 'July 2026, full-time after interning on the same team',
  location: 'Singapore',
  hometown: 'Surabaya, Indonesia',
  summary:
    'Backend and real-time data infrastructure (Kafka, Apache Pinot, Spring Boot, Kubernetes)',
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
      "Develop and maintain the database service storing all item and shop data for Rakuten's ad platform, backing ad serving at millions of events per day across the Rakuten ecosystem",
      'Cut Google Cloud Storage costs by 67%, from ~US$1,200 to ~US$400 per day (~US$290K/year saved), by implementing data retention policies, storage-class tiering and automated cleanup of stale data',
    ],
    date: 'Jul 2026 - Present',
    imageUrl: '',
  },
  {
    title: 'Software Engineer Intern',
    company: 'Rakuten Asia',
    location: 'Singapore',
    description: [
      'Built a real-time KPI anomaly-detection pipeline (Kafka → Apache Pinot → ThirdEye) monitoring the full ad funnel (requests, impressions, clicks, add-to-cart, conversions and ad sales), cutting time-to-detect for metric drops from hours to minutes',
      'Developed a Next.js + Spring Boot monitoring dashboard for managers and engineers, replacing ad-hoc queries',
      'Extended the system with a conversational AI assistant (n8n workflows + Pinot MCP server) that lets non-engineers query ad performance and generate reports in natural language',
      'Received a full-time return offer and converted to Software Engineer on the same team',
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
      'Led Android development of a healthcare app with ~200 paying users, implementing secure Google OAuth sign-in and health-data sync via Google Fit and Health Connect',
      "Built React Native (Expo) features integrating the app's AI health coach",
    ],
    technologies:
      'React Native, Expo, Google APIs (OAuth, Fit, Health Connect), Android Development',
    date: 'Oct 2024 - May 2025',
    imageUrl: '/caresenseai.jpg',
  },
  {
    title: 'Full-stack Developer Intern (Part-time)',
    company: 'HomePal Technologies',
    location: 'Singapore',
    description: [
      'Built an AI-enabled fall-detection app (Flutter, Django) with Firebase real-time alerts for elderly-care monitoring, deployed across 2 nursing homes',
      'Built Raspberry Pi tooling (Tkinter, Dash) for ML training-data preparation, cutting processing time from ~12h to ~4h (3× faster)',
    ],
    technologies: 'Flutter, Django, Firebase, Tkinter, Dash',
    date: 'Aug 2023 - Dec 2024',
    imageUrl: '/homepal.jpg',
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
];

export type LeadershipItem = {
  title: string;
  organisation: string;
  date?: string;
  description?: string;
};

export const leadershipData: LeadershipItem[] = [
  {
    title: 'Vice President',
    organisation: 'NUS Guitar Ensemble',
    date: 'Apr 2023 - Apr 2024',
    description:
      'Led a 10-member executive committee; managed a $20,000 budget for concerts reaching 500+ attendees',
  },
  {
    title: 'House Captain',
    organisation: 'NUS College',
    date: 'Aug 2022 - Aug 2023',
    description: 'Ran 10 welfare initiatives for 150 residents',
  },
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
  liveLabel?: string; // defaults to "Live Demo" / "Live"
  badge?: string;
};

// Empty `imageUrl` / `githubUrl` / `liveUrl` means "none".
export const projectsData: Project[] = [
  {
    title: 'rizzedin.com',
    description:
      'An AI-powered matching platform for tech professionals, built at CursorHackSG 2025 and placed in the top 15 of ~500 participants.',
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
    description:
      'The Geometry of Cortical Computation: Manifold Disentanglement and Predictive Dynamics in VCNet. B. A. Hill, X. Zhang, T. P. Prasetio. arXiv:2508.02995.',
    tags: [],
    imageUrl: '',
    githubUrl: '',
    liveUrl: 'https://arxiv.org/abs/2508.02995',
    liveLabel: 'Paper',
    badge: 'arXiv · 2025',
  },
  {
    title: 'PeerPrep',
    description:
      'A collaborative technical-interview platform (Aug – Nov 2024): containerised microservices for real-time pair programming with video calls, with WebSocket-based collaborative editing and RabbitMQ for matchmaking and inter-service messaging.',
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
      'A portfolio website built with Next.js, Tailwind CSS, and Framer Motion. Visitors give their name on a landing page, then enter an aim-trainer homepage drawn on a canvas, where each target bot opens a section and clearing all five posts a time to a shared leaderboard; a classic scrolling version sits alongside it.',
    tags: ['Next.js', 'Canvas', 'Tailwind CSS', 'Framer Motion', 'Upstash Redis'],
    imageUrl: '/portfolio.png',
    githubUrl: 'https://github.com/tim-pipi/tim-pipi-portfolio',
    liveUrl: 'https://tim-pipi-portfolio.vercel.app/',
  },
];

export const benchIdeas = [
  'A bill-splitting tracker for housemates sharing rent and utilities',
  'A pixel-art inventory of things I own that grows into a small life sim',
];

// `slot` is the loadout name the range homepage shows for each category.
export const skillsData = [
  {
    category: 'Languages',
    slot: 'Primary',
    skills: ['Java', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'C++'],
  },
  {
    category: 'Data & Infrastructure',
    slot: 'Heavy',
    skills: [
      'Kafka',
      'Apache Pinot',
      'ThirdEye',
      'Docker',
      'Kubernetes',
      'Jenkins',
      'RabbitMQ',
      'WebSocket',
    ],
  },
  {
    category: 'Backend',
    slot: 'Secondary',
    skills: [
      'Spring Boot',
      'Django',
      'PostgreSQL',
      'MongoDB',
      'Firebase',
      'REST APIs',
    ],
  },
  {
    category: 'Frontend & Mobile',
    slot: 'Sidearm',
    skills: ['React', 'Next.js', 'Flutter', 'React Native'],
  },
  {
    category: 'AI Tooling',
    slot: 'Ultimate',
    skills: ['n8n', 'Model Context Protocol (MCP)', 'LLM APIs'],
  },
];

export type EducationItem = {
  institution: string;
  qualification: string;
  date: string;
  details?: string[];
};

export const educationData: EducationItem[] = [
  {
    institution: 'National University of Singapore',
    qualification:
      'Bachelor of Computing (Honours) in Computer Science, Highest Distinction',
    date: 'Aug 2022 - May 2026',
    details: [
      'GPA 4.55 / 5.00',
      'ASEAN Undergraduate Scholarship (full ride)',
    ],
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
