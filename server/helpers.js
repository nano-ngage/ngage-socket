module.exports = {
  fetchOptions: function(method, data) {
    return {
      method: method,
      headers: { "Content-Type": "application/json" },
      mode: 'cors',
      body: JSON.stringify(data)
    };
  }
}
