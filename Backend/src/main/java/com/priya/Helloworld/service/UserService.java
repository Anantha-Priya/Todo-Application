package com.priya.Helloworld.service;

import com.priya.Helloworld.models.User;
import com.priya.Helloworld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    //Insert Element
    public User createUser(User user) {
        return userRepository.save(user);
    }

    //Retrieve specific id
    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not Found"));
    }


}