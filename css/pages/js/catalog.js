async function loadProducts(){
  const res = await fetch('data/products.json?_=' + Date.now());
  return await res.json();
}

function renderFilters(products){
  const wrap = document.getElementById('filters');
  const cats = Array.from(new Set(products.map(p=>p.category)));
  const all = ['Todas', ...cats];
  let active = 'Todas';
  function draw(){
    wrap.innerHTML = '';
    all.forEach(c=>{
      const chip = document.createElement('button');
      chip.className = 'chip' + (c===active?' active':'');
      chip.textContent = c;
      chip.onclick = ()=>{active=c; draw(); renderGrid(products, active)};
      wrap.appendChild(chip);
    });
  }
  draw();
  return ()=>active;
}

function renderGrid(products, active='Todas'){
  const grid = document.getElementById('grid');
  grid.innerHTML='';
  products
    .filter(p=> active==='Todas' || p.category===active)
    .forEach(p=>{
      const card = document.createElement('a');
      card.href = 'product.html?id=' + encodeURIComponent(p.id);
      card.className = 'card';
      const firstColor = p.colors[0];
      const img = (p.images_by_color && p.images_by_color[firstColor]) || (p.images && p.images[0]) || '';
      card.innerHTML = `
        <img src="${img}" alt="${p.name}" style="border-radius:12px;aspect-ratio:1/1;object-fit:cover;background:#0c0c0d;border:1px solid #232326">
        <h3>${p.name}</h3>
        <div class="colors">${p.colors.map(c=>`<span class="swatch" title="${c}" style="background:${p.color_hex?.[c]||'#999'}"></span>`).join('')}</div>
      `;
      grid.appendChild(card);
    });
}

loadProducts().then(products=>{
  const getActive = renderFilters(products);
  renderGrid(products, getActive());
});
