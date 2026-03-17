// ─────────────────────────────────────────────────────────────────────────────
// SUBJECTS CATALOG
// Every subject has: emoji, fullName, description, category, Beginner[], Intermediate[], Advanced[]
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: "all",        label: "All Fields",          emoji: "🌍" },
  { id: "tech",       label: "Technology",           emoji: "💻" },
  { id: "design",     label: "Design & Creative",    emoji: "🎨" },
  { id: "business",   label: "Business & Finance",   emoji: "📈" },
  { id: "science",    label: "Science & Math",       emoji: "🔬" },
  { id: "language",   label: "Languages",            emoji: "🗣️" },
  { id: "health",     label: "Health & Medicine",    emoji: "🏥" },
  { id: "arts",       label: "Arts & Music",         emoji: "🎵" },
  { id: "law",        label: "Law & Social Science", emoji: "⚖️" },
  { id: "personal",   label: "Personal Development", emoji: "🌱" },
];

export const SUBJECTS_DB = {

  // ══════════════════════════════════════════════════════════════
  // TECHNOLOGY
  // ══════════════════════════════════════════════════════════════
  "DSA": {
    emoji: "📊", category: "tech",
    fullName: "Data Structures & Algorithms",
    description: "Master CS fundamentals — arrays, graphs, DP, and beyond",
    Beginner:     ["Arrays & Strings - Indexing, searching, sorting basics","Linked Lists - Singly linked list, operations","Stacks & Queues - LIFO/FIFO operations","Hash Tables - Hashing, collision handling","Sorting Basics - Bubble, selection, insertion sort","Big O Notation - Time & space complexity analysis"],
    Intermediate: ["Binary Search Trees - BST operations, traversals","Graphs & BFS/DFS - Graph representations, traversals","Dynamic Programming Intro - Memoization basics","Greedy Algorithms - Activity selection, fractional knapsack","Backtracking - N-Queens, permutations, combinations","Heaps & Priority Queues - Min/Max heap implementation"],
    Advanced:     ["Advanced DP - Longest subsequences, matrix chain multiplication","Network Flow - Max flow, Ford-Fulkerson algorithm","Segment Trees - Range queries, updates","Tries & String Matching - KMP, Rabin-Karp algorithms","NP-Complete Problems - Recognition & approximation","Graph Algorithms - Dijkstra, Floyd-Warshall, Bellman-Ford"],
  },
  "Python": {
    emoji: "🐍", category: "tech",
    fullName: "Python Programming",
    description: "From syntax basics to async, OOP, and performance",
    Beginner:     ["Syntax & Variables - Data types, variable assignment","Control Flow - if/else statements, loops (for, while)","Functions & Scope - Function definition, parameters, return values","Data Types - Lists, tuples, dictionaries, sets","String Operations - String methods, f-strings, formatting","File I/O - Reading, writing, file operations"],
    Intermediate: ["OOP Basics - Classes, objects, inheritance, polymorphism","Modules & Packages - Import system, creating modules","Exception Handling - Try-except blocks, custom exceptions","Decorators & Closures - Function decorators, nested functions","Generators & Iterators - yield keyword, generator functions","List Comprehensions - Concise list creation, nested comprehensions"],
    Advanced:     ["Async Programming - asyncio, async/await, event loops","Metaclasses - Class creation, __new__, __init__","Performance Optimization - Profiling, caching, optimization","Testing & Debugging - unittest, pytest, debugging techniques","Design Patterns - Singleton, Factory, Observer, Strategy","Memory Management - Garbage collection, optimization tips"],
  },
  "Web Dev": {
    emoji: "🌐", category: "tech",
    fullName: "Web Development",
    description: "Full-stack web — HTML, CSS, JS, React, APIs, deployment",
    Beginner:     ["HTML Basics - Semantic HTML, forms, accessibility","CSS Styling - Flexbox, Grid, responsive design","JavaScript Fundamentals - Variables, functions, DOM","DOM Manipulation - querySelector, event listeners","Forms & Validation - Form handling, client-side validation","Responsive Design - Media queries, mobile-first approach"],
    Intermediate: ["React Hooks - useState, useEffect, custom hooks","Component Architecture - Composition, reusable components","REST APIs - Fetch API, axios, error handling","Routing - React Router, navigation, params","CSS Frameworks - Tailwind CSS, Bootstrap integration","Local Storage & Session - Browser storage APIs"],
    Advanced:     ["Performance Optimization - Code splitting, lazy loading, memoization","Testing - Jest, React Testing Library, E2E testing","Deployment - Vercel, Netlify, GitHub Pages, CI/CD","Security - CORS, XSS prevention, CSRF tokens, authentication","Advanced Patterns - HOC, Render Props, Compound Components","Server-Side Rendering - Next.js, SSR concepts"],
  },
  "Machine Learning": {
    emoji: "🤖", category: "tech",
    fullName: "Machine Learning & AI",
    description: "ML fundamentals to deep learning, NLP, and model deployment",
    Beginner:     ["Python for ML - NumPy arrays, Pandas dataframes","Data Preprocessing - Cleaning, handling missing values","Exploratory Data Analysis - Statistics, visualization","Linear Regression - Cost function, gradient descent","Logistic Regression - Binary classification, probability","Decision Trees - Tree construction, pruning, visualization"],
    Intermediate: ["Random Forests - Ensemble methods, bagging, feature importance","K-Means Clustering - Unsupervised learning, centroid updates","Principal Component Analysis - Dimensionality reduction","Support Vector Machines - Kernel methods, margin maximization","Neural Networks Basics - Perceptron, backpropagation","Model Evaluation - Confusion matrix, precision, recall, F1-score"],
    Advanced:     ["Deep Learning - CNNs for image recognition, RNNs for sequences","Natural Language Processing - Tokenization, embeddings, BERT","Computer Vision - Image classification, object detection","Reinforcement Learning - Q-learning, policy gradient","Transfer Learning - Pre-trained models, fine-tuning","Model Deployment - TensorFlow Serving, containerization"],
  },
  "JavaScript": {
    emoji: "⚡", category: "tech",
    fullName: "JavaScript Mastery",
    description: "ES6+, async patterns, closures, event loop, and design patterns",
    Beginner:     ["Variables & Scope - var, let, const, block scope","Data Types & Operators - Primitives, type coercion","Functions & Arrow Functions - Function declarations, arrow syntax","Objects & Arrays - Object methods, array manipulation","DOM & Events - Event handling, event delegation","Promise Basics - Promise creation, then/catch chaining"],
    Intermediate: ["Async/Await - Async functions, error handling with try-catch","Closures & Hoisting - Variable hoisting, closure patterns","Prototypes & Inheritance - Prototype chain, constructor functions","Modules - ES6 import/export, module patterns","Error Handling - Custom errors, error stack traces","Regular Expressions - Regex patterns, exec, match, replace"],
    Advanced:     ["Advanced Closures - Module pattern, data privacy","Event Loop & Microtasks - Execution context, call stack","Web Workers - Multi-threading in JavaScript","Memory Leaks - Detecting and preventing memory issues","Design Patterns - Singleton, Observer, Module pattern","Advanced Async - Race conditions, concurrent operations"],
  },
  "React": {
    emoji: "⚛️", category: "tech",
    fullName: "React & Frontend",
    description: "Hooks, context, performance, testing, and advanced patterns",
    Beginner:     ["JSX & Components - Function components, JSX syntax","Props & State - Component props, useState hook","Hooks (useState, useEffect) - Managing component lifecycle","Conditional Rendering - if/else, ternary, logical AND","Lists & Keys - Rendering lists, key prop importance","Form Handling - Controlled components, input handling"],
    Intermediate: ["Context API - Creating context, useContext hook","Custom Hooks - Building reusable hooks, hook rules","useReducer - Complex state management, reducer pattern","Performance Optimization - useMemo, useCallback, React.memo","Code Splitting - Dynamic imports, lazy loading","Error Boundaries - Error handling in components"],
    Advanced:     ["Advanced Patterns - HOC, Render Props, composition","Server Components - RSC concepts, async components","Suspense & Lazy Loading - Code splitting, data fetching","Concurrent Features - Transitions, startTransition","React Testing - Component testing, hooks testing","State Management - Redux, Zustand, Jotai integration"],
  },
  "Cybersecurity": {
    emoji: "🔐", category: "tech",
    fullName: "Cybersecurity",
    description: "Network security, ethical hacking, cryptography, and defense",
    Beginner:     ["Networking Basics - TCP/IP, DNS, HTTP, OSI model","Linux CLI - File system, permissions, bash scripting","Cryptography Intro - Symmetric, asymmetric, hashing","Web Security Basics - OWASP Top 10, common vulnerabilities","Password Security - Hashing, salting, credential attacks","Social Engineering - Phishing, pretexting, awareness"],
    Intermediate: ["Penetration Testing - Methodology, tools, reporting","Network Scanning - Nmap, Wireshark, traffic analysis","Web App Attacks - SQL injection, XSS, CSRF exploitation","Malware Analysis - Static & dynamic analysis basics","Firewalls & IDS - Configuration, rules, monitoring","CTF Challenges - Capture the Flag problem solving"],
    Advanced:     ["Exploit Development - Buffer overflows, shellcode","Reverse Engineering - Disassembly, decompilation, IDA Pro","Advanced Persistent Threats - APT tactics, lateral movement","Forensics - Disk, memory, network forensics","Red Team vs Blue Team - Attack simulation, incident response","Zero-Day Research - Vulnerability discovery, responsible disclosure"],
  },
  "Cloud Computing": {
    emoji: "☁️", category: "tech",
    fullName: "Cloud Computing",
    description: "AWS, GCP, Azure — infrastructure, containers, and serverless",
    Beginner:     ["Cloud Concepts - IaaS, PaaS, SaaS, shared responsibility","AWS Core Services - EC2, S3, IAM, VPC basics","Networking in Cloud - Subnets, security groups, load balancers","Storage Types - Object, block, file storage","CLI & SDKs - AWS CLI, cloud shell basics","Billing & Cost Management - Pricing models, cost explorer"],
    Intermediate: ["Containers - Docker, ECS, container registries","Serverless - Lambda, API Gateway, event-driven architecture","Databases in Cloud - RDS, DynamoDB, Aurora","CI/CD Pipelines - CodePipeline, GitHub Actions, deployments","Monitoring - CloudWatch, logging, alerting","Infrastructure as Code - Terraform, CloudFormation basics"],
    Advanced:     ["Kubernetes - EKS, pod scheduling, Helm charts","Multi-Region Architecture - Failover, replication, latency","Security & Compliance - IAM policies, encryption, auditing","Cost Optimization - Reserved instances, spot, rightsizing","Service Mesh - Istio, Envoy, traffic management","Cloud-Native Design - 12-factor apps, microservices patterns"],
  },
  "Data Science": {
    emoji: "📉", category: "tech",
    fullName: "Data Science",
    description: "Statistics, data wrangling, visualization, and storytelling with data",
    Beginner:     ["Statistics Basics - Mean, median, variance, distributions","Python for Data - Pandas, NumPy, Jupyter notebooks","Data Cleaning - Missing values, duplicates, type casting","Data Visualization - Matplotlib, Seaborn, chart types","SQL Basics - SELECT, WHERE, JOIN, GROUP BY","Probability - Events, Bayes theorem, conditional probability"],
    Intermediate: ["Hypothesis Testing - t-test, chi-square, p-values","Feature Engineering - Encoding, scaling, selection","Regression Analysis - Linear, polynomial, regularization","Classification Models - Logistic regression, KNN, Naive Bayes","Dashboard Building - Tableau, Power BI, Plotly Dash","A/B Testing - Experiment design, statistical significance"],
    Advanced:     ["Time Series Analysis - ARIMA, seasonality, forecasting","Advanced SQL - Window functions, CTEs, query optimization","Big Data Tools - Spark, Hadoop, distributed computing","Causal Inference - Difference-in-differences, IV methods","ML Pipelines - Scikit-learn pipelines, MLflow tracking","Data Engineering - ETL, data lakes, warehouse design"],
  },

  // ══════════════════════════════════════════════════════════════
  // DESIGN & CREATIVE
  // ══════════════════════════════════════════════════════════════
  "UI/UX Design": {
    emoji: "🎨", category: "design",
    fullName: "UI/UX Design",
    description: "User research, wireframing, prototyping, and design systems",
    Beginner:     ["Design Principles - Balance, contrast, hierarchy, alignment","Color Theory - Color wheel, palettes, psychology of color","Typography - Typefaces, pairing, readability, scale","Wireframing - Low-fidelity sketches, layout planning","User Research - Interviews, surveys, empathy mapping","Figma Basics - Frames, components, auto-layout"],
    Intermediate: ["Prototyping - Interactive flows, micro-interactions in Figma","Usability Testing - Test plans, moderated sessions, analysis","Information Architecture - Sitemaps, card sorting, navigation","Design Systems - Component libraries, tokens, documentation","Accessibility - WCAG guidelines, contrast ratios, screen readers","Mobile Design - iOS/Android guidelines, touch targets"],
    Advanced:     ["Motion Design - Transitions, animation principles, After Effects","Design Ops - Handoff workflows, design tokens, versioning","Advanced Research - Diary studies, contextual inquiry","Service Design - Journey maps, blueprints, touchpoints","Data-Driven Design - Analytics, heatmaps, conversion optimization","Design Leadership - Critique, mentoring, strategy"],
  },
  "Graphic Design": {
    emoji: "🖌️", category: "design",
    fullName: "Graphic Design",
    description: "Visual communication — logos, branding, print, and digital media",
    Beginner:     ["Design Elements - Line, shape, texture, space","Adobe Illustrator Basics - Shapes, paths, pen tool","Adobe Photoshop Basics - Layers, masks, adjustments","Logo Design - Concepts, sketching, vector creation","Typography Fundamentals - Fonts, kerning, leading","Color Modes - RGB, CMYK, Pantone, color profiles"],
    Intermediate: ["Brand Identity - Logo systems, brand guidelines, consistency","Layout Design - Grid systems, white space, hierarchy","Print Design - Bleed, resolution, file formats for print","Photo Editing - Retouching, compositing, color grading","Packaging Design - Dielines, 3D mockups, print specs","Infographic Design - Data visualization, storytelling"],
    Advanced:     ["Motion Graphics - After Effects, kinetic typography","Brand Strategy - Positioning, audience, competitive analysis","Editorial Design - Magazine layouts, book design, InDesign","Environmental Design - Signage, wayfinding, large format","Portfolio Development - Case studies, presentation, pitching","Freelance & Client Work - Briefs, contracts, revisions"],
  },
  "Video Editing": {
    emoji: "🎬", category: "design",
    fullName: "Video Editing & Production",
    description: "From raw footage to polished video — editing, color, and sound",
    Beginner:     ["Video Basics - Frame rate, resolution, codecs, formats","Premiere Pro Basics - Timeline, cuts, transitions","Audio Editing - Levels, noise reduction, syncing","Color Correction - Exposure, white balance, basic grading","Exporting - Render settings, YouTube/Instagram specs","Storytelling - Shot types, pacing, narrative structure"],
    Intermediate: ["Advanced Cuts - J-cut, L-cut, match cut techniques","Color Grading - LUTs, DaVinci Resolve, cinematic looks","Motion Graphics - Lower thirds, titles in After Effects","Sound Design - Music selection, SFX, mixing basics","Multi-cam Editing - Syncing, switching, workflow","Green Screen - Chroma key, compositing, edge refinement"],
    Advanced:     ["Visual Effects - Tracking, compositing, VFX basics","Advanced Color Science - HDR, color spaces, ACES workflow","Documentary Editing - Interview structure, b-roll strategy","Cinematic Techniques - Lens choices, lighting for video","YouTube/Content Strategy - Thumbnails, retention, analytics","Freelance Video Work - Client briefs, delivery, pricing"],
  },
  "Photography": {
    emoji: "📷", category: "design",
    fullName: "Photography",
    description: "Camera fundamentals, composition, lighting, and post-processing",
    Beginner:     ["Camera Basics - Aperture, shutter speed, ISO triangle","Composition Rules - Rule of thirds, leading lines, framing","Lighting Fundamentals - Natural light, golden hour, shadows","Focus & Depth of Field - Autofocus modes, bokeh, hyperfocal","Shooting Modes - Manual, aperture priority, shutter priority","Lightroom Basics - Import, basic adjustments, export"],
    Intermediate: ["Portrait Photography - Posing, catchlights, skin tones","Landscape Photography - Long exposure, filters, golden hour","Street Photography - Candid techniques, ethics, gear","Advanced Lightroom - Presets, masking, local adjustments","Photoshop for Photos - Retouching, compositing, sky replacement","Studio Lighting - Strobes, softboxes, lighting setups"],
    Advanced:     ["Advanced Composition - Gestalt principles, visual weight","Commercial Photography - Product, food, architectural","Photo Editing Mastery - Frequency separation, dodge & burn","Printing & Exhibition - Color profiles, paper types, display","Building a Portfolio - Curation, website, client acquisition","Photography Business - Pricing, contracts, licensing"],
  },

  // ══════════════════════════════════════════════════════════════
  // BUSINESS & FINANCE
  // ══════════════════════════════════════════════════════════════
  "Digital Marketing": {
    emoji: "��", category: "business",
    fullName: "Digital Marketing",
    description: "SEO, social media, paid ads, email, and analytics",
    Beginner:     ["Marketing Fundamentals - 4Ps, target audience, positioning","SEO Basics - Keywords, on-page optimization, meta tags","Social Media Marketing - Platform strategies, content calendar","Email Marketing - List building, campaigns, open rates","Google Analytics - Sessions, bounce rate, conversions","Content Marketing - Blog writing, value proposition"],
    Intermediate: ["Google Ads - Search campaigns, Quality Score, bidding","Facebook & Instagram Ads - Audiences, creatives, retargeting","SEO Advanced - Backlinks, technical SEO, Core Web Vitals","Conversion Rate Optimization - A/B testing, landing pages","Influencer Marketing - Outreach, briefs, ROI measurement","Marketing Funnels - TOFU, MOFU, BOFU strategies"],
    Advanced:     ["Marketing Automation - HubSpot, Mailchimp workflows","Programmatic Advertising - DSPs, RTB, audience targeting","Attribution Modeling - Multi-touch, data-driven attribution","Growth Hacking - Viral loops, referral programs, AARRR","Brand Building - Positioning, storytelling, community","Marketing Analytics - Cohort analysis, LTV, CAC optimization"],
  },
  "Finance & Investing": {
    emoji: "💰", category: "business",
    fullName: "Finance & Investing",
    description: "Personal finance, stock markets, valuation, and portfolio management",
    Beginner:     ["Personal Finance Basics - Budgeting, saving, emergency fund","Banking & Interest - Compound interest, savings accounts, loans","Introduction to Stocks - Shares, exchanges, market indices","Mutual Funds & ETFs - Diversification, expense ratios, NAV","Risk & Return - Risk tolerance, asset classes, time horizon","Tax Basics - Income tax, capital gains, deductions"],
    Intermediate: ["Fundamental Analysis - P/E ratio, EPS, balance sheet reading","Technical Analysis - Candlestick charts, support/resistance, indicators","Portfolio Construction - Asset allocation, rebalancing, correlation","Bonds & Fixed Income - Yield, duration, credit ratings","Options Basics - Calls, puts, strike price, expiry","Behavioral Finance - Cognitive biases, market psychology"],
    Advanced:     ["Valuation Models - DCF, comparable company analysis","Derivatives - Futures, options strategies, hedging","Alternative Investments - Real estate, commodities, crypto","Quantitative Finance - Factor models, backtesting strategies","Financial Modeling - Excel models, scenario analysis","CFA Prep - Ethics, quantitative methods, portfolio management"],
  },
  "Entrepreneurship": {
    emoji: "🚀", category: "business",
    fullName: "Entrepreneurship & Startups",
    description: "Ideation, validation, building, funding, and scaling a business",
    Beginner:     ["Idea Generation - Problem identification, brainstorming, trends","Market Research - TAM/SAM/SOM, competitor analysis, surveys","Business Models - Revenue streams, cost structure, value proposition","Lean Startup - MVP, build-measure-learn, pivoting","Customer Discovery - Interviews, pain points, jobs-to-be-done","Basic Financials - Revenue, expenses, break-even, cash flow"],
    Intermediate: ["Product-Market Fit - Metrics, retention, NPS, iteration","Go-to-Market Strategy - Channels, pricing, launch planning","Fundraising Basics - Bootstrapping, angels, seed rounds, pitch decks","Team Building - Co-founders, hiring, culture, equity splits","Legal Basics - Company formation, IP, contracts, NDAs","Growth Metrics - MRR, churn, CAC, LTV, unit economics"],
    Advanced:     ["Venture Capital - Term sheets, dilution, cap tables, Series A+","Scaling Operations - Processes, delegation, OKRs, org design","M&A Basics - Acquisition strategy, due diligence, valuation","International Expansion - Localization, regulatory, market entry","Exit Strategies - IPO, acquisition, secondary sales","Startup Leadership - Vision, board management, crisis handling"],
  },
  "Project Management": {
    emoji: "📋", category: "business",
    fullName: "Project Management",
    description: "Agile, Scrum, PMP concepts, risk management, and team leadership",
    Beginner:     ["PM Fundamentals - Project lifecycle, stakeholders, scope","Agile Basics - Manifesto, principles, iterative delivery","Scrum Framework - Sprints, ceremonies, roles, artifacts","Task Management - Kanban boards, Trello, Jira basics","Communication - Status reports, meeting facilitation, documentation","Time Management - Estimation, scheduling, critical path"],
    Intermediate: ["Risk Management - Identification, assessment, mitigation plans","Budget Management - Cost estimation, tracking, variance analysis","Stakeholder Management - Influence mapping, expectation setting","Advanced Agile - SAFe, LeSS, scaling frameworks","Change Management - ADKAR model, resistance, adoption","Quality Management - QA processes, acceptance criteria, testing"],
    Advanced:     ["PMP Certification Prep - PMBOK guide, process groups, knowledge areas","Program Management - Portfolio alignment, dependencies, governance","Earned Value Management - SPI, CPI, forecasting","Vendor & Contract Management - RFPs, SLAs, negotiations","Organizational Change - Transformation programs, culture change","Leadership & Coaching - Servant leadership, team dynamics, conflict resolution"],
  },

  // ══════════════════════════════════════════════════════════════
  // SCIENCE & MATH
  // ══════════════════════════════════════════════════════════════
  "Mathematics": {
    emoji: "➗", category: "science",
    fullName: "Mathematics",
    description: "Algebra, calculus, statistics, and discrete math from ground up",
    Beginner:     ["Number Systems - Integers, fractions, decimals, percentages","Algebra Basics - Variables, equations, inequalities","Geometry - Shapes, angles, area, perimeter, volume","Trigonometry Intro - Sin, cos, tan, unit circle","Statistics Basics - Mean, median, mode, range","Probability - Basic events, sample space, simple probability"],
    Intermediate: ["Calculus I - Limits, derivatives, differentiation rules","Calculus II - Integration, area under curve, techniques","Linear Algebra - Vectors, matrices, determinants, eigenvalues","Discrete Math - Sets, logic, proofs, combinatorics","Probability Distributions - Normal, binomial, Poisson","Differential Equations - First order, separable, applications"],
    Advanced:     ["Multivariable Calculus - Partial derivatives, gradients, optimization","Real Analysis - Sequences, series, continuity, convergence","Abstract Algebra - Groups, rings, fields, homomorphisms","Numerical Methods - Root finding, interpolation, numerical integration","Graph Theory - Trees, paths, coloring, network flows","Mathematical Proofs - Induction, contradiction, direct proof techniques"],
  },
  "Physics": {
    emoji: "⚛️", category: "science",
    fullName: "Physics",
    description: "Mechanics, electromagnetism, thermodynamics, and modern physics",
    Beginner:     ["Kinematics - Displacement, velocity, acceleration, equations of motion","Newton's Laws - Force, mass, inertia, action-reaction","Energy & Work - Kinetic, potential, conservation of energy","Waves & Sound - Frequency, amplitude, wave properties","Optics Basics - Reflection, refraction, lenses, mirrors","Electricity Basics - Charge, current, voltage, resistance, Ohm's law"],
    Intermediate: ["Rotational Motion - Torque, angular momentum, moment of inertia","Thermodynamics - Laws, heat engines, entropy, Carnot cycle","Electromagnetism - Magnetic fields, Faraday's law, inductance","Fluid Mechanics - Pressure, buoyancy, Bernoulli's principle","Oscillations & SHM - Springs, pendulums, resonance","Optics Advanced - Interference, diffraction, polarization"],
    Advanced:     ["Special Relativity - Time dilation, length contraction, E=mc²","Quantum Mechanics - Wave-particle duality, Schrödinger equation","Nuclear Physics - Radioactivity, fission, fusion, decay","Particle Physics - Standard model, quarks, leptons, bosons","Astrophysics - Stellar evolution, black holes, cosmology","Condensed Matter - Band theory, semiconductors, superconductivity"],
  },
  "Chemistry": {
    emoji: "🧪", category: "science",
    fullName: "Chemistry",
    description: "Atomic structure, reactions, organic chemistry, and lab techniques",
    Beginner:     ["Atomic Structure - Protons, neutrons, electrons, orbitals","Periodic Table - Groups, periods, trends, element properties","Chemical Bonding - Ionic, covalent, metallic, hydrogen bonds","Stoichiometry - Mole concept, balancing equations, limiting reagents","States of Matter - Solids, liquids, gases, phase changes","Acids & Bases - pH scale, neutralization, buffer solutions"],
    Intermediate: ["Thermochemistry - Enthalpy, Hess's law, calorimetry","Chemical Kinetics - Reaction rates, activation energy, catalysts","Equilibrium - Le Chatelier's principle, Kc, Kp expressions","Electrochemistry - Galvanic cells, electrolysis, Nernst equation","Organic Chemistry Basics - Functional groups, IUPAC naming, isomers","Solutions & Colligative Properties - Molarity, osmosis, boiling point elevation"],
    Advanced:     ["Organic Reactions - Substitution, elimination, addition mechanisms","Spectroscopy - NMR, IR, mass spectrometry interpretation","Polymer Chemistry - Addition, condensation polymers, properties","Biochemistry - Amino acids, proteins, enzymes, metabolic pathways","Quantum Chemistry - Molecular orbital theory, hybridization","Green Chemistry - Sustainable synthesis, atom economy, solvent selection"],
  },
  "Biology": {
    emoji: "🧬", category: "science",
    fullName: "Biology",
    description: "Cell biology, genetics, evolution, ecology, and human physiology",
    Beginner:     ["Cell Biology - Cell structure, organelles, prokaryotes vs eukaryotes","Biomolecules - Carbohydrates, lipids, proteins, nucleic acids","Cell Division - Mitosis, meiosis, cell cycle regulation","Genetics Basics - Mendelian inheritance, dominant/recessive traits","Evolution - Natural selection, adaptation, speciation","Ecology - Food chains, ecosystems, biomes, nutrient cycles"],
    Intermediate: ["Molecular Biology - DNA replication, transcription, translation","Genetics Advanced - Linkage, mutations, chromosomal disorders","Human Physiology - Digestive, circulatory, respiratory systems","Microbiology - Bacteria, viruses, fungi, immune response","Plant Biology - Photosynthesis, transpiration, plant hormones","Biotechnology - PCR, gel electrophoresis, CRISPR basics"],
    Advanced:     ["Genomics & Proteomics - Sequencing, bioinformatics, gene expression","Immunology - Innate vs adaptive immunity, antibodies, vaccines","Neuroscience - Neurons, synapses, brain regions, neural circuits","Developmental Biology - Embryogenesis, stem cells, differentiation","Cancer Biology - Oncogenes, tumor suppressors, metastasis","Systems Biology - Network analysis, modeling biological systems"],
  },
  // ══════════════════════════════════════════════════════════════
  // LANGUAGES
  // ══════════════════════════════════════════════════════════════
  "English": {
    emoji: "🇬🇧", category: "language",
    fullName: "English Language",
    description: "Grammar, vocabulary, writing, speaking, and comprehension",
    Beginner:     ["Grammar Basics - Parts of speech, sentence structure, tenses","Vocabulary Building - Word families, prefixes, suffixes, context clues","Reading Comprehension - Main idea, inference, summarizing","Basic Writing - Paragraphs, topic sentences, supporting details","Listening Skills - Note-taking, understanding accents, key words","Speaking Basics - Pronunciation, basic conversation, greetings"],
    Intermediate: ["Advanced Grammar - Conditionals, passive voice, reported speech","Essay Writing - Introduction, body, conclusion, thesis statements","Academic Vocabulary - IELTS/TOEFL word lists, collocations","Presentation Skills - Structure, delivery, visual aids","Business English - Emails, reports, meetings, negotiations","Critical Reading - Argument analysis, bias detection, evaluation"],
    Advanced:     ["Academic Writing - Research papers, citations, argumentation","Rhetoric & Persuasion - Ethos, pathos, logos, rhetorical devices","Literature Analysis - Themes, symbolism, narrative techniques","Advanced Speaking - Debates, public speaking, impromptu talks","IELTS/TOEFL Prep - Band 7+ strategies, practice tests","Professional Writing - Technical writing, proposals, white papers"],
  },
  "Spanish": {
    emoji: "🇪🇸", category: "language",
    fullName: "Spanish",
    description: "From hola to fluency — grammar, conversation, and culture",
    Beginner:     ["Alphabet & Pronunciation - Sounds, accents, rolling R","Basic Vocabulary - Numbers, colors, days, greetings, family","Present Tense - Regular -ar, -er, -ir verbs conjugation","Nouns & Articles - Gender, plural, definite/indefinite articles","Basic Phrases - Introductions, asking directions, ordering food","Ser vs Estar - Permanent vs temporary states"],
    Intermediate: ["Past Tenses - Preterite vs imperfect, irregular verbs","Future & Conditional - Will, would, hypothetical situations","Subjunctive Mood - Wishes, doubts, emotions, recommendations","Reflexive Verbs - Daily routines, reciprocal actions","Vocabulary Expansion - Travel, work, health, environment topics","Listening & Speaking - Podcasts, conversation practice, shadowing"],
    Advanced:     ["Advanced Grammar - Compound tenses, passive voice, gerunds","Idiomatic Expressions - Colloquialisms, regional variations","Spanish Literature - García Márquez, Cervantes, literary analysis","Business Spanish - Formal writing, presentations, negotiations","Dialect Awareness - Spain vs Latin America differences","DELE Exam Prep - B2/C1 level preparation strategies"],
  },
  "French": {
    emoji: "🇫🇷", category: "language",
    fullName: "French",
    description: "Bonjour to bilingual — grammar, culture, and conversation",
    Beginner:     ["Pronunciation - Nasal sounds, liaison, silent letters","Basic Vocabulary - Greetings, numbers, colors, family","Present Tense - Regular -er, -ir, -re verbs","Gender & Articles - Le, la, les, un, une, des","Basic Conversations - Café, shopping, directions, introductions","Être & Avoir - To be and to have conjugations"],
    Intermediate: ["Past Tenses - Passé composé vs imparfait","Future Tense - Simple future, immediate future (aller + infinitive)","Subjunctive - Wishes, necessity, doubt expressions","Pronouns - Direct, indirect, reflexive, relative pronouns","French Culture - Cuisine, cinema, history, etiquette","Listening Practice - French radio, films, podcasts"],
    Advanced:     ["Advanced Grammar - Conditional perfect, pluperfect, passive","Literary French - Molière, Camus, Flaubert — reading & analysis","Business French - Formal correspondence, meetings, presentations","Regional Accents - Québécois, Belgian, Swiss French","DELF/DALF Prep - B2/C1 exam strategies","Translation Skills - French-English, nuance, register"],
  },
  "Japanese": {
    emoji: "🇯🇵", category: "language",
    fullName: "Japanese",
    description: "Hiragana to kanji — reading, writing, speaking, and culture",
    Beginner:     ["Hiragana - All 46 characters, reading, writing practice","Katakana - All 46 characters, loanwords, foreign names","Basic Grammar - Sentence structure, は/が particles, desu/masu","Numbers & Time - Counting, telling time, dates, money","Basic Vocabulary - Greetings, family, food, directions","Romaji to Kana - Transitioning away from romanization"],
    Intermediate: ["Kanji Basics - JLPT N5/N4 kanji, radicals, stroke order","Te-form - Requests, permissions, connecting actions","Adjective Types - い-adjectives vs な-adjectives conjugation","Keigo Intro - Polite speech, honorifics, humble forms","Listening Practice - Anime, NHK Web Easy, podcasts","JLPT N4 Prep - Grammar, vocabulary, reading comprehension"],
    Advanced:     ["Advanced Kanji - JLPT N3/N2 kanji, compound words","Keigo Mastery - Business Japanese, formal situations","Classical Japanese - Bungo grammar, historical texts","JLPT N2/N1 Prep - Complex grammar, speed reading","Japanese Media - Novels, newspapers, manga without furigana","Translation & Interpretation - Nuance, cultural context"],
  },
  // ══════════════════════════════════════════════════════════════
  // HEALTH & MEDICINE
  // ══════════════════════════════════════════════════════════════
  "Nutrition & Diet": {
    emoji: "🥗", category: "health",
    fullName: "Nutrition & Diet",
    description: "Macros, micronutrients, meal planning, and evidence-based eating",
    Beginner:     ["Macronutrients - Carbohydrates, proteins, fats and their roles","Micronutrients - Vitamins, minerals, deficiencies, food sources","Calorie Basics - TDEE, BMR, caloric deficit and surplus","Reading Food Labels - Serving sizes, ingredients, % daily values","Hydration - Water intake, electrolytes, signs of dehydration","Meal Timing - Breakfast importance, pre/post workout nutrition"],
    Intermediate: ["Weight Management - Evidence-based fat loss and muscle gain","Dietary Patterns - Mediterranean, DASH, plant-based, keto overview","Sports Nutrition - Protein timing, carb loading, recovery","Gut Health - Probiotics, prebiotics, fiber, microbiome","Food Allergies & Intolerances - Gluten, lactose, common allergens","Cooking for Nutrition - Preserving nutrients, healthy cooking methods"],
    Advanced:     ["Clinical Nutrition - Therapeutic diets, disease management","Nutrigenomics - Gene-diet interactions, personalized nutrition","Eating Disorders - Recognition, support, treatment approaches","Supplement Science - Evidence review, safety, efficacy","Research Literacy - Reading nutrition studies, meta-analyses","Nutrition Coaching - Client assessment, goal setting, behavior change"],
  },
  "Fitness & Exercise": {
    emoji: "💪", category: "health",
    fullName: "Fitness & Exercise Science",
    description: "Training principles, programming, anatomy, and performance",
    Beginner:     ["Exercise Basics - Types of exercise, FITT principle, warm-up/cool-down","Muscle Anatomy - Major muscle groups, function, movement patterns","Cardiovascular Training - Heart rate zones, aerobic base building","Strength Training Basics - Compound lifts, form, progressive overload","Flexibility & Mobility - Stretching types, joint mobility, yoga basics","Recovery - Sleep, rest days, DOMS, active recovery"],
    Intermediate: ["Program Design - Periodization, volume, intensity, frequency","Hypertrophy Training - Muscle growth mechanisms, rep ranges, TUT","Endurance Training - VO2 max, lactate threshold, long slow distance","Injury Prevention - Common injuries, prehab exercises, movement screening","Nutrition for Performance - Fueling workouts, protein synthesis","Body Composition - Measuring progress, DEXA, skinfolds, photos"],
    Advanced:     ["Advanced Periodization - Block, conjugate, undulating periodization","Biomechanics - Force vectors, leverage, joint mechanics","Sports-Specific Training - Power, speed, agility, sport demands","Exercise Physiology - Energy systems, hormonal responses, adaptations","Personal Training Business - Client management, programming, liability","Research in Exercise Science - Reading studies, applying evidence"],
  },
  "Mental Health & Psychology": {
    emoji: "🧠", category: "health",
    fullName: "Mental Health & Psychology",
    description: "Psychology fundamentals, mental wellness, CBT, and emotional intelligence",
    Beginner:     ["Psychology Basics - History, major perspectives, key figures","Emotions & Feelings - Identifying, labeling, regulating emotions","Stress & Anxiety - Causes, symptoms, basic coping strategies","Sleep Hygiene - Sleep cycles, habits for better sleep quality","Mindfulness Basics - Present moment awareness, breathing exercises","Self-Care Fundamentals - Physical, emotional, social, spiritual dimensions"],
    Intermediate: ["Cognitive Behavioral Therapy - Thought patterns, cognitive distortions, reframing","Attachment Theory - Attachment styles, relationships, early experiences","Positive Psychology - PERMA model, strengths, flourishing","Trauma Awareness - Types of trauma, trauma responses, resilience","Social Psychology - Conformity, persuasion, group dynamics","Emotional Intelligence - Self-awareness, empathy, social skills"],
    Advanced:     ["Psychotherapy Approaches - CBT, DBT, ACT, psychodynamic overview","Abnormal Psychology - DSM-5 categories, diagnosis, treatment","Neuroscience of Mental Health - Brain structures, neurotransmitters","Research Methods in Psychology - Experimental design, statistics","Counseling Skills - Active listening, motivational interviewing","Mental Health Advocacy - Stigma reduction, policy, community support"],
  },
  "Medical Sciences": {
    emoji: "🏥", category: "health",
    fullName: "Medical Sciences",
    description: "Anatomy, physiology, pharmacology, and clinical foundations",
    Beginner:     ["Human Anatomy - Body systems overview, anatomical terminology","Cell Physiology - Cell membrane, transport, signaling","Cardiovascular System - Heart anatomy, cardiac cycle, blood pressure","Respiratory System - Lung anatomy, gas exchange, breathing mechanics","Digestive System - GI tract, digestion, absorption, liver function","Musculoskeletal System - Bones, joints, muscles, movement"],
    Intermediate: ["Pathophysiology - Disease mechanisms, inflammation, repair","Pharmacology Basics - Drug classes, mechanisms, pharmacokinetics","Microbiology & Immunology - Pathogens, immune response, vaccines","Nervous System - CNS, PNS, neurotransmission, reflexes","Endocrine System - Hormones, feedback loops, major glands","Clinical Skills - History taking, physical examination basics"],
    Advanced:     ["Diagnostic Reasoning - Differential diagnosis, clinical decision making","Evidence-Based Medicine - Reading trials, NNT, systematic reviews","Surgery Basics - Surgical principles, wound healing, asepsis","Emergency Medicine - ABCDE approach, triage, resuscitation","Medical Ethics - Autonomy, beneficence, justice, consent","Research & Clinical Trials - Study design, ethics, data interpretation"],
  },
  // ══════════════════════════════════════════════════════════════
  // ARTS & MUSIC
  // ══════════════════════════════════════════════════════════════
  "Music Theory": {
    emoji: "🎵", category: "arts",
    fullName: "Music Theory",
    description: "Notes, scales, chords, harmony, rhythm, and composition",
    Beginner:     ["Notes & Pitch - Musical alphabet, octaves, reading staff notation","Rhythm & Meter - Note values, time signatures, counting beats","Scales - Major scale, minor scale, whole/half steps","Intervals - Half steps, whole steps, naming intervals","Basic Chords - Major, minor triads, chord construction","Key Signatures - Circle of fifths, sharps and flats"],
    Intermediate: ["Chord Progressions - I-IV-V, ii-V-I, common progressions","Modes - Dorian, Phrygian, Lydian, Mixolydian and their character","Harmony - Voice leading, counterpoint basics, chord inversions","Rhythm Advanced - Syncopation, polyrhythm, compound meter","Form & Structure - Verse-chorus, AABA, sonata form","Ear Training - Interval recognition, chord quality, melodic dictation"],
    Advanced:     ["Advanced Harmony - Secondary dominants, borrowed chords, modulation","Counterpoint - Species counterpoint, Bach chorales, fugue","Orchestration - Instrument ranges, timbres, writing for ensembles","20th Century Techniques - Atonality, serialism, minimalism","Music Analysis - Score reading, formal analysis, style periods","Composition - Melody writing, arranging, developing musical ideas"],
  },
  "Guitar": {
    emoji: "🎸", category: "arts",
    fullName: "Guitar",
    description: "From first chords to advanced technique — acoustic and electric",
    Beginner:     ["Guitar Anatomy - Parts, tuning, string names, holding position","Basic Chords - Em, Am, G, C, D, E major open chords","Strumming Patterns - Down strokes, up strokes, basic rhythms","Fingerpicking Basics - Thumb and finger independence, Travis picking","Reading Tabs - Tab notation, chord diagrams, rhythm notation","Music Theory for Guitar - Notes on fretboard, major scale positions"],
    Intermediate: ["Barre Chords - F major, B minor, moveable chord shapes","Pentatonic Scale - Minor pentatonic, blues scale, soloing basics","Music Styles - Blues, rock, folk, fingerstyle techniques","Improvisation - Using scales over chord progressions","Chord Inversions - Triads on different string sets","Alternate Picking - Speed building, economy picking, exercises"],
    Advanced:     ["Advanced Techniques - Sweep picking, tapping, legato runs","Music Theory Applied - Modes, chord-scale relationships, jazz chords","Fingerstyle Arrangements - Solo guitar, classical technique","Recording Guitar - Mic placement, DI, amp simulation, DAW basics","Composition & Songwriting - Chord progressions, melody, structure","Gear & Tone - Pickups, pedals, amp settings, signal chain"],
  },
  "Drawing & Illustration": {
    emoji: "✏️", category: "arts",
    fullName: "Drawing & Illustration",
    description: "Fundamentals of drawing — form, perspective, light, and digital art",
    Beginner:     ["Line & Shape - Contour drawing, basic shapes, gesture lines","Proportion & Measurement - Comparative measurement, sighting techniques","Perspective Basics - One-point, two-point perspective, horizon line","Value & Shading - Light source, shadow, hatching, blending","Texture & Pattern - Rendering different surfaces, mark-making","Observational Drawing - Still life, drawing from reference"],
    Intermediate: ["Figure Drawing - Gesture, anatomy, proportions of the human body","Portrait Drawing - Facial proportions, features, likeness","Composition - Rule of thirds, focal points, visual flow","Color Theory Applied - Color mixing, temperature, harmony","Digital Drawing - Procreate or Photoshop, layers, brushes","Perspective Advanced - Three-point, atmospheric, interior spaces"],
    Advanced:     ["Character Design - Silhouette, personality, turnarounds","Environment & Concept Art - World-building, mood, storytelling","Illustration Styles - Editorial, children's book, graphic novel","Advanced Anatomy - Muscles, foreshortening, dynamic poses","Portfolio Development - Cohesive body of work, presentation","Freelance Illustration - Clients, briefs, licensing, pricing"],
  },
  "Creative Writing": {
    emoji: "📝", category: "arts",
    fullName: "Creative Writing",
    description: "Fiction, poetry, screenwriting — craft, voice, and storytelling",
    Beginner:     ["Story Basics - Plot, character, setting, conflict, theme","Character Creation - Backstory, motivation, voice, arc","Point of View - First person, third person, omniscient narrator","Show Don't Tell - Sensory details, action over exposition","Dialogue Writing - Natural speech, subtext, punctuation","Free Writing - Journaling, prompts, overcoming blank page"],
    Intermediate: ["Plot Structure - Three-act, hero's journey, story beats","Scene Construction - Scene goals, conflict, turning points","World Building - Setting details, consistency, immersion","Revision Techniques - Self-editing, cutting, restructuring","Genre Writing - Mystery, romance, sci-fi, fantasy conventions","Poetry Forms - Sonnet, haiku, free verse, imagery, metaphor"],
    Advanced:     ["Advanced Narrative Techniques - Unreliable narrator, non-linear structure","Literary Style - Voice development, prose rhythm, sentence variety","Screenwriting - Screenplay format, scene headings, action lines","Publishing Path - Query letters, agents, self-publishing, platforms","Workshop Skills - Giving and receiving critique, revision cycles","Author Platform - Blog, social media, building readership"],
  },
  // ══════════════════════════════════════════════════════════════
  // LAW & SOCIAL SCIENCE
  // ══════════════════════════════════════════════════════════════
  "Law Fundamentals": {
    emoji: "⚖️", category: "law",
    fullName: "Law Fundamentals",
    description: "Legal systems, contracts, constitutional law, and legal reasoning",
    Beginner:     ["Legal Systems - Common law, civil law, sources of law","Constitutional Law Basics - Rights, separation of powers, judicial review","Contract Law - Offer, acceptance, consideration, breach","Tort Law - Negligence, duty of care, damages","Criminal Law Basics - Elements of crime, mens rea, actus reus","Legal Research - Case law, statutes, legal databases"],
    Intermediate: ["Property Law - Real property, personal property, ownership","Family Law - Marriage, divorce, custody, inheritance","Employment Law - Contracts, discrimination, wrongful termination","Intellectual Property - Copyright, trademark, patent basics","Civil Procedure - Pleadings, discovery, trial process","Legal Writing - Memos, briefs, case analysis structure"],
    Advanced:     ["Corporate Law - Company formation, directors, shareholder rights","International Law - Treaties, jurisdiction, human rights law","Evidence Law - Admissibility, hearsay, burden of proof","Advanced Constitutional Law - Landmark cases, judicial interpretation","Dispute Resolution - Mediation, arbitration, negotiation","Legal Ethics - Professional responsibility, conflicts of interest"],
  },
  "Economics": {
    emoji: "📊", category: "law",
    fullName: "Economics",
    description: "Micro and macroeconomics, markets, policy, and global trade",
    Beginner:     ["Supply & Demand - Market equilibrium, price mechanisms, shifts","Opportunity Cost - Scarcity, trade-offs, production possibility frontier","Market Structures - Perfect competition, monopoly, oligopoly","GDP & National Income - Measuring output, income, expenditure approaches","Inflation & Unemployment - CPI, causes, Phillips curve","Money & Banking - Functions of money, commercial banks, central banks"],
    Intermediate: ["Consumer Theory - Utility, indifference curves, budget constraints","Producer Theory - Production functions, costs, profit maximization","Fiscal Policy - Government spending, taxation, multiplier effect","Monetary Policy - Interest rates, money supply, central bank tools","International Trade - Comparative advantage, tariffs, trade agreements","Market Failures - Externalities, public goods, information asymmetry"],
    Advanced:     ["Game Theory - Nash equilibrium, prisoner's dilemma, strategic behavior","Econometrics - Regression analysis, hypothesis testing, panel data","Development Economics - Poverty traps, growth models, aid effectiveness","Behavioral Economics - Bounded rationality, nudges, prospect theory","Financial Economics - Asset pricing, CAPM, efficient market hypothesis","Advanced Macroeconomics - DSGE models, business cycles, growth theory"],
  },
  "Political Science": {
    emoji: "🏛️", category: "law",
    fullName: "Political Science",
    description: "Political systems, governance, international relations, and policy",
    Beginner:     ["Political Systems - Democracy, authoritarianism, monarchy, republic","Government Structures - Executive, legislative, judicial branches","Political Ideologies - Liberalism, conservatism, socialism, nationalism","Elections & Voting - Electoral systems, voter behavior, campaigns","Civil Society - NGOs, social movements, interest groups","Media & Politics - Role of press, propaganda, social media influence"],
    Intermediate: ["Comparative Politics - Presidential vs parliamentary systems","International Relations - Realism, liberalism, constructivism theories","Public Policy - Policy cycle, agenda setting, implementation","Political Economy - State-market relations, globalization, inequality","Federalism - Division of powers, intergovernmental relations","Human Rights - International frameworks, enforcement, violations"],
    Advanced:     ["IR Theory Advanced - Critical theory, postcolonialism, feminism in IR","Security Studies - War, deterrence, nuclear strategy, terrorism","Global Governance - UN system, multilateralism, international institutions","Political Philosophy - Rawls, Nozick, Habermas, justice theories","Research Methods - Qualitative, quantitative, mixed methods in PolSci","Geopolitics - Power transitions, regional dynamics, strategic competition"],
  },
  // ══════════════════════════════════════════════════════════════
  // PERSONAL DEVELOPMENT
  // ══════════════════════════════════════════════════════════════
  "Public Speaking": {
    emoji: "🎤", category: "personal",
    fullName: "Public Speaking",
    description: "Confidence, structure, delivery, and persuasion for any audience",
    Beginner:     ["Overcoming Fear - Managing anxiety, breathing techniques, mindset","Voice & Delivery - Pace, pitch, volume, pausing effectively","Body Language - Posture, eye contact, gestures, movement","Speech Structure - Opening hook, body, memorable conclusion","Impromptu Speaking - PREP method, thinking on your feet","Storytelling Basics - Personal stories, narrative arc, emotional connection"],
    Intermediate: ["Persuasive Speaking - Ethos, pathos, logos, call to action","Presentation Design - Slide principles, visuals, avoiding death by PowerPoint","Audience Engagement - Questions, interaction, reading the room","Humor in Speaking - Timing, self-deprecation, appropriate use","Virtual Presentations - Camera presence, tech setup, online engagement","Speech Writing - Crafting scripts, memorization vs notes"],
    Advanced:     ["Keynote Speaking - Conference talks, TED-style structure, big ideas","Debate & Argumentation - Rebuttal, cross-examination, logical fallacies","Media Training - TV interviews, press conferences, sound bites","Executive Communication - Board presentations, investor pitches","Coaching Others - Feedback frameworks, speech coaching techniques","Building a Speaking Career - Bureaus, fees, marketing yourself"],
  },
  "Productivity & Time Management": {
    emoji: "⏰", category: "personal",
    fullName: "Productivity & Time Management",
    description: "Systems, habits, focus, and tools to get more done with less stress",
    Beginner:     ["Goal Setting - SMART goals, vision, short vs long-term planning","To-Do Lists - Prioritization, brain dump, daily planning","Time Blocking - Calendar management, deep work blocks, batching","Eliminating Distractions - Phone habits, environment design, focus","Energy Management - Ultradian rhythms, peak hours, rest","Basic Tools - Notion, Todoist, Google Calendar setup"],
    Intermediate: ["GTD Method - Capture, clarify, organize, reflect, engage","Pomodoro Technique - 25/5 cycles, tracking, adapting the method","Weekly Reviews - Reflection, planning, course correction","Delegation - What to delegate, how to hand off, follow-up","Deep Work - Cal Newport principles, distraction-free environments","Habit Stacking - Atomic habits, cue-routine-reward, identity-based habits"],
    Advanced:     ["Personal Knowledge Management - Zettelkasten, second brain, Obsidian","Systems Thinking - Feedback loops, leverage points, unintended consequences","Leadership Productivity - Managing teams, meetings, decision fatigue","Automation - Zapier, Make, automating repetitive workflows","Burnout Prevention - Sustainable pace, boundaries, recovery","Productivity Coaching - Assessing others, frameworks, accountability"],
  },
  "Financial Literacy": {
    emoji: "💵", category: "personal",
    fullName: "Financial Literacy",
    description: "Budgeting, saving, investing, debt, and building long-term wealth",
    Beginner:     ["Budgeting - 50/30/20 rule, tracking expenses, zero-based budgeting","Emergency Fund - Why it matters, how much, where to keep it","Debt Management - Good vs bad debt, snowball vs avalanche method","Banking Basics - Checking, savings, interest rates, fees","Credit Score - How it works, factors, improving your score","Insurance Basics - Health, life, auto, renters insurance"],
    Intermediate: ["Investing Basics - Stocks, bonds, mutual funds, index funds","Retirement Accounts - 401k, IRA, Roth IRA, contribution limits","Tax Planning - Deductions, credits, tax-advantaged accounts","Real Estate Basics - Buying vs renting, mortgage, property investment","Net Worth Tracking - Assets, liabilities, building wealth over time","Side Income - Freelancing, passive income, monetizing skills"],
    Advanced:     ["Portfolio Management - Asset allocation, rebalancing, risk management","Advanced Tax Strategy - Tax-loss harvesting, business deductions","Estate Planning - Wills, trusts, beneficiaries, power of attorney","Financial Independence - FIRE movement, safe withdrawal rate, 4% rule","Business Finance - Cash flow, P&L, funding a business","Wealth Psychology - Money mindset, behavioral biases, generational wealth"],
  },
};
