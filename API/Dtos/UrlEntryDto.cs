using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class UrlEntryDto
    {
        [Required]
        [Url]
        public string OriginalUrl { get; set; }
    }
}