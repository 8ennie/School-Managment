//package com.school.managment.Backend.model.preLoadData;
//
//import java.util.HashSet;
//import java.util.Set;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.boot.ApplicationArguments;
//import org.springframework.boot.ApplicationRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import com.school.managment.Backend.model.adminestration.ERole;
//import com.school.managment.Backend.model.adminestration.Role;
//import com.school.managment.Backend.model.adminestration.User;
//import com.school.managment.Backend.repository.RoleRepository;
//import com.school.managment.Backend.repository.UserRepository;
//
//import lombok.extern.slf4j.Slf4j;
//
//@Component
//@Slf4j
//public class LoadData implements ApplicationRunner {
//
//	@Autowired
//	private RoleRepository roleRepository;
//
//	@Autowired
//	private UserRepository userRepository;
//
//
//	@Autowired
//	PasswordEncoder encoder;
//	
//	@Value( "${spring.jpa.hibernate.ddl-auto}" )
//	private String ddl;
//
//	@SuppressWarnings("unused")
//	@Override
//	public void run(ApplicationArguments args) throws Exception {
//
//		if(ddl.equals("update")) {
//			return;
//		}
//		
//		// Roles
//		Role adminRole = roleRepository.save(new Role(ERole.ROLE_ADMIN));
//		Role monitor = roleRepository.save(new Role(ERole.ROLE_MONITOR));
//		
//		
//		// Users
//		User admin = new User("admin", "admin@admin.com", encoder.encode("adminadmin"));
//		Set<Role> roles = new HashSet<>();
//		roles.add(adminRole);
//		admin.setRoles(roles);
//		log.info("Preload: " + userRepository.save(admin));
//
//	}
//
//}
