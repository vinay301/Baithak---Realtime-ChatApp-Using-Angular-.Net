import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { createLogger } from '@microsoft/signalr/dist/esm/Utils';

@Component({
  selector: 'app-join-room',
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.css']
})
export class JoinRoomComponent implements OnInit {

  joinRoomForm !: FormGroup;
  fb = inject(FormBuilder);
  router = inject(Router)
  chatService = inject(ChatService);
  constructor() { }

  ngOnInit() {
    this.joinRoomForm = this.fb.group({
      user : ['',Validators.required],
      room : ['', Validators.required]
    })
  }

  joinRoom(){
    const {user,room} = this.joinRoomForm.value;
    sessionStorage.setItem("user",user);
    sessionStorage.setItem("roomname",room);
    this.chatService.joinRoom(user,room)
    .then(()=> {
      this.router.navigate(['chat']);
    }).catch((err) => {
      console.error('Error joining room:', err);
    })
  }

}
