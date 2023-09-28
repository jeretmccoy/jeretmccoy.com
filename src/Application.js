import './UIs/style.css';
import {TopBar} from "./UIs/TopBar";
import {TopBar2} from "./UIs/TopBar";
import {BottomBar} from "./UIs/BottomBar";
import Writings from "./Pages/Writings";
import BookRev from "./Pages/BookRev";
import Contact from "./Pages/Contact";
import ReadingGroup from "./Pages/ReadingGroup";
import About from "./Pages/About";
import Videos from "./Pages/Videos";
import Recent from "./Pages/Recent";
import {Helmet} from "react-helmet";
import BlogPosts from "./Pages/BlogPosts";
import Accounts from"./Pages/Accounts";



import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'; 



function Application() 
{       
        return  (
            <Router>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <title>Jeret McCoy</title>
                    <link rel="canonical" href="https://jeretmccoy.com"/>
                    <meta name="The writings of Jeret McCoy" content="Recent Writings - Jeret McCoy"/>
                </Helmet>
                <TopBar/>
                <TopBar2/>
                <Routes>
                    <Route path="/" element={<Recent/>}/>
                    <Route path="/writings" element={<Writings/>}/>
                    <Route path="/bookrev" element={<BookRev/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/readinggroup" element={<ReadingGroup/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/videos" element={<Videos/>}/>
                    <Route path="/blog" element={<BlogPosts/>}/>
                    <Route path="/accounts" element={<Accounts/>}/>
                </Routes>
                <BottomBar/>
            </Router>
        );
}

export default Application; 