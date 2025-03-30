export interface Movie {
  movieId: number;
  internalId: string;
  corporateId: string;
  directorId: number;
  title: string;
  originalTitle: string;
  description: string;
  shortDescription: string;
  poster: string;
  startDate: string;
  shortUrl: string;
  runTime: number;
  createdAt: string;
  updatedAt: string | null;
  price?: number;  // Dodajte polje za cenu
  director: { directorId: number; name: string };
  movieActors: { movieActorId: number; movieId: number; actorId: number; actor: { actorId: number; name: string } }[];
  movieGenres: { movieGenreId: number; movieId: number; genreId: number; genre: { genreId: number; name: string } }[];
}
