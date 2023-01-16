const db = require('../../database/models');
const sequelize = db.sequelize;


const genresController = {
    'list': async (req, res) => {

        try {
            let genres = await db.Genre.findAll({
                attributes : 
                    {
                        exclude : ['created_at', 'updated_at']
                    }
                
            })
            return res.status(200).json({
                ok : true,
                meta :{
                    total : genres.length
                },
                data : genres
            })
        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok: false,
                msg : error.message
            })
        }


    },
    'detail': async (req, res) => {
        const{id}= req.params
        try {

            if(isNaN(id)) {
                let error = new Error('El ID debe ser un numero');
                error.status = 400;
                throw error
            }
            
            let genre = await db.Genre.findByPk(id,{
                attributes : 
                    {
                        exclude : ['created_at', 'updated_at']
                    }
            })

            if (!genre) {
                let error = new Error('No existe un genero con ese ID');
                error.status = 404;
                throw error
            }

            return res.status(200).json({
                ok : true,
                meta :{
                    total : 1
                },
                data : genre
            })
            
        } catch (error) {
            console.log(error)
            return res.status(error.status || 500).json({
                ok: false,
                msg : error.message
            })
        }






        
    }

}

module.exports = genresController;