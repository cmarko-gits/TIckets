using System.Security.Claims;
using API.Data;
using API.Dtos;
using API.Entities;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly TokenService _tokenService; 
        private readonly UserManager<User> _userManager;

        public AccountController(UserManager<User> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("register")]
[AllowAnonymous]
public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
{
    if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
    {
        ModelState.AddModelError("username", "Username already taken");
        return ValidationProblem();
    }

    if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
    {
        ModelState.AddModelError("email", "Email already taken");
        return ValidationProblem();
    }

    var user = new User
    {
        Email = registerDto.Email,
        UserName = registerDto.Username,
        PhoneNumber = registerDto.PhoneNumber,
        Address = registerDto.Address,
        FavoriteGenres = registerDto.FavoriteGenres ?? new List<string>()
    };

    var result = await _userManager.CreateAsync(user, registerDto.Password);

    if (result.Succeeded)
    {
        return CreateUserObject(user); 
    }

    return Unauthorized(result.Errors);
}

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                return CreateUserObject(user);  
            }

            return Unauthorized();
        }

                [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null) return Unauthorized(); 

            return CreateUserObject(user);
        }
         private UserDto CreateUserObject(User appUser)
        {
            return new UserDto
            {
                Username = appUser.UserName,
                Email = appUser.Email,
                Token = _tokenService.CreateToken(appUser)
            };
        }
    }
}
