let currentPage = 1;
let currentQuery = '';
let isLoading = false;
let totalPages = null;

document.addEventListener('DOMContentLoaded', () => {
  $('#formSearch').on('submit', async (e) => {
    e.preventDefault();
    $("#searchInput").blur();

    if (e.key === "Enter") {
      e.preventDefault();
      $(this).blur()
    }

    currentQuery = $('#searchInput').val().trim();
    if (!currentQuery) return alert('Digite o nome de um filme');

    currentPage = 1;
    totalPages = null;
    $('#listMovies').empty();
    await carregarFilmes();
  });

  window.addEventListener('scroll', async () => {
    window.scrollY > 60 ? [
      $(".search-container").addClass('active'),
      $(".search-title").removeClass('text-black').addClass('text-white')
    ] : [
      $(".search-container").removeClass('active'),
      $(".search-title").removeClass('text-white').addClass('text-black')

    ]
    if (isLoading || !currentQuery) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
      if (totalPages && currentPage > totalPages) return;
      await carregarFilmes();
    }
  });
});

async function carregarFilmes() {
  isLoading = true;
  $('#loading').show();

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: {
        api_key: '1a9847701b3189a90811732014ae8a9c',
        responseType: 'blob',
        query: currentQuery,
        page: currentPage,
        language: 'pt-BR',
      },
    });

    const filmes = response.data.results;
    totalPages = response.data.total_pages;

    if (filmes.length > 0) {
      filmes.forEach((filme) => {
        const imagem = filme.poster_path
          ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
          : null;

        $('#listMovies').append(`
          <div class="col-6 col-md-3 mb-4 d-flex">
            <div class="card flex-fill">
              ${imagem
            ? `<img src="${imagem}" class="card-img-top" alt="${wordLimits(filme.title, 20)}">`
            : `<div class="bg-secondary text-white d-flex align-items-center justify-content-center" style="height: 300px;">Sem imagem</div>`
          }
              <div class="card-body">
                <h5 class="card-title">${filme.title}</h5>
                <p class="card-text">${wordLimits(filme.overview, 40) || 'Sem descrição.'}</p>
              </div>
            </div>
          </div>
        `);
      });
    } else {
      $('#listMovies').append(`<span class="d-flex flex-column align-items-center justify-content-center z-2">Não foi encontrado nenhum filme pelo nome:&nbsp<b> ${currentQuery}</b></span>`)
    }



    currentPage++;
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
  } finally {
    isLoading = false;
    $('#loading').hide();
  }
}

function wordLimits(texto, limite) {
  textoTemp = texto.trim().split("");
  return textoTemp.length > limite ? textoTemp.slice(0, limite).join("") + "..." : texto
}