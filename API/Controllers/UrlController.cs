using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.Dtos;
using API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UrlController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UrlController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("shorten")]
        public async Task<IActionResult> ShortenUrl([FromBody] UrlEntryDto urlDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (!Uri.TryCreate(urlDto.OriginalUrl, UriKind.Absolute, out _))
                    return BadRequest("Invalid URL format");

                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

                var existingUrl = await _context.UrlEntries
                    .FirstOrDefaultAsync(u => u.UserId == userId && u.OriginalUrl == urlDto.OriginalUrl);

                if (existingUrl != null)
                    return Ok(new { shortCode = existingUrl.ShortCode });

                var shortCode = await GenerateShortCode();

                var urlEntry = new UrlEntry
                {
                    OriginalUrl = urlDto.OriginalUrl,
                    ShortCode = shortCode,
                    UserId = userId
                };

                _context.UrlEntries.Add(urlEntry);
                await _context.SaveChangesAsync();

                return Ok(new { shortCode });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while shortening the URL.");
            }
        }

        [HttpGet("history")]
        public async Task<IActionResult> GetUrlHistory()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var urlEntries = await _context.UrlEntries
                .Where(u => u.UserId == userId)
                .OrderByDescending(u => u.CreatedAt)
                .ToListAsync();

            return Ok(urlEntries);
        }

        private async Task<string> GenerateShortCode()
        {
            const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            while (true)
            {
                var shortCode = new string(Enumerable.Repeat(chars, 6)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                if (!await _context.UrlEntries.AnyAsync(u => u.ShortCode == shortCode))
                    return shortCode;
            }
        }

        [HttpGet("{shortCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> RedirectToOriginalUrl(string shortCode)
        {
            var urlEntry = await _context.UrlEntries
                .FirstOrDefaultAsync(u => u.ShortCode == shortCode);

            if (urlEntry == null)
                return NotFound();

            return Redirect(urlEntry.OriginalUrl);
        }
    }
}