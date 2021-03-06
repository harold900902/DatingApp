using System;

namespace DatingApp.API.Dtos
{
    public class MessageForReturnDto
    {
      
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int RecipientId { get; set; }
        public string SenderPhoto { get; set; }
        public string SenderKnownAs { get; set; }
        public string RecipientPhoto { get; set; }
        public string RecipientKnownAs { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; }
    }
}