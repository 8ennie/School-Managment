package com.school.managment.Backend.controller;

import java.util.ArrayList;
import java.util.List;

import com.school.managment.Backend.model.photoshow.Area;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.school.managment.Backend.model.photoshow.Message;
import com.school.managment.Backend.model.photoshow.Monitor;
import com.school.managment.Backend.repository.MonitorRepository;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class WebSocketController {

    private final SimpMessagingTemplate template;

    @Autowired
    private MonitorRepository monitorRepository;

    private List<Message> currentMessages = new ArrayList<Message>();

    @Autowired
    WebSocketController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/send/message")
    public void sendMessage(Message message) {
        System.out.println(message);
        if (message.getArea() != null) {
            currentMessages.removeIf(savedMessage -> savedMessage.getArea() == message.getArea());
        } else if (message.getMonitorId() != null) {
            currentMessages.removeIf(savedMessage -> savedMessage.getMonitorId().equals(message.getMonitorId()));
        }
        if (!message.getMessage().equals("")) {
            this.currentMessages.add(message);
        }
        System.out.println(currentMessages);
        this.template.convertAndSend("/message", message);
    }

//    @GetMapping("/api/monitors/{monitorId}/messages")
//    public Message getCurrentMessage(@PathVariable("monitorId") String monitorId) {
//        Message messageForMonitor;
//    	for (Message message : currentMessages) {
//			if(message.getMessage() == monitorId) {
//                messageForMonitor = message;
//			}
//		}
//
//    	return messageForMonitor;
//    }

    @GetMapping("/api/areas/{area}/messages")
    public Message getCurrentMessageForArea(@PathVariable("area") Area area) {
        return currentMessages.stream().filter(message -> message.getArea() == area).findFirst().orElse(null);
    }

//    @PostMapping("/api/message")
//    public void sendMessage(Message message) {
//    	System.out.println(message);
//        this.currentMessage = message;
//        this.template.convertAndSend("/message",  message);
//    }

}