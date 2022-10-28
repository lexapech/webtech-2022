import express from 'express'
import {isAuthenticated} from "./authRoutes.js";
import books from "../data/books.json" assert {type: "json"};
const router = express.Router()



router.get('/',isAuthenticated, (req, res, next) => {
    console.log(req.path)
    res.render("pages/index",{pageTitle: "Домашняя библиотека", username:req.session.passport.user.username})
})

router.get('/login', function(req, res, next) {
    res.render('pages/login',{pageTitle: "Домашняя библиотека", username:"",signup:false});
});
router.get('/signup', function(req, res, next) {
    res.render('pages/login',{pageTitle: "Домашняя библиотека", username:"",signup:true});
});

router.get('/books/new',isAuthenticated, (req, res, next) => {
    console.log(req.path)
    let data = {id:"new",author:"",publication_date:"",description:"",title:""}
    res.render("pages/edit",{pageTitle: "Карточка книги", username:req.session.passport.user.username, data: data})
})

router.get('/books/edit?',isAuthenticated, (req, res, next) => {
    console.log(req.path)
    const id = req.query.id
    let book = books.books.find((x)=> x.id===id)
    if (!book) {
        notFound(req, res)
        return
    }
    res.render("pages/edit",{pageTitle: "Карточка книги", username:req.session.passport.user.username, data: book})
})
router.get('/books/:id',isAuthenticated, (req, res, next) => {
    console.log(req.path)
    let book = books.books.find((x)=> x.id===req.params.id)
    if (!book) {
        notFound(req, res)
        return
    }
    res.render("pages/book",{pageTitle: "Карточка книги", username:req.session.passport.user.username, data: book})
})


router.get('*',isAuthenticated, notFound)
function notFound(req, res) {
    res.status(404)
    res.render("pages/404",{pageTitle: "Домашняя библиотека", username:req.session.passport.user.username})
}
export default router