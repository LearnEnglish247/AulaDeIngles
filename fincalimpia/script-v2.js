const BUSINESS_CONFIG = {
  phoneDisplay: '+34 644 852 762',
  phoneInternational: '34644852762',
  whatsappMessage: 'Hola, me gustaría pedir presupuesto para cortar, desbrozar o limpiar una finca o jardín. Puedo enviar fotos.'
};

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu');

if (menuButton && menu) {
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const whatsappHref = `https://wa.me/${BUSINESS_CONFIG.phoneInternational}?text=${encodeURIComponent(BUSINESS_CONFIG.whatsappMessage)}`;

document.querySelectorAll('[data-whatsapp-link]').forEach((link) => {
  link.href = whatsappHref;
  link.target = '_blank';
  link.rel = 'noopener';
});
