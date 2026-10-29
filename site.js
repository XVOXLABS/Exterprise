(() => {
  // Motion switch: false = full motion for everyone (designer review). Set to matchMedia('(prefers-reduced-motion: reduce)').matches to honour the OS setting.
  window.__CALM = false;
  /* ===================== v7.4 Contact pop-up — every "Talk to Us" / contact CTA opens it ===================== */
  (() => {
    const EMAIL = 'contact@exterprise.us';
    const ARW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    const TOPICS = ['ServiceNow implementation', 'AI Agents & Now Assist', 'ITSM · CSM · HRSD', 'Integration & migration', 'Managed support', 'Something else'];
    let m = document.getElementById('xt-modal');
    if (!m) {
      m = document.createElement('div'); m.id = 'xt-modal'; m.className = 'xm'; m.setAttribute('aria-hidden', 'true');
      m.innerHTML = `
      <div class="xm-scrim" data-xm-close></div>
      <div class="xm-dialog" role="dialog" aria-modal="true" aria-labelledby="xm-title" tabindex="-1">
        <button class="xm-x" type="button" data-xm-close aria-label="Close contact form"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
        <aside class="xm-side">
          <div class="xm-aura" aria-hidden="true"><i></i><i></i><i></i></div>
          <span class="xm-chip"><i></i>ServiceNow Premier Partner</span>
          <h2 class="xm-h" id="xm-title"><span>Let's</span> <span>Talk!</span></h2>
          <p class="xm-lede">Talk to a ServiceNow architect about AI Agents, Now Assist, or your next implementation.</p>
          <ul class="xm-steps" aria-label="What happens next">
            <li><b>01</b><span>Tell us what you're solving</span></li>
            <li><b>02</b><span>An architect reviews it</span></li>
            <li><b>03</b><span>We set up a working session</span></li>
          </ul>
          <a class="xm-mail" href="mailto:${EMAIL}"><span>Prefer email?</span>${EMAIL}</a>
        </aside>
        <form class="xm-form" novalidate>
          <div class="xm-pane xm-fill">
            <p class="xm-kick">Send a Message</p>
            <div class="xm-grid">
              <label class="xm-f"><input name="name" autocomplete="name" required placeholder=" "><span>Full name</span><em>Please enter your name</em></label>
              <label class="xm-f"><input name="email" type="email" autocomplete="email" required placeholder=" "><span>Work email</span><em>Enter a valid email address</em></label>
              <label class="xm-f"><input name="company" autocomplete="organization" placeholder=" "><span>Company</span></label>
              <label class="xm-f"><input name="phone" type="tel" autocomplete="tel" placeholder=" "><span>Phone <small>(optional)</small></span></label>
            </div>
            <fieldset class="xm-topics"><legend>What can we help with?</legend>
              ${TOPICS.map((t, i) => `<label class="xm-tp"><input type="checkbox" name="topic" value="${t}"><span>${t}</span></label>`).join('')}
            </fieldset>
            <label class="xm-f xm-ta"><textarea name="message" rows="4" placeholder=" "></textarea><span>Tell us a little about your project</span></label>
            <input type="hidden" name="source">
            <div class="xm-foot">
              <p class="xm-note">We reply within one business day.</p>
              <button class="neo neo-btn neo-white xm-send" type="submit"><span class="neo-t">Send Message</span><span class="neo-ic">${ARW}</span></button>
            </div>
          </div>
          <div class="xm-pane xm-done" aria-live="polite">
            <span class="xm-tick" aria-hidden="true"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24"/><path d="M15 27l7 7 15-16"/></svg></span>
            <h3>Thank you<span class="xm-who"></span>.</h3>
            <p class="xm-done-p">Your message is on its way. A ServiceNow architect will get back to you within one business day.</p>
            <button class="neo neo-btn neo-ghost" type="button" data-xm-close><span class="neo-t">Close</span><span class="neo-ic">${ARW}</span></button>
          </div>
        </form>
      </div>`;
      document.body.appendChild(m);
      const dlg = m.querySelector('.xm-dialog'), form = m.querySelector('form');
      let last = null;
      const focusables = () => [...dlg.querySelectorAll('button,input,textarea,a[href]')].filter(x => x.offsetParent !== null);
      const open = (src, preset) => {
        last = document.activeElement;
        form.classList.remove('sent', 'sending'); form.reset();
        form.querySelectorAll('.bad').forEach(x => x.classList.remove('bad'));
        form.elements['source'].value = src || document.title;
        if (preset) form.querySelectorAll('input[name=topic]').forEach(c => { c.checked = c.value === preset; });
        m.classList.add('open'); m.setAttribute('aria-hidden', 'false'); document.documentElement.classList.add('xm-lock');
        if (window.__lenis) window.__lenis.stop();
        setTimeout(() => form.elements['name'].focus({ preventScroll: true }), 380);
      };
      const close = () => {
        if (!m.classList.contains('open')) return;
        m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); document.documentElement.classList.remove('xm-lock');
        if (window.__lenis) window.__lenis.start();
        if (last && last.focus) last.focus({ preventScroll: true });
      };
      window.__xtContact = { open, close };
      m.addEventListener('click', e => { if (e.target.closest('[data-xm-close]')) close(); });
      document.addEventListener('keydown', e => {
        if (!m.classList.contains('open')) return;
        if (e.key === 'Escape') { e.stopPropagation(); close(); }
        if (e.key === 'Tab') { const f = focusables(); if (!f.length) return; const a = f[0], z = f[f.length - 1];
          if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); } }
      }, true);
      // pointer-follow glow on the dialog
      dlg.addEventListener('pointermove', e => { const r = dlg.getBoundingClientRect(); dlg.style.setProperty('--px', (e.clientX - r.left) + 'px'); dlg.style.setProperty('--py', (e.clientY - r.top) + 'px'); });
      form.addEventListener('input', e => { const f = e.target.closest('.xm-f'); if (f) f.classList.remove('bad'); });
      form.addEventListener('submit', async e => {
        e.preventDefault();
        let ok = true;
        const need = [[form.elements['name'], v => v.trim().length > 1], [form.elements['email'], v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())]];
        need.forEach(([el, t]) => { const bad = !t(el.value); el.closest('.xm-f').classList.toggle('bad', bad); if (bad && ok) { el.focus(); ok = false; } });
        if (!ok) return;
        const d = new FormData(form); const topics = d.getAll('topic').join(', ');
        form.classList.add('sending');
        const ep = window.XT_FORM_ENDPOINT;   // set to a Formspree / HubSpot / ServiceNow endpoint before launch
        try {
          if (ep) { await fetch(ep, { method: 'POST', headers: { Accept: 'application/json' }, body: d }); }
          else {
            const body = `Name: ${d.get('name')}\nEmail: ${d.get('email')}\nCompany: ${d.get('company') || '-'}\nPhone: ${d.get('phone') || '-'}\nTopics: ${topics || '-'}\nPage: ${d.get('source')}\n\n${d.get('message') || ''}`;
            const a = document.createElement('a'); a.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Website enquiry from ' + (d.get('company') || d.get('name')))}&body=${encodeURIComponent(body)}`;
            if (!window.__PREVIEW) a.click();
            await new Promise(r => setTimeout(r, 700));
          }
        } catch (err) {}
        m.querySelector('.xm-who').textContent = d.get('name') ? ', ' + String(d.get('name')).trim().split(/\s+/)[0] : '';
        form.classList.remove('sending'); form.classList.add('sent');
        setTimeout(() => m.querySelector('.xm-done [data-xm-close]').focus({ preventScroll: true }), 500);
      });
    }
    // wire every contact CTA on the current page (re-run safe)
    const PRE = [[/ai agents|now assist/i, 'AI Agents & Now Assist'], [/service management|hr service|customer service|itsm|csm|hrsd/i, 'ITSM · CSM · HRSD'], [/servicenow|platform|otto|control tower|operations|portfolio|governance|cmdb|field service/i, 'ServiceNow implementation']];
    document.querySelectorAll('a[href="#contact"], a[href*="contact-us"], [data-contact]').forEach(a => {
      if (a.dataset.xm) return; a.dataset.xm = '1'; a.setAttribute('aria-haspopup', 'dialog');
      a.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const ctx = (a.textContent + ' ' + document.title);
        const hit = PRE.find(([rx]) => rx.test(ctx));
        document.querySelector('.mega.open') && document.querySelector('[data-mega][aria-expanded="true"]')?.click();
        window.__xtContact.open(document.title, hit ? hit[1] : null);
      });
    });
  })();

  // Services mega menu (desktop button + mobile menu button share one panel)
  const mega = document.getElementById('mega');
  const toggles = [...document.querySelectorAll('[data-mega]')];
  const setOpen = (open) => {
    mega.classList.toggle('open', open);
    toggles.forEach(b => b.setAttribute('aria-expanded', String(open)));
    document.body.style.overflow = open && matchMedia('(max-width:900px)').matches ? 'hidden' : '';
  };
  toggles.forEach(b => b.addEventListener('click', e => { e.stopPropagation(); setOpen(!mega.classList.contains('open')); }));
  document.addEventListener('click', e => { if (mega.classList.contains('open') && !mega.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mega.classList.contains('open')) { setOpen(false); toggles[0]?.focus(); } });
  mega.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

  // Reveal on scroll
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Count-up stats
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
    if (window.__CALM) return;
    const t0 = performance.now(), dur = 1400;
    const tick = t => { const p = Math.min(1, (t - t0) / dur), v = end * (1 - Math.pow(1 - p, 3)); el.textContent = v.toFixed(dec); if (p < 1) requestAnimationFrame(tick); };
    el.textContent = (0).toFixed(dec); requestAnimationFrame(tick);
  }), { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(el => { if (!el.closest('.sc')) cio.observe(el); });

  // Card spotlight follows pointer
  document.querySelectorAll('.card').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // Trust marquee pause
  const pb = document.querySelector('.pause-btn'), mq = document.querySelector('.marquee');
  pb?.addEventListener('click', () => { const p = mq.classList.toggle('paused'); pb.setAttribute('aria-pressed', String(p)); pb.setAttribute('aria-label', p ? 'Play logo strip' : 'Pause logo strip'); pb.innerHTML = p ? pb.dataset.play : pb.dataset.pause; });

  // Slider buttons
  const sl = document.querySelector('.slider');
  document.querySelectorAll('[data-slide]').forEach(b => b.addEventListener('click', () => {
    const w = sl.querySelector('.slide').getBoundingClientRect().width + 20; sl.scrollBy({ left: b.dataset.slide === 'next' ? w : -w, behavior: 'smooth' });
  }));

  // On-this-page active state
  const links = [...document.querySelectorAll('.toc a[href^="#"]')];
  if (links.length) {
    const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.hash === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')); }), { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(a => { const t = document.querySelector(a.hash); if (t) so.observe(t); });
  }

  /* ===================== Hero light ribbons (original WebGL shader, logo palette) ===================== */
  document.querySelectorAll('.lx-canvas').forEach(cv => {
    if (cv.dataset.on) return; cv.dataset.on = '1';
    const gl = cv.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) { cv.closest('.lx-hero').classList.add('no-webgl'); return; }
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision highp float;
uniform vec2 R;uniform float T;uniform vec2 M;
// logo palette: amber #F39C1A, red #E41824, navy #181848 (lifted), white-hot cores
const vec3 AMBER=vec3(0.953,0.612,0.102);
const vec3 RED=vec3(0.894,0.094,0.141);
const vec3 NAVY=vec3(0.094,0.094,0.282);
const vec3 NAVYL=vec3(0.42,0.44,0.95);
const vec3 HOT=vec3(1.0,0.93,0.86);
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float ribbon(vec2 p,float off,float w,float sp,float ph){
  float twist=0.55+0.45*cos(p.x*1.15-T*sp*0.9+ph);            // ribbon turning toward/away = spiral twist
  float y=p.y-off-0.10*sin(p.x*1.25+T*sp+ph)-0.035*sin(p.x*3.4-T*sp*1.6+ph*2.);
  float ww=w*(0.35+twist);
  return exp(-(y*y)/(ww*ww));
}
float streak(vec2 p,float k,float sp){return 0.72+0.28*sin(p.x*k+T*sp)*sin(p.x*k*0.37-T*sp*0.6);}
void main(){
  vec2 uv=(gl_FragCoord.xy-0.5*R)/R.y;
  uv+=M*0.03;
  float a=-0.36;                                                // descending diagonal, upper-left to lower-right
  vec2 p=mat2(cos(a),sin(a),-sin(a),cos(a))*uv;
  p.y-=0.16;
  vec3 c=vec3(0.);
  c+=NAVY *1.3*ribbon(p, 0.02,0.20,0.18,0.0);                   // deep navy body
  c+=NAVYL*0.75*ribbon(p, 0.07,0.065,0.22,1.7)*streak(p,14.,0.6);// lavender-navy sheen
  c+=AMBER*1.75*ribbon(p,-0.09,0.085,0.20,3.1)*streak(p,11.,0.5);// amber main band
  c+=RED  *1.20*ribbon(p,-0.19,0.045,0.26,4.4)*streak(p,17.,0.7);// red lower edge
  c+=HOT  *1.35*ribbon(p, 0.035,0.018,0.22,1.7);                // white-hot core along the sheen
  c+=vec3(1.0,0.78,0.6)*0.9*ribbon(p,-0.085,0.02,0.20,3.1);   // peach core inside amber
  // thin far streak, top right
  vec2 q=mat2(cos(-0.08),sin(-0.08),-sin(-0.08),cos(-0.08))*uv;
  float s2=exp(-pow((q.y-0.36-0.02*sin(q.x*2.+T*0.3))/0.012,2.))*smoothstep(-0.1,0.55,q.x);
  c+=mix(RED,AMBER,0.6)*1.4*s2;
  // soft glow top-right corner
  c+=AMBER*0.35*exp(-length(uv-vec2(0.95,0.55))*3.2);
  // fade toward the bottom so headline + logos stay legible
  c*=smoothstep(-0.62,0.05,uv.y);
  c=1.-exp(-c*1.25);                                            // filmic tone map
  c+=(hash(gl_FragCoord.xy+T)-0.5)*0.035;                       // grain
  gl_FragColor=vec4(c,1.);
}`;
    const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
    const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.closest('.lx-hero').classList.add('no-webgl'); return; }
    gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, 'R'), uT = gl.getUniformLocation(pr, 'T'), uM = gl.getUniformLocation(pr, 'M');
    const scale = Math.min(window.devicePixelRatio || 1, 1.5) * 0.75; // soft subject: render below native res for speed
    const size = () => { cv.width = Math.round(cv.clientWidth * scale); cv.height = Math.round(cv.clientHeight * scale); gl.viewport(0, 0, cv.width, cv.height); };
    size(); window.addEventListener('resize', size);
    const m = { x: 0, y: 0, tx: 0, ty: 0 };
    cv.closest('.lx-hero').addEventListener('pointermove', e => { m.tx = e.clientX / innerWidth - .5; m.ty = .5 - e.clientY / innerHeight; });
    const still = window.__CALM;
    let visible = true; new IntersectionObserver(es => visible = es[0].isIntersecting).observe(cv);
    const t0 = performance.now();
    const frame = now => {
      if (!cv.isConnected) return;
      if (visible) { m.x += (m.tx - m.x) * .04; m.y += (m.ty - m.y) * .04;
        gl.uniform2f(uR, cv.width, cv.height); gl.uniform1f(uT, still ? 6.0 : (now - t0) / 1000); gl.uniform2f(uM, m.x, m.y);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); }
      if (!still) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });

  /* ===================== Glass section: ignite glow + bars when in view ===================== */
  document.querySelectorAll('.gx').forEach(g => {
    if (!('IntersectionObserver' in window)) { g.classList.add('lit'); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { g.classList.add('lit'); io.disconnect(); } }), { threshold: .18 });
    io.observe(g.querySelector('.gx-grid') || g);
  });

  /* ===================== Neon glass buttons: fill from entry point ===================== */
  document.querySelectorAll('.neo:not(.neo-card)').forEach(b => {
    const at = e => { const r = b.getBoundingClientRect(); b.style.setProperty('--bx', (e.clientX - r.left) + 'px'); b.style.setProperty('--by', (e.clientY - r.top) + 'px'); };
    b.addEventListener('pointerenter', at); b.addEventListener('pointerleave', at);
  });

  /* ===================== v5 Home: progress line, cursor ring, smooth accordion ===================== */
  if (document.body.classList.contains('px')) {
    const calm = window.__CALM;
    if (!document.querySelector('.px-progress')) {
      const bar = document.createElement('div'); bar.className = 'px-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);
      const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`; };
      addEventListener('scroll', upd, { passive: true }); upd();
    }
    if (!calm && matchMedia('(hover: hover) and (pointer: fine)').matches && !document.querySelector('.px-cursor')) {
      const cur = document.createElement('div'); cur.className = 'px-cursor'; cur.setAttribute('aria-hidden', 'true'); document.body.appendChild(cur);
      let tx = -100, ty = -100, cx = -100, cy = -100;
      addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; cur.classList.add('on');
        cur.classList.toggle('hot', !!e.target.closest('a, button, summary, .gx-card, .px-ph, .px-talk')); }, { passive: true });
      document.addEventListener('pointerleave', () => cur.classList.remove('on'));
      addEventListener('pointerdown', () => cur.classList.add('down')); addEventListener('pointerup', () => cur.classList.remove('down'));
      let lt = performance.now(); const loop = (now = performance.now()) => { if (!cur.isConnected) return; const k = 1 - Math.pow(.8, Math.min(6, (now - lt) / 16.7)); lt = now; cx += (tx - cx) * k; cy += (ty - cy) * k; cur.style.transform = `translate3d(${cx}px,${cy}px,0)`; requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }
    document.querySelectorAll('.px-acc-i').forEach(d => {
      const sum = d.querySelector('summary'), body = d.querySelector('.body');
      sum.addEventListener('click', ev => {
        if (calm || !body.animate) return; ev.preventDefault();
        if (d.open) {
          const h = body.offsetHeight;
          body.animate([{ height: h + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 420, easing: 'cubic-bezier(.22,.8,.2,1)' }).onfinish = () => { d.open = false; };
        } else {
          d.open = true; const h = body.offsetHeight;
          body.animate([{ height: '0px', opacity: 0 }, { height: h + 'px', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.22,.8,.2,1)' });
          body.querySelectorAll('p, .neo').forEach((el, i) => el.animate([{ transform: 'translateY(14px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, delay: 80 + i * 70, easing: 'cubic-bezier(.22,.8,.2,1)', fill: 'backwards' }));
        }
      });
    });
  }

  /* ===================== UtterNow film: autoplay (muted) when it scrolls into view; click plays with sound ===================== */
  document.querySelectorAll('.ut-video[data-yt]:not(.has-file)').forEach(v => {
    const id = v.dataset.yt, play = v.querySelector('.ut-play');
    const mount = (sound) => {
      if (window.__PREVIEW) return false;            // chat preview blocks YouTube frames — keep poster + open on YouTube
      let f = v.querySelector('iframe');
      const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=${sound ? 0 : 1}&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&controls=1`;
      if (!f) { f = document.createElement('iframe'); f.title = 'UtterNow video'; f.referrerPolicy = 'strict-origin-when-cross-origin'; f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; v.prepend(f); }
      f.src = src; f.addEventListener('load', () => v.classList.add('playing'), { once: true }); return true;
    };
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); mount(false); } }, { threshold: .2 }); io.observe(v); }
    play && play.addEventListener('click', ev => { if (mount(true)) ev.preventDefault(); });
  });
  document.querySelectorAll('.ut-h').forEach(h => { const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { setTimeout(() => h.classList.add('lit'), 700); io.disconnect(); } }, { threshold: .6 }); io.observe(h); });

  /* ===================== KPIs: numbers roll in when visible (CSS shows final values if this never runs) ===================== */
  if (!window.__CALM) document.querySelectorAll('.kpis').forEach(k => {
    if (k.dataset.on) return; k.dataset.on = '1';
    const r = k.getBoundingClientRect(); if (r.top < innerHeight * .9 && r.bottom > 0) return;   // already on screen: leave final values
    k.classList.add('arm');
    const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { io.disconnect(); requestAnimationFrame(() => requestAnimationFrame(() => k.classList.add('go'))); } }, { threshold: .35 });
    io.observe(k);
    k.querySelectorAll('.kpi').forEach(li => { let t0 = 0; li.addEventListener('pointerenter', () => { if (!k.classList.contains('go') || Date.now() - t0 < 1400) return; t0 = Date.now();
      li.classList.add('re'); void li.offsetWidth; requestAnimationFrame(() => li.classList.remove('re')); }); });
  });

  /* ===================== UtterNow self-hosted film: play only while on screen (muted autoplay) ===================== */
  document.querySelectorAll('.ut-file').forEach(vid => { vid.muted = true;
    new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) vid.play().catch(() => {}); else vid.pause(); }), { threshold: .2 }).observe(vid); });

  /* ===================== Contour field: topographic light lines from a slow 3D noise (WebGL), gold crest near the pointer ===================== */
  document.querySelectorAll('canvas.topo').forEach(cv => {
    if (cv.dataset.on) return; cv.dataset.on = '1';
    const gl = cv.getContext('webgl', { premultipliedAlpha: true, antialias: true, alpha: true }); if (!gl) return;
    const deriv = gl.getExtension('OES_standard_derivatives');
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = (deriv ? '#extension GL_OES_standard_derivatives : enable\n' : '') + `precision highp float;
uniform vec2 R;uniform float T;uniform vec2 M;uniform float MA;
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 tis(vec4 r){return 1.79284291400159-.85373472095314*r;}
float sn(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
i=mod289(i);vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
vec4 nr=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=nr.x;p1*=nr.y;p2*=nr.z;p3*=nr.w;
vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
float line(float v,float w){float f=abs(fract(v)-.5);` + (deriv ? 'float d=fwidth(v);' : 'float d=.02;') + `return smoothstep(.5-w*d,.5-(w*.35)*d,f);}
void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=(gl_FragCoord.xy-.5*R)/R.y;
 float h=sn(vec3(p*1.05,T*.035))*.62+sn(vec3(p*2.1+7.3,T*.05))*.26+sn(vec3(p*4.3-3.1,T*.07))*.08;
 vec2 mp=(M-.5*R)/R.y;float md=length(p-mp);float hot=exp(-md*md*6.)*MA;
 h+=hot*.06;                                    // contours swell gently around the pointer
 float v=h*11.;float minor=line(v,1.15);float major=line(v/5.,1.6);
 float vig=smoothstep(1.25,.25,length((uv-vec2(.55,.5))*vec2(1.25,1.)));
 vec3 white=vec3(.86,.87,.92);vec3 gold=vec3(1.,.74,.36);
 float a=(minor*.075+major*.20)*vig;
 vec3 c=mix(white,gold,clamp(major*.55+hot*1.2,0.,1.));
 a+= (minor*.18+major*.35)*hot;
 gl_FragColor=vec4(c*a,a);}`;
    const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(o)); return null; } return o; };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs); if (!v || !f) return;
    const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr); gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, 'R'), uT = gl.getUniformLocation(pr, 'T'), uM = gl.getUniformLocation(pr, 'M'), uMA = gl.getUniformLocation(pr, 'MA');
    const dpr = Math.min(devicePixelRatio || 1, 1.5); let W = 0, H = 0;
    const size = () => { W = Math.max(1, cv.clientWidth * dpr | 0); H = Math.max(1, cv.clientHeight * dpr | 0); cv.width = W; cv.height = H; gl.viewport(0, 0, W, H); };
    size(); addEventListener('resize', size);
    const host = cv.closest('section') || cv.parentElement; let mx = -1e4, my = -1e4, tx = -1e4, ty = -1e4, ma = 0, tma = 0;
    host.addEventListener('pointermove', e => { const r = cv.getBoundingClientRect(); tx = (e.clientX - r.left) * dpr; ty = (r.bottom - e.clientY) * dpr; tma = 1; if (mx < -1e3) { mx = tx; my = ty; } });
    host.addEventListener('pointerleave', () => { tma = 0; });
    const still = window.__CALM; let vis = false, t0 = performance.now();
    new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { rootMargin: '120px' }).observe(cv);
    const frame = now => { if (!cv.isConnected) return;
      if (vis || still) { mx += (tx - mx) * .08; my += (ty - my) * .08; ma += (tma - ma) * .05;
        gl.uniform2f(uR, W, H); gl.uniform1f(uT, still ? 12 : (now - t0) / 1000 + 40); gl.uniform2f(uM, mx, my); gl.uniform1f(uMA, ma);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); cv.classList.add('on'); }
      if (!still) requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  });

  /* ===================== Premier Partner: badge card splits into badge + reseller licence as you scroll
     (native scroll → one CSS variable; no animation-library or motion-setting dependency) ===================== */
  document.querySelectorAll('section.ptr').forEach(sec => {
    const stick = sec.querySelector('.p2-stick');
    sec.classList.add('js-split');
    let raf = 0;
    const upd = () => { raf = 0;
      const r = sec.getBoundingClientRect(), vh = innerHeight;
      let p;
      if (getComputedStyle(stick).position === 'sticky') p = -r.top / Math.max(1, sec.offsetHeight - vh) / .75;  // v47: short pin, split completes at 75% of it, then holds
      else p = (vh * .8 - r.top) / (vh * .7);                                                               // unpinned (phones): split as the section passes
      p = Math.min(1, Math.max(0, p));
      const e = p * p * (3 - 2 * p);
      sec.style.setProperty('--e', e.toFixed(4)); sec.style.setProperty('--p', p.toFixed(4)); };
    const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener('scroll', q, { passive: true }); addEventListener('resize', q);
    if (window.__lenis) window.__lenis.on('scroll', q);
    upd(); setTimeout(upd, 400);
  });

  /* ===================== Stacked cards: native scroll-linked depth (card beneath sinks, blurs, fades as the next lands) ===================== */
  document.querySelectorAll('.stk .stk-list').forEach(sec => {
    const items = [...sec.querySelectorAll('.stk-item')], cards = items.map(i => i.querySelector('.sc-card'));
    let raf = 0;
    const upd = () => { raf = 0; const vh = innerHeight;
      items.forEach((it, i) => { const c = cards[i], next = items[i + 1];
        if (!next || getComputedStyle(it).position !== 'sticky') { c.style.transform = c.style.filter = c.style.opacity = ''; return; }
        const stickTop = parseFloat(getComputedStyle(next).top) || 0, nt = next.getBoundingClientRect().top;
        let p = (vh - nt) / Math.max(1, vh - stickTop); p = Math.min(1, Math.max(0, p));
        const e = p * p * (3 - 2 * p);
        c.style.transform = `translateY(${-e * 46}px) scale(${1 - e * .14})`;
        c.style.filter = `blur(${(e * 14).toFixed(2)}px) brightness(${(1 - e * .55).toFixed(3)})`;
        c.style.opacity = (1 - Math.pow(p, 1.6)).toFixed(3);
        it.style.pointerEvents = p > .9 ? 'none' : ''; }); };
    const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener('scroll', q, { passive: true }); addEventListener('resize', q); if (window.__lenis) window.__lenis.on('scroll', q);
    upd(); setTimeout(upd, 400);
  });

  /* ===================== v7.5 Campaign posters: reveal + scroll parallax ===================== */
  { const cps = [...document.querySelectorAll('.cp, .wb, .pb')];
    if (cps.length) {
      const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('cp-on'); io.unobserve(en.target); } }), { threshold: .2 });
      cps.forEach(c => io.observe(c));
      let raf = 0; const upd = () => { raf = 0; const vh = innerHeight; cps.forEach(c => { const r = c.getBoundingClientRect(); if (r.bottom < -50 || r.top > vh + 50) return; if (r.top < vh * .85 && r.bottom > vh * .15) c.classList.add('cp-on'); const p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2); c.style.setProperty('--cy', Math.max(-1, Math.min(1, p)).toFixed(3)); }); };
      const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
      addEventListener('scroll', q, { passive: true }); addEventListener('resize', q); if (window.__lenis) window.__lenis.on('scroll', q); upd();
    } }
  /* ===================== v6.8 ServiceNow silk ribbons (WebGL) — scroll-coupled ===================== */
  document.querySelectorAll('canvas.snrib').forEach(cv => {
    if (cv.dataset.on) return; cv.dataset.on = '1';
    const gl = cv.getContext('webgl', { premultipliedAlpha: false, alpha: false, antialias: false }); if (!gl) return;
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision highp float;uniform vec2 R;uniform float T;uniform float S;uniform vec2 M;
vec3 grad(float t){t=clamp(t,0.,1.);
  vec3 a=vec3(.384,.847,.306),b=vec3(.122,.78,.714),c=vec3(.239,.545,1.),d=vec3(.48,.42,.98);
  return t<.38?mix(a,b,t/.38):t<.74?mix(b,c,(t-.38)/.36):mix(c,d,(t-.74)/.26);}
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 rib(vec2 p,float off,float amp,float w,float sp,float ph,float g0,float g1){
  float x=p.x;
  float c=off+amp*sin(x*1.15+T*sp+ph+S*1.6)+amp*.42*sin(x*2.45-T*sp*1.25+ph*1.7-S);
  float tw=cos(x*1.35-T*sp*.7+ph*.8+S*1.1);
  float hw=w*(.12+.88*abs(tw));
  float d=(p.y-c)/hw;
  float ad=abs(d);
  float body=smoothstep(1.02,.86,ad);
  float face=tw>0.?1.:.42;
  float fib=smoothstep(.07,0.,abs(fract(d*6.5+.5)-.5))*body;   // silk fibres
  float sheen=pow(max(1.-ad,0.),2.2);
  float edge=smoothstep(.16,0.,abs(ad-.97))*.9;                  // bright rim
  float pinch=.35/(.18+abs(tw));                                 // brighter where it turns
  vec3 col=grad(mix(g0,g1,.5+.5*sin(x*.8+ph+T*.05)));
  vec3 o=col*(body*(.10*face+sheen*.32*face)+fib*.30*face+edge*.55)*min(pinch,1.6);
  o+=col*.045*exp(-d*d*.35);                                     // soft bloom
  return o;}
void main(){
  vec2 uv=(gl_FragCoord.xy-.5*R)/R.y; uv+=M*.025;
  float a=-.18; vec2 p=mat2(cos(a),sin(a),-sin(a),cos(a))*uv;
  vec3 c=vec3(.006,.020,.028)+vec3(.0,.02,.035)*(1.-length(uv));
  c+=rib(p,.06,.13,.17,.16,0.0,.05,.55);
  c+=rib(p,-.20,.10,.10,.21,2.1,.35,.9)*.85;
  c+=rib(p,.30,.08,.06,.25,4.2,.15,.7)*.6;
  c+=grad(.55)*.18*exp(-length(uv-vec2(.55,.25))*2.2);
  c*=smoothstep(1.25,.25,length(uv*vec2(.85,1.3)));
  c=1.-exp(-c*1.5);
  c+=(h(gl_FragCoord.xy+T)-.5)*.03;
  gl_FragColor=vec4(c,1.);}`;
    const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(o)); return null; } return o; };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs); if (!v || !f) return;
    const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr); gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, 'R'), uT = gl.getUniformLocation(pr, 'T'), uS = gl.getUniformLocation(pr, 'S'), uM = gl.getUniformLocation(pr, 'M');
    const k = Math.min(devicePixelRatio || 1, 1.5) * .8; let W = 1, H = 1;
    const size = () => { W = Math.max(1, cv.clientWidth * k | 0); H = Math.max(1, cv.clientHeight * k | 0); cv.width = W; cv.height = H; gl.viewport(0, 0, W, H); };
    size(); addEventListener('resize', size);
    const sec = cv.closest('section') || cv.parentElement;
    let mx = 0, my = 0, tx = 0, ty = 0, s = 0, vis = false;
    addEventListener('pointermove', e => { tx = e.clientX / innerWidth - .5; ty = .5 - e.clientY / innerHeight; }, { passive: true });
    new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { rootMargin: '120px' }).observe(cv);
    const t0 = performance.now();
    const frame = now => { if (!cv.isConnected) return;
      if (vis) { const r = sec.getBoundingClientRect(); const ts = (innerHeight - r.top) / (innerHeight + r.height); s += (ts - s) * .08;
        mx += (tx - mx) * .04; my += (ty - my) * .04;
        gl.uniform2f(uR, W, H); gl.uniform1f(uT, window.__CALM ? 8 : (now - t0) / 1000 + 8); gl.uniform1f(uS, s * 2.2); gl.uniform2f(uM, mx, my);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); cv.classList.add('on');
        sec.style.setProperty('--sp', s.toFixed(4)); }
      requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  });
  /* v6.8 glass cards over the ribbon: pointer spotlight */
  document.querySelectorAll('.sg-card, .sgl, .ibt-tile, .bt-tile').forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--sx', (e.clientX - r.left) + 'px'); c.style.setProperty('--sy', (e.clientY - r.top) + 'px'); }));
  /* v6.9 inner bento reveal */
  { const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('bt-on'); io.unobserve(en.target); } }), { threshold: .3 });
    document.querySelectorAll('.ibt-tile').forEach(t => io.observe(t)); }
  /* v6.8 credentials bento: reveal (blueprint draws, chips light in sequence) + badge tilt + scroll drift */
  document.querySelectorAll('.bt-sec').forEach(sec => {
    const tiles = sec.querySelectorAll('.bt-tile');
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('bt-on'); io.unobserve(en.target); } }), { threshold: .3 });
    tiles.forEach(t => io.observe(t));
    const badge = sec.querySelector('.bt-badge'), prem = sec.querySelector('.bt-prem');
    if (badge && prem) { prem.addEventListener('pointermove', e => { const r = prem.getBoundingClientRect(); badge.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 22 + 'deg'); badge.style.setProperty('--rx', (.5 - (e.clientY - r.top) / r.height) * 16 + 'deg'); });
      prem.addEventListener('pointerleave', () => { badge.style.setProperty('--ry', '0deg'); badge.style.setProperty('--rx', '0deg'); }); }
    const lic = sec.querySelector('.bt-res');
    if (lic) { lic.addEventListener('pointermove', e => { const r = lic.getBoundingClientRect(); lic.style.setProperty('--ly', ((e.clientX - r.left) / r.width - .5) * 18 + 'deg'); lic.style.setProperty('--lx', (.5 - (e.clientY - r.top) / r.height) * 12 + 'deg'); });
      lic.addEventListener('pointerleave', () => { lic.style.removeProperty('--ly'); lic.style.removeProperty('--lx'); }); }
    let raf = 0; const upd = () => { raf = 0; const r = sec.getBoundingClientRect(); const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height))); sec.style.setProperty('--bp', p.toFixed(4)); };
    const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener('scroll', q, { passive: true }); addEventListener('resize', q); if (window.__lenis) window.__lenis.on('scroll', q); upd();
  });

  /* ===================== Streak field: long-exposure light streaks (WebGL) ===================== */
  document.querySelectorAll('canvas.streak').forEach(cv => {
    if (cv.dataset.on) return; cv.dataset.on = '1';
    const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true }); if (!gl) return;
    const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const fs = `precision highp float;uniform vec2 R;uniform float T;uniform vec2 M;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fb(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p*=2.03;a*=.5;}return v;}
void main(){vec2 uv=gl_FragCoord.xy/R;vec2 q=uv;q.y=1.-q.y;
 float t=T*.035;
 vec2 sp=vec2(q.x*1.1+t+M.x*.05, q.y*9.+sin(q.x*2.2+t*2.)*1.4);
 float s1=fb(sp), s2=fb(sp*vec2(.6,1.7)+vec2(-t*1.6,3.1));
 float horizon=.50+.07*sin(q.x*2.6+t*3.)+(M.y-.5)*.04;
 float band=exp(-pow((q.y-horizon)/.11,2.));               // bright long-exposure band
 float low=smoothstep(horizon-.02,1.,q.y);                  // lower field
 float right=smoothstep(.25,1.,q.x);
 vec3 top=vec3(.10,.10,.115)*smoothstep(1.,.0,q.y)*1.2;
 vec3 silver=vec3(.86,.84,.82)*band*(.45+.75*s1)*(1.-right*.55);
 vec3 ember=vec3(.62,.20,.06)*low*right*(.35+.9*s2)*smoothstep(1.05,.55,q.y);
 vec3 amber=vec3(.95,.55,.20)*band*right*(.3+.8*s2)*.55;
 vec3 c=top+silver+ember+amber;
 c*=smoothstep(1.35,.35,length((uv-.5)*vec2(1.,1.25)));     // vignette
 c=c/(1.+c*.6);
 float g=h(gl_FragCoord.xy+T)*.035; c+=g-.017;               // grain
 gl_FragColor=vec4(c,1.);}`;
    const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(o)); return null; } return o; };
    const v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs); if (!v || !f) return;
    const pr = gl.createProgram(); gl.attachShader(pr, v); gl.attachShader(pr, f); gl.linkProgram(pr); gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(pr, 'R'), uT = gl.getUniformLocation(pr, 'T'), uM = gl.getUniformLocation(pr, 'M');
    const dpr = Math.min(devicePixelRatio || 1, 1); let W = 0, H = 0;
    const size = () => { W = Math.max(1, cv.clientWidth * dpr | 0); H = Math.max(1, cv.clientHeight * dpr | 0); cv.width = W; cv.height = H; gl.viewport(0, 0, W, H); };
    size(); addEventListener('resize', size);
    let mx = .5, my = .5, tx = .5, ty = .5, vis = false;
    addEventListener('pointermove', e => { tx = e.clientX / innerWidth; ty = e.clientY / innerHeight; }, { passive: true });
    new IntersectionObserver(es => { vis = es[0].isIntersecting; }, { rootMargin: '100px' }).observe(cv);
    const t0 = performance.now();
    const frame = now => { if (!cv.isConnected) return;
      if (vis) { mx += (tx - mx) * .04; my += (ty - my) * .04; gl.uniform2f(uR, W, H); gl.uniform1f(uT, (now - t0) / 1000 + 20); gl.uniform2f(uM, mx, my); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); cv.classList.add('on'); }
      requestAnimationFrame(frame); };
    requestAnimationFrame(frame);
  });

  /* ===================== ServiceNow page: scroll-lit statement + kinetic banner ===================== */
  document.querySelectorAll('.sv-statement p').forEach(p => {
    if (!p.dataset.split) { p.dataset.split = '1';
      const words = p.textContent.split(/(\s+)/);
      p.innerHTML = words.map(w => /^\s+$/.test(w) ? w : `<span class="sw${/ServiceNow|Premier|AI|Now/.test(w) ? ' gold' : ''}">${w.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`).join(''); }
    const ws = [...p.querySelectorAll('.sw')]; let raf = 0;
    const upd = () => { raf = 0; const r = p.getBoundingClientRect(), vh = innerHeight;
      const k = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .45)));
      const n = Math.round(k * ws.length); ws.forEach((w, i) => w.classList.toggle('lit', i < n)); };
    const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener('scroll', q, { passive: true }); addEventListener('resize', q); if (window.__lenis) window.__lenis.on('scroll', q); upd();
  });
  document.querySelectorAll('.sv-band').forEach(band => {
    const rows = [...band.querySelectorAll('.band-row')]; let raf = 0, last = scrollY, sk = 0;
    const upd = () => { raf = 0; const r = band.getBoundingClientRect(), vh = innerHeight;
      const k = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      const v = scrollY - last; last = scrollY; sk += (Math.max(-12, Math.min(12, v * -.25)) - sk) * .3;
      rows.forEach((row, i) => { const span = row.scrollWidth * .35; row.style.setProperty('--bx', (i % 2 ? (k * span - span) : (-k * span)) + 'px'); row.style.setProperty('--sk', sk.toFixed(2) + 'deg'); }); };
    const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener('scroll', q, { passive: true }); if (window.__lenis) window.__lenis.on('scroll', q); upd();
  });

  /* ===================== ServiceNow hero cards tilt + video reel expand ===================== */
  document.querySelectorAll('.sv-hero-cards').forEach(c => { const hero = c.closest('section');
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); c.style.setProperty('--ty', (((e.clientX - r.left) / r.width - .5) * 16).toFixed(2) + 'deg'); c.style.setProperty('--tx', (4 - ((e.clientY - r.top) / r.height - .5) * 12).toFixed(2) + 'deg'); });
    hero.addEventListener('pointerleave', () => { c.style.removeProperty('--ty'); c.style.removeProperty('--tx'); }); });
  document.querySelectorAll('.sv-reel').forEach(sec => { const f = sec.querySelector('.sv-reel-frame'), vid = sec.querySelector('video'); let raf = 0;
    if (vid) { vid.muted = true; new IntersectionObserver(es => es.forEach(en => en.isIntersecting ? vid.play().catch(() => {}) : vid.pause()), { threshold: .1 }).observe(vid); }
    const upd = () => { raf = 0; const r = f.getBoundingClientRect(), vh = innerHeight;
      const k = Math.min(1, Math.max(0, (vh - r.top) / (vh * .9)));          // 0 when entering, 1 when frame top reaches 10% of viewport
      const e = k * k * (3 - 2 * k);
      f.style.setProperty('--ci', ((1 - e) * 8).toFixed(2) + '%'); f.style.setProperty('--cx', ((1 - e) * 12).toFixed(2) + '%'); f.style.setProperty('--cr', (40 - e * 28).toFixed(1) + 'px');
      const pr = Math.min(1, Math.max(-1, (r.top + r.height / 2 - vh / 2) / vh));
      f.style.setProperty('--vy', (pr * 60).toFixed(1) + 'px'); f.style.setProperty('--vs', (1.2 - e * .08).toFixed(3));
      f.style.setProperty('--ta', (pr * -160).toFixed(1) + 'px'); f.style.setProperty('--tb', (pr * 160).toFixed(1) + 'px'); };
    const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener('scroll', q, { passive: true }); addEventListener('resize', q); if (window.__lenis) window.__lenis.on('scroll', q); upd(); });

  /* ===================== AI CTA: light field parallax + pane spotlight ===================== */
  document.querySelectorAll('.ai3').forEach(sec => { const f = sec.querySelector('.ai3-field .streak'); let raf = 0;
    const upd = () => { raf = 0; const r = sec.getBoundingClientRect(); const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; if (f) f.style.setProperty('--fy', (k * 80).toFixed(1) + 'px'); };
    const q = () => { if (!raf) raf = requestAnimationFrame(upd); };
    addEventListener('scroll', q, { passive: true }); if (window.__lenis) window.__lenis.on('scroll', q); upd();
    sec.querySelectorAll('.ai3-card').forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); })); });

  /* ===================== Extend your Enterprise: scroll-spy (works with or without GSAP) ===================== */
  document.querySelectorAll('.xe').forEach(sec => {
    const steps = [...sec.querySelectorAll('.xe-step')], N = steps.length;
    const pinned = () => getComputedStyle(sec.querySelector('.xe-stick')).position === 'sticky';
    let cur = -1;
    const set = (idx, sp) => {
      if (idx !== cur) { steps.forEach((s, i) => { s.classList.toggle('on', i === idx); s.classList.toggle('was', i < idx);
        const pnl = s.querySelector('.xe-panel'); if (pnl) { if (i === idx || !pinned()) pnl.removeAttribute('inert'); else pnl.setAttribute('inert', ''); }
        s.querySelector('.xe-head').setAttribute('aria-expanded', String(i === idx)); }); cur = idx; }
      steps[idx].style.setProperty('--sp', sp.toFixed(3));
    };
    const upd = () => { if (!pinned()) { steps.forEach(s => { s.querySelector('.xe-panel')?.removeAttribute('inert'); }); return; }
      const r = sec.getBoundingClientRect(), span = sec.offsetHeight - innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / span)), f = p * N, idx = Math.min(N - 1, Math.floor(f));
      set(idx, Math.min(1, f - idx)); };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
    steps.forEach((s, i) => s.querySelector('.xe-head').addEventListener('click', () => {
      if (!pinned()) return;
      const top = sec.getBoundingClientRect().top + scrollY, span = sec.offsetHeight - innerHeight, t = top + span * (i + .5) / N;
      if (window.__lenis) window.__lenis.scrollTo(t, { duration: 1.1 }); else scrollTo({ top: t, behavior: 'smooth' }); }));
  });

  /* ===================== Glass cards: direction-aware fill in/out ===================== */
  document.querySelectorAll('.gx-card').forEach(c => {
    const at = e => { const r = c.getBoundingClientRect(); c.style.setProperty('--ex', (e.clientX - r.left) + 'px'); c.style.setProperty('--ey', (e.clientY - r.top) + 'px'); };
    c.addEventListener('pointerenter', e => { at(e); c.classList.remove('is-in'); void c.offsetWidth; c.classList.add('is-in'); });
    c.addEventListener('pointerleave', e => { at(e); if (!c.classList.contains('hl')) c.classList.remove('is-in'); });
    c.addEventListener('focus', () => c.classList.add('is-in')); c.addEventListener('blur', () => { if (!c.classList.contains('hl')) c.classList.remove('is-in'); });
    if (c.classList.contains('hl')) c.classList.add('is-in');
  });

  /* ===================== Motion layer v4 — smooth + refined (GSAP + ScrollTrigger + Lenis) ===================== */
  const reduce = window.__CALM;
  if (!window.gsap || !window.ScrollTrigger || reduce) { document.documentElement.classList.add('no-motion'); return; }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.getAll().forEach(t => t.kill());
  if (window.Lenis && !window.__lenis) {
    const lenis = new Lenis({ lerp: 0.11 });
    window.__lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', ev => {
    const id = a.getAttribute('href').slice(1); const t = id && document.getElementById(id);
    if (t && window.__lenis) { ev.preventDefault(); window.__lenis.scrollTo(t, { offset: -76, duration: 1.3 }); }
  }));
  const splitWords = el => {
    if (el.dataset.split) return el.querySelectorAll('.wi'); el.dataset.split = '1';
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) { const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(w)); return; }
          const o = document.createElement('span'); o.className = 'w'; const i = document.createElement('span'); i.className = 'wi'; i.textContent = w; o.appendChild(i); f.appendChild(o); });
        c.replaceWith(f);
      } else if (c.nodeType === 1 && !c.classList.contains('w')) walk(c);
    });
    walk(el); return el.querySelectorAll('.wi');
  };
  const rise = (els, trigger, opts = {}) => gsap.from(els, Object.assign({ y: 50, opacity: 0, duration: .9, ease: 'power3.out', stagger: .08, scrollTrigger: { trigger, start: 'top 86%', once: true } }, opts));

  // Hero
  const lx = document.querySelector('.lx-hero');
  if (lx) {
    gsap.from(splitWords(lx.querySelector('h1')), { yPercent: 110, duration: 1.2, ease: 'power4.out', stagger: .07, delay: .2 });
    gsap.from(['.lx-side p', '.lx-btns', '.lx-logos'], { y: 26, opacity: 0, duration: 1, ease: 'power3.out', stagger: .12, delay: .55 });
    gsap.from('.lx-canvas', { opacity: 0, scale: 1.08, duration: 2.2, ease: 'power2.out' });
    gsap.to('.lx-canvas', { yPercent: 14, scale: 1.06, ease: 'none', scrollTrigger: { trigger: lx, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.lx-hero-in', { y: -60, opacity: .2, ease: 'none', scrollTrigger: { trigger: lx, start: '30% top', end: 'bottom top', scrub: true } });
  }
  const hero = document.querySelector('.nv-hero');
  if (hero) {
    gsap.from(splitWords(hero.querySelector('h1')), { yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: .08, delay: .1 });
    gsap.from(['.nv-hero-sub', '.nv-hero .nv-actions', '.nv-trust'], { y: 30, opacity: 0, duration: .9, ease: 'power3.out', stagger: .12, delay: .45 });
    const obj = hero.querySelector('.nv-hero-obj');
    gsap.from(obj, { x: 160, rotate: 14, opacity: 0, duration: 1.6, ease: 'power3.out' });
    gsap.to(obj, { y: -16, rotate: -2, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    gsap.to(obj, { yPercent: 18, rotate: -10, scale: 1.08, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6 } });
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
      gsap.to('.nv-hero-glow', { x: dx * 60, y: dy * 40, duration: 1.4, ease: 'power3.out' }); });
    rise(hero.querySelectorAll('.nv-trust-logos img'), hero.querySelector('.nv-trust'), { y: 20, stagger: .07, delay: .6 });
  }
  // Section headings: words rise
  document.querySelectorAll('main .nv-h2:not(.nv-hero h1), main .h2, main .contact h2').forEach(h => {
    h.closest('.reveal')?.classList.add('in');
    gsap.from(splitWords(h), { yPercent: 110, duration: .9, ease: 'power4.out', stagger: .04, scrollTrigger: { trigger: h, start: 'top 88%', once: true } });
  });
  // Cards & blocks rise with stagger
  [['.nv-svcs', '.nv-svc'], ['.nv-stats', 'li'], ['.nv-impact-r', ':scope > *'], ['.nv-feats', '.nv-feat'], ['.nv-steps', '.nv-step'], ['.nv-band', ':scope > div'], ['.nv-plans', '.nv-plan'], ['.nv-collage', ':scope > div'], ['.nv-acc', 'details'], ['.nv-duo', ':scope > *'], ['.nv-final', ':scope > *']]
    .forEach(([wrap, kids]) => document.querySelectorAll(wrap).forEach(w => rise(w.querySelectorAll(kids), w)));
  document.querySelectorAll('.nv-head-side, .nv-impact-l > p, .nv-impact-l > .nv-btn').forEach(el => rise(el, el, { stagger: 0 }));
  // Glass sections — scroll: cards rise & tilt in, ambient rings turn and drift
  document.querySelectorAll('.gx').forEach(g => {
    const q = sel => g.querySelector(sel);
    const st = { trigger: g, start: 'top bottom', end: 'bottom top', scrub: .8 };
    const grid = q('.gx-grid');
    if (grid) {
      gsap.from(grid.querySelectorAll('.gx-card'), { y: 110, rotateX: 18, opacity: 0, transformPerspective: 1100, transformOrigin: '50% 100%', duration: 1.1, ease: 'power3.out', stagger: { each: .09, grid: 'auto', from: 'start' }, scrollTrigger: { trigger: grid, start: 'top 85%', once: true } });
      gsap.fromTo(grid, { yPercent: 4 }, { yPercent: -4, ease: 'none', scrollTrigger: st });
    }
    [['.r1', { rotate: 40, yPercent: 18 }], ['.r2', { rotate: -30, yPercent: -14, xPercent: 6 }], ['.r3', { rotate: 25, yPercent: -24 }]]
      .forEach(([sel, v]) => { const el = q(sel); if (el) gsap.to(el, Object.assign({ ease: 'none', scrollTrigger: st }, v)); });
    const navy = q('.gx-navy'); if (navy) gsap.fromTo(navy, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: st });
    const sp = q(':scope > .gx-bg .gx-spiral-wrap'); if (sp) gsap.fromTo(sp, { xPercent: -50, yPercent: -50, y: 120, scale: .92 }, { y: -120, scale: 1.06, ease: 'none', scrollTrigger: st });
  });

  // ===== v5 Home (body.px): reveals, path draw, collage parallax, letters =====
  if (document.body.classList.contains('px')) {
    // frosted widgets rise in with a soft blur, per section
    document.querySelectorAll('.px-sec').forEach(sec => {
      const items = sec.querySelectorAll('.px-bento > *, .px-duo-in > *, .px-acc-i, .px-feat, .px-step, .px-cred, .bt-tile, .px-plan, .px-final');
      if (items.length) gsap.from(items, { y: 80, opacity: 0, filter: 'blur(12px)', duration: 1.1, ease: 'power3.out', stagger: .1, clearProps: 'filter',
        scrollTrigger: { trigger: items[0], start: 'top 88%', once: true } });
    });
    document.querySelectorAll('.px-partner-l > *:not(h2), .px-about-l > p').forEach(el => rise(el, el, { stagger: 0 }));
    // collage: clip reveal + parallax at different depths
    const speeds = { p1: -60, p2: 90, p3: 40, p4: -90 };
    document.querySelectorAll('.px-ph').forEach((ph, i) => {
      gsap.fromTo(ph, { clipPath: 'inset(100% 0% 0% 0% round 26px)' }, { clipPath: 'inset(0% 0% 0% 0% round 26px)', duration: 1.3, ease: 'power4.out', delay: i * .12, scrollTrigger: { trigger: ph.parentElement, start: 'top 80%', once: true } });
      const k = [...ph.classList].find(c => speeds[c] !== undefined);
      gsap.fromTo(ph, { y: -speeds[k] / 2 }, { y: speeds[k] / 2, ease: 'none', scrollTrigger: { trigger: ph.parentElement, start: 'top bottom', end: 'bottom top', scrub: .6 } });
      gsap.fromTo(ph.querySelector('img'), { yPercent: -7 }, { yPercent: 7, ease: 'none', scrollTrigger: { trigger: ph.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    document.querySelectorAll('.px-feat-im img, .px-photo img').forEach(img => gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.closest('.px-feat, .px-photo'), start: 'top bottom', end: 'bottom top', scrub: true } }));
    // Now Platform: light path draws as you scroll, nodes ignite as it passes
    document.querySelectorAll('.px-steps').forEach(wrap => {
      const fg = wrap.querySelector('.px-path-fg'); if (!fg) return;
      const L = fg.getTotalLength(); fg.style.strokeDasharray = L; fg.style.strokeDashoffset = L;
      const stepEls = [...wrap.querySelectorAll('.px-step')], nodes = [...wrap.querySelectorAll('.px-node')], marks = [.16, .5, .84];
      gsap.to(fg, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: wrap, start: 'top 80%', end: 'top 25%', scrub: .6,
        onUpdate: self => stepEls.forEach((el, i) => { const on = self.progress >= marks[i] - .02; el.classList.toggle('on', on); nodes[i] && nodes[i].classList.toggle('on', on); }) } });
    });
    // credential numerals + stats re-count on hover
    const count = el => { const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length, t0 = performance.now(), dur = 900;
      const tick = t => { const p = Math.min(1, (t - t0) / dur); el.textContent = (end * (1 - Math.pow(1 - p, 3))).toFixed(dec); if (p < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); };
    document.querySelectorAll('[data-recount]').forEach(el => { const card = el.closest('.gx-card'); let busy = 0;
      card && card.addEventListener('pointerenter', () => { const now = Date.now(); if (now - busy < 1200) return; busy = now; count(el); }); });
    // ambient orb drifts with scroll
    const orb = document.querySelector('.px-orb'); if (orb) gsap.fromTo(orb, { y: 80 }, { y: -120, ease: 'none', scrollTrigger: { trigger: orb.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } });
    // ---- v5.4 Partner stage: kinetic title + pinned split of the badge card into badge + reseller licence ----
    // ---- every .kt heading: letters rise in, outline line fills, weight swells near the cursor ----
    const splitChars = el => { if (el.dataset.split) return; el.dataset.split = '1';
      const walk = n => [...n.childNodes].forEach(c => {
        if (c.nodeType === 3) { const f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(w => { if (!w) return; if (/^\s+$/.test(w)) { f.appendChild(document.createTextNode(' ')); return; }
            const ws = document.createElement('span'); ws.className = 'w'; ws.style.display = 'inline-block';
            [...w].forEach(ch => { const cs = document.createElement('span'); cs.className = 'c'; cs.textContent = ch; ws.appendChild(cs); }); f.appendChild(ws); });
          c.replaceWith(f);
        } else if (c.nodeType === 1) walk(c); });
      walk(el); };
    document.querySelectorAll('h1.kt, h2.kt').forEach(h => {
      const k1 = h.querySelector('.kt-1'), k2 = h.querySelector('.kt-2'); if (!k1) return;
      h.setAttribute('aria-label', h.textContent.replace(/\s+/g, ' ').trim());
      splitChars(k1); const chars = [...k1.querySelectorAll('.c')];
      const pinned = h.closest('section.ptr') && getComputedStyle(h.closest('section.ptr').querySelector('.p2-stick')).position === 'sticky';
      const intro = gsap.timeline({ scrollTrigger: { trigger: h, start: 'top 92%', end: pinned ? 'top 20%' : 'top 45%', scrub: .6 } });
      intro.from(chars, { yPercent: 115, rotate: 7, ease: 'power3.out', stagger: .03, duration: .6 }, 0)
           .fromTo(k2 || k1, { '--f': 0 }, { '--f': 1, ease: 'none', duration: .7 }, .2);
      if (matchMedia('(hover: hover)').matches) { const zone = h.closest('section') || h;
        zone.addEventListener('pointermove', e => { const hr = h.getBoundingClientRect(); if (e.clientY < hr.top - 200 || e.clientY > hr.bottom + 200) return;
          chars.forEach(c => { const r = c.getBoundingClientRect(); const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
            c.style.setProperty('--w', Math.round(500 + 300 * Math.max(0, 1 - d / 240))); }); });
        zone.addEventListener('pointerleave', () => chars.forEach(c => c.style.setProperty('--w', 500))); }
    });
    // ---- Nova cards: shared light field drifts with scroll (same offset on all three keeps it continuous); cards rise ----
    document.querySelectorAll('.nova-sec').forEach(sec => {
      const cards = sec.querySelectorAll('.nova-card'), bgs = sec.querySelectorAll('.nova-bg');
      gsap.from(cards, { y: 90, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: sec, start: 'top 78%', once: true } });
      gsap.fromTo(bgs, { '--py': '40px' }, { '--py': '-40px', ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.from(sec.querySelectorAll('.nova-mark'), { scale: .4, rotate: -120, opacity: 0, duration: 1.6, ease: 'back.out(1.6)', delay: .3, scrollTrigger: { trigger: sec, start: 'top 75%', once: true } });
      gsap.from(sec.querySelectorAll('.nova-guides i'), { scale: 0, duration: 1.4, ease: 'power3.inOut', delay: .2, scrollTrigger: { trigger: sec, start: 'top 75%', once: true } });
      if (matchMedia('(hover: hover)').matches) sec.addEventListener('pointermove', e => { const r = sec.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5;
        gsap.to(bgs, { x: dx * -24, duration: 1.2, ease: 'power3.out', overwrite: 'auto' }); });
    });
    // ---- stacked cards: as the next card slides over, the one beneath sinks back, blurs and fades ----
    document.querySelectorAll('.stk').forEach(sec => {
      const items = [...sec.querySelectorAll('.stk-item')];
      items.forEach((it, i) => {
        const card = it.querySelector('.sc-card');
        it.classList.add('arm'); new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { it.classList.add('in'); io.disconnect(); } }, { rootMargin: '0px 0px -28% 0px' }).observe(it);
        const ill = card.querySelector('.ill'); if (ill) gsap.fromTo(ill, { y: 50, scale: .94 }, { y: -30, scale: 1, ease: 'none', scrollTrigger: { trigger: it, start: 'top bottom', end: 'top 20%', scrub: true } });
      });
    });
    // ---- featured showcase: pinned, cards slide sideways; centre card scales up, others tilt away ----
    document.querySelectorAll('.scx').forEach(sec => {
      const stick = sec.querySelector('.scx-stick'), track = sec.querySelector('.scx-track'), cards = [...sec.querySelectorAll('.sc-card')];
      if (getComputedStyle(stick).position !== 'sticky') { cards.forEach(c => c.classList.add('on')); return; }
      const cur = sec.querySelector('.scx-cur'), bar = sec.querySelector('.scx-bar');
      const upd = () => { const mid = innerWidth / 2; let best = 0, bd = 1e9;
        cards.forEach((c, i) => { const r = c.getBoundingClientRect(); const d = (r.left + r.width / 2 - mid) / innerWidth, ad = Math.min(Math.abs(d), 1);
          gsap.set(c, { scale: 1 - ad * .16, opacity: 1 - ad * .6, rotationY: d * -18, transformPerspective: 1600 });
          const ill = c.querySelector('.ill'); if (ill) gsap.set(ill, { x: d * -90 });
          if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; } });
        cards.forEach((c, i) => c.classList.toggle('on', i === best));
        if (cur) cur.textContent = '0' + (best + 1); };
      const tw = gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none', onUpdate: upd,
        scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: .7, invalidateOnRefresh: true, onUpdate: self => bar && bar.style.setProperty('--p', self.progress.toFixed(3)) } });
      upd(); addEventListener('resize', upd);
      gsap.from(track, { y: 120, opacity: 0, duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 75%', once: true } });
      gsap.from(sec.querySelector('.scx-top'), { y: 30, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
    });
    // ---- post cards: rise, line-art draws, ribbon drifts with scroll + pointer ----
    document.querySelectorAll('.pst-sec').forEach(sec => {
      const cards = sec.querySelectorAll('.pst'), rib = sec.querySelector('.pst-ribbon');
      gsap.from(cards, { y: 90, opacity: 0, rotateX: 14, transformPerspective: 1000, duration: 1.2, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: sec, start: 'top 75%', once: true } });
      
      
      if (rib) {
        gsap.from(rib, { xPercent: 30, opacity: 0, rotate: 8, duration: 1.8, ease: 'power3.out', delay: .3, scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });
        gsap.fromTo(rib, { y: 60 }, { y: -60, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
        if (matchMedia('(hover: hover)').matches) { const rx = gsap.quickTo(rib, 'x', { duration: 1.4, ease: 'power3.out' }), rr = gsap.quickTo(rib, 'rotation', { duration: 1.4, ease: 'power3.out' });
          sec.addEventListener('pointermove', e => { const r = sec.getBoundingClientRect(), dx = (e.clientX - r.left) / r.width - .5; rx(dx * -50); rr(dx * 4); }); }
      }
    });
    // ---- stage sections: hairlines draw, crosshairs pop, display type parallax, pointer depth ----
    document.querySelectorAll('.stg').forEach(sec => {
      const st = { trigger: sec, start: 'top 75%', once: true };
      const v = sec.querySelectorAll('.hl-v'), h = sec.querySelectorAll('.hl-h');
      if (v.length) gsap.from(v, { scaleY: 0, duration: 1.6, ease: 'power3.inOut', stagger: .15, scrollTrigger: st });
      if (h.length) gsap.from(h, { scaleX: 0, duration: 1.6, ease: 'power3.inOut', stagger: .15, scrollTrigger: st });
      const x = sec.querySelectorAll('.xh, .spk'); if (x.length) gsap.from(x, { scale: 0, rotate: -90, opacity: 0, duration: .9, ease: 'back.out(2)', stagger: .12, delay: .8, scrollTrigger: st });
      const d = sec.querySelector('.stg-display');
      if (d) {
        gsap.from(d.querySelector('.d1'), { yPercent: 40, opacity: 0, letterSpacing: '.02em', duration: 1.6, ease: 'power4.out', scrollTrigger: st });
        gsap.from(d.querySelector('.d2'), { yPercent: 60, opacity: 0, duration: 1.4, ease: 'power4.out', delay: .2, scrollTrigger: st });
        gsap.to(d, { yPercent: 30, ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom top', scrub: true } });
      }
      const t = sec.querySelector('.stg-title'); if (t) gsap.from(splitWords(t), { yPercent: 110, opacity: 0, duration: 1, ease: 'power4.out', stagger: .05, scrollTrigger: st });
      const obj = sec.querySelector('.stg-obj, .ut-stage');
      if (obj) gsap.from(obj, { y: 120, scale: .85, opacity: 0, duration: 1.6, ease: 'power3.out', delay: .2, scrollTrigger: st });
      const side = sec.querySelectorAll('.stg-left > *, .co, .kpi, .resell, .stg-frame, .stg-pills > *, .stg-sub, .cta-pill, .ut-side .stg-small, .ut-title .stg-label');
      if (side.length) gsap.from(side, { y: 30, opacity: 0, filter: 'blur(8px)', duration: 1, ease: 'power3.out', stagger: .08, delay: .5, clearProps: 'filter', scrollTrigger: st });
      sec.querySelectorAll('.co-lead path').forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
        gsap.to(p, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut', delay: .7, scrollTrigger: st }); });
      const slabs = sec.querySelector('.slabs');
      if (slabs && matchMedia('(hover: hover)').matches) {
        const rx = gsap.quickTo(slabs, 'rotationX', { duration: 1.2, ease: 'power3.out' }), ry = gsap.quickTo(slabs, 'rotationY', { duration: 1.2, ease: 'power3.out' });
        gsap.set(slabs, { rotationX: 14, rotationY: -24, rotationZ: -12 });
        sec.addEventListener('pointermove', e => { const r = sec.getBoundingClientRect(); const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5; ry(-24 + dx * 26); rx(14 - dy * 18); });
        sec.addEventListener('pointerleave', () => { ry(-24); rx(14); });
      }
      const beam = sec.querySelector('.stg-beam, .stg-horizon');
      if (beam) gsap.fromTo(beam, { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // "Let's Talk!" — letters ride in, then wave on hover
    document.querySelectorAll('.px-talk').forEach(h => {
      if (h.dataset.split) return; h.dataset.split = '1'; const txt = h.textContent; h.setAttribute('aria-label', txt);
      h.innerHTML = [...txt].map((c, i) => `<span class="ch${c === ' ' ? ' sp' : ''}" aria-hidden="true" style="--i:${i}">${c === ' ' ? '&nbsp;' : c.replace('&', '&amp;').replace('<', '&lt;')}</span>`).join('');
      gsap.from(h.querySelectorAll('.ch'), { yPercent: 120, rotate: 12, opacity: 0, duration: 1, ease: 'back.out(1.8)', stagger: .045, clearProps: 'transform', onComplete: () => h.classList.add('ready'), scrollTrigger: { trigger: h, start: 'top 85%', once: true } });
    });
  }
  if (matchMedia('(hover: hover)').matches) document.querySelectorAll('.gx-card').forEach(c => {
    const rx = gsap.quickTo(c, 'rotationX', { duration: .6, ease: 'power3.out' }), ry = gsap.quickTo(c, 'rotationY', { duration: .6, ease: 'power3.out' }), lift = gsap.quickTo(c, 'y', { duration: .6, ease: 'power3.out' });
    gsap.set(c, { transformPerspective: 1000 });
    c.addEventListener('pointerenter', () => lift(c.offsetWidth > 700 ? -3 : -8));
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      const k = Math.min(1, 420 / r.width); ry((x / r.width - .5) * 10 * k); rx((.5 - y / r.height) * 8 * k); });
    c.addEventListener('pointerleave', () => { rx(0); ry(0); lift(0); });
  });
  // Hot plan floats up a touch more
  document.querySelectorAll('.nv-plan.hot').forEach(p => gsap.to(p, { y: -24, ease: 'none', scrollTrigger: { trigger: p, start: 'top bottom', end: 'bottom top', scrub: true } }));
  // Image parallax inside frames
  document.querySelectorAll('.nv-photo img, .nv-feat .im img, .nv-collage img, .nv-final-r img, .ph-media img').forEach(img => {
    gsap.fromTo(img, { yPercent: -6, scale: 1.12 }, { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  // Inner pages
  document.querySelectorAll('.ph-media').forEach(m => gsap.fromTo(m, { clipPath: 'inset(100% 0% 0% 0% round 22px)' }, { clipPath: 'inset(0% 0% 0% 0% round 22px)', duration: 1.2, ease: 'power4.out', delay: .15 }));
  document.querySelectorAll('main .page-hero h1').forEach(h => gsap.from(splitWords(h), { yPercent: 110, duration: 1, ease: 'power4.out', stagger: .06, delay: .1 }));
  document.querySelectorAll('main .cards, main .rows, main .hl-list, main .offerings, main .creds, main .stats, main .ibt, main .steps, main .matrix, main .pager').forEach(c => { c.classList.add('in'); rise(c.children, c); });
  document.querySelectorAll('main .prose, main .quote-row, main .callout, main .notice, main .utter, #contact .contact').forEach(el => { el.classList.add('in'); rise(el, el, { stagger: 0 }); });
  // Magnetic buttons
  if (matchMedia('(hover: hover)').matches) document.querySelectorAll('.nv-btn, .btn, .nv-round, .to-top, .neo:not(.neo-card)').forEach(b => {
    const xTo = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3.out' }), yTo = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3.out' });
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .35); });
    b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.45)' }));
  });
  // v7.9 — campaign films: play only while on screen
  { const vids = [...document.querySelectorAll('video[autoplay]')];
    if (vids.length && 'IntersectionObserver' in window) {
      const vio = new IntersectionObserver(es => es.forEach(en => { const v = en.target; v.muted = true; if (en.isIntersecting) { const p = v.play && v.play(); p && p.catch && p.catch(() => {}); } else if (!v.paused) v.pause(); }), { rootMargin: '120px 0px' });
      vids.forEach(v => vio.observe(v));
    } }
  // v8.2 — UtterNow light-wave: layered smooth waves, tapered edges, voice-like modulation
  document.querySelectorAll('canvas.unw').forEach(cv => {
    const ctx = cv.getContext('2d'); let W = 0, H = 0, run = false, t = Math.random() * 10, raf = 0;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    const L = [ { a: 1, f: 2.2, s: 1.0, w: 2.2, al: 1 }, { a: .78, f: 2.9, s: -1.3, w: 1.4, al: .55 }, { a: .58, f: 3.7, s: 1.7, w: 1.1, al: .42 }, { a: .4, f: 1.5, s: -.8, w: 1, al: .32 } ];
    const env = x => Math.pow(Math.sin(Math.PI * x), 1.6);
    const voice = (x, tt) => .5 + .5 * (.6 * Math.sin(tt * .8 + x * 2.6) * Math.sin(tt * .31 + x * 6.1) + .4 * Math.sin(tt * 1.7 + x * 11.0));
    const yAt = (l, x, tt) => { const u = x / W; return H / 2 + H * .4 * l.a * env(u) * (.25 + .75 * voice(u, tt + l.s)) * Math.sin(Math.PI * 2 * u * l.f + tt * l.s * 1.6); };
    const grad = () => { const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(62,205,198,0)'); g.addColorStop(.2, '#3ecdc6'); g.addColorStop(.5, '#9FE9FF'); g.addColorStop(.8, '#2ea8d5'); g.addColorStop(1, 'rgba(46,168,213,0)'); return g; };
    const draw = () => {
      ctx.clearRect(0, 0, W, H); const g = grad(), step = 3;
      // soft lens fill between the main wave and its mirror
      ctx.beginPath(); for (let x = 0; x <= W; x += step) { const y = yAt(L[0], x, t); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      for (let x = W; x >= 0; x -= step) ctx.lineTo(x, H - yAt(L[0], x, t));
      const fg = ctx.createLinearGradient(0, 0, W, 0); fg.addColorStop(0, 'rgba(62,205,198,0)'); fg.addColorStop(.5, 'rgba(110,210,240,.16)'); fg.addColorStop(1, 'rgba(46,168,213,0)');
      ctx.fillStyle = fg; ctx.fill();
      for (let k = L.length - 1; k >= 0; k--) { const l = L[k];
        for (const mir of [false, true]) { if (mir && k > 1) continue;
          ctx.beginPath(); for (let x = 0; x <= W; x += step) { let y = yAt(l, x, t); if (mir) y = H - y; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.strokeStyle = g; ctx.lineWidth = l.w; ctx.globalAlpha = l.al * (mir ? .45 : 1);
          ctx.shadowColor = 'rgba(80,220,230,.75)'; ctx.shadowBlur = k === 0 ? 14 : 6; ctx.stroke(); } }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    };
    const loop = () => { t += .012; draw(); if (run) raf = requestAnimationFrame(loop); };
    size(); draw(); addEventListener('resize', () => { size(); draw(); });
    if (!reduce && 'IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting && !run) { run = true; loop(); } else if (!en.isIntersecting) { run = false; cancelAnimationFrame(raf); } })).observe(cv);
  });
  // v8.2 — Let's Talk: film first, then the glass card materialises as you scroll
  document.querySelectorAll('.px-final-sec.has-film').forEach(sec => {
    const up = () => { const r = sec.getBoundingClientRect(), vh = innerHeight; const p = Math.min(1, Math.max(0, (vh * .8 - r.top) / (vh * .75))); sec.style.setProperty('--gp', (p * p * (3 - 2 * p)).toFixed(3)); };
    addEventListener('scroll', up, { passive: true }); addEventListener('resize', up); up();
  });
  // v10 — Moveworks app: request typed into the composer → sent → assistant typing → reply card (loops while on screen)
  document.querySelectorAll('figure.ma').forEach(app => {
    const conv = JSON.parse(app.dataset.conv || '[]'), icons = JSON.parse(app.dataset.icons || '{}');
    const feed = app.querySelector('.ma-feed'), scroll = app.querySelector('.ma-scroll'), comp = app.querySelector('.ma-composer'),
          typed = app.querySelector('.ma-typed'), send = app.querySelector('.ma-send'), steps = [...document.querySelectorAll('#moveworks .mw-steps li')];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !conv.length) return;   // static conversation stays visible
    const esc = t => t.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const SP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.7 4.6L18 9.3l-4.3 1.7L12 15.6l-1.7-4.6L6 9.3l4.3-1.7z"/></svg>';
    let timers = [], vis = false, run = 0;
    const wait = ms => new Promise(r => timers.push(setTimeout(r, ms)));
    const fit = () => { const over = feed.scrollHeight - scroll.clientHeight; feed.style.transform = `translateY(${-Math.max(0, over)}px)`; };
    const row = (who, inner) => { const d = document.createElement('div'); d.className = 'ma-row enter ' + who;
      d.innerHTML = who === 'u' ? `<span class="ma-av you">You</span><div><span class="ma-name">You <small>now</small></span>${inner}</div>`
                                : `<span class="ma-av bot">${SP}</span><div><span class="ma-name">Assistant <em>App</em> <small>now</small></span>${inner}</div>`;
      feed.appendChild(d); requestAnimationFrame(fit); return d; };
    const stage = app.closest('.mw2-stage');
    const hit = k => { if (!stage) return; const t = stage.querySelector(`.mw2-tool[data-k="${k}"]`), b = stage.querySelector(`.mw2-beam[data-k="${k}"]`);
      t && t.classList.add('hit'); b && b.classList.add('lit'); timers.push(setTimeout(() => { t && t.classList.remove('hit'); b && b.classList.remove('lit'); }, 2200)); };
    const play = async id => {
      stage && stage.querySelectorAll('.hit,.lit').forEach(e => e.classList.remove('hit', 'lit'));
      feed.innerHTML = ''; feed.style.transform = ''; await wait(500);
      for (let i = 0; i < conv.length; i++) {
        if (id !== run) return; const c = conv[i];
        steps.forEach((s, k) => s.classList.toggle('on', k === Math.min(steps.length - 1, i + (i === conv.length - 1 ? 1 : 0))));
        comp.classList.add('focus'); await wait(350);
        comp.classList.add('typing');
        for (let k = 1; k <= c.u.length; k++) { if (id !== run) return; typed.textContent = c.u.slice(0, k); await wait(28 + Math.random() * 40); }
        await wait(300); send.classList.add('press'); await wait(140); send.classList.remove('press');
        typed.textContent = ''; comp.classList.remove('typing');
        row('u', `<span class="ma-msg">${esc(c.u)}</span>`); hit('slack'); await wait(500);
        const t = row('b', '<span class="ma-typing"><i></i><i></i><i></i></span>'); await wait(1100); if (id !== run) return;
        t.querySelector('div').lastElementChild.outerHTML = c.k === 'ok'
          ? `<span class="ma-card ok pop">${icons[c.i] || ''}${esc(c.t)}</span>`
          : `<span class="ma-msg">${esc(c.t)} <a href="#moveworks">View guide</a></span>`;
        requestAnimationFrame(fit); c.tool && hit(c.tool); await wait(1300);
      }
      comp.classList.remove('focus'); await wait(3600);
      if (id === run && vis) play(++run);
    };
    new IntersectionObserver(es => es.forEach(en => { vis = en.isIntersecting;
      if (vis) { timers.forEach(clearTimeout); timers = []; play(++run); } else { run++; timers.forEach(clearTimeout); timers = []; } }), { threshold: .35 }).observe(app);
  });
  // v10.7 — Moveworks stage: reveal hairlines, gentle pointer parallax
  document.querySelectorAll('.mw2').forEach(sec => {
    new IntersectionObserver((es, o) => es.forEach(en => { if (en.isIntersecting) { sec.classList.add('in'); o.disconnect(); } }), { threshold: .2 }).observe(sec);
    const st = sec.querySelector('.mw2-stage'); if (!st || matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return;
    st.addEventListener('pointermove', e => { const r = st.getBoundingClientRect(); st.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); st.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
    st.addEventListener('pointerleave', () => { st.style.setProperty('--mx', 0); st.style.setProperty('--my', 0); });
  });
  // v10 — EmployeeWorks app: requests arrive → Otto picks one up → signal flows to ServiceNow → the case fills in
  document.querySelectorAll('.ew').forEach(sec => {
    const app = sec.querySelector('figure.ea'), reqs = [...app.querySelectorAll('.ea-req')], fields = [...app.querySelectorAll('.ea-f')],
          steps = [...sec.querySelectorAll('.ew-steps li')], rail = sec.querySelector('.ew-stepw'), btn = sec.querySelector('.ew-replay');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let timers = [], vis = false;
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const step = k => { steps.forEach((s, j) => s.classList.toggle('on', j === k)); rail && rail.style.setProperty('--ewp', ((k + 1) / steps.length * 100) + '%'); };
    const play = () => {
      timers.forEach(clearTimeout); timers = [];
      app.classList.remove('flow', 'fin'); app.classList.add('play'); app.style.setProperty('--eap', '0%');
      reqs.forEach(r => r.classList.remove('on', 'pick', 'done')); fields.forEach(f => f.classList.remove('on'));
      let t = 300; step(0);
      reqs.forEach(r => { at(t, () => r.classList.add('on')); t += 520; });
      at(t += 300, () => { reqs[3].classList.add('pick'); step(1); });
      at(t += 900, () => { app.classList.add('flow'); step(2); });
      fields.forEach((f, k) => at(t += 950, () => { f.classList.add('on'); app.style.setProperty('--eap', ((k + 1) / fields.length * 100) + '%'); }));
      at(t += 900, () => { app.classList.remove('flow'); app.classList.add('fin'); reqs[3].classList.add('done'); step(3); });
      at(t + 4200, () => { if (vis) play(); });
    };
    btn && btn.addEventListener('click', () => { app.scrollIntoView({ behavior: 'smooth', block: 'center' }); play(); });
    new IntersectionObserver(es => es.forEach(en => { const was = vis; vis = en.isIntersecting; if (vis && !was) play(); if (!vis) { timers.forEach(clearTimeout); timers = []; } }), { threshold: .3 }).observe(app);
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
  setTimeout(() => ScrollTrigger.refresh(), 700);
})();

/* ===================== v15 What we do: ServiceNow slider + service tabs ===================== */
(() => {
  const p = document.querySelector('.wq-sn-panel');
  if (p) {
    const tr = p.querySelector('.wq-track'), cards = [...tr.querySelectorAll('.wq-card')], segs = [...p.querySelectorAll('.wq-seg button')],
      prev = p.querySelector('.wq-prev'), next = p.querySelector('.wq-next'), bar = p.querySelector('.wq-bar i');
    const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : tr.clientWidth * .8);
    prev.addEventListener('click', () => tr.scrollBy({ left: -step() }));
    next.addEventListener('click', () => tr.scrollBy({ left: step() }));
    segs.forEach(b => b.addEventListener('click', () => { const c = cards[+b.dataset.to]; if (c) tr.scrollTo({ left: c.offsetLeft - cards[0].offsetLeft }); }));
    const upd = () => { const max = tr.scrollWidth - tr.clientWidth, x = tr.scrollLeft;
      prev.disabled = x < 4; next.disabled = x > max - 4;
      const w = tr.clientWidth / tr.scrollWidth; bar.style.setProperty('--w', (w * 100).toFixed(2) + '%');
      bar.style.setProperty('--x', ((max ? x / max : 0) * (1 / w - 1) * 100).toFixed(2) + '%');
      const aiAt = cards[+segs[1].dataset.to].offsetLeft - cards[0].offsetLeft, onAI = x + tr.clientWidth * .5 >= aiAt || x >= max - 4 && aiAt > max;
      segs.forEach((b, i) => { const on = i === (onAI ? 1 : 0); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); }); };
    tr.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true }); addEventListener('resize', upd); upd();
    tr.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); } if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); } });
    /* drag to scroll on desktop */
    let sx = 0, sl = 0, drag = false, moved = false;
    tr.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; drag = true; moved = false; sx = e.clientX; sl = tr.scrollLeft; tr.style.scrollSnapType = 'none'; tr.style.scrollBehavior = 'auto'; });
    addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; tr.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (!drag) return; drag = false; tr.style.scrollSnapType = ''; tr.style.scrollBehavior = ''; });
    tr.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);
  }
  const rail = document.querySelector('.wq-rail');
  if (rail) {
    const tabs = [...rail.querySelectorAll('[role=tab]')];
    const sel = t => tabs.forEach(x => { const on = x === t, pane = document.getElementById(x.getAttribute('aria-controls'));
      x.classList.toggle('on', on); x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; pane.hidden = !on; pane.classList.toggle('on', on); });
    tabs.forEach((t, i) => { t.addEventListener('click', () => sel(t));
      t.addEventListener('keydown', e => { const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!k) return; e.preventDefault();
        const n = tabs[(i + k + tabs.length) % tabs.length]; n.focus(); sel(n); }); });
  }
})();

