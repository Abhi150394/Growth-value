/**
 * Role-based sidebar filtering utility
 * Maps backend roles to frontend access buckets and filters sidebar items
 */

// Map backend roles to access buckets
const ROLE_ACCESS_MAP = Object.freeze({
  superadmin: "superadmin", // now its own bucket → full access
  admin: "admin",
  business_leader: "business_leader",
  regional_manager: "regional_manager",
  manager: "manager",
  vendor: "vendor",
  user: "user",
});

/**
 * Role-based access configuration for sidebar items
 * Each menu item can specify which roles can access it
 */
const SIDEBAR_ROLE_CONFIG = {
  // Sales section - available to admin, manager, vendor, user
  sales: ["admin", "manager", "business_leader", "vendor", "user"],

  // Operations section - available to admin, manager
  operations: ["admin", "manager", "regional_manager"],

  // Labour section - available to admin, manager
  labour_cost: ["admin"],

  // Inventory section - available to admin, manager, vendor
  inventory: ["admin"],

  // Planning section - available to admin, manager
  planning: ["user"],

  // Budgeting Review - available to admin, manager
  3959: ["admin"],

  // Finance - available to admin, manager
  3996: ["admin"],

  // Quick Social - available to all
  5983: ["admin", "vendor"],

  // Ops. Manager - available to admin, manager
  6187: ["admin"],

  // Forecast - available to admin, manager
  6332: ["admin"],

  // Labor Dash - available to admin, manager
  6666: ["admin"],

  // Advanced section - only for admin (superadmin handled globally)
  advanced: ["admin", "vendor"],

  // Advanced submenu items - normalized keys
  "advanced.scraping": ["admin"],
  "advanced.user-management": ["admin"],
  "advanced.usermanagement": ["admin"], // alternative format
  "advanced.dashboard": ["admin", "manager", "vendor", "user"],
  "advanced.searchcompare": ["admin", "manager"],
  "advanced.summary": ["admin", "manager"],
  "advanced.subscription": ["admin", "manager"],
  "advanced.helpsupport": ["admin", "manager"],
  "advanced.faqs": ["admin", "manager", "vendor", "user"],
  "advanced.demo": ["admin", "manager", "vendor", "user"],
  "advanced.wishlist": ["admin", "manager", "vendor", "user"],
};

/**
 * Normalizes role to access bucket
 * @param {string} role - User role from backend
 * @returns {string|null} - Access bucket or null if invalid
 */
export const normalizeRole = (role) => {
  if (!role) return null;
  const normalized = String(role).toLowerCase();
  return ROLE_ACCESS_MAP[normalized] || null;
};

/**
 * Normalizes submenu name to match config keys
 * @param {string} subMenuName - Submenu name
 * @returns {string} - Normalized key
 */
const normalizeSubMenuKey = (subMenuName) => {
  if (!subMenuName) return "";
  return String(subMenuName)
    .toLowerCase()
    .replace(/\s+/g, "-") // spaces → dash
    .replace(/&/g, "") // remove &
    .replace(/[^a-z0-9-]/g, ""); // keep only a-z, 0-9, -
};

/**
 * Checks if a role has access to a menu item
 * @param {string} userRole - User's role
 * @param {string|number} menuId - Menu item ID
 * @param {string} subMenuName - Optional submenu name for advanced filtering
 * @returns {boolean} - Whether user has access
 */
export const hasMenuAccess = (userRole, menuId, subMenuName = null) => {
  const accessBucket = normalizeRole(userRole);
  if (!accessBucket) return false;

  // superadmin sees everything
  if (accessBucket === "superadmin") return true;

  // Advanced submenu specific rules
  if (subMenuName && menuId === "advanced") {
    const normalizedSubKey = normalizeSubMenuKey(subMenuName);
    const subMenuKey = `advanced.${normalizedSubKey}`;

    if (SIDEBAR_ROLE_CONFIG[subMenuKey]) {
      return SIDEBAR_ROLE_CONFIG[subMenuKey].includes(accessBucket);
    }

    // try without dashes as alternative
    const altKey = `advanced.${normalizedSubKey.replace(/-/g, "")}`;
    if (SIDEBAR_ROLE_CONFIG[altKey]) {
      return SIDEBAR_ROLE_CONFIG[altKey].includes(accessBucket);
    }
  }

  // Top-level menu access
  const allowedRoles = SIDEBAR_ROLE_CONFIG[menuId];

  // If menu not configured explicitly: default to admin-only
  if (!allowedRoles) {
    return accessBucket === "admin";
  }

  return allowedRoles.includes(accessBucket);
};

/**
 * Filters sidebar data based on user role
 * @param {Array} sidebarData - Original sidebar data array
 * @param {string} userRole - User's role from backend
 * @returns {Array} - Filtered sidebar data
 */
export const filterSidebarByRole = (sidebarData, userRole) => {
  if (!Array.isArray(sidebarData)) return [];
  if (!userRole) return sidebarData; // if role not loaded yet, show all

  const accessBucket = normalizeRole(userRole);
  if (!accessBucket) return [];

  return sidebarData
    .map((menu) => {
      // Check access for the main menu item
      if (!hasMenuAccess(userRole, menu.id)) {
        return null;
      }

      // If it has submenu, filter based on submenu-level access
      if (menu.subMenu && Array.isArray(menu.subMenu)) {
        const filteredSubMenu = menu.subMenu.filter((sub) => {
          const subMenuName = sub.menuName;
          return hasMenuAccess(userRole, menu.id, subMenuName);
        });

        // If no submenus left, drop the whole menu section
        if (filteredSubMenu.length === 0) {
          return null;
        }

        return {
          ...menu,
          subMenu: filteredSubMenu,
        };
      }

      // No submenu, but allowed → keep as is
      return menu;
    })
    .filter(Boolean);
};

export default filterSidebarByRole;
