import { useState, useEffect, useRef } from "react";

// ====== CONSTANTS ======
const TEMPLE_NAME_LINE1 = "శ్రీ వరసిద్ది వినాయక స్వామి వారి ఆలయం";
const TEMPLE_NAME_LINE2 = "సింగంపల్లి";
const START_DATE = new Date("2026-02-25");
const MAIN_ADMIN_ID = "VS2026NT";
const MAIN_ADMIN_PWD = "Vs@1417";
const STORAGE_KEY = "vt_public_posts";
const STORAGE_KEY_PROFILE = "vt_profile_images";
const STORAGE_KEY_NOTICES = "vt_notices";
const STORAGE_KEY_EVENTS = "vt_events";
const STORAGE_KEY_DONORS = "vt_donors";
const STORAGE_KEY_DONATIONS = "vt_donations";
const STORAGE_KEY_COMMITTEE = "vt_committee";
const STORAGE_KEY_CONSTRUCTION = "vt_construction";
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/JLLUgqRbIqCIVIhA2LX4Dy";

// ====== LOCAL STORAGE HELPERS ======
function lsGet(key, def) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ====== SHARED STORAGE (syncs with Blog) ======
async function sharedGet() {
  try {
    const res = await window.storage.get(STORAGE_KEY, true);
    return res ? JSON.parse(res.value) : null;
  } catch { return null; }
}
async function sharedSet(val) {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(val), true);
  } catch {}
}

// ====== PROFILE IMAGES SHARED STORAGE ======
async function profileGet() {
  try {
    const res = await window.storage.get(STORAGE_KEY_PROFILE, true);
    return res ? JSON.parse(res.value) : null;
  } catch { return null; }
}
async function profileSet(val) {
  try {
    await window.storage.set(STORAGE_KEY_PROFILE, JSON.stringify(val), true);
  } catch {}
}

// ====== NOTICES SHARED STORAGE ======
async function noticesGet() {
  try {
    const res = await window.storage.get(STORAGE_KEY_NOTICES, true);
    return res ? JSON.parse(res.value) : null;
  } catch { return null; }
}
async function noticesSet(val) {
  try {
    await window.storage.set(STORAGE_KEY_NOTICES, JSON.stringify(val), true);
  } catch {}
}

