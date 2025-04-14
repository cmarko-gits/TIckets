using System;
using System.Collections.Generic;

namespace API.Entities
{
    public class Movie
    {
        public int MovieId { get; set; }
        public string InternalId { get; set; }
        public string CorporateId { get; set; }
        public int DirectorId { get; set; }
        public string Title { get; set; }
        public string OriginalTitle { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string Poster { get; set; }
        public DateTime StartDate { get; set; }
        public string ShortUrl { get; set; }
        public int RunTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public Director Director { get; set; }
        public List<MovieActor> MovieActors { get; set; }
        public List<MovieGenre> MovieGenres { get; set; }
    }

    public class Director
    {
        public int DirectorId { get; set; }
        public string Name { get; set; }
    }

    public class MovieActor
    {
        public int MovieActorId { get; set; }
        public int MovieId { get; set; }
        public int ActorId { get; set; }
        public Actor Actor { get; set; }
    }

    public class Actor
    {
        public int ActorId { get; set; }
        public string Name { get; set; }
    }

    public class MovieGenre
    {
        public int MovieGenreId { get; set; }
        public int MovieId { get; set; }
        public int GenreId { get; set; }
        public Genre Genre { get; set; }
    }

    public class Genre
    {
        public int GenreId { get; set; }
        public string Name { get; set; }
    }
}
