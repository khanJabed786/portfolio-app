export const portfolio = {
  profile: {
    name: "Jabed Khan",
    role: "Full Stack Developer",
    location: "United States",
    intro:
      "I build modern, fast and animated web apps with clean UI, smooth UX and scalable architecture.",
    ctas: {
      primary: { label: "Hire Me", href: "#contact" },
      secondary: { label: "View Projects", href: "#projects" },
      resume: { label: "Download Resume", href: "#" } // Step E/F: resume link from Firebase/Admin
    },
    social: [
      { label: "GitHub", href: "https://github.com/khanJabed786" },
      { label: "LinkedIn", href: "#" },
      { label: "Email", href: "mailto:javedkhan1foru@gmail.com" }
    ]
  },

  about: {
    title: "About Me",
    paragraphs: [
      "I’m a Full Stack Developer focused on building high-performance web apps with a strong UI/UX.",
      "I love clean architecture, reusable components, smooth animations, and real-world features like auth, dashboards, analytics, and admin panels.",
      "My goal is to build products that feel premium, work fast, and scale easily."
    ],
    highlights: [
      { title: "Product mindset", desc: "UI + performance + real features", icon: "⚡" },
      { title: "Modern stack", desc: "React, Tailwind, Firebase, APIs", icon: "🧩" },
      { title: "Animations", desc: "AOS, Framer Motion, micro-interactions", icon: "🎬" }
    ]
  },

  skills: {
    title: "Skills",
    groups: [
      {
        name: "Frontend",
        items: ["React", "Vite", "Tailwind CSS", "Framer Motion", "AOS", "Responsive UI"]
      },
      { name: "Backend", items: ["Firebase", "Node.js", "REST APIs", "Auth", "Firestore Rules"] },
      { name: "Tools", items: ["Git", "GitHub", "VS Code", "Vercel", "Postman"] }
    ]
  },

  projects: {
    title: "Projects",
    filters: ["All"],
    items: []
  },

  experience: {
    title: "Experience / Timeline",
    items: [
      {
        year: "2026",
        title: "Building Portfolio Product",
        desc: "Working on a SaaS-level portfolio with admin, analytics, and scalable UI system."
      },
      {
        year: "2025",
        title: "Full Stack Projects",
        desc: "Built multiple React/Firebase apps with modern design and performance focus."
      },
      {
        year: "2024",
        title: "Frontend Foundations",
        desc: "Deepened core web skills: HTML, CSS, JS, React patterns and best practices."
      }
    ]
  },

  achievements: {
    title: "Achievements",
    stats: [
      { label: "Projects Built", value: 12 },
      { label: "Tech Stack Skills", value: 18 },
      { label: "Happy Clients", value: 5 }
    ],
    badges: ["Fast Learner", "UI/UX Focused", "Problem Solver", "Team Player"]
  },
  typewriter: {
    words: [
      { text: "Fast UI", color: "#FF6B6B" },
      { text: "Modern Animations", color: "#4ECDC4" },
      { text: "Clean Code", color: "#45B7D1" },
      { text: "Firebase Backend", color: "#FFA07A" }
    ]
  },
  contact: {
    title: "Contact",
    subtitle: "Let’s build something awesome. Send a message and I’ll reply as soon as possible.",
    email: "javedkhan1foru@gmail.com"
  },
  resume: { label: "Resume", href: "/resume" },

  footer: {
    text: "Built with React + Tailwind + Firebase • Animated UI • 2026"
  }
};