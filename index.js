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
  
  if (pathname !== ""){ //check that the path isn't blank
    let location = await urlstore.get(pathname.toLowerCase()); //get the path and convert to lowercase
    console.log(`Location equals: ${location}`);

    if (location == null){ //if there is no entry for the path, return to default URL location
      await tracker("UNKNOWN");
      return defaultReturn();
    }
    
    await tracker(pathname.toLowerCase());
    return Response.redirect(location, 302); //if path exists in store, redurect the request per the store
  
  } else { //if path is blank return to default URL location
    await tracker("BLANK");
    return defaultReturn();
  }
}

async function tracker(urltrack){
  let urlexists = await urlcounter.get(urltrack);
  console.log(`Does the URL exist: ${urlexists}`);
     
  if (urlexists == null){
    console.log(`Adding ${urltrack} to KV.`);
    urlcounter.put(urltrack, "1");
    return;

  } else {
    console.log(`Incramenting ${urltrack} to KV.`);
    let val1 = parseInt(urlexists.toString())
    val1 = val1 + 1
    await urlcounter.put(urltrack, val1.toString());
    console.log(`New value is ${val1.toString()}`)
    return;
  }
}
