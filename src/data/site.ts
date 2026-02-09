export const site = {
  name: "Steven (Hongchen) Yang",
  tagline: "System Architecture & Software Engineering • Database Systems",
  location: "Waltham, MA",
  email: "stevenyang@brandeis.edu",
  linkedin: "https://www.linkedin.com/in/hongchen-yang-3803b4294/",
  githubUsername: "steventimes",
  resumePath: "/resume.pdf",
  photoPath: "/headphoto.jpg",

  about: [
    "I'm a B.S. Computer Science student at Brandeis University (expected May 2027) focused on system architecture, software engineering, and database systems.",
    "At the Smart & Scalable Data Systems Lab, I build workload-aware tuning policies in RocksDB to improve latency and throughput across changing I/O patterns.",
    "I've optimized SQL query planning pipelines and backend modules with Spring Boot/MyBatis/Redis, and I build Python ETL pipelines for education data governance."
  ],

  highlights: [
    { label: "Focus", value: "System architecture, software engineering, databases" },
    { label: "Education", value: "Brandeis University • B.S. CS (Expected 2027)" },
    { label: "Interests", value: "System architecture & design, software engineering, databases" }
  ],

  skills: {
    Languages: ["Java", "C++", "Python", "JavaScript", "SQL", "Rust", "Go"],
    "Frameworks/Tools": ["Spring Boot", "MyBatis", "Docker", "PostgreSQL", "Redis", "Git", "Linux"],
    "Spoken Languages": ["Mandarin (Native)", "English (Fluent)"]
  },

  experience: [
    {
      title: "Researcher — Smart & Scalable Data Systems Lab",
      org: "Brandeis University",
      time: "May 2025 - Present",
      bullets: [
        "Engineered workload-aware tuning policies in RocksDB; reduced latency and improved throughput under varying I/O patterns.",
        "Applied grouping and pruning heuristics to shrink parameter search space, increasing autotuning efficiency.",
        "Built an online learning model to adaptively adjust DB configurations based on real-time workload features."
      ]
    },
    {
      title: "Data Science Intern (Independent Study)",
      org: "Brandeis University",
      time: "Jan 2026 - Present",
      bullets: [
        "Developed Python ETL pipelines for education data governance; implemented data lineage tracing across silos.",
        "Designed annotation and provenance tracking modules to ensure transparency and auditability in reporting systems."
      ]
    },
    {
      title: "Backend Engineering Intern",
      org: "Shanghai Development Center of Computer Software Technology",
      time: "May 2024 - Aug 2024",
      bullets: [
        "Optimized SQL query planning pipeline for Supersonic AI by analyzing translation, parsing, and execution layers.",
        "Enhanced backend modules in the RuoYi framework using Spring Boot, MyBatis, and Redis; improved reliability and modularity.",
        "Refactored legacy Java components using streams and lambdas to reduce code complexity and improve performance."
      ]
    }
  ],

  projects: [
    {
      name: "fpstreams (PyPI)",
      desc: "Published a type-safe functional programming library for Python with lazy pipelines, parallel execution, and an optional Rust acceleration path.",
      tech: ["Python", "PyPI", "Rust", "CI/CD"]
    },
    {
      name: "Soccer Analytics Platform",
      desc: "Built a Dockerized ingestion and storage pipeline (PostgreSQL, Redis) for match data with caching to improve query responsiveness.",
      tech: ["PostgreSQL", "Redis", "Docker", "Python"]
    },
  ]
};
