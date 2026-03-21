import React, { useState } from "react";
import {
  Box, Chip, Collapse, Typography, Link, Avatar, CircularProgress,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ArticleIcon from "@mui/icons-material/Article";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CodeIcon from "@mui/icons-material/Code";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { RESOURCES } from "../data/resources";

const DIFFICULTY_COLOR = {
  Easy:   { bg: "#D1FAE5", color: "#065F46" },
  Medium: { bg: "#FEF3C7", color: "#92400E" },
  Hard:   { bg: "#FEE2E2", color: "#991B1B" },
};
const TYPE_ICON = {
  video:       <PlayCircleIcon sx={{ fontSize: 14, color: "#EF4444" }} />,
  article:     <ArticleIcon   sx={{ fontSize: 14, color: "#3B82F6" }} />,
  interactive: <SportsEsportsIcon sx={{ fontSize: 14, color: "#8B5CF6" }} />,
  practice:    <CodeIcon      sx={{ fontSize: 14, color: "#10B981" }} />,
};
const TYPE_COLOR = {
  video:       { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  article:     { bg: "#EFF6FF", color: "#1D4ED8", border: "#BFDBFE" },
  interactive: { bg: "#F5F3FF", color: "#6D28D9", border: "#DDD6FE" },
  practice:    { bg: "#F0FDF4", color: "#15803D", border: "#BBF7D0" },
};

function findResource(topicName) {
  if (RESOURCES[topicName]) return RESOURCES[topicName];
  const prefix = topicName.split(" - ")[0].toLowerCase();
  const key = Object.keys(RESOURCES).find(k => k.toLowerCase().startsWith(prefix));
  return key ? RESOURCES[key] : null;
}

// ─── Smart topic-aware resource generator ────────────────────────────────────
// Detects subject domain from topic string and returns real, specific resources
function generateStepsForTopic(topicName) {
  const t = topicName.toLowerCase();
  const name = topicName.split(" - ")[0].trim();
  const detail = topicName.includes(" - ") ? topicName.split(" - ")[1].trim() : "";
  const q = encodeURIComponent(name);
  const qFull = encodeURIComponent(topicName);

  // ── MATHEMATICS ──────────────────────────────────────────────────────────
  if (t.match(/algebra|calculus|trigonometry|geometry|linear algebra|differential|integral|matrix|vector|probability|statistics|number system|fraction|decimal|percentage|equation|inequality|proof|discrete math|combinatorics|graph theory|set theory|sequence|series/)) {
    const khanQ = encodeURIComponent(name);
    return { steps: [
      { what: `Watch a clear explanation of ${name} with visual examples`,
        resource: { label: `3Blue1Brown – ${name} (Video)`, url: `https://www.youtube.com/results?search_query=3blue1brown+${q}`, type: "video" },
        problems: [{ label: `Khan Academy – ${name} exercises`, url: `https://www.khanacademy.org/search?page_search_query=${khanQ}`, difficulty: "Easy" }] },
      { what: `Study the theory and worked examples for ${name}`,
        resource: { label: `Khan Academy – ${name} (Interactive)`, url: `https://www.khanacademy.org/search?page_search_query=${khanQ}`, type: "interactive" },
        problems: [{ label: `Paul's Online Math Notes – ${name}`, url: `https://tutorial.math.lamar.edu`, difficulty: "Medium" }] },
      { what: `Solve practice problems to solidify ${name}`,
        resource: { label: `Brilliant.org – ${name}`, url: `https://brilliant.org/search/?q=${q}`, type: "interactive" },
        problems: [
          { label: `MIT OpenCourseWare – ${name} problem sets`, url: `https://ocw.mit.edu/search/?q=${q}`, difficulty: "Hard" },
          { label: `Wolfram MathWorld – ${name} reference`, url: `https://mathworld.wolfram.com/search/?query=${q}`, difficulty: "Medium" },
        ] },
    ]};
  }

  // ── PHYSICS ──────────────────────────────────────────────────────────────
  if (t.match(/kinematics|newton|force|energy|momentum|wave|optics|thermodynamics|electro|magnetic|quantum|relativity|nuclear|fluid|oscillation|rotational|astrophysics|particle physics|circuit|capacitor|resistor|current|voltage/)) {
    return { steps: [
      { what: `Understand the core concept of ${name} with intuitive visuals`,
        resource: { label: `Khan Academy – ${name} (Video)`, url: `https://www.khanacademy.org/search?page_search_query=${q}`, type: "video" },
        problems: [{ label: `Khan Academy – ${name} practice`, url: `https://www.khanacademy.org/search?page_search_query=${q}`, difficulty: "Easy" }] },
      { what: `Study derivations and equations for ${name}`,
        resource: { label: `HyperPhysics – ${name} (Article)`, url: `http://hyperphysics.phy-astr.gsu.edu/hbase/hframe.html`, type: "article" },
        problems: [{ label: `MIT OCW – ${name} problem sets`, url: `https://ocw.mit.edu/search/?q=${q}`, difficulty: "Medium" }] },
      { what: `Watch lecture-style deep dive into ${name}`,
        resource: { label: `Walter Lewin MIT Lectures (Video)`, url: `https://www.youtube.com/results?search_query=walter+lewin+${q}`, type: "video" },
        problems: [{ label: `Physics Classroom – ${name}`, url: `https://www.physicsclassroom.com/search?q=${q}`, difficulty: "Medium" }] },
    ]};
  }

  // ── CHEMISTRY ────────────────────────────────────────────────────────────
  if (t.match(/atom|periodic|bond|stoichiometry|acid|base|organic|reaction|kinetics|equilibrium|thermochem|electrochem|polymer|spectroscopy|mole|solution|oxidation|reduction|enthalpy|entropy|catalyst|isomer|functional group/)) {
    return { steps: [
      { what: `Learn the fundamentals of ${name} with clear explanations`,
        resource: { label: `Khan Academy – ${name} (Video)`, url: `https://www.khanacademy.org/search?page_search_query=${q}`, type: "video" },
        problems: [{ label: `Khan Academy – ${name} exercises`, url: `https://www.khanacademy.org/search?page_search_query=${q}`, difficulty: "Easy" }] },
      { what: `Study ${name} theory with worked examples`,
        resource: { label: `ChemLibreTexts – ${name} (Article)`, url: `https://chem.libretexts.org/search?q=${q}`, type: "article" },
        problems: [{ label: `Royal Society of Chemistry – ${name}`, url: `https://www.rsc.org/search/results/?q=${q}`, difficulty: "Medium" }] },
      { what: `Practice ${name} problems and reactions`,
        resource: { label: `Tyler DeWitt – ${name} (Video)`, url: `https://www.youtube.com/results?search_query=tyler+dewitt+${q}`, type: "video" },
        problems: [{ label: `ACS – ${name} practice problems`, url: `https://www.acs.org/search.html?q=${q}`, difficulty: "Hard" }] },
    ]};
  }

  // ── BIOLOGY ──────────────────────────────────────────────────────────────
  if (t.match(/cell|dna|rna|gene|protein|evolution|ecology|photosynthesis|mitosis|meiosis|organ|tissue|immune|neuron|bacteria|virus|enzyme|metabolism|chromosome|mutation|biodiversity|ecosystem|anatomy|physiology/)) {
    return { steps: [
      { what: `Understand ${name} with visual diagrams and animations`,
        resource: { label: `Amoeba Sisters – ${name} (Video)`, url: `https://www.youtube.com/results?search_query=amoeba+sisters+${q}`, type: "video" },
        problems: [{ label: `Khan Academy – ${name} exercises`, url: `https://www.khanacademy.org/search?page_search_query=${q}`, difficulty: "Easy" }] },
      { what: `Read a detailed explanation of ${name}`,
        resource: { label: `Khan Academy – ${name} (Article)`, url: `https://www.khanacademy.org/search?page_search_query=${q}`, type: "article" },
        problems: [{ label: `Biology Online – ${name}`, url: `https://www.biologyonline.com/search?q=${q}`, difficulty: "Medium" }] },
      { what: `Explore ${name} with interactive models`,
        resource: { label: `HHMI BioInteractive – ${name}`, url: `https://www.biointeractive.org/classroom-resources?search=${q}`, type: "interactive" },
        problems: [{ label: `CrashCourse Biology – ${name}`, url: `https://www.youtube.com/results?search_query=crashcourse+biology+${q}`, difficulty: "Easy" }] },
    ]};
  }

  // ── MUSIC / GUITAR / PIANO / INSTRUMENTS ─────────────────────────────────
  if (t.match(/guitar|piano|chord|scale|music theory|note|rhythm|melody|harmony|bass|drum|violin|ukulele|strumming|fingerpicking|arpeggio|barre|tab|sheet music|ear training|sight reading|composition|songwriting/)) {
    return { steps: [
      { what: `Learn ${name} step by step with structured lessons`,
        resource: { label: `JustinGuitar – ${name} (Video)`, url: `https://www.justinguitar.com/search?q=${q}`, type: "video" },
        problems: [{ label: `Ultimate Guitar – ${name} tabs & exercises`, url: `https://www.ultimate-guitar.com/search.php?search_type=title&value=${q}`, difficulty: "Easy" }] },
      { what: `Watch a focused tutorial on ${name}`,
        resource: { label: `YouTube – ${name} tutorial`, url: `https://www.youtube.com/results?search_query=${q}+lesson+tutorial`, type: "video" },
        problems: [{ label: `Musictheory.net – ${name} exercises`, url: `https://www.musictheory.net/exercises`, difficulty: "Medium" }] },
      { what: `Practice ${name} with interactive tools`,
        resource: { label: `Musictheory.net – ${name} (Interactive)`, url: `https://www.musictheory.net/lessons`, type: "interactive" },
        problems: [{ label: `Teoria – ${name} ear training`, url: `https://www.teoria.com/en/exercises/`, difficulty: "Medium" }] },
    ]};
  }

  // ── LANGUAGE LEARNING (Spanish, French, Japanese, etc.) ──────────────────
  if (t.match(/spanish|french|japanese|german|mandarin|chinese|arabic|hindi|portuguese|italian|korean|russian|urdu|grammar|vocabulary|pronunciation|conjugation|verb|noun|tense|reading comprehension|listening|speaking|writing|alphabet|kanji|hiragana|katakana|hanzi/)) {
    const lang = t.match(/spanish/) ? "spanish" : t.match(/french/) ? "french" : t.match(/japanese/) ? "japanese" : t.match(/german/) ? "german" : t.match(/mandarin|chinese/) ? "chinese" : t.match(/arabic/) ? "arabic" : t.match(/hindi/) ? "hindi" : t.match(/korean/) ? "korean" : "language";
    return { steps: [
      { what: `Learn ${name} with structured interactive lessons`,
        resource: { label: `Duolingo – ${lang} course (Interactive)`, url: `https://www.duolingo.com/course/${lang}/en/Learn-${lang}-Online`, type: "interactive" },
        problems: [{ label: `Clozemaster – ${name} practice`, url: `https://www.clozemaster.com/l/${lang}-from-en`, difficulty: "Easy" }] },
      { what: `Watch a focused lesson on ${name}`,
        resource: { label: `YouTube – ${name} lesson`, url: `https://www.youtube.com/results?search_query=${q}+lesson+for+beginners`, type: "video" },
        problems: [{ label: `Anki – ${name} flashcard deck`, url: `https://ankiweb.net/shared/decks/${lang}`, difficulty: "Easy" }] },
      { what: `Study ${name} grammar rules and examples`,
        resource: { label: `SpanishDict / WordReference – ${name} (Article)`, url: `https://www.spanishdict.com/guide`, type: "article" },
        problems: [{ label: `Language Transfer – ${lang} audio course`, url: `https://www.languagetransfer.org`, difficulty: "Medium" }] },
    ]};
  }

  // ── FINANCE & INVESTING ───────────────────────────────────────────────────
  if (t.match(/stock|invest|portfolio|budget|saving|compound interest|mutual fund|etf|bond|option|derivative|valuation|dcf|balance sheet|income statement|cash flow|p\/e|dividend|crypto|forex|tax|insurance|retirement|401k|ira|hedge fund|venture capital|ipo/)) {
    return { steps: [
      { what: `Understand ${name} with clear real-world examples`,
        resource: { label: `Investopedia – ${name} (Article)`, url: `https://www.investopedia.com/search#q=${q}`, type: "article" },
        problems: [{ label: `Investopedia – ${name} quiz`, url: `https://www.investopedia.com/search#q=${q}`, difficulty: "Easy" }] },
      { what: `Watch an in-depth explanation of ${name}`,
        resource: { label: `YouTube – ${name} explained`, url: `https://www.youtube.com/results?search_query=${q}+explained+finance`, type: "video" },
        problems: [{ label: `Khan Academy – ${name}`, url: `https://www.khanacademy.org/search?page_search_query=${q}`, difficulty: "Easy" }] },
      { what: `Apply ${name} with a practical exercise or simulation`,
        resource: { label: `Coursera – Finance courses (${name})`, url: `https://www.coursera.org/search?query=${q}`, type: "article" },
        problems: [{ label: `Wall Street Mojo – ${name} examples`, url: `https://www.wallstreetmojo.com/?s=${q}`, difficulty: "Medium" }] },
    ]};
  }

  // ── DESIGN (UI/UX, Graphic, Photography) ─────────────────────────────────
  if (t.match(/figma|wireframe|prototype|color theory|typography|layout|grid|composition|logo|brand|illustrator|photoshop|lightroom|aperture|shutter|iso|exposure|depth of field|portrait|landscape|retouching|mockup|design system|accessibility|wcag|user research|usability/)) {
    return { steps: [
      { what: `Learn ${name} with a hands-on tutorial`,
        resource: { label: `YouTube – ${name} tutorial`, url: `https://www.youtube.com/results?search_query=${q}+tutorial`, type: "video" },
        problems: [{ label: `Dribbble – ${name} inspiration`, url: `https://dribbble.com/search/${q}`, difficulty: "Easy" }] },
      { what: `Study the theory and principles behind ${name}`,
        resource: { label: `Nielsen Norman Group – ${name} (Article)`, url: `https://www.nngroup.com/search/?q=${q}`, type: "article" },
        problems: [{ label: `Figma Community – ${name} templates`, url: `https://www.figma.com/community/search?resource_type=files&q=${q}`, difficulty: "Medium" }] },
      { what: `Practice ${name} with a real project`,
        resource: { label: `Coursera – ${name} course`, url: `https://www.coursera.org/search?query=${q}`, type: "article" },
        problems: [{ label: `Behance – ${name} case studies`, url: `https://www.behance.net/search/projects?search=${q}`, difficulty: "Medium" }] },
    ]};
  }

  // ── VIDEO EDITING ─────────────────────────────────────────────────────────
  if (t.match(/premiere|after effects|davinci|color grade|lut|cut|transition|timeline|render|export|b-roll|j-cut|l-cut|motion graphic|lower third|chroma key|green screen|audio mix|sound design|frame rate|codec/)) {
    return { steps: [
      { what: `Learn ${name} with a step-by-step tutorial`,
        resource: { label: `YouTube – ${name} tutorial`, url: `https://www.youtube.com/results?search_query=${q}+tutorial+premiere+pro`, type: "video" },
        problems: [{ label: `Practice: apply ${name} to a short clip`, url: `https://www.youtube.com/results?search_query=${q}+exercise`, difficulty: "Easy" }] },
      { what: `Study ${name} techniques used by professionals`,
        resource: { label: `Premiere Pro Docs – ${name}`, url: `https://helpx.adobe.com/premiere-pro/using/search.html?q=${q}`, type: "article" },
        problems: [{ label: `Motion Array – ${name} templates`, url: `https://motionarray.com/search?q=${q}`, difficulty: "Medium" }] },
    ]};
  }

  // ── MARKETING & BUSINESS ─────────────────────────────────────────────────
  if (t.match(/seo|google ads|facebook ads|email marketing|content marketing|social media|funnel|conversion|analytics|brand|marketing|advertising|copywriting|growth hack|product market fit|startup|entrepreneur|pitch deck|business model|lean startup|mvp|customer discovery|fundraising|venture|scrum|agile|kanban|project management|stakeholder|risk management/)) {
    return { steps: [
      { what: `Learn ${name} fundamentals with a structured course`,
        resource: { label: `HubSpot Academy – ${name} (Free Course)`, url: `https://academy.hubspot.com/search?q=${q}`, type: "interactive" },
        problems: [{ label: `Google Digital Garage – ${name}`, url: `https://learndigital.withgoogle.com/digitalgarage/courses`, difficulty: "Easy" }] },
      { what: `Watch a practical breakdown of ${name}`,
        resource: { label: `YouTube – ${name} explained`, url: `https://www.youtube.com/results?search_query=${q}+explained`, type: "video" },
        problems: [{ label: `Neil Patel Blog – ${name}`, url: `https://neilpatel.com/?s=${q}`, difficulty: "Medium" }] },
      { what: `Apply ${name} with a real exercise or case study`,
        resource: { label: `Coursera – ${name} course`, url: `https://www.coursera.org/search?query=${q}`, type: "article" },
        problems: [{ label: `Harvard Business Review – ${name}`, url: `https://hbr.org/search?term=${q}`, difficulty: "Hard" }] },
    ]};
  }

  // ── HEALTH, FITNESS & MEDICINE ────────────────────────────────────────────
  if (t.match(/anatomy|physiology|nutrition|exercise|workout|yoga|meditation|mental health|first aid|cpr|pharmacology|disease|diagnosis|treatment|surgery|nursing|public health|epidemiology|biochemistry|pathology|cardiology|neurology|pediatrics|psychiatry/)) {
    return { steps: [
      { what: `Learn ${name} with clear medical explanations`,
        resource: { label: `Khan Academy Medicine – ${name} (Video)`, url: `https://www.khanacademy.org/search?page_search_query=${q}`, type: "video" },
        problems: [{ label: `Osmosis – ${name} flashcards`, url: `https://www.osmosis.org/search?q=${q}`, difficulty: "Easy" }] },
      { what: `Study ${name} in depth with clinical context`,
        resource: { label: `Medscape – ${name} (Article)`, url: `https://www.medscape.com/search/searchresults?q=${q}`, type: "article" },
        problems: [{ label: `Amboss – ${name} questions`, url: `https://www.amboss.com/us/search?q=${q}`, difficulty: "Medium" }] },
      { what: `Watch a lecture on ${name}`,
        resource: { label: `Ninja Nerd – ${name} (Video)`, url: `https://www.youtube.com/results?search_query=ninja+nerd+${q}`, type: "video" },
        problems: [{ label: `USMLE – ${name} practice`, url: `https://www.usmle.org`, difficulty: "Hard" }] },
    ]};
  }

  // ── LAW & SOCIAL SCIENCE ─────────────────────────────────────────────────
  if (t.match(/law|legal|contract|tort|criminal|constitutional|civil|property|intellectual property|copyright|trademark|patent|court|litigation|evidence|procedure|ethics|sociology|psychology|economics|political science|international relations|human rights|policy/)) {
    return { steps: [
      { what: `Understand the basics of ${name}`,
        resource: { label: `YouTube – ${name} explained`, url: `https://www.youtube.com/results?search_query=${q}+law+explained`, type: "video" },
        problems: [{ label: `Cornell Law School – ${name}`, url: `https://www.law.cornell.edu/search/site/${q}`, difficulty: "Easy" }] },
      { what: `Study ${name} with case examples and doctrine`,
        resource: { label: `Coursera – ${name} course`, url: `https://www.coursera.org/search?query=${q}`, type: "article" },
        problems: [{ label: `Quimbee – ${name} case briefs`, url: `https://www.quimbee.com/search?q=${q}`, difficulty: "Medium" }] },
      { what: `Read primary sources and landmark cases on ${name}`,
        resource: { label: `Google Scholar – ${name} cases`, url: `https://scholar.google.com/scholar?q=${q}+law`, type: "article" },
        problems: [{ label: `Bar prep – ${name} practice questions`, url: `https://www.themisbar.com`, difficulty: "Hard" }] },
    ]};
  }

  // ── PERSONAL DEVELOPMENT ─────────────────────────────────────────────────
  if (t.match(/habit|productivity|time management|goal setting|mindset|communication|public speaking|leadership|emotional intelligence|negotiation|networking|confidence|focus|deep work|journaling|stoicism|mindfulness|self discipline|motivation|creativity/)) {
    return { steps: [
      { what: `Learn the core principles of ${name}`,
        resource: { label: `YouTube – ${name} explained`, url: `https://www.youtube.com/results?search_query=${q}+how+to`, type: "video" },
        problems: [{ label: `Apply: 7-day ${name} challenge`, url: `https://www.youtube.com/results?search_query=${q}+challenge`, difficulty: "Easy" }] },
      { what: `Read the foundational book or guide on ${name}`,
        resource: { label: `Blinkist – ${name} book summary`, url: `https://www.blinkist.com/en/search#q=${q}`, type: "article" },
        problems: [{ label: `Coursera – ${name} course`, url: `https://www.coursera.org/search?query=${q}`, difficulty: "Medium" }] },
      { what: `Practice ${name} with a structured exercise`,
        resource: { label: `TED Talk – ${name}`, url: `https://www.ted.com/search?q=${q}`, type: "video" },
        problems: [{ label: `Track progress: journal for 2 weeks`, url: `https://www.youtube.com/results?search_query=${q}+practice`, difficulty: "Easy" }] },
    ]};
  }

  // ── ARTS (Drawing, Painting, Sculpting) ──────────────────────────────────
  if (t.match(/drawing|sketch|painting|watercolor|oil paint|acrylic|charcoal|perspective|shading|anatomy drawing|portrait drawing|landscape painting|color mixing|brush|canvas|sculpture|pottery|ceramics|printmaking|illustration|comic|manga/)) {
    return { steps: [
      { what: `Learn ${name} with a structured beginner tutorial`,
        resource: { label: `Proko – ${name} (Video)`, url: `https://www.youtube.com/results?search_query=proko+${q}`, type: "video" },
        problems: [{ label: `Practice: complete a ${name} exercise daily`, url: `https://www.youtube.com/results?search_query=${q}+exercise+practice`, difficulty: "Easy" }] },
      { what: `Study the theory and technique behind ${name}`,
        resource: { label: `Ctrl+Paint – ${name} (Video)`, url: `https://www.ctrlpaint.com/library`, type: "video" },
        problems: [{ label: `Drawabox – ${name} lessons`, url: `https://drawabox.com`, difficulty: "Medium" }] },
      { what: `Follow along with a full ${name} project`,
        resource: { label: `Skillshare / YouTube – ${name} full project`, url: `https://www.youtube.com/results?search_query=${q}+full+tutorial`, type: "video" },
        problems: [{ label: `Post your work on r/learnart for feedback`, url: `https://www.reddit.com/r/learnart`, difficulty: "Medium" }] },
    ]};
  }

  // ── COOKING & CULINARY ────────────────────────────────────────────────────
  if (t.match(/cooking|recipe|baking|knife|sauté|roast|grill|boil|steam|ferment|pastry|bread|sauce|spice|cuisine|meal prep|nutrition|food safety|plating|flavor|ingredient/)) {
    return { steps: [
      { what: `Learn the technique of ${name} with a clear demonstration`,
        resource: { label: `YouTube – ${name} technique`, url: `https://www.youtube.com/results?search_query=${q}+cooking+technique`, type: "video" },
        problems: [{ label: `Practice: cook ${name} 3 times this week`, url: `https://www.youtube.com/results?search_query=${q}+recipe`, difficulty: "Easy" }] },
      { what: `Understand the science and theory behind ${name}`,
        resource: { label: `Serious Eats – ${name} (Article)`, url: `https://www.seriouseats.com/search?q=${q}`, type: "article" },
        problems: [{ label: `Allrecipes – ${name} variations`, url: `https://www.allrecipes.com/search?q=${q}`, difficulty: "Medium" }] },
    ]};
  }

  // ── CYBERSECURITY ─────────────────────────────────────────────────────────
  if (t.match(/network|tcp|ip|dns|http|linux|bash|cryptography|encryption|hacking|penetration|vulnerability|malware|firewall|ctf|exploit|reverse engineer|forensics|wireshark|nmap|sql injection|xss|csrf|owasp|phishing|social engineering/)) {
    return { steps: [
      { what: `Learn ${name} with a hands-on lab`,
        resource: { label: `TryHackMe – ${name} room`, url: `https://tryhackme.com/hacktivities?q=${q}`, type: "interactive" },
        problems: [{ label: `HackTheBox – ${name} challenge`, url: `https://www.hackthebox.com`, difficulty: "Medium" }] },
      { what: `Study the theory behind ${name}`,
        resource: { label: `YouTube – ${name} explained`, url: `https://www.youtube.com/results?search_query=${q}+cybersecurity+explained`, type: "video" },
        problems: [{ label: `PortSwigger Web Academy – ${name}`, url: `https://portswigger.net/web-security/all-topics`, difficulty: "Hard" }] },
      { what: `Read documentation and write-ups on ${name}`,
        resource: { label: `OWASP – ${name} (Article)`, url: `https://owasp.org/www-community/attacks/`, type: "article" },
        problems: [{ label: `CTFtime – ${name} challenges`, url: `https://ctftime.org`, difficulty: "Hard" }] },
    ]};
  }

  // ── CLOUD COMPUTING ───────────────────────────────────────────────────────
  if (t.match(/aws|azure|gcp|cloud|docker|kubernetes|serverless|lambda|ec2|s3|iam|vpc|terraform|ci\/cd|devops|container|microservice|load balancer|auto scaling|monitoring|cloudwatch|helm|istio/)) {
    return { steps: [
      { what: `Learn ${name} with official hands-on labs`,
        resource: { label: `AWS Skill Builder – ${name}`, url: `https://explore.skillbuilder.aws/learn/catalog?searchText=${q}`, type: "interactive" },
        problems: [{ label: `AWS Free Tier – practice ${name}`, url: `https://aws.amazon.com/free`, difficulty: "Easy" }] },
      { what: `Watch a practical tutorial on ${name}`,
        resource: { label: `YouTube – ${name} tutorial`, url: `https://www.youtube.com/results?search_query=${q}+aws+tutorial`, type: "video" },
        problems: [{ label: `A Cloud Guru – ${name} course`, url: `https://acloudguru.com/search?q=${q}`, difficulty: "Medium" }] },
      { what: `Read the official documentation for ${name}`,
        resource: { label: `AWS Docs – ${name}`, url: `https://docs.aws.amazon.com/search/doc-search.html?searchPath=documentation&searchQuery=${q}`, type: "article" },
        problems: [{ label: `AWS Certification practice – ${name}`, url: `https://aws.amazon.com/certification/`, difficulty: "Hard" }] },
    ]};
  }

  // ── DATA SCIENCE ─────────────────────────────────────────────────────────
  if (t.match(/pandas|numpy|matplotlib|seaborn|jupyter|sql|tableau|power bi|hypothesis|a\/b test|feature engineering|regression analysis|classification|clustering|time series|big data|spark|etl|data warehouse|data lake|mlflow|pipeline/)) {
    return { steps: [
      { what: `Learn ${name} with an interactive notebook`,
        resource: { label: `Kaggle Learn – ${name} (Interactive)`, url: `https://www.kaggle.com/learn`, type: "interactive" },
        problems: [{ label: `Kaggle – ${name} dataset exercise`, url: `https://www.kaggle.com/search?q=${q}`, difficulty: "Easy" }] },
      { what: `Watch a practical tutorial on ${name}`,
        resource: { label: `YouTube – ${name} tutorial`, url: `https://www.youtube.com/results?search_query=${q}+data+science+tutorial`, type: "video" },
        problems: [{ label: `Mode Analytics – ${name} SQL tutorial`, url: `https://mode.com/sql-tutorial/`, difficulty: "Medium" }] },
      { what: `Read the official docs or a deep-dive article on ${name}`,
        resource: { label: `Towards Data Science – ${name}`, url: `https://towardsdatascience.com/search?q=${q}`, type: "article" },
        problems: [{ label: `Leetcode – ${name} SQL problems`, url: `https://leetcode.com/problemset/database/`, difficulty: "Medium" }] },
    ]};
  }

  // ── MACHINE LEARNING (catch-all for ML topics not in resources.js) ────────
  if (t.match(/random forest|svm|support vector|k-means|pca|naive bayes|knn|gradient boost|xgboost|neural network|deep learning|cnn|rnn|lstm|transformer|bert|nlp|computer vision|reinforcement|transfer learning|model deploy|confusion matrix|precision|recall|f1/)) {
    return { steps: [
      { what: `Understand ${name} intuitively before the math`,
        resource: { label: `StatQuest – ${name} (Video)`, url: `https://www.youtube.com/results?search_query=statquest+${q}`, type: "video" },
        problems: [{ label: `Kaggle – ${name} notebook`, url: `https://www.kaggle.com/search?q=${q}`, difficulty: "Easy" }] },
      { what: `Implement ${name} from scratch or with scikit-learn`,
        resource: { label: `Scikit-learn Docs – ${name}`, url: `https://scikit-learn.org/stable/search.html?q=${q}`, type: "article" },
        problems: [{ label: `Kaggle competition using ${name}`, url: `https://www.kaggle.com/competitions`, difficulty: "Medium" }] },
      { what: `Watch a full lecture on ${name}`,
        resource: { label: `Andrew Ng – ${name} (Video)`, url: `https://www.youtube.com/results?search_query=andrew+ng+${q}`, type: "video" },
        problems: [{ label: `Papers With Code – ${name}`, url: `https://paperswithcode.com/search?q_meta=&q_type=&q=${q}`, difficulty: "Hard" }] },
    ]};
  }

  // ── JAVASCRIPT / WEB DEV (catch-all) ─────────────────────────────────────
  if (t.match(/javascript|typescript|node|express|react|vue|angular|next\.js|webpack|babel|npm|yarn|api|rest|graphql|websocket|css|html|tailwind|bootstrap|dom|event|promise|async|closure|prototype|module|testing|jest|cypress|deployment|vercel|netlify/)) {
    return { steps: [
      { what: `Learn ${name} with a focused tutorial`,
        resource: { label: `javascript.info – ${name} (Article)`, url: `https://javascript.info/search?query=${q}`, type: "article" },
        problems: [{ label: `freeCodeCamp – ${name} exercises`, url: `https://www.freecodecamp.org/learn`, difficulty: "Easy" }] },
      { what: `Watch a practical coding walkthrough of ${name}`,
        resource: { label: `Traversy Media – ${name} (Video)`, url: `https://www.youtube.com/results?search_query=traversy+media+${q}`, type: "video" },
        problems: [{ label: `Build a mini project using ${name}`, url: `https://www.frontendmentor.io/challenges`, difficulty: "Medium" }] },
      { what: `Read the official MDN documentation for ${name}`,
        resource: { label: `MDN Web Docs – ${name}`, url: `https://developer.mozilla.org/en-US/search?q=${q}`, type: "article" },
        problems: [{ label: `LeetCode – ${name} related problems`, url: `https://leetcode.com/problemset/all/?search=${q}`, difficulty: "Medium" }] },
    ]};
  }

  // ── PYTHON (catch-all) ────────────────────────────────────────────────────
  if (t.match(/python|function|scope|list|tuple|dict|set|string|file|exception|module|package|generator|iterator|comprehension|async|metaclass|decorator|closure|testing|pytest|unittest|performance|memory|design pattern/)) {
    return { steps: [
      { what: `Learn ${name} with a clear Python tutorial`,
        resource: { label: `Real Python – ${name} (Article)`, url: `https://realpython.com/search?q=${q}`, type: "article" },
        problems: [{ label: `HackerRank – ${name} Python challenge`, url: `https://www.hackerrank.com/domains/python`, difficulty: "Easy" }] },
      { what: `Watch a hands-on coding video on ${name}`,
        resource: { label: `Corey Schafer – ${name} (Video)`, url: `https://www.youtube.com/results?search_query=corey+schafer+python+${q}`, type: "video" },
        problems: [{ label: `LeetCode – ${name} problems`, url: `https://leetcode.com/problemset/all/?search=${q}`, difficulty: "Medium" }] },
      { what: `Read the official Python docs for ${name}`,
        resource: { label: `Python Docs – ${name}`, url: `https://docs.python.org/3/search.html?q=${q}`, type: "article" },
        problems: [{ label: `Exercism – Python ${name} track`, url: `https://exercism.org/tracks/python/exercises`, difficulty: "Medium" }] },
    ]};
  }

  // ── GENERIC FALLBACK (any subject not matched above) ─────────────────────
  return { steps: [
    { what: `Watch a focused introduction to ${name}`,
      resource: { label: `YouTube – ${name} beginner tutorial`, url: `https://www.youtube.com/results?search_query=${q}+beginner+tutorial`, type: "video" },
      problems: [{ label: `Practice: find a beginner exercise for ${name}`, url: `https://www.google.com/search?q=${q}+beginner+exercises`, difficulty: "Easy" }] },
    { what: `Read a structured guide or course on ${name}`,
      resource: { label: `Coursera – ${name} courses`, url: `https://www.coursera.org/search?query=${q}`, type: "article" },
      problems: [{ label: `Khan Academy – ${name}`, url: `https://www.khanacademy.org/search?page_search_query=${q}`, difficulty: "Easy" }] },
    { what: `Go deeper with an advanced resource on ${name}`,
      resource: { label: `edX – ${name} courses`, url: `https://www.edx.org/search?q=${q}`, type: "article" },
      problems: [
        { label: `GitHub – ${name} projects to study`, url: `https://github.com/search?q=${q}&type=repositories&s=stars`, difficulty: "Medium" },
        { label: `Reddit – r/learnprogramming or related community`, url: `https://www.reddit.com/search/?q=${q}+learn`, difficulty: "Easy" },
      ] },
  ]};
}

export default function ResourcePanel({ topicName }) {
  const [open, setOpen] = useState(false);
  const [aiData, setAiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const catalogData = findResource(topicName);
  // Use catalog data if available, otherwise use AI data or fallback
  const data = catalogData || aiData || generateStepsForTopic(topicName);
  const isAI = !catalogData && !!aiData;

  const handleOpen = async () => {
    const next = !open;
    setOpen(next);
    // Fetch from Gemini only if not already fetched and no catalog data
    if (next && !catalogData && !aiData && !loading) {
      setLoading(true);
      setError(false);
      try {
        const subject = topicName.includes(" - ") ? topicName.split(" - ")[0] : "";
        const res = await fetch(
          `http://localhost:5001/api/resources?topic=${encodeURIComponent(topicName)}&subject=${encodeURIComponent(subject)}`
        );
        if (!res.ok) throw new Error("API error");
        const json = await res.json();
        if (json.steps) setAiData(json);
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box sx={{ mt: 1 }} onClick={e => e.stopPropagation()}>
      <Chip
        size="small"
        icon={open ? <ExpandLessIcon sx={{ fontSize: "14px !important" }} /> : <ExpandMoreIcon sx={{ fontSize: "14px !important" }} />}
        label={open ? "Hide Resources" : "📚 View Resources & Steps"}
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          background: open ? "#EFF6FF" : "#F0FDF4",
          color: open ? "#1D4ED8" : "#15803D",
          fontWeight: 600,
          fontSize: "0.72rem",
          border: `1px solid ${open ? "#BFDBFE" : "#BBF7D0"}`,
          "&:hover": { opacity: 0.85 },
        }}
      />

      <Collapse in={open}>
        <Box sx={{ mt: 1.5, borderRadius: 2, border: "1px solid #E2E8F0", overflow: "hidden" }}>

          {isAI && (
            <Box sx={{ px: 2, py: 1, background: "#EFF6FF", borderBottom: "1px solid #BFDBFE" }}>
              <Typography variant="caption" sx={{ color: "#1D4ED8", fontWeight: 600 }}>
                ✨ AI-generated resources by Gemini — tailored for this topic
              </Typography>
            </Box>
          )}

          {loading && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Generating resources with Gemini AI...
              </Typography>
            </Box>
          )}

          {error && (
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="caption" sx={{ color: "#DC2626" }}>
                Could not load AI resources. Showing curated fallback below.
              </Typography>
            </Box>
          )}

          {!loading && data.steps.map((step, i) => (
            <Box key={i} sx={{ p: 2, background: i % 2 === 0 ? "#FAFBFC" : "#FFFFFF", borderBottom: i < data.steps.length - 1 ? "1px solid #F1F5F9" : "none" }}>

              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 1.5 }}>
                <Avatar sx={{ width: 22, height: 22, fontSize: "0.7rem", fontWeight: 700, background: "#0F766E", flexShrink: 0, mt: 0.2 }}>
                  {i + 1}
                </Avatar>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#1E293B", lineHeight: 1.5 }}>
                  {step.what}
                </Typography>
              </Box>

              <Box sx={{ ml: 4, mb: step.problems?.length ? 1.5 : 0 }}>
                <Link href={step.resource.url} target="_blank" rel="noopener noreferrer" underline="none">
                  <Box sx={{
                    display: "inline-flex", alignItems: "center", gap: 0.8,
                    px: 1.5, py: 0.6, borderRadius: 1.5,
                    background: TYPE_COLOR[step.resource.type]?.bg || "#F8FAFC",
                    border: `1px solid ${TYPE_COLOR[step.resource.type]?.border || "#E2E8F0"}`,
                    "&:hover": { opacity: 0.8 },
                  }}>
                    {TYPE_ICON[step.resource.type] || <ArticleIcon sx={{ fontSize: 14 }} />}
                    <Typography variant="caption" sx={{ fontWeight: 600, color: TYPE_COLOR[step.resource.type]?.color || "#475569" }}>
                      {step.resource.label}
                    </Typography>
                  </Box>
                </Link>
              </Box>

              {step.problems?.length > 0 && (
                <Box sx={{ ml: 4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: 0.5, display: "block", mb: 0.8 }}>
                    Practice
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8 }}>
                    {step.problems.map((p, pi) => (
                      <Link key={pi} href={p.url} target="_blank" rel="noopener noreferrer" underline="none">
                        <Box sx={{
                          display: "inline-flex", alignItems: "center", gap: 0.6,
                          px: 1.2, py: 0.4, borderRadius: 1.5,
                          background: "#F8FAFC", border: "1px solid #E2E8F0",
                          "&:hover": { background: "#F1F5F9" },
                        }}>
                          <CodeIcon sx={{ fontSize: 12, color: "#7C3AED" }} />
                          <Typography variant="caption" sx={{ color: "#1E293B", fontWeight: 500 }}>
                            {p.label}
                          </Typography>
                          {p.difficulty && (
                            <Box sx={{
                              px: 0.8, py: 0.1, borderRadius: 1,
                              background: DIFFICULTY_COLOR[p.difficulty]?.bg,
                              color: DIFFICULTY_COLOR[p.difficulty]?.color,
                              fontSize: "0.62rem", fontWeight: 700,
                            }}>
                              {p.difficulty}
                            </Box>
                          )}
                        </Box>
                      </Link>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
