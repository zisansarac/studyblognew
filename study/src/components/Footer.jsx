import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer>
       <ul className="footer__categories">
         <li><Link to="/posts/categories/Elementaryschool">Elementary School</Link></li>
         <li><Link to="/posts/categories/Middleschool">Middle School</Link></li>
         <li><Link to="/posts/categories/Highschool">Highschool</Link></li>
         <li><Link to="/posts/categories/University">University</Link></li>
       </ul>

       <div className="footer__copyright">
           <small>All Right Reserved &copy; Copyright, ZISAN SARAC.</small>
       </div>
    </footer>
  )
}
export default Footer
