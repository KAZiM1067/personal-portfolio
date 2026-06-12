document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // Particle Canvas Background
    // ==========================================================================
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animFrame;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.6 + 0.1;
            this.pulse = Math.random() * Math.PI * 2;
            // Color: either indigo or cyan
            this.color = Math.random() > 0.5 ? '99,102,241' : '34,211,238';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.pulse += 0.015;
            this.opacity = (Math.sin(this.pulse) * 0.3 + 0.4);
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Init particles
    for (let i = 0; i < 130; i++) particles.push(new Particle());

    // Draw connecting lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    const opacity = (1 - dist / 100) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99,102,241,${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animFrame = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // ==========================================================================
    // Custom Cursor
    // ==========================================================================
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    function animateCursor() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.transform = `translate(${ringX - 18}px, ${ringY - 18}px)`;
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Scale cursor on hoverable elements
    document.querySelectorAll('a, button, .btn, .project-card, .skill-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.transform += ' scale(2)';
            cursorRing.style.width = '60px';
            cursorRing.style.height = '60px';
            cursorRing.style.borderColor = 'rgba(34,211,238,0.6)';
            cursorRing.style.marginTop = '-12px';
            cursorRing.style.marginLeft = '-12px';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '36px';
            cursorRing.style.height = '36px';
            cursorRing.style.borderColor = 'rgba(99,102,241,0.5)';
            cursorRing.style.marginTop = '0';
            cursorRing.style.marginLeft = '0';
        });
    });

    // ==========================================================================
    // Typing Effect
    // ==========================================================================
    const typingEl = document.querySelector('.typing-text');
    const words = [
        'Cybersecurity Engineer.',
        'Software Developer.',
        'Automation Architect.',
        'Algorithmic Developer.',
        'AI Systems Builder.'
    ];
    let wordIndex = 0, charIndex = 0, isDeleting = false;

    function typeEffect() {
        const current = words[wordIndex];
        if (isDeleting) {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }
        let speed = isDeleting ? 40 : 90;
        if (!isDeleting && charIndex === current.length) {
            speed = 2200; isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }
        setTimeout(typeEffect, speed);
    }
    setTimeout(typeEffect, 1200);

    // ==========================================================================
    // Navbar Scroll
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    // ==========================================================================
    // Mobile Menu
    // ==========================================================================
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ==========================================================================
    // Scroll Reveal with Stagger
    // ==========================================================================
    const reveals = document.querySelectorAll('.reveal, .reveal-left');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(el => observer.observe(el));

    // ==========================================================================
    // Active Nav Link on Scroll
    // ==========================================================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-links a:not(.btn)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 200) current = section.id;
        });
        navItems.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${current}`
                ? 'var(--accent-cyan)' : '';
        });
    });

    // ==========================================================================
    // Project Details Modal Controller
    // ==========================================================================
    const PROJECTS_DATA = [
        {
            title: "Real-Time Machine Learning Threat Detection Suite",
            tag: "Cybersecurity & ML",
            image: "screenshots/project1.png",
            tech: ["Python", "Machine Learning", "Network Analysis", "Linux Security Tools"],
            description: "Developed an end-to-end network traffic analysis and anomaly detection system leveraging machine learning models to identify and flag potential security breaches in real time. The suite sniffs raw packets, parses protocol layers, and runs inference through models trained on known threat patterns, making cyber defense proactive rather than reactive.",
            features: [
                "<strong>Zero-Overhead Ingestion:</strong> Deployed an optimized packet sniffing engine in Python utilizing low-level socket APIs to capture high-throughput traffic without dropping packets.",
                "<strong>ML Anomaly Classification:</strong> Leveraged Random Forest and XGBoost classifiers trained on standard security datasets to detect DNS tunneling, DDoS indicators, and exfiltration signatures.",
                "<strong>Model Interpretability:</strong> Implemented a feature-importance parsing layer (SHAP-inspired) to output human-readable reasoning alongside every flagged threat.",
                "<strong>Cryptographic Integrity:</strong> Anchored local event logs with SHA-256 integrity chains, ensuring that logged activities cannot be covertly tampered with by intruders."
            ],
            futureScope: [
                "<strong>Autonomous Sandbox Isolation:</strong> Automate defensive triggers to immediately launch containerized sandbox environments and quarantine flagged target machines via SDN APIs.",
                "<strong>Local LLM Report Translation:</strong> Integrate offline LLMs to draft context-aware incident summaries and executive summaries for immediate business-stakeholder alerting.",
                "<strong>Distributed Threat Mesh:</strong> Create a peer-to-peer decentralized logging system to cross-reference packet patterns across isolated private networks."
            ]
        },
        {
            title: "PharmacyOS: Enterprise Retail Suite",
            tag: "Systems Automation",
            image: "screenshots/project2.png",
            tech: ["Python", "CustomTkinter", "SQLite", "POS Billing", "Regulatory Compliance"],
            description: "PharmacyOS is a modern, high-performance desktop application tailored specifically for retail pharmacies in India. Built with Python and CustomTkinter, it prioritizes speed, regulatory compliance, and profit optimization.",
            features: [
                "<strong>High-Speed POS & Billing:</strong> Keyboard-friendly checkout grid with autocomplete and live digital clock timestamps.",
                "<strong>Smart Substitutions:</strong> Instantly suggests alternative brands from a 248,000+ medicine database based on exact salt chemistry and live inventory margins.",
                "<strong>Dynamic GST & printing:</strong> Automatic GST tax engine with thermal and dot-matrix receipt layout options.",
                "<strong>Automated Procurement:</strong> Calculation of scheme/cash discounts, invoice landed costs, stock adjustments (breakages/expiries), and support for 1M+ stock records.",
                "<strong>Analytics Dashboards:</strong> Real-time overview of cash vs. credit splits, cancelled bills, sales margins, and drawer profits.",
                "<strong>Dual-Tier RBAC & Auditing:</strong> Sensitive settings and reports password-locked under Admin status; cashier-to-admin separation."
            ],
            futureScope: [
                "<strong>Cloud Sync & Chain Support:</strong> Migrate local SQLite database to cloud PostgreSQL/AWS RDS for multi-branch store synchronization.",
                "<strong>Barcode Scanning & Drawers:</strong> Native driver integration for plug-and-play barcode sweeps and cashier drawer controls.",
                "<strong>AI Demand Forecasting:</strong> Machine learning algorithms to analyze sales patterns and automate purchasing suggestions to eliminate dead-stock.",
                "<strong>Expiry Returns Automation:</strong> Automated 30/60/90-day expiry warning triggers with one-click Debit Note generation for returns.",
                "<strong>WhatsApp & Refill Reminders:</strong> Connect WhatsApp and SMS APIs to automatically text receipts and chronic medication reminders to patients.",
                "<strong>Indian Accounting Sync:</strong> Direct balance sheets and GST file exporting hooks to Tally Prime and Zoho Books.",
                "<strong>OCR Prescription Parsing:</strong> Local AI vision engine to scan and parse doctors' handwritten prescriptions to auto-fill billing queues."
            ]
        },
        {
            title: "High-Frequency Algorithmic Systems (Team Gold Rush)",
            tag: "Algorithmic Trading",
            image: "screenshots/project3.png",
            tech: ["MQL5", "C++", "MetaTrader 5", "Quantitative Analysis", "AI-Assisted"],
            description: "Under his trading brand Team Gold Rush, he designs, programs, and rigorously backtests low-latency automated trading systems (Expert Advisors) in MQL5 and C++ for highly liquid markets like XAUUSD and Bitcoin, incorporating hardcoded structural risk controls and execution models — developed with AI assistance.",
            features: [
                "<strong>Liquidity Sweep Logic:</strong> Coded complex volume-aware algorithms that parse order book changes and execute session breakout strategies within milliseconds.",
                "<strong>Account-Level Safeguards:</strong> Hardcoded active drawdown shields, max equity exposure thresholds, and dynamic spread filters to mitigate execution slip.",
                "<strong>High-Precision Backtesting:</strong> Ran extensive tick-data simulations covering multiple market cycles with a verified 99.9% modeling quality.",
                "<strong>Webhook Alert Pipeline:</strong> Integrated custom execution updates connected to external analytical servers via standard web requests."
            ],
            futureScope: [
                "<strong>Adaptive Volatility Scaling:</strong> Leverage real-time volatility index metrics (ATR / VIX) to dynamically adjust leverage and lot allocation on the fly.",
                "<strong>GPU Simulation:</strong> Transition historical quantitative testing to GPU-accelerated environments to speed up strategy parameters discovery.",
                "<strong>Broker Routing Mesh:</strong> Build a low-latency bridge to route client orders concurrently across multiple liquidity providers for best execution."
            ]
        },
        {
            title: "YouTuber TTS: Automated Video Creation Suite",
            tag: "Media Automation",
            image: "screenshots/project4.png",
            tech: ["Python", "TTS Engines", "Shutterstock API", "Translation APIs"],
            description: "Built a Python-based software suite that automates professional video creation workflows end-to-end — from raw assets to fully synchronized, publish-ready video content. YouTuber TTS bridges the gap between text scripting and complete video production by integrating dynamic translation, voice synthesis, and visual media curation.",
            features: [
                "<strong>Smart Semantic Curation:</strong> Integrates stock media platform APIs (Shutterstock) to retrieve relevant stock footage automatically based on natural language processing of the input script.",
                "<strong>High-Fidelity TTS Engines:</strong> Programmed multi-voice speech synthesis using advanced neural TTS API providers, producing natural voiceovers.",
                "<strong>Precise Audio-Visual Syncing:</strong> Built automated video rendering scripts that align subtitles, background music tracks, and voice streams down to millisecond precision.",
                "<strong>Dynamic Localization:</strong> Integrated real-time translation APIs to localize scripts into multiple languages simultaneously, generating localized audio and video variants."
            ],
            futureScope: [
                "<strong>Voice Style Transfer:</strong> Develop local models to clone specific creator voices from minimal audio samples, enabling customized vocal branding.",
                "<strong>Generative Visual Assets:</strong> Integrate local stable diffusion pipelines to generate custom vector graphics and animations when relevant stock media is missing.",
                "<strong>Automated A/B Thumbnails:</strong> Embed dynamic thumbnail render engines that generate click-optimized variants based on high-performing YouTube trends."
            ]
        },
        {
            title: "Scenic Steps — YouTube Channel",
            tag: "Digital Content",
            image: "screenshots/project5.png",
            tech: ["YouTube", "Video Production", "Content Strategy", "SEO"],
            description: "Founded and manage a digital content platform dedicated to producing high-quality, immersive 'Slow TV' walking tour experiences for a global audience. The channel acts as a real-world testing ground for my media automation tools, demonstrating the power of automated metadata, publishing pipelines, and localized content delivery.",
            features: [
                "<strong>High-Definition Production:</strong> Film, edit, and deliver premium, long-form walking tours across historic and scenic destinations.",
                "<strong>Pipeline Localization:</strong> Utilize the custom YouTuber TTS automation suite to translate video titles, descriptions, and tags for global reach.",
                "<strong>Automated Scheduling:</strong> Developed Python scripts to manage uploading schedules, custom descriptions, and comment loops.",
                "<strong>SEO Analytics Optimization:</strong> Programmed custom trackers to scrape query trends, adjusting metadata structures to maximize organic YouTube search rankings."
            ],
            futureScope: [
                "<strong>8K Cinematic Walkthroughs:</strong> Upgrade capturing and rendering pipelines to full 8K HDR 60FPS to capture ultra-high-fidelity landscapes.",
                "<strong>WebXR Interactive Tours:</strong> Build a companion web interface hosting immersive 360-degree interactive WebXR videos for virtual reality headsets.",
                "<strong>Dynamic Branching Walks:</strong> Create interactive YouTube videos where the audience can select the next turn or direction of the tour in real-time."
            ]
        },
        {
            title: "Privacy-First Local AI Desktop Companion",
            tag: "Local AI / LLM Engineering",
            image: "screenshots/project6.png",
            tech: ["Python", "Llama 3 (Meta)", "llama.cpp / Ollama", "Vector Databases", "Whisper STT/TTS", "Bash / OS Automation"],
            description: "Engineered a fully local, privacy-first desktop AI companion utilizing Meta's Llama architecture (Llama 3 / 3.1) to handle complex system interactions, long-term contextual memory, and task automation without any external cloud dependency. Designed for developers who require assistant capabilities without exposing proprietary code to commercial APIs.",
            features: [
                "<strong>Offline Inference:</strong> Configured quantized Llama weights (GGUF format) running locally via Ollama and llama.cpp, utilizing 64k token context sizes and hardware layer offloading.",
                "<strong>Semantic Memory Loop:</strong> Implemented a persistent retrieval-augmented generation (RAG) pipeline storing chat history and custom documentation in ChromaDB.",
                "<strong>Agentic Tool Calling:</strong> Built a function-calling execution loop, enabling the model to write and execute scripts, search directories, and fetch local system stats safely.",
                "<strong>Voice Interface:</strong> Deployed a local Whisper engine for real-time speech-to-text, paired with a lightweight TTS engine to create a hands-free conversational interface."
            ],
            futureScope: [
                "<strong>Peer-to-Peer Model Mesh:</strong> Orchestrate model workloads across a local home network, sharing GPU memory layers between local devices.",
                "<strong>Visual Context Analysis:</strong> Deployed local multimodal vision models to enable the companion to inspect screenshot context and aid in UI debugging.",
                "<strong>Automated Code Refactoring:</strong> Build Git-hook integrated agents that run offline code audits, highlighting vulnerabilities before commits."
            ]
        }
    ];

    const modal = document.getElementById('project-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalTech = document.getElementById('modal-tech-stack');
    const modalDesc = document.getElementById('modal-description');
    const modalFeatures = document.getElementById('modal-features');
    const modalFuture = document.getElementById('modal-future-scope');
    const modalClose = document.querySelector('.project-modal-close');

    function openModal(projectId) {
        const data = PROJECTS_DATA[projectId];
        if (!data) return;

        // Populate details
        modalImg.src = data.image;
        modalImg.alt = data.title;
        modalTag.textContent = data.tag;
        modalTitle.textContent = data.title;
        modalDesc.innerHTML = data.description;

        // Tech stack
        modalTech.innerHTML = '';
        data.tech.forEach(t => {
            const span = document.createElement('span');
            span.textContent = t;
            modalTech.appendChild(span);
        });

        // Features list
        modalFeatures.innerHTML = '';
        data.features.forEach(f => {
            const li = document.createElement('li');
            li.innerHTML = f;
            modalFeatures.appendChild(li);
        });

        // Future scope list
        modalFuture.innerHTML = '';
        data.futureScope.forEach(fs => {
            const li = document.createElement('li');
            li.innerHTML = fs;
            modalFuture.appendChild(li);
        });

        // Activate Modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');
        
        // Reset scroll position of modal body
        document.querySelector('.project-modal-body').scrollTop = 0;
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    // Attach click events to screenshots & buttons
    document.querySelectorAll('.project-card').forEach(card => {
        const projectId = card.getAttribute('data-project-id');
        
        // Screenshot click
        const screenshot = card.querySelector('.project-screenshot');
        if (screenshot) {
            screenshot.addEventListener('click', () => {
                openModal(projectId);
            });
        }

        // Details link click
        const detailsBtn = card.querySelector('.view-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(projectId);
            });
        }
    });

    // Close handlers
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Scale custom cursor on modal interactive elements
    function bindCursorEffects() {
        const interactives = document.querySelectorAll('.project-modal-close, .project-modal-body a, .project-modal-body span, .view-details-btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.style.transform += ' scale(2)';
                cursorRing.style.width = '60px';
                cursorRing.style.height = '60px';
                cursorRing.style.borderColor = 'rgba(34,211,238,0.6)';
                cursorRing.style.marginTop = '-12px';
                cursorRing.style.marginLeft = '-12px';
            });
            el.addEventListener('mouseleave', () => {
                cursorRing.style.width = '36px';
                cursorRing.style.height = '36px';
                cursorRing.style.borderColor = 'rgba(99,102,241,0.5)';
                cursorRing.style.marginTop = '0';
                cursorRing.style.marginLeft = '0';
            });
        });
    }
    bindCursorEffects();
});
