package com.school.managment.Backend.service;

import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.model.photoshow.Message;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class MessageBannerService {

    @Autowired
    public PropertiesStorage propertiesStorage;


    public void saveMessageForArea(Area area, Message message) {
        propertiesStorage.setProperty("message.banner." + area, message.getMessage().toString());
    }

    public Message getMessageForArea(Area area) {
        String message = propertiesStorage.getProperty("message.banner." + area);
        if (message != null) {
            Message msg = new Message();
            msg.setArea(area);
            msg.setMessage(message);
            return msg;
        }
        return null;
    }

}