/* ===================== v17.3 What we do: tabs (one group at a time), list pinned while that group's cards scroll ===================== */
(() => {
  const tabs = [...document.querySelectorAll('.wd-row[role=tab]')]; if (!tabs.length) return;
  const right = document.querySelector('.wd-right'), off = () => (innerWidth <= 1000 ? 150 : 110);
  const sel = (t, scroll) => { tabs.forEach(x => { const on = x === t, p = document.getElementById(x.getAttribute('aria-controls'));
      x.classList.toggle('on', on); x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; p.hidden = !on; p.classList.toggle('on', on); });
    if (innerWidth <= 1000) { const bar = t.closest('.wd-list'); bar.scrollTo({ left: t.offsetLeft - (bar.clientWidth - t.offsetWidth) / 2, behavior: 'smooth' }); }
    if (scroll) { const top = right.getBoundingClientRect().top; if (top < off() - 4 || top > innerHeight * .5) { const y = scrollY + top - off();
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: .9 }); else scrollTo({ top: y, behavior: 'smooth' }); } }
    if (window.ScrollTrigger) ScrollTrigger.refresh(); };
  tabs.forEach((t, i) => { t.addEventListener('click', () => sel(t, true));
    t.addEventListener('keydown', e => { const k = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key]; if (!k) return; e.preventDefault();
      const n = tabs[(i + k + tabs.length) % tabs.length]; n.focus(); sel(n, false); }); });
})();