async function eventsGet() {
  try { const r = await window.storage.get(STORAGE_KEY_EVENTS, true); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function eventsSet(val) {
  try { await window.storage.set(STORAGE_KEY_EVENTS, JSON.stringify(val), true); } catch {}
}
async function donorsGet() {
  try { const r = await window.storage.get(STORAGE_KEY_DONORS, true); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function donorsSet(val) {
  try { await window.storage.set(STORAGE_KEY_DONORS, JSON.stringify(val), true); } catch {}
}
async function donationsGet() {
  try { const r = await window.storage.get(STORAGE_KEY_DONATIONS, true); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function donationsSet(val) {
  try { await window.storage.set(STORAGE_KEY_DONATIONS, JSON.stringify(val), true); } catch {}
}
async function committeeGet() {
  try { const r = await window.storage.get(STORAGE_KEY_COMMITTEE, true); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function committeeSet(val) {
  try { await window.storage.set(STORAGE_KEY_COMMITTEE, JSON.stringify(val), true); } catch {}
}
async function constructionGet() {
  try { const r = await window.storage.get(STORAGE_KEY_CONSTRUCTION, true); return r ? JSON.parse(r.value) : null; } catch { return null; }
}
async function constructionSet(val) {
  try { await window.storage.set(STORAGE_KEY_CONSTRUCTION, JSON.stringify(val), true); } catch {}
}

// ====== INITIAL DATA ======
const INITIAL_POSTS = [
  {
    id: 1,
    author: "ఆలయ నిర్వాహకులు",
    avatar: "🛕",
    date: "2026-02-25",
    type: "news",
    content: "శ్రీ వరసిద్ది వినాయక స్వామి వారి ఆలయం శంకుస్థాపన శుభ ముహూర్తం నేటితో ప్రారంభమైంది. మీందరికీ గణపతి దీవెనలు! 🙏",
    image: null,
    likes: 142,
    comments: [{ user: "రాముడు", text: "జయ గణేశా! 🙏" }],
    liked: false,
    blogLink: null
  }
];

const EVENTS = [
  { date: "2026-02-25", title: "శంకుస్థాపన", desc: "దేవాలయ నిర్మాణ శంకుస్థాపన మహోత్సవం", icon: "🛕" },
  { date: "2026-06-15", title: "గోపుర నిర్మాణం", desc: "గోపురం పనులు ప్రారంభం", icon: "🏗️" },
  { date: "2026-09-01", title: "గణేశ చతుర్థి", desc: "ప్రత్యేక పూజలు & ఉత్సవాలు", icon: "🎉" },
  { date: "2027-01-01", title: "అంతర్గర్భ నిర్మాణం", desc: "గర్భగుడి నిర్మాణం ప్రారంభం", icon: "⚒️" },
  { date: "2027-06-01", title: "ప్రతిష్టాపన", desc: "శ్రీ వినాయక స్వామి ప్రతిష్టాపన మహోత్సవం", icon: "🎊" },
];

const GALLERY = [
  "https://images.unsplash.com/photo-1590577976322-3d2d6a2130f8?w=400&q=80",
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
  "https://images.unsplash.com/photo-1533854775446-95c4609da544?w=400&q=80",
  "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&q=80",
  "https://images.unsplash.com/photo-1519998887987-c93d9c9b2e24?w=400&q=80",
  "https://images.unsplash.com/photo-1626964585218-29e779ffe0bb?w=400&q=80",
];

const LAND_DONORS = [
  { name: "శ్రీ రామకృష్ణ రెడ్డి", relation: "ముఖ్య స్థల దాత", village: "సింగంపల్లి", area: "40 సెంట్లు", details: "ఆలయ నిర్మాణానికి ప్రధాన స్థలం అందించారు", icon: "🏡" },
  { name: "శ్రీమతి లక్ష్మీదేవమ్మ", relation: "సహాయ స్థల దాత", village: "సింగంపల్లి", area: "10 సెంట్లు", details: "ఆలయ ప్రాంగణ విస్తరణకు స్థలం అందించారు", icon: "🌿" }
];

const INITIAL_COMMITTEE = [
  { id: 1, name: "శ్రీ వెంకటేశ్వర రావు", phone: "9876543210", role: "అధ్యక్షుడు" },
  { id: 2, name: "శ్రీ సీతారామ శర్మ", phone: "9876543211", role: "కార్యదర్శి" },
];

const INITIAL_CONSTRUCTION = [
  { id: 1, heading: "శంకుస్థాపన", date: "2026-02-25", details: "దేవాలయ నిర్మాణ శంకుస్థాపన మహోత్సవం శ్రద్ధాభక్తులతో జరిగింది. పూజా కార్యక్రమాలు ఉదయం 8 గంటలకు ప్రారంభమయ్యాయి." },
  { id: 2, heading: "పునాది నిర్మాణం ప్రారంభం", date: "2026-03-10", details: "ఆలయ పునాది పనులు ప్రారంభమయ్యాయి. సుమారు 20 అడుగుల లోతున పునాది నిర్మించబడుతోంది." },
];

function getDayCount() {
  const now = new Date();
  return Math.max(0, Math.floor((now - START_DATE) / (1000 * 60 * 60 * 24)));
}
function formatDate(d) {
  return new Date(d).toLocaleDateString("te-IN", { day: "numeric", month: "long", year: "numeric" });
}

// ====== MAIN APP ======
export default function App() {
  const [currentUser, setCurrentUser] = useState(() => lsGet("vt_user", null));
  const [screen, setScreen] = useState(() => lsGet("vt_user", null) ? "main" : "auth");
  const [authMode, setAuthMode] = useState("register");
  const [subAdmins, setSubAdmins] = useState(() => lsGet("vt_subadmins", []));
  const [users, setUsers] = useState(() => lsGet("vt_users", []));
  const [posts, setPosts] = useState(() => lsGet("vt_posts", INITIAL_POSTS));
  const [events, setEvents] = useState(() => lsGet("vt_events", EVENTS));
  const [donors, setDonors] = useState(() => lsGet("vt_donors", LAND_DONORS));
  const [donationMethods, setDonationMethods] = useState(() => lsGet("vt_donations", [
    { id: 1, icon: "📱", title: "UPI", value: "vinayakatemple@upi", desc: "Google Pay, PhonePe, Paytm ద్వారా" },
    { id: 2, icon: "🏦", title: "బ్యాంక్ ట్రాన్స్‌ఫర్", value: "XXXX XXXX XXXX XXXX", desc: "IFSC: SBIN0001234" },
    { id: 3, icon: "💰", title: "చేతితో", value: "సింగంపల్లి గ్రామం", desc: "ఆలయ నిర్వాహకులను సంప్రదించండి" },
  ]));
  const [committee, setCommittee] = useState(() => lsGet("vt_committee", INITIAL_COMMITTEE));
  const [constructionLog, setConstructionLog] = useState(() => lsGet("vt_construction", INITIAL_CONSTRUCTION));
  const [storageReady, setStorageReady] = useState(false);

  const [activeTab, setActiveTab] = useState("feed");
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [postModal, setPostModal] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", imageBase64: "", imagePreview: "", videoBase64: "", videoPreview: "" });
  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [days, setDays] = useState(getDayCount());
  const [selectedImage, setSelectedImage] = useState(null);
  const [adminPanel, setAdminPanel] = useState(false);
  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [adminSection, setAdminSection] = useState("admins"); // admins | events | donors | committee | construction | donations | whatsapp
  const menuRef = useRef(null);
  const [authForm, setAuthForm] = useState({ name: "", phone: "", password: "" });
  const [authError, setAuthError] = useState("");
  const [syncStatus, setSyncStatus] = useState("");
  const [coverImage, setCoverImage] = useState(() => lsGet("vt_cover_image", null));
  const [profileImage, setProfileImage] = useState(() => lsGet("vt_profile_image", null));
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);

  // Notices / Announcements
  const [notices, setNotices] = useState(() => lsGet("vt_notices", []));
  const [noticeModal, setNoticeModal] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: "", body: "", urgent: false });
  const [noticePanel, setNoticePanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(() => {
    const seen = lsGet("vt_seen_notices", []);
    const all = lsGet("vt_notices", []);
    return all.filter(n => !seen.includes(n.id)).length;
  });
  const [whatsappLink, setWhatsappLink] = useState(() => lsGet("vt_wa_link", WHATSAPP_GROUP_LINK));
  const [editingWaLink, setEditingWaLink] = useState(false);

  // On mount: load posts from shared storage (blog sync)
  useEffect(() => {
    (async () => {
      const shared = await sharedGet();
      if (shared && shared.length > 0) {
        setPosts(shared);
        lsSet("vt_posts", shared);
      } else {
        // First time: push initial posts to shared
        await sharedSet(lsGet("vt_posts", INITIAL_POSTS));
      }
      // Load profile images from shared storage
      const profile = await profileGet();
      if (profile) {
        if (profile.coverImage) { setCoverImage(profile.coverImage); lsSet("vt_cover_image", profile.coverImage); }
        if (profile.profileImage) { setProfileImage(profile.profileImage); lsSet("vt_profile_image", profile.profileImage); }
      }
      setStorageReady(true);
      // Load notices
      const sharedNotices = await noticesGet();
      if (sharedNotices && sharedNotices.length > 0) {
        setNotices(sharedNotices); lsSet("vt_notices", sharedNotices);
        const seen = lsGet("vt_seen_notices", []);
        setUnreadCount(sharedNotices.filter(n => !seen.includes(n.id)).length);
      }
      // Load events
      const sharedEvents = await eventsGet();
      if (sharedEvents && sharedEvents.length > 0) { setEvents(sharedEvents); lsSet("vt_events", sharedEvents); }
      // Load donors
      const sharedDonors = await donorsGet();
      if (sharedDonors && sharedDonors.length > 0) { setDonors(sharedDonors); lsSet("vt_donors", sharedDonors); }
      // Load donations
      const sharedDonations = await donationsGet();
      if (sharedDonations && sharedDonations.length > 0) { setDonationMethods(sharedDonations); lsSet("vt_donations", sharedDonations); }
      // Load committee
      const sharedCommittee = await committeeGet();
      if (sharedCommittee && sharedCommittee.length > 0) { setCommittee(sharedCommittee); lsSet("vt_committee", sharedCommittee); }
      // Load construction log
      const sharedConstruction = await constructionGet();
      if (sharedConstruction && sharedConstruction.length > 0) { setConstructionLog(sharedConstruction); lsSet("vt_construction", sharedConstruction); }
    })();
  }, []);

  // Persist to localStorage
  useEffect(() => { lsSet("vt_posts", posts); }, [posts]);
  useEffect(() => { lsSet("vt_subadmins", subAdmins); }, [subAdmins]);
  useEffect(() => { lsSet("vt_users", users); }, [users]);
  useEffect(() => { lsSet("vt_user", currentUser); }, [currentUser]);

  // Poll shared storage every 30s to pick up changes from other sessions
  useEffect(() => {
    const poll = setInterval(async () => {
      const shared = await sharedGet();
      if (shared) {
        setPosts(shared);
        lsSet("vt_posts", shared);
      }
      // Also poll profile images
      const profile = await profileGet();
      if (profile) {
        if (profile.coverImage) { setCoverImage(profile.coverImage); lsSet("vt_cover_image", profile.coverImage); }
        if (profile.profileImage) { setProfileImage(profile.profileImage); lsSet("vt_profile_image", profile.profileImage); }
      }
      // Poll notices
      const sharedNotices = await noticesGet();
      if (sharedNotices) {
        setNotices(sharedNotices);
        lsSet("vt_notices", sharedNotices);
        const seen = lsGet("vt_seen_notices", []);
        setUnreadCount(sharedNotices.filter(n => !seen.includes(n.id)).length);
      }
    }, 30000);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setDays(getDayCount()), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const isMainAdmin = currentUser?.role === "main_admin";
  const isSubAdmin = currentUser?.role === "sub_admin";
  const canPost = isMainAdmin || isSubAdmin;

  // ====== AUTH ======
  const handleRegister = () => {
    setAuthError("");
    if (!authForm.name.trim()) { setAuthError("పేరు నమోదు చేయండి"); return; }
    if (!/^\d{10}$/.test(authForm.phone)) { setAuthError("10 అంకెల ఫోన్ నెంబర్ నమోదు చేయండి"); return; }
    if (!authForm.password || authForm.password.length < 4 || authForm.password.length > 8) { setAuthError("పాస్వర్డ్ 4-8 అక్షరాలు ఉండాలి"); return; }
    if (users.find(u => u.phone === authForm.phone)) { setAuthError("ఈ నెంబర్ ఇప్పటికే నమోదు అయింది"); return; }
    const isDesignated = subAdmins.find(a => a.phone === authForm.phone);
    const role = isDesignated ? "sub_admin" : "user";
    const newUser = { name: authForm.name, phone: authForm.phone, password: authForm.password, role };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setScreen("main");
    setAuthForm({ name: "", phone: "", password: "" });
  };

  const handleLogin = () => {
    setAuthError("");
    if (authForm.phone === MAIN_ADMIN_ID && authForm.password === MAIN_ADMIN_PWD) {
      const u = { name: "మెయిన్ అడ్మిన్", phone: MAIN_ADMIN_ID, role: "main_admin" };
      setCurrentUser(u); setScreen("main"); return;
    }
    const found = users.find(u => u.phone === authForm.phone && u.password === authForm.password);
    if (found) {
      const isDesignated = subAdmins.find(a => a.phone === found.phone);
      setCurrentUser({ ...found, role: isDesignated ? "sub_admin" : found.role });
      setScreen("main");
      setAuthForm({ name: "", phone: "", password: "" });
    } else {
      setAuthError("ఫోన్ నెంబర్ లేదా పాస్వర్డ్ సరికాదు");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null); lsSet("vt_user", null);
    setScreen("auth"); setAuthMode("login"); setMenuOpen(false);
  };

  // ====== POSTS ======
  const syncToShared = async (updatedPosts) => {
    setSyncStatus("సింక్ అవుతోంది...");
    await sharedSet(updatedPosts);
    setSyncStatus("✅ బ్లాగ్ కు సింక్ అయింది!");
    setTimeout(() => setSyncStatus(""), 2500);
  };

  const handleLike = (id) => {
    const updated = posts.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    );
    setPosts(updated);
    syncToShared(updated);
  };

  const handleDeletePost = (id) => {
    if (!isMainAdmin) return;
    if (window.confirm("ఈ పోస్ట్ ను తొలగించాలా?")) {
      const updated = posts.filter(p => p.id !== id);
      setPosts(updated);
      syncToShared(updated);
    }
  };

  const handleAddPost = async () => {
    if (!newPost.content.trim()) return;
    const p = {
      id: Date.now(),
      author: currentUser?.name || "అతిథి",
      avatar: isMainAdmin ? "👑" : isSubAdmin ? "✍️" : "👤",
      date: new Date().toISOString().slice(0, 10),
      type: newPost.videoBase64 ? "video" : newPost.imageBase64 ? "image" : "text",
      content: newPost.content,
      image: newPost.imageBase64 || null,
      video: newPost.videoBase64 || null,
      likes: 0,
      comments: [],
      liked: false,
      blogLink: null
    };
    const updated = [p, ...posts];
    setPosts(updated);
    setNewPost({ content: "", imageBase64: "", imagePreview: "", videoBase64: "", videoPreview: "" });
    setPostModal(false);
    await syncToShared(updated);
  };

  const handleShare = (post) => {
    const text = post.blogLink ? `${post.content}\n\nమరిన్ని వివరాలు: ${post.blogLink}` : post.content;
    if (navigator.share) {
      navigator.share({ title: TEMPLE_NAME_LINE1, text, url: post.blogLink || window.location.href });
    } else {
      navigator.clipboard?.writeText(text);
      alert("పోస్ట్ కాపీ అయింది!");
    }
  };

  const handleImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setNewPost(prev => ({ ...prev, imageBase64: e.target.result, imagePreview: e.target.result, videoBase64: "", videoPreview: "" }));
    reader.readAsDataURL(file);
  };

  const handleVideoFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setNewPost(prev => ({ ...prev, videoBase64: e.target.result, videoPreview: e.target.result, imageBase64: "", imagePreview: "" }));
    reader.readAsDataURL(file);
  };

  // ====== ADMIN ======
  const [newSubAdminPhone, setNewSubAdminPhone] = useState("");
  const [newSubAdminName, setNewSubAdminName] = useState("");
  const [newSubAdminPwd, setNewSubAdminPwd] = useState("");
  const [adminMsg, setAdminMsg] = useState("");

  const handleAddSubAdmin = () => {
    if (!/^\d{10}$/.test(newSubAdminPhone)) { setAdminMsg("సరైన ఫోన్ నెంబర్ నమోదు చేయండి"); return; }
    if (subAdmins.find(a => a.phone === newSubAdminPhone)) { setAdminMsg("ఈ నెంబర్ ఇప్పటికే అడ్మిన్ గా ఉంది"); return; }
    setSubAdmins([...subAdmins, { phone: newSubAdminPhone, name: newSubAdminName, password: newSubAdminPwd }]);
    setUsers(users.map(u => u.phone === newSubAdminPhone ? { ...u, role: "sub_admin" } : u));
    setNewSubAdminPhone(""); setNewSubAdminName(""); setNewSubAdminPwd("");
    setAdminMsg("అడ్మిన్ విజయవంతంగా జోడించబడ్డారు!");
    setTimeout(() => setAdminMsg(""), 2500);
  };

  const handleRemoveSubAdmin = (phone) => {
    setSubAdmins(subAdmins.filter(a => a.phone !== phone));
    setUsers(users.map(u => u.phone === phone ? { ...u, role: "user" } : u));
  };

  // ====== NOTICES ======
  const handleAddNotice = async () => {
    if (!newNotice.title.trim() || !newNotice.body.trim()) return;
    const n = {
      id: Date.now(),
      title: newNotice.title,
      body: newNotice.body,
      urgent: newNotice.urgent,
      date: new Date().toISOString().slice(0, 10),
      author: currentUser?.name || "అడ్మిన్"
    };
    const updated = [n, ...notices];
    setNotices(updated);
    lsSet("vt_notices", updated);
    await noticesSet(updated);
    setNewNotice({ title: "", body: "", urgent: false });
    setNoticeModal(false);
    setSyncStatus("✅ నోటీసు జోడించబడింది!");
    setTimeout(() => setSyncStatus(""), 2500);
  };

  const handleDeleteNotice = async (id) => {
    if (!isMainAdmin) return;
    const updated = notices.filter(n => n.id !== id);
    setNotices(updated);
    lsSet("vt_notices", updated);
    await noticesSet(updated);
  };

  const markNoticesRead = () => {
    const ids = notices.map(n => n.id);
    lsSet("vt_seen_notices", ids);
    setUnreadCount(0);
  };

  // ====== WHATSAPP SHARE ======
  const handleWhatsAppShare = (post) => {
    const text = encodeURIComponent(
      `🛕 ${TEMPLE_NAME_LINE1}\n\n${post.content}\n\n📅 ${formatDate(post.date)}\n\n${post.blogLink ? `📖 మరిన్ని వివరాలు: ${post.blogLink}` : ""}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleSaveWaLink = () => {
    lsSet("vt_wa_link", whatsappLink);
    setEditingWaLink(false);
    setSyncStatus("✅ WhatsApp లింక్ సేవ్ అయింది!");
    setTimeout(() => setSyncStatus(""), 2000);
  };

  // ====== EVENTS CRUD ======
  const [newEvent, setNewEvent] = useState({ date: "", title: "", desc: "", icon: "🎉" });
  const handleAddEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.date) return;
    const e = { ...newEvent, id: Date.now() };
    const updated = [...events, e].sort((a, b) => new Date(a.date) - new Date(b.date));
    setEvents(updated); lsSet("vt_events", updated); await eventsSet(updated);
    setNewEvent({ date: "", title: "", desc: "", icon: "🎉" });
    setSyncStatus("✅ ఈవెంట్ జోడించబడింది!"); setTimeout(() => setSyncStatus(""), 2000);
  };
  const handleDeleteEvent = async (id) => {
    const updated = events.filter(e => e.id !== id);
    setEvents(updated); lsSet("vt_events", updated); await eventsSet(updated);
  };

  // ====== DONORS CRUD ======
  const [newDonor, setNewDonor] = useState({ name: "", relation: "", village: "", area: "", details: "", icon: "🏡" });
  const handleAddDonor = async () => {
    if (!newDonor.name.trim()) return;
    const d = { ...newDonor, id: Date.now() };
    const updated = [...donors, d];
    setDonors(updated); lsSet("vt_donors", updated); await donorsSet(updated);
    setNewDonor({ name: "", relation: "", village: "", area: "", details: "", icon: "🏡" });
    setSyncStatus("✅ దాత వివరాలు జోడించబడ్డాయి!"); setTimeout(() => setSyncStatus(""), 2000);
  };
  const handleDeleteDonor = async (id) => {
    const updated = donors.filter(d => d.id !== id);
    setDonors(updated); lsSet("vt_donors", updated); await donorsSet(updated);
  };

  // ====== DONATIONS CRUD ======
  const [newDonation, setNewDonation] = useState({ icon: "📱", title: "", value: "", desc: "" });
  const [editingDonation, setEditingDonation] = useState(null);
  const handleAddDonation = async () => {
    if (!newDonation.title.trim() || !newDonation.value.trim()) return;
    const d = { ...newDonation, id: Date.now() };
    const updated = [...donationMethods, d];
    setDonationMethods(updated); lsSet("vt_donations", updated); await donationsSet(updated);
    setNewDonation({ icon: "📱", title: "", value: "", desc: "" });
    setSyncStatus("✅ విరాళం వివరాలు జోడించబడ్డాయి!"); setTimeout(() => setSyncStatus(""), 2000);
  };
  const handleUpdateDonation = async (id, field, val) => {
    const updated = donationMethods.map(d => d.id === id ? { ...d, [field]: val } : d);
    setDonationMethods(updated); lsSet("vt_donations", updated); await donationsSet(updated);
  };
  const handleDeleteDonation = async (id) => {
    const updated = donationMethods.filter(d => d.id !== id);
    setDonationMethods(updated); lsSet("vt_donations", updated); await donationsSet(updated);
  };

  // ====== COMMITTEE CRUD ======
  const [newCommitteeMember, setNewCommitteeMember] = useState({ name: "", phone: "", role: "" });
  const handleAddCommitteeMember = async () => {
    if (!newCommitteeMember.name.trim() || !newCommitteeMember.phone.trim()) return;
    const m = { ...newCommitteeMember, id: Date.now() };
    const updated = [...committee, m];
    setCommittee(updated); lsSet("vt_committee", updated); await committeeSet(updated);
    setNewCommitteeMember({ name: "", phone: "", role: "" });
    setSyncStatus("✅ కమిటి సభ్యుడు జోడించబడ్డారు!"); setTimeout(() => setSyncStatus(""), 2000);
  };
  const handleDeleteCommitteeMember = async (id) => {
    const updated = committee.filter(m => m.id !== id);
    setCommittee(updated); lsSet("vt_committee", updated); await committeeSet(updated);
  };

  // ====== CONSTRUCTION LOG CRUD ======
  const [newConstruction, setNewConstruction] = useState({ heading: "", date: "", details: "" });
  const handleAddConstruction = async () => {
    if (!newConstruction.heading.trim() || !newConstruction.date || !newConstruction.details.trim()) return;
    const c = { ...newConstruction, id: Date.now() };
    const updated = [c, ...constructionLog];
    setConstructionLog(updated); lsSet("vt_construction", updated); await constructionSet(updated);
    setNewConstruction({ heading: "", date: "", details: "" });
    setSyncStatus("✅ నిర్మాణ వివరాలు జోడించబడ్డాయి!"); setTimeout(() => setSyncStatus(""), 2000);
  };
  const handleDeleteConstruction = async (id) => {
    const updated = constructionLog.filter(c => c.id !== id);
    setConstructionLog(updated); lsSet("vt_construction", updated); await constructionSet(updated);
  };

  // ====== PROFILE IMAGE HANDLERS ======
  const handleCoverImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const b64 = e.target.result;
      setCoverImage(b64);
      lsSet("vt_cover_image", b64);
      const current = await profileGet() || {};
      await profileSet({ ...current, coverImage: b64 });
      setSyncStatus("✅ కవర్ ఫోటో అప్డేట్ అయింది!");
      setTimeout(() => setSyncStatus(""), 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const b64 = e.target.result;
      setProfileImage(b64);
      lsSet("vt_profile_image", b64);
      const current = await profileGet() || {};
      await profileSet({ ...current, profileImage: b64 });
      setSyncStatus("✅ ప్రొఫైల్ ఫోటో అప్డేట్ అయింది!");
      setTimeout(() => setSyncStatus(""), 2500);
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: "feed", label: "ఫీడ్", icon: "📰" },
    { id: "notices", label: "నోటీసులు", icon: "📢" },
    { id: "events", label: "కార్యక్రమాలు", icon: "📅" },
    { id: "info", label: "గుడి info", icon: "ℹ️" },
    { id: "gallery", label: "మీడియా", icon: "🖼️" },
    { id: "donations", label: "విరాళాలు", icon: "💛" },
  ];

  // ====== AUTH SCREEN ======
  if (screen === "auth") {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #c0392b 0%, #e67e22 40%, #c0392b 100%)", fontFamily: "'Noto Sans Telugu', 'Segoe UI', sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, maxWidth: 480, margin: "0 auto" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Pragati+Narrow:wght@400;700&family=Tiro+Telugu&display=swap');
          .temple-title {
            font-family: 'Pragati Narrow', 'Tiro Telugu', 'Noto Sans Telugu', sans-serif;
            font-weight: 700;
            background: linear-gradient(180deg, #fff9e6 0%, #FFD700 40%, #ff9800 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: none;
            filter: drop-shadow(0 2px 8px rgba(0,0,0,0.4));
            letter-spacing: 1px;
          }
          .temple-sub {
            font-family: 'Tiro Telugu', 'Noto Sans Telugu', serif;
            letter-spacing: 3px;
          }
          .deco-line {
            display: flex; align-items: center; justify-content: center; gap: 8px; margin: 6px 0;
          }
          .deco-line::before, .deco-line::after {
            content: '';
            flex: 1; max-width: 60px;
            height: 1.5px;
            background: linear-gradient(90deg, transparent, #FFD700, transparent);
          }
        `}</style>
        <div style={{ fontSize: 56, marginBottom: 4, textAlign: "center", filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>🕉️</div>
        <div style={{ textAlign: "center", marginBottom: 24, padding: "0 10px" }}>
          <div className="temple-title" style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.5, marginBottom: 2 }}>{TEMPLE_NAME_LINE1}</div>
          <div className="deco-line"><span style={{ fontSize: 12, color: "#FFD700", letterSpacing: 2 }}>❋</span></div>
          <div className="temple-sub" style={{ fontSize: 20, fontWeight: 700, color: "#FFD700", textAlign: "center", letterSpacing: 4, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{TEMPLE_NAME_LINE2}</div>
        </div>
        <div style={{ background: "rgba(0,0,0,0.35)", borderRadius: 20, padding: 24, width: "100%", maxWidth: 360, border: "1px solid rgba(255,255,255,0.2)" }}>
          <div style={{ display: "flex", marginBottom: 20, background: "rgba(0,0,0,0.3)", borderRadius: 12, padding: 4 }}>
            {["register", "login"].map(m => (
              <button key={m} onClick={() => { setAuthMode(m); setAuthError(""); }}
                style={{ flex: 1, padding: "10px 0", background: authMode === m ? "linear-gradient(135deg, #c0392b, #e67e22)" : "none", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                {m === "register" ? "రిజిస్టర్" : "లాగిన్"}
              </button>
            ))}
          </div>
          {authMode === "register" && <input type="text" placeholder="మీ పూర్తి పేరు" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} style={iSt} />}
          <input type={authMode === "login" ? "text" : "tel"} placeholder={authMode === "login" ? "ఫోన్ నెంబర్ లేదా User ID" : "ఫోన్ నెంబర్ (10 అంకెలు)"} value={authForm.phone} onChange={e => setAuthForm({ ...authForm, phone: e.target.value })} style={iSt} />
          <input type="password" placeholder={authMode === "register" ? "పాస్వర్డ్ (4-8 అక్షరాలు)" : "పాస్వర్డ్"} value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} style={{ ...iSt, marginBottom: 0 }} />
          {authError && <div style={{ color: "#ffcdd2", fontSize: 12, marginTop: 10, textAlign: "center" }}>{authError}</div>}
          <button onClick={authMode === "register" ? handleRegister : handleLogin}
            style={{ width: "100%", marginTop: 16, padding: "14px", background: "linear-gradient(135deg, #c0392b, #e67e22)", border: "none", borderRadius: 12, color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
            {authMode === "register" ? "🙏 నమోదు చేయండి" : "🔐 లాగిన్ అవ్వండి"}
          </button>
        </div>
      </div>
    );
  }

  // ====== MAIN APP ======
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #7b0000 0%, #c0392b 30%, #e67e22 70%, #c0392b 100%)", fontFamily: "'Noto Sans Telugu', 'Segoe UI', sans-serif", color: "#fff", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pragati+Narrow:wght@400;700&family=Tiro+Telugu&display=swap');
        .temple-title {
          font-family: 'Pragati Narrow', 'Tiro Telugu', 'Noto Sans Telugu', sans-serif;
          font-weight: 700;
          background: linear-gradient(180deg, #fff9e6 0%, #FFD700 40%, #ff9800 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 2px 6px rgba(0,0,0,0.4));
          letter-spacing: 1px;
        }
        .temple-sub {
          font-family: 'Pragati Narrow', 'Tiro Telugu', 'Noto Sans Telugu', sans-serif;
          font-weight: 700;
          letter-spacing: 3px;
        }
        .deco-line {
          display: flex; align-items: center; justify-content: center; gap: 8px; margin: 3px 0;
        }
        .deco-line::before, .deco-line::after {
          content: '';
          flex: 1; max-width: 50px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,215,0,0.7), transparent);
        }
        @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
      `}</style>

      {/* Sync status toast */}
      {syncStatus && (
        <div style={{ position: "fixed", top: 12, left: "50%", transform: "translateX(-50%)", background: "#1a1a1a", color: "#fff", fontSize: 12, padding: "8px 16px", borderRadius: 20, zIndex: 9999, border: "1px solid rgba(255,255,255,0.2)" }}>
          {syncStatus}
        </div>
      )}

      {/* ===== HEADER: Menu left + Temple Name center + Profile Pic right ===== */}
      <div style={{ background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,215,0,0.2)", padding: "12px 14px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* ☰ Menu */}
          <button onClick={() => setMenuOpen(true)} style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "7px 10px", cursor: "pointer", color: "#fff", fontSize: 18, flexShrink: 0 }}>☰</button>

          {/* Temple Name — center */}
          <div style={{ flex: 1, textAlign: "center" }}>
            <div className="temple-title" style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.4 }}>{TEMPLE_NAME_LINE1}</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, margin: "2px 0" }}>
              <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, transparent, rgba(255,215,0,0.6))" }} />
              <span style={{ fontSize: 11, color: "#FFD700" }}>❋</span>
              <div style={{ width: 40, height: 1, background: "linear-gradient(90deg, rgba(255,215,0,0.6), transparent)" }} />
            </div>
            <div className="temple-sub" style={{ fontSize: 14, fontWeight: 700, color: "#FFD700", letterSpacing: 3, textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>{TEMPLE_NAME_LINE2}</div>
          </div>

          {/* Profile Pic — right */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: "2.5px solid #FFD700", overflow: "hidden", background: profileImage ? "transparent" : "linear-gradient(135deg, #c0392b, #e67e22)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 12px rgba(0,0,0,0.5)" }}>
              {profileImage
                ? <img src={profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                : <span style={{ fontSize: 26 }}>🕉️</span>
              }
            </div>
            {isMainAdmin && (
              <button onClick={() => profileInputRef.current?.click()}
                style={{ position: "absolute", bottom: 0, right: 0, background: "#FFD700", border: "2px solid #7b0000", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 9, boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }}>
                ✏️
              </button>
            )}
            <input ref={profileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleProfileImageFile(e.target.files[0])} />
          </div>
        </div>
      </div>
      {/* Scrolling Post Headlines Ticker */}
      <div style={{ background: "rgba(0,0,0,0.45)", borderBottom: "1px solid rgba(232,128,10,0.3)", padding: "7px 0", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flexShrink: 0, background: "linear-gradient(135deg,#c0392b,#e67e22)", padding: "3px 10px", fontSize: 10, fontWeight: 800, color: "#fff", marginRight: 10, borderRadius: "0 8px 8px 0" }}>🔔 తాజా</div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              animation: "marquee 22s linear infinite",
              fontSize: 12,
              color: "#FFD700",
              fontWeight: 600
            }}>
              {posts.length > 0
                ? posts.slice(0, 6).map((p, i) => `${i > 0 ? "  ✦  " : ""}${p.content.slice(0, 60)}${p.content.length > 60 ? "..." : ""}`).join("")
                : "నిర్మాణ అప్‌డేట్‌లు త్వరలో వస్తాయి..."}
            </div>
          </div>
        </div>
        <style>{``}</style>
      </div>

      {/* Sticky days counter */}
      <div style={{ background: "linear-gradient(135deg, #c0392b, #e67e22, #f39c12)", padding: "8px 16px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: "8px 14px", display: "flex", alignItems: "center", gap: 12, border: "1px solid rgba(255,255,255,0.15)", flex: 1 }}>
            <span style={{ fontSize: 18 }}>⏳</span>
            <div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>శంకుస్థాపన నుండి నేటివరకు</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 1 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: "#FFD700", lineHeight: 1 }}>{days}</span>
                <span style={{ fontSize: 12, color: "#FFD700" }}>రోజులు</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginLeft: 4 }}>(25 ఫిబ్రవరి 2026 నుండి)</span>
              </div>
            </div>
          </div>
          {/* Notification Bell */}
          <button onClick={() => { setNoticePanel(true); markNoticesRead(); }}
            style={{ position: "relative", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, flexShrink: 0 }}>
            🔔
            {unreadCount > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, background: "#e74c3c", color: "#fff", borderRadius: "50%", minWidth: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid #c0392b" }}>
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", overflowX: "auto", background: "rgba(0,0,0,0.5)", borderBottom: "1px solid rgba(232,128,10,0.3)", scrollbarWidth: "none", position: "sticky", top: 70, zIndex: 99 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: "0 0 auto", padding: "10px 14px", background: "none", border: "none", borderBottom: activeTab === tab.id ? "3px solid #f39c12" : "3px solid transparent", color: activeTab === tab.id ? "#f39c12" : "rgba(255,255,255,0.6)", fontSize: 11, fontWeight: activeTab === tab.id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 15 }}>{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px", paddingBottom: 80 }}>

        {/* FEED */}
        {activeTab === "feed" && (
          <div>
            {canPost && (
              <button onClick={() => setPostModal(true)} style={{ width: "100%", background: "linear-gradient(135deg, #c0392b, #e67e22)", border: "none", borderRadius: 14, padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
                ➕ కొత్త పోస్ట్ చేయండి
              </button>
            )}
            {!storageReady && <div style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: 12, padding: 20 }}>లోడ్ అవుతోంది...</div>}
            {posts.map(post => (
              <PostCard key={post.id} post={post}
                onLike={() => handleLike(post.id)}
                onShare={() => handleShare(post)}
                onWhatsApp={() => handleWhatsAppShare(post)}
                onComment={(text) => {
                  if (!text.trim()) return;
                  const updated = posts.map(p => p.id === post.id ? { ...p, comments: [...p.comments, { user: currentUser?.name || "సభ్యుడు", text }] } : p);
                  setPosts(updated);
                  syncToShared(updated);
                }}
                commentInput={commentInputs[post.id] || ""}
                setCommentInput={(v) => setCommentInputs({ ...commentInputs, [post.id]: v })}
                onDelete={isMainAdmin ? () => handleDeletePost(post.id) : null}
              />
            ))}
          </div>
        )}

        {/* EVENTS */}
        {activeTab === "events" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#FFD700", margin: 0 }}>📅 కార్యక్రమాలు</h2>
              {isMainAdmin && (
                <button onClick={() => setEventFormOpen(v => !v)}
                  style={{ background: "linear-gradient(135deg, #c0392b, #e67e22)", border: "none", borderRadius: 20, padding: "8px 16px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  {eventFormOpen ? "✕ మూసివేయి" : "➕ కార్యక్రమం జోడించు"}
                </button>
              )}
            </div>

            {/* Admin Add Form — inline */}
            {isMainAdmin && eventFormOpen && (
              <div style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,215,0,0.35)", borderRadius: 16, padding: 16, marginBottom: 18 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", marginBottom: 12 }}>🆕 కొత్త కార్యక్రమం</div>
                <input type="text" placeholder="కార్యక్రమం పేరు (తెలుగులో)" value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,215,0,0.35)", borderRadius: 10, color: "#fff", fontSize: 13, marginBottom: 10, boxSizing: "border-box", outline: "none" }} />
                <input type="date" value={newEvent.date}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,215,0,0.35)", borderRadius: 10, color: "#fff", fontSize: 13, marginBottom: 10, boxSizing: "border-box", outline: "none", colorScheme: "dark" }} />
                <textarea placeholder="వివరాలు రాయండి..." value={newEvent.desc}
                  onChange={e => setNewEvent({ ...newEvent, desc: e.target.value })} rows={3}
                  style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,215,0,0.35)", borderRadius: 10, color: "#fff", fontSize: 13, marginBottom: 10, boxSizing: "border-box", outline: "none", resize: "none" }} />
                <input type="text" placeholder="ఐకాన్ emoji (ఉదా: 🎉 🛕 🎊 ⚒️)" value={newEvent.icon}
                  onChange={e => setNewEvent({ ...newEvent, icon: e.target.value })}
                  style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,215,0,0.35)", borderRadius: 10, color: "#fff", fontSize: 13, marginBottom: 12, boxSizing: "border-box", outline: "none" }} />
                <button onClick={async () => { await handleAddEvent(); setEventFormOpen(false); }}
                  style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #1b5e20, #2e7d32)", border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  ✅ కార్యక్రమం జోడించు
                </button>
              </div>
            )}

            {events.length === 0 && <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13, padding: 30 }}>ఇంకా కార్యక్రమాలు జోడించలేదు</div>}

            {/* Timeline */}
            <div style={{ position: "relative" }}>
              {events.map((ev, i) => {
                const isPast = new Date(ev.date) < new Date();
                const isToday = new Date(ev.date).toDateString() === new Date().toDateString();
                return (
                  <div key={ev.id || i} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                    {/* Timeline dot */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{ width: 44, height: 44, background: isToday ? "rgba(255,215,0,0.35)" : isPast ? "rgba(232,128,10,0.25)" : "rgba(255,255,255,0.08)", border: `2px solid ${isToday ? "#FFD700" : isPast ? "#e8800a" : "rgba(255,215,0,0.4)"}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{ev.icon || "📅"}</div>
                      {i < events.length - 1 && <div style={{ width: 2, flex: 1, minHeight: 20, background: "rgba(255,215,0,0.15)", marginTop: 4 }} />}
                    </div>
                    {/* Card */}
                    <div style={{ flex: 1, background: isToday ? "rgba(255,215,0,0.1)" : isPast ? "rgba(232,128,10,0.08)" : "rgba(0,0,0,0.25)", border: `1px solid ${isToday ? "rgba(255,215,0,0.6)" : isPast ? "rgba(232,128,10,0.4)" : "rgba(255,215,0,0.25)"}`, borderRadius: 14, padding: "12px 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <div style={{ fontSize: 14, fontWeight: 800, color: isToday ? "#FFD700" : isPast ? "#e8800a" : "#fff" }}>{ev.title}</div>
                            <span style={{ fontSize: 9, background: isToday ? "rgba(255,215,0,0.25)" : isPast ? "rgba(232,128,10,0.2)" : "rgba(100,200,100,0.2)", color: isToday ? "#FFD700" : isPast ? "#e8800a" : "#81c784", padding: "2px 8px", borderRadius: 20, fontWeight: 700, flexShrink: 0 }}>
                              {isToday ? "🔴 నేడు" : isPast ? "✅ పూర్తి" : "⏳ రానున్న"}
                            </span>
                          </div>
                          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>📆 {formatDate(ev.date)}</div>
                          {ev.desc && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginTop: 8 }}>{ev.desc}</div>}
                        </div>
                        {isMainAdmin && (
                          <button onClick={() => handleDeleteEvent(ev.id || ev.title)}
                            style={{ background: "rgba(220,50,50,0.2)", border: "1px solid rgba(220,50,50,0.4)", borderRadius: 8, padding: "5px 9px", color: "#ff8080", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>🗑️</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* INFO */}
        {activeTab === "info" && (
          <div>
            <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(232,128,10,0.5)", borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🕉️</div>
              <div className="temple-title" style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.5 }}>{TEMPLE_NAME_LINE1}</div>
              <div className="deco-line"><span style={{ fontSize: 11, color: "rgba(255,215,0,0.8)" }}>❋</span></div>
              <div className="temple-sub" style={{ fontSize: 16, fontWeight: 700, color: "#FFD700", letterSpacing: 4, textShadow: "0 2px 6px rgba(0,0,0,0.5)" }}>{TEMPLE_NAME_LINE2}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>నిర్మాణంలో ఉన్న పవిత్ర క్షేత్రం</div>
            </div>
            {[
              { icon: "📅", title: "శంకుస్థాపన", value: "25 ఫిబ్రవరి 2026" },
              { icon: "📍", title: "స్థలం", value: "సింగంపల్లి, ఆంధ్రప్రదేశ్" },
              { icon: "🏛️", title: "నిర్మాణ శైలి", value: "ద్రావిడ శైలి" },
              { icon: "🎯", title: "ప్రతిష్టాపన లక్ష్యం", value: "2027 మధ్యకాలం" },
              { icon: "🙏", title: "ముఖ్య దేవత", value: "శ్రీ వరసిద్ది వినాయక స్వామి" },
            ].map((item, i) => (
              <div key={i} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                <span style={{ fontSize: 22 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{item.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 2 }}>{item.value}</div>
                </div>
              </div>
            ))}

            {/* ఆలయ స్థల దాతలు */}
            <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 16, padding: 16, marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#FFD700", marginBottom: 14 }}>🏡 ఆలయ స్థల దాతలు</div>
              {donors.length === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 16 }}>దాతల వివరాలు లేవు</div>}
              {donors.map((donor, i) => (
                <div key={i} style={{ background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 24 }}>{donor.icon || "🏡"}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#FFD700" }}>{donor.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,215,0,0.7)" }}>{donor.relation}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>📍 గ్రామం: {donor.village}<br />📐 స్థల వైశాల్యం: {donor.area}<br />ℹ️ {donor.details}</div>
                </div>
              ))}
            </div>

            {/* ఆలయ నిర్మాణం వివరాలు */}
            <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(100,180,255,0.3)", borderRadius: 16, padding: 16, marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#90caf9", marginBottom: 14 }}>🏗️ ఆలయ నిర్మాణం వివరాలు</div>
              {constructionLog.length === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 16 }}>నిర్మాణ వివరాలు లేవు</div>}
              {constructionLog.map((c, i) => (
                <div key={c.id || i} style={{ background: "rgba(100,180,255,0.06)", border: "1px solid rgba(100,180,255,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 10, position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: "#90caf9" }}>{i + 1}. {c.heading}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 3 }}>📅 {formatDate(c.date)}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginTop: 8 }}>{c.details}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ఆలయ కమిటి వివరాలు */}
            <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,160,0,0.3)", borderRadius: 16, padding: 16, marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#FFB300" }}>👥 ఆలయ కమిటి వివరాలు</div>
                {isMainAdmin && (
                  <button onClick={() => { setAdminPanel(true); setAdminSection("committee"); }}
                    style={{ background: "rgba(255,179,0,0.2)", border: "1px solid rgba(255,179,0,0.5)", borderRadius: 20, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 18, color: "#FFB300" }}>+</button>
                )}
              </div>
              {committee.length === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 16 }}>కమిటి వివరాలు లేవు</div>}
              {committee.map((m, i) => (
                <div key={m.id || i} style={{ background: "rgba(255,160,0,0.06)", border: "1px solid rgba(255,160,0,0.2)", borderRadius: 12, padding: "12px 14px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, background: "rgba(255,179,0,0.2)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>👤</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#FFB300" }}>{m.name}</div>
                    {m.role && <div style={{ fontSize: 11, color: "rgba(255,215,0,0.7)", marginTop: 2 }}>{m.role}</div>}
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 3 }}>📞 {m.phone}</div>
                  </div>
                  <a href={`tel:${m.phone}`} style={{ background: "rgba(37,211,102,0.2)", border: "1px solid rgba(37,211,102,0.4)", borderRadius: 8, padding: "6px 10px", color: "#25D366", fontSize: 16, textDecoration: "none", flexShrink: 0 }}>📞</a>
                </div>
              ))}
            </div>

            {/* WhatsApp గ్రూప్ — చివరకు */}
            <div style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", borderRadius: 14, padding: 16, marginTop: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#25D366", marginBottom: 8 }}>💬 WhatsApp గ్రూప్</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>ఆలయ సమాచారం & అప్‌డేట్‌లకు WhatsApp గ్రూప్‌లో చేరండి.</div>
              {isMainAdmin && (
                editingWaLink ? (
                  <div style={{ marginTop: 10 }}>
                    <input type="text" value={whatsappLink} onChange={e => setWhatsappLink(e.target.value)}
                      placeholder="WhatsApp గ్రూప్ లింక్ పెట్టండి..." style={{ ...iSt, marginBottom: 8 }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={handleSaveWaLink} style={{ flex: 1, padding: "9px", background: "#25D366", border: "none", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>✅ సేవ్</button>
                      <button onClick={() => setEditingWaLink(false)} style={{ flex: 1, padding: "9px", background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, color: "#fff", fontSize: 12, cursor: "pointer" }}>రద్దు</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setEditingWaLink(true)} style={{ marginTop: 8, padding: "8px 14px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, color: "#fff", fontSize: 11, cursor: "pointer" }}>✏️ లింక్ మార్చు</button>
                )
              )}
              <button onClick={() => { if (whatsappLink && whatsappLink !== WHATSAPP_GROUP_LINK) window.open(whatsappLink, "_blank"); else window.open(WHATSAPP_GROUP_LINK, "_blank"); }}
                style={{ marginTop: 10, padding: "10px 16px", background: "#25D366", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "block", width: "100%" }}>
                📲 గ్రూప్‌లో చేరండి
              </button>
            </div>
          </div>
        )}

        {/* NOTICES */}
        {activeTab === "notices" && (
          <div>
            {canPost && (
              <button onClick={() => setNoticeModal(true)} style={{ width: "100%", background: "linear-gradient(135deg, #1a237e, #283593)", border: "1px solid rgba(100,150,255,0.4)", borderRadius: 14, padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 16, boxShadow: "0 4px 15px rgba(0,0,0,0.3)" }}>
                📢 కొత్త నోటీసు జోడించండి
              </button>
            )}
            {notices.length === 0 && (
              <div style={{ textAlign: "center", padding: 40, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
                ఇంకా నోటీసులు లేవు
              </div>
            )}
            {notices.map(n => (
              <div key={n.id} style={{ background: n.urgent ? "rgba(180,0,0,0.35)" : "rgba(0,0,0,0.25)", border: `1px solid ${n.urgent ? "rgba(255,80,80,0.5)" : "rgba(100,150,255,0.25)"}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14, position: "relative" }}>
                {n.urgent && <div style={{ position: "absolute", top: -8, left: 14, background: "#e74c3c", color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 20 }}>⚠️ అత్యవసరం</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: n.urgent ? 6 : 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#FFD700", flex: 1, marginRight: 8 }}>{n.title}</div>
                  {isMainAdmin && (
                    <button onClick={() => handleDeleteNotice(n.id)} style={{ background: "rgba(220,50,50,0.2)", border: "none", borderRadius: 8, padding: "4px 8px", color: "#ff8080", fontSize: 11, cursor: "pointer", flexShrink: 0 }}>🗑️</button>
                  )}
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginTop: 8 }}>{n.body}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>📅 {formatDate(n.date)} • ✍️ {n.author}</div>
              </div>
            ))}
          </div>
        )}

        {/* GALLERY / MEDIA TAB */}
        {activeTab === "gallery" && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#FFD700", marginBottom: 16 }}>🖼️ నిర్మాణ ఫోటో గ్యాలరీ</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {GALLERY.map((img, i) => (
                <div key={i} onClick={() => setSelectedImage(img)} style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "1", cursor: "pointer", border: "1px solid rgba(232,128,10,0.3)" }}>
                  <img src={img} alt={`నిర్మాణం ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              ))}
            </div>
            {selectedImage && (
              <div onClick={() => setSelectedImage(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
                <div onClick={e => e.stopPropagation()} style={{ maxWidth: 440, width: "100%" }}>
                  <img src={selectedImage} alt="" style={{ width: "100%", borderRadius: 14, display: "block" }} />
                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <a href={selectedImage} download="temple_photo.jpg" style={{ flex: 1, background: "#e8800a", color: "#fff", textDecoration: "none", padding: "12px", borderRadius: 10, textAlign: "center", fontSize: 13, fontWeight: 700 }}>⬇️ డౌన్లోడ్</a>
                    <button onClick={() => setSelectedImage(null)} style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff", padding: "12px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✕ మూసివేయి</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* DONATIONS */}
        {activeTab === "donations" && (
          <div>
            <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,215,0,0.3)", borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🙏</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#FFD700" }}>విరాళాలు</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 6, lineHeight: 1.7 }}>శ్రీ వరసిద్ది వినాయక స్వామి వారి ఆలయ నిర్మాణానికి మీ సహకారం అందించండి.</div>
            </div>
            {donationMethods.map((item) => (
              <div key={item.id} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 14, padding: "14px 16px", marginBottom: 12, display: "flex", gap: 14 }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700" }}>{item.title}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#fff", marginTop: 2 }}>{item.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side Menu */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
          <div onClick={() => setMenuOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
          <div ref={menuRef} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 260, background: "linear-gradient(180deg, #7b0000 0%, #c0392b 100%)", borderLeft: "1px solid rgba(232,128,10,0.4)", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "linear-gradient(135deg, #c0392b, #e67e22)", padding: "24px 20px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 44, height: 44, background: "rgba(255,255,255,0.2)", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                  {isMainAdmin ? "👑" : isSubAdmin ? "✍️" : "👤"}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{currentUser?.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>{isMainAdmin ? "మెయిన్ అడ్మిన్" : isSubAdmin ? "అడ్మిన్" : currentUser?.phone}</div>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
              {isMainAdmin && (
                <button onClick={() => { setAdminPanel(true); setMenuOpen(false); }} style={{ width: "100%", background: "rgba(255,215,0,0.15)", border: "1px solid rgba(255,215,0,0.4)", borderRadius: 10, padding: "12px 14px", color: "#FFD700", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 8, fontWeight: 700 }}>
                  <span style={{ fontSize: 18 }}>⚙️</span> అడ్మిన్ పేనెల్
                </button>
              )}
              {tabs.map((item, i) => (
                <button key={i} onClick={() => { setActiveTab(item.id); setMenuOpen(false); }} style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>{item.label}
                </button>
              ))}
            </div>
            <div style={{ padding: 16, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
              <button onClick={handleLogout} style={{ width: "100%", background: "rgba(220,50,50,0.2)", border: "1px solid rgba(220,50,50,0.4)", borderRadius: 10, padding: "12px", color: "#ff8080", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>🚪 లాగ్ అవుట్</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Panel */}
      {adminPanel && isMainAdmin && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.9)", overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "16px 0 40px" }}>
          <div style={{ background: "linear-gradient(135deg, #2d0000, #4a0000)", border: "1px solid rgba(255,215,0,0.35)", borderRadius: 20, width: "calc(100% - 32px)", maxWidth: 440 }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px", borderBottom: "1px solid rgba(255,215,0,0.2)" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#FFD700" }}>⚙️ అడ్మిన్ కంట్రోల్ పేనెల్</div>
              <button onClick={() => setAdminPanel(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 22, cursor: "pointer" }}>✕</button>
            </div>
            {/* Section Tabs */}
            <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid rgba(255,215,0,0.15)", scrollbarWidth: "none" }}>
              {[
                { id: "admins", label: "👥 అడ్మిన్స్" },
                { id: "events", label: "🎉 ఈవెంట్స్" },
                { id: "donors", label: "🏡 దాతలు" },
                { id: "committee", label: "🏛️ కమిటి" },
                { id: "construction", label: "🏗️ నిర్మాణం" },
                { id: "donations", label: "💰 విరాళాలు" },
                { id: "whatsapp", label: "🔗 WhatsApp" },
              ].map(s => (
                <button key={s.id} onClick={() => setAdminSection(s.id)}
                  style={{ flex: "0 0 auto", padding: "10px 14px", background: "none", border: "none", borderBottom: adminSection === s.id ? "3px solid #FFD700" : "3px solid transparent", color: adminSection === s.id ? "#FFD700" : "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: adminSection === s.id ? 700 : 400, cursor: "pointer", whiteSpace: "nowrap" }}>
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ padding: 20 }}>

              {/* ===== ADMINS SECTION ===== */}
              {adminSection === "admins" && (
                <div>
                  <div style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", marginBottom: 12 }}>➕ కొత్త అడ్మిన్ జోడించండి</div>
                    <input type="text" placeholder="పేరు" value={newSubAdminName} onChange={e => setNewSubAdminName(e.target.value)} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="tel" placeholder="ఫోన్ నెంబర్" value={newSubAdminPhone} onChange={e => setNewSubAdminPhone(e.target.value)} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="పాస్వర్డ్" value={newSubAdminPwd} onChange={e => setNewSubAdminPwd(e.target.value)} style={{ ...iSt, marginBottom: 8 }} />
                    {adminMsg && <div style={{ color: adminMsg.includes("విజయ") ? "#a5d6a7" : "#ffcdd2", fontSize: 12, marginBottom: 8 }}>{adminMsg}</div>}
                    <button onClick={handleAddSubAdmin} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #c0392b, #e67e22)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ అడ్మిన్ చేయి</button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", marginBottom: 10 }}>📋 ప్రస్తుత అడ్మిన్స్</div>
                  {subAdmins.length === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 16 }}>ఇంకా ఎవరూ లేరు</div>}
                  {subAdmins.map((admin, i) => (
                    <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{admin.name || "పేరు లేదు"}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>📞 {admin.phone}</div>
                      </div>
                      <button onClick={() => handleRemoveSubAdmin(admin.phone)} style={{ background: "rgba(220,50,50,0.2)", border: "1px solid rgba(220,50,50,0.4)", borderRadius: 8, padding: "6px 12px", color: "#ff8080", fontSize: 12, cursor: "pointer" }}>తొలగించు</button>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== EVENTS SECTION ===== */}
              {adminSection === "events" && (
                <div>
                  <div style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", marginBottom: 12 }}>➕ కొత్త ఈవెంట్ జోడించు</div>
                    <input type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} style={{ ...iSt, marginBottom: 8, colorScheme: "dark" }} />
                    <input type="text" placeholder="ఈవెంట్ పేరు (తెలుగులో)" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="వివరాలు" value={newEvent.desc} onChange={e => setNewEvent({ ...newEvent, desc: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="ఐకాన్ (emoji) ఉదా: 🎉 🛕 🎊" value={newEvent.icon} onChange={e => setNewEvent({ ...newEvent, icon: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <button onClick={handleAddEvent} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #1b5e20, #2e7d32)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ ఈవెంట్ జోడించు</button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", marginBottom: 10 }}>📋 ప్రస్తుత ఈవెంట్స్ ({events.length})</div>
                  {events.length === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 16 }}>ఇంకా ఈవెంట్స్ లేవు</div>}
                  {events.map((ev, i) => (
                    <div key={ev.id || i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1 }}>
                        <span style={{ fontSize: 20 }}>{ev.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{ev.title}</div>
                          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>📆 {formatDate(ev.date)}</div>
                        </div>
                      </div>
                      <button onClick={() => handleDeleteEvent(ev.id || ev.title)} style={{ background: "rgba(220,50,50,0.2)", border: "1px solid rgba(220,50,50,0.4)", borderRadius: 8, padding: "5px 10px", color: "#ff8080", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== DONORS SECTION ===== */}
              {adminSection === "donors" && (
                <div>
                  <div style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", marginBottom: 12 }}>➕ కొత్త దాత జోడించు</div>
                    <input type="text" placeholder="దాత పూర్తి పేరు" value={newDonor.name} onChange={e => setNewDonor({ ...newDonor, name: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="హోదా (ఉదా: ముఖ్య స్థల దాత)" value={newDonor.relation} onChange={e => setNewDonor({ ...newDonor, relation: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="గ్రామం" value={newDonor.village} onChange={e => setNewDonor({ ...newDonor, village: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="స్థల వైశాల్యం (ఉదా: 20 సెంట్లు)" value={newDonor.area} onChange={e => setNewDonor({ ...newDonor, area: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="వివరాలు" value={newDonor.details} onChange={e => setNewDonor({ ...newDonor, details: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <button onClick={handleAddDonor} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #4a148c, #6a1b9a)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ దాత జోడించు</button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", marginBottom: 10 }}>📋 దాతల జాబితా ({donors.length})</div>
                  {donors.length === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 16 }}>ఇంకా దాతలు లేరు</div>}
                  {donors.map((d, i) => (
                    <div key={d.id || i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700" }}>{d.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{d.relation} • {d.area}</div>
                      </div>
                      <button onClick={() => handleDeleteDonor(d.id || d.name)} style={{ background: "rgba(220,50,50,0.2)", border: "1px solid rgba(220,50,50,0.4)", borderRadius: 8, padding: "5px 10px", color: "#ff8080", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== COMMITTEE SECTION ===== */}
              {adminSection === "committee" && (
                <div>
                  <div style={{ background: "rgba(255,179,0,0.07)", border: "1px solid rgba(255,179,0,0.3)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FFB300", marginBottom: 12 }}>➕ కొత్త కమిటి సభ్యుడు</div>
                    <input type="text" placeholder="సభ్యుడి పూర్తి పేరు" value={newCommitteeMember.name} onChange={e => setNewCommitteeMember({ ...newCommitteeMember, name: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="tel" placeholder="ఫోన్ నెంబర్" value={newCommitteeMember.phone} onChange={e => setNewCommitteeMember({ ...newCommitteeMember, phone: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="హోదా (ఉదా: అధ్యక్షుడు, కార్యదర్శి)" value={newCommitteeMember.role} onChange={e => setNewCommitteeMember({ ...newCommitteeMember, role: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <button onClick={handleAddCommitteeMember} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #e65100, #ff8f00)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ జోడించు</button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFB300", marginBottom: 10 }}>📋 కమిటి జాబితా ({committee.length})</div>
                  {committee.length === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 16 }}>ఇంకా సభ్యులు లేరు</div>}
                  {committee.map((m, i) => (
                    <div key={m.id || i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#FFB300" }}>{m.name}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{m.role} • 📞 {m.phone}</div>
                      </div>
                      <button onClick={() => handleDeleteCommitteeMember(m.id)} style={{ background: "rgba(220,50,50,0.2)", border: "1px solid rgba(220,50,50,0.4)", borderRadius: 8, padding: "5px 10px", color: "#ff8080", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== CONSTRUCTION SECTION ===== */}
              {adminSection === "construction" && (
                <div>
                  <div style={{ background: "rgba(100,180,255,0.07)", border: "1px solid rgba(100,180,255,0.3)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#90caf9", marginBottom: 12 }}>➕ నిర్మాణ వివరం జోడించు</div>
                    <input type="text" placeholder="శీర్షిక (హెడ్డింగ్) - ఉదా: గోపుర నిర్మాణం" value={newConstruction.heading} onChange={e => setNewConstruction({ ...newConstruction, heading: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="date" value={newConstruction.date} onChange={e => setNewConstruction({ ...newConstruction, date: e.target.value })} style={{ ...iSt, marginBottom: 8, colorScheme: "dark" }} />
                    <textarea placeholder="వివరాలు రాయండి..." value={newConstruction.details} onChange={e => setNewConstruction({ ...newConstruction, details: e.target.value })} rows={4}
                      style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(100,180,255,0.3)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "12px 14px", resize: "none", outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
                    <button onClick={handleAddConstruction} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #1565c0, #0288d1)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ జోడించు</button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#90caf9", marginBottom: 10 }}>📋 నిర్మాణ వివరాల జాబితా ({constructionLog.length})</div>
                  {constructionLog.length === 0 && <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", textAlign: "center", padding: 16 }}>ఇంకా వివరాలు లేవు</div>}
                  {constructionLog.map((c, i) => (
                    <div key={c.id || i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(100,180,255,0.2)", borderRadius: 10, padding: "10px 14px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#90caf9" }}>{c.heading}</div>
                        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>📅 {formatDate(c.date)}</div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 4, lineHeight: 1.6 }}>{c.details.slice(0, 80)}{c.details.length > 80 ? "..." : ""}</div>
                      </div>
                      <button onClick={() => handleDeleteConstruction(c.id)} style={{ background: "rgba(220,50,50,0.2)", border: "1px solid rgba(220,50,50,0.4)", borderRadius: 8, padding: "5px 10px", color: "#ff8080", fontSize: 12, cursor: "pointer", flexShrink: 0 }}>🗑️</button>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== DONATIONS SECTION ===== */}
              {adminSection === "donations" && (
                <div>
                  <div style={{ background: "rgba(255,215,0,0.07)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", marginBottom: 12 }}>➕ కొత్త విరాళం పద్ధతి జోడించు</div>
                    <input type="text" placeholder="ఐకాన్ emoji (ఉదా: 📱 🏦)" value={newDonation.icon} onChange={e => setNewDonation({ ...newDonation, icon: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="పేరు (ఉదా: UPI, బ్యాంక్)" value={newDonation.title} onChange={e => setNewDonation({ ...newDonation, title: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="నంబర్/అడ్రస్ (ఉదా: 9876543210@upi)" value={newDonation.value} onChange={e => setNewDonation({ ...newDonation, value: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <input type="text" placeholder="వివరణ (ఉదా: Google Pay ద్వారా)" value={newDonation.desc} onChange={e => setNewDonation({ ...newDonation, desc: e.target.value })} style={{ ...iSt, marginBottom: 8 }} />
                    <button onClick={handleAddDonation} style={{ width: "100%", padding: "11px", background: "linear-gradient(135deg, #e65100, #f57c00)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ జోడించు</button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#FFD700", marginBottom: 10 }}>✏️ ప్రస్తుత పద్ధతులు మార్చు</div>
                  {donationMethods.map((d) => (
                    <div key={d.id} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#FFD700" }}>{d.icon} {d.title}</span>
                        <button onClick={() => handleDeleteDonation(d.id)} style={{ background: "rgba(220,50,50,0.2)", border: "1px solid rgba(220,50,50,0.4)", borderRadius: 8, padding: "4px 8px", color: "#ff8080", fontSize: 11, cursor: "pointer" }}>🗑️</button>
                      </div>
                      <input type="text" value={d.value} onChange={e => handleUpdateDonation(d.id, "value", e.target.value)}
                        placeholder="నంబర్/అడ్రస్" style={{ ...iSt, marginBottom: 6, fontSize: 12 }} />
                      <input type="text" value={d.desc} onChange={e => handleUpdateDonation(d.id, "desc", e.target.value)}
                        placeholder="వివరణ" style={{ ...iSt, marginBottom: 0, fontSize: 12 }} />
                    </div>
                  ))}
                </div>
              )}

              {/* ===== WHATSAPP SECTION ===== */}
              {adminSection === "whatsapp" && (
                <div>
                  <div style={{ background: "rgba(37,211,102,0.08)", border: "1px solid rgba(37,211,102,0.3)", borderRadius: 14, padding: 16 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#25D366", marginBottom: 12 }}>🔗 WhatsApp గ్రూప్ లింక్</div>
                    <input type="text" value={whatsappLink} onChange={e => setWhatsappLink(e.target.value)}
                      placeholder="https://chat.whatsapp.com/..." style={{ ...iSt, marginBottom: 12 }} />
                    <button onClick={handleSaveWaLink} style={{ width: "100%", padding: "12px", background: "#25D366", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>✅ లింక్ సేవ్ చేయి</button>
                    <div style={{ marginTop: 12, padding: 12, background: "rgba(0,0,0,0.2)", borderRadius: 10, fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                      ప్రస్తుత లింక్:<br />
                      <span style={{ color: "#25D366", wordBreak: "break-all" }}>{whatsappLink}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Notice Modal */}
      {noticeModal && canPost && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "linear-gradient(135deg, #0d1b5e, #1a237e)", border: "1px solid rgba(100,150,255,0.4)", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#90caf9", marginBottom: 16 }}>📢 కొత్త నోటీసు</div>
            <input type="text" placeholder="శీర్షిక (Title)..." value={newNotice.title} onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
              style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(100,150,255,0.3)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "12px 14px", outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
            <textarea placeholder="నోటీసు వివరాలు..." value={newNotice.body} onChange={e => setNewNotice({ ...newNotice, body: e.target.value })} rows={4}
              style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(100,150,255,0.3)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "12px 14px", resize: "none", outline: "none", boxSizing: "border-box" }} />
            <label style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, cursor: "pointer" }}>
              <input type="checkbox" checked={newNotice.urgent} onChange={e => setNewNotice({ ...newNotice, urgent: e.target.checked })} style={{ width: 16, height: 16 }} />
              <span style={{ fontSize: 13, color: "#ffcdd2", fontWeight: 600 }}>⚠️ అత్యవసర నోటీసు గా గుర్తించండి</span>
            </label>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => setNoticeModal(false)} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>రద్దు</button>
              <button onClick={handleAddNotice} style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #1565c0, #0288d1)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📢 నోటీసు పోస్ట్ చేయి</button>
            </div>
          </div>
        </div>
      )}

      {/* Notices Panel Overlay */}
      {noticePanel && (
        <div style={{ position: "fixed", inset: 0, zIndex: 250, background: "rgba(0,0,0,0.85)", overflowY: "auto", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "20px 0" }}>
          <div style={{ background: "linear-gradient(135deg, #0d1b5e, #1a237e)", border: "1px solid rgba(100,150,255,0.35)", borderRadius: 20, padding: 24, width: "calc(100% - 40px)", maxWidth: 440 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#90caf9" }}>🔔 నోటిఫికేషన్స్</div>
              <button onClick={() => setNoticePanel(false)} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer" }}>✕</button>
            </div>
            {notices.length === 0 && (
              <div style={{ textAlign: "center", padding: 30, color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>ఇంకా నోటీసులు లేవు
              </div>
            )}
            {notices.map(n => (
              <div key={n.id} style={{ background: n.urgent ? "rgba(180,0,0,0.3)" : "rgba(255,255,255,0.05)", border: `1px solid ${n.urgent ? "rgba(255,80,80,0.4)" : "rgba(100,150,255,0.2)"}`, borderRadius: 14, padding: "12px 14px", marginBottom: 12, position: "relative" }}>
                {n.urgent && <div style={{ background: "#e74c3c", color: "#fff", fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 20, display: "inline-block", marginBottom: 6 }}>⚠️ అత్యవసరం</div>}
                <div style={{ fontSize: 13, fontWeight: 800, color: "#FFD700" }}>{n.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginTop: 6 }}>{n.body}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 6 }}>📅 {formatDate(n.date)}</div>
              </div>
            ))}
            <button onClick={() => { setNoticePanel(false); setActiveTab("notices"); }}
              style={{ width: "100%", marginTop: 8, padding: "11px", background: "rgba(100,150,255,0.15)", border: "1px solid rgba(100,150,255,0.3)", borderRadius: 10, color: "#90caf9", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              📢 అన్ని నోటీసులు చూడండి →
            </button>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {postModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ background: "linear-gradient(135deg, #4a0000, #7b0000)", border: "1px solid rgba(232,128,10,0.4)", borderRadius: "20px 20px 0 0", padding: 24, width: "100%", maxWidth: 480 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#f39c12", marginBottom: 16 }}>📝 కొత్త పోస్ట్</div>
            <textarea placeholder="నేటి నిర్మాణ వివరాలు రాయండి..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} rows={4}
              style={{ width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(232,128,10,0.3)", borderRadius: 10, color: "#fff", fontSize: 13, padding: "12px 14px", resize: "none", outline: "none", boxSizing: "border-box" }} />
            <input ref={galleryInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleImageFile(e.target.files[0])} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }} onChange={e => handleImageFile(e.target.files[0])} />
            <input ref={videoInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={e => handleVideoFile(e.target.files[0])} />
            {newPost.imagePreview && (
              <div style={{ position: "relative", marginTop: 12 }}>
                <img src={newPost.imagePreview} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 10, display: "block" }} />
                <button onClick={() => setNewPost({ ...newPost, imageBase64: "", imagePreview: "" })} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            )}
            {newPost.videoPreview && (
              <div style={{ position: "relative", marginTop: 12 }}>
                <video src={newPost.videoPreview} controls style={{ width: "100%", maxHeight: 200, borderRadius: 10, display: "block", background: "#000" }} />
                <button onClick={() => setNewPost({ ...newPost, videoBase64: "", videoPreview: "" })} style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "50%", width: 28, height: 28, color: "#fff", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button onClick={() => galleryInputRef.current?.click()} style={{ flex: 1, padding: "11px 8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(232,128,10,0.35)", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>🖼️ ఫోటో</button>
              <button onClick={() => cameraInputRef.current?.click()} style={{ flex: 1, padding: "11px 8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(232,128,10,0.35)", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>📷 కెమెరా</button>
              <button onClick={() => videoInputRef.current?.click()} style={{ flex: 1, padding: "11px 8px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(232,128,10,0.35)", borderRadius: 10, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>🎥 వీడియో</button>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => setPostModal(false)} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>రద్దు</button>
              <button onClick={handleAddPost} style={{ flex: 2, padding: "12px", background: "linear-gradient(135deg, #c0392b, #e67e22)", border: "none", borderRadius: 10, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>📤 పోస్ట్ చేయి → బ్లాగ్ కు సింక్</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onLike, onShare, onWhatsApp, onComment, commentInput, setCommentInput, onDelete }) {
  const [showComments, setShowComments] = useState(false);
  return (
    <div style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(232,128,10,0.25)", borderRadius: 16, overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 38, height: 38, background: "rgba(232,128,10,0.3)", borderRadius: 19, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{post.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{post.author}</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>{new Date(post.date).toLocaleDateString("te-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
        </div>
        {onDelete && <button onClick={onDelete} style={{ background: "rgba(220,50,50,0.2)", border: "none", borderRadius: 8, padding: "5px 10px", color: "#ff8080", fontSize: 12, cursor: "pointer" }}>🗑️</button>}
      </div>
      {post.image && <div style={{ width: "100%", maxHeight: 300, overflow: "hidden" }}><img src={post.image} alt="" style={{ width: "100%", objectFit: "cover", display: "block" }} /></div>}
      {post.video && (
        <div style={{ width: "100%", background: "#000" }}>
          <video src={post.video} controls playsInline style={{ width: "100%", maxHeight: 300, display: "block" }} />
        </div>
      )}
      <div style={{ padding: "12px 14px 8px", fontSize: 13, color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}>{post.content}</div>
      {post.blogLink && <div style={{ padding: "4px 14px 10px" }}><a href={post.blogLink} target="_blank" rel="noreferrer" style={{ color: "#f39c12", fontSize: 12, fontWeight: 600, textDecoration: "underline" }}>📖 బ్లాగ్ చదవండి →</a></div>}
      <div style={{ padding: "8px 14px 12px", display: "flex", gap: 8, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <ABt icon={post.liked ? "❤️" : "🤍"} label={`${post.likes}`} onClick={onLike} active={post.liked} />
        <ABt icon="💬" label={`${post.comments.length}`} onClick={() => setShowComments(!showComments)} />
        <ABt icon="📤" label="షేర్" onClick={onShare} />
        {onWhatsApp && <ABt icon="🟢" label="WhatsApp" onClick={onWhatsApp} />}
      </div>
      {showComments && (
        <div style={{ padding: "0 14px 14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {post.comments.map((c, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "8px 12px", marginBottom: 6, marginTop: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#e8800a" }}>{c.user}: </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>{c.text}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <input type="text" placeholder="కామెంట్ రాయండి..." value={commentInput} onChange={e => setCommentInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") onComment(commentInput); }}
              style={{ flex: 1, padding: "9px 12px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(232,128,10,0.3)", borderRadius: 10, color: "#fff", fontSize: 12, outline: "none" }} />
            <button onClick={() => onComment(commentInput)} style={{ background: "#e8800a", border: "none", borderRadius: 10, padding: "0 14px", color: "#fff", fontSize: 14, cursor: "pointer" }}>➤</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ABt({ icon, label, onClick, active }) {
  return (
    <button onClick={onClick} style={{ background: active ? "rgba(232,128,10,0.2)" : "rgba(255,255,255,0.06)", border: `1px solid ${active ? "rgba(232,128,10,0.5)" : "rgba(255,255,255,0.1)"}`, borderRadius: 8, padding: "7px 12px", color: active ? "#e8800a" : "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
      <span>{icon}</span><span>{label}</span>
    </button>
  );
}

const iSt = { width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(232,128,10,0.4)", borderRadius: 10, color: "#fff", fontSize: 13, marginBottom: 12, boxSizing: "border-box", outline: "none" };
