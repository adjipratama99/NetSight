export async function fetchPost(data, usingFormData) {
    const rawResponse = await fetch(data.url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...data.body, usingFormData})
    });
  
    const response = await rawResponse.json();
  
    if (!rawResponse.ok) {
      return { code: rawResponse.status, content: response }
    }
  
    return response
}