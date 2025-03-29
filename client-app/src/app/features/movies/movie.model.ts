export interface Movie {
    movieId: number;
    title: string;
    originalTitle: string;
    description: string;
    shortDescription: string;
    poster: string;
    startDate: string;
    runTime: number;
    director: { directorId: number; name: string };
    movieActors: { actorId: number; name: string }[];
    movieGenres: { genreId: number; name: string }[];
  }
  