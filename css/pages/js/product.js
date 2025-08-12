function qs(n){return new URLSearchParams(location.search).get(n)}
async function loadProducts(){
  const res = await fetch('data/products.json?_=' + Date.now());
  return await res.json();
}

function renderProduct(p){
  const root = document.getElementById('product');
  const firstColor = p.colors[0];
  const img = (p.images_by_color && p.images_by_color[firstColor]) || (p.images && p.images[0]) || '';
  root.innerHTML = `
    <div class="image"><img id="pimg" src="${img}" alt="${p.name}" style="max-height:520px;object-fit:contain"></div>
    <div>
      <div class="row"><span class="btn">${p.category}</span><span class="btn">${p.code}</span></div>
      <h1 class="title">${p.name}</h1>
      <p class="muted">${p.description}</p>
      <table class="table">
        <tr><td><strong>Material</strong></td><td>${p.material}</td></tr>
        <tr><td><strong>Tamanho</strong></td><td>${p.size}</td></tr>
      </table>
      <div style="margin:14px 0 6px">Cores disponíveis</div>
      <div id="colors" class="colors"></div>
      <div class="row" style="margin-top:16px">
        <a class="btn primary" target="_blank"
           href="https://wa.me/5532XXXXXXXX?text=${encodeURIComponent('Quero este produto: '+p.name+' ('+p.code+')')}">
           Pedir pelo WhatsApp
        </a>
        <a class="btn" href="catalog.html">Voltar ao Catálogo</a>
      </div>
    </div>
  `;
  const wrap = document.getElementById('colors');
  p.colors.forEach(c=>{
    const sw = document.createElement('button');
    sw.className = 'swatch' + (c===firstColor?' active':'');
    sw.title=c;
    sw.style.background = (p.color_hex && p.color_hex[c]) || '#999';
    sw.onclick = ()=>{
      document.querySelectorAll('.swatch').forEach(s=>s.classList.remove('active'));
      sw.classList.add('active');
      const url = (p.images_by_color && p.images_by_color[c]) || (p.images && p.images[0]) || '';
      document.getElementById('pimg').src = url;
    };
    wrap.appendChild(sw);
  });
}

const id = qs('id');
loadProducts().then(list=>{
  const p = list.find(x=>String(x.id)===String(id));
  if(!p){ document.getElementById('product').innerHTML = '<p>Produto não encontrado.</p>'; return; }
  renderProduct(p);
});
