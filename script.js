document.addEventListener('DOMContentLoaded', () => {
    // Sidebar / menu toggle
    const menuIcon = document.getElementById('menuIcon');
    const sidebar = document.getElementById('sidebar');

    if (menuIcon && sidebar) {
        menuIcon.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            menuIcon.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
        });

        // Close sidebar on link click
        document.querySelectorAll('.sidebar a').forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('open');
                menuIcon.textContent = '☰';
            });
        });
    }

    // Card rendering – only if this page has the container
    const container = document.getElementById('clubs-container');
    if (!container) return;

    const loading = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');

    // Select correct data file
    let jsonFile = 'clubs.json'; // fallback
    const path = window.location.pathname.toLowerCase();

    if (path.includes('pre-clubs') || path.includes('morning')) {
        jsonFile = 'before-clubs.json';
    } else if (path.includes('lunch-clubs')) {
        jsonFile = 'lunch-clubs.json';
    } else if (path.includes('after-clubs')) {
        jsonFile = 'after-clubs.json';
    } else if (path.includes('fsport') || path.includes('fall')) {
        jsonFile = 'fall-sports.json';
    } else if (path.includes('wsport') || path.includes('winter')) {
        jsonFile = 'winter-sports.json';
    } else if (path.includes('ssport') || path.includes('spring')) {
        jsonFile = 'spring-sports.json';
    }

    fetch(`./data/${jsonFile}`)
        .then(res => {
            if (!res.ok) throw new Error(`Cannot load ${jsonFile} – status ${res.status}`);
            return res.json();
        })
        .then(data => {
            if (loading) loading.style.display = 'none';

            container.innerHTML = '';

            if (!data || data.length === 0) {
                container.innerHTML = '<p class="text-center lead">No activities currently listed.</p>';
                return;
            }

            data.forEach(item => {
                const col = document.createElement('div');
                col.className = 'col';
                col.innerHTML = `
          <div class="club-card">
            <h3>${item.name || 'Unnamed Activity'}</h3>
            <p><strong>Coach/Teacher:</strong> ${item.coach || item.teacher || 'TBD'}</p>
            <p>${item.description || 'No description available.'}</p>
            <p><strong>Contact:</strong> ${item.contact || 'N/A'}</p>
            <p><strong>Location:</strong> ${item.location || 'TBD'}</p>
          </div>
        `;
                container.appendChild(col);
            });
        })
        .catch(err => {
            console.error(err);
            if (loading) loading.style.display = 'none';
            if (errorEl) errorEl.style.display = 'block';
        });
});