/* ===================== v19 nested menu: hover/click switches category (desktop), accordion (mobile) ===================== */
(() => {
  const cats = [...document.querySelectorAll('.mg2 .mg-cat')]; if (!cats.length) return;
  const mob = () => innerWidth <= 900;
  const set = (c, toggle) => cats.forEach(x => { const on = x === c ? (toggle && mob() ? !x.classList.contains('on') : true) : (mob() ? false : false);
    x.classList.toggle('on', on); x.querySelector('.mg-tab').setAttribute('aria-expanded', on); });
  cats.forEach(c => { const t = c.querySelector('.mg-tab');
    t.addEventListener('click', e => { e.stopPropagation(); set(c, true); });
    t.addEventListener('mouseenter', () => { if (!mob() && matchMedia('(hover: hover)').matches) set(c, false); });
    t.addEventListener('focus', () => { if (!mob()) set(c, false); }); });
  if (mob()) cats.forEach(x => { x.classList.remove('on'); x.querySelector('.mg-tab').setAttribute('aria-expanded', 'false'); });
})();

/* ===================== v21 enter/exit motion + cursor labels ===================== */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM;
  // ---- in / out: headings, lead copy, cards and actions fade+rise in as they enter, drift out as they leave (either direction)
  if (!reduce && 'IntersectionObserver' in window) {
    const SEL = ['main section h2', 'main .nv-head-side p', 'main .wd-intro-side p', 'main .wd-head', '.wd-sn-glass', 'main .wd-card', 'main .bt-tile',
      'main .mw2-stage', 'main .mw3-feats > *', 'main .ew-copy > *', 'main .un .ut-h', 'main .px-final', 'main .sv-card', 'main .inr-cards .gx-card',
      'main .prose p', 'main .steps .step', 'main .sec-head .lede', 'main .ibt-sec .bt-tile', 'main .kpis .kpi', 'main .page-hero .sub', 'main .hero-actions',
      'main .wb', 'main .pager', 'main .ss-tile', 'main .ss-strip', 'main .ss-cta', 'main .ss-eb', 'main .xp-card', 'main .xp-kid', 'main .mx-card', 'main .wx-card', 'main .hc-card', 'main .xp-loc', 'main .xp-person', 'main .xp-list .sot-item', 'main .xp-trust', '.footer .footer-top > *'].join(',');
    const skip = el => el.closest('.stk, .p2-stick, .wd-list, .mega, .lx-hero, [aria-hidden="true"], .ma-app, .ea-app, .pvx-stack');  // v48: stacked product cards stay readable while stuck
    const els = [...document.querySelectorAll(SEL)].filter(el => !skip(el));
    const io = new IntersectionObserver(es => es.forEach(en => { const el = en.target;
      if (en.isIntersecting) { el.classList.remove('rv-up'); el.classList.add('rv-in'); }
      else { el.classList.remove('rv-in'); el.classList.toggle('rv-up', en.boundingClientRect.top < 0); } }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    els.forEach(el => { const sib = el.parentElement ? [...el.parentElement.children].filter(c => els.includes(c)) : [];
      const i = Math.max(0, sib.indexOf(el)); el.style.setProperty('--rvd', Math.min(i, 5) * 0.07 + 's');
      const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) el.classList.add('rv', 'rv-in'); else el.classList.add('rv');
      io.observe(el); });
  }
  // ---- cursor labels: only on things that are links, and the label says where the click goes
  const cur = () => document.querySelector('.px-cursor');
  const CARD = '.wd-sn, .wd-card, .stk .sc-card, .sv-card, a.gx-card, a.xp-kid, a.mx-card, a.wx-card, a.nb-card, .mg-card, .pager a, .lx-logos-row img';
  const labelFor = (m) => {
    if (m.matches('.lx-logos-row img')) return null;
    if (m.matches('.wd-sn')) return m.classList.contains('wd-ss') ? ['Explore Smartsourcing', ''] : ['Explore ServiceNow', 'sn'];
    if (m.matches('.pager a')) return [m.classList.contains('prev') ? 'Previous page' : m.classList.contains('next') ? 'Next page' : 'Overview', ''];
    const a = m.matches('a[href]') ? m : m.querySelector('a[href]'); if (!a) return null;
    const h = a.getAttribute('href') || '';
    if (h === '#contact') return ['Let\u2019s talk', ''];
    if (/^https?:/.test(h)) return ['Visit page \u2197', ''];
    if (/^(servicenow|ai-agents|ai-control|cmdb|it-service|it-operations|customer-service|field-service|hr-service|strategic-portfolio|now-platform|governance-risk|servicenow-otto)/.test(h)) return ['Explore', m.closest('.stk') ? '' : 'sn'];
    if (/^contact\.html/.test(h)) return ['Let\u2019s talk', ''];
    if (/\.html/.test(h)) return ['Explore', ''];
    return ['Read more', ''];
  };
  let last = '';
  addEventListener('pointermove', e => { const c = cur(); if (!c) return;
    const t = e.target; let hit = null;
    if (!t.closest('a.neo, button, .neo-btn, .header, .mega, .wd-list')) { const m = t.closest(CARD); if (m && false) hit = labelFor(m); }  // v44: no label pill over cards (cards carry their own CTA)
    const key = hit ? hit.join('|') : '';
    if (key === last) return; last = key;
    if (hit) { c.dataset.label = hit[0]; c.style.setProperty('--lw', Math.max(96, hit[0].length * 8 + 52) + 'px'); c.classList.add('lbl'); c.classList.toggle('lbl-sn', hit[1] === 'sn'); }
    else { c.classList.remove('lbl', 'lbl-sn'); }
  }, { passive: true });
})();

