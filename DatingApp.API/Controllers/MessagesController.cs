using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers

{
    [ServiceFilter(typeof(LogUserActivity))]
    [Authorize]
    [Route("api/users/{userId}/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        public MessagesController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;
        }

        [HttpGet("{id}" , Name="GetMessage")]
        public async Task<IActionResult> GetMessage(int userId, int id){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var messageFromRepo = await _repo.GetMessage(id);
            if (messageFromRepo == null)
                return NotFound();
            
            return Ok(messageFromRepo);
        }

        [HttpGet]
        public async Task<IActionResult> GetMessagesForUser(int UserId, [FromQuery]MessageParams messageParams) {
           
            if(UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

                
            messageParams.UserId = UserId;
            var messages = await _repo.GetMessageUser(messageParams);
            var messageToReturn = _mapper.Map<IEnumerable<MessageForReturnDto>>(messages);

            Response.AddPagination(messages.CurrentPage,messages.PageSize,messages.TotalCount,messages.TotalPages);

           return Ok(messageToReturn);

        }
        [HttpGet("thread/{recipiendId}")]
        public async Task<IActionResult> GetMessageThread(int UserId, int RecipiendId){
            if(UserId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var recipientFromRepo = await _repo.GetUser(RecipiendId);

            if(recipientFromRepo == null)
               return NotFound();

            var messages = await _repo.GetMessageThread(UserId, RecipiendId);

            var messageToReturn = _mapper.Map<IEnumerable<MessageForReturnDto>>(messages);

            return Ok(messageToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMessage(int userId, MessageForCreationDto messageDto){
            var sender = await _repo.GetUser(userId);
             if (sender == null)
                BadRequest("Could not find user");

            if(sender.Id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();     

            messageDto.SenderId = userId;

            var recipient = await _repo.GetUser(messageDto.RecipientId);
            if (recipient == null)
                BadRequest("Could not find user");
            
            var message = _mapper.Map<Message>(messageDto);

            _repo.Add(message);


            if(await _repo.SaveAll()){
                 var messageToReturn = _mapper.Map<MessageForReturnDto>(message);
                return CreatedAtRoute("GetMessage",new {userId, id = message.Id},messageToReturn);
            }
            throw new Exception("Creating the message failed on save");
              
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> DeleteMessage(int id, int userId){
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();     
            
            var messageFromRepo = await _repo.GetMessage(id);

            if(messageFromRepo.SenderId == userId)
                messageFromRepo.SenderDeleted = true;
            if(messageFromRepo.RecipientId == userId )
                messageFromRepo.RecipientDeleted = true;
            
            if(messageFromRepo.RecipientDeleted && messageFromRepo.SenderDeleted)
                _repo.Delete(messageFromRepo);

            if(await _repo.SaveAll())
               return NoContent();

            throw new Exception("Error deleting the message");
        }
       
        [HttpPost("{id}/read")]
        public async Task<IActionResult> MarkMessageAsRead(int userId, int id){
            
            if(userId != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();
            
            var message = await _repo.GetMessage(id);
            if(message.RecipientId != userId)
                return Unauthorized();
            
            message.IsRead = true;
            message.DateRead = DateTime.Now;

            await _repo.SaveAll();

            return NoContent();




        }

        
        
    }
}