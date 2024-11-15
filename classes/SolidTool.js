class SolidTool {
  constructor(options) {  
    this.name = options.name;
    this.params = options.params
    this.resource = options.resources
  }


  async create_or_update(query) {
    let headers = query.params.headers
    // let result = 'Inconnu'

    let config = {
      baseURL: query.params.baseURL.trim(),
      url: query.params.url.trim(),
      method: query.params.method.trim(),
      headers: headers,
      responseType: 'json',
      data: (query.resource && query.resource.content.trim()) || null
    }
    console.log(config)
    try {
      const response = await axios(config)
      console.log(response)
      return response
      //console.log(response)
      // result = {
      //   state: 'ok',
      //   query: query,
      //   message: response,
      //   location: response.headers.location,
      //   notification: response.headers.link
      // }
    } catch (error) {
      console.log(error)
      return error
    }

    // console.log('create_or_update', query, Object.assign({}, result))
    // return Object.assign({}, result)
  }
  async get(url) {
    url = new URL(url)
    console.log(url)
    let query = {
      params: {
        baseURL: url.origin,
        method: 'GET',
        url: url.pathname,
        headers: {}
      }
    }
    if (url.pathname.endsWith('/')) {
      query.params.headers.Accept = 'application/ld+json'
    }
    return await this.create_or_update(query)
  }

  async remove(url) {
    url = new URL(url)
    console.log(url)
    let query = {
      params: {
        baseURL: url.origin,
        method: 'DELETE',
        url: url.pathname,
        headers: {}
      }
    }
    let result = await this.create_or_update(query)

    return result
  }


   // PUT
   example_PUT_text() {
    this.params.method = "PUT";
    this.params.url = "myfile.txt";
    this.params.headers["Content-Type"] = "text/plain";
    this.resource.content = "bidule";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_PUT_turtle() {
    this.params.method = "PUT";
    this.params.url = "myfile.ttl";
    this.params.headers["Content-Type"] = "text/turtle";
    this.resource.content = "<ex:s> <ex:p> <ex:o>.";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_PUT_json() {
    this.params.method = "PUT";
    this.params.url = "myfile.json";
    this.params.headers["Content-Type"] = "application/json";
    this.resource.content = JSON.stringify({ nimp: "swing", swop: "tchiboo" }, null, 2);

    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_PUT_jsonld() {
    this.params.method = "PUT";
    this.params.url = "myfile.jsonld";
    this.params.headers["Content-Type"] = "application/ld+json";
    this.resource.content = JSON.stringify(
      {
        "@context": "https://json-ld.org/contexts/person.jsonld",
        "@id": "http://dbpedia.org/resource/John_Lennon",
        name: "John Lennon",
        born: "1940-10-09",
        spouse: "http://dbpedia.org/resource/Cynthia_Lennon",
      },
      null,
      2
    );
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  //POST
  example_POST_text() {
    this.params.method = "POST";
    this.params.url = "/";
    this.params.headers["Content-Type"] = "text/plain";
    this.resource.content = "bidule";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_POST_turtle() {
    this.params.method = "POST";
    this.params.url = "/";
    this.params.headers["Content-Type"] = "text/turtle";
    this.resource.content = "<ex:s> <ex:p> <ex:o>.";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_POST_json() {
    this.params.method = "POST";
    this.params.url = "/";
    this.params.headers["Content-Type"] = "application/json";
    this.resource.content = JSON.stringify({ nimp: "swing", swop: "tchiboo" }, null, 2);
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_POST_jsonld() {
    this.params.method = "POST";
    this.params.url = "/";
    this.params.headers["Content-Type"] = "application/ld+json";
    this.resource.content = JSON.stringify(
      {
        "@context": "https://json-ld.org/contexts/person.jsonld",
        "@id": "http://dbpedia.org/resource/John_Lennon",
        name: "John Lennon",
        born: "1940-10-09",
        spouse: "http://dbpedia.org/resource/Cynthia_Lennon",
      },
      null,
      2
    );
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  // GET
  example_GET() {
    this.resource.content = "";
    this.params.method = "GET";
    this.params.url = "myfile.txt";
    this.params.headers["Accept"] = "*";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_GET_text() {
    this.resource.content = "";
    this.params.method = "GET";
    this.params.url = "myfile.txt";
    this.params.headers["Accept"] = "text/plain";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_GET_turtle() {
    this.resource.content = "";
    this.params.method = "GET";
    this.params.url = "myfile.ttl";
    this.params.headers["Accept"] = "text/turtle";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_GET_json() {
    this.resource.content = "";
    this.params.method = "GET";
    this.params.url = "myfile.json";
    this.params.headers["Accept"] = "application/json";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_GET_jsonld() {
    this.resource.content = "";
    this.params.method = "GET";
    this.params.url = "myfile.jsonld";
    this.params.headers["Accept"] = "application/ld+json";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  // GET CONTAINER
  async example_GET_container_jsonld() {
    this.resource.content = "";
    this.params.method = "GET";
    this.params.url = "/";
    this.params.headers["Accept"] = "application/ld+json";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
    await this.$store.dispatch("core/create_or_update", {
      params: this.params,
      resource: this.resource,
    });
  }
  async example_GET_container_turtle() {
    this.resource.content = "";
    this.params.method = "GET";
    this.params.url = "/";
    this.params.headers["Accept"] = "text/turtle";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
    await this.$store.dispatch("core/create_or_update", {
      params: this.params,
      resource: this.resource,
    });
  }
  //PATCH
  example_patch_n3() {
    this.resource.content = `@prefix solid: <http://www.w3.org/ns/solid/terms#>. 
    _:rename a solid:InsertDeletePatch;
     solid:inserts { <ex:s2> <ex:p2> <ex:o2>. }.`;
    this.params.method = "PATCH";
    this.params.url = "myfile.ttl";
    this.params.headers["Content-Type"] = "text/n3";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_patch_sparql() {
    this.resource.content = "INSERT DATA { <ex:s2> <ex:p2> <ex:o2> }";
    this.params.method = "PATCH";
    this.params.url = "myfile.ttl";
    this.params.headers["Content-Type"] = "application/sparql-update";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_head() {
    this.params.method = "HEAD";
    this.params.url = "myfile.txt";
    // this.params.headers["Accept"] = "text/plain";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_options() {
    this.params.method = "OPTIONS";
    this.params.url = "myfile.txt";
    // this.params.headers["Accept"] = "text/plain";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }
  example_create_container() {
    //https://communitysolidserver.github.io/CommunitySolidServer/latest/usage/metadata/#example-of-a-workflow-for-editing-a-description-resource
    this.params.url = "foo/";
    this.params.method = "PUT";
    this.$store.commit("core/setParams", this.params);
    this.$store.commit("core/setResource", this.resource);
  }

}