
// const registry = new Map();

// function genId() {
//   return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
// }

// /**
//  * Register a component to be rendered for a dynamic route.
//  * @param {React.ComponentType|JSX.Element} Component
//  * @param {Object} props - props to pass to the component
//  * @returns {string} id
//  */
// export function registerDynamicRoute(Component, props = {}) {
//   const id = genId();
//   registry.set(id, { Component, props, createdAt: Date.now() });
//   return id;
// }

// /** Lookup */
// export function getDynamicRoute(id) {
//   return registry.get(id) || null;
// }

// /** Remove mapping (optional) */
// export function unregisterDynamicRoute(id) {
//   return registry.delete(id);
// }

// /** Clear all (optional) */
// export function clearRegistry() {
//   registry.clear();
// }


// dynamicRouteService.js
// Persisted registry (localStorage + in-memory cache)

const MEMORY_REGISTRY = new Map();
const STORAGE_KEY = "dynamic_routes_v1";
const ENTRY_TTL_MS = 1000 * 60 * 60 * 24; // default 24 hours (adjust if needed)

const componentMap = new Map();

function genId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/* --- storage helpers --- */
function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.warn("dynamicRouteService: readStorage failed", e);
    return {};
  }
}
function writeStorage(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn("dynamicRouteService: writeStorage failed", e);
  }
}
function cleanupStorage() {
  const store = readStorage();
  const now = Date.now();
  let changed = false;
  Object.keys(store).forEach((id) => {
    if (!store[id] || now - (store[id].createdAt || 0) > ENTRY_TTL_MS) {
      delete store[id];
      changed = true;
    }
  });
  if (changed) writeStorage(store);
}

/* --- public API --- */

/**
 * Register a React component constructor with a name so it can be restored across reloads.
 * Must be called at app startup for every component you plan to open dynamically.
 * @param {string} name
 * @param {React.ComponentType} Component
 */
export function registerComponent(name, Component) {
    console.log(name,` * Register a React component constructor with a name so it can be restored across reloads.
 * Must be called at app startup for every component you plan to open dynamically.`)
  if (!name || !Component) throw new Error("registerComponent requires name and Component");
  componentMap.set(name, Component);
}

/**
 * Register a dynamic route by name (componentName must be registered).
 * Stores entry in memory and localStorage.
 * @param {string} componentName
 * @param {Object} props - must be JSON-serializable
 * @returns {string} id
 */
export function registerDynamicRouteByName(componentName, props = {}) {
    console.log("componentNamecomponentName",componentName,"props---------",props)
  if (!componentMap.has(`${componentName}`)) {
    throw new Error(`Component "${componentName}" is not registered. Call registerComponent("${componentName}", YourComponent) at app init.`);
  }
  const id = genId();
  const entry = { componentName, props, createdAt: Date.now() };
  MEMORY_REGISTRY.set(id, entry);

  const store = readStorage();
  store[id] = entry;
  writeStorage(store);
  cleanupStorage();

  return id;
}

/**
 * Try to get entry from memory, otherwise try localStorage and hydrate memory.
 * Returns: { Component, props } or null
 */
export function getDynamicRoute(id) {
  if (!id) return null;
  // 1) memory
  const mem = MEMORY_REGISTRY.get(id);
  if (mem) {
    const Comp = componentMap.get(mem.componentName);
    return Comp ? { Component: Comp, props: mem.props } : null;
  }
  // 2) localStorage
  const store = readStorage();
  const stored = store[id];
  if (!stored) return null;

  if (Date.now() - (stored.createdAt || 0) > ENTRY_TTL_MS) {
    // expired: remove and return null
    delete store[id];
    writeStorage(store);
    return null;
  }

  const Comp = componentMap.get(stored.componentName);
  if (!Comp) {
    // component not registered in this runtime
    return null;
  }

  MEMORY_REGISTRY.set(id, stored);
  return { Component: Comp, props: stored.props || {} };
}

/**
 * Remove mapping (memory + storage)
 * @param {string} id
 */
export function unregisterDynamicRoute(id) {
  MEMORY_REGISTRY.delete(id);
  const store = readStorage();
  if (store[id]) {
    delete store[id];
    writeStorage(store);
  }
}

/** Dev helper: clear everything */
export function clearAllDynamicRoutes() {
  MEMORY_REGISTRY.clear();
  writeStorage({});
}
