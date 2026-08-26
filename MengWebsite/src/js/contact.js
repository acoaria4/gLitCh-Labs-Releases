export function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;

  const status = form.querySelector("[data-form-status]");
  const email = "glitchlabsio@gmail.com";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const from = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !from || !message) {
      if (status) {
        status.dataset.state = "error";
        status.textContent = "Please fill in name, email, and message.";
      }
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
      if (status) {
        status.dataset.state = "error";
        status.textContent = "Enter a valid email address.";
      }
      return;
    }

    const subject = encodeURIComponent(`gLitCh Labs — message from ${name}`);
    const body = encodeURIComponent(`From: ${name} <${from}>\n\n${message}`);
    const href = `mailto:${email}?subject=${subject}&body=${body}`;

    if (status) {
      status.dataset.state = "ready";
      status.textContent = "Opening your email client…";
    }

    window.location.href = href;
  });
}
