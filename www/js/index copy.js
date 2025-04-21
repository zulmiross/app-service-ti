document.addEventListener('deviceready', onDeviceReady, false);

let isLoading = false;
let getFilmes = [];
//Uso com fetch
// async function carregarImagemSegura(url) {
//     try {
//         const response = await fetch(url);
//         const blob = await response.blob();
//         return URL.createObjectURL(blob);
//     } catch (error) {
//         console.error("Erro ao carregar imagem:", error);
//         return null;
//     }
// }

//uso com axios
async function carregarImagemBlob(url) {
    try {
        const response = await axios.get(url, {
            responseType: 'blob',
        });

        return URL.createObjectURL(response.data);
    } catch (error) {
        console.error("Erro ao carregar imagem com blob:", error);
        return null;
    }
}



document.addEventListener('DOMContentLoaded', () => {
    $("#formSearch").on('submit', async (e) => {
        e.preventDefault();
        $("#searchInput").blur();
        // if (e.key === "Enter") {
        //     e.preventDefault(); // evita o envio do form, se não quiser isso
        //     $(this).blur(); // tira o foco do input → fecha o teclado
        //   }

        if ($("#searchInput").val().trim() === "") {
            return alert("Favor digitar o nome do filme")
        }

        $("#listMovies").empty();

        const cardsHTML = [];
        const imagePromises = [];


        const filmes = await buscarFilmes($("#searchInput").val().trim())

        filmes.map(async (filme) => {
            const url = await carregarImagemBlob(`https://image.tmdb.org/t/p/w300${filme.poster_path}`);

            // if (url) {
            //     $("#listMovies").append(`
            //     <div class="card m-2" style="width: 18rem;">
            //         <img src="${url}" class="card-img-top" alt="${filme.title}">
            //         <div class="card-body">
            //             <h5 class="card-title">${filme.title}</h5>
            //             <p class="card-text">${filme.overview}</p>
            //         </div>
            //     </div>
            // `);
            // }

            if(url){
                $("#listMovies").append(`
                    <div class="col-6 col-md-3 mb-4 d-flex">
                      <div class="card flex-fill">
                        <img src="https://image.tmdb.org/t/p/w500${filme.poster_path}" class="card-img-top" alt="${filme.title}">
                        <div class="card-body">
                          <h5 class="card-title">${filme.title}</h5>
                          <p class="card-text">${filme.overview}</p>
                        </div>
                      </div>
                    </div>
                  `);
            }
        })





        // const filmes = await buscarFilmes($("#searchInput").val().trim());

        // if (filmes.length > 0) {
        //     filmes.map((filme) => {

        //         $("#listMovies").append(`
        //            <div class="card" style="width: 18rem;">
        //            ${!filme.poster_path && filme.poster_path === ""
        //                 ? '<span class="badge bg-danger badge-primary">Imagem não disponível</span>' 
        //                 : `<img src="https://image.tmdb.org/t/p/w200${filme.poster_path}" class="card-img-top img-fluid" alt="...">`
        //             }                
        //             <div class="card-body">
        //                 <h5 class="card-title">${filme.title}</h5>
        //                 <p class="card-text">${filme.overview}</p>
        //             </div>
        //             </div>
        //         `)
        //     })
        // } else {
        //     $("#listMovies").append(`
        //         <div class="position-absolute w-100 h-100 d-flex align-items-center justify-content-center">
        //             <div style="width:80px; height:80px" class="spinner-border text-primary border-5" role="status">
        //                 <span class="visually-hidden">Aguarde...</span>
        //             </div>
        //         </div>
        //     `);
        // }








    })
})

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}

const buscarFilmes = async (valor) => {

    isLoading = true;

    try {
        const response = await axios.get("https://api.themoviedb.org/3/search/movie", {
            params: {
                api_key: '1a9847701b3189a90811732014ae8a9c',
                query: valor
            }
        });

        return response.data.results;

    } catch (error) {
        console.error("Erro ao buscar Filmes:", error)
    } finally {
        isLoading = false;
        $("#searchInput").val('')
    }
}