/* ===================== v23 giant wordmarks: fit to width + gentle drift ===================== */
(() => {
  const gs = [...document.querySelectorAll('.giant span')]; if (!gs.length) return;
  const fit = () => gs.forEach(s => { s.style.fontSize = ''; const w = s.getBoundingClientRect().width, W = s.parentElement.clientWidth;
    if (w > 0) s.style.fontSize = (parseFloat(getComputedStyle(s).fontSize) * (W * 0.97) / w) + 'px'; });
  fit(); addEventListener('resize', fit); document.fonts && document.fonts.ready.then(fit);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM) return;
  let raf = 0;
  const tick = () => { raf = 0; const vh = innerHeight;
    gs.forEach(s => { const r = s.parentElement.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return;
      const p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2); s.style.setProperty('--gx', (p * 4).toFixed(2) + 'vw'); }); };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true }); tick();
})();

/* ===================== v24 Service Offerings tabs (auto-advance while in view, stops on interaction) ===================== */
(() => {
  document.querySelectorAll('[data-sot]').forEach(root => {
    const tabs = [...root.querySelectorAll('.sot-tab')], panels = [...root.querySelectorAll('.sot-panel')];
    let cur = 0, auto = !(matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM), vis = false, hold = false, t0 = 0;
    const DUR = 7000;
    const show = (i, focus) => { cur = (i + tabs.length) % tabs.length;
      tabs.forEach((t, k) => { const on = k === cur; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1; t.style.setProperty('--p', 0); });
      panels.forEach((p, k) => { const on = k === cur; p.classList.toggle('on', on); p.hidden = !on; });
      const t = tabs[cur], bar = t.parentElement; if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: t.offsetLeft - 16, behavior: 'smooth' });
      if (focus) t.focus(); t0 = performance.now(); };
    const stop = () => { auto = false; tabs.forEach(t => t.style.setProperty('--p', 0)); };
    tabs.forEach((t, i) => { t.addEventListener('click', () => { stop(); show(i); });
      t.addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
        if (d) { e.preventDefault(); stop(); show(cur + d, true); } else if (e.key === 'Home') { e.preventDefault(); stop(); show(0, true); } else if (e.key === 'End') { e.preventDefault(); stop(); show(tabs.length - 1, true); } }); });
    root.addEventListener('pointerenter', () => hold = true); root.addEventListener('pointerleave', () => { hold = false; t0 = performance.now() - (parseFloat(tabs[cur].style.getPropertyValue('--p')) || 0) * DUR; });
    new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; if (vis) t0 = performance.now(); }), { threshold: .35 }).observe(root);
    const loop = now => { if (!auto) return;
      if (vis && !hold) { const p = (now - t0) / DUR; if (p >= 1) show(cur + 1); else tabs[cur].style.setProperty('--p', p.toFixed(4)); } else t0 = now - (parseFloat(tabs[cur].style.getPropertyValue('--p')) || 0) * DUR;
      requestAnimationFrame(loop); };
    show(0); if (auto) requestAnimationFrame(loop);
  });
})();

