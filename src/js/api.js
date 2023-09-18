import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import 'notiflix/dist/notiflix-3.2.6.min.css';


const BASE_URL = "https://pixabay.com/api/";
const ITEM_PER_PAGE = 40;

async function fetchImage(textSearch, page) {
    try {
        const response = await axios.get(BASE_URL, {
            params : {
                key: "39464156-6c3d114a5269f1cf634bfe107",
                q: textSearch,
                safesearch: true,
                page,
                per_page: ITEM_PER_PAGE,
                image_type: "photo",
                orientation: "horizontal",
            },
        });
        
        totalPages = Math.ceil(response.data.totalHits / ITEM_PER_PAGE);

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

export default fetchImage;