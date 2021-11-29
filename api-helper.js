export class ApiHelper {
  constructor() {
    this.baseUrl = "https://jsonplaceholder.typicode.com";
  }

  async fetchFromPortal(url, method, body) {
    const respose = await fetch(this.baseUrl + url, {
        ...(method && ({method})),
        ...(body && ({'Content-type': 'application/json; charset=UTF-8'})),
        ...(body && ({body: JSON.stringify(body)}))
    });
    return respose.json();
  }
}
