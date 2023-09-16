import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";

import 'notiflix/dist/notiflix-3.2.6.min.css';
import "simplelightbox/dist/simple-lightbox.min.css";


const BASE_URL = "https://pixabay.com/api/"
const formSearch = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
let page = 1;
let totalPages = 0;
let lastQuery = null;

// const lightbox = new SimpleLightbox('.gallery',
//     {
//         captionsData: 'alt',
//         captionDelay: 250, 
//     }
// );


async function fetchImage(textSearch, page) {
    try {
        const response = await axios.get(BASE_URL, {
            params : {
                key: "39464156-6c3d114a5269f1cf634bfe107",
                q: textSearch,
                safesearch: true,
                page,
                per_page: 40,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: true,
            },
        });
        
        totalPages = Math.ceil(response.data.totalHits / 40);

        if (response.data.totalHits === 0) {
            Notify.failure(`Sorry, there are no images matching your search query. Please try again.`, {
            position: 'right-top',
            });
        } else if (page === 1) {
            Notify.success(`Hooray! We found ${response.data.totalHits} images.`, {
            position: 'right-top',
            });
        }
        console.log(response.data.hits);
        return response.data.hits;
   
    } catch (error) {
        console.log(error);
    }
    
};

    

//fetchImage("flower").then((data)=>renderList(data, galleryContainer));

const renderGallery = (arr, container) => {
    console.log(arr);
    const markup = arr
        .map(
            (item) =>
                `
                <div class="photo-card gallery__item">
                <a class="gallery__link" href="${item.largeImageURL}">
                    <img class="gallery__image"
                        src="${item.webformatURL}" 
                        alt="${item.tags}" 
                        loading="lazy" />
                
                    <div class="info">
                        <p class="info-item">
                            <b>Likes</b>
                        ${item.likes}</p>
                        <p class="info-item">
                            <b>Views</b>
                        ${item.views}</p>
                        <p class="info-item">
                            <b>Comments</b>
                        ${item.comments}</p>
                        <p class="info-item">
                            <b>Downloads</b>
                        ${item.downloads}</p>
                    </div>
                    </a>
                </div>
            `)
        .join('');
    
    container.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();

    if (page <= totalPages & totalPages != 1) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
    }
};


const searchImage = async function (searchQuery) {
  const query = searchQuery;

  if (query === lastQuery) {
    return;
  } else {
    galleryContainer.innerHTML = '';
  }

  lastQuery = query;
  page = 1;

  const imageData = await fetchImage(query, page);
  renderGallery(imageData,galleryContainer);
};

const loadMoreHandler = async () => {
    page += 1;
    const imageData = await fetchImage(lastQuery, page);
    renderGallery(imageData, galleryContainer);

    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
};

formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    searchImage(e.target.searchQuery.value);
});

loadMoreButton.addEventListener('click', loadMoreHandler);

const lightbox = new SimpleLightbox('.gallery',
    {
        captionsData: 'alt',
        captionDelay: 250, 
    }
);