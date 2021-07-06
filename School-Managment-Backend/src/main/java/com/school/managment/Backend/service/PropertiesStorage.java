package com.school.managment.Backend.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

@Component
public class PropertiesStorage {


    @Value("${message.properties.filelocation}")
    private String messagePropertiesFileLocation;

    public void setProperty(String key, String value) {
        Properties prop = new Properties();
        try (InputStream input = new FileInputStream(messagePropertiesFileLocation)) {
            prop.load(input);
            prop.setProperty(key, value);
            prop.store(new FileOutputStream(messagePropertiesFileLocation), null);
        } catch (IOException e) {
            System.out.println("Properties could not be loaded");
            e.printStackTrace();
        }
    }

    public String getProperty(String key) {
        Properties prop = new Properties();
        try (InputStream input = new FileInputStream(messagePropertiesFileLocation)) {
            prop.load(input);
            return (String) prop.get(key);
        } catch (IOException e) {
            System.out.println("Properties could not be loaded");
            e.printStackTrace();
        }
        return null;
    }
}
