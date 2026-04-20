const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

async function handleResponse(response) {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export async function fetchPosts() {
  const response = await fetch(BASE_URL);
  return handleResponse(response);
}

export async function fetchPostById(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(response);
}

export async function createPost(postData) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(postData)
  });

  return handleResponse(response);
}

export async function updatePost(id, updateData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateData)
  });

  return handleResponse(response);
}