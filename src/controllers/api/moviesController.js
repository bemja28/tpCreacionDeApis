const path = require('path');
const db = require('../../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const moment = require('moment');

//Aqui tienen otra forma de llamar a cada uno de los modelo

const moviesController = {
    list: async (req, res) => {

        try {
            
            let movies = await db.Movie.findAll()

            return res.status(200).json({
                ok : true,
                meta :{
                    total : movies.length
                },
                data : movies
            })


        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok: false,
                msg : error.message
            })
        }




        
    },
    detail: (req, res) => {
        db.Movie.findByPk(req.params.id,
            {
                include : ['genre']
            })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        let promGenres = Genres.findAll();
        let promActors = Actors.findAll();
        
        Promise
        .all([promGenres, promActors])
        .then(([allGenres, allActors]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'moviesAdd'), {allGenres,allActors})})
        .catch(error => res.send(error))
    },
    create: async (req,res)=>{

        const{title,rating,awards,release_date,length,genre_id}= req.body

        try {
            
            const movie = await db.Movie.create({
                title: title?.trim(),
                rating,
                awards,
                release_date,
                length,
                genre_id
            })
            return res.status(201).json({
                ok : true,
                meta :{
                    status : 201
                },
                data : {movie}
            })
        } catch (error) {
            console.log(error)

            const showErrors = error.errors.map(error=>{
                return {
                    path : error.path,
                    message : error.message
                }
            })

            // return res.send(showErrors)
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                msg : showErrors
            })
        }


        
       
    },
    update: async (req,res)=>{

        const{title,rating,awards,release_date,length,genre_id}= req.body

        try {

            let movieId = req.params.id;
            let movie = await db.Movie.findByPk(movieId);
            
                movie.title = title?.trim()|| movie.title;
                movie.rating = rating || movie.rating;
                movie.awards = awards || movie.awards;
                movie.release_date = release_date || movie.release_date;
                movie.length = length || movie.length;
                movie.genre_id = genre_id || movie.genre_id;

                await movie.save()
            
            return res.status(200).json({
                ok : true,
                meta :{
                    status : 200
                },
                msg : 'Pelicula actualizada con exito',
                data : movie
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message : error.message || 'hay un error',
            })
        }


        
       
    },
    destroy: async (req,res) =>{


        try {
            let movieId = req.params.id;
            await db.Actor.update(
                {
                    favorite_movie_id : null
                },
                {
                 where: {
                    favorite_movie_id : movieId
                 }   
                }
            )
            await db.ActorMovie.destroy({
                where : {
                    movie_id : movieId
                }
            })

            await db.Movie.destroy({
                where: {
                    id: movieId
                }, 
                force: true
            }) 
            return res.status(200).json({
                ok : true,
                meta :{
                    status : 200
                },
                msg : 'Pelicula eliminada con exito',
                
            })
        } catch (error) {
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message : error.message || 'hay un error',
            })
        }

    }
}

module.exports = moviesController;