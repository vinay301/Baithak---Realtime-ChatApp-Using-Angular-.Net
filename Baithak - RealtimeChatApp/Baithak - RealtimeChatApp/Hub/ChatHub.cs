using Baithak___RealtimeChatApp.Model;
using Microsoft.AspNetCore.SignalR;
using System.Collections.Generic;

namespace Baithak___RealtimeChatApp.Hub
{
    public class ChatHub : Microsoft.AspNetCore.SignalR.Hub
    {
        private readonly IDictionary<string, UserRoomConnection> _connection;
        public ChatHub(IDictionary<string, UserRoomConnection> connection)
        {
            _connection = connection;
        }
        public async Task JoinRoom(UserRoomConnection userConnection)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, userConnection.Roomname!);
            _connection[Context.ConnectionId] = userConnection;
            await Clients.Groups(userConnection.Roomname!).SendAsync(method: "RecieveMessage", arg1: "Baithak-Admin", 
                arg2: $"{userConnection.Username} has Joined the Group", arg3:DateTime.Now);
            await SendConnectedUsers(userConnection.Roomname!); 
        }

        public async Task SendMessage(string message)
        {
            if (_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection userRoomConnection))
            {
                await Clients.Group(userRoomConnection.Roomname!).SendAsync(method: "RecieveMessage", arg1: userRoomConnection.Username, arg2: message, arg3: DateTime.Now);
            }
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            if(!_connection.TryGetValue(Context.ConnectionId, out UserRoomConnection roomConnection))
            {
                return base.OnDisconnectedAsync(exception);
            }
            _connection.Remove(Context.ConnectionId);
            Clients.Group(roomConnection.Roomname!).
                SendAsync(method: "RecieveMessage", arg1: "Baithak-Admin", arg2:$"{roomConnection.Username} has left the group", arg3:DateTime.Now);
            SendConnectedUsers(roomConnection.Roomname!);
            return base.OnDisconnectedAsync(exception);
           
        }

        public Task SendConnectedUsers(string room)
        {
            var users = _connection.Values
                .Where(UserRoomConnection => UserRoomConnection.Roomname == room)
                .Select(UserRoomConnection => UserRoomConnection.Username);
            return Clients.Group(room).SendAsync(method: "ConnectedUsers", users);
        }
    }
}
