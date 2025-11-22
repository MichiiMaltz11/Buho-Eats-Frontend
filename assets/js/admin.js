(function(){
  // admin.js - simple dashboard logic
  async function fetchJSON(url, opts={}){
    const token = Auth.getToken();
    const headers = Object.assign({}, opts.headers || {}, token ? { Authorization: 'Bearer ' + token } : {});
    const res = await fetch(url, Object.assign({}, opts, { headers }));
    return res.json();
  }


  //Admin dropdown para menu de administrador
  const btn = document.querySelector('.dropdown-btn');
  const menu = document.querySelector('.dropdown-content');

  btn.addEventListener('click', () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  });

  // Cerrar al hacer clic fuera
  window.addEventListener('click', function(e) {
    if (!btn.contains(e.target)) {
      menu.style.display = "none";
    }
  });

  function renderStats(data){
    const container = document.getElementById('stats');
    container.innerHTML = '';
    const items = [
      { title: 'Usuarios', value: data.totalUsers },
      { title: 'Restaurantes', value: data.totalRestaurants },
      { title: 'Reseñas activas', value: data.totalReviews },
      { title: 'Reportes pendientes', value: data.pendingReports },
      { title: 'Usuarios baneados', value: data.bannedUsers }
    ];

    items.forEach(it => {
      const card = document.createElement('div');
      card.className = 'p-4 border rounded shadow bg-white';
      card.innerHTML = `<div class="text-sm text-gray-500">${it.title}</div><div class="text-2xl font-bold">${it.value}</div>`;
      container.appendChild(card);
    });
  }

  function renderReports(list){
    const container = document.getElementById('reports-list');
    container.innerHTML = '';
    if (!list || list.length === 0){
      container.innerHTML = '<div class="text-muted">No hay reportes pendientes.</div>';
      return;
    }
    list.forEach(r => {
      const el = document.createElement('div');
      el.className = 'card report';
      el.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <div>
            <div style="font-weight:700;">Reporte #${r.report_id} — ${r.restaurant_name}</div>
            <div class="text-muted">Reportado por: ${r.reporter_first} ${r.reporter_last} (${r.reporter_email})</div>
          </div>
          <div class="text-muted">${r.created_at}</div>
        </div>
        <div style="margin-top:6px;"><strong>Motivo:</strong> ${r.reason}</div>
        <div style="margin-top:6px;"><strong>Reseña:</strong> ${r.review_comment || '(sin comentario)'}</div>
        <div class="reports-actions" style="margin-top:8px;">
          <button class="btn btn-success small" data-id="${r.report_id}">Aprobar</button>
          <button class="btn btn-muted small" data-id="${r.report_id}">Eliminar</button>
          <button class="btn btn-danger small" data-id="${r.report_id}" data-userid="${r.review_user_id}">Eliminar + Strike</button>
        </div>
      `;

      container.appendChild(el);
    });

    // Attach handlers
    container.querySelectorAll('.btn-success').forEach(b=> b.addEventListener('click', async (e)=>{
      const id = e.target.dataset.id;
      await fetchJSON(`/api/admin/reports/${id}/approve`, { method: 'POST' });
      loadReports(); loadStats();
    }));

    container.querySelectorAll('.btn-muted').forEach(b=> b.addEventListener('click', async (e)=>{
      const id = e.target.dataset.id;
      await fetchJSON(`/api/admin/reports/${id}/reject-review`, { method: 'POST' });
      loadReports(); loadStats();
    }));

    container.querySelectorAll('.btn-danger').forEach(b=> b.addEventListener('click', async (e)=>{
      const id = e.target.dataset.id; const userId = e.target.dataset.userid;
      await fetchJSON(`/api/admin/reports/${id}/reject-with-strike`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ userId: parseInt(userId,10) }) });
      loadReports(); loadStats();
    }));
  }

  function renderUsers(list){
    const container = document.getElementById('users-list');
    container.innerHTML = '';
    if (!list || list.length === 0){
      container.innerHTML = '<div class="text-muted">No hay usuarios que mostrar.</div>';
      return;
    }
    const table = document.createElement('table');
    table.className = 'users-table';
    table.innerHTML = `<thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Strikes</th><th>Activo</th><th>Acciones</th></tr></thead>`;
    const tb = document.createElement('tbody');
    list.forEach(u=>{
      const tr = document.createElement('tr');
      tr.className = 'border-t';
      tr.innerHTML = `<td>${u.first_name} ${u.last_name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.strikes}</td><td>${u.is_active? 'Sí':'No'}</td><td><button class="btn btn-danger small" data-id="${u.id}">Ban</button></td>`;
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    container.appendChild(table);

    container.querySelectorAll('.btn-danger').forEach(b=> b.addEventListener('click', async (e)=>{
      const id = e.target.dataset.id;
      if (!confirm('¿Confirmas banear al usuario?')) return;
      await fetchJSON(`/api/admin/users/${id}/ban`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ reason: 'Ban manual desde dashboard' }) });
      loadUsers(); loadStats();
    }));
  }
  
  // Restaurants rendering with pagination and search support
  window.restaurants = [];
  let currentPage = 1;
  const itemsPerPage = 6;
  let totalPages = 1;

  function renderRestaurantCards(list, containerId = 'restaurantsGrid'){
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    if (!list || list.length === 0) {
      container.innerHTML = '<div class="text-muted">No hay restaurantes para mostrar.</div>';
      return;
    }

    list.forEach(r=>{
      const card = document.createElement('div');
      card.className = 'card restaurant-card';
      const image = r.image || (r.image_url ? r.image_url : 'https://via.placeholder.com/400x300/3D405B/FFFFFF?text=' + encodeURIComponent(r.name));
      card.innerHTML = `
        <div>
          <img src="${image}" onerror="this.src='https://via.placeholder.com/400x300/3D405B/FFFFFF?text=🍽️'">
          <div class="mt-2">
            <div style="font-weight:700;font-size:16px;">${r.name}</div>
            <div class="text-muted">${r.cuisine_type || r.category || ''} • ${r.price_range || ''}</div>
            <div class="text-muted mt-2">Owner: ${r.owner_name || r.owner || '—'}</div>
          </div>
          <div style="margin-top:10px;display:flex;justify-content:space-between;align-items:center;">
            <div class="text-muted">Reviews: ${r.total_reviews || r.reviews || 0} — Rating: ${Number(r.average_rating || r.rating || 0).toFixed(1)}</div>
            <button class="btn btn-primary small" onclick="window.location.href='restaurant-detail.html?id=${r.id}'">Ver</button>
          </div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  function renderRestaurants(){
    totalPages = Math.max(1, Math.ceil(window.restaurants.length / itemsPerPage));
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const restaurantsToShow = window.restaurants.slice(startIndex, endIndex);
    renderRestaurantCards(restaurantsToShow, 'restaurantsGrid');
    updatePaginationInfo();
    updatePaginationButtons();
  }

  function updatePaginationInfo() {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, window.restaurants.length);
    document.getElementById('showingStart').textContent = window.restaurants.length > 0 ? startIndex : 0;
    document.getElementById('showingEnd').textContent = endIndex;
    document.getElementById('totalRestaurants').textContent = window.restaurants.length;
  }

  function updatePaginationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbers = document.getElementById('pageNumbers');
    if (!prevBtn || !nextBtn || !pageNumbers) return;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
    prevBtn.classList.toggle('disabled', prevBtn.disabled);
    nextBtn.classList.toggle('disabled', nextBtn.disabled);

    pageNumbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      pageBtn.onclick = () => { currentPage = i; renderRestaurants(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
      pageBtn.className = 'page-btn' + (i === currentPage ? ' active' : '');
      pageNumbers.appendChild(pageBtn);
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
      renderRestaurants();
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      currentPage++;
      renderRestaurants();
    }
  }

  // Search helpers (simple in-memory search over window.restaurants)
  function showSearchResults() {
    const dropdown = document.getElementById('searchDropdown');
    if (dropdown) dropdown.classList.remove('hidden');
  }

  function searchRestaurants() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase().trim();
    const searchResults = document.getElementById('searchResults');
    const dropdown = document.getElementById('searchDropdown');
    if (!dropdown || !searchResults) return;
    dropdown.classList.remove('hidden');
    if (!searchTerm) { searchResults.innerHTML = '<p class="text-gray-500 text-center py-4">Escribe para buscar restaurantes</p>'; return; }
    const results = window.restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(searchTerm));
    if (results.length === 0) { searchResults.innerHTML = '<p class="text-gray-500 text-center py-4">No se encontraron restaurantes</p>'; }
    else {
      searchResults.innerHTML = results.slice(0,5).map(restaurant => `
        <div onclick="goToRestaurantFromSearch(${restaurant.id})" class="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition">
          <img src="${restaurant.image || ''}" alt="${restaurant.name}" class="w-16 h-16 object-cover rounded-lg" onerror="this.src='https://via.placeholder.com/64/3D405B/FFFFFF?text=🍽️'">
          <div class="flex-1">
            <h4 class="font-bold text-primary">${restaurant.name}</h4>
            <p class="text-sm text-gray-600">${restaurant.cuisine_type || restaurant.category || ''}</p>
            <div class="flex items-center gap-1 mt-1"><span class="text-yellow-400">⭐</span><span class="text-sm font-semibold">${(restaurant.rating||restaurant.average_rating||0).toFixed(1)}</span><span class="text-sm text-gray-500">(${restaurant.reviews||restaurant.total_reviews||0})</span></div>
          </div>
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </div>
      `).join('');
      if (results.length > 5) {
        searchResults.innerHTML += `<div class="p-3 text-center border-t"><button onclick="searchAllRestaurants('${searchTerm}')" class="text-secondary font-semibold hover:underline">Ver todos los ${results.length} resultados</button></div>`;
      }
    }
  }

  function searchAllRestaurants(searchTerm) {
    const dropdown = document.getElementById('searchDropdown'); if (dropdown) dropdown.classList.add('hidden');
    const filtered = window.restaurants.filter(restaurant => restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filtered.length > 0) {
      currentPage = 1; window.restaurants = filtered; renderRestaurants(); document.getElementById('restaurantsGrid').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function goToRestaurantFromSearch(id) { window.location.href = `restaurant-detail.html?id=${id}`; }

  async function loadStats(){
    const res = await fetchJSON('/api/admin/stats');
    if (res && res.success){ renderStats(res.data); }
  }
  async function loadReports(){
    const res = await fetchJSON('/api/admin/reports?status=pendiente');
    if (res && res.success){ renderReports(res.data.data); }
  }
  async function loadUsers(){
    const res = await fetchJSON('/api/admin/users?limit=10');
    if (res && res.success){ renderUsers(res.data.data); }
  }
  async function loadRestaurants(){
    const res = await fetchJSON('/api/admin/restaurants?limit=1000');
    if (res && res.success){
      // Expecting an array of restaurants in res.data.data or res.data
      const list = (res.data && res.data.data) ? res.data.data : (res.data || res);
      window.restaurants = Array.isArray(list) ? list : [];
      currentPage = 1;
      renderRestaurants();
    }
  }

  async function init(){
    // load header component (existing header.js will fill header-placeholder)
    if (window.Header) Header.init();
    await loadStats();
    await loadReports();
    await loadUsers();
    await loadRestaurants();
  }

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', init);
  
  // Dialog helpers (used by some pages) — use modal.open class
  let dialogCallback = null;
  window.showDialog = function(options){
    const dialog = document.getElementById('customDialog');
    const title = document.getElementById('dialogTitle');
    const message = document.getElementById('dialogMessage');
    const confirmBtn = document.getElementById('dialogConfirmBtn');
    const cancelBtn = document.getElementById('dialogCancelBtn');
    if (!dialog) return;
    title.textContent = options.title || 'Confirmación';
    message.textContent = options.message || '¿Estás seguro?';
    confirmBtn.textContent = options.confirmText || 'Aceptar';
    cancelBtn.textContent = options.cancelText || 'Cancelar';
    dialogCallback = { onConfirm: options.onConfirm || null, onCancel: options.onCancel || null };
    dialog.classList.add('open'); dialog.setAttribute('aria-hidden','false');
  };

  window.closeDialog = function(confirmed){
    const dialog = document.getElementById('customDialog'); if (!dialog) return;
    dialog.classList.remove('open'); dialog.setAttribute('aria-hidden','true');
    if (confirmed && dialogCallback?.onConfirm) dialogCallback.onConfirm();
    if (!confirmed && dialogCallback?.onCancel) dialogCallback.onCancel();
    dialogCallback = null;
  };
})();