/* ===================== v25 contact form: posts to window.XT_FORM_ENDPOINT, falls back to an email draft ===================== */
(() => {
  document.querySelectorAll('[data-xt-form]').forEach(f => {
    const st = f.querySelector('.xp-fs');
    f.addEventListener('submit', async ev => { ev.preventDefault();
      let ok = true; f.querySelectorAll('[required]').forEach(i => { const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)); i.setAttribute('aria-invalid', bad); if (bad) ok = false; });
      if (!ok) { st.textContent = 'Please fill in your name, a valid email and a message.'; return; }
      const data = Object.fromEntries(new FormData(f).entries());
      if (window.XT_FORM_ENDPOINT) {
        st.textContent = 'Sending…';
        try { const r = await fetch(window.XT_FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
          if (!r.ok) throw 0; f.reset(); st.textContent = 'We have received your message. Someone from our team will be in touch with you soon. Have a great day!'; return; } catch (e) { st.textContent = 'Could not send right now, opening your email instead.'; }
      }
      const body = `Name: ${data.name}\nEmail: ${data.email}\nCompany: ${data.company || ''}\nPhone: ${data.phone || ''}\nInterested in: ${data.interest}\n\n${data.message}`;
      location.href = 'mailto:contact@exterprise.us?subject=' + encodeURIComponent('Enquiry: ' + data.interest) + '&body=' + encodeURIComponent(body);
      st.textContent = 'Your email app should open with the message ready to send.';
    });
  });
})();

