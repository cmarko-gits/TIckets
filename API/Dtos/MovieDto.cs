using System;
using System.Collections.Generic;

namespace API.DTOs
{public class MovieDto
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
    public string StartDate { get; set; }
    public string ShortUrl { get; set; }
    public int RunTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DirectorDto Director { get; set; }
    public List<MovieActorDto> MovieActors { get; set; }
    public List<MovieGenreDto> MovieGenres { get; set; }
}

public class DirectorDto
{
    public int DirectorId { get; set; }
    public string Name { get; set; }
}

public class MovieActorDto
{
    public int MovieActorId { get; set; }
    public int MovieId { get; set; }
    public int ActorId { get; set; }
    public ActorDto Actor { get; set; }
}

public class ActorDto
{
    public int ActorId { get; set; }
    public string Name { get; set; }
}

public class MovieGenreDto
{
    public int MovieGenreId { get; set; }
    public int MovieId { get; set; }
    public int GenreId { get; set; }
    public GenreDto Genre { get; set; }
}

public class GenreDto
{
    public int GenreId { get; set; }
    public string Name { get; set; }
}

}
