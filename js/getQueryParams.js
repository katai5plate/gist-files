const getQueryParams = () =>
  window
    .location
    .search
    .slice(1)
    .split("&")
    .map(v => v.split("="))
    .reduce((r, {0:k, 1:v}) => Object.assign(r, {[k]: v}), {});
