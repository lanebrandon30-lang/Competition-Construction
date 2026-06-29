window.addEventListener("load", () => {
    const overlay = document.querySelector(".overlay");
    if (overlay) {
        overlay.style.opacity = "1";
    }

    const year = document.querySelector("[data-year]");
    if (year) {
        year.textContent = new Date().getFullYear();
    }

    const menuBtn = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", () => {
            navMenu.classList.toggle("active");
        });
    }

    // Contact form handling: try to POST to a configured endpoint (e.g., Formspree).
    const contactForm = document.getElementById('contactForm');
    const feedback = document.getElementById('contactFeedback');
    if (contactForm) {
        const replyInput = document.getElementById('_replyto');
        const emailField = document.getElementById('email');
        if (emailField && replyInput) {
            emailField.addEventListener('input', () => replyInput.value = emailField.value);
        }

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (feedback) feedback.textContent = 'Sending...';

            const endpoint = contactForm.dataset.endpoint || '';
            const formData = new FormData(contactForm);

            // If endpoint is not configured (placeholder), fall back to mailto (opens user's email client)
            if (!endpoint.includes('formspree.io') || endpoint.includes('REPLACE_WITH_YOUR_ID')) {
                const name = formData.get('name') || '';
                const email = formData.get('email') || '';
                const message = formData.get('message') || '';
                const subject = encodeURIComponent('Website contact: ' + name);
                const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
                window.location.href = `mailto:CompetitionConstruction@gmail.com?subject=${subject}&body=${body}`;
                if (feedback) feedback.textContent = 'Opening your email client to send the message.';
                return;
            }

            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (res.ok) {
                    if (feedback) feedback.textContent = 'Message sent — thank you!';
                    contactForm.reset();
                } else {
                    // fallback to mailto on failure
                    if (feedback) feedback.textContent = 'Submission failed — opening email client as fallback.';
                    const name = formData.get('name') || '';
                    const email = formData.get('email') || '';
                    const message = formData.get('message') || '';
                    const subject = encodeURIComponent('Website contact: ' + name);
                    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
                    window.location.href = `mailto:CompetitionConstruction@gmail.com?subject=${subject}&body=${body}`;
                }
            } catch (err) {
                if (feedback) feedback.textContent = 'Network error — opening email client as fallback.';
                const name = formData.get('name') || '';
                const email = formData.get('email') || '';
                const message = formData.get('message') || '';
                const subject = encodeURIComponent('Website contact: ' + name);
                const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
                window.location.href = `mailto:CompetitionConstruction@gmail.com?subject=${subject}&body=${body}`;
            }
        });
    }
});