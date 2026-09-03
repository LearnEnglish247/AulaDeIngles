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

/* Contact form: Worker first, mailto fallback. Never expose private Gmail. */
(function(){
  const form=document.getElementById('contact-form');
  if(!form) return;
  const status=document.getElementById('form-status');
  const endpoint=(window.CONTACT_FORM_ENDPOINT||'/api/contact').replace(/\/$/,'');
  const toEmail='info@englishstudy.club';

  function setStatus(msg,kind){
    if(!status) return;
    status.textContent=msg;
    status.classList.remove('form-status-ok','form-status-err');
    if(kind) status.classList.add(kind);
  }

  function mailtoFallback(data){
    const subject=encodeURIComponent('Solicitud de información — Aula de Inglés Nava');
    const body=encodeURIComponent(
      `Nombre: ${data.name}\nEmail: ${data.email}\nPerfil: ${data.profile}\nLocalidad: ${data.locality||'—'}\n\nMensaje:\n${data.message}`
    );
    window.location.href=`mailto:${toEmail}?subject=${subject}&body=${body}`;
  }

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const fd=new FormData(form);
    if(fd.get('website')) return; // honeypot
    if(!form.reportValidity()) return;

    const data={
      name:String(fd.get('name')||'').trim(),
      email:String(fd.get('email')||'').trim(),
      profile:String(fd.get('profile')||'').trim(),
      locality:String(fd.get('locality')||'').trim(),
      message:String(fd.get('message')||'').trim(),
      consent: !!fd.get('consent'),
      source: location.pathname,
      sentAt: new Date().toISOString()
    };

    const btn=form.querySelector('button[type="submit"]');
    if(btn){btn.disabled=true;btn.textContent='Enviando…';}
    setStatus('Enviando solicitud…');

    try{
      const res=await fetch(endpoint,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(data)
      });
      if(!res.ok) throw new Error('endpoint-failed');
      setStatus('Solicitud enviada. Te responderemos a la mayor brevedad en '+toEmail+'.','form-status-ok');
      form.reset();
    }catch(_err){
      setStatus('El envío automático no está disponible todavía. Abriendo tu correo para enviar a '+toEmail+'…','form-status-err');
      mailtoFallback(data);
    }finally{
      if(btn){btn.disabled=false;btn.textContent='Enviar solicitud';}
    }
  });
})();
