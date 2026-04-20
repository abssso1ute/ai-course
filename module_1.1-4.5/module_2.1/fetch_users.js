async function fetchUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) {
      throw new Error("Ошибка при получении данных");
    }

    const data = await response.json();

    return data.map(user => user.name);

  } catch (error) {
    console.error("Ошибка:", error);
    return [];
  }
}

fetchUsers().then(names => console.log(names));