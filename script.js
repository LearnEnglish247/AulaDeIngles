const toggle=document.querySelector('.menu-toggle');
const panel=document.querySelector('.mobile-panel');
if(toggle&&panel){
  toggle.addEventListener('click',()=>{
    const open=panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));
    document.body.classList.toggle('menu-open',open);
  });
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded','false');
    document.body.classList.remove('menu-open');
  }));
  document.addEventListener('click',e=>{
    if(panel.classList.contains('open')&&!panel.contains(e.target)&&!toggle.contains(e.target)){
      panel.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      document.body.classList.remove('menu-open');
    }
  });
}

if(document.querySelector('.sticky-mobile-cta')){
  document.body.classList.add('has-sticky-cta');
}

(function(){
  const links=[...document.querySelectorAll('.side-link[data-section]')];
  if(!links.length) return;
  const ids=links.map(l=>l.getAttribute('data-section'));
  const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
  if(!sections.length) return;

  const setActive=id=>{
    links.forEach(l=>{
      const on=l.getAttribute('data-section')===id;
      l.classList.toggle('active',on);
      if(on) l.setAttribute('aria-current','true');
      else l.removeAttribute('aria-current');
    });
  };

  const io=new IntersectionObserver(entries=>{
    const visible=entries
      .filter(e=>e.isIntersecting)
      .sort((a,b)=>b.intersectionRatio-a.intersectionRatio);
    if(visible[0]) setActive(visible[0].target.id);
  },{rootMargin:'-20% 0px -55% 0px',threshold:[0.1,0.25,0.5]});

  sections.forEach(s=>io.observe(s));

  if(location.hash){
    const id=location.hash.slice(1);
    if(ids.includes(id)) setActive(id);
  } else {
    setActive(ids[0]);
  }

  document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href=a.getAttribute('href')||'';
      const hash=href.includes('#')?href.split('#')[1]:'';
      const target=hash&&document.getElementById(hash);
      if(target && (href.startsWith('#') || (href.startsWith('/#') && location.pathname==='/'))){
        e.preventDefault();
        target.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
        history.pushState(null,'','#'+hash);
        setActive(hash);
      }
    });
  });
})();