/* ===================== v26 page-to-page navigation: new pages open at the hero, Back returns to the section you left ===================== */
(() => {
  const SS = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
  try { if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; } catch (e) {}
  const here = () => location.pathname.split('/').pop() || 'index.html';
  const save = () => SS.set('xt-y:' + here(), String(Math.round(window.__lenis ? window.__lenis.scroll : scrollY)));
  const go = (y, el) => { const L = window.__lenis;
    if (el) { const t = el.getBoundingClientRect().top + scrollY - 96; L ? L.scrollTo(t, { immediate: true, force: true }) : scrollTo(0, t); }
    else L ? L.scrollTo(y, { immediate: true, force: true }) : scrollTo(0, y); };
  // leaving: remember where we were, and which page we are heading to
  document.addEventListener('click', ev => {
    const a = ev.target.closest && ev.target.closest('a[href]'); if (!a || ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || a.target === '_blank') return;
    const h = a.getAttribute('href'); if (!h || h[0] === '#' || /^(mailto:|tel:|https?:|javascript:)/i.test(h)) return;
    const to = h.split('#')[0].split('/').pop() || 'index.html';
    save(); SS.set('xt-nav', JSON.stringify({ from: here(), to, t: Date.now() }));
  }, true);
  addEventListener('pagehide', save);
  // arriving
  const nav = (performance.getEntriesByType && performance.getEntriesByType('navigation')[0]) || {};
  let last = null; try { last = JSON.parse(SS.get('xt-nav') || 'null'); } catch (e) {}
  const me = here(), back = nav.type === 'back_forward' || (last && last.from === me && last.to !== me);
  const saved = parseFloat(SS.get('xt-y:' + me));
  const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  let touched = false; ['wheel', 'touchstart', 'keydown', 'pointerdown'].forEach(t => addEventListener(t, () => touched = true, { once: true, passive: true }));
  const place = () => { if (touched) return; if (back && !isNaN(saved)) go(saved); else if (target) go(0, target); else go(0); };
  if (last && last.to === me) SS.set('xt-nav', JSON.stringify({ from: last.from, to: me, done: 1 }));
  if (back && last && last.from === me) SS.set('xt-nav', 'null');
  place(); requestAnimationFrame(place);
  addEventListener('load', () => { place(); setTimeout(() => { if (window.ScrollTrigger) ScrollTrigger.refresh(); place(); }, 120); setTimeout(place, 450); });
  addEventListener('pageshow', e => { if (e.persisted) place(); });
})();

/* ===================== v35 mega menu: clicking a category opens its overview page (desktop pointer) ===================== */
(() => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.mg-tab[data-href]').forEach(b => b.addEventListener('click', ev => {
    const h = b.dataset.href; if (!h || !fine.matches || innerWidth <= 1000) return;
    ev.preventDefault(); ev.stopImmediatePropagation(); location.href = h;
  }, true));
})();

