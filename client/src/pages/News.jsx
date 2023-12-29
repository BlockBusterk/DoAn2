
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import "../styles/news.css";
const News = () => {
  
  const [mynews, setMyNews] = useState([]);
  const [myQueryNews, setMyQueryNews] = useState([]);
  const [searchInput, setSearchInput] = useState('');

  const fetchData = async () => {
    let resonse = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=${process.env.REACT_NEWS_KEY}`
    );
    let data = await resonse.json();
    setMyNews(data.articles);
    setMyQueryNews(data.articles);
  };

  const fetchQueryData = async (keyWord) =>{
    let resonse = await fetch(
      `https://newsapi.org/v2/top-headlines?q=${keyWord}&country=us&category=health&apiKey=${process.env.REACT_NEWS_KEY}`
    );
    let data = await resonse.json();
    setMyNews(data.articles);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const search = () => {
    if(!searchInput)
    {
      setMyNews(myQueryNews)
      return
    }
    
  //   setMyNews(mynews.filter(ele =>
  //   ele.title.toLowerCase().includes(searchInput.toLowerCase()) || ele.description.toLowerCase().includes(searchInput.toLowerCase())
  // ))
  fetchQueryData(searchInput)

}

  return (
    <>
      <Navbar />
      <div className="search-bar flex-center ">

        <input 
        type="text" 
        className="news-input"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="e.g. Science" />

        <button 
        className="search-button"
        onClick={search}
        >Search
        </button>
      </div>

      <main>
        <div class="cards-container news-container flex" id="cards-container">

          {mynews.map((ele) => {
            console.log(ele)
            return (
              <>
              <li key={ele.url}>
                <a href={ele.url} target="_blank" >
                  <div className="news-card" >
                    <div className="news-card-header">
                      <img src={ele.urlToImage == null ? "https://via.placeholder.com/400x200" : ele.urlToImage} alt="news-image" id="news-img" />
                    </div>
                    <div className="card-content">
                      <h3 className="news-title">{ele.title}</h3>
                      <h6 className="news-source" id="news-source">{ele.publishedAt.slice(0, 10)}</h6>
                      <p className="news-desc" id="news-desc">{ele.description}</p>
                    </div>
                  </div>
                </a>
                </li>
              </>
            );
          })}
        </div>


      </main>
    </>
  )
}

export default News