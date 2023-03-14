console.log("Running!");

async function populateLists() {
  const upcoming = await (await fetch("/upcoming")).json();
  console.log(upcoming);
}

// populateLists();
