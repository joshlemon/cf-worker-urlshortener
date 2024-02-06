function removeTrailingSlash(str) {
  return str.replace(/\/+$/, '');
}

function defaultReturn(){
  //return new Response("Not Found", {status: 404})
  return Response.redirect("https://joshlemon.com.au", 301);
}

addEventListener('fetch', event => {
  event.respondWith(handleRedirect(event.request));
})
async function handleRedirect(request) {
  let pathname = new URL(removeTrailingSlash(request.url)).pathname.replace("/", "");
  
  if (pathname !== ""){ //check that the path isn't blank
    let location = await urlstore.get(pathname.toLowerCase()); //get the path and convert to lowercase
    
    if (location == null){ //if there is no entry for the path, return to default URL location
      //await tracker("UNKNOWN"); //removed to reduce KV usage
      return defaultReturn();
    }
    
    console.log(`Sending to Tracker`);
    await tracker(pathname.toLowerCase());
    return Response.redirect(location, 302); //if path exists in store, redurect the request per the store
  
  } else { //if path is blank return to default URL location
    //await tracker("BLANK"); //removed to reduce KV usage
    return defaultReturn();
  }
}

async function tracker(urltrack){
  console.log(`Getting ${urltrack} from Tracker`);
  let urlexists = await urlcounter.get(urltrack);
  console.log(`${urltrack} exists: ${urlexists}`);

  if (urlexists != null){
    let val1 = parseInt(urlexists.toString())
    val1 = val1 + 1
    await urlcounter.put(urltrack, val1.toString());
    return;

  } else {
    await urlcounter.put(urltrack, "1");
    return;    
  }
}
