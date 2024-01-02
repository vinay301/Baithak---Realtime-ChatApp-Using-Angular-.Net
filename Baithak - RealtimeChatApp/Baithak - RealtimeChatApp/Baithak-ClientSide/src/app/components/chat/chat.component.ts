import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewChecked {

  chatService = inject(ChatService);
  router = inject(Router);
  inputMessage = "";
  messages : any[] = [];
  loggedInUserName = sessionStorage.getItem("user");
  roomName = sessionStorage.getItem("roomname");
  @ViewChild('scrollMe') private scrollContainer!:ElementRef;
  constructor() { }



  ngOnInit() {
    this.chatService.messages$.subscribe(res => {
      this.messages = res
      console.log(this.messages);
      
    });
  }

  ngAfterViewChecked(): void {
   this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  sendMessage(){
    this.chatService.sendMsg(this.inputMessage).then(() => {
      this.inputMessage = ''
    }).catch((err) => {
      console.log(err)
    })
  }

  leaveChat(){
    this.chatService.leaveChat().then(()=>{
      this.router.navigate(['welcome']);
      setTimeout(() => {
        location.reload();
      },0)
    }).catch((err) => {
      console.log(err);
    })
  }
}
