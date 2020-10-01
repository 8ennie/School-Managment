package com.school.managment.Backend.payload.request;
import java.util.Set;

import javax.validation.constraints.*;

import com.school.managment.Backend.model.photoshow.Area;

import lombok.Data;

@Data
public class SignupRequest {
    @NotBlank
    @Size(min = 3, max = 20)
    private String username;
 
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;
    
    private Set<String> roles;
    
    private Set<Area> areas;
    
    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
  
   
}