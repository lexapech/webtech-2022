import express from 'express'
import {isAuthenticated} from "./authRoutes.js";
import {enableSave, writeJson} from "../server.js";
import books from "../data/books.json" assert {type: "json"};
const router = express.Router()



router.get('/books?',isAuthenticated, (req, res, next) => {
    console.log(req.path)
    const available = req.query.available === 'true';
    const expired = req.query.expired === 'true';
    res.render("partials/bookList",{filter: {available: available,expired: expired,sort:false}, books: books.books})
})

router.delete('/books?',isAuthenticated, (req, res, next) => {
    console.log(req.path)
    const id = req.query.id
    books.books=books.books.filter((x)=>x.id !== id)
    if (enableSave) writeJson(books,'books.json')
    res.end()
})

router.put('/return?',isAuthenticated, (req, res, next) => {
    console.log(req.path)
    const id = req.query.id
    let book = books.books.find((x)=> x.id===id)
    if (!book) {
        notFound(req, res)
        return
    }
    book.reader={}
    book.available="true"
    if (enableSave) writeJson(books,'books.json')
    res.end()
})

router.put('/give?',isAuthenticated, (req, res, next) => {
    console.log(req.path)
    const id = req.query.id
    let book = books.books.find((x)=> x.id===id)
    if (!book) {
        notFound(req, res)
        return
    }
    book.reader=req.body
    book.available="false"
    if (enableSave) writeJson(books,'books.json')
    res.end()
})

router.put('/edit?',isAuthenticated, (req, res, next) => {
    console.log(req.path)
    const id = req.query.id
    if (id==='new') {
        let newBookId=1
        while (books.books.find((x) => x.id === newBookId.toString())!==undefined) {newBookId++}
        let newBook = req.body
        newBookId = newBookId.toString()
        newBook.id = newBookId
        newBook.available='true'
        newBook.reader={}

        books.books[books.books.length] = newBook
        if (enableSave) writeJson(books,'books.json')
        res.end(JSON.stringify({id:newBookId}))
    }
    else {
        let book = books.books.find((x) => x.id === id)
        if (!book) {
            notFound(req, res)
            return
        }
        book.title = req.body.title
        book.author = req.body.author
        book.publication_date = req.body.publication_date
        book.description = req.body.description
        if (enableSave) writeJson(books,'books.json')
        res.end(JSON.stringify({id:book.id}))
    }
})

export default router