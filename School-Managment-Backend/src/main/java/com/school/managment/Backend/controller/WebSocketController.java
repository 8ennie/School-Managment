package com.school.managment.Backend.controller;

import java.util.ArrayList;
import java.util.List;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.service.MessageBannerService;
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
@CrossOrigin(origins = "http://localhost:4200", maxAge = 3600)
public class WebSocketController {

    @Autowired
    private final SimpMessagingTemplate template;


    @Autowired
    private MessageBannerService messageBannerService;

    @Autowired
    WebSocketController(SimpMessagingTemplate template) {
        this.template = template;
    }

    @MessageMapping("/send/message")
    public void receiveMessage(Message message) {
        if (message.getArea() != null) {
            messageBannerService.saveMessageForArea(message.getArea(), message);
        }
        this.template.convertAndSend("/message", message);
    }

    @GetMapping("/api/areas/{area}/messages")
    public Message getCurrentMessageForArea(@PathVariable("area") Area area) {
        return messageBannerService.getMessageForArea(area);
    }


}