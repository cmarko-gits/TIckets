using API.Data;

namespace API.Dtos
{
    public class RegisterDto : LoginDto
    {
        public string Username {get;set; }
        public string PhoneNumber {get;set;}
        public string Address {get;set;}
        public List<string> FavoriteGenres { get; set; }

    }
}