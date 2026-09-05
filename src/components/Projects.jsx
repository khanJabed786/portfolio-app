import React, { useMemo, useState, useEffect, useRef } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../config/firebase.js";
import Modal from "./common/Modal.jsx";
import Lightbox from "./common/Lightbox.jsx";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [query_str, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const [activeVideo, setActiveVideo] = useState(null);

  const [lb, setLb] = useState({ open: false, images: [], index: 0, title: "" });
  
  // Carousel state for each project card
  const [projectCarousels, setProjectCarousels] = useState({});
  const [lastManualInteraction, setLastManualInteraction] = useState({});

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const projectsCarouselRef = useRef(null);

  // Fetch projects from Firebase
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const ref = collection(db, "publicProjects");
        const q = query(ref, orderBy("createdAt", "desc"));
        const snaps = await getDocs(q);
        const projectsList = snaps.docs.map((d) => ({ id: d.id, ...d.data() }));
        setProjects(projectsList);
      } catch (e) {
        console.error("Failed to load projects:", e);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Get filter options from projects
  const filters = useMemo(() => {
    const allTags = new Set(["All"]);
    projects.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((tag) => allTags.add(tag));
      }
    });
    return Array.from(allTags);
  }, [projects]);

  // Compute filtered items first (before using in effects)
  const items = useMemo(() => {
    const q = query_str.trim().toLowerCase();

    return projects.filter((p) => {
      const matchesQuery =
        !q ||
        (p.title?.toLowerCase().includes(q)) ||
        (p.description?.toLowerCase().includes(q)) ||
        (Array.isArray(p.tech) && p.tech.join(" ").toLowerCase().includes(q));

      const matchesFilter = filter === "All" ? true : Array.isArray(p.tags) && p.tags?.includes(filter);

      return matchesQuery && matchesFilter;
    });
  }, [projects, query_str, filter]);

  // Auto-play lightbox when open
  useEffect(() => {
    if (!lb.open || !lb.images || lb.images.length <= 1) return;
    
    console.log("▶️ Lightbox auto-play started:", lb.images.length, "images");
    
    const interval = setInterval(() => {
      setLb((prev) => ({
        ...prev,
        index: (prev.index + 1) % prev.images.length
      }));
    }, 4000);
    
    return () => {
      clearInterval(interval);
      console.log("⏹️ Lightbox auto-play stopped");
    };
  }, [lb.open, lb.images]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll the project rail and pause briefly after manual interaction.
  useEffect(() => {
    if (!projectsCarouselRef.current || items.length < 2) return;

    const container = projectsCarouselRef.current;
    let pausedUntil = 0;
    let autoScrolling = false;

    const getCardStep = () => {
      const card = container.firstElementChild;
      return card ? card.getBoundingClientRect().width + 16 : container.clientWidth;
    };

    const advance = () => {
      if (Date.now() < pausedUntil) return;
      const step = getCardStep();
      const currentIndex = Math.round(container.scrollLeft / step);
      const nextIndex = (currentIndex + 1) % items.length;
      autoScrolling = true;
      container.scrollTo({ left: nextIndex * step, behavior: "smooth" });
      window.setTimeout(() => {
        autoScrolling = false;
      }, 700);
    };

    const handleManualScroll = () => {
      if (!autoScrolling) pausedUntil = Date.now() + 6000;
    };

    const interval = window.setInterval(advance, 4500);
    container.addEventListener("scroll", handleManualScroll);

    return () => {
      window.clearInterval(interval);
      container.removeEventListener("scroll", handleManualScroll);
    };
  }, [items]);

  // Auto-play carousels for project cards
  useEffect(() => {
    const intervals = [];

    items.forEach((p) => {
      if (p.images?.length > 1) {
        const interval = setInterval(() => {
          const lastInteraction = lastManualInteraction[p.id] || 0;
          const timeSinceInteraction = Date.now() - lastInteraction;
          
          // Skip auto-advance if user just manually navigated (within 1 second)
          if (timeSinceInteraction < 1000) {
            return;
          }

          setProjectCarousels((prev) => {
            const currentIndex = prev[p.id] || 0;
            const newIndex = (currentIndex + 1) % p.images.length;
            console.log(`🎬 Project "${p.title}" carousel: ${currentIndex} → ${newIndex}`);
            return { ...prev, [p.id]: newIndex };
          });
        }, 4000);
        intervals.push(interval);
      }
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
      console.log("⏹️ All project carousels stopped");
    };
  }, [items, lastManualInteraction]);

  const openGallery = (p, startIndex = 0) => {
    if (!p.images?.length) return;
    setLb({ open: true, images: p.images, index: startIndex, title: p.title });
  };

  const closeGallery = () => setLb((s) => ({ ...s, open: false }));

  const prev = () =>
    setLb((s) => ({ ...s, index: (s.index - 1 + s.images.length) % s.images.length }));
  const next = () => setLb((s) => ({ ...s, index: (s.index + 1) % s.images.length }));

  const getCarouselIndex = (projectId) => projectCarousels[projectId] || 0;

  const prevCarousel = (projectId) => {
    setLastManualInteraction((prev) => ({ ...prev, [projectId]: Date.now() }));
    setProjectCarousels((prev) => {
      const currentIndex = prev[projectId] || 0;
      const projectImages = items.find((p) => p.id === projectId)?.images || [];
      const newIndex = (currentIndex - 1 + projectImages.length) % projectImages.length;
      return { ...prev, [projectId]: newIndex };
    });
  };

  const nextCarousel = (projectId) => {
    setLastManualInteraction((prev) => ({ ...prev, [projectId]: Date.now() }));
    setProjectCarousels((prev) => {
      const currentIndex = prev[projectId] || 0;
      const projectImages = items.find((p) => p.id === projectId)?.images || [];
      const newIndex = (currentIndex + 1) % projectImages.length;
      return { ...prev, [projectId]: newIndex };
    });
  };

  const scrollProjects = (direction) => {
    projectsCarouselRef.current?.scrollBy({
      left: direction * projectsCarouselRef.current.clientWidth * 0.82,
      behavior: "smooth"
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="space-y-8 sm:space-y-10" data-aos="fade-up">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="mt-3 text-white/70 text-base sm:text-lg">Featured work and recent projects</p>
          <div className="mt-4 h-1 w-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />
          </div>
          {projects.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="mr-2 text-xs uppercase tracking-[0.2em] text-white/45">More work</span>
              <button
                type="button"
                onClick={() => scrollProjects(-1)}
                className="h-10 w-10 rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-purple-400 hover:bg-purple-500/20"
                aria-label="Previous projects"
              >
                &#8592;
              </button>
              <button
                type="button"
                onClick={() => scrollProjects(1)}
                className="h-10 w-10 rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:border-purple-400 hover:bg-purple-500/20"
                aria-label="Next projects"
              >
                &#8594;
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-white/50">Loading projects...</div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-white/50">No projects yet. Check back soon!</div>
          </div>
        ) : (
          <>
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <input
                  value={query_str}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="🔍 Search projects by name or tech..."
                  className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl glass border border-white/10 focus:border-purple-400 outline-none transition bg-white/5 hover:bg-white/10 text-white placeholder-white/50 text-sm sm:text-base"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 sm:px-5 py-3 sm:py-4 rounded-xl glass border border-white/10 focus:border-purple-400 outline-none transition bg-white/5 hover:bg-white/10 text-white text-sm sm:text-base"
              >
                {filters.map((f) => (
                  <option key={f} value={f} className="bg-[#0b1020]">
                    {f}
                  </option>
                ))}
              </select>
            </div>

            {/* Projects Grid (Desktop) / Carousel (Mobile) */}
            {isMobile ? (
              // MOBILE CAROUSEL - Auto-scrolling horizontal (one card at a time)
              <div className="relative w-full">
                <div
                  ref={projectsCarouselRef}
                  className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-3"
                  style={{
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch',
                    scrollSnapType: 'x mandatory'
                  }}
                >
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="flex-shrink-0 w-[min(88vw,560px)] min-h-[360px] grid grid-cols-[1.2fr_0.9fr] grid-rows-[auto_1fr] group card-lift card-3d function-hover rounded-xl border border-white/10 hover:border-purple-400/50 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20"
                      style={{ scrollSnapAlign: 'start' }}
                    >
                      <div className="col-span-2 flex items-start justify-between gap-3 px-5 pt-5 pb-3">
                        <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition line-clamp-2">
                          {p.title}
                        </h3>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30 whitespace-nowrap">
                          {p.tags?.[0] ?? "Project"}
                        </span>
                      </div>

                      {/* Image Section */}
                      {p.images?.length ? (
                        <div className="relative min-h-[220px] overflow-hidden">
                          <button
                            onClick={() => openGallery(p, getCarouselIndex(p.id))}
                            className="w-full h-full"
                            title="Click to open full gallery"
                          >
                            <img
                              key={`${p.id}-${getCarouselIndex(p.id)}`}
                              src={p.images[getCarouselIndex(p.id)]}
                              alt={`Project ${p.title}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3C/svg%3E";
                              }}
                            />
                            
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                              {p.images.length > 1 && (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      prevCarousel(p.id);
                                    }}
                                    className="p-2 rounded-lg bg-white/30 hover:bg-white/50 transition text-white text-xl"
                                    title="Previous"
                                  >
                                    ◀
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      nextCarousel(p.id);
                                    }}
                                    className="p-2 rounded-lg bg-white/30 hover:bg-white/50 transition text-white text-xl"
                                    title="Next"
                                  >
                                    ▶
                                  </button>
                                </>
                              )}
                            </div>
                          </button>

                          {/* Carousel Dots */}
                          {p.images.length > 1 && (
                            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                              {p.images.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setLastManualInteraction((prev) => ({ ...prev, [p.id]: Date.now() }));
                                    setProjectCarousels((prev) => ({
                                      ...prev,
                                      [p.id]: idx
                                    }));
                                  }}
                                  className={`transition ${
                                    idx === getCarouselIndex(p.id)
                                      ? "w-4 h-2 bg-purple-400 rounded-full"
                                      : "w-2 h-2 bg-white/40 rounded-full hover:bg-white/60"
                                  }`}
                                  title={`Image ${idx + 1}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      ) : null}

                      {/* Content Section */}
                      <div className="min-w-0 flex flex-col gap-3 px-4 pt-4 pb-4">
                        <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{p.description}</p>

                        {/* Tech Stack */}
                        <div className="flex flex-wrap gap-1">
                          {p.tech.slice(0, 3).map((t) => (
                            <span key={t} className="px-2 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 transition">
                              {t}
                            </span>
                          ))}
                          {p.tech.length > 3 && (
                            <span className="px-2 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-medium">
                              +{p.tech.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-2 pt-3 border-t border-white/10 mt-auto">
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm text-center bg-purple-500/70 hover:bg-purple-500 transition"
                          >
                            🚀 Live
                          </a>
                          <a
                            href={`/projects/${p.id}`}
                            className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm text-center border border-white/20 hover:border-purple-400 hover:bg-white/10 transition"
                          >
                            📖 Case Study
                          </a>
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm text-center border border-white/20 hover:border-purple-400 hover:bg-white/10 transition"
                            title="GitHub"
                          >
                            🐙 Code
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // DESKTOP PROJECT RAIL
              <div
                ref={projectsCarouselRef}
                className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide pb-3"
                style={{ scrollBehavior: "smooth", scrollSnapType: "x mandatory" }}
              >
                {items.map((p, idx) => (
                  <div
                    key={p.id}
                    className="flex-shrink-0 w-[min(78vw,560px)] min-h-[360px] grid grid-cols-[1.2fr_0.9fr] grid-rows-[auto_1fr] group card-lift card-3d function-hover rounded-xl border border-white/10 hover:border-purple-400/50 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-purple-500/20"
                    style={{ scrollSnapAlign: "start" }}
                    data-aos="zoom-in"
                    data-aos-delay={`${idx * 50}`}
                  >
                    <div className="col-span-2 flex items-start justify-between gap-3 px-5 pt-5 pb-3">
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition line-clamp-2">
                        {p.title}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-400/30 whitespace-nowrap">
                        {p.tags?.[0] ?? "Project"}
                      </span>
                    </div>

                    {/* Image Section */}
                    {p.images?.length ? (
                      <div className="relative min-h-[220px] overflow-hidden">
                        <button
                          onClick={() => openGallery(p, getCarouselIndex(p.id))}
                          className="w-full h-full"
                          title="Click to open full gallery"
                        >
                          <img
                            key={`${p.id}-${getCarouselIndex(p.id)}`}
                            src={p.images[getCarouselIndex(p.id)]}
                            alt={`Project ${p.title}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23333' width='100' height='100'/%3E%3C/svg%3E";
                            }}
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                            {p.images.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    prevCarousel(p.id);
                                  }}
                                  className="p-2 rounded-lg bg-white/30 hover:bg-white/50 transition text-white text-xl"
                                  title="Previous"
                                >
                                  ◀
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    nextCarousel(p.id);
                                  }}
                                  className="p-2 rounded-lg bg-white/30 hover:bg-white/50 transition text-white text-xl"
                                  title="Next"
                                >
                                  ▶
                                </button>
                              </>
                            )}
                          </div>
                        </button>

                        {/* Carousel Dots */}
                        {p.images.length > 1 && (
                          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                            {p.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLastManualInteraction((prev) => ({ ...prev, [p.id]: Date.now() }));
                                  setProjectCarousels((prev) => ({
                                    ...prev,
                                    [p.id]: idx
                                  }));
                                }}
                                className={`transition ${
                                  idx === getCarouselIndex(p.id)
                                    ? "w-4 h-2 bg-purple-400 rounded-full"
                                    : "w-2 h-2 bg-white/40 rounded-full hover:bg-white/60"
                                }`}
                                title={`Image ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Content Section */}
                    <div className="min-w-0 flex flex-col gap-3 px-4 pt-4 pb-4">
                      <p className="text-white/70 text-sm leading-relaxed line-clamp-2">{p.description}</p>

                      {/* Tech Stack */}
                      <div className="flex flex-wrap gap-1">
                        {p.tech.slice(0, 3).map((t) => (
                          <span key={t} className="px-2 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-medium hover:bg-white/20 transition">
                            {t}
                          </span>
                        ))}
                        {p.tech.length > 3 && (
                          <span className="px-2 py-1 rounded-lg bg-white/10 text-white/80 text-xs font-medium">
                            +{p.tech.length - 3}
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 pt-3 border-t border-white/10 mt-auto">
                        <a
                          href={p.live}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm text-center bg-purple-500/70 hover:bg-purple-500 transition"
                        >
                          🚀 Live
                        </a>
                        <a
                          href={`/projects/${p.id}`}
                          className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm text-center border border-white/20 hover:border-purple-400 hover:bg-white/10 transition"
                        >
                          📖 Case Study
                        </a>
                        <a
                          href={p.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 px-3 py-2 rounded-lg font-semibold text-sm text-center border border-white/20 hover:border-purple-400 hover:bg-white/10 transition"
                          title="GitHub"
                        >
                          🐙 Code
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60 text-lg">No projects found matching your search.</p>
                <button
                  onClick={() => {
                    setQuery("");
                    setFilter("All");
                  }}
                  className="mt-4 px-6 py-2 rounded-lg border border-white/20 hover:border-purple-400 hover:bg-white/10 transition"
                >
                  Clear filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Modal open={!!activeVideo} title={activeVideo?.title} onClose={() => setActiveVideo(null)}>
        {activeVideo ? (
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-white/10">
            <iframe
              className="w-full h-full"
              src={activeVideo.url}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
      </Modal>

      <Lightbox
        open={lb.open}
        images={lb.images}
        index={lb.index}
        onClose={closeGallery}
        onPrev={prev}
        onNext={next}
      />
    </div>
  );
}