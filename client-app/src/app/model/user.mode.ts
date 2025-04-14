// Model za podatke koji se šalju prilikom registracije ili logovanja
export interface UserFormValues {
    email: string;
    password: string;
  }
  
  // Model za korisničke podatke koji se vraćaju nakon logovanja ili registracije
  export interface User {
    token: string;  // JWT token koji se koristi za autentifikaciju
    email: string;
    username: string;
  }
  