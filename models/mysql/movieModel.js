import mysql from "mysql2/promise"

const config = {
    host: "localhost",
    user: "root",
    port: "3306",
    password: "",
    database: "moviesdb"
}
const connection = await mysql.createConnection(config)

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase();

            // recupera info de genre 
            const [genres] = await connection.query(
                "SELECT id, name FROM genre WHERE LOWER(name) = ?;", [lowerCaseGenre]
            );
            if (genres.length === 0) return [];

            const [{ id }] = genres;

            // recupera movies de un genre especifico 
            const [movies] = await connection.query(
                "SELECT movies.* FROM movie movies" +
                "JOIN movie_genres mg ON m.id = mg.movie_id " +
                "WHERE mg.genre_id = ? ;", [id]
            );

            // Return the array of movies
            return movies;
        }

        const [movies] = await connection.query(
            "select title, year, director, duration, poster, rate, bin_to_uuid(id) id from movie;"
        )
        return movies
    }

    static async getById({ id }) {
        const [movies] = await connection.query(
            "select title, year, director, duration, poster, rate, bin_to_uuid(id) id from movie where id = uuid_to_bin(?);",
            [id]
        )
        if (movies.length === 0) return null

        return movies[0]

    }

    static async create({ input }) {
        const {
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input

        const [uuidResult] = await connection.query("select uuid() uuid;")
        const [{ uuid }] = uuidResult

        try {
            const result = await connection.query(
                `insert into movie (id, title, year, director, duration, poster, rate) 
                values (uuid_to_bin("${uuid}"),?,?,?,?,?,?)`,
                [title, year, director, duration, poster, rate]
            )
        } catch (error) {
            //cuidado con los errores no mostrar info sensible
            throw new Error("error creating  movie")
            //enviar a un servicio interno como sendlog(error)
        }
        //en general es una mala practica dejar que el js evalue lo que se le pasa a sql por que pueden generar una sql injection
        const [movies] = await connection.query(
            `select title, year, director, duration, poster, rate, bin_to_uuid(id) id
            from movie where id = uuid_to_bin(?);`,
            [uuid]
        )

        return movies[0]
    }

    static async delete({ id }) {
        try {
            const result = await connection.query(
                `delete from movie where id = uuid_to_bin(?);`,
                [id]

            )
            return `delete movie ${id}`
        } catch (error) {
            throw new Error("error delete movie")
        }
    }

    static async update({ id, input }) {
        try {
            const result = await connection.query(
                `update movie set year = ? where id = uuid_to_bin(?);`,
                [input.year, id]

            )
            return `update movie ${id} ${input.year}`
        } catch (error) {
            throw new Error("error update movie")
        }
    }
}