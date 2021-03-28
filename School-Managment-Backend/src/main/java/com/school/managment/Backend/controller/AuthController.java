package com.school.managment.Backend.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.school.managment.Backend.model.adminestration.ERole;
import com.school.managment.Backend.model.adminestration.Role;
import com.school.managment.Backend.model.adminestration.User;
import com.school.managment.Backend.model.photoshow.Monitor;
import com.school.managment.Backend.payload.request.ChangePasswordRequest;
import com.school.managment.Backend.payload.request.LoginRequest;
import com.school.managment.Backend.payload.request.SignupRequest;
import com.school.managment.Backend.payload.response.JwtResponse;
import com.school.managment.Backend.payload.response.MessageResponse;
import com.school.managment.Backend.repository.MonitorRepository;
import com.school.managment.Backend.repository.RoleRepository;
import com.school.managment.Backend.repository.UserRepository;
import com.school.managment.Backend.security.jwt.JwtUtils;
import com.school.managment.Backend.security.services.UserDetailsImpl;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder encoder;

	@Autowired
	private MonitorRepository monitorRepository;

	@Autowired
	private JwtUtils jwtUtils;

	@PostMapping("/signin")
	public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

		SecurityContextHolder.getContext().setAuthentication(authentication);
		String jwt = jwtUtils.generateJwtToken(authentication);

		UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
		List<String> privileges = userDetails.getAuthorities().stream().map(item -> item.getAuthority())
				.collect(Collectors.toList());
		return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(),
				userDetails.getEmail(), privileges, userDetails.getAreas()));
	}

	@PostMapping("/changepassword")
	@PreAuthorize("hasAuthority('WRITE_USER')")
	public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest changePasswordRequest) {
		Optional<User> user = userRepository.findByUsername(changePasswordRequest.getUsername());
		if (!user.isPresent()) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Username incorrect!"));
		}
		User nUser = user.get();
		if(encoder.matches(changePasswordRequest.getOldPassword(), nUser.getPassword())) {
			nUser.setPassword(encoder.encode(changePasswordRequest.getNewPassword()));
			userRepository.save(nUser);
		} else {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Password incorrect!"));
		}
		return ResponseEntity.ok(user);
	}

	@PostMapping("/signup")
	@PreAuthorize("hasAuthority('WRITE_USER')")
	public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
		if (userRepository.existsByUsername(signUpRequest.getUsername())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
		}

		if (userRepository.existsByEmail(signUpRequest.getEmail())) {
			return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
		}

		// Create new user's account
		User user = new User(signUpRequest.getUsername(), signUpRequest.getEmail(),
				encoder.encode(signUpRequest.getPassword()));

		Set<Role> roles = setRoles(signUpRequest.getRoles());

		user.setRoles(roles);
		user = userRepository.save(user);

		return ResponseEntity.ok(user);
	}

	@PostMapping("/signup/monitor")
	public ResponseEntity<?> registerMonitor(@RequestBody Long monitorId) {
		User user = new User("Monitor(" + monitorId + ")", null,
				encoder.encode("Monitor(" + monitorId + ")"));

		Role monitorRole = roleRepository.findByName(ERole.ROLE_MONITOR.name()).get();
		Set<Role> roles = new HashSet<>();
		roles.add(monitorRole);
		user.setRoles(roles);
		userRepository.save(user);
		Monitor updateMonitor = monitorRepository.getOne(monitorId);
		updateMonitor.setUser(user);
		monitorRepository.save(updateMonitor);
		return ResponseEntity.ok(new MessageResponse("Monitor registered successfully!"));
	}

	private Set<Role> setRoles(Set<String> strRoles) {
		Set<Role> roles = new HashSet<>();

		for (String strRole : strRoles) {
			String[] urlParts = strRole.split("/");
			Long roleId = Long.valueOf(urlParts[urlParts.length - 1]);
			Role userRole = roleRepository.findById(roleId)
					.orElseThrow(() -> new RuntimeException("Error: Role is not found."));
			roles.add(userRole);
		}
		return roles;
	}
}