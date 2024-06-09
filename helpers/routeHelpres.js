function isActiveRoute(route, currentRoute) {
  return route === currentRoute ? "active" : ""
}

export default isActiveRoute