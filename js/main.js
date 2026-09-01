/* =========================================================
   STACKLY ARTISAN — Core application logic (shared)
   ========================================================= */
window.STACKLY = window.STACKLY || {};

(function(){
  'use strict';

  /* ---------- Small helpers ---------- */
  const $  = (s,c)=> (c||document).querySelector(s);
  const $$ = (s,c)=> Array.from((c||document).querySelectorAll(s));
  const money = (v)=> '₹' + Number(v||0).toLocaleString('en-IN');

  function starsHTML(rating){
    let out=''; const r=Math.round(rating);
    for(let i=1;i<=5;i++) out += i<=r ? '<i>★</i>' : '<i class="off">★</i>';
    return out;
  }

  /* ---------- Toast notifications ---------- */
  const toastBox = (()=>{
    let el = $('#toast-container');
    if(!el){ el=document.createElement('div'); el.id='toast-container'; el.className='toast-container'; document.body.appendChild(el); }
    return el;
  })();
  function toast(message, type){
    type = type || 'success';
    const t = document.createElement('div');
    t.className = 'toast ' + type;
    const ic = type==='success'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5 10-11"/></svg>'
      : type==='error'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 8v4M12 16h.01"/></svg>';
    t.innerHTML = '<span class="toast-ic">'+ic+'</span><span>'+message+'</span>';
    toastBox.appendChild(t);
    requestAnimationFrame(()=> t.classList.add('show'));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=> t.remove(), 400); }, 3200);
  }

  /* ---------- Icon (SVG sprites for reuse) ---------- */
  const ICONS = {
    heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z"/></svg>',
    cart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2.5 3.5h2.6l2.4 11.6a1.8 1.8 0 001.8 1.4h8.4a1.8 1.8 0 001.8-1.4L21 8.5H6"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 12.5l5 5 10-11"/></svg>',
    trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6.5h17M9 6.5V4.8a1 1 0 011-1h4a1 1 0 011 1v1.7M6.5 6.5l1 13a1.5 1.5 0 001.5 1.3h6a1.5 1.5 0 001.5-1.3l1-13M10 11v5M14 11v5"/></svg>'
  };

  /* ---------- Cart (localStorage) ---------- */
  let cart = load('sa_cart') || [];
  const savedWish = load('sa_wish');
  /* Wishlist starts empty; products become red only after the user clicks. */
  const wishlistVersion = load('sa_wish_v2');
  let wish;
  if(wishlistVersion === null){
    wish = [];
    save('sa_wish', wish);
    save('sa_wish_v2', true);
  } else {
    wish = Array.isArray(savedWish) ? savedWish : [];
  }

  function load(k){ try { return JSON.parse(localStorage.getItem(k)); } catch(e){ return null; } }
  function save(k,v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }

  function cartCount(){ return cart.reduce((s,i)=> s + i.qty, 0); }
  function cartTotal(){ return cart.reduce((s,i)=>{ const p = STACKLY.data.getProduct(i.id); return s + (p? p.price:i.price)*i.qty; }, 0); }

  function addToCart(id, qty, opts){
    qty = qty || 1;
    const p = STACKLY.data.getProduct(id);
    if(!p) return;
    const existing = cart.find(i=> i.id===id);
    if(existing) existing.qty += qty; else cart.push({id:id, qty:qty, price:p.price});
    save('sa_cart', cart);
    updateCartUI();
    if(!opts || !opts.silent){ toast('Added to cart — “'+p.title+'”'); }
  }
  function removeFromCart(id){
    cart = cart.filter(i=> i.id!==id); save('sa_cart', cart); updateCartUI();
    toast('Removed from cart','');
  }
  function setQty(id, qty){
    const i = cart.find(x=> x.id===id); if(!i) return;
    i.qty = Math.max(1, qty); save('sa_cart', cart); updateCartUI();
    if(hasCartTable()) renderCartTable();
  }
  function hasCartTable(){ return !!$('.cart-items'); }

  /* ---------- Wishlist ---------- */
  function inWish(id){ return wish.includes(id); }
  function toggleWish(id){
    const p = STACKLY.data.getProduct(id); if(!p) return;
    if(inWish(id)){ wish = wish.filter(x=> x!==id); toast('Removed from wishlist',''); }
    else { wish.push(id); toast('Added to wishlist — “'+p.title+'”'); }
    save('sa_wish', wish); updateWishUI(); renderWishButtons();
  }

  /* ---------- Update header badges ---------- */
  function updateCartUI(){
    $$('[data-cart-count]').forEach(el=>{
      el.textContent = cartCount();
      el.style.display = cartCount() ? 'flex' : 'none';
    });
  }
  function updateWishUI(){
    $$('[data-wish-count]').forEach(el=>{
      el.textContent = wish.length;
      el.style.display = wish.length ? 'flex' : 'none';
    });
  }
  function renderWishButtons(){
    $$('.wish-btn[data-id]').forEach(btn=>{
      const id = btn.getAttribute('data-id');
      btn.classList.toggle('active', inWish(id));
    });
  }

  /* ---------- Cart page rendering ---------- */
  function renderCartTable(){
    const wrap = $('.cart-items'); if(!wrap) return;
    if(!cart.length){
      wrap.innerHTML = '';
      $('#cart-empty').style.display = 'block';
      $('.cart-summary').style.display = 'none';
      return;
    }
    $('#cart-empty').style.display = 'none';
    $('.cart-summary').style.display = 'block';
    wrap.innerHTML = cart.map(i=>{
      const p = STACKLY.data.getProduct(i.id);
      if(!p) return '';
      const a = STACKLY.data.getArtisan(p.artisan);
      return `
      <div class="cart-item" data-id="${p.id}">
        <a href="product.html?id=${p.id}"><img src="${p.img}" alt="${p.title}"></a>
        <div class="ci-info">
          <a href="product.html?id=${p.id}" class="ci-title">${p.title}</a>
          <div class="ci-art">by <a href="artisan-profile.html?id=${a.id}">${a.name}</a></div>
          <div class="ci-price">${money(p.price)}</div>
        </div>
        <div class="ci-controls">
          <div class="qty-selector">
            <button type="button" data-dec>−</button>
            <input type="number" value="${i.qty}" min="1" readonly>
            <button type="button" data-inc>+</button>
          </div>
          <div class="ci-buttons">
            <button type="button" class="wishit js-wish-toggle" data-id="${p.id}" title="Move to wishlist">${ICONS.heart}</button>
            <button type="button" class="remove js-remove" data-id="${p.id}" title="Remove">${ICONS.trash||ICONS.cart}</button>
          </div>
        </div>
      </div>`;
    }).join('');
    updateCartSummary();
    bindCartEvents();
  }
  function updateCartSummary(){
    const wrap = $('#cs-total'); if(!wrap) return;
    const sub = cartTotal();
    const shipping = sub > 3000 || !sub ? 0 : 120;
    let discount = 0;
    const promo = (load('sa_promo')||'').toLowerCase();
    if(promo==='handmade10' && sub){ discount = Math.round(sub*0.1); }
    $('#cs-subtotal').textContent = money(sub);
    $('#cs-ship').textContent = shipping ? money(shipping) : 'FREE';
    const discEl = $('#cs-discount');
    if(discount){ discEl.textContent = '− '+money(discount); discEl.closest('.cs-row').style.display='flex'; }
    else { discEl.closest('.cs-row').style.display = discount? 'flex':'none'; }
    $('#cs-total').textContent = money(sub + shipping - discount);
  }
  function bindCartEvents(){
    $$('.js-wish-toggle').forEach(btn=> btn.addEventListener('click', e=>{
      e.preventDefault();
      const id = btn.dataset.id;
      if(inWish(id)) toggleWish(id);
      else { toggleWish(id); removeFromCart(id); }
    }));
    $$('.js-remove').forEach(btn=> btn.addEventListener('click', ()=>{
      removeFromCart(btn.dataset.id); renderCartTable();
    }));
    $$('.cart-item .qty-selector').forEach(qs=>{
      const item = qs.closest('.cart-item');
      const id = item.dataset.id;
      const inp = qs.querySelector('input');
      const inc = (d)=>{ let v = parseInt(inp.value||1)+d; v=Math.max(1,v); inp.value=v; setQty(id,v); };
      qs.querySelector('[data-inc]').addEventListener('click', ()=> inc(1));
      qs.querySelector('[data-dec]').addEventListener('click', ()=> inc(-1));
    });
  }

  /* ---------- Mobile nav ---------- */
  function initNav(){
    const toggle = $('#nav-toggle'), panel = $('#mobile-nav'), close = $('#mn-close');
    if(toggle && panel){
      toggle.addEventListener('click', ()=> panel.classList.add('open'));
      close && close.addEventListener('click', ()=> panel.classList.remove('open'));
      $$('#mobile-nav a').forEach(a=> a.addEventListener('click', ()=> panel.classList.remove('open')));
    }
    const davToggle = $('#dash-toggle'), dSide = $('#dash-sidebar'), dOverlay = $('#dash-overlay');
    if(davToggle && dSide){
      const closeButton=document.createElement('button');
      closeButton.type='button'; closeButton.className='dash-close'; closeButton.setAttribute('aria-label','Close menu'); closeButton.innerHTML='×';
      dSide.insertBefore(closeButton,dSide.firstChild);
      const closeSide=()=>{ dSide.classList.remove('open'); dOverlay && dOverlay.classList.remove('show'); };
      davToggle.addEventListener('click', ()=>{ dSide.classList.add('open'); dOverlay && dOverlay.classList.add('show'); });
      closeButton.addEventListener('click',closeSide);
      dOverlay && dOverlay.addEventListener('click',closeSide);
    }
  }

  /* ---------- Header scrolled state ---------- */
  function initHeader(){
    const h = $('.site-header');
    if(!h) return;
    const onScroll = ()=> h.classList.toggle('scrolled', window.scrollY > 8);
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* ---------- Active navigation state ---------- */
  function initActiveNav(){
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const navPage = ({'product.html':'shop.html','search.html':'shop.html','checkout.html':'shop.html','artisan-profile.html':'artisans.html'})[page] || page;
    $$('.main-nav a, .mobile-nav .mn-link').forEach(a=>{
      const target = (a.getAttribute('href') || '').split('#')[0].split('?')[0].split('/').pop().toLowerCase();
      a.classList.toggle('active', target === navPage);
    });
  }

  /* ---------- Sync account identity across dashboard sidebars ---------- */
  function initAccountUser(){
    let user=null;
    try{ user=JSON.parse(localStorage.getItem('sa_user')); }catch(e){}
    if(!user || !user.email) return;
    const fallbackName=user.email.split('@')[0].replace(/[._-]+/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
    $$('.dash-user').forEach(side=>{
      const name=side.querySelector('b');
      const spans=$$('span',side).filter(s=>!s.classList.contains('ds-role'));
      if(name) name.textContent=user.name || fallbackName;
      if(spans[0]) spans[0].textContent=user.email;
      let role=side.querySelector('.ds-role');
      if(!role){ role=document.createElement('span'); role.className='ds-role'; side.querySelector('div')?.appendChild(role); }
      role.textContent=(user.role || 'customer').toLowerCase()==='artisan' ? 'Artisan' : 'Customer';
      side.querySelector('img')?.setAttribute('alt',user.name || fallbackName);
    });
  }

  /* ---------- Custom dropdowns ---------- */
  function initCustomDropdowns(){
    const closeAll = ()=> $$('.custom-select.open').forEach(w=>{
      w.classList.remove('open');
      const menu = w.querySelector('.custom-select-menu');
      if(menu) menu.style.cssText='';
    });
    $$('select').forEach(select=>{
      if(select.dataset.customized) return;
      select.dataset.customized='true';
      const wrap=document.createElement('div'); wrap.className='custom-select';
      const trigger=document.createElement('button'); trigger.type='button'; trigger.className='custom-select-trigger';
      const menu=document.createElement('div'); menu.className='custom-select-menu'; menu.setAttribute('role','listbox');
      const sync=()=>{
        const option=select.options[select.selectedIndex];
        trigger.innerHTML='<span></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>';
        trigger.querySelector('span').textContent=option ? option.textContent : '';
        $$('.custom-select-option',menu).forEach(o=>o.classList.toggle('selected',o.dataset.value===select.value));
      };
      Array.from(select.options).forEach(option=>{
        const item=document.createElement('button'); item.type='button'; item.className='custom-select-option'; item.dataset.value=option.value; item.textContent=option.textContent;
        item.addEventListener('click',()=>{ select.value=option.value; select.dispatchEvent(new Event('change',{bubbles:true})); sync(); closeAll(); });
        menu.appendChild(item);
      });
      trigger.addEventListener('click',e=>{
        e.stopPropagation();
        const wasOpen=wrap.classList.contains('open'); closeAll(); if(wasOpen) return;
        const rect=trigger.getBoundingClientRect(); const viewportPadding=8; const roomBelow=innerHeight-rect.bottom-viewportPadding; const roomAbove=rect.top-viewportPadding;
        const openUp=roomBelow<190 && roomAbove>roomBelow; const height=Math.max(96,Math.min(280,openUp?roomAbove:roomBelow));
        const left=Math.max(viewportPadding,Math.min(rect.left,innerWidth-rect.width-viewportPadding));
        const top=openUp?Math.max(viewportPadding,rect.top-height-6):Math.min(rect.bottom+6,innerHeight-height-viewportPadding);
        menu.style.width=Math.min(rect.width,innerWidth-(viewportPadding*2))+'px'; menu.style.left=left+'px'; menu.style.top=top+'px'; menu.style.maxHeight=height+'px'; wrap.classList.add('open');
      });
      select.classList.add('custom-select-native'); select.parentNode.insertBefore(wrap,select.nextSibling); wrap.append(trigger,menu); sync();
    });
    document.addEventListener('pointerdown',e=>{
      if(!e.target.closest('.custom-select')) closeAll();
    },true);
    document.addEventListener('click',closeAll);
    document.addEventListener('keydown',e=>{if(e.key==='Escape') closeAll();});
    window.addEventListener('resize',closeAll,{passive:true});
  }

  /* ---------- Placeholder links ---------- */
  function initPlaceholderLinks(){
    $$('.site-footer .social a').forEach(a=> a.href='notfound.html');
    $$('a[href="#"][aria-label]').forEach(a=> a.href='notfound.html');
    $$('.auth-row a').forEach(a=> a.href='notfound.html');
    $$('.auth-side .social-btn').forEach(btn=> btn.addEventListener('click', ()=> location.href='notfound.html'));
  }

  /* ---------- Logout confirmation ---------- */
  function initLogoutConfirm(){
    $$('.dash-nav a.logout').forEach(link=> link.addEventListener('click',e=>{
      e.preventDefault();
      const modal=document.createElement('div'); modal.className='confirm-backdrop';
      modal.innerHTML='<div class="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title"><button type="button" class="confirm-close" aria-label="Close">×</button><h3 id="logout-title">Log out?</h3><p>Are you sure you want to log out of your account?</p><div class="confirm-actions"><button type="button" class="btn btn-ghost confirm-cancel">Cancel</button><button type="button" class="btn btn-primary confirm-ok">Confirm</button></div></div>';
      document.body.appendChild(modal); requestAnimationFrame(()=>modal.classList.add('open'));
      const close=()=>{modal.classList.remove('open');setTimeout(()=>modal.remove(),220)};
      modal.querySelector('.confirm-cancel').addEventListener('click',close);
      modal.querySelector('.confirm-close').addEventListener('click',close);
      modal.addEventListener('click',e=>{if(e.target===modal) close();});
      modal.querySelector('.confirm-ok').addEventListener('click',()=>{location.href=link.href;});
    }));
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal(){
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .section');
    if(!('IntersectionObserver' in window)){
      els.forEach(e=> e.classList.add('in')); return;
    }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
    }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    els.forEach(e=> io.observe(e));
  }

  /* ---------- Quick view modal ---------- */
  function openQuickView(id){
    const p = STACKLY.data.getProduct(id); if(!p) return;
    const a = STACKLY.data.getArtisan(p.artisan);
    const modal = $('#quickview');
    modal.querySelector('.qv-media img').src = p.img;
    modal.querySelector('.qv-media img').alt = p.title;
    const body = modal.querySelector('.qv-body');
    body.querySelector('.qv-cat').textContent = STACKLY.data.getCategory(p.category).name;
    body.querySelector('.product-title').textContent = p.title;
    body.querySelector('.qv-rating .stars').innerHTML = starsHTML(p.rating);
    body.querySelector('.qv-rating .rating-count').textContent = '('+p.reviews+' reviews)';
    body.querySelector('.qv-price .now').textContent = money(p.price);
    body.querySelector('.qv-was').textContent = p.was ? money(p.was) : '';
    body.querySelector('.qv-meta .qv-artisan').textContent = a.name;
    body.querySelector('.product-desc').textContent = p.short;
    const addBtn = body.querySelector('.qv-add');
    addBtn.dataset.id = p.id;
    const viewBtn = body.querySelector('.qv-view');
    viewBtn.href = 'product.html?id='+p.id;
    const wishBtn = body.querySelector('.qv-wish');
    wishBtn.dataset.id = p.id;
    wishBtn.classList.toggle('active', inWish(p.id));
    modal.closest('.modal-backdrop').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(el){
    el.closest('.modal-backdrop').classList.remove('open');
    document.body.style.overflow = '';
  }

  function initQuickView(){
    if(!$('#quickview')) return;
    const backdrop = $('#quickview').closest('.modal-backdrop');
    $$('[data-quickview]').forEach(btn=> btn.addEventListener('click', ()=> openQuickView(btn.dataset.quickview)));
    $$('.modal-close').forEach(b=> b.addEventListener('click', ()=> closeModal(b)));
    backdrop.addEventListener('click', e=>{ if(e.target===backdrop) closeModal(backdrop); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape' && backdrop.classList.contains('open')) closeModal(backdrop); });
    // qv actions
    const qvAdd = $('#quickview').querySelector('.qv-add');
    if(qvAdd) qvAdd.addEventListener('click', (e)=>{
      const btn = e.currentTarget; addToCart(btn.dataset.id, parseInt(btn.dataset.qty||1)); closeModal(btn);
    });
    const qvWish = $('#quickview').querySelector('.qv-wish');
    if(qvWish) qvWish.addEventListener('click', (e)=>{
      const b = e.currentTarget; toggleWish(b.dataset.id); b.classList.toggle('active', inWish(b.dataset.id));
    });
    $('#quickview').querySelectorAll('.qv-qty [data-inc]').forEach(()=>{});
    const qy = $('#quickview').querySelector('.qty-selector');
    if(qy){
      const inp = qy.querySelector('input'); const btn = $('#quickview').querySelector('.qv-add');
      qy.querySelector('[data-inc]').addEventListener('click', ()=>{ inp.value = parseInt(inp.value)+1; btn.dataset.qty=inp.value; });
      qy.querySelector('[data-dec]').addEventListener('click', ()=>{ inp.value = Math.max(1, parseInt(inp.value)-1); btn.dataset.qty=inp.value; });
    }
  }

  /* ---------- Add to cart buttons global ---------- */
  function initAddButtons(){
    const onAdd = btn=>{
      const product = STACKLY.data.getProduct(btn.dataset.id);
      if(product) toast('Added successfully — “'+product.title+'”');
      const label = btn.innerHTML;
      btn.classList.add('added');
      btn.innerHTML = ICONS.check + ' Added';
      setTimeout(()=>{ btn.classList.remove('added'); btn.innerHTML = label; }, 1500);
    };
    document.addEventListener('click', e=>{
      const btn = e.target.closest && e.target.closest('.add-btn[data-id]');
      if(btn){
        onAdd(btn);
      }
    });
  }
  function initWishlistButtons(){
    $$('.wish-btn[data-id]').forEach(btn=>{
      if(btn.dataset.wishBound === 'true') return;
      btn.dataset.wishBound = 'true';
      btn.addEventListener('click', (e)=>{
        e.preventDefault(); e.stopPropagation();
        const selected = !btn.classList.contains('active');
        btn.classList.toggle('active', selected);
        toggleWish(btn.dataset.id);
        btn.classList.toggle('active', inWish(btn.dataset.id));
      });
    });
  }

  /* ---------- Search overlay / global search ---------- */
  function initSearch(){
    const trigger = $('.search-trigger');
    const overlay = $('.search-overlay');
    if(trigger && overlay){
      trigger.addEventListener('click', ()=>{ overlay.classList.add('open'); document.body.style.overflow='hidden'; setTimeout(()=> $('.search-overlay input').focus(), 120); });
      const close = ()=> { overlay.classList.remove('open'); document.body.style.overflow=''; };
      $('#search-close').addEventListener('click', close);
      overlay.addEventListener('click', e=>{ if(e.target===overlay) close(); });
      document.addEventListener('keydown', e=>{ if(e.key==='Escape' && overlay.classList.contains('open')) close(); });
    }
  }

  /* ---------- Render product card (shared) ---------- */
  function productCardHTML(p, addClass){
    const a = STACKLY.data.getArtisan(p.artisan);
    const c = STACKLY.data.getCategory(p.category);
    const off = p.was ? Math.round((1 - p.price/p.was)*100) : 0;
    const wished = inWish(p.id);
    const onPage = (new URLSearchParams(location.search).get('page')) ? '' : '';
    return `
    <div class="product-card ${addClass||''}">
      <div class="product-media">
        <div class="pd-link-img">
          <img src="${p.img}" alt="${p.title}" loading="lazy">
        </div>
        ${off? `<span class="product-discount">-${off}%</span>`:''}
        <a class="quick-view" href="product.html?id=${p.id}">Quick View</a>
      </div>
      <div class="product-body">
        <span class="product-cat">${c.name}</span>
        <a href="product.html?id=${p.id}" class="product-title">${p.title}</a>
        <div class="product-artisan">by <a href="artisan-profile.html?id=${a.id}">${a.name}</a></div>
        <div class="product-rating"><span class="stars">${starsHTML(p.rating)}</span><span class="rating-count">(${p.reviews})</span></div>
        <div class="product-foot">
          <div class="price"><span class="now">${money(p.price)}</span>${p.was? `<span class="was">${money(p.was)}</span>`:''}</div>
          <button type="button" class="add-btn" data-id="${p.id}" onclick="alert('Added successfully')">${ICONS.cart}<span>Add</span></button>
        </div>
      </div>
    </div>`;
  }

  /* ---------- Init everything ---------- */
  document.addEventListener('DOMContentLoaded', ()=>{
    const loadBar = $('.page-load-bar');
    if(loadBar){
      loadBar.classList.add('loaded');
      setTimeout(()=> loadBar.remove(), 450);
    }
    initNav(); initHeader(); initActiveNav(); initAccountUser(); initPlaceholderLinks(); initLogoutConfirm(); initCustomDropdowns(); initReveal(); initQuickView(); initAddButtons();
    initWishlistButtons(); initSearch(); updateCartUI(); updateWishUI(); renderWishButtons();
    if(hasCartTable()) renderCartTable();
    document.body.classList.add('page-enter');
  });

  /* expose */
  window.STACKLY.core = { money, starsHTML, toast, addToCart, removeFromCart, setQty, toggleWish, inWish, cartCount, cartTotal, cart, wish, productCardHTML, openQuickView, ICONS };
  window.$  = $;
  window.$$ = $$;
})();
