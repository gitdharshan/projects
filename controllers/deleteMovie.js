const fs = require("fs");
const jsonChecker = require("./jsonChecker");

const deleteMovie = (req, res) => {
  const { movie_id } = req.params;

  try {
    if (!movie_id) throw "Movies id is required";
  } catch (e) {
    res.status(400).json({
      status: "failed",
      message: e,
    });
    return;
  }

  // Trying to delete that movie...

  fs.readFile("./movies.json", "utf-8", (err, data) => {
    // If reading fails
    if (err) {
      res.status(400).json({
        status: "failed",
        message: "Could not read file!",
      });

      return;
    }

    // We are trying to parse the JSON and if error occours, we will throw error here itself so that below lies do not crash our server.

    if (!jsonChecker(data)) {
      res.status(400).json({
        status: "failed",
        message:
          "JSON data in movies.json file is not formatted correctly. If you are unsure of what error that is, keep empty array in that file!",
      });
      return;
    }

    const checkIfExists = JSON.parse(data).filter(
      (item) => item.id == movie_id
    );

    if (!checkIfExists || checkIfExists.length < 1) {
      res.status(400).json({
        status: "failed",
        message: "Movie not found! Please check movie id!",
      });

      return;
    }

    const all_movies_except_the_provided_id_to_delete = JSON.parse(data).filter(
      (movie) => movie.id && movie.id.toString() !== movie_id.toString()
    );

    fs.writeFile(
      "./movies.json",
      JSON.stringify(all_movies_except_the_provided_id_to_delete),
      (err, data) => {
        // If reading fails
        if (err) {
          res.status(400).json({
            status: "failed",
            message: "Could not write to file!",
          });

          return;
        }
      }
    );

    res.status(200).json({
      status: "success",
      data: "Movie removed successfully!",
    });
  });
};

module.exports = deleteMovie;
