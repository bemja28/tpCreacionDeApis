const {validateSequelize} = require('../resources');
const moment = require('moment');
const fecha = new Date()

module.exports = (sequelize, dataTypes) => {
    let alias = 'Movie'; // esto debería estar en singular
    let cols = {
        id: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        // created_at: dataTypes.TIMESTAMP,
        // updated_at: dataTypes.TIMESTAMP,
        title: {
            type: dataTypes.STRING(500),
            allowNull: false,
            validate :{
                notNull : validateSequelize(true,'El campo titulo no puede ser nulo'),
                notEmpty : validateSequelize(true, 'El titulo de la pelicula es requerido')
            }
        },
        rating: {
            type: dataTypes.DECIMAL(3, 1).UNSIGNED,
            allowNull: false,
            validate :{
                notNull : validateSequelize(true,'El campo rating no puede ser nulo'),
                notEmpty : validateSequelize(true, 'Ingresa un numero decimal')
            }

        },
        awards: {
            type: dataTypes.BIGINT(10).UNSIGNED,
            allowNull: false,
            validate :{
                notNull : validateSequelize(true,'El campo premios no puede ser nulo'),
                notEmpty : validateSequelize(true, 'Ingresa la cantidad de premios de la pelicula')
            }
        },
        release_date: {
            type: dataTypes.DATEONLY,
            allowNull: false,
            validate :{
                isBefore : validateSequelize(`${fecha.getFullYear()}/${fecha.getMonth()+1}/${fecha.getDay()}`,'La fecha debe ser anterior a la actual'),
                notNull : validateSequelize(true,'El campo fecha no puede ser nulo')
                
                
            }

        },
        length: dataTypes.BIGINT(10),
        genre_id: dataTypes.BIGINT(10)
    };
    let config = {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: false
    }
    const Movie = sequelize.define(alias,cols,config);

    Movie.associate = function (models) {
        Movie.belongsTo(models.Genre, { // models.Genre -> Genres es el valor de alias en genres.js
            as: "genre",
            foreignKey: "genre_id"
        })

        Movie.belongsToMany(models.Actor, { // models.Actor -> Actors es el valor de alias en actor.js
            as: "actors",
            through: 'actor_movie',
            foreignKey: 'movie_id',
            otherKey: 'actor_id',
            timestamps: false
        })
    }

    return Movie
};