import Button from "./Button/Button";
import ImageGallery from "./ImageGallery/ImageGallery";
import Loader from "./Loader/Loader";
import Searchbar from "./Searchbar/Searchbar";
import axios from "axios";
import Modal from "./Modal/Modal";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useCallback } from "react";

const ApiKey = '33796179-09372d9b13f9947ab69ebb690';
const PICTURES_IN_PAGE = 12;

export const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showImageId, setShowImageId] = useState(null);

  const getPictures = useCallback(() => {
    setIsLoading(true);

    const url = `https://pixabay.com/api/?q=${searchQuery}&page=${currentPage}&key=${ApiKey}&image_type=photo&orientation=horizontal&per_page=${PICTURES_IN_PAGE}`;
    axios(url).then(response => {
      if (response.status !== 200) {
        throw new Error(response.statusText);
      }

      setTotalPages(Math.ceil(response.data.totalHits / PICTURES_IN_PAGE));
      setImages(prevState => [...prevState,...response.data.hits ]);
    }).finally(() => setIsLoading(false));
  }, [searchQuery, currentPage]);

  useEffect(() => {
    if (searchQuery) {
      getPictures();
    }
  }, [searchQuery, currentPage, getPictures]);

  const onCloseModal = useCallback(() => {
    setShowImageId(null);
  }, []);

  const escFunction = useCallback(event => {
    if (!showImageId) {
      return;
    }

    if (event.key === "Escape") {
      onCloseModal();
    }
  }, [showImageId, onCloseModal]);

  useEffect(() => {
    if (showImageId) {
      document.addEventListener("keydown", escFunction, false);
    } else {
      document.removeEventListener("keydown", escFunction, false);
    }
  }, [showImageId, escFunction]);

  // componentDidUpdate(_, prevState) {
  //   if (prevState.searchQuery !== this.state.searchQuery || prevState.currentPage !== this.state.currentPage) {
  //     this.getPictures();
  //   }

  //   if (!prevState.showImageId && this.state.showImageId) {
  //     document.addEventListener("keydown", this.escFunction, false);
  //   }

  //   if (prevState.showImageId && !this.state.showImageId) {
  //     document.removeEventListener("keydown", this.escFunction, false);
  //   }
  // }

  const imageModal = useMemo(() => {
    return images.find(({ id }) => id === showImageId);
  }, [images, showImageId]);  

  const onSubmitSearch = useCallback(newSearchQuery => {
    if (searchQuery === newSearchQuery) {
      return;
    }
    setSearchQuery(newSearchQuery);
    setImages([]);
    setCurrentPage(1);
    setTotalPages(0);
    // this.setState({ 
    //   searchQuery,
    //   images: [],
    //   currentPage: 1,
    //   totalPages: 0,
    // });
  }, [searchQuery]);

  const onImageClick = useCallback(imageId => {
    setShowImageId(imageId);
  }, []);

  const onLoadMore = useCallback(() => {
    setCurrentPage(prevState => prevState + 1);
    // this.setState(prevState => ({ currentPage: prevState.currentPage += 1 }));
  }, []);

  return (
    <div>
      <Searchbar onSubmit={onSubmitSearch} />
      <ImageGallery images={images} onImageClick={onImageClick} />
      {!isLoading && currentPage < totalPages && <Button onClick={onLoadMore} />}
      {isLoading && <Loader />}
      {showImageId && <Modal image={imageModal} onClose={onCloseModal} />}
    </div>
  );  
};