/* ===================== v36 hero service slider ===================== */
(() => {
  const hero = document.querySelector('.lx-hero'); if (!hero || !hero.querySelector('.lx-slides')) return;
  const slides = [...hero.querySelectorAll('.lx-slide')], media = [...hero.querySelectorAll('.lx-m')], dots = [...hero.querySelectorAll('.lx-dot')];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM, DUR0 = 4000;  // v43: slides follow each film clip at normal speed
  let cur = 0, t0 = performance.now(), vis = true, hold = false, played = 0;
  const vid = i => media[i] && media[i].querySelector('video');
  const fitRate = v => { v.playbackRate = 1; };  // v43: natural speed
  const DURf = () => { const v = vid(cur); return v && v.duration ? Math.max(3200, v.duration * 1000 - 150) : DUR0; };
  if (vid(0)) fitRate(vid(0));
  const show = i => { const prev = cur; cur = (i + slides.length) % slides.length; if (prev === cur) return;
    slides.forEach((s, k) => { s.classList.toggle('on', k === cur); s.classList.toggle('out', k === prev); if (k === cur) s.removeAttribute('aria-hidden'); else s.setAttribute('aria-hidden', 'true'); });
    setTimeout(() => slides[prev].classList.remove('out'), 500);
    media.forEach((m, k) => { m.classList.toggle('on', k === cur); if (m.classList.contains('lx-m-img') && k === cur) { const im = m.querySelector('img'); im.style.animation = 'none'; void im.offsetWidth; im.style.animation = ''; } });
    const v = vid(cur); if (v) { if (v.preload === 'none') v.preload = 'auto'; try { v.currentTime = 0; } catch (e) {} fitRate(v); v.play && v.play().catch(() => {}); }
    setTimeout(() => { const pv = vid(prev); if (pv && prev !== cur) pv.pause(); }, 900);
    const nx = vid((cur + 1) % slides.length); if (nx && nx.preload === 'none') nx.preload = 'auto';  // v40: warm the next film
    dots.forEach((d, k) => { d.classList.toggle('on', k === cur); d.classList.toggle('done', k < cur); d.style.setProperty('--p', 0); });
    t0 = performance.now(); };
  dots.forEach((d, k) => d.addEventListener('click', () => { show(k); played = 1; }));
  hero.querySelector('.lx-nav').addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key]; if (d) { e.preventDefault(); show(cur + d); dots[cur].focus(); } });
  hero.addEventListener('pointerenter', () => hold = true); hero.addEventListener('pointerleave', () => { hold = false; t0 = performance.now() - (parseFloat(dots[cur].style.getPropertyValue('--p')) || 0) * DURf(); });
  new IntersectionObserver(es => es.forEach(en => { vis = en.isIntersecting; const v = vid(cur); if (v) vis ? v.play().catch(() => {}) : v.pause(); }), { threshold: .2 }).observe(hero);
  if (calm) return;
  const loop = now => { if (vis && !hold && !document.hidden) { const p = (now - t0) / DURf(); if (p >= 1) show(cur + 1); else dots[cur].style.setProperty('--p', p.toFixed(4)); } else t0 = now - (parseFloat(dots[cur].style.getPropertyValue('--p')) || 0) * DURf(); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
})();

/* ===================== v36 RCM expanding cards (hover or click opens a card; auto-advances while in view) ===================== */
(() => {
  document.querySelectorAll('.ra-row').forEach(row => {
    const cards = [...row.querySelectorAll('.ra-card')]; let cur = 0, t0 = performance.now(), vis = false, hold = false, user = false; const DUR = 6000;
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM;
    const open = i => { cur = i; cards.forEach((c, k) => { c.classList.toggle('on', k === i); c.setAttribute('aria-expanded', k === i); c.style.setProperty('--p', 0); }); t0 = performance.now(); };
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    cards.forEach((c, i) => {
      c.addEventListener('mouseenter', () => { if (fine.matches && innerWidth > 1000) { user = true; open(i); } });
      c.addEventListener('click', () => { user = true; open(i); });
      c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); user = true; open(i); } const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (d) { e.preventDefault(); const n = (i + d + cards.length) % cards.length; cards[n].focus(); user = true; open(n); } });
    });
    row.addEventListener('pointerenter', () => hold = true); row.addEventListener('pointerleave', () => hold = false);
    new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; t0 = performance.now(); }), { threshold: .4 }).observe(row);
    if (calm) return;
    const loop = now => { if (!user && vis && !hold) { const p = (now - t0) / DUR; if (p >= 1) open((cur + 1) % cards.length); else cards[cur].style.setProperty('--p', p.toFixed(4)); } requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  });
})();

/* ===================== v36 Moveworks → EmployeeWorks → UtterNow stacked scroll + giant wordmark in/out ===================== */
(() => {
  const ids = ['moveworks', 'employeeworks', 'utternow'];
  const secs = ids.map(i => document.getElementById(i)).filter(Boolean); if (secs.length < 2) return;
  if (document.querySelector('.pshow, .pv, section.pc')) return;  // v37/v40/v49: replaced by the products showcase / panels
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM;
  const stickers = secs.slice(0, -1);
  stickers.forEach(s => { s.classList.add('stk3'); if (!s.querySelector(':scope > .stk3-veil')) { const v = document.createElement('div'); v.className = 'stk3-veil'; v.setAttribute('aria-hidden', 'true'); s.appendChild(v); } });
  const place = () => stickers.forEach(s => { s.style.top = Math.min(0, innerHeight - s.offsetHeight) + 'px'; });
  place(); addEventListener('resize', place); addEventListener('load', place);
  const giants = secs.map(s => s.querySelector('.giant span'));
  let raf = 0;
  const tick = () => { raf = 0; const vh = innerHeight, small = innerWidth < 900;
    stickers.forEach((s, i) => { const nx = secs[i + 1]; const r = nx.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / vh));   // 0 = next section below the fold, 1 = it fully covers this one
      if (calm) { s.style.transform = ''; s.style.filter = ''; return; }
      s.style.transform = p > 0 ? `scale(${(1 - p * .07).toFixed(4)})` : '';
      s.style.filter = p > 0 && !small ? `blur(${(p * 7).toFixed(2)}px)` : '';
      const veil = s.querySelector(':scope > .stk3-veil'); if (veil) veil.style.opacity = (p * .55).toFixed(3); });
    secs.forEach((s, i) => { const g = giants[i]; if (!g) return; const r = s.getBoundingClientRect();
      const enter = Math.min(1, Math.max(0, (vh - r.top) / (vh * .55)));                 // fades in as the section arrives
      const nx = secs[i + 1]; const cover = nx ? Math.min(1, Math.max(0, (vh - nx.getBoundingClientRect().top) / (vh * .6))) : Math.min(1, Math.max(0, -r.bottom / vh + 1.2 - 1));
      const leave = nx ? cover : Math.min(1, Math.max(0, (vh * .35 - r.bottom) / (vh * .35)));
      const o = calm ? 1 : Math.max(0, enter - leave);
      g.style.setProperty('--go', o.toFixed(3)); g.parentElement.style.transform = calm ? '' : `translateY(${((1 - enter) * 60 - leave * 40).toFixed(1)}px)`; });
  };
  addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); }, { passive: true }); tick();
  if (window.__lenis) window.__lenis.on('scroll', () => { if (!raf) raf = requestAnimationFrame(tick); });
})();

/* ===================== v38 products showcase: eased backdrop crossfade, drifting word, soft card focus ===================== */
(() => {
  const ps = document.querySelector('.pshow'); if (!ps) return;
  const layers = [...ps.querySelectorAll('.ps-layer')], slots = [...ps.querySelectorAll('.ps-slot')], cards = slots.map(s => s.firstElementChild);
  const words = layers.map(l => l.querySelector('.ps-word')), calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM;
  const fit = () => layers.forEach(l => { const w = l.querySelector('.ps-word>span'); w.style.fontSize = ''; const r = w.getBoundingClientRect().width; if (r) w.style.fontSize = (parseFloat(getComputedStyle(w).fontSize) * innerWidth * .96 / r) + 'px'; });
  fit(); addEventListener('resize', fit); document.fonts && document.fonts.ready.then(fit);
  const ss = x => x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x);               // smoothstep
  const cur = layers.map((_, i) => ({ o: i ? 0 : 1, y: 0, f: 1 })), cc = cards.map(() => ({ y: 0, o: 1 }));
  let vis = false, raf = 0;
  const targets = () => { const vh = innerHeight, mid = vh / 2, R = ps.getBoundingClientRect();
    const edge = ss(Math.min((vh - R.top) / (vh * .7), (R.bottom - vh * .15) / (vh * .7)));   // whole backdrop fades in/out at the section ends
    const d = slots.map(s => { const r = s.getBoundingClientRect(); return (r.top + r.height / 2 - mid) / (r.height / 2 + mid * .6); });
    const w = d.map(x => ss(1 - Math.abs(x) * 1.15)); const sum = w.reduce((a, b) => a + b, 0) || 1;
    return { edge, d, w: w.map(x => x / sum) }; };
  const frame = () => { raf = 0; const t = targets(), k = calm ? 1 : .14;
    layers.forEach((l, i) => { const c = cur[i]; c.o += (t.w[i] * t.edge - c.o) * k; c.y += (t.d[i] * 18 - c.y) * k;
      l.style.opacity = c.o.toFixed(3); if (!calm) words[i].style.transform = `translate3d(${(-t.d[i] * 3).toFixed(2)}vw, calc(-50% + ${c.y.toFixed(2)}vh), 0)`; });
    if (!calm) cards.forEach((el, i) => { const a = Math.min(1, Math.abs(t.d[i])); const c = cc[i];
      c.y += ((t.d[i] > 0 ? 1 : -1) * ss(a) * 28 - c.y) * k; c.o += ((1 - ss(Math.max(0, a - .25) / .75) * .55) - c.o) * k;
      el.style.setProperty('--cy', c.y.toFixed(1) + 'px'); el.style.setProperty('--co', c.o.toFixed(3)); });
    const moving = cur.some((c, i) => Math.abs(c.o - t.w[i] * t.edge) > .002) || cc.some((c, i) => Math.abs(c.y - (t.d[i] > 0 ? 1 : -1) * ss(Math.min(1, Math.abs(t.d[i]))) * 28) > .2);
    if (vis && moving) raf = requestAnimationFrame(frame); };
  const kick = () => { if (!raf && vis) raf = requestAnimationFrame(frame); };
  new IntersectionObserver(es => es.forEach(e => { vis = e.isIntersecting; kick(); }), { rootMargin: '20% 0px' }).observe(ps);
  addEventListener('scroll', kick, { passive: true }); if (window.__lenis) window.__lenis.on('scroll', kick); addEventListener('resize', kick);
  vis = true; frame();
})();

/* ===================== v37 healthcare category cards: tap to reveal sub-categories (hover on desktop is CSS) ===================== */
document.querySelectorAll('.hc-card .hc-tog').forEach(b => b.addEventListener('click', () => { const c = b.closest('.hc-card'); const o = c.classList.toggle('open'); b.setAttribute('aria-expanded', o); b.querySelector('span').textContent = o ? 'Hide Services' : 'View Services'; }));

/* ===================== v37 hero: swipe between services on touch screens ===================== */
(() => {
  const s = document.querySelector('.lx-hero .lx-slides'); if (!s) return; const dots = [...document.querySelectorAll('.lx-hero .lx-dot')]; let x0 = null, y0 = 0;
  s.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  s.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) { const cur = dots.findIndex(d => d.classList.contains('on')); const n = (cur + (dx < 0 ? 1 : -1) + dots.length) % dots.length; dots[n].click(); } }, { passive: true });
})();

/* ===================== v37 quick-view pop-ups: cards for thin sub-pages open a summary first ===================== */
(() => {
  document.querySelectorAll('a[data-qv]').forEach(a => a.addEventListener('click', ev => {
    if (ev.metaKey || ev.ctrlKey || ev.shiftKey) return; const d = document.getElementById(a.dataset.qv); if (!d || !d.showModal) return;
    ev.preventDefault(); d.showModal(); if (window.__lenis) window.__lenis.stop(); }));
  document.querySelectorAll('dialog.qv').forEach(d => { d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-qv-close]')) d.close(); });
    d.addEventListener('close', () => { if (window.__lenis) window.__lenis.start(); }); });
})();


/* ===================== v39 What We Do photo-stack cards: 3D tilt on pointer, centred-card focus + dots on swipe rails ===================== */
(() => {
  const rail = document.querySelector('.wx-rail'); if (!rail) return;
  const cards = [...rail.querySelectorAll('.wx-card')], dots = [...document.querySelectorAll('.wx-dots i')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, wide = matchMedia('(min-width: 900px)'), fine = matchMedia('(hover: hover)');
  if (!reduce) cards.forEach(c => {
    const st = c.querySelector('.wx-stage'); let raf = 0;
    c.addEventListener('pointermove', e => { if (!wide.matches || !fine.matches || e.pointerType !== 'mouse') return; cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { const r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.setProperty('--mx', x.toFixed(3)); c.style.setProperty('--my', y.toFixed(3)); }); });
    c.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); c.style.setProperty('--mx', '0'); c.style.setProperty('--my', '0'); });
  });
  // swipe rail (below 900px): the card nearest the centre is the active (gold) one
  let tk = 0;
  const pick = () => { tk = 0; if (wide.matches) { cards.forEach(c => c.classList.remove('is-on')); return; }
    const r = rail.getBoundingClientRect(), mid = r.left + r.width / 2; let best = 0, bd = 1e9;
    cards.forEach((c, i) => { const b = c.getBoundingClientRect(), d = Math.abs(b.left + b.width / 2 - mid); if (d < bd) { bd = d; best = i; } });
    cards.forEach((c, i) => c.classList.toggle('is-on', i === best)); dots.forEach((d, i) => d.classList.toggle('on', i === best)); };
  rail.addEventListener('scroll', () => { if (!tk) tk = requestAnimationFrame(pick); }, { passive: true });
  addEventListener('resize', () => { if (!tk) tk = requestAnimationFrame(pick); });
  pick();
})();

/* ===================== v40 sub-page service cards: contained 3D tilt on pointer ===================== */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.xp-kid').forEach(c => { const im = c.querySelector('.xp-kid-img'); if (!im) return; let raf = 0;
    c.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { const r = im.getBoundingClientRect(); c.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); c.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); }); });
    c.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); c.style.setProperty('--mx', '0'); c.style.setProperty('--my', '0'); }); });
})();

/* ===================== v40 products chapters: panel reveal, sliding word, card focus, tabs, film play/pause ===================== */
(() => {
  const pv = document.querySelector('.pv'); if (!pv || !pv.querySelector('.pv-stick')) return;  // v44: superseded by the single backdrop
  const chs = [...pv.querySelectorAll('.pv-ch')], tabs = [...pv.querySelectorAll('.pv-tab')];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM;
  const cl = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
  let tk = 0;
  const run = () => { tk = 0; const H = innerHeight; let act = 0;
    chs.forEach((ch, i) => { const r = ch.getBoundingClientRect(); if (r.bottom < -H || r.top > H * 1.5) return;
      const ein = cl((H - r.top) / (H * .85)), wp = cl((H - r.top) / (r.height + H)), eout = cl((H - r.bottom) / H);
      ch.style.setProperty('--ein', calm ? 1 : ein.toFixed(4)); ch.style.setProperty('--wx', calm ? 0 : (22 - wp * 70).toFixed(2)); ch.style.setProperty('--eout', eout.toFixed(3));
      const c = ch.querySelector('.pv-card'); if (c) { const cr = c.getBoundingClientRect(); const cin = cl((H - cr.top) / (H * .55)); c.style.setProperty('--cin', calm ? 1 : cin.toFixed(4));
        const cf = cl(Math.min((H * .92 - cr.top) / (H * .35), (cr.bottom - H * .12) / (H * .3)));  // v43: focus = card in view -> calm backdrop
        ch.style.setProperty('--cf', cf.toFixed(3)); const fv = ch.querySelector('.pv-film'); if (fv) fv.playbackRate = Math.max(.4, 1 - cf * .6); }
      if (r.top < H * .5 && r.bottom > H * .5) act = i; });
    tabs.forEach((t, i) => t.classList.toggle('on', i === act)); };
  const q = () => { if (!tk) tk = requestAnimationFrame(run); };
  addEventListener('scroll', q, { passive: true }); addEventListener('resize', q); if (window.__lenis) window.__lenis.on('scroll', q); run();
  tabs.forEach((t, i) => t.addEventListener('click', e => { e.preventDefault(); const c = chs[i].querySelector('.pv-card'); const y = c.getBoundingClientRect().top + scrollY - innerHeight * .14;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: 'smooth' }); }));
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(es => es.forEach(en => { const v = en.target.querySelector('.pv-film'); if (!v) return;
      if (en.isIntersecting && !calm) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { rootMargin: '20% 0px' });
    chs.forEach(c => io.observe(c));
    const uf = pv.querySelector('.ut-film'); if (uf) new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting && !calm) { uf.preload = 'auto'; uf.play().catch(() => {}); } else uf.pause(); })).observe(uf); }
  pv.querySelectorAll('.pv-card').forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--gx', ((e.clientX - r.left) / r.width).toFixed(3)); }));
})();

/* ===================== v40 Smartsourcing bento: contained 3D tilt ===================== */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.nb-card').forEach(c => { let raf = 0;
    c.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); c.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); }); });
    c.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); c.style.setProperty('--mx', '0'); c.style.setProperty('--my', '0'); }); });
})();

