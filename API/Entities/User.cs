using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser
    {       
        public string Address { get; set; }

        public List<string> FavoriteGenres { get; set; } = new();

    }
}