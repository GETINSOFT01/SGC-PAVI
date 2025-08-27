window.shared = {
    checkAuth: () => {
        const user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) {
            if (!window.location.pathname.endsWith('login.html')) {
                window.location.href = 'login.html';
            }
            return null;
        }
        return user;
    },

    loadUserProfile: (user) => {
        const placeholder = document.getElementById('user-profile-placeholder');
        if (!placeholder) return;

        placeholder.innerHTML = `
            <div class="relative">
                <button @click="toggleProfileMenu" class="flex items-center space-x-2">
                    <img src="${user.foto_url || 'https://i.pravatar.cc/150?u=' + user.username}" alt="Avatar" class="w-10 h-10 rounded-full">
                    <span class="font-semibold text-gray-700">${user.nombre}</span>
                    <i class="fas fa-chevron-down text-gray-500"></i>
                </button>
            </div>
        `;
    },

    loadNavMenu: (modules, currentModuleId) => {
        const placeholder = document.getElementById('main-nav-placeholder');
        if (!placeholder) return;

        const menuItems = modules.map(m => `
            <li>
                <a href="${m.id === 'reportes' ? 'reportes.html' : '#'}" 
                   @click="${m.id !== 'reportes' ? `selectModule('${m.id}')` : ''}"
                   class="flex items-center p-3 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 ${currentModuleId === m.id ? 'bg-cyan-500 text-white shadow-lg' : ''}">
                    <i class="${m.icon} w-6 h-6 mr-3"></i>
                    <span class="font-medium">${m.name}</span>
                </a>
            </li>
        `).join('');

        placeholder.innerHTML = `
            <aside class="w-64 bg-white shadow-md flex flex-col h-full">
                <div class="flex items-center justify-center p-4 bg-gray-800 text-white">
                     <img src="https://placehold.co/40x40/1E293B/38BDF8?text=SGC" alt="Logo" class="w-10 h-10 mr-3 rounded-full">
                     <h1 class="text-xl font-bold">SGC Pavi</h1>
                </div>
                <nav class="flex-1 p-4">
                    <ul class="space-y-2">
                        ${menuItems}
                    </ul>
                </nav>
                <div class="p-4 border-t border-gray-200">
                     <button @click="logout" class="w-full flex items-center p-3 text-gray-700 rounded-lg hover:bg-red-100 transition-colors duration-200">
                        <i class="fas fa-sign-out-alt w-6 h-6 mr-3 text-red-500"></i>
                        <span class="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        `;
    }
};
