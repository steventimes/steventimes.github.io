export const site = {
  name: "Hongchen (Steven) Yang",
  tagline: "Backend & Data Systems • Storage Engines • Research-minded Engineer",
  location: "United States",
  email: "stevenyang@brandeis.edu",
  linkedin: "https://www.linkedin.com/in/hongchen-yang-3803b4294/",
  githubUsername: "steventimes",
  resumePath: "/resume.pdf",
  photoPath: "/headphoto.jpg",

  about: [
    "I’m a CS student at Brandeis University focused on data systems and storage engines.",
    "I work on LSM-tree / RocksDB optimization research: compaction policies, microbenchmarks, and performance tradeoffs (latency, throughput, write amplification).",
    "I’ve also built backend systems in Java (Spring Boot, MyBatis) with Redis and PostgreSQL, and I enjoy turning complex systems ideas into clear architecture."
  ],

  highlights: [
    { label: "Focus", value: "Data systems & storage engines" },
    { label: "Stack", value: "Java • Python • C • Linux • Docker" },
    { label: "Interests", value: "LSM-trees, RocksDB, KV stores, performance" }
  ],

  skills: {
    Languages: ["Java", "Python", "C", "JavaScript"],
    Backend: ["Spring Boot", "MyBatis", "Maven", "REST APIs"],
    Data: ["RocksDB", "Redis", "PostgreSQL", "MySQL", "NoSQL"],
    Systems: ["Linux", "Docker", "Git", "Microbenchmarking", "Compaction", "Write Amplification"]
  },

  experience: [
    {
      title: "Research Assistant — SSD Lab",
      org: "Brandeis University",
      time: "May 2025 - Present",
      bullets: [
        "LSM-tree / RocksDB optimization: exploring compaction design tradeoffs under changing workloads.",
        "Built experiment harnesses + microbenchmarks to measure throughput, tail latency, and write amplification.",
        "Prototyped data-structure and compaction-policy ideas to improve end-to-end performance."
      ]
    },
    {
      title: "Backend Engineering Intern",
      org: "Shanghai Development Center of Computer Software Technology",
      time: "May 2024 - Aug 2024",
      bullets: [
        "Developed backend features in Java using Spring Boot + MyBatis; integrated Redis caching.",
        "Debugged production issues on Linux; improved reliability via structured logging and diagnostics.",
        "Worked within an existing framework (RuoYi) and delivered changes with clear documentation."
      ]
    }
  ],

  projects: [
    {
      name: "Prompt-Testing Framework",
      desc: "A backend framework for prompt evaluation pipelines with planned dashboard UI.",
      tech: ["Java", "Spring Boot", "MyBatis", "Redis", "PostgreSQL", "Docker"],
      link: "https://github.com/steventimes/Prompt-Testing-Framework" // optional
    },
  ]
};
