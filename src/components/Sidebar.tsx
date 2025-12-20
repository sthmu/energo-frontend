import React from 'react';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'devices', label: 'Devices', icon: '🔌' },
  { id: 'history', label: 'History', icon: '📅' },
  { id: 'billing', label: 'Billing', icon: '💰' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

const Sidebar: React.FC<SidebarProps> = ({
  sidebarExpanded,
  setSidebarExpanded,
  activeMenu,
  setActiveMenu
}) => {
  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${sidebarExpanded ? 'w-64' : 'w-20'} flex flex-col`}>
      {/* Logo/Brand */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {sidebarExpanded && <h1 className="text-xl font-bold text-blue-600">Energo</h1>}
        <button
          onClick={() => setSidebarExpanded(!sidebarExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {sidebarExpanded ? '◀' : '▶'}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeMenu === item.id
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarExpanded && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {sidebarExpanded && (
          <p className="text-xs text-gray-500 text-center">© 2025 Energo</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;