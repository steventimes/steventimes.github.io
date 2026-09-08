export interface Link {
  label: string;
  href: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface Profile {
  role: string;
  intro: string;
  photoPath: string;
  resumePath: string;
  email: string;
  githubUrl: string;
  metadata: Array<{ label: string; value: string }>;
}

export interface ResearchItem {
  id: string;
  title: string;
  organization: string;
  time: string;
  summary: string;
  question: string;
  contribution: string;
  methods: string[];
}

export interface Publication {
  title: string;
  authors: string;
  venue: string;
  details: string;
  role: string;
  url: string;
}

export interface FeaturedExperience {
  title: string;
  organization: string;
  time: string;
  summary: string;
  contributions: string[];
  technologies: string[];
  link: Link;
}

export interface ExperienceItem {
  title: string;
  organization: string;
  time: string;
  summary: string;
}

export interface PublicProject {
  name: string;
  description: string;
  language: string;
  url: string;
  homepage?: string;
  packageUrl?: string;
}

export interface OtherWorkItem {
  id: string;
  title: string;
  description: string;
  link: Link;
}

export interface TechnologyGroup {
  label: string;
  items: string[];
}

interface Site {
  name: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  githubUrl: string;
  resumePath: string;
  navigation: NavigationItem[];
  profile: Profile;
  research: {
    primary: ResearchItem;
    secondary: ResearchItem;
  };
  publication: Publication;
  featuredExperience: FeaturedExperience;
  supportingExperience: ExperienceItem[];
  publicCode: PublicProject[];
  otherWork: OtherWorkItem[];
  technology: TechnologyGroup[];
  contactText: string;
}

export const site: Site = {
  name: "Hongchen (Steven) Yang",
  role: "Brandeis computer science student researching adaptive storage systems and building AI agent workflows.",
  location: "Waltham, MA",
  email: "stevenyang0316@gmail.com",
  linkedin: "https://www.linkedin.com/in/hongchen-yang-3803b4294/",
  githubUrl: "https://github.com/steventimes",
  resumePath: "/resume.pdf",

  navigation: [
    { label: "Research", href: "#research" },
    { label: "Publication", href: "#publication" },
    { label: "Experience", href: "#experience" },
    { label: "Code", href: "#code" },
    { label: "Contact", href: "#contact" }
  ],

  profile: {
    role: "Computer science student at Brandeis University",
    intro: "I study adaptive storage systems and build AI agent workflows.",
    photoPath: "/headphoto.jpg",
    resumePath: "/resume.pdf",
    email: "stevenyang0316@gmail.com",
    githubUrl: "https://github.com/steventimes",
    metadata: [
      { label: "Institution", value: "Brandeis University" },
      { label: "Degree", value: "B.S. Computer Science" },
      { label: "Graduation", value: "Expected December 2026" },
      { label: "Academic record", value: "GPA: 3.748 / 4.0 · Dean's List every completed semester" }
    ]
  },

  research: {
    primary: {
      id: "fluidlsm",
      title: "FluidLSM and workload-aware RocksDB tuning",
      organization: "Smart & Scalable Data Systems Lab · Brandeis University",
      time: "May 2025 – Present",
      summary: "I study how storage systems respond to changing workloads.",
      question: "How do skew, burstiness, and changing access patterns affect compaction behavior and performance in LSM-tree systems?",
      contribution: "I build controlled RocksDB benchmarks and group dependent configuration parameters to narrow the tuning search space. I use these benchmarks to evaluate adaptive tuning methods for FluidLSM.",
      methods: [
        "RocksDB",
        "LSM trees",
        "Bayesian optimization",
        "tree-based surrogate models",
        "lightweight online learning"
      ]
    },
    secondary: {
      id: "fragmented-data",
      title: "Data fragmentation and text-to-SQL evaluation",
      organization: "Data Science Intern (Independent Study) · Brandeis University",
      time: "Jan 2026 – May 2026",
      summary: "A controlled benchmark for measuring how fragmented administrative data changes text-to-SQL performance.",
      question: "How can we vary data fragmentation consistently to compare text-to-SQL systems?",
      contribution: "I built synthetic schemas and configurable fragmentation generators. I used Python ETL, provenance tracking, and join and query evaluation to compare the original and fragmented data.",
      methods: ["Python", "SQL", "synthetic data", "provenance", "text-to-SQL"]
    }
  },

  publication: {
    title: "From Single-View to Multi-view: Learning Informative Graphs for Robust Subspace Segmentation",
    authors: "Dazhai Yang, Jiao Liu, Hongchen Yang, Hualin Liu, and Tianzhe Lou",
    venue: "Advances in Artificial Intelligence, Electronic Instruments and Information Systems",
    details: "Springer · 2026 · pp. 82–96",
    role: "Third author; contributed in a supporting role.",
    url: "https://doi.org/10.1007/978-3-032-23708-8_8"
  },

  featuredExperience: {
    title: "AI Development Intern",
    organization: "Hefei City Cloud Data Center Co., Ltd.",
    time: "Jun 2026 – Aug 2026",
    summary: "I worked on email reimbursement automation, agent memory, and retrieval.",
    contributions: [
      "Built an email-to-reimbursement workflow that ingests messages and attachments, extracts merchant, amount, and date fields, and sends structured results to the reimbursement system.",
      "Developed memory assignment and vector retrieval nodes for persistent agent context, filtered search, and memory lifecycle management.",
      "Extended Java services and Vue interfaces for memory resources and workflow nodes. Migrated workflows and integrated database, vector-store, and model services."
    ],
    technologies: ["Java", "Spring Boot", "Vue", "Qdrant", "agent memory", "workflow orchestration"],
    link: {
      label: "View reimbursement workflow code",
      href: "https://github.com/steventimes/Email-project-yudao"
    }
  },

  supportingExperience: [
    {
      title: "Teaching Assistant, Introduction to Database",
      organization: "Brandeis University",
      time: "Jan 2026 – May 2026",
      summary: "Led office hours and review sessions for about 50 students and graded coursework on SQL, data modeling, normalization, indexing, and query optimization."
    },
    {
      title: "Software Engineering Intern",
      organization: "Shanghai Development Center of Computer Software Technology",
      time: "May 2024 – Aug 2024",
      summary: "Traced a text-to-SQL workflow and worked with a Spring Boot and MyBatis backend. Used Linux tools to run services and inspect logs, and refactored Java service logic."
    }
  ],

  publicCode: [
    {
      name: "fpstreams",
      description: "A Python library for typed, lazy data pipelines. Supports synchronous streams, structured async concurrency, record transforms, and optional Rust execution.",
      language: "Python · Rust",
      url: "https://github.com/steventimes/fpstreams",
      homepage: "https://steventimes.github.io/fpstreams/",
      packageUrl: "https://pypi.org/project/fpstreams/"
    },
    {
      name: "dependency-checker",
      description: "A coding-agent skill and MCP interface for inspecting dependencies across language ecosystems. Indexes declarations, resolved versions, source usage, security results, and policy findings.",
      language: "Python",
      url: "https://github.com/steventimes/dependency-checker"
    }
  ],

  otherWork: [
    {
      id: "blacklight",
      title: "Blacklight privacy detection",
      description: "Helped research, develop, and validate TikTok and X tracking-pixel detection in Blacklight. The privacy scanner has processed more than 18 million scans.",
      link: {
        label: "Read the Blacklight update",
        href: "https://themarkup.org/blacklight/2026/02/09/blacklight-update-tiktok-x-twitter"
      }
    },
    {
      id: "software-systems-atlas",
      title: "Software Systems Atlas",
      description: "A software-systems learning site with lessons in English and Chinese, organized by topic and learning path.",
      link: {
        label: "Open Software Systems Atlas",
        href: "https://software-systems-atlas.pages.dev"
      }
    }
  ],

  technology: [
    { label: "Programming", items: ["Java", "C++", "Python", "Go", "Rust", "JavaScript", "TypeScript", "SQL"] },
    { label: "Systems & Data", items: ["RocksDB", "PostgreSQL", "MySQL", "DuckDB", "Redis", "Qdrant"] },
    { label: "Backend & Web", items: ["Spring Boot", "MyBatis", "Vue", "Astro", "HTML", "CSS"] },
    { label: "Tooling", items: ["Docker", "Linux", "Git", "GitHub Actions"] },
    { label: "Languages", items: ["Mandarin Chinese (Native)", "English (Fluent)"] }
  ],

  contactText: "Email me about database research, AI systems, or software engineering."
};
