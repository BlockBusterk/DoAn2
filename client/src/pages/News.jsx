
import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../redux/reducers/rootSlice";
import Loading from "../components/Loading";
import Empty from "../components/Empty";
import "../styles/news.css";
const News = () => {
  
  const [mynews, setMyNews] = useState([]);
  const [myQueryNews, setMyQueryNews] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.root);

  const fetchData = async () => {
    dispatch(setLoading(true));
    let resonse = await fetch(
      `https://newsapi.org/v2/top-headlines?country=us&category=health&apiKey=725080b9a7864d7ea15ffbe5aa1be945`
    );
    let data = await resonse.json();
    setMyNews(data.articles);
    setMyQueryNews(data.articles);
    dispatch(setLoading(false));
  };

  const fetchQueryData = async (keyWord) =>{
    dispatch(setLoading(true));
    let resonse = await fetch(
      `https://newsapi.org/v2/top-headlines?q=${keyWord}&country=us&category=health&apiKey=725080b9a7864d7ea15ffbe5aa1be945`
    );
    let data = await resonse.json();
    setMyNews(data.articles);
    dispatch(setLoading(false));
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
      {loading ? 
        <Loading />
       : (  mynews.length > 0 ? (
        <div className="cards-container news-container flex" id="cards-container">
          {mynews.map((ele) => {
            console.log(ele);
            return (
              <li key={ele.url}>
                <a href={ele.url} target="_blank">
                  <>
                    <div className="news-card">
                      <div className="news-card-header">
                        <img src={ele.urlToImage == null ? "https://via.placeholder.com/400x200" : ele.urlToImage} alt="news-image" id="news-img" />
                      </div>
                      <div className="card-content">
                        <h3 className="news-title">{ele.title}</h3>
                        <h6 className="news-source" id="news-source">{ele.publishedAt.slice(0, 10)}</h6>
                        <p className="news-desc" id="news-desc">{ele.description}</p>
                      </div>
                    </div>
                  </>
                </a>
              </li>
            );
          })}
        </div>
      ) : (
        <Empty />
      )
 )}

      </main>
    </>
  )
}

export default News