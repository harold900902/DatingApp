using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;

        }
        public void Add<T>(T entity) where T : class
        {
           _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
           _context.Remove(entity);
        }

        public  async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoFromUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo =await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }
        
        public async Task<User> GetUser(int id)
        {
           var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

       
        public async Task<PagedList<User>> getUsers(UserParams userParams)
        {
            var users = _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            if (userParams.Gender != "all")
            {
                users = users.Where(u => u.Gender == userParams.Gender); 
            }
            if (userParams.Likers || userParams.Likees)
            {
                var userlikes = await GetUserLikes(userParams.UserId,userParams.Likers);
                users = users.Where(u => userlikes.Contains(u.Id));
            }
          
         
            if(userParams.MinAge != 18 || userParams.MaxAge != 100){
            
                var minBoD = DateTime.Today.AddYears(-userParams.MaxAge -1);
                var maxBoD = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minBoD && u.DateOfBirth <= maxBoD);
            }
            if (!string.IsNullOrEmpty(userParams.OrderBy))
            {
                switch (userParams.OrderBy)
                {
                    case "created":
                        users = users.OrderByDescending(u => u.Created);
                        break;
                    
                    default:
                        users = users.OrderByDescending(u => u.LastActive);
                        break;
                    
                }
                
            }

            return await PagedList<User>.CreateAsync(users,userParams.PageNumber,userParams.PageSize);
        }
        public async Task<IEnumerable<int>> GetUserLikes(int id, bool likers){
            
            var user = await _context.Users.Include(x => x.Likers).Include(x => x.Likees).FirstOrDefaultAsync(u => u.Id ==id);

            if (likers)
            {
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }else
            {
                return user.Likees.Where(u => u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        public async Task<bool> SaveAll()
        {
           return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
            var message= await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
            return message;
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(u => u.Recipient).ThenInclude(p => p.Photos)
            .Where(m => m.SenderId == userId && m.RecipientId == recipientId && m.RecipientDeleted == false || 
                   m.SenderId == recipientId && m.RecipientId == userId && m.SenderDeleted == false)
            .OrderBy(m => m.MessageSent).ToListAsync();
            
            return messages;


        }

        public async Task<PagedList<Message>> GetMessageUser(MessageParams messageParams)
        {
            var messages = _context.Messages
            .Include(u => u.Sender).ThenInclude(p => p.Photos)
            .Include(u => u.Recipient).ThenInclude(p => p.Photos)
            .AsQueryable();

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                  messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.RecipientDeleted == false);
                  break;
                case "Outbox":
                  messages = messages.Where(u => u.SenderId == messageParams.UserId && u.SenderDeleted == false);
                  break;
                
                default:
                 messages = messages.Where(u => u.RecipientId == messageParams.UserId && u.IsRead == false 
                                        && u.RecipientDeleted == false && u.SenderDeleted == false);
                 break;
            }
            messages = messages.OrderBy(d => d.MessageSent);
            return await PagedList<Message>.CreateAsync(messages,messageParams.PageNumber,messageParams.PageSize);
        }
    }
}