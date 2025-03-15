const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts');

postForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const tags = document.getElementById('tags').value.split(',').map(tag => tag.trim());


    window.api.send('add-post', { title, content, tags });
});

window.api.on('post-added', () => {
    window.api.send('load-posts');
});

window.api.on('load-posts', (event, posts) => {
    postsContainer.innerHTML = posts.map(post => `
    <div class="post">
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <small>${new Date(post.created_at).toLocaleString()}</small>
      <div>Теги: ${post.tags.join(', ')}</div>
    </div>
  `).join('');
});

// Загрузка постов при загрузке страницы
window.api.send('load-posts');