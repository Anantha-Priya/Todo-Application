package com.priya.Helloworld.controller;

import com.priya.Helloworld.models.User;
import com.priya.Helloworld.repository.UserRepository;

import com.priya.Helloworld.service.UserService;

import com.priya.Helloworld.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor    //It's used instead of @AutoWired
@RequestMapping("/auth")
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;  //these are declarations that we're using in the below code
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String,String> body){
        String email=body.get("email");
        String password= passwordEncoder.encode(body.get("password"));  //it will encrypt the password and store it in db

        if(userRepository.findByEmail(email).isPresent()){
            return new ResponseEntity<>("Email already Exists", HttpStatus.CONFLICT);
        }
        userService.createUser(User.builder().email(email).password(password).build());
        return new ResponseEntity<>("Successfully Registered", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String,String> body){
        String email=body.get("email");
        String password=body.get("password");

        var userOptional=userRepository.findByEmail(email);
        if(userOptional.isEmpty()){
            return new ResponseEntity<>("User Not Registered", HttpStatus.UNAUTHORIZED);
        }
        User user=userOptional.get();
        if(!passwordEncoder.matches(password,user.getPassword())){
            return new ResponseEntity<>("Invalid User", HttpStatus.UNAUTHORIZED);
        }
        String token = jwtUtil.generateToken(email);
        return ResponseEntity.ok(Map.of("token",token));

    }
}
