const currentUrl = "localhost:3000";
const currentProtocol = "http://";
const dummyInstancePath = "/instance/dummy";
const allInstancesPath = "/instance/list";

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);
    return error;
  }
}

async function fetchDummyInstances() {
  const url = `${currentProtocol}${currentUrl}${dummyInstancePath}`;
  return await fetchData(url);
}

async function fetchAllInstances() {
  const url = `${currentProtocol}${currentUrl}${allInstancesPath}`;
  return await fetchData(url);
}