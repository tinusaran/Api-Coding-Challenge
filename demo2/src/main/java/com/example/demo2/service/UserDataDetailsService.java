package com.example.demo2.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo2.model.UserData;
import com.example.demo2.repo.UserDataRepository;

@Service
public class UserDataDetailsService implements UserDetailsService {

    @Autowired
    private UserDataRepository repo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserData user = repo.findByName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        return new UserDataDetails(user);
    }
}

