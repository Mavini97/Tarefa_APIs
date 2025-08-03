const post = {
      userId: 3,
        title: 'Titulo',
        body: 'Corpo'
}

fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify (post),
      
})
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(err => console.log(err)) 