/* ===================== v41 sub-pages: contained tilt on link cards, films play only when visible ===================== */
(() => {
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM;
  if (!calm) document.querySelectorAll('body.inr a.xp-card, body.inr a.xp-ic-card, body.inr a.sv-card.sgl, body.inr .pager a, .ov41').forEach(c => { let raf = 0;
    c.addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3)); c.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3)); }); });
    c.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); c.style.setProperty('--mx', '0'); c.style.setProperty('--my', '0'); }); });
  const vids = document.querySelectorAll('video[data-io-play]'); if (!vids.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(es => es.forEach(en => { const v = en.target; if (en.isIntersecting && !calm) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }), { rootMargin: '15% 0px' });
  vids.forEach(v => io.observe(v));
})();

/* ===================== v42 swipe rails: lock the axis so a vertical page scroll never drags a rail sideways ===================== */
(() => {
  const rails = () => [...document.querySelectorAll('main *')].filter(el => { const cs = getComputedStyle(el); return /(auto|scroll)/.test(cs.overflowX) && el.scrollWidth > el.clientWidth + 8 && el.clientWidth > 200; });
  let list = []; const refresh = () => { list = rails(); }; addEventListener('load', refresh); addEventListener('resize', () => setTimeout(refresh, 200)); setTimeout(refresh, 800);
  let x0 = 0, y0 = 0, rail = null, decided = false;
  document.addEventListener('touchstart', e => { rail = list.find(r => r.contains(e.target)) || null; if (!rail) return; x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; decided = false; }, { passive: true });
  document.addEventListener('touchmove', e => { if (!rail || decided) return; const dx = Math.abs(e.touches[0].clientX - x0), dy = Math.abs(e.touches[0].clientY - y0);
    if (dx + dy < 8) return; decided = true; if (dy > dx * 0.8) rail.classList.add('rail-lock'); }, { passive: true });
  const end = () => { if (rail) { const r = rail; setTimeout(() => r.classList.remove('rail-lock'), 60); } rail = null; };
  document.addEventListener('touchend', end, { passive: true }); document.addEventListener('touchcancel', end, { passive: true });
})();

/* ===================== v43 mobile What We Do: tabs, chips, bottom sheet ===================== */
(() => {
  const root = document.querySelector('[data-wxm]'); if (!root) return;
  const tabs = [...root.querySelectorAll('.wxm-tab')], panels = [...root.querySelectorAll('.wxm-grid')], chips = root.querySelector('.wxm-chips');
  tabs.forEach(t => t.addEventListener('click', () => { tabs.forEach(x => { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t); });
    panels.forEach(p => p.hidden = p.dataset.panel !== t.dataset.tab); chips.hidden = t.dataset.tab !== 'svc'; }));
  root.querySelectorAll('.wxm-chip').forEach(c => c.addEventListener('click', () => { root.querySelectorAll('.wxm-chip').forEach(x => x.classList.toggle('on', x === c));
    const f = c.dataset.f; root.querySelectorAll('.wxm-grid[data-panel="svc"] .wxm-tile').forEach(t => t.classList.toggle('is-hide', f !== 'All Services' && t.dataset.g !== f)); }));
  const sheet = root.querySelector('.wxm-sheet'), panel = sheet.querySelector('.wxm-panel'); document.body.appendChild(sheet);
  let last = null;
  const open = t => { last = t; sheet.querySelector('.wxm-photo').src = t.dataset.img; const cast = sheet.querySelector('.wxm-cast'), p2 = sheet.querySelector('.wxm-photo2'); sheet.classList.toggle('has-cast', !!t.dataset.act); if (t.dataset.act) { cast.src = t.dataset.act; cast.hidden = false; p2.src = t.dataset.img2; p2.hidden = false; } else { cast.hidden = true; cast.removeAttribute('src'); p2.hidden = true; } sheet.querySelector('.wxm-g').textContent = t.dataset.g;
    sheet.querySelector('.wxm-h').textContent = t.dataset.t; sheet.querySelector('.wxm-d').textContent = t.dataset.d;
    const go = sheet.querySelector('.wxm-go'); go.href = t.dataset.h; go.querySelector('.neo-t').textContent = 'Explore ' + t.dataset.t;
    sheet.hidden = false; requestAnimationFrame(() => requestAnimationFrame(() => sheet.classList.add('open'))); if (window.__lenis) window.__lenis.stop(); document.documentElement.style.overflow = 'hidden';
    setTimeout(() => sheet.querySelector('.wxm-x').focus({ preventScroll: true }), 300); };
  const close = () => { sheet.classList.remove('open'); panel.style.transform = ''; setTimeout(() => { sheet.hidden = true; }, 420); if (window.__lenis) window.__lenis.start(); document.documentElement.style.overflow = ''; if (last) last.focus({ preventScroll: true }); };
  root.querySelectorAll('.wxm-tile').forEach(t => t.addEventListener('click', () => open(t)));
  sheet.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', close));
  sheet.querySelector('.wxm-go').addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) close(); });
  let y0 = null; panel.addEventListener('touchstart', e => { if (panel.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
  panel.addEventListener('touchmove', e => { if (y0 === null) return; const dy = e.touches[0].clientY - y0; if (dy > 0) panel.style.transform = `translateY(${dy}px)`; }, { passive: true });
  panel.addEventListener('touchend', e => { if (y0 === null) return; const dy = e.changedTouches[0].clientY - y0; y0 = null; if (dy > 90) close(); else panel.style.transform = ''; }, { passive: true });
})();


/* ===================== v44 products: single backdrop, crossfading product layers, calm focus ===================== */
(() => {
  const pv = document.querySelector('.pv'); if (!pv || !pv.querySelector('.pv-bg') || pv.querySelector('.pv-stack')) return;  // v45: superseded by the stack
  const bg = pv.querySelector('.pv-bg'), layers = [...pv.querySelectorAll('.pv-layer')], chs = [...pv.querySelectorAll('.pv-ch')], tabs = [...pv.querySelectorAll('.pv-tab')];
  const films = layers.map(l => l.querySelector('.pv-film'));
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM;
  const cl = v => v < 0 ? 0 : v > 1 ? 1 : v, ss = v => v * v * (3 - 2 * v);
  let tk = 0, inView = false;
  const run = () => { tk = 0; const H = innerHeight, pr = pv.getBoundingClientRect(); if (pr.bottom < -H * .2 || pr.top > H * 1.2) return;
    bg.style.setProperty('--bgo', Math.min(cl((H * .95 - pr.top) / (H * .8)), cl((pr.bottom - H * .35) / (H * .6))).toFixed(3));
    const fade = chs.map((ch, i) => i === 0 ? 1 : ss(cl((H * .85 - ch.getBoundingClientRect().top) / (H * .7))));  // next product fades in as its chapter arrives
    let act = 0;
    layers.forEach((l, i) => { const next = fade[i + 1] || 0; l.style.setProperty('--lo', fade[i].toFixed(3)); l.style.setProperty('--rc', calm ? 0 : next.toFixed(3));
      const r = chs[i].getBoundingClientRect(), c = chs[i].querySelector('.pv-card');
      if (c) { const cr = c.getBoundingClientRect(); const cin = cl((H - cr.top) / (H * .55)); c.style.setProperty('--cin', calm ? 1 : cin.toFixed(4));
        const cf = cl(Math.min((H * .92 - cr.top) / (H * .35), (cr.bottom - H * .12) / (H * .3))); l.style.setProperty('--cf', calm ? 0 : cf.toFixed(3));
        if (films[i]) films[i].playbackRate = Math.max(.4, 1 - cf * .6); }
      l.style.setProperty('--wx', calm ? 0 : (18 - cl((H - r.top) / (r.height + H)) * 50).toFixed(2));
      if (fade[i] > .5) act = i; });
    tabs.forEach((t, i) => t.classList.toggle('on', i === act));
    if (inView && !calm) films.forEach((v, i) => { const show = parseFloat(layers[i].style.getPropertyValue('--lo')) > .01 && (fade[i + 1] || 0) < .999;
      if (show) { if (v.preload === 'none') v.preload = 'auto'; if (v.paused) v.play().catch(() => {}); } else if (!v.paused) v.pause(); }); };
  const q = () => { if (!tk) tk = requestAnimationFrame(run); };
  addEventListener('scroll', q, { passive: true }); addEventListener('resize', q); if (window.__lenis) window.__lenis.on('scroll', q);
  new IntersectionObserver(es => es.forEach(en => { inView = en.isIntersecting; if (!inView) films.forEach(v => v.pause()); q(); }), { rootMargin: '10% 0px' }).observe(pv);
  run();
  tabs.forEach((t, i) => t.addEventListener('click', e => { e.preventDefault(); const c = chs[i].querySelector('.pv-card'); const y = c.getBoundingClientRect().top + scrollY - innerHeight * .14;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: 'smooth' }); }));
  const uf = pv.querySelector('.ut-film'); if (uf && 'IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting && !calm) { uf.preload = 'auto'; uf.play().catch(() => {}); } else uf.pause(); })).observe(uf);
  pv.querySelectorAll('.pv-card').forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--gx', ((e.clientX - r.left) / r.width).toFixed(3)); }));
})();


/* ===================== v45 products stack: sticky cards push back, film crossfades, one word at a time ===================== */
(() => {
  const pv = document.querySelector('.pv'); if (!pv || !pv.querySelector('.pv-stack')) return;
  const bg = pv.querySelector('.pv-bg'), layers = [...pv.querySelectorAll('.pv-layer')], items = [...pv.querySelectorAll('.pv-item')], tabs = [...pv.querySelectorAll('.pv-tab')];
  const films = layers.map(l => l.querySelector('.pv-film'));
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM;
  const cl = v => v < 0 ? 0 : v > 1 ? 1 : v, ss = v => v * v * (3 - 2 * v);
  let tk = 0, inView = false, st = [];
  const layout = () => { const H = innerHeight; st = items.map(it => { const h = it.firstElementChild.offsetHeight; const t = Math.round(Math.min(Math.max(96, H * .12), H - h - 24)); it.style.setProperty('--st', t + 'px'); return t; }); };
  const run = () => { tk = 0; const H = innerHeight, pr = pv.getBoundingClientRect(); if (pr.bottom < -H * .2 || pr.top > H * 1.2) return;
    bg.style.setProperty('--bgo', Math.min(cl((H * .95 - pr.top) / (H * .8)), cl((pr.bottom - H * .35) / (H * .6))).toFixed(3));
    const tops = items.map(it => it.getBoundingClientRect().top);
    const fade = items.map((it, i) => i === 0 ? 1 : ss(cl((H - tops[i]) / (H - st[i] + 1))));  // 0 when next card enters at bottom, 1 when it sticks
    let act = 0;
    items.forEach((it, i) => { const nx = fade[i + 1] || 0; it.style.setProperty('--pb', calm ? 0 : nx.toFixed(3));
      const l = layers[i]; if (!l) return; l.style.setProperty('--lo', fade[i].toFixed(3)); l.style.setProperty('--rc', nx.toFixed(3));
      const c = it.firstElementChild, cr = c.getBoundingClientRect();
      const cf = calm ? 0 : cl(Math.min((H * .9 - cr.top) / (H * .4), 1)) * (1 - nx); l.style.setProperty('--cf', cf.toFixed(3));
      if (films[i]) films[i].playbackRate = Math.max(.5, 1 - cf * .5);
      l.style.setProperty('--wx', calm ? 0 : (12 - cl((H - tops[i]) / (H * 2.2)) * 30).toFixed(2));
      if (fade[i] > .5) act = i; });
    tabs.forEach((t, i) => t.classList.toggle('on', i === act));
    if (inView && !calm) films.forEach((v, i) => { const show = fade[i] > .01 && (fade[i + 1] || 0) < .999;
      if (show) { if (v.preload === 'none') v.preload = 'auto'; if (v.paused) v.play().catch(() => {}); } else if (!v.paused) v.pause(); }); };
  const q = () => { if (!tk) tk = requestAnimationFrame(run); };
  layout(); addEventListener('resize', () => { layout(); q(); }); addEventListener('load', () => { layout(); q(); });
  addEventListener('scroll', q, { passive: true }); if (window.__lenis) window.__lenis.on('scroll', q);
  new IntersectionObserver(es => es.forEach(en => { inView = en.isIntersecting; if (!inView) films.forEach(v => v.pause()); q(); }), { rootMargin: '10% 0px' }).observe(pv);
  run();
  tabs.forEach((t, i) => t.addEventListener('click', e => { e.preventDefault(); const it = items[i]; const y = it.offsetTop + pv.getBoundingClientRect().top + scrollY - st[i];
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: 'smooth' }); }));
  const uf = pv.querySelector('.ut-film'); if (uf && 'IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting && !calm) { uf.preload = 'auto'; uf.play().catch(() => {}); } else uf.pause(); })).observe(uf);
})();



/* ===================== v49 products: expanding panels (hover or tap opens one; section colour + giant name follow it) ===================== */
(() => {
  const sec = document.querySelector('section.pc'); if (!sec) return;
  const cards = [...sec.querySelectorAll('.pc-card')], films = cards.map(c => c.querySelector('.pc-film')), words = [...sec.querySelectorAll('.pc-giant span')];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches || window.__CALM;
  let act = 0, vis = false, hov = 0;
  const uts = cards.map(c => c.querySelector('.ut-film'));
  const play = () => [films, uts].forEach(list => list.forEach((v, k) => { if (!v) return; if (k === act && vis && !calm) { if (v.preload !== 'auto') v.preload = 'auto'; v.play().catch(() => {}); } else v.pause(); }));
  const apply = i => { act = i; sec.dataset.act = i;
    cards.forEach((c, k) => { const on = k === i; c.classList.toggle('on', on); c.querySelector('.pc-name').setAttribute('aria-expanded', String(on));
      const b = c.querySelector('.pc-body'); if (on) b.removeAttribute('inert'); else b.setAttribute('inert', ''); });
    play(); requestAnimationFrame(fitDemos); if (typeof sizeGiant === 'function') sizeGiant(); };
  const set = i => { if (i !== act) apply(i); };
  const fitDemos = () => cards.forEach(c => { const m = c.querySelector('.pc-media'), d = m && m.querySelector('.pc-demo'); if (!d) return;
    d.style.width = (d.dataset.w || 560) + 'px'; const w = d.offsetWidth, h = d.offsetHeight; if (!w || !h) return;
    const small = innerWidth < 900, k = Math.min(1, m.clientWidth / w, small ? 1 : m.clientHeight / h);
    d.style.setProperty('--ds', k.toFixed(4)); m.style.height = small ? Math.ceil(h * k) + 'px' : ''; });
  const giant = sec.querySelector('.pc-giant');
  const sizeGiant = () => { const w = words[act]; if (giant && w) giant.style.setProperty('--gh', (parseFloat(w.style.fontSize || getComputedStyle(w).fontSize) * .84).toFixed(1) + 'px'); };
  const fit = () => { const W = giant ? giant.clientWidth : innerWidth * .94;                       // each name spans the full content width
    words.forEach(w => { w.style.fontSize = '200px'; const r = w.getBoundingClientRect().width; if (r) w.style.fontSize = (200 * W / r).toFixed(1) + 'px'; }); sizeGiant(); };
  const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches && innerWidth >= 900;
  cards.forEach((c, i) => {
    c.addEventListener('pointerenter', () => { if (!fine()) return; clearTimeout(hov); hov = setTimeout(() => set(i), 90); });
    c.addEventListener('pointerleave', () => clearTimeout(hov));
    c.addEventListener('click', e => { if (!c.classList.contains('on')) { e.preventDefault(); set(i); } });
  });
  sec.querySelector('.pc-row').addEventListener('keydown', e => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (d && e.target.classList.contains('pc-name')) { e.preventDefault(); const n = (act + d + cards.length) % cards.length; set(n); cards[n].querySelector('.pc-name').focus(); } });
  const fromHash = () => { const k = cards.findIndex(c => '#' + c.id === location.hash); if (k >= 0) set(k); };
  addEventListener('hashchange', fromHash);
  if ('IntersectionObserver' in window) new IntersectionObserver(es => es.forEach(en => { vis = en.isIntersecting; play(); }), { rootMargin: '10% 0px' }).observe(sec);
  apply(0); fromHash(); fit(); fitDemos(); addEventListener('resize', () => { fit(); fitDemos(); }); addEventListener('load', fitDemos);
  document.fonts && document.fonts.ready.then(() => { fit(); fitDemos(); });
})();
