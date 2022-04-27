function removeTrailingSlash(str) {
  return str.replace(/\/+$/, '');
}

function defaultReturn(){
  //return new Response("Not Found", {status: 404})
  return Response.redirect("https://www.joshlemon.com.au", 302);
}

addEventListener('fetch', event => {
  event.respondWith(handleRedirect(event.request));
})
async function handleRedirect(request) {
  let pathname = new URL(removeTrailingSlash(request.url)).pathname.replace("/", "");
  
  if (pathname !== ""){
    let location = await urlstore.get(pathname.toLowerCase());
    if (location == null){
      return defaultReturn();
    }
    return Response.redirect(location, 302);
  } else {
    return defaultReturn();
  }
}
