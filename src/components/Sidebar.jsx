import React from 'react';
// --- 1. Import new icons for the toggle button ---
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

// --- 2.  Add isSidebarOpen and onToggleSidebar ---
function Sidebar({
  currentPage,
  onNavClick,
  navItems,
  isSidebarOpen,
  onToggleSidebar,
}) {
  return (
    // --- 3. DYNAMIC WIDTH & TRANSITION: Change width based on state ---
    // (We'll add mobile responsive classes like 'max-sm:hidden' in the *next* step)
    <nav
      className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        h-screen bg-sidebar text-sidebar-text flex flex-col p-4 shadow-lg flex-shrink-0 
        transition-all duration-300 ease-in-out
      `}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <svg
            className="h-8 w-8 text-primary-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            />
          </svg>
          {/* --- 4. CONDITIONAL TEXT: Hide "MyFin" when closed --- */}
          {isSidebarOpen && (
            <span className="text-2xl font-bold text-sidebar-text-active">
              MyFin
            </span>
          )}
        </div>

        {/* --- 5. TOGGLE BUTTON: Add the new hamburger button --- */}
        <button
          onClick={onToggleSidebar}
          className="text-sidebar-text-hover p-1 rounded-lg hover:bg-sidebar-hover"
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} // Add title for accessibility
        >
          {isSidebarOpen ? (
            <ChevronsLeft className="h-5 w-5" />
          ) : (
            <ChevronsRight className="h-5 w-5" />
          )}
        </button>
      </div>

      <ul className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => onNavClick(item.id)}
                // --- 6. DYNAMIC STYLING: Center icon when closed ---
                className={`
                              flex items-center gap-3 w-full p-3 rounded-lg transition-colors
                              ${!isSidebarOpen && 'justify-center'}
                              ${
                                isActive
                                  ? 'bg-primary-600 text-sidebar-text-active shadow-md'
                                  : 'hover:bg-sidebar-hover hover:text-sidebar-text-hover'
                              }
                          `}
                // --- 7. DYNAMIC TITLE: Add hover title when closed ---
                title={isSidebarOpen ? '' : item.label}
              >
                <Icon className="h-5 w-5" />
                {/* --- 8. CONDITIONAL TEXT: Hide label when closed --- */}
                {isSidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default Sidebar;
