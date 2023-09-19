// import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import fetchImage from './js/api';

import 'notiflix/dist/notiflix-3.2.6.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formSearch = document.querySelector('.search-form');
const galleryContainer = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');
const endOfSearch = document.querySelector('.end-search');

// endOfSearch.style.display = 'none';
let page = 1;
let totalPages = 0;
let lastQuery = null;

formSearch.firstElementChild.focus();

const renderGallery = (arr, container, totalPages) => {
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
                            <b>Likes</b></br>
                        ${item.likes}</p>
                        <p class="info-item">
                            <b>Views</b></br>
                        ${item.views}</p>
                        <p class="info-item">
                            <b>Comments</b></br>
                        ${item.comments}</p>
                        <p class="info-item">
                            <b>Downloads</b></br>
                        ${item.downloads}</p>
                    </div>
                    </a>
                </div>
            `)
        .join('');
    
    container.insertAdjacentHTML('beforeend', markup);

    const lightbox = new SimpleLightbox('.gallery a',
        {
            captionsData: 'alt',
            captionDelay: 250, 
        }
    );

    lightbox.refresh();

    console.log(page, '===', totalPages);

    if (page < totalPages & totalPages != 1) {
        loadMoreButton.style.display = 'block';
        endOfSearch.style.display = 'none';
    } else {
        if (totalPages === 0) {
            endOfSearch.style.display = 'none';   
        } else {
            loadMoreButton.style.display = 'none';
            endOfSearch.style.display = 'block';
        };
    };
    
};


const searchImage = async function (searchQuery) {
    if (searchQuery.trim() === '' || searchQuery === null) {
        Notify.failure('Input cannot be empty');
        return;
    }
    const query = searchQuery;
    console.log(query);
    if (query === lastQuery) {
        return;
    } else {
        galleryContainer.innerHTML = '';
    }

    lastQuery = query;
    page = 1;

    const imageData = await fetchImage(query, page);
    renderGallery(imageData[0],galleryContainer,imageData[1]);
};

const loadMoreHandler = async () => {
    page += 1;
    const imageData = await fetchImage(lastQuery, page);
    renderGallery(imageData[0], galleryContainer,imageData[1]);

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
    loadMoreButton.style.display = 'none';
    searchImage(e.target.searchQuery.value);
});

loadMoreButton.addEventListener('click', loadMoreHandler);

