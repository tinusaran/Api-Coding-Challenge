package com.example.demo2.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo2.config.JwtService;
import com.example.demo2.model.AuthRequest;
import com.example.demo2.model.UserData;
import com.example.demo2.repo.UserDataRepository;
import com.example.demo2.service.UserDataDetailsService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserDataRepository repo;

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private UserDataDetailsService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public String register(@RequestBody UserData user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repo.save(user);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public String login(@RequestBody AuthRequest authRequest) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword()));
        UserDetails user = userService.loadUserByUsername(authRequest.getUsername());
        return jwtService.generateToken(user.getUsername());
    }
    @GetMapping("/welcome")
public String welcome() {
    return "Welcome! No auth needed.";
}

}

