'use strict';
document.getElementById('year').textContent = new Date().getFullYear();
const header = document.querySelector('.nav');
const menu = document.querySelector('.menu-toggle');
function closeMenu() {
  header.classList.remove('menu-open');
  menu.setAttribute('aria-expanded', 'false');
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  header.classList.toggle('menu-open', open);
  menu.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('#main-nav a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => { if (!header.contains(event.target)) closeMenu(); });
const groups = [...document.querySelectorAll('.work-group')];
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    let count = 0;
    groups.forEach(group => {
      group.hidden = filter !== 'all' && group.dataset.category !== filter;
      if (!group.hidden) count++;
    });
    document.getElementById('filter-status').textContent = filter === 'all' ? `显示全部 ${count} 个系列` : `显示${button.textContent} · ${count} 个系列`;
  });
});
const links = [...document.querySelectorAll('#main-nav a')];
const sections = links.map(link => document.querySelector(link.getAttribute('href')));
let scheduled = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress').style.width = `${max > 0 ? Math.min(100, scrollY / max * 100) : 0}%`;
  let current = null;
  sections.forEach(section => { if (section.getBoundingClientRect().top <= 160) current = section.id; });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 10) current = 'contact';
  links.forEach(link => {
    if (link.hash === `#${current}`) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  scheduled = false;
}
addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
addEventListener('resize', () => { if (innerWidth > 600) closeMenu(); updateScroll(); });
updateScroll();
document.getElementById('copy-wechat').addEventListener('click', async () => {
  const status = document.getElementById('copy-status');
  try {
    await navigator.clipboard.writeText('OnceYearnedForLight');
    status.textContent = '微信号已复制';
  } catch {
    status.textContent = '请长按或选中上方微信号复制';
  }
});
