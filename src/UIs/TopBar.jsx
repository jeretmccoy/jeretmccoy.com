
import "./topbar.css"

 function TopBar()
{
    return (
        <div className="top">
            <div className="topCenter">
                Jeret McCoy
            </div>
        </div>
    )
}

 function TopBar2()
{
    return (
        <div className="top2">
            <div className="topCenter2">
                <ul className="topList">
                    <li className="topListItem">
                         <a href="/">RECENT</a>
                    </li>
                    <li className="topListItem">
                        <a href="/writings">WRITINGS</a>
                    </li>
                    <li className="topListItem">
                        <a href="/videos">VIDEOS</a>
                    </li>
                    <li className="topListItem">
                        <a href="/about">ABOUT PAGE</a>
                    </li>
                    <li className="topListItem">
                        <a href="/bookrev">BOOK REVIEWS</a>
                    </li>
                    <li className="topListItem">
                        <a href="/readinggroup">STUDY GROUPS</a>
                    </li>
                    <li className="topListItem">
                        <a href="/blog">BLOG POSTS</a>
                    </li>
                    <li className="topListItem">
                        <a href="/contact">CONTACT</a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export {TopBar, TopBar2}


//Recent, Writings (Powerology, HBD), Videos [links to downloads and hosting sites], Social Media (Twitter, Reddit) [notable posts]
//Book reviews, Contact