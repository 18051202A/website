// ===== BILLING TOGGLE =====
const billingToggle = document.getElementById('billingToggle');
const labelMonthly = document.getElementById('label-monthly');
const labelAnnual = document.getElementById('label-annual');
const priceAmounts = document.querySelectorAll('.price-amount[data-monthly]');

let isAnnual = false;

if (billingToggle) {
    billingToggle.addEventListener('click', () => {
        isAnnual = !isAnnual;
        billingToggle.classList.toggle('on', isAnnual);

        labelMonthly.classList.toggle('active', !isAnnual);
        labelAnnual.classList.toggle('active', isAnnual);

        priceAmounts.forEach((el) => {
            const monthly = el.dataset.monthly;
            const annual = el.dataset.annual;
            const target = parseFloat(isAnnual ? annual : monthly);

            // Animate price change
            const current = parseFloat(el.textContent);
            const duration = 400;
            const startTime = performance.now();

            function update(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = current + (target - current) * eased;
                el.textContent = Math.round(value);
                if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
        });
    });

    // Set initial active state
    labelMonthly.classList.add('active');
}

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        const answer = btn.nextElementSibling;

        // Close all
        document.querySelectorAll('.faq-question').forEach((b) => {
            b.setAttribute('aria-expanded', 'false');
            b.nextElementSibling.classList.remove('open');
        });

        // Open clicked if it was closed
        if (!expanded) {
            btn.setAttribute('aria-expanded', 'true');
            answer.classList.add('open');
        }
    });
});

// ===== PRICING CARD TILT EFFECT =====
document.querySelectorAll('.pricing-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = (y - cy) / cy * -2.5;
        const ry = (x - cx) / cx * 2.5;
        const isFeatured = card.classList.contains('pricing-card--featured');
        const baseScale = isFeatured ? 'scale(1.02) ' : '';
        card.style.transform = `${baseScale}translateY(-6px) perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });

    card.addEventListener('mouseleave', () => {
        const isFeatured = card.classList.contains('pricing-card--featured');
        card.style.transform = isFeatured ? 'scale(1.02)' : '';
    });
});
