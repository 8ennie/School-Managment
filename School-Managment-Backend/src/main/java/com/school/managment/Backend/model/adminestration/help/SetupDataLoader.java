package com.school.managment.Backend.model.adminestration.help;

import java.util.Arrays;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.school.managment.Backend.model.adminestration.EPrivilege;
import com.school.managment.Backend.model.adminestration.ERole;
import com.school.managment.Backend.model.adminestration.Privilege;
import com.school.managment.Backend.model.adminestration.Role;
import com.school.managment.Backend.model.adminestration.User;
import com.school.managment.Backend.model.photoshow.Area;
import com.school.managment.Backend.repository.PrivilegeRepository;
import com.school.managment.Backend.repository.RoleRepository;
import com.school.managment.Backend.repository.UserRepository;

@Component
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {

	boolean alreadySetup = false;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PrivilegeRepository privilegeRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public void onApplicationEvent(ContextRefreshedEvent event) {

		if (alreadySetup)
			return;
		
		
		for (EPrivilege privilege : EPrivilege.values()) {
			createPrivilegeIfNotFound(privilege);
		}
		
		
		for (ERole role : ERole.values()) {
			createRoleIfNotFound(role, role.privileges);
		}

		Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN.name()).get();
		
		Role schulleitungRoles = roleRepository.findByName(ERole.ROLE_SCHULLEITUNG.name()).get();
		Role schuelerkreisRoles = roleRepository.findByName(ERole.ROLE_SCHUELERKREIS.name()).get(); 
		Role sekreteriatRoles = roleRepository.findByName(ERole.ROLE_SEKRETARIAT.name()).get(); 
		Role nachmittagsbetreuung = roleRepository.findByName(ERole.ROLE_NACHMITTAGSBETREUUNG.name()).get(); 
		//Role userRole = roleRepository.findByName(ERole.ROLE_USER.name()).get();
		
		createUserIfNotFound("Admin", null, "adminadmin", Arrays.asList(adminRole), new HashSet<Area>(Arrays.asList(Area.values())));
		//createUserIfNotFound("User", "user@user.com", "useruser", Arrays.asList(userRole), null);
		
		createUserIfNotFound("Schulleitung", null, "Schulleitung", Arrays.asList(schulleitungRoles), new HashSet<Area>(Arrays.asList(Area.values())));
		createUserIfNotFound("Sekretariat", null, "Sekretariat", Arrays.asList(sekreteriatRoles), new HashSet<Area>(Arrays.asList(Area.values())));
		createUserIfNotFound("Schülerkreis", null, "Schülerkreis", Arrays.asList(schuelerkreisRoles), new HashSet<Area>(Arrays.asList(Area.STUDENTGROUP)));
		createUserIfNotFound("Nachmittagsbetreuung", null, "Nachmittagsbetreuung", Arrays.asList(nachmittagsbetreuung), new HashSet<Area>(Arrays.asList(Area.AFTERCARE)));
		
		alreadySetup = true;
	}
	

	@Transactional
	Privilege createPrivilegeIfNotFound(EPrivilege name) {
		Optional<Privilege> privilegeDB = privilegeRepository.findByName(name);
		if (!privilegeDB.isPresent()) {
			Privilege privilege = new Privilege(name);
			return privilegeRepository.save(privilege);
		}
		return privilegeDB.get();
	}

	@Transactional
	Role createRoleIfNotFound(ERole name, Collection<EPrivilege> privileges) {
		Optional<Role> roleDB = roleRepository.findByName(name.name());
		if (!roleDB.isPresent()) {
			Role role = new Role();
			role.setName(name.name());
			role.setPrivileges(privileges.stream().map(privilege -> privilegeRepository.findByName(privilege).get()).collect(Collectors.toList()));
			return roleRepository.save(role);
		}
		return roleDB.get();
	}
	
	@Transactional
	User createUserIfNotFound(String username,String email, String password,  List<Role> roles, Set<Area> areas) {
		Optional<User> userDB = userRepository.findByUsername(username);
		if (!userDB.isPresent()) {
			User user = new User(username, email, passwordEncoder.encode(password));
			user.setRoles(new HashSet<Role>(roles));
			user.setAreas(areas);
			return userRepository.save(user);
		}
		return userDB.get();
	}
}