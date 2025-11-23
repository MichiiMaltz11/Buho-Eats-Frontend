(function(){
  // admin.js - simple dashboard logic
  async function fetchJSON(url, opts={}){
    // Asegurarnos de obtener el token (Auth.getToken puede ser async)
    let token = null;
    try {
      if (typeof Auth !== 'undefined' && typeof Auth.getToken === 'function') {
        token = await Auth.getToken();
      }
    } catch (e) {
      console.warn('No se pudo obtener token:', e);
      token = null;
    }

    const headers = Object.assign({}, opts.headers || {});
    if (token) headers.Authorization = 'Bearer ' + token;

    // Normalizar URL de la API: si es relativa a /api, usar CONFIG.API_URL
    let fetchUrl = url;
    try {
      const isAbsolute = /^https?:\/\//i.test(url);
      if (!isAbsolute) {
        const apiBase = (typeof CONFIG !== 'undefined' && CONFIG.API_URL) ? CONFIG.API_URL : 'http://localhost:3000/api';
        if (url.startsWith('/')) {
          if (url.startsWith('/api')) fetchUrl = apiBase + url.substring(4);
          else fetchUrl = apiBase + url;
        } else if (url.startsWith('api')) {
          fetchUrl = apiBase + url.substring(3);
        } else {
          fetchUrl = apiBase + (url.startsWith('/') ? '' : '/') + url;
        }
      }
    } catch (e) {
      fetchUrl = url;
    }

    const res = await fetch(fetchUrl, Object.assign({}, opts, { headers }));

    // Intentar parsear JSON; si no es OK, devolver objeto con error
    let text;
    try {
      text = await res.text();
    } catch (e) {
      text = null;
    }

    if (!res.ok) {
      try {
        const parsed = text ? JSON.parse(text) : { error: res.statusText };
        return Object.assign({ success: false, statusCode: res.status }, parsed);
      } catch (e) {
        return { success: false, statusCode: res.status, error: text || res.statusText };
      }
    }

    try {
      return text ? JSON.parse(text) : {};
    } catch (e) {
      return { success: true, data: text };
    }
  }


  // Admin dropdown para menu de administrador (inicialización defensiva)
  const btn = document.querySelector('.dropdown-btn');
  const menu = document.querySelector('.dropdown-content');

  // Proteger contra elementos no presentes en algunas páginas
  if (btn && menu) {
    try {
      btn.addEventListener('click', () => {
        try {
          menu.style.display = menu.style.display === "block" ? "none" : "block";
        } catch (err) {
          console.warn('Error al alternar el menú admin:', err);
        }
      });

      // Cerrar al hacer clic fuera
      window.addEventListener('click', function(e) {
        try {
          if (!btn.contains(e.target)) {
            menu.style.display = "none";
          }
        } catch (err) {
          // No bloquear si el botón desaparece dinámicamente
        }
      });
    } catch (err) {
      console.warn('Error inicializando handlers del dropdown admin:', err);
    }
  } else {
    // No romper si los elementos no están en la página
    console.debug('admin.js: elementos .dropdown-btn o .dropdown-content no encontrados — omitiendo inicialización del dropdown');
  }

  function renderStats(data){
    const container = document.getElementById('stats');
    if (!container) {
      console.debug('renderStats: #stats element not found, skipping render');
      return;
    }
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
    if (!container) {
      console.debug('renderReports: #reports-list element not found, skipping render');
      return;
    }
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
    if (!container) {
      console.debug('renderUsers: #users-list element not found, skipping render');
      return;
    }
    console.debug('renderUsers called, users count:', Array.isArray(list) ? list.length : typeof list, list && list.slice ? list.slice(0,3) : list);
    container.innerHTML = '';
    if (!list || list.length === 0){
      container.innerHTML = '<div class="text-muted">No hay usuarios que mostrar.</div>';
      return;
    }
    const table = document.createElement('table');
    // Ensure the table uses the full width of its container and stable layout
    table.className = 'users-table w-full';
    table.style.width = '100%';
    // Use fixed layout so columns distribute and actions column stays visible
    table.style.tableLayout = 'fixed';
    table.innerHTML = `<thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Strikes</th><th>Activo</th><th>Acciones</th></tr></thead>`;
    const tb = document.createElement('tbody');
    list.forEach(u=>{
      const tr = document.createElement('tr');
      tr.className = 'border-t';
      // Disable unban button if user is active (not banned)
      const unbanDisabled = u.is_active ? 'disabled' : '';
      const unbanTitle = u.is_active ? 'Usuario no está baneado' : 'Desbanear usuario';
      tr.innerHTML = `<td>${u.first_name} ${u.last_name}</td><td>${u.email}</td><td>${u.role}</td><td>${u.strikes}</td><td>${u.is_active? 'Sí':'No'}</td><td>
        <button class="btn ban-btn btn-danger small" data-id="${u.id}">Ban</button>
        <button class="btn unban-btn btn-success small" data-id="${u.id}" ${unbanDisabled} title="${unbanTitle}">Desban</button>
      </td>`;
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    container.appendChild(table);

    // Ban handlers (scoped to this container)
    container.querySelectorAll('.ban-btn').forEach(b=> b.addEventListener('click', async (e)=>{
      const id = e.currentTarget.dataset.id;
      if (!confirm('¿Confirmas banear al usuario?')) return;
      const res = await fetchJSON(`/api/admin/users/${id}/ban`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ reason: 'Ban manual desde dashboard' }) });
      if (res && res.success) {
        await loadUsers(); await loadStats();
      } else {
        alert('Error al banear: ' + (res && (res.error || res.message) ? (res.error || res.message) : JSON.stringify(res)));
      }
    }));

    // Unban handlers
    container.querySelectorAll('.unban-btn').forEach(b=> b.addEventListener('click', async (e)=>{
      const id = e.currentTarget.dataset.id;
      // If button is disabled, ignore
      if (e.currentTarget.disabled) return;
      if (!confirm('¿Confirmas reactivar este usuario?')) return;
      const res = await fetchJSON(`/api/admin/users/${id}/unban`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ resetStrikes: true }) });
      if (res && res.success) {
        await loadUsers(); await loadStats();
        alert('Usuario reactivado.');
      } else {
        alert('Error al reactivar: ' + (res && (res.error || res.message) ? (res.error || res.message) : JSON.stringify(res)));
      }
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
    // Determinar si el usuario es admin: usar Auth.hasRole si está disponible, si no, comprobar localStorage directamente
    let isAdmin = false;
    try {
      if (typeof Auth !== 'undefined' && typeof Auth.hasRole === 'function') {
        isAdmin = Auth.hasRole('admin');
      }
    } catch (e) {
      isAdmin = false;
    }
    if (!isAdmin) {
      try {
        const raw = localStorage.getItem((typeof CONFIG !== 'undefined' && CONFIG.STORAGE_KEYS && CONFIG.STORAGE_KEYS.USER) ? CONFIG.STORAGE_KEYS.USER : 'user_data');
        if (raw) {
          const userObj = JSON.parse(raw);
          if (userObj && userObj.role && userObj.role === 'admin') isAdmin = true;
        }
      } catch (e) {
        // ignore
      }
    }

    list.forEach(r=>{
      const card = document.createElement('div');
      card.className = 'card restaurant-card';
      let image = r.image || (r.image_url ? r.image_url : 'https://via.placeholder.com/400x300/3D405B/FFFFFF?text=' + encodeURIComponent(r.name));
      // Normalizar imágenes: si la URL no es absoluta, usar CONFIG.SERVER_URL
      try {
        const isAbsolute = /^https?:\/\//i.test(image);
        if (!isAbsolute) {
          const serverBase = (typeof CONFIG !== 'undefined' && CONFIG.SERVER_URL) ? CONFIG.SERVER_URL : 'http://localhost:3000';
          // Asegurar que image no tenga una doble barra
          if (image.startsWith('/')) image = serverBase + image;
          else image = serverBase + '/' + image;
        }
      } catch (e) {
        // En caso de cualquier error, conservar el valor original
      }
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
            <div style="display:flex;gap:6px;align-items:center;">
              <button class="btn btn-primary small" onclick="window.location.href='restaurant-detail.html?id=${r.id}'">Ver</button>
              ${ isAdmin ? `<button class="btn btn-outline small edit-restaurant-btn" data-id="${r.id}">Editar</button><button class="btn btn-danger small delete-restaurant-btn" data-id="${r.id}">Eliminar</button>` : '' }
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Attach admin handlers for edit/delete if user is admin
    try {
      if (isAdmin) {
        // Delete
        container.querySelectorAll('.delete-restaurant-btn').forEach(b => b.addEventListener('click', async (e) => {
          const id = e.currentTarget.dataset.id;
          if (!confirm('¿Confirmas eliminar este restaurante? Esta acción es reversible (soft-delete).')) return;
          const res = await fetchJSON(`/api/restaurants/${id}`, { method: 'DELETE' });
          if (res && res.success) {
            alert('Restaurante eliminado.');
            await loadRestaurants();
            await loadStats();
          } else {
            alert('Error al eliminar: ' + (res && (res.error || res.message) ? (res.error || res.message) : JSON.stringify(res)));
          }
        }));

        // Edit (simple inline prompt for quick edits)
        container.querySelectorAll('.edit-restaurant-btn').forEach(b => b.addEventListener('click', async (e) => {
          const id = e.currentTarget.dataset.id;
          const newName = prompt('Nuevo nombre para el restaurante:');
          if (!newName) return;
          const payload = { name: newName };
          const res = await fetchJSON(`/api/restaurants/${id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload) });
          if (res && res.success) {
            alert('Restaurante actualizado.');
            await loadRestaurants();
          } else {
            alert('Error al actualizar: ' + (res && (res.error || res.message) ? (res.error || res.message) : JSON.stringify(res)));
          }
        }));
      }
    } catch (err) {
      console.warn('No se pudieron enlazar handlers admin para restaurantes:', err);
    }
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

  /**
   * Load reported reviews (excluding those with pending reports).
   * Tries several admin endpoints for compatibility and filters out reports with status 'pendiente'.
   */
  async function loadReportedReviews(){
    const container = document.getElementById('reportedReviewsList');
    if (!container) return;
    container.innerHTML = '<div class="p-6 bg-white rounded shadow">Cargando reseñas reportadas...</div>';

    // We'll fetch processed reports (aprobado/rechazado) and also pending ones to exclude reviews
    try {
      const [approvedRes, rejectedRes, pendingRes] = await Promise.all([
        fetchJSON('/api/admin/reports?status=aprobado'),
        fetchJSON('/api/admin/reports?status=rechazado'),
        fetchJSON('/api/admin/reports?status=pendiente')
      ]);

      // Collect arrays from responses
      const collect = (r) => {
        if (!r) return [];
        if (Array.isArray(r)) return r;
        if (r.data && Array.isArray(r.data)) return r.data;
        if (r.data && r.data.data && Array.isArray(r.data.data)) return r.data.data;
        return [];
      };

      const approved = collect(approvedRes);
      const rejected = collect(rejectedRes);
      const pending = collect(pendingRes);

      // Build a set of review_ids that have pending reports so we can exclude them
      const pendingReviewIds = new Set(pending.map(p => p.review_id));

      // Combine approved and rejected reports
      const processed = [...approved, ...rejected].filter(r => r && !pendingReviewIds.has(r.review_id));

      if (!processed || processed.length === 0) {
        container.innerHTML = '<div class="p-6 bg-white rounded shadow">No hay reseñas reportadas (excluyendo pendientes).</div>';
        return;
      }

      // Group by review_id
      const byReview = {};
      processed.forEach(rep => {
        const reviewId = rep.review_id;
        if (!reviewId) return;
        if (!byReview[reviewId]) byReview[reviewId] = { id: reviewId, review_comment: rep.review_comment, review_user_id: rep.review_user_id, restaurant_name: rep.restaurant_name, reports: [] };
        byReview[reviewId].reports.push({ report_id: rep.report_id, status: rep.status, reason: rep.reason, reporter_first: rep.reporter_first, reporter_last: rep.reporter_last, reporter_email: rep.reporter_email, created_at: rep.created_at });
      });

      const aggregated = Object.values(byReview).map(item => {
        return Object.assign({}, item, { _reports: item.reports, _reportCount: item.reports.length });
      });

      renderReportedReviews(aggregated);
    } catch (e) {
      console.warn('loadReportedReviews error', e);
      container.innerHTML = '<div class="p-6 bg-yellow-50 border rounded">No se pudieron obtener las reseñas reportadas.</div>';
    }
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
    // If we are on the reported-reviews page, only load reported reviews
    try {
      const path = (location.pathname || '').split('/').pop() || '';
      if (path === 'dashboard-admin-reported-reviews.html' || location.hash.includes('reported-reviews')) {
        await loadReportedReviews();
        return;
      }
    } catch (e) {
      // ignore
    }

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

  // Utility to show only one admin panel (stats, reports, users, restaurants)
  function showOnlyPanel(name) {
    try {
      const panels = {
        stats: document.getElementById('stats'),
        reports: document.getElementById('reports-list'),
        users: document.getElementById('users-list'),
        restaurants: document.getElementById('restaurantsGrid')
      };

      // Hide everything first
      Object.values(panels).forEach(p => { if (p) p.style.display = 'none'; });
      const carousel = document.getElementById('carousel-container'); if (carousel) carousel.style.display = 'none';

      // Show requested panel
      const panel = panels[name];
      if (panel) panel.style.display = '';

      // If showing stats, ensure stats are loaded
      if (name === 'stats') loadStats();
      if (name === 'reports') loadReports();
      if (name === 'users') loadUsers();

      // Scroll into view
      const toView = panel || document.getElementById('admin-panels');
      if (toView) toView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      console.warn('showOnlyPanel error', e);
    }
  }

  // Show all panels (but keep carousel hidden as requested)
  function showAllPanels() {
    try {
      const panelsContainer = document.getElementById('admin-panels');
      const panels = {
        stats: document.getElementById('stats'),
        reports: document.getElementById('reports-list'),
        users: document.getElementById('users-list'),
        restaurants: document.getElementById('restaurantsGrid')
      };
      // Show all panels
      Object.values(panels).forEach(p => { if (p) p.style.display = ''; });
      // Keep carousel hidden per request
      const carousel = document.getElementById('carousel-container'); if (carousel) carousel.style.display = 'none';

      // Refresh data
      loadStats(); loadReports(); loadUsers(); loadRestaurants();

      // Hide the showAllBtn
      const showAllBtn = document.getElementById('showAllBtn'); if (showAllBtn) showAllBtn.classList.add('hidden');

      // Update URL (remove hash)
      history.replaceState(null, '', location.pathname + location.search);

      // Scroll to top of admin panels
      if (panelsContainer) panelsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      console.warn('showAllPanels error', e);
    }
  }

  // Intercept clicks on admin links in the header to show only the target panel
  document.addEventListener('click', function(e){
    try {
      const a = e.target.closest && e.target.closest('.admin-only');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href.includes('#')) return; // let normal links behave
      const frag = href.split('#')[1];
      if (!frag) return;
      // Map fragments to panel keys
      const map = {
        'stats': 'stats',
        'reports': 'reports',
        'reported-reviews': 'reports',
        'users': 'users',
        'restaurants': 'restaurants'
      };
      const panelKey = map[frag] || null;
      if (panelKey) {
        e.preventDefault();
        showOnlyPanel(panelKey);
        // Show the "Mostrar todo" button
        const showAllBtn = document.getElementById('showAllBtn'); if (showAllBtn) showAllBtn.classList.remove('hidden');
        // Update location hash without jumping
        history.replaceState(null, '', '#'+frag);
      }
    } catch (err) {
      // ignore
    }
  });

  // Wire up the showAllBtn click
  document.addEventListener('DOMContentLoaded', function(){
    const showAllBtn = document.getElementById('showAllBtn');
    if (showAllBtn) showAllBtn.addEventListener('click', function(){ showAllPanels(); });
  });

  // Expose reported reviews loader and renderer for pages that want to call it directly
  try { window.loadReportedReviews = loadReportedReviews; } catch(e) { /* ignore */ }

  // Render function for reported reviews
  function renderReportedReviews(list){
    const container = document.getElementById('reportedReviewsList');
    if (!container) {
      console.debug('renderReportedReviews: #reportedReviewsList element not found');
      return;
    }
    container.innerHTML = '';
    if (!list || list.length === 0) {
      container.innerHTML = '<div class="p-6 bg-white rounded shadow">No hay reseñas reportadas para mostrar (o todas las reportadas están pendientes).</div>';
      return;
    }

    list.forEach(r => {
      const el = document.createElement('div');
      el.className = 'card p-4 bg-white rounded shadow';
      const reviewer = r.user_name || (r.user && (r.user.first_name + ' ' + r.user.last_name)) || r.review_user || '—';
      const restaurant = r.restaurant_name || (r.restaurant && r.restaurant.name) || r.restaurant || '—';
      const created = r.created_at || r.date || r.review_date || '';
      const comment = r.comment || r.review_comment || r.body || '';
      const statusSummary = (r._reports && r._reports.length > 0) ? r._reports.map(rep => rep.status || rep.estado || '—').join(', ') : 'Sin reportes';

      el.innerHTML = `
        <div class="flex justify-between items-start">
          <div>
            <div class="font-bold text-primary">Reseña #${r.id || r.review_id || ''} — ${restaurant}</div>
            <div class="text-sm text-gray-600">Por: ${reviewer} — ${created}</div>
          </div>
          <div class="text-sm text-gray-500">Reportes: ${r._reportCount || 0}</div>
        </div>
        <div class="mt-3 text-gray-700">${comment || '<em>(sin comentario)</em>'}</div>
        <div class="mt-3 text-sm text-gray-600">Estado(s) de reportes: ${statusSummary}</div>
      `;

      container.appendChild(el);
    });
  }
})();
