// import React, { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   getDynamicRoute,
//   unregisterDynamicRoute,
// } from "../../Utils/dynamicRouteService";

// const DynamicRouteHost = () => {
//   const { dynId } = useParams();
//   const navigate = useNavigate();

//   const entry = getDynamicRoute(dynId);

//   useEffect(() => {
//     // If mapping is missing, go back or show fallback after short delay.
//     if (!entry) {
//       // You can choose to navigate back:
//       const timer = setTimeout(() => navigate("/", { replace: true }), 1200);
//       return () => clearTimeout(timer);
//     }
//     // optional cleanup when unmounting route: remove mapping to free memory
//     return () => {
//       // uncomment if you want the mapping removed when leaving
//       // unregisterDynamicRoute(dynId);
//     };
//   }, [entry, dynId, navigate]);

//   if (!entry) {
//     return (
//       <div style={{ padding: 24 }}>
//         <h3>Page not available</h3>
//         <p>
//           This dynamic page is not available (it may have expired).
//           Redirecting...
//         </p>
//       </div>
//     );
//   }

//   const { Component, props } = entry;

//   // Component may be a React component type or a JSX element
//   if (React.isValidElement(Component)) {
//     // JSX element: clone to attach close / routing props if needed
//     return React.cloneElement(Component, { ...props });
//   }

//   // Component is a component type — render it
//   const Comp = Component;
//   return (
//     <div
//       style={{
//         padding: "10px",
//       }}
//     >
//       <Comp {...props} />
//     </div>
//   );
// };

// export default DynamicRouteHost;


// DynamicRouteHost.jsx
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDynamicRoute, unregisterDynamicRoute } from "../../Utils/dynamicRouteService";

const DynamicRouteHost = ({ autoCleanup = false, fallbackDelayMs = 1200 }) => {
  const { dynId } = useParams();
  const navigate = useNavigate();

  const entry = getDynamicRoute(dynId);

  useEffect(() => {
    if (!entry) {
      const t = setTimeout(() => navigate("/", { replace: true }), fallbackDelayMs);
      return () => clearTimeout(t);
    }
    // optional cleanup on unmount
    return () => {
      if (autoCleanup) {
        try {
          unregisterDynamicRoute(dynId);
        } catch (e) { /* ignore */ }
      }
    };
  }, [entry, dynId, navigate, autoCleanup, fallbackDelayMs]);

  if (!entry) {
    return (
      <div style={{ padding: 24 }}>
        <h3>Page not available</h3>
        <p>This dynamic page is not available (it may have expired). Redirecting...</p>
      </div>
    );
  }

  const { Component, props } = entry;
  return <Component {...props} />;
};

export default DynamicRouteHost;
