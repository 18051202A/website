// ===== SECTION NAVIGATION =====
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
const docSections = document.querySelectorAll('.doc-section');
const breadcrumbSection = document.getElementById('breadcrumbSection');
const breadcrumbPage = document.getElementById('breadcrumbPage');
const tocList = document.getElementById('tocList');

// Section group mapping for breadcrumb
const sectionGroups = {
    'introduction': 'Getting Started',
    'quickstart': 'Getting Started',
    'authentication': 'Getting Started',
    'rate-limits': 'Getting Started',
    'geolocation': 'Core Concepts',
    'imagery': 'Core Concepts',
    'monitoring': 'Core Concepts',
    'ai-detection': 'Core Concepts',
    'api-overview': 'API Reference',
    'api-geolocation': 'API Reference',
    'api-imagery': 'API Reference',
    'api-zones': 'API Reference',
    'api-analysis': 'API Reference',
    'api-webhooks': 'API Reference',
    'guide-first-query': 'Guides',
    'guide-monitoring': 'Guides',
    'guide-exports': 'Guides',
    'guide-integrations': 'Guides',
    'changelog': 'Resources',
    'status': 'Resources',
    'support': 'Resources',
};

// Section display names for breadcrumb
const sectionNames = {
    'introduction': 'Introduction',
    'quickstart': 'Quick Start',
    'authentication': 'Authentication',
    'rate-limits': 'Rate Limits',
    'geolocation': 'Geolocation Engine',
    'imagery': 'Satellite Imagery',
    'monitoring': 'Zone Monitoring',
    'ai-detection': 'AI Detection',
    'api-overview': 'Overview',
    'api-geolocation': 'Geolocation',
    'api-imagery': 'Imagery',
    'api-zones': 'Zones',
    'api-analysis': 'Analysis',
    'api-webhooks': 'Webhooks',
    'guide-first-query': 'Your First Query',
    'guide-monitoring': 'Setting Up Monitoring',
    'guide-exports': 'Exporting Reports',
    'guide-integrations': 'Integrations',
    'changelog': 'Changelog',
    'status': 'System Status',
    'support': 'Support',
};

function activateSection(sectionId) {
    // Hide all sections
    docSections.forEach((s) => s.classList.remove('active'));

    // Show target section
    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.add('active');
        buildToc(target);
    }

    // Update sidebar active link
    sidebarLinks.forEach((link) => {
        link.classList.toggle('active', link.dataset.section === sectionId);
    });

    // Update breadcrumb
    if (breadcrumbSection) breadcrumbSection.textContent = sectionGroups[sectionId] || 'Docs';
    if (breadcrumbPage) breadcrumbPage.textContent = sectionNames[sectionId] || sectionId;

    // Update URL hash without scrolling
    history.replaceState(null, '', `#${sectionId}`);

    // Scroll main area to top
    const main = document.getElementById('docsMain');
    if (main) main.scrollTop = 0;
    window.scrollTo({ top: 0 });
}

// Build right-side TOC from h2s in the active section
function buildToc(section) {
    if (!tocList) return;
    tocList.innerHTML = '';
    const headings = section.querySelectorAll('.doc-h2');
    headings.forEach((h) => {
        const id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        h.id = id;
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${id}`;
        a.textContent = h.textContent;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            h.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Activate in toc
            tocList.querySelectorAll('a').forEach((l) => l.classList.remove('toc-active'));
            a.classList.add('toc-active');
        });
        li.appendChild(a);
        tocList.appendChild(li);
    });
}

// Attach click handlers to sidebar links
sidebarLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        activateSection(link.dataset.section);
        // Close mobile sidebar if open
        const sidebar = document.getElementById('docsSidebar');
        if (sidebar) sidebar.classList.remove('open');
    });
});

// Attach click handlers to in-content nav links
document.addEventListener('click', (e) => {
    const link = e.target.closest('.doc-nav-prev, .doc-nav-next');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
        e.preventDefault();
        activateSection(href.slice(1));
    }
});

// Load section from URL hash on page load
function loadInitialSection() {
    const hash = window.location.hash.slice(1);
    const validSection = hash && document.getElementById(hash);
    activateSection(validSection ? hash : 'introduction');
}

loadInitialSection();

// ===== COPY BUTTON =====
document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const codeEl = document.getElementById(targetId);
        if (!codeEl) return;

        // Get plain text (strip HTML tags)
        const text = codeEl.textContent || codeEl.innerText;
        navigator.clipboard.writeText(text.trim()).then(() => {
            const orig = btn.innerHTML;
            btn.classList.add('copied');
            btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8l4 4 6-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied`;
            setTimeout(() => {
                btn.classList.remove('copied');
                btn.innerHTML = orig;
            }, 2000);
        });
    });
});

// ===== DOCS SEARCH (basic filter) =====
const searchInput = document.getElementById('docsSearch');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        sidebarLinks.forEach((link) => {
            const text = link.textContent.toLowerCase();
            const li = link.closest('li');
            if (li) li.style.display = query && !text.includes(query) ? 'none' : '';
        });

        // Show/hide group labels based on visible items
        document.querySelectorAll('.nav-group').forEach((group) => {
            const visible = Array.from(group.querySelectorAll('li')).some(
                (li) => li.style.display !== 'none'
            );
            group.style.display = visible ? '' : 'none';
        });
    });
}

// ===== MOBILE SIDEBAR TOGGLE =====
const mobileToggle = document.getElementById('mobileToggle');
const docsSidebar = document.getElementById('docsSidebar');

if (mobileToggle && docsSidebar) {
    mobileToggle.addEventListener('click', () => {
        docsSidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (
            docsSidebar.classList.contains('open') &&
            !docsSidebar.contains(e.target) &&
            !mobileToggle.contains(e.target)
        ) {
            docsSidebar.classList.remove('open');
        }
    });
}

// ===== KEYBOARD SHORTCUT (⌘K / Ctrl+K) for search =====
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput && searchInput.focus();
    }
});
