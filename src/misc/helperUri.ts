import url from "url";

function uriHelper(uriString: string): string[] | string {
  const urlObject = url.parse(uriString);
  const methodsWithURIs = {
    GET: ['/auth/articles/all', '/auth/articles/@me'],
    POST: ['/auth/signup', '/auth/login', '/auth/articles/@me/addblog']
  }
  const pattern = (urlObject.pathname) ? new RegExp(urlObject.pathname.replace(/^\//, ''), 'i') : undefined;
  if(!pattern) {
    throw new Error('Something went wrong! Didn\'t find URL');
  }
  let matchedUris: string[] = [];
  for(let method in methodsWithURIs) {
    methodsWithURIs[method as keyof typeof methodsWithURIs].forEach((uri) => {
      if(pattern.test(uri)) {
        matchedUris.push(uri);
      }
    });
  }
  if(matchedUris.length > 0) {
    return matchedUris;
  }
  return "No matching URIs";
}

export { uriHelper };
