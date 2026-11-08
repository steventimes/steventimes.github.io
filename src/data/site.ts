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
  corpusUrl?: string;
  preview:
    | { kind: "code"; label: string; content: string }
    | { kind: "evidence"; label: string; items: Array<{ source: string; purpose: string }> };
}

export interface OtherWorkItem {
  id: string;
  title: string;
  description: string;
  links: Link[];
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
      { label: "Degree", value: "B.S. Computer Science" },
      { label: "Graduation", value: "Expected December 2026" },
      { label: "Academic record", value: "GPA 3.748 / 4.0. Dean's List every completed semester. Provost's Summer Undergraduate Research Fellowship, Summer 2025." }
    ]
  },

  research: {
    primary: {
      id: "fluidlsm",
      title: "FluidLSM and adaptive RocksDB tuning",
      organization: "Smart & Scalable Data Systems Lab · Brandeis University",
      time: "May 2025 to present",
      summary: "I lead the FluidLSM evaluation of LLM-based RocksDB tuning under faculty supervision, working with PhD researchers.",
      question: "How do tuning choices and LSM layouts affect throughput and latency across workloads?",
      contribution: "I made compaction settings configurable in C++ and contributed benchmark scripts to compare LSM layouts across workloads.",
      methods: [
        "RocksDB",
        "LSM trees",
        "C++",
        "LLM-based tuning evaluation",
        "throughput and latency benchmarks"
      ]
    },
    secondary: {
      id: "fragmented-data",
      title: "Data fragmentation and SQL generation from text",
      organization: "Data Science Intern (Independent Study) · Brandeis University",
      time: "Jan 2026 to May 2026",
      summary: "A controlled benchmark for measuring how fragmented administrative data affects SQL generation from text.",
      question: "How can we vary data fragmentation consistently when comparing systems that generate SQL from text?",
      contribution: "I built synthetic schemas and configurable fragmentation generators. I used Python ETL, provenance tracking, and join and query evaluation to compare the original and fragmented data.",
      methods: ["Python", "SQL", "synthetic data", "provenance", "SQL generation"]
    }
  },

  publication: {
    title: "From Single-View to Multi-view: Learning Informative Graphs for Robust Subspace Segmentation",
    authors: "Dazhai Yang, Jiao Liu, Hongchen Yang, Hualin Liu, and Tianzhe Lou",
    venue: "Advances in Artificial Intelligence, Electronic Instruments and Information Systems",
    details: "Springer, 2026, pages 82 to 96.",
    role: "Third author. Contributed in a supporting role.",
    url: "https://doi.org/10.1007/978-3-032-23708-8_8"
  },

  featuredExperience: {
    title: "AI Development Intern",
    organization: "Hefei City Cloud Data Center Co., Ltd.",
    time: "Jun 2026 to Aug 2026",
    summary: "I built email reimbursement automation and workflow tools for agent memory and retrieval.",
    contributions: [
      "Built an IMAP connector and Dify workflow to extract reimbursement details from emails and attachments and send them to Yudao approvals.",
      "Added per-user mailbox authorization and temporary workflow access tokens, keeping credentials in the backend.",
      "Developed five nodes for terminology lookup, memory retrieval and updates, and report generation, with supporting APIs and resource pages."
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
      time: "Jan 2026 to May 2026",
      summary: "Led office hours and review sessions for about 50 students and graded coursework on SQL, data modeling, normalization, indexing, and query optimization."
    },
    {
      title: "Software Engineering Intern",
      organization: "Shanghai Development Center of Computer Software Technology",
      time: "May 2024 to Aug 2024",
      summary: "Refactored Java service logic with streams and lambda expressions and used Linux logs to debug services. Traced Supersonic AI’s text-to-SQL workflow from translation and parsing through planning and execution."
    }
  ],

  publicCode: [
    {
      name: "fpstreams",
      description: "Filter, transform, and aggregate records with typed, lazy Python pipelines. Supports bounded async execution, resource cleanup, and Rust kernels for supported operations. Selected for the XERJ Corpus Hub as a reference for AI coding agents.",
      language: "Python · Rust",
      url: "https://github.com/steventimes/fpstreams",
      homepage: "https://steventimes.github.io/fpstreams/",
      packageUrl: "https://pypi.org/project/fpstreams/",
      corpusUrl: "https://hub.xerj.org/contributors/steventimes",
      preview: {
        kind: "code",
        label: "Paid orders by region",
        content: "from fpstreams import agg, col, flow\n\norders = [\n    {\"region\": \"eu\", \"status\": \"paid\", \"price\": 12, \"quantity\": 2},\n    {\"region\": \"us\", \"status\": \"paid\", \"price\": 20, \"quantity\": 1},\n    {\"region\": \"eu\", \"status\": \"cancelled\", \"price\": 99, \"quantity\": 1},\n    {\"region\": \"eu\", \"status\": \"paid\", \"price\": 8, \"quantity\": 3},\n]\nsummary = (\n    flow(orders)\n    .filter(col(\"status\") == \"paid\")\n    .with_columns(revenue=col(\"price\") * col(\"quantity\"))\n    .group_by(\"region\")\n    .aggregate(orders=agg.count(), revenue=agg.sum(\"revenue\"))\n    .sort_by(\"region\")\n    .to_list()\n)\nprint(summary)\n# [{'region': 'eu', 'orders': 2, 'revenue': 48},\n#  {'region': 'us', 'orders': 1, 'revenue': 20}]"
      }
    },
    {
      name: "dependency-checker",
      description: "A skill and MCP interface for coding agents to inspect dependencies across languages. Indexes declarations, resolved versions, source usage, security results, and policy findings.",
      language: "Python",
      url: "https://github.com/steventimes/dependency-checker",
      preview: {
        kind: "evidence",
        label: "Follow the evidence",
        items: [
          { source: "pyproject.toml", purpose: "Dependency declarations" },
          { source: "uv.lock", purpose: "Locked versions" },
          { source: "src/", purpose: "Source references" }
        ]
      }
    }
  ],

  otherWork: [
    {
      id: "blacklight",
      title: "Blacklight privacy detection",
      description: "Contributed to TikTok and X tracking-pixel detection and validation with The Markup and Brandeis University from August to December 2025. Blacklight has processed more than 18 million cumulative scans.",
      links: [{
        label: "Read the Blacklight update",
        href: "https://themarkup.org/blacklight/2026/02/09/blacklight-update-tiktok-x-twitter"
      }]
    },
    {
      id: "notebook-git-marks",
      title: "Jupyter Notebook Git Marks",
      description: "A VS Code extension that marks added, modified, and deleted source lines in Jupyter Notebook cells. Updates as you type, including changes you have not saved.",
      links: [
        {
          label: "VS Code Marketplace",
          href: "https://marketplace.visualstudio.com/items?itemName=StevenYang0316-5274.notebook-git-gutter"
        },
        {
          label: "GitHub",
          href: "https://github.com/steventimes/git-for-jupyterNotebook"
        }
      ]
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
