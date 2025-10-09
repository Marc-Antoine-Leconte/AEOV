const currentUrl = "localhost:3000";
const currentProtocol = "http://";
const dummyInstancePath = "/instance/dummy";
const allInstancesPath = "/instance/list";
const newInstancePath = "/instance/new";

async function fetchDataFromAPI(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`FETCH FAIL : Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

async function postDataToAPI(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`POST FAIL : Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

async function fetchDummyInstancesFromAPI() {
  const url = `${currentProtocol}${currentUrl}${dummyInstancePath}`;
  return await fetchDataFromAPI(url);
}

async function fetchAllInstancesFromAPI() {
  const url = `${currentProtocol}${currentUrl}${allInstancesPath}`;
  return await fetchDataFromAPI(url);
}

async function createInstanceFromAPI({name, mode = "pvp"}) {
  const url = `${currentProtocol}${currentUrl}${newInstancePath}`;
  return await postDataToAPI(url, { name, mode });
}
