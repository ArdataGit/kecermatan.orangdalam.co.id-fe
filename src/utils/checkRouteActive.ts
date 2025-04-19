const checkRouteActive = (
  path: string,
  currentPath: string = '',
  id: number = 0
) => {
  if (currentPath === '') {
    currentPath = window.location.pathname;
  }
  if (path === '/') {
    return path === currentPath;
  }

  if (id) {
    return currentPath.includes(`/${id}/`) && currentPath.includes(path);
  } else {
    return currentPath.includes(path);
  }
};

export default checkRouteActive;

// const checkRouteActive = (
//   id: string,
//   path: string,
//   currentPath: string = ''
// ) => {
//   if (currentPath === '') {
//     currentPath = window.location.pathname;
//   }

//   if (path === '/') {
//     // Jika path adalah '/', periksa apakah ID sesuai dengan ID pada URL
//     return path === currentPath && currentPath.includes(`/${id}/`);
//   }

//   // Jika path bukan '/', periksa apakah ID dan path sesuai dengan URL
//   return currentPath.includes(`/${id}/`) && currentPath.includes(path);
// };

// export default checkRouteActive;
