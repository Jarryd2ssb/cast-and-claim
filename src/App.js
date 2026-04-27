import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   SPECIES DATA
───────────────────────────────────────────── */
const FISH_CATEGORIES = [
  {
    category: "Coastal & Reef Fish",
    fish: [
      { id: "galjoen",         name: "Galjoen",                      record: 55,  legal: 35,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Dichistius_capensis_1.jpg/640px-Dichistius_capensis_1.jpg",         desc: "South Africa's national fish. Deep-bodied with dark silver scales, found along rocky surf-beaten shorelines. A prized shore-angling target." },
      { id: "kob",             name: "Kob (Kabeljou)",               record: 120, legal: 60,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Argyrosomus_japonicus.jpg/640px-Argyrosomus_japonicus.jpg",          desc: "The iconic Eastern Cape gamefish. Silvery with a slightly bronze sheen, large mouth, and a drum-like swim bladder. Hard-fighting and excellent eating." },
      { id: "leervis",         name: "Leervis (Garrick)",            record: 130, legal: 70,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Lichia_amia_1.jpg/640px-Lichia_amia_1.jpg",                         desc: "A sleek silver pelagic predator with a deeply forked tail and long body. One of the EC's most explosive sport fish — makes blistering runs." },
      { id: "shad",            name: "Shad (Elf)",                   record: 65,  legal: 30,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Bluefish_Pomatomus_saltatrix.jpg/640px-Bluefish_Pomatomus_saltatrix.jpg", desc: "A voracious schooling predator with a blue-green back and silver belly, sharp teeth, and forked tail. Attacks lures and bait with aggression." },
      { id: "musselcracker",   name: "Musselcracker (Poenskop)",     record: 90,  legal: 50,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Sparodon_durbanensis.jpg/640px-Sparodon_durbanensis.jpg",             desc: "Powerfully built with a blunt head and crushing molar-like teeth for cracking molluscs. Dark grey-brown body, legendary rock-and-surf species." },
      { id: "blacktail",       name: "Blacktail (Dassie)",           record: 45,  legal: 20,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Diplodus_sargus_sargus.jpg/640px-Diplodus_sargus_sargus.jpg",         desc: "A popular light-tackle species with a silver body, distinct black tail fin, and faint lateral stripes. Abundant in estuaries and rocky reefs." },
      { id: "steenbras",       name: "Red Steenbras",                record: 110, legal: "PROTECTED", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Petrus_rupestris.jpg/640px-Petrus_rupestris.jpg",                     desc: "A large, reddish-bronze sparid with a steep forehead and robust body. Now protected — a slow-growing species and indicator of reef health." },
      { id: "catface",         name: "Catface Rockcod",              record: 80,  legal: 50,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Epinephelus_andersoni.jpg/640px-Epinephelus_andersoni.jpg",            desc: "A chunky grouper with brown and white mottled markings, a wide mouth, and fan-like pectoral fins. Common on rocky reefs around Port Elizabeth." },
      { id: "spotted_grunter", name: "Spotted Grunter",              record: 75,  legal: 40,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Pomadasys_commersonnii.jpg/640px-Pomadasys_commersonnii.jpg",          desc: "A silver estuary fish covered in dark spots with a downward-pointing mouth adapted for rooting in sand. Tails in shallow flats like a bonefish." },
      { id: "white_stumpnose", name: "White Stumpnose",              record: 50,  legal: 25,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Rhabdosargus_globiceps.jpg/640px-Rhabdosargus_globiceps.jpg",          desc: "A blunt-nosed silver reef fish with faint yellow tinges and dark-edged scales. Prized for table quality and plentiful around EC reefs." },
      { id: "roman",           name: "Roman (Red Roman)",            record: 60,  legal: 30,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Chrysoblephus_laticeps.jpg/640px-Chrysoblephus_laticeps.jpg",          desc: "Brilliantly coloured — deep red and pink body with blue-green markings around the face. One of the most colourful reef fish in the EC." },
      { id: "bronze_bream",    name: "Bronze Bream",                 record: 55,  legal: 30,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Pachymetopon_grande.jpg/640px-Pachymetopon_grande.jpg",                desc: "A deep-bodied bronze-silver fish with a small mouth and large scales. Very common in the surf zone over sandy beaches of the EC." },
      { id: "kingfish",        name: "Giant Kingfish (GT)",          record: 150, legal: null,       img: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Caranx_ignobilis.jpg/640px-Caranx_ignobilis.jpg",                     desc: "A powerful silver trevally with a steep forehead, deeply forked tail, and golden-yellow fin tips. The ocean's apex ambush predator." },
      { id: "cape_salmon",     name: "Cape Salmon (Geelbek)",        record: 115, legal: 60,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Atractoscion_aequidens.jpg/640px-Atractoscion_aequidens.jpg",          desc: "A long-jawed silver fish with a distinctive yellow mouth interior, large eyes, and streamlined body. Explosive feeder during the sardine run." },
      { id: "baardman",        name: "Baardman (Bellman)",           record: 85,  legal: 40,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Umbrina_robinsoni.jpg/640px-Umbrina_robinsoni.jpg",                   desc: "A robust silver-grey surf fish with prominent chin barbels (beard), large scales, and a subterminal mouth. Powerful fighter on bait." },
      { id: "wildeperd",       name: "Wildeperd (Zebra)",            record: 45,  legal: 30,         img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Diplodus_cervinus.jpg/640px-Diplodus_cervinus.jpg",                   desc: "Distinctively marked with vertical dark stripes on a silver body — exactly like its namesake. A colourful and plentiful reef species." },
    ],
  },
  {
    category: "Sharks",
    fish: [
      { id: "bronze_whaler",      name: "Bronze Whaler Shark",                 record: 295, legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Carcharhinus_brachyurus.jpg/640px-Carcharhinus_brachyurus.jpg",           desc: "The #1 shore-angling shark in the EC. Bronze-copper colouring on the back, white belly, slender body with a pointed snout. Patrol the surf at Jeffreys Bay in large numbers." },
      { id: "ragged_tooth",       name: "Ragged-Tooth Shark (Raggie)",         record: 320, legal: "PROTECTED",  img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Carcharias_taurus_georgia_aquarium.jpg/640px-Carcharias_taurus_georgia_aquarium.jpg", desc: "Grey-brown with dark spots, a portly body, and a terrifying grin of protruding needle-like teeth. Resident in Algoa Bay's reefs year-round. Docile to divers despite appearances." },
      { id: "bull_shark",         name: "Bull Shark",                          record: 340, legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Bull_shark.jpg/640px-Bull_shark.jpg",                                       desc: "Stocky and grey with a blunt snout, small eyes, and no markings. One of the most aggressive shark species — dominates deeper EC channels." },
      { id: "great_white",        name: "Great White Shark",                   record: 600, legal: "PROTECTED",  img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/640px-White_shark.jpg",                                       desc: "The apex predator. Counter-shaded with a dark grey dorsal surface and white belly, torpedo-shaped body and massive serrated triangular teeth. Resident in Algoa Bay." },
      { id: "smooth_hammerhead",  name: "Smooth Hammerhead Shark",             record: 400, legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Sphyrna_zygaena.jpg/640px-Sphyrna_zygaena.jpg",                             desc: "Grey-brown with the unmistakable hammer-shaped head (cephalofoil) with a smooth front edge. Most frequently sighted hammerhead in Algoa Bay." },
      { id: "mako_shortfin",      name: "Shortfin Mako Shark",                 record: 400, legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Isurus_oxyrinchus.jpg/640px-Isurus_oxyrinchus.jpg",                          desc: "Iridescent metallic blue on the back, white below. Slender, torpedo-shaped with a pointed conical snout and crescent-shaped tail. The fastest shark alive." },
      { id: "blue_shark",         name: "Blue Shark",                          record: 380, legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Blue_shark_2.jpg/640px-Blue_shark_2.jpg",                                     desc: "Slender and elegant with a deep indigo-blue back, bright blue sides, and white belly. Very long pectoral fins. Pelagic wanderer encountered offshore in EC deep water." },
      { id: "tope_shark",         name: "Tope Shark (Vaalhaai)",               record: 195, legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Galeorhinus_galeus.jpg/640px-Galeorhinus_galeus.jpg",                         desc: "A slender, grey-brown houndshark with a pointed snout and large eyes. Known locally as Vaalhaai. Caught inshore and on shallow EC reefs." },
      { id: "spotted_gully",      name: "Spotted Gully Shark (Sweet William)", record: 170, legal: "PROTECTED",  img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Triakis_megalopterus.jpg/640px-Triakis_megalopterus.jpg",                     desc: "Bronze-grey body covered in distinctive black spots, a blunt rounded snout and large rounded fins. Common in EC gullies and rocky reef shallows." },
      { id: "sevengill",          name: "Broadnose Sevengill Shark",           record: 290, legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Notorynchus_cepedianus.jpg/640px-Notorynchus_cepedianus.jpg",                 desc: "A primitive, broad-headed shark with seven gill slits (most sharks have five), a single dorsal fin set far back, and a silver-grey body with dark spots." },
      { id: "puffadder_shyshark", name: "Puffadder Shyshark",                 record: 60,  legal: "PROTECTED",  img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Haploblepharus_edwardsii.jpg/640px-Haploblepharus_edwardsii.jpg",             desc: "A small, slender catshark endemic to South Africa. Strikingly patterned with dark saddle-like bands and reddish-orange blotches on a cream body." },
      { id: "pyjama_shark",       name: "Pyjama Shark",                        record: 107, legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Poroderma_africanum.jpg/640px-Poroderma_africanum.jpg",                       desc: "Named for its bold longitudinal brown stripes on a cream body. A nocturnal catshark that hides in reef crevices by day along the southern EC coast." },
      { id: "leopard_catshark",   name: "Leopard Catshark",                    record: 84,  legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Poroderma_pantherinum.jpg/640px-Poroderma_pantherinum.jpg",                   desc: "A beautifully marked catshark with intricate dark spots and rosette patterns on a pale background — true to its leopard name. Docile bottom-dweller." },
      { id: "african_angelshark", name: "African Angelshark",                  record: 150, legal: null,        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Squatina_africana.jpg/640px-Squatina_africana.jpg",                           desc: "A flattened, ray-like shark with enormous pectoral fins spread wide, mottled sandy-brown colouring for camouflage, and a flat head. Lies buried in sand." },
    ],
  },
];

const FISH_LIST = FISH_CATEGORIES.flatMap(c => c.fish);

function getFishById(id)   { return FISH_LIST.find(f => f.id === id); }
function getCatForFish(id) { return FISH_CATEGORIES.find(c => c.fish.some(f => f.id === id))?.category || ""; }
function isSharkId(id)     { return getCatForFish(id) === "Sharks"; }
function getScore(entry) {
  const fish = getFishById(entry.fishId);
  return fish ? Math.round((entry.measurement / fish.record) * 100) : 0;
}
function getRankStyle(rank) {
  if (rank === 1) return { label: "🥇", color: "#FFD700" };
  if (rank === 2) return { label: "🥈", color: "#C0C0C0" };
  if (rank === 3) return { label: "🥉", color: "#CD7F32" };
  return { label: `#${rank}`, color: "#7EB8C9" };
}

const STORAGE_KEY = "cast_and_claim_ec_v3";
function loadEntries() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function saveEntries(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
}

/* ── Species Modal ── */
function SpeciesModal({ fish, onClose }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError]   = useState(false);
  const shark = isSharkId(fish.id);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(2,10,18,0.9)",
        backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, animation: "fadeIn 0.2s ease",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(160deg,#081e30,#0a2d45)",
          border: `1px solid ${shark ? "rgba(200,80,80,0.4)" : "rgba(40,110,150,0.5)"}`,
          borderRadius: 12, maxWidth: 500, width: "100%",
          overflow: "hidden",
          boxShadow: shark ? "0 30px 80px rgba(180,40,40,0.3)" : "0 30px 80px rgba(0,80,130,0.4)",
          animation: "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Image area */}
        <div style={{
          position: "relative", height: 260,
          background: "linear-gradient(180deg,#041824 0%,#0a3040 100%)",
          overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {!imgLoaded && !imgError && (
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 36 }}>{shark ? "🦈" : "🐟"}</span>
              <div style={{ fontSize: 11, color: "#3a7a90", letterSpacing: 3, textTransform: "uppercase", marginTop: 12 }}>Loading…</div>
            </div>
          )}
          {imgError && (
            <div style={{ textAlign: "center" }}>
              <span style={{ fontSize: 48 }}>{shark ? "🦈" : "🐟"}</span>
              <div style={{ fontSize: 11, color: "#2d5a6a", letterSpacing: 2, marginTop: 10 }}>Image unavailable</div>
            </div>
          )}
          <img
            src={fish.img}
            alt={fish.name}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s",
              position: "absolute", inset: 0,
            }}
          />
          {/* Gradient overlay */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(transparent,#081e30)" }} />
          {/* Close button */}
          <button onClick={onClose} style={{
            position: "absolute", top: 12, right: 12, width: 30, height: 30, borderRadius: "50%",
            background: "rgba(5,20,35,0.8)", border: "1px solid rgba(255,255,255,0.1)",
            color: "#7EB8C9", fontSize: 16, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
          {/* Category pill */}
          <div style={{
            position: "absolute", top: 12, left: 12, padding: "3px 10px", borderRadius: 20,
            background: shark ? "rgba(140,40,40,0.85)" : "rgba(10,55,85,0.85)",
            border: shark ? "1px solid rgba(200,80,80,0.5)" : "1px solid rgba(40,110,150,0.5)",
            fontSize: 9, letterSpacing: 2.5, textTransform: "uppercase",
            color: shark ? "#f0a0a0" : "#7EB8C9",
          }}>{shark ? "🦈 Shark" : "🎣 Fish"}</div>
        </div>

        {/* Info */}
        <div style={{ padding: "20px 24px 26px" }}>
          <div style={{ fontSize: 21, fontWeight: 700, color: "#fff", marginBottom: 10, fontFamily: "Georgia,serif" }}>{fish.name}</div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            <div style={{ padding: "5px 12px", borderRadius: 6, background: "rgba(4,18,30,0.6)", border: "1px solid rgba(25,75,105,0.5)" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#2d5a6a", marginBottom: 2 }}>EC Record</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: shark ? "#e07070" : "#7EB8C9" }}>{fish.record} cm</div>
            </div>
            <div style={{ padding: "5px 12px", borderRadius: 6, background: "rgba(4,18,30,0.6)", border: fish.legal === "PROTECTED" ? "1px solid rgba(200,80,80,0.4)" : "1px solid rgba(25,75,105,0.5)" }}>
              <div style={{ fontSize: 9, letterSpacing: 2, textTransform: "uppercase", color: "#2d5a6a", marginBottom: 2 }}>Legal Keep Size</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: fish.legal === "PROTECTED" ? "#e07070" : fish.legal === null ? "#4a8090" : "#7EB8C9" }}>
                {fish.legal === "PROTECTED" ? "⛔ Protected" : fish.legal === null ? "No minimum" : `${fish.legal} cm`}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#7a9fb0", lineHeight: 1.75, fontFamily: "Georgia,serif" }}>{fish.desc}</div>
          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(25,65,95,0.5)", fontSize: 9, color: "#1a3d50", letterSpacing: 1.5 }}>
            Image via Wikimedia Commons · Size limits per DFFE regulations · Tap outside to close
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══ MAIN APP ══ */
export default function App() {
  const [view,         setView]         = useState("leaderboard");
  const [entries,      setEntries]      = useState(loadEntries);
  const [filterCat,    setFilterCat]    = useState("all");
  const [filterFish,   setFilterFish]   = useState("all");
  const [form,         setForm]         = useState({ angler: "", fishId: "", measurement: "" });
  const [photoData,    setPhotoData]    = useState(null);
  const [photoName,    setPhotoName]    = useState("");
  const [submitted,    setSubmitted]    = useState(null);
  const [speciesModal, setSpeciesModal] = useState(null);
  const [ready,        setReady]        = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { setTimeout(() => setReady(true), 60); }, []);
  useEffect(() => { setFilterFish("all"); }, [filterCat]);

  function persist(next) { setEntries(next); saveEntries(next); }

  const handlePhoto = useCallback(e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setPhotoData(ev.target.result); setPhotoName(file.name); };
    reader.readAsDataURL(file);
  }, []);

  function clearPhoto() {
    setPhotoData(null); setPhotoName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const catFishList = filterCat === "all" ? FISH_LIST
    : (FISH_CATEGORIES.find(c => c.category === filterCat)?.fish || []);

  const visibleEntries = [...entries]
    .filter(e => {
      if (filterCat  !== "all" && getCatForFish(e.fishId) !== filterCat) return false;
      if (filterFish !== "all" && e.fishId !== filterFish)                return false;
      return true;
    })
    .sort((a, b) => getScore(b) - getScore(a));

  function handleSubmit() {
    if (!form.angler || !form.fishId || !form.measurement) return;
    const entry = {
      id: Date.now(), angler: form.angler.trim(), fishId: form.fishId,
      measurement: parseFloat(form.measurement),
      date: new Date().toISOString().slice(0, 10),
      photo: photoData || null,
    };
    const next = [...entries, entry];
    persist(next);
    const rank = [...next].sort((a, b) => getScore(b) - getScore(a)).findIndex(e => e.id === entry.id) + 1;
    setSubmitted({ entry, rank });
    setForm({ angler: "", fishId: "", measurement: "" });
    clearPhoto();
    setView("result");
  }

  const selFish     = getFishById(form.fishId);
  const scorePreview = selFish && form.measurement
    ? Math.min(999, Math.round((parseFloat(form.measurement) / selFish.record) * 100)) : null;
  const formIsShark = isSharkId(form.fishId);
  const canSubmit   = !!(form.angler && form.fishId && form.measurement);

  // ── Shared tokens ──
  const BLUE  = "#7EB8C9";
  const SHARK = "#e07070";
  const DIM   = "#2d5a6a";

  const card = { background: "rgba(8,35,55,0.65)", border: "1px solid rgba(25,75,105,0.55)", borderRadius: 8, padding: 22, backdropFilter: "blur(12px)", marginBottom: 12 };
  const lbl  = { display: "block", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", color: DIM, marginBottom: 7 };
  const inp  = { width: "100%", padding: "12px 15px", boxSizing: "border-box", background: "rgba(4,18,30,0.78)", border: "1px solid #153a52", borderRadius: 4, color: "#cce5f4", fontSize: 14, fontFamily: "Georgia,serif", outline: "none" };
  const chip = active => ({ padding: "5px 13px", borderRadius: 20, cursor: "pointer", fontSize: 11, letterSpacing: 0.8, fontFamily: "Georgia,serif", transition: "all .18s", border: active ? `1px solid ${BLUE}` : "1px solid #163650", background: active ? "rgba(126,184,201,.18)" : "transparent", color: active ? "#d4eaf5" : "#3d6878" });
  const sharkChip = active => ({ ...chip(false), border: active ? "1px solid #e05a5a" : "1px solid #3a1a1a", background: active ? "rgba(224,90,90,.15)" : "transparent", color: active ? "#f0b0b0" : "#6a3535" });
  const tabBtn = active => ({ padding: "10px 28px", borderRadius: 4, cursor: "pointer", fontSize: 12, letterSpacing: 2.5, textTransform: "uppercase", fontFamily: "Georgia,serif", transition: "all .2s", border: active ? `1px solid ${BLUE}` : "1px solid #183d55", background: active ? "rgba(126,184,201,.14)" : "rgba(255,255,255,.02)", color: active ? "#d4eaf5" : "#406a7c" });
  const divider = { height: 1, background: "linear-gradient(90deg,transparent,#175570,transparent)", margin: "18px 0" };
  const submitBtn = disabled => ({ width: "100%", padding: 14, marginTop: 4, borderRadius: 4, cursor: disabled ? "not-allowed" : "pointer", background: disabled ? "rgba(13,60,90,.4)" : "linear-gradient(135deg,#0d5c7a,#1a7ea0)", border: disabled ? "1px solid #0d3a52" : "1px solid #2a9abf", color: disabled ? "#2a5a72" : "#fff", fontSize: 12, letterSpacing: 3, textTransform: "uppercase", fontFamily: "Georgia,serif", transition: "all .2s" });

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#030f18 0%,#061d2b 45%,#092840 75%,#0c3550 100%)", fontFamily: "Georgia,'Times New Roman',serif", color: "#cce5f4", position: "relative" }}>

      {/* Ambient glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, backgroundImage: "radial-gradient(ellipse at 15% 85%,rgba(10,70,110,.35) 0%,transparent 55%),radial-gradient(ellipse at 85% 15%,rgba(5,45,75,.45) 0%,transparent 55%)" }} />

      {/* Species modal */}
      {speciesModal && <SpeciesModal fish={speciesModal} onClose={() => setSpeciesModal(null)} />}

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 16px 90px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ textAlign: "center", padding: "44px 0 22px", opacity: ready?1:0, transform: ready?"translateY(0)":"translateY(-18px)", transition: "all .7s cubic-bezier(.16,1,.3,1)" }}>
          <div style={{ fontSize: 10, letterSpacing: 7, textTransform: "uppercase", color: "#5fa8c0", marginBottom: 10 }}>Eastern Cape · South Africa</div>
          <div style={{ fontSize: "clamp(34px,6.5vw,58px)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 6, textShadow: "0 0 50px rgba(100,180,210,.35)" }}>Cast &amp; Claim</div>
          <div style={{ fontSize: 12, color: "#4e90a8", letterSpacing: 1.5 }}>Members' Angler Leaderboard</div>
        </div>

        <div style={divider} />

        {/* Tabs */}
        {view !== "result" && (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 26 }}>
            <button style={tabBtn(view==="leaderboard")} onClick={() => setView("leaderboard")}>Leaderboard</button>
            <button style={tabBtn(view==="log")}         onClick={() => setView("log")}>Log a Catch</button>
          </div>
        )}

        {/* ══ LEADERBOARD ══ */}
        {view === "leaderboard" && (
          <div style={{ opacity: ready?1:0, transition: "opacity .5s .15s" }}>

            <div style={card}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: DIM, marginBottom: 14 }}>Filter by Category</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <button style={chip(filterCat==="all")} onClick={() => setFilterCat("all")}>All Species</button>
                {FISH_CATEGORIES.map(c => (
                  <button key={c.category}
                    style={c.category==="Sharks" ? sharkChip(filterCat==="Sharks") : chip(filterCat===c.category)}
                    onClick={() => setFilterCat(c.category)}>
                    {c.category==="Sharks" ? "🦈 Sharks" : c.category}
                  </button>
                ))}
              </div>
            </div>

            {filterCat !== "all" && (
              <div style={{ ...card, paddingTop: 16, paddingBottom: 16 }}>
                <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: DIM, marginBottom: 12 }}>
                  Species · <span style={{ color: "#1d5068", fontSize: 9 }}>tap 📷 to view AI illustration</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button style={chip(filterFish==="all")} onClick={() => setFilterFish("all")}>All</button>
                  {catFishList.map(f => (
                    <div key={f.id} style={{ display: "flex" }}>
                      <button style={{ ...chip(filterFish===f.id), borderRadius: "20px 0 0 20px", borderRight: "none" }}
                        onClick={() => setFilterFish(f.id)}>{f.name}</button>
                      <button
                        style={{ padding: "5px 9px", borderRadius: "0 20px 20px 0", cursor: "pointer", transition: "all .18s", border: filterFish===f.id ? `1px solid ${BLUE}` : "1px solid #163650", borderLeft: `1px solid ${filterFish===f.id?"rgba(126,184,201,.3)":"rgba(22,54,80,.5)"}`, background: filterFish===f.id?"rgba(126,184,201,.18)":"transparent", color: "#4a8a9c", fontSize: 12 }}
                        onClick={() => setSpeciesModal(f)}>📷</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: "#102535", marginBottom: 10 }}>
              {visibleEntries.length} {visibleEntries.length===1?"Entry":"Entries"}
              {filterFish!=="all"?` · ${getFishById(filterFish)?.name}`:filterCat!=="all"?` · ${filterCat}`:""}
            </div>

            {entries.length === 0 ? (
              <div style={{ ...card, textAlign: "center", padding: "50px 20px", color: "#1f4a5c", fontSize: 14 }}>
                No catches logged yet — be the first to cast!
              </div>
            ) : visibleEntries.length === 0 ? (
              <div style={{ ...card, textAlign: "center", padding: "38px 20px", color: "#1f4a5c", fontSize: 14 }}>No catches for this filter yet.</div>
            ) : (
              visibleEntries.map((entry, i) => {
                const fish  = getFishById(entry.fishId);
                const score = getScore(entry);
                const rank  = i + 1;
                const badge = getRankStyle(rank);
                const shark = isSharkId(entry.fishId);
                return (
                  <div key={entry.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: entry.photo?"0":"13px 16px", borderRadius: 8, marginBottom: 8, overflow: "hidden", background: rank<=3?"rgba(18,55,82,.75)":"rgba(8,32,50,.55)", border: rank===1?"1px solid rgba(255,215,0,.28)":rank===2?"1px solid rgba(192,192,192,.18)":rank===3?"1px solid rgba(205,127,50,.18)":"1px solid rgba(25,65,95,.4)" }}>
                    {entry.photo && (
                      <div style={{ width: 76, flexShrink: 0, alignSelf: "stretch", backgroundImage: `url(${entry.photo})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                    )}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, padding: entry.photo?"13px 16px 13px 0":"0", minWidth: 0 }}>
                      <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: rank<=3?20:12, fontWeight: 700, color: badge.color, background: "rgba(4,18,30,.55)", border: `1px solid ${badge.color}30` }}>{badge.label}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#e6f3fb", marginBottom: 2 }}>{entry.angler}</div>
                        <div style={{ fontSize: 11, color: "#3d6878", letterSpacing: 0.3 }}>{shark?"🦈":"🎣"} {fish?.name} · {entry.date}</div>
                        <div style={{ height: 2, borderRadius: 2, marginTop: 6, background: `linear-gradient(90deg,${shark?"#a03030":"#1a7ea0"} ${Math.min(score,100)}%,rgba(25,65,95,.3) ${Math.min(score,100)}%)` }} />
                      </div>
                      <div style={{ marginLeft: "auto", textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: shark?SHARK:BLUE }}>{entry.measurement} cm</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ══ LOG A CATCH ══ */}
        {view === "log" && (
          <div style={{ opacity: ready?1:0, transition: "opacity .5s .15s" }}>

            <div style={card}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: DIM, marginBottom: 16 }}>Your Details</div>
              <div>
                <label style={lbl}>Angler Name *</label>
                <input style={inp} placeholder="Your name" value={form.angler} onChange={e => setForm({...form,angler:e.target.value})} />
              </div>
            </div>

            <div style={card}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: DIM, marginBottom: 16 }}>Your Catch</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                  <label style={{ ...lbl, marginBottom: 0 }}>Species *</label>
                  {selFish && (
                    <button onClick={() => setSpeciesModal(selFish)} style={{ padding: "3px 10px", borderRadius: 20, cursor: "pointer", border: `1px solid ${formIsShark?"#e05a5a":"#1d5570"}`, background: formIsShark?"rgba(224,90,90,.1)":"rgba(29,85,112,.2)", color: formIsShark?SHARK:BLUE, fontSize: 10, letterSpacing: 1.5, fontFamily: "Georgia,serif", textTransform: "uppercase" }}>
                      📷 View Species
                    </button>
                  )}
                </div>
                <select style={{ ...inp, cursor: "pointer", appearance: "none", fontSize: 13 }} value={form.fishId} onChange={e => setForm({...form,fishId:e.target.value})}>
                  <option value="">Select a species…</option>
                  {FISH_CATEGORIES.map(cat => (
                    <optgroup key={cat.category} label={`── ${cat.category} ──`}>
                      {cat.fish.map(f => <option key={f.id} value={f.id}>{f.name}  (Record: {f.record} cm)</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Length in cm *</label>
                <input style={inp} type="number" min="1" max="1500" placeholder={selFish?`Species record: ${selFish.record} cm`:"Length in cm"} value={form.measurement} onChange={e => setForm({...form,measurement:e.target.value})} />
              </div>
              {scorePreview !== null && selFish && (
                <div style={{ background: "rgba(4,15,25,.6)", border: "1px solid #102a3c", borderRadius: 6, padding: "12px 16px" }}>
                  <div style={{ fontSize: 10, color: DIM, letterSpacing: 2, marginBottom: 4 }}>SCORE PREVIEW</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: formIsShark?SHARK:BLUE }}>
                    {scorePreview}% <span style={{ fontSize: 11, color: DIM, marginLeft: 8 }}>of species record ({selFish.record} cm)</span>
                  </div>
                  {formIsShark && <div style={{ fontSize: 10, color: "#6a3535", marginTop: 6 }}>🦈 Please follow local catch-and-release guidelines where applicable.</div>}
                </div>
              )}
            </div>

            {/* Photo upload */}
            <div style={card}>
              <div style={{ fontSize: 10, letterSpacing: 4, textTransform: "uppercase", color: DIM, marginBottom: 16 }}>Catch Photo (optional)</div>
              {!photoData ? (
                <div onClick={() => fileInputRef.current?.click()} style={{ border: "2px dashed #153a52", borderRadius: 8, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: "rgba(4,18,30,.4)" }} onMouseEnter={e=>e.currentTarget.style.borderColor="#2a6a8a"} onMouseLeave={e=>e.currentTarget.style.borderColor="#153a52"}>
                  <div style={{ fontSize: 36, marginBottom: 10 }}>📸</div>
                  <div style={{ fontSize: 13, color: "#4a8090", marginBottom: 4 }}>Tap to upload your catch photo</div>
                  <div style={{ fontSize: 10, color: "#1d4060", letterSpacing: 1 }}>JPG, PNG — appears on the leaderboard next to your entry</div>
                  <input ref={fileInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={handlePhoto} />
                </div>
              ) : (
                <div style={{ position: "relative", borderRadius: 8, overflow: "hidden" }}>
                  <img src={photoData} alt="Your catch" style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, borderRadius: 8, background: "linear-gradient(transparent 50%,rgba(3,15,24,.85))" }} />
                  <div style={{ position: "absolute", bottom: 12, left: 16, right: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 11, color: BLUE }}>✓ {photoName || "Photo ready"}</div>
                    <button onClick={clearPhoto} style={{ padding: "5px 12px", borderRadius: 20, cursor: "pointer", background: "rgba(180,40,40,.7)", border: "1px solid rgba(220,80,80,.4)", color: "#ffaaaa", fontSize: 10, letterSpacing: 1, fontFamily: "Georgia,serif", textTransform: "uppercase" }}>Remove</button>
                  </div>
                </div>
              )}
            </div>

            <button disabled={!canSubmit} onClick={handleSubmit} style={submitBtn(!canSubmit)}>
              Submit Catch to Leaderboard
            </button>
          </div>
        )}

        {/* ══ RESULT ══ */}
        {view === "result" && submitted && (() => {
          const fish  = getFishById(submitted.entry.fishId);
          const score = getScore(submitted.entry);
          const shark = isSharkId(submitted.entry.fishId);
          const badge = getRankStyle(submitted.rank);
          return (
            <div style={{ ...card, textAlign: "center", padding: 0, overflow: "hidden" }}>
              {submitted.entry.photo ? (
                <div style={{ position: "relative", height: 220 }}>
                  <img src={submitted.entry.photo} alt="catch" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 30%,rgba(8,35,55,.95))" }} />
                  <div style={{ position: "absolute", bottom: 16, left: 0, right: 0, fontSize: 26, fontWeight: 700, color: "#fff" }}>Catch Logged!</div>
                </div>
              ) : (
                <div style={{ padding: "40px 0 10px" }}>
                  <div style={{ fontSize: 64 }}>{shark?"🦈":"🎣"}</div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", marginTop: 10 }}>Catch Logged!</div>
                </div>
              )}
              <div style={{ padding: "20px 28px 36px" }}>
                <div style={{ fontSize: 15, color: shark?SHARK:BLUE, marginBottom: 20 }}>
                  Ranked <strong style={{ color: badge.color }}>#{submitted.rank}</strong> on the leaderboard
                </div>
                <div style={divider} />
                <div style={{ display: "flex", justifyContent: "center", gap: 36, marginBottom: 22 }}>
                  {[{v:`${submitted.entry.measurement} cm`,l:"Length"},{v:`#${submitted.rank}`,l:"Rank"}].map(s=>(
                    <div key={s.l}>
                      <div style={{ fontSize: 26, fontWeight: 700, color: BLUE }}>{s.v}</div>
                      <div style={{ fontSize: 9, letterSpacing: 2.5, color: DIM, textTransform: "uppercase", marginTop: 3 }}>{s.l}</div>
                    </div>
                  ))}
                </div>
                <div style={{ color: DIM, fontSize: 12, marginBottom: 24 }}>{fish?.name} · {submitted.entry.date}</div>
                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setSpeciesModal(fish)} style={{ padding: "10px 20px", background: "transparent", border: `1px solid ${shark?"#e05a5a":"#2a6a8a"}`, borderRadius: 4, color: shark?SHARK:BLUE, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Georgia,serif", cursor: "pointer" }}>📷 View Species</button>
                  <button onClick={() => { setView("leaderboard"); setFilterCat("all"); setFilterFish("all"); }} style={{ padding: "10px 20px", background: "transparent", border: `1px solid ${BLUE}`, borderRadius: 4, color: BLUE, fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Georgia,serif", cursor: "pointer" }}>Leaderboard</button>
                  <button onClick={() => setView("log")} style={{ padding: "10px 22px", background: "linear-gradient(135deg,#0d5c7a,#1a7ea0)", border: "1px solid #2a9abf", borderRadius: 4, color: "#fff", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", fontFamily: "Georgia,serif", cursor: "pointer" }}>Log Another</button>
                </div>
              </div>
            </div>
          );
        })()}

        <div style={{ textAlign: "center", marginTop: 44, fontSize: 9, color: "#102535", letterSpacing: 3, textTransform: "uppercase" }}>
          Algoa Bay · Jeffreys Bay · Port Alfred · East London · Mazeppa Bay · Wild Coast
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes pulse   { 0%,100%{opacity:.3;transform:scale(.8)} 50%{opacity:1;transform:scale(1)} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus, select:focus { border-color: #3a8aaa !important; outline: none; }
        select option, select optgroup { background: #030f18; }
        button:active { transform: scale(.98); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #030f18; }
        ::-webkit-scrollbar-thumb { background: #153a52; border-radius: 2px; }
      `}</style>
    </div>
  );